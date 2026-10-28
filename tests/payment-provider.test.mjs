import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  BlinkPaymentProvider,
  createPaymentProvider,
  DemoPaymentProvider,
  PaymentProvider,
  verifyPaymentPreimage,
} from '../payments/payment-provider.mjs';

test('default provider is demo and never calls an external payment service', async () => {
  const provider = createPaymentProvider({});
  assert.ok(provider instanceof DemoPaymentProvider);
  assert.deepEqual({ mode: provider.mode, simulated: provider.simulated }, { mode: 'demo', simulated: true });
  const invoice = await provider.createFundingInvoice({ amountSats: 1200 });
  assert.match(invoice.paymentRequest, /^beca-demo:invoice:/);
  const paid = await provider.checkFundingInvoice(invoice.paymentRequest);
  assert.equal(paid.status, 'PAID');
  assert.equal(paid.simulated, true);
  assert.equal(verifyPaymentPreimage(paid), true);
});

test('demo payout and sponsor refund keep exact sats and are explicitly simulated', async () => {
  const provider = new DemoPaymentProvider({ idFactory: () => 'test-id' });
  const payout = await provider.payStudentInvoice({ amountSats: 3750, paymentRequest: 'beca-demo:student:wallet' });
  const refund = await provider.refundSponsor({ amountSats: 2250, sponsorId: 'sponsor-1', paymentRequest: 'beca-demo:sponsor:wallet' });
  assert.equal(payout.amountSats, 3750);
  assert.equal(refund.amountSats, 2250);
  assert.equal(payout.simulated, true);
  assert.equal(refund.simulated, true);
  assert.equal(verifyPaymentPreimage(payout), true);
  assert.equal(verifyPaymentPreimage(refund), true);
});

test('demo provider rejects real Lightning invoices so demo cannot accidentally pay', async () => {
  const provider = new DemoPaymentProvider();
  await assert.rejects(provider.payStudentInvoice({ amountSats: 500, paymentRequest: 'lnbc500n1realinvoice' }), /nunca una factura Lightning real/);
  await assert.rejects(provider.refundSponsor({ amountSats: 500, sponsorId: 's1', paymentRequest: 'lnbc500n1realinvoice' }), /destino de devolución de prueba/);
  await assert.rejects(provider.createFundingInvoice({ amountSats: 0 }), /satoshis enteros/);
});

test('provider factory enables Blink only with a server-side API key and fails closed for unimplemented NWC', () => {
  assert.throws(() => new PaymentProvider({ mode: 'demo', simulated: true }), /interfaz/);
  const provider = createPaymentProvider({ BLINK_API_KEY: 'test-secret' }, { fetchImpl: async () => { throw new Error('not called'); } });
  assert.ok(provider instanceof BlinkPaymentProvider);
  assert.equal(provider.simulated, false);
  assert.throws(() => createPaymentProvider({ NWC_URL: 'nostr+walletconnect://test' }), /NWC_URL está presente/);
});

test('Blink funding invoice uses authenticated server-side GraphQL and preserves the requested sats', async () => {
  const requests = [];
  const fetchImpl = async (_url, options) => {
    requests.push(options);
    const { query } = JSON.parse(options.body);
    if (query.includes('BecaModularWallet')) return { ok: true, json: async () => ({ data: { me: { defaultAccount: { wallets: [{ id: 'wallet-btc', walletCurrency: 'BTC' }] } } } }) };
    return { ok: true, json: async () => ({ data: { lnInvoiceCreate: { invoice: { paymentRequest: 'lnbc12nfixture', paymentHash: 'a'.repeat(64), satoshis: 1200, paymentStatus: 'PENDING' }, errors: [] } } }) };
  };
  const provider = new BlinkPaymentProvider({ apiKey: 'server-only-secret', fetchImpl });
  const invoice = await provider.createFundingInvoice({ amountSats: 1200, memo: 'Módulo de prueba' });
  assert.equal(invoice.provider, 'lightning');
  assert.equal(invoice.simulated, false);
  assert.equal(invoice.amountSats, 1200);
  assert.equal(invoice.paymentRequest, 'lnbc12nfixture');
  assert.equal(requests.length, 2);
  assert.ok(requests.every(request => request.headers['X-API-KEY'] === 'server-only-secret'));
  assert.deepEqual(JSON.parse(requests[1].body).variables.input, { amount: 1200, walletId: 'wallet-btc', memo: 'Módulo de prueba' });
});

test('preimage verifier rejects malformed and mismatched proofs', () => {
  assert.equal(verifyPaymentPreimage({ preimage: 'a'.repeat(64), paymentHash: 'b'.repeat(64) }), false);
  assert.equal(verifyPaymentPreimage({ preimage: 'not-hex', paymentHash: 'b'.repeat(64) }), false);
});

test('Blink rejects a paid response whose preimage does not match its payment hash', async () => {
  const preimage = 'c'.repeat(64);
  const paymentHash = createHash('sha256').update(Buffer.from(preimage, 'hex')).digest('hex');
  const provider = new BlinkPaymentProvider({
    apiKey: 'server-only-secret',
    fetchImpl: async () => ({ ok: true, json: async () => ({ data: { lnInvoicePaymentStatusByPaymentRequest: {
      paymentRequest: 'lnbcfixture', status: 'PAID', paymentPreimage: preimage, paymentHash,
    } } }) }),
  });
  assert.equal((await provider.checkFundingInvoice('lnbcfixture')).status, 'PAID');
  provider.fetchImpl = async () => ({ ok: true, json: async () => ({ data: { lnInvoicePaymentStatusByPaymentRequest: {
    paymentRequest: 'lnbcfixture', status: 'PAID', paymentPreimage: preimage, paymentHash: 'd'.repeat(64),
  } } }) });
  await assert.rejects(provider.checkFundingInvoice('lnbcfixture'), /no verifica contra el payment hash/);
});
