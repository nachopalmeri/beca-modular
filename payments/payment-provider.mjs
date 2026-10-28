import { createHash, randomBytes } from 'node:crypto';

const DEMO_PREFIX = 'beca-demo:';
const BLINK_ENDPOINT = 'https://api.blink.sv/graphql';

function assertSats(amountSats) {
  if (!Number.isSafeInteger(amountSats) || amountSats <= 0) {
    throw new Error('El importe debe ser una cantidad positiva de satoshis enteros.');
  }
}

function demoProof() {
  const preimage = randomBytes(32).toString('hex');
  const paymentHash = createHash('sha256').update(Buffer.from(preimage, 'hex')).digest('hex');
  return { preimage, paymentHash };
}

export class PaymentProvider {
  constructor({ mode, simulated }) {
    if (new.target === PaymentProvider) throw new TypeError('PaymentProvider es una interfaz.');
    this.mode = mode;
    this.simulated = simulated;
  }

  async createFundingInvoice() { throw new Error('createFundingInvoice debe implementarse.'); }
  async checkFundingInvoice() { throw new Error('checkFundingInvoice debe implementarse.'); }
  async payStudentInvoice() { throw new Error('payStudentInvoice debe implementarse.'); }
  async refundSponsor() { throw new Error('refundSponsor debe implementarse.'); }
}

export class DemoPaymentProvider extends PaymentProvider {
  constructor({ idFactory = () => randomBytes(12).toString('hex') } = {}) {
    super({ mode: 'demo', simulated: true });
    this.idFactory = idFactory;
    this.invoices = new Map();
  }

  async createFundingInvoice({ amountSats, memo = 'Beca Modular · aporte de prueba' } = {}) {
    assertSats(amountSats);
    const id = this.idFactory();
    const paymentRequest = `${DEMO_PREFIX}invoice:${id}`;
    this.invoices.set(paymentRequest, { amountSats, memo, status: 'PENDING' });
    return { provider: 'demo', simulated: true, status: 'PENDING', id, amountSats, memo, paymentRequest };
  }

  async checkFundingInvoice(paymentRequest) {
    const invoice = this.invoices.get(paymentRequest);
    if (!invoice) throw new Error('Factura de demostración desconocida.');
    if (invoice.status === 'PENDING') {
      invoice.status = 'PAID';
      Object.assign(invoice, demoProof());
    }
    return { provider: 'demo', simulated: true, ...invoice };
  }

  async payStudentInvoice({ amountSats, paymentRequest = `${DEMO_PREFIX}student:${this.idFactory()}`, memo = 'Beca Modular · hito de prueba' } = {}) {
    assertSats(amountSats);
    if (typeof paymentRequest !== 'string' || !paymentRequest.startsWith(`${DEMO_PREFIX}student:`)) {
      throw new Error('En modo demo usá una factura estudiantil de prueba, nunca una factura Lightning real.');
    }
    return { provider: 'demo', simulated: true, status: 'PAID', amountSats, paymentRequest, memo, ...demoProof() };
  }

  async refundSponsor({ amountSats, sponsorId, paymentRequest = `${DEMO_PREFIX}sponsor:${this.idFactory()}` } = {}) {
    assertSats(amountSats);
    if (typeof sponsorId !== 'string' || !sponsorId.trim()) throw new Error('Falta identificar al sponsor de prueba.');
    if (typeof paymentRequest !== 'string' || !paymentRequest.startsWith(`${DEMO_PREFIX}sponsor:`)) {
      throw new Error('En modo demo usá un destino de devolución de prueba.');
    }
    return { provider: 'demo', simulated: true, status: 'PAID', amountSats, sponsorId, paymentRequest, ...demoProof() };
  }
}

export class BlinkPaymentProvider extends PaymentProvider {
  constructor({ apiKey, endpoint = BLINK_ENDPOINT, fetchImpl = fetch } = {}) {
    if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('BLINK_API_KEY no está configurada.');
    super({ mode: 'lightning', simulated: false });
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.fetchImpl = fetchImpl;
    this.walletIdPromise = null;
  }

  async graphql(query, variables = {}) {
    const response = await this.fetchImpl(this.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'X-API-KEY': this.apiKey },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) throw new Error(`Blink API respondió HTTP ${response.status}.`);
    const payload = await response.json();
    if (payload.errors?.length) throw new Error(`Blink API: ${payload.errors.map(error => error.message).join('; ')}`);
    return payload.data;
  }

  async btcWalletId() {
    if (!this.walletIdPromise) {
      this.walletIdPromise = this.graphql(`query BecaModularWallet {
        me { defaultAccount { wallets { id walletCurrency } } }
      }`).then(data => {
        const wallet = data?.me?.defaultAccount?.wallets?.find(item => item.walletCurrency === 'BTC');
        if (!wallet?.id) throw new Error('Blink no devolvió una wallet BTC disponible.');
        return wallet.id;
      });
    }
    return this.walletIdPromise;
  }

  async createFundingInvoice({ amountSats, memo = 'Beca Modular · aporte' } = {}) {
    assertSats(amountSats);
    const walletId = await this.btcWalletId();
    const data = await this.graphql(`mutation BecaModularCreateInvoice($input: LnInvoiceCreateInput!) {
      lnInvoiceCreate(input: $input) {
        invoice { paymentRequest paymentHash satoshis paymentStatus }
        errors { message }
      }
    }`, { input: { amount: amountSats, walletId, memo } });
    const result = data?.lnInvoiceCreate;
    if (result?.errors?.length) throw new Error(`Blink no pudo crear la factura: ${result.errors.map(error => error.message).join('; ')}`);
    if (!result?.invoice?.paymentRequest || result.invoice.satoshis !== amountSats) {
      throw new Error('Blink devolvió una factura incompleta o por un importe distinto.');
    }
    return { provider: 'lightning', simulated: false, status: result.invoice.paymentStatus, amountSats: result.invoice.satoshis, paymentRequest: result.invoice.paymentRequest, paymentHash: result.invoice.paymentHash };
  }

  async checkFundingInvoice(paymentRequest) {
    if (typeof paymentRequest !== 'string' || !paymentRequest.startsWith('ln')) throw new Error('Factura Lightning inválida.');
    const data = await this.graphql(`query BecaModularInvoiceStatus($input: LnInvoicePaymentStatusByPaymentRequestInput!) {
      lnInvoicePaymentStatusByPaymentRequest(input: $input) { paymentHash paymentPreimage paymentRequest status }
    }`, { input: { paymentRequest } });
    const result = data?.lnInvoicePaymentStatusByPaymentRequest;
    if (!result?.status) throw new Error('Blink no devolvió el estado de la factura.');
    if (result.status === 'PAID' && !verifyPaymentPreimage({ preimage: result.paymentPreimage, paymentHash: result.paymentHash })) {
      throw new Error('Blink marcó la factura pagada, pero el preimage no verifica contra el payment hash.');
    }
    return { provider: 'lightning', simulated: false, ...result };
  }

  async payStudentInvoice({ paymentRequest, amountSats, memo = 'Beca Modular · hito aprobado' } = {}) {
    assertSats(amountSats);
    if (typeof paymentRequest !== 'string' || !paymentRequest.startsWith('ln')) throw new Error('Pegá una factura Lightning BOLT11 del estudiante.');
    const walletId = await this.btcWalletId();
    const data = await this.graphql(`mutation BecaModularPayInvoice($input: LnInvoicePaymentInput!) {
      lnInvoicePaymentSend(input: $input) { status errors { message code } }
    }`, { input: { paymentRequest, walletId, memo } });
    const result = data?.lnInvoicePaymentSend;
    if (result?.errors?.length || result?.status !== 'SUCCESS') {
      throw new Error(`Blink no confirmó el pago: ${(result?.errors ?? []).map(error => error.message).join('; ') || result?.status || 'respuesta vacía'}`);
    }
    const receipt = await this.checkFundingInvoice(paymentRequest);
    if (receipt.status !== 'PAID' || !receipt.paymentPreimage) throw new Error('Blink no confirmó el pago con preimage.');
    return { ...receipt, amountSats, memo };
  }

  async refundSponsor({ paymentRequest, amountSats, memo = 'Beca Modular · devolución de saldo' } = {}) {
    return this.payStudentInvoice({ paymentRequest, amountSats, memo });
  }
}

export function createPaymentProvider(env = process.env, options = {}) {
  if (env.BLINK_API_KEY) return new BlinkPaymentProvider({ apiKey: env.BLINK_API_KEY, ...options });
  // Do not enable a Lightning path that has no implemented/verified transport.
  if (env.NWC_URL) throw new Error('NWC_URL está presente, pero el transporte NWC aún no está implementado; usá demo o Blink.');
  return new DemoPaymentProvider(options);
}

export function verifyPaymentPreimage({ preimage, paymentHash } = {}) {
  if (typeof preimage !== 'string' || !/^[a-f0-9]{64}$/i.test(preimage) || typeof paymentHash !== 'string' || !/^[a-f0-9]{64}$/i.test(paymentHash)) return false;
  const calculated = createHash('sha256').update(Buffer.from(preimage, 'hex')).digest('hex');
  return calculated === paymentHash.toLowerCase();
}
