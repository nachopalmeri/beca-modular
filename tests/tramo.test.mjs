import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SNAPSHOT, brechaProgresar, arsToSats, createProgram, contribute, approveMilestone,
  setStudentStatus, closeProgram, ledger, refundShares,
} from '../tramo-model.mjs';
import { paymentHashFromInvoice, verifyReceipt, sha256Hex, randomPreimage } from '../tramo-verify.mjs';

// Ejemplo oficial de la especificación BOLT11 (payment hash 0001020304…0102).
const BOLT11_SPEC = 'lnbc1pvjluezsp5zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zygspp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq9qrsgq357wnc5r2ueh7ck6q93dj32dlqnls087fxdwk8qakdyafkq3yap9us6v52vjjsrvywa6rt52cm9r9zqt8r2t7mlcwspyetp5h2tztugp9lfyql';

const rate = SNAPSHOT.cotizacion.arsPorBtc;
const program = (estudiantes = 2) => createProgram({ estudiantes, arsPorBtc: rate, hitos: [{ label: 'Primer parcial', montoArs: 25330 }, { label: 'Materia aprobada', montoArs: 25330 }] });

test('brecha de Progresar con el IPC del snapshot: 42% de pérdida real', () => {
  const b = brechaProgresar(SNAPSHOT.progresar.monto, SNAPSHOT.ipc.base.valor, SNAPSHOT.ipc.ultimo.valor);
  assert.equal(b.ajustado, 60330);
  assert.equal(b.brecha, 25330);
  assert.equal(Math.round(b.perdidaReal * 1000) / 10, 42);
});

test('conversión ARS → sats entera', () => {
  assert.equal(arsToSats(1000, rate), 763);
  assert.throws(() => arsToSats(0, rate));
});

test('la meta se fija al crear: estudiantes × hitos en sats', () => {
  const p = program(3);
  assert.equal(p.goal, p.hitos[0].sats * 2 * 3);
  assert.equal(p.status, 'funding');
});

test('no se aceptan aportes que excedan la meta ni pagos antes de fondear', () => {
  let p = program(1);
  assert.throws(() => contribute(p, { sats: p.goal + 1 }), /supera/);
  p = contribute(p, { alias: 'Ana', sats: 10 });
  assert.throws(() => approveMilestone(p, 'E1'), /fondeado/);
});

test('flujo completo: fondeo compartido, hitos, revisión, baja y devolución exacta', () => {
  let p = program(2);
  const a = Math.floor(p.goal * 0.6);
  p = contribute(p, { alias: 'Egresados', sats: a });
  p = contribute(p, { alias: 'Bitcoiners', sats: p.goal - a });
  assert.equal(p.status, 'active');
  p = approveMilestone(p, 'E1', { preimage: 'x', paymentHash: 'y' });
  p = approveMilestone(p, 'E2');
  p = setStudentStatus(p, 'E2', 'revision');
  assert.throws(() => approveMilestone(p, 'E2'), /revisión/);
  assert.throws(() => setStudentStatus(program(1), 'E1', 'baja'), /revisión previa/);
  p = setStudentStatus(p, 'E2', 'baja');
  p = approveMilestone(p, 'E1');
  assert.equal(p.status, 'completed');
  p = closeProgram(p);
  const l = ledger(p);
  assert.ok(l.balanced);
  assert.equal(l.reserved, 0);
  assert.equal(l.refunded, p.hitos[1].sats); // sólo el segundo hito de E2 no se pagó
  assert.equal(p.refunds.reduce((s, r) => s + r.sats, 0), p.funded - p.paid);
});

test('campaña sin completar: devolución íntegra', () => {
  let p = program(1);
  p = contribute(p, { sats: 7 });
  p = contribute(p, { sats: 3 });
  p = closeProgram(p);
  assert.deepEqual(p.refunds.map(r => r.sats), [7, 3]);
});

test('mayor resto: el redondeo no pierde ni crea sats', () => {
  const r = refundShares([{ id: 'a', sats: 1 }, { id: 'b', sats: 1 }, { id: 'c', sats: 1 }], 10);
  assert.equal(r.reduce((s, x) => s + x.sats, 0), 10);
  assert.deepEqual(r.map(x => x.sats), [4, 3, 3]);
});

test('BOLT11: extrae el payment hash del ejemplo oficial de la especificación', () => {
  const { paymentHash } = paymentHashFromInvoice(BOLT11_SPEC);
  assert.equal(paymentHash, '0001020304050607080900010203040506070809000102030405060708090102');
  assert.throws(() => paymentHashFromInvoice(BOLT11_SPEC.slice(0, -1) + 'q'), /checksum/);
});

test('verificación de recibo: SHA-256(preimage) = payment hash', async () => {
  const pre = randomPreimage();
  const hash = await sha256Hex(pre);
  assert.equal((await verifyReceipt(pre, hash)).ok, true);
  assert.equal((await verifyReceipt(randomPreimage(), hash)).ok, false);
  // Vector conocido: SHA-256 de 32 bytes en cero.
  assert.equal(await sha256Hex('0'.repeat(64)), '66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925');
});
