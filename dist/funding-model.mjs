// Local demo ledger only. No payment, wallet, institution or contract is connected.
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

const progressKinds = new Set(['content-consumed', 'student-reported', 'institution-test']);

export function initialFundingDemo({
  target = 10000,
  milestones = [5000, 5000],
  milestoneTitles = ['Primer examen aprobado', 'Materia aprobada'],
  moduleName = 'Introducción al álgebra',
} = {}) {
  if (!Number.isSafeInteger(target) || target <= 0 || !Array.isArray(milestones) || milestones.length === 0 ||
      !milestones.every(amount => Number.isSafeInteger(amount) && amount > 0) ||
      milestones.reduce((sum, amount) => sum + amount, 0) !== target ||
      !Array.isArray(milestoneTitles) || milestoneTitles.length !== milestones.length ||
      !milestoneTitles.every(title => typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 80) ||
      typeof moduleName !== 'string' || !moduleName.trim() || moduleName.trim().length > 80) {
    throw new Error('El presupuesto debe coincidir con la suma de los hitos y cada regla debe ser válida.');
  }
  return freeze({
    target,
    milestones: [...milestones],
    milestoneTitles: milestoneTitles.map(title => title.trim()),
    moduleName: moduleName.trim(),
    contributions: [],
    funded: 0,
    paid: 0,
    nextMilestone: 0,
    status: 'funding',
    refunds: [],
    events: [],
  });
}

export function dollarsToCents(value) {
  const s = String(value).trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(s)) throw new Error('Ingresá un importe con hasta dos decimales.');
  const [whole, fraction = ''] = s.split('.');
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(amount)) throw new Error('Importe inválido.');
  return amount;
}

export function contribute(state, amount) {
  if (state.status !== 'funding') throw new Error('La campaña ya no recibe aportes.');
  if (!Number.isSafeInteger(amount) || amount <= 0 || (amount < 100 && amount !== state.target - state.funded)) {
    throw new Error('El aporte mínimo de ejemplo es 1 USD.');
  }
  if (amount > state.target - state.funded) throw new Error('El aporte supera lo que falta para completar la materia.');
  const funded = state.funded + amount;
  return freeze({
    ...state,
    funded,
    status: funded === state.target ? 'active' : 'funding',
    contributions: [...state.contributions, { id: 'Aportante ' + (state.contributions.length + 1), amount }],
  });
}

export function recordProgress(state, { receiptId, kind } = {}) {
  if (state.status !== 'active') throw new Error('La beca debe estar financiada, activa y sin revisión pendiente.');
  if (typeof receiptId !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(receiptId) || !progressKinds.has(kind)) {
    throw new Error('El registro de avance o constancia es inválido.');
  }
  if (state.events.some(event => event.receiptId === receiptId)) throw new Error('Comprobante repetido: ya fue usado y el saldo no cambió.');

  const milestone = kind === 'institution-test' ? state.nextMilestone : null;
  if (milestone !== null && milestone >= state.milestones.length) throw new Error('Todos los hitos ya fueron liberados.');
  const amount = milestone === null ? 0 : state.milestones[milestone];
  const paid = state.paid + amount;
  if (paid > state.target || paid > state.funded) throw new Error('La liberación supera el presupuesto disponible.');
  const event = {
    receiptId,
    kind,
    moduleName: state.moduleName,
    beneficiaryId: 'alumno-demo-01',
    milestone: milestone === null ? null : milestone + 1,
    amount,
    paidAfter: paid,
    reservedAfter: state.funded - paid,
    recorded: true,
  };
  const nextMilestone = state.nextMilestone + (milestone === null ? 0 : 1);
  return freeze({
    ...state,
    paid,
    nextMilestone,
    status: milestone !== null && nextMilestone === state.milestones.length ? 'completed' : 'active',
    events: [...state.events, event],
  });
}

export function requestReview(state) {
  if (state.status !== 'active') throw new Error('Sólo una beca activa admite esta revisión.');
  return freeze({ ...state, status: 'review' });
}

export function resumeFunding(state) {
  if (state.status !== 'review') throw new Error('No hay una revisión pendiente.');
  return freeze({ ...state, status: 'active' });
}

function refundsFor(state) {
  const remaining = state.funded - state.paid;
  if (!state.funded) return [];
  const rows = state.contributions.map((c, index) => {
    const numerator = BigInt(c.amount) * BigInt(remaining);
    const denominator = BigInt(state.funded);
    return { id: c.id, amount: c.amount, refund: Number(numerator / denominator), remainder: numerator % denominator, index };
  });
  let cents = remaining - rows.reduce((sum, c) => sum + c.refund, 0);
  const ordered = [...rows].sort((a, b) => a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1);
  for (let i = 0; i < cents; i++) ordered[i].refund++;
  return rows.map(({ id, amount, refund }) => ({ id, amount, refund }));
}

export function confirmAbandonment(state) {
  if (state.status !== 'review') throw new Error('La confirmación requiere revisión previa; no hay abandono automático.');
  return freeze({ ...state, status: 'refunded', refunds: refundsFor(state) });
}

export function closeUnderfunded(state) {
  if (state.status !== 'funding' || !state.funded) throw new Error('Sólo se ilustra el cierre de una campaña con aportes y sin meta completa.');
  return freeze({ ...state, status: 'refunded', refunds: refundsFor(state) });
}

export function reservedFunds(state) {
  return state.status === 'refunded' ? 0 : state.funded - state.paid;
}
