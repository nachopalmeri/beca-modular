import { DemoPaymentProvider, verifyPaymentPreimage } from './payment-provider.mjs';

const root = document.querySelector('#lightning-flow');
if (root) {
  const provider = new DemoPaymentProvider();
  const $ = selector => root.querySelector(selector);
  const targetInput = $('#payment-target-sats');
  const milestoneInput = $('#payment-milestone-sats');
  const sponsorAddress = $('#payment-sponsor-address');
  const invoiceCard = $('#payment-invoice-card');
  const status = $('#payment-flow-status');
  const state = { targetSats: 0, milestoneSats: 0, fundedSats: 0, paidSats: 0, refundedSats: 0, invoice: null, sponsorId: 'sponsor-demo', receipt: null, approvedMilestones: 0, refunded: false };

  function notice(message, tone = 'info') {
    status.textContent = message;
    status.dataset.tone = tone;
  }

  function validateConfig() {
    const targetSats = Number(targetInput.value);
    const milestoneSats = Number(milestoneInput.value);
    if (!Number.isSafeInteger(targetSats) || targetSats < 2) throw new Error('El presupuesto de prueba debe ser al menos 2 sats enteros.');
    if (!Number.isSafeInteger(milestoneSats) || milestoneSats < 1 || milestoneSats > targetSats) throw new Error('El pago por hito debe ser un importe entero entre 1 y el presupuesto.');
    if (!sponsorAddress.value.trim()) throw new Error('Ingresá un destino ficticio para mostrar a quién volvería el saldo.');
    return { targetSats, milestoneSats };
  }

  function renderLedger() {
    $('#payment-funded-readout').textContent = `${state.fundedSats.toLocaleString('es-AR')} sats`;
    $('#payment-paid-readout').textContent = `${state.paidSats.toLocaleString('es-AR')} sats`;
    $('#payment-reserved-readout').textContent = `${(state.fundedSats - state.paidSats - state.refundedSats).toLocaleString('es-AR')} sats`;
    $('#payment-refunded-readout').textContent = `${state.refundedSats.toLocaleString('es-AR')} sats`;
    $('#payment-approve-milestone').disabled = state.fundedSats === 0 || state.paidSats + state.refundedSats >= state.fundedSats || state.refunded;
    $('#payment-refund-unused').disabled = state.fundedSats === 0 || state.refunded || state.fundedSats === state.paidSats;
  }

  async function showReceipt(receipt, title) {
    state.receipt = receipt;
    $('#payment-receipt').hidden = false;
    $('#payment-receipt-summary').textContent = `${receipt.amountSats.toLocaleString('es-AR')} sats de prueba por ${title}. Esto no fue una transferencia Lightning.`;
    $('#payment-hash').textContent = receipt.paymentHash;
    $('#payment-preimage').textContent = receipt.preimage;
    const valid = await verifyPaymentPreimage(receipt);
    $('#payment-proof-check').textContent = valid
      ? 'Preimage y hash coinciden criptográficamente. El recibo sigue siendo SIMULADO; no prueba un pago en la red Lightning.'
      : 'La prueba no coincide: no presentes este recibo.';
    $('#payment-proof-check').className = valid ? 'payment-proof-ok' : 'field-error';
  }

  $('#payment-create-invoice').addEventListener('click', async () => {
    try {
      Object.assign(state, validateConfig());
      state.invoice = await provider.createFundingInvoice({ amountSats: state.targetSats, memo: 'Aporte de demostración Beca Modular' });
      state.fundedSats = 0;
      state.paidSats = 0;
      state.refundedSats = 0;
      state.approvedMilestones = 0;
      state.refunded = false;
      state.receipt = null;
      $('#payment-receipt').hidden = true;
      $('#payment-invoice-text').textContent = state.invoice.paymentRequest;
      const qrHost = $('#payment-qr');
      qrHost.replaceChildren();
      if (typeof window.qrcode !== 'function') throw new Error('No se pudo cargar el generador local de QR.');
      const qr = window.qrcode(0, 'M');
      qr.addData(state.invoice.paymentRequest);
      qr.make();
      qrHost.innerHTML = qr.createSvgTag({ scalable: true, margin: 4 });
      invoiceCard.hidden = false;
      $('#payment-confirm-funding').disabled = false;
      renderLedger();
      notice(`Factura de DEMO creada por ${state.targetSats.toLocaleString('es-AR')} sats. No es cobrable.`, 'info');
    } catch (error) {
      notice(error.message, 'error');
    }
  });

  $('#payment-confirm-funding').addEventListener('click', async () => {
    if (!state.invoice) return;
    try {
      const result = await provider.checkFundingInvoice(state.invoice.paymentRequest);
      if (result.status !== 'PAID' || !result.simulated) throw new Error('El proveedor demo no confirmó el aporte simulado.');
      state.fundedSats = result.amountSats;
      $('#payment-confirm-funding').disabled = true;
      renderLedger();
      notice(`Aporte simulado confirmado: ${state.fundedSats.toLocaleString('es-AR')} sats. No hubo pago real.`, 'success');
    } catch (error) {
      notice(error.message, 'error');
    }
  });

  $('#payment-approve-milestone').addEventListener('click', async () => {
    try {
      const remaining = state.fundedSats - state.paidSats - state.refundedSats;
      const amountSats = Math.min(state.milestoneSats, remaining);
      if (amountSats <= 0) throw new Error('No queda saldo reservado para otro hito.');
      const receipt = await provider.payStudent({ amountSats, lightningAddress: 'student-demo@example.invalid', memo: `Hito ${state.approvedMilestones + 1} · autorización humana de prueba` });
      if (receipt.status !== 'PAID' || !receipt.simulated) throw new Error('El proveedor demo no confirmó el pago simulado.');
      state.paidSats += receipt.amountSats;
      state.approvedMilestones++;
      await showReceipt(receipt, `aprobar el hito ${state.approvedMilestones}`);
      renderLedger();
      notice(`Hito aprobado manualmente. Recibo SIMULADO por ${receipt.amountSats.toLocaleString('es-AR')} sats.`, 'success');
    } catch (error) {
      notice(error.message, 'error');
    }
  });

  $('#payment-refund-unused').addEventListener('click', async () => {
    try {
      const amountSats = state.fundedSats - state.paidSats - state.refundedSats;
      if (amountSats <= 0) throw new Error('No queda saldo para devolver.');
      const refund = await provider.refundSponsor({ amountSats, sponsorId: state.sponsorId, lightningAddress: sponsorAddress.value.trim() });
      if (!refund.simulated || refund.amountSats !== amountSats) throw new Error('La devolución no coincide con el saldo reservado.');
      state.refundedSats += refund.amountSats;
      state.refunded = true;
      await showReceipt(refund, `devolver el saldo no usado a ${sponsorAddress.value.trim()}`);
      renderLedger();
      notice(`Devolución exacta simulada: ${refund.amountSats.toLocaleString('es-AR')} sats al destino ficticio del sponsor.`, 'success');
    } catch (error) {
      notice(error.message, 'error');
    }
  });

  renderLedger();
}
