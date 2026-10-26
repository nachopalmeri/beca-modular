// Tramo: modelo contable del simulador. Puro y sin red: no conecta wallets ni mueve fondos.
// Unidades: sats enteros. Las devoluciones usan el método de mayor resto (como funding-model.mjs).

export const SNAPSHOT = Object.freeze({
  progresar: Object.freeze({ monto: 35000, vigenteDesde: '2024-09', norma: 'Resolución 172/2026' }),
  ipc: Object.freeze({
    serie: '148.3_INIVELNAL_DICI_M_26',
    base: Object.freeze({ periodo: '2024-09', valor: 7122.2421 }),
    ultimo: Object.freeze({ periodo: '2026-08', valor: 12276.766 }),
    consultado: '2026-10-26',
  }),
  cotizacion: Object.freeze({ arsPorBtc: 131059705.84, fuente: 'Yadio', consultado: '2026-10-26' }),
});

const SATS_POR_BTC = 100_000_000;

const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};

const assertPositiveInt = (n, message) => { if (!Number.isSafeInteger(n) || n <= 0) throw new Error(message); };

export function brechaProgresar(monto, ipcBase, ipcUltimo) {
  if (!(monto > 0 && ipcBase > 0 && ipcUltimo > 0)) throw new Error('Datos de IPC o monto inválidos.');
  const ratio = ipcUltimo / ipcBase;
  const ajustado = Math.round(monto * ratio);
  return { ratio, ajustado, brecha: ajustado - monto, perdidaReal: 1 - 1 / ratio };
}

export function arsToSats(ars, arsPorBtc) {
  if (!(ars > 0 && arsPorBtc > 0)) throw new Error('Monto o cotización inválidos.');
  return Math.max(1, Math.round((ars * SATS_POR_BTC) / arsPorBtc));
}

export function satsToArs(sats, arsPorBtc) { return Math.round((sats * arsPorBtc) / SATS_POR_BTC); }

// Las reglas se fijan al crear el programa: el equivalente en sats de cada hito queda congelado.
export function createProgram({ estudiantes, hitos, arsPorBtc }) {
  assertPositiveInt(estudiantes, 'Cantidad de estudiantes inválida.');
  if (estudiantes > 20) throw new Error('El simulador admite hasta 20 estudiantes.');
  if (!Array.isArray(hitos) || hitos.length < 1 || hitos.length > 4) throw new Error('Definí entre 1 y 4 hitos.');
  const reglas = hitos.map((h, i) => {
    if (!h.label || !String(h.label).trim()) throw new Error(`El hito ${i + 1} necesita un nombre.`);
    if (!(h.montoArs > 0)) throw new Error(`El hito ${i + 1} necesita un monto positivo.`);
    return { codigo: `H${i + 1}`, label: String(h.label).trim(), montoArs: Math.round(h.montoArs), sats: arsToSats(h.montoArs, arsPorBtc) };
  });
  const porEstudiante = reglas.reduce((s, h) => s + h.sats, 0);
  return freeze({
    status: 'funding',
    arsPorBtc,
    hitos: reglas,
    goal: porEstudiante * estudiantes,
    students: Array.from({ length: estudiantes }, (_, i) => ({ id: `E${i + 1}`, status: 'activo', cobrados: 0 })),
    contributions: [],
    payouts: [],
    refunds: [],
    funded: 0,
    paid: 0,
  });
}

export function contribute(state, { alias, sats }) {
  if (state.status !== 'funding') throw new Error('El programa ya no recibe aportes.');
  assertPositiveInt(sats, 'El aporte debe ser un número entero de sats mayor a cero.');
  const falta = state.goal - state.funded;
  if (sats > falta) throw new Error(`El aporte supera lo que falta (${falta} sats).`);
  const funded = state.funded + sats;
  const id = `A${state.contributions.length + 1}`;
  return freeze({
    ...state,
    funded,
    status: funded === state.goal ? 'active' : 'funding',
    contributions: [...state.contributions, { id, alias: (alias || '').trim() || `Aportante ${state.contributions.length + 1}`, sats }],
  });
}

// receipt = { preimage, paymentHash } (hex). En el producto lo devuelve la red Lightning.
export function approveMilestone(state, studentId, receipt = null) {
  if (state.status !== 'active') throw new Error('El programa debe estar fondeado por completo y activo.');
  const student = state.students.find(s => s.id === studentId);
  if (!student) throw new Error('Estudiante inexistente.');
  if (student.status !== 'activo') throw new Error('Este estudiante está en revisión o de baja: no se liberan tramos.');
  if (student.cobrados >= state.hitos.length) throw new Error('Este estudiante ya cobró todos sus hitos.');
  const hito = state.hitos[student.cobrados];
  const payout = { id: `P${state.payouts.length + 1}`, studentId, hito: hito.codigo, label: hito.label, sats: hito.sats, ...(receipt || {}) };
  const students = state.students.map(s => (s.id === studentId ? { ...s, cobrados: s.cobrados + 1 } : s));
  const paid = state.paid + hito.sats;
  const allDone = students.every(s => s.status === 'baja' || s.cobrados === state.hitos.length);
  return freeze({ ...state, students, paid, payouts: [...state.payouts, payout], status: allDone ? 'completed' : 'active' });
}

// Revisión pausa nuevos tramos; no devuelve nada por sí sola.
export function setStudentStatus(state, studentId, status) {
  if (!['activo', 'revision', 'baja'].includes(status)) throw new Error('Estado inválido.');
  const student = state.students.find(s => s.id === studentId);
  if (!student) throw new Error('Estudiante inexistente.');
  if (student.status === 'baja') throw new Error('La baja confirmada es definitiva.');
  if (status === 'baja' && student.status !== 'revision') throw new Error('La baja requiere una revisión previa: no hay abandono automático.');
  const students = state.students.map(s => (s.id === studentId ? { ...s, status } : s));
  return freeze({ ...state, students });
}

export function refundShares(contributions, remaining) {
  const total = contributions.reduce((s, c) => s + c.sats, 0);
  if (!total || remaining <= 0) return contributions.map(c => ({ id: c.id, alias: c.alias, sats: 0 }));
  const rows = contributions.map((c, index) => {
    const num = BigInt(c.sats) * BigInt(remaining), den = BigInt(total);
    return { id: c.id, alias: c.alias, sats: Number(num / den), rem: num % den, index };
  });
  let left = remaining - rows.reduce((s, r) => s + r.sats, 0);
  const ordered = [...rows].sort((a, b) => (a.rem === b.rem ? a.index - b.index : a.rem > b.rem ? -1 : 1));
  for (let i = 0; i < left; i++) ordered[i].sats++;
  return rows.map(({ id, alias, sats }) => ({ id, alias, sats }));
}

// Cierre: lo no pagado vuelve a cada aportante en proporción. Lo cobrado queda con cada estudiante.
export function closeProgram(state) {
  if (state.status === 'closed') throw new Error('El programa ya está cerrado.');
  const remaining = state.funded - state.paid;
  return freeze({ ...state, status: 'closed', refunds: refundShares(state.contributions, remaining) });
}

export function ledger(state) {
  const refunded = state.refunds.reduce((s, r) => s + r.sats, 0);
  const reserved = state.funded - state.paid - refunded;
  return { funded: state.funded, paid: state.paid, refunded, reserved, balanced: state.funded === state.paid + refunded + reserved && reserved >= 0 };
}
