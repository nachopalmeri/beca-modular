const DEMO_PREFIX = 'beca-demo:';
const BLINK_ENDPOINT = 'https://api.blink.sv/graphql';

function cryptoApi() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) throw new Error('Este entorno no ofrece Web Crypto para generar el comprobante de prueba.');
  return globalThis.crypto;
}

function randomHex(bytes = 12) {
  const value = cryptoApi().getRandomValues(new Uint8Array(bytes));
  return [...value].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function assertSats(amountSats) {
  if (!Number.isSafeInteger(amountSats) || amountSats <= 0) {
    throw new Error('El importe debe ser una cantidad positiva de satoshis enteros.');
  }
}

async function demoProof() {
  const preimage = randomHex(32);
  const paymentHash = [...new Uint8Array(await cryptoApi().subtle.digest('SHA-256', hexBytes(preimage)))].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return { preimage, paymentHash };
}

function hexBytes(value) {
  return Uint8Array.from(value.match(/.{2}/g) ?? [], pair => Number.parseInt(pair, 16));
}

export class PaymentProvider {
  constructor({ mode, simulated }) {
    if (new.target === PaymentProvider) throw new TypeError('PaymentProvider es una interfaz.');
    this.mode = mode;
    this.simulated = simulated;
  }

  async createFundingInvoice() { throw new Error('createFundingInvoice debe implementarse.'); }
  async checkFundingInvoice() { throw new Error('checkFundingInvoice debe implementarse.'); }
  async payStudent() { throw new Error('payStudent debe implementarse.'); }
  async refundSponsor() { throw new Error('refundSponsor debe implementarse.'); }
}

export class DemoPaymentProvider extends PaymentProvider {
  constructor({ idFactory = () => randomHex(12) } = {}) {
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
      Object.assign(invoice, await demoProof());
    }
    return { provider: 'demo', simulated: true, ...invoice };
  }

  async payStudent({ amountSats, lightningAddress = 'student-demo@example.invalid', memo = 'Beca Modular · hito de prueba' } = {}) {
    assertSats(amountSats);
    if (typeof lightningAddress !== 'string' || !lightningAddress.includes('@')) throw new Error('Ingresá un destino Lightning de prueba.');
    const paymentRequest = `${DEMO_PREFIX}student:${this.idFactory()}`;
    return { provider: 'demo', simulated: true, status: 'PAID', amountSats, paymentRequest, memo, ...await demoProof() };
  }

  async refundSponsor({ amountSats, sponsorId, lightningAddress = 'sponsor-demo@example.invalid' } = {}) {
    assertSats(amountSats);
    if (typeof sponsorId !== 'string' || !sponsorId.trim()) throw new Error('Falta identificar al sponsor de prueba.');
    if (typeof lightningAddress !== 'string' || !lightningAddress.includes('@')) throw new Error('En modo demo usá un Lightning Address ficticio.');
    const paymentRequest = `${DEMO_PREFIX}sponsor:${this.idFactory()}`;
    return { provider: 'demo', simulated: true, status: 'PAID', amountSats, sponsorId, paymentRequest, ...await demoProof() };
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
    if (result.status === 'PAID' && !await verifyPaymentPreimage({ preimage: result.paymentPreimage, paymentHash: result.paymentHash })) {
      throw new Error('Blink marcó la factura pagada, pero el preimage no verifica contra el payment hash.');
    }
    return { provider: 'lightning', simulated: false, ...result };
  }

  async payStudent({ lightningAddress, amountSats, memo = 'Beca Modular · hito aprobado' } = {}) {
    assertSats(amountSats);
    if (typeof lightningAddress !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lightningAddress)) throw new Error('Ingresá un Lightning Address válido para el estudiante.');
    const walletId = await this.btcWalletId();
    return this.sendAddressPayment({ lightningAddress, amountSats, memo, walletId });
  }

  async sendAddressPayment({ lightningAddress, amountSats, memo, walletId }) {
    assertSats(amountSats);
    if (typeof lightningAddress !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lightningAddress)) throw new Error('Lightning Address inválida.');
    const data = await this.graphql(`mutation BecaModularAddressPayment($input: LnAddressPaymentSendInput!) {
      lnAddressPaymentSend(input: $input) {
        status
        errors { message code }
        transaction {
          id settlementAmount settlementCurrency status
          initiationVia { __typename ... on InitiationViaLn { paymentHash paymentRequest } }
          settlementVia { __typename ... on SettlementViaLn { preImage } }
        }
      }
    }`, { input: { amount: amountSats, lnAddress: lightningAddress, walletId } });
    const result = data?.lnAddressPaymentSend;
    if (result?.errors?.length || result?.status !== 'SUCCESS') {
      throw new Error(`Blink no confirmó el pago. Estado: ${result?.status || 'sin respuesta'}. Revisá el historial antes de reintentar; ${(result?.errors ?? []).map(error => error.message).join('; ')}`);
    }
    const tx = result.transaction;
    const receipt = {
      provider: 'lightning', simulated: false, status: 'PAID', amountSats,
      settledSats: Math.abs(Number(tx?.settlementAmount)), settlementCurrency: tx?.settlementCurrency,
      transactionId: tx?.id, paymentRequest: tx?.initiationVia?.paymentRequest,
      paymentHash: tx?.initiationVia?.paymentHash, preimage: tx?.settlementVia?.preImage, memo,
    };
    if (receipt.settlementCurrency !== 'BTC' || receipt.settledSats !== amountSats) {
      throw new Error(`Blink confirmó una liquidación por ${receipt.settledSats} sats en ${receipt.settlementCurrency}. No reintentes: conciliá el movimiento ${receipt.transactionId}.`);
    }
    if (!await verifyPaymentPreimage(receipt)) throw new Error(`Blink confirmó el movimiento ${receipt.transactionId}, pero falta una prueba preimage/hash válida. No reintentes; conciliá el movimiento.`);
    return receipt;
  }

  async refundSponsor({ amountSats, lightningAddress, memo = 'Beca Modular · devolución exacta de saldo' } = {}) {
    const walletId = await this.btcWalletId();
    return this.sendAddressPayment({ lightningAddress, amountSats, memo, walletId });
  }
}

export function createPaymentProvider(env = {}, options = {}) {
  if (env.BLINK_API_KEY) return new BlinkPaymentProvider({ apiKey: env.BLINK_API_KEY, ...options });
  // Do not enable a Lightning path that has no implemented/verified transport.
  if (env.NWC_URL) throw new Error('NWC_URL está presente, pero el transporte NWC aún no está implementado; usá demo o Blink.');
  return new DemoPaymentProvider(options);
}

export async function verifyPaymentPreimage({ preimage, paymentHash } = {}) {
  if (typeof preimage !== 'string' || !/^[a-f0-9]{64}$/i.test(preimage) || typeof paymentHash !== 'string' || !/^[a-f0-9]{64}$/i.test(paymentHash)) return false;
  const calculated = [...new Uint8Array(await cryptoApi().subtle.digest('SHA-256', hexBytes(preimage)))].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return calculated === paymentHash.toLowerCase();
}
