export const scenarios = {
  conservative: { sponsors: 3, students: 30, budget: 80, utilization: 40, subscription: 120, fee: 0, paymentRate: 1, infra: 1.2, ai: 0.4, support: 2.5, fixed: 3000 },
  base: { sponsors: 10, students: 80, budget: 120, utilization: 65, subscription: 250, fee: 0, paymentRate: 0.6, infra: 0.8, ai: 0.25, support: 1.5, fixed: 6000 },
  optimistic: { sponsors: 30, students: 150, budget: 160, utilization: 80, subscription: 1000, fee: 0, paymentRate: 0.4, infra: 0.6, ai: 0.15, support: 1, fixed: 12000 }
};
export function financial(input) {
  const a = {};
  for (const key of Object.keys(scenarios.base)) {
    const n = Number(input[key]);
    if (!Number.isFinite(n) || n < 0) throw new RangeError(`Invalid ${key}`);
    a[key] = n;
  }
  if (a.utilization > 100 || a.fee > 100 || a.paymentRate > 100) throw new RangeError('Invalid percentage');
  if (!Number.isInteger(a.sponsors) || !Number.isInteger(a.students)) throw new RangeError('Counts must be integers');
  const learners = a.sponsors * a.students;
  const allocated = learners * a.budget;
  const payouts = allocated * a.utilization / 100;
  const unused = allocated - payouts;
  const subscriptionRevenue = a.sponsors * a.subscription;
  const feeRevenue = payouts * a.fee / 100;
  const revenue = subscriptionRevenue + feeRevenue;
  const payment = payouts * a.paymentRate / 100;
  const infra = learners * a.infra, ai = learners * a.ai, support = learners * a.support;
  const cogs = payment + infra + ai + support;
  const contribution = revenue - cogs;
  const result = contribution - a.fixed;
  const perSponsor = a.subscription + a.students * a.budget * a.utilization / 100 * (a.fee - a.paymentRate) / 100 - a.students * (a.infra + a.ai + a.support);
  return { ...a, learners, allocated, payouts, unused, subscriptionRevenue, feeRevenue, revenue, payment, infraCost: infra, aiCost: ai, supportCost: support, cogs, contribution, result,
    margin: revenue ? contribution / revenue * 100 : null,
    breakEven: perSponsor > 0 ? Math.ceil(a.fixed / perSponsor) : null,
    totalSponsorOutlay: payouts + revenue,
    maxSponsorCommitment: allocated + revenue,
    additionalBudgetEquivalents: a.budget ? unused / a.budget : 0
  };
}
// Monetary session values use integer cents. No chain, signature or academic verification is simulated as real.
export function initialSession() { return { status: 'idle', cap: 1000, authorized: 0, settled: 0, returned: 0, units: [], paused: false }; }
export function transition(state, action) {
  const s = { ...state, units: [...state.units] };
  if (action.type === 'reset') return initialSession();
  if (action.type === 'open' && s.status === 'idle') { s.status = 'open'; return s; }
  if (action.type === 'pause' && s.status === 'open') { s.paused = !s.paused; return s; }
  if (action.type === 'consume') {
    if (s.status !== 'open' || s.paused) throw new Error('La sesión no está habilitada.');
    if (!Number.isInteger(action.price) || action.price <= 0) throw new Error('Importe inválido.');
    if (s.units.includes(action.id)) throw new Error('Unidad ya autorizada: no se cobra de nuevo.');
    if (s.authorized + action.price > s.cap) throw new Error('Rechazado: excede el límite autorizado.');
    s.authorized += action.price; s.units.push(action.id); return s;
  }
  if (action.type === 'close' && s.status === 'open') {
    s.status = 'closed'; s.settled = s.authorized; s.returned = s.cap - s.settled; return s;
  }
  throw new Error('Transición inválida.');
}
