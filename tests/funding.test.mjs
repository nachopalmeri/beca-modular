import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialFundingDemo,
  dollarsToCents,
  contribute,
  recordProgress,
  requestReview,
  resumeFunding,
  confirmAbandonment,
  closeUnderfunded,
  reservedFunds,
} from '../funding-model.mjs';

const funded = (options, amounts) => amounts.reduce((state, amount) => contribute(state, amount), initialFundingDemo(options));
const institutionReceipt = (state, receiptId) => recordProgress(state, { receiptId, kind: 'institution-test' });

test('a sponsor can set a synthetic budget and milestone rules that reconcile exactly', () => {
  const state = funded({ target: 12000, milestones: [3000, 9000], milestoneTitles: ['Avance 1', 'Cierre'], moduleName: 'Módulo de prueba' }, [12000]);
  const after = institutionReceipt(state, 'receipt-1');
  assert.equal(after.paid, 3000);
  assert.equal(reservedFunds(after), 9000);
  assert.equal(after.events[0].milestone, 1);
  assert.equal(state.moduleName, 'Módulo de prueba');
});

test('configuration rejects an invalid budget, non-positive tranche, or rules that exceed the cap', () => {
  for (const options of [
    { target: 0 },
    { target: 1000, milestones: [500, 499] },
    { target: 1000, milestones: [1001] },
    { target: 1000, milestones: [0, 1000] },
    { target: 1000, milestones: [500, 500], milestoneTitles: [''] },
    { target: 1000, milestones: [500, 500], moduleName: ' ' },
  ]) assert.throws(() => initialFundingDemo(options));
});

test('one sponsor can fund the whole budget and configured milestones release exactly the total', () => {
  let state = funded({ target: 10000, milestones: [2500, 7500] }, [10000]);
  assert.equal(state.status, 'active');
  state = institutionReceipt(state, 'receipt-1');
  assert.equal(state.paid, 2500);
  assert.equal(reservedFunds(state), 7500);
  state = institutionReceipt(state, 'receipt-2');
  assert.equal(state.paid, 10000);
  assert.equal(reservedFunds(state), 0);
  assert.equal(state.status, 'completed');
});

test('contributions start at one dollar and cannot exceed the remaining target', () => {
  let state = contribute(initialFundingDemo(), 100);
  assert.equal(state.funded, 100);
  assert.throws(() => contribute(state, 99), /mínimo/);
  assert.throws(() => contribute(state, 10000), /supera/);
  assert.equal(state.contributions.length, 1);
});

test('an underfunded module cannot record a progress event or release a tranche', () => {
  const state = contribute(initialFundingDemo(), 6000);
  assert.throws(() => recordProgress(state, { receiptId: 'receipt-1', kind: 'institution-test' }), /financiada/);
  assert.equal(state.paid, 0);
  assert.equal(state.events.length, 0);
});

test('content consumption and student-reported progress never release money or claim learning', () => {
  let state = funded(undefined, [10000]);
  state = recordProgress(state, { receiptId: 'content-1', kind: 'content-consumed' });
  state = recordProgress(state, { receiptId: 'report-1', kind: 'student-reported' });
  assert.equal(state.paid, 0);
  assert.equal(reservedFunds(state), 10000);
  assert.deepEqual(state.events.map(event => event.amount), [0, 0]);
});

test('repeating a receipt ID cannot release the same milestone twice', () => {
  const state = funded(undefined, [10000]);
  const after = institutionReceipt(state, 'same-receipt');
  assert.throws(() => institutionReceipt(after, 'same-receipt'), /repetido/);
  assert.equal(after.paid, 5000);
  assert.equal(reservedFunds(after), 5000);
  assert.equal(after.events.length, 1);
});

test('invalid receipt types, identifiers, and state transitions do not change the prior state', () => {
  const state = funded(undefined, [10000]);
  const before = JSON.stringify(state);
  for (const proof of [
    { receiptId: 'one', kind: 'unknown' },
    { receiptId: '', kind: 'institution-test' },
    { receiptId: 'has spaces', kind: 'institution-test' },
    { receiptId: 'one', kind: 'institution-test' },
  ]) {
    if (proof.receiptId === 'one' && proof.kind === 'institution-test') continue;
    assert.throws(() => recordProgress(state, proof));
    assert.equal(JSON.stringify(state), before);
  }
  const paused = requestReview(state);
  assert.throws(() => recordProgress(paused, { receiptId: 'paused', kind: 'institution-test' }), /activa/);
  assert.equal(paused.paid, 0);
});

test('60/40 contributors receive 30/20 of the remaining 50 after the student earned 50', () => {
  let state = funded(undefined, [6000, 4000]);
  state = institutionReceipt(state, 'receipt-1');
  state = confirmAbandonment(requestReview(state));
  assert.equal(state.paid, 5000);
  assert.deepEqual(state.refunds.map(row => row.refund), [3000, 2000]);
  assert.equal(reservedFunds(state), 0);
});

test('a confirmed exit before the first milestone returns every contribution', () => {
  let state = funded(undefined, [100, 9900]);
  state = confirmAbandonment(requestReview(state));
  assert.equal(state.paid, 0);
  assert.deepEqual(state.refunds.map(row => row.refund), [100, 9900]);
});

test('requesting review pauses releases without refunding or changing the balance', () => {
  let state = funded(undefined, [10000]);
  state = requestReview(state);
  assert.throws(() => institutionReceipt(state, 'paused'), /activa/);
  assert.equal(state.refunds.length, 0);
  assert.equal(reservedFunds(state), 10000);
  state = resumeFunding(state);
  assert.equal(institutionReceipt(state, 'after-review').paid, 5000);
});

test('abandonment cannot be inferred without review or applied after completion', () => {
  let state = funded(undefined, [10000]);
  assert.throws(() => confirmAbandonment(state), /revisión/);
  state = institutionReceipt(state, 'first');
  state = institutionReceipt(state, 'second');
  assert.throws(() => requestReview(state));
});

test('closing below budget returns all contributions and pays no student tranche', () => {
  let state = funded(undefined, [100, 2500]);
  state = closeUnderfunded(state);
  assert.equal(state.paid, 0);
  assert.deepEqual(state.refunds.map(row => row.refund), [100, 2500]);
  assert.equal(reservedFunds(state), 0);
});

test('proportional cent rounding never creates or loses funds', () => {
  let state = funded(undefined, [101, 101, 9798]);
  state = confirmAbandonment(requestReview(institutionReceipt(state, 'first')));
  assert.equal(state.refunds.reduce((sum, row) => sum + row.refund, 0) + state.paid, state.funded);
  assert.deepEqual(state.refunds.map(row => row.refund), [51, 50, 4899]);
});

test('invalid repeated transitions leave the immutable previous state unchanged', () => {
  const state = funded(undefined, [10000]);
  const before = JSON.stringify(state);
  assert.throws(() => contribute(state, 100));
  assert.equal(JSON.stringify(state), before);
  assert.ok(Object.isFrozen(state));
  assert.ok(Object.isFrozen(state.events));
});

test('decimal parsing keeps cents exact and rejects scientific notation and extra precision', () => {
  assert.equal(dollarsToCents('1.01'), 101);
  assert.equal(dollarsToCents('1,25'), 125);
  for (const value of ['1e2', '-1', '0.001', 'Infinity', 'abc']) assert.throws(() => dollarsToCents(value));
});

test('the exact final remainder may be below a dollar so fractional contributions cannot strand the budget', () => {
  let state = contribute(initialFundingDemo(), 9999);
  state = contribute(state, 1);
  assert.equal(state.status, 'active');
  assert.equal(state.funded, 10000);
});
