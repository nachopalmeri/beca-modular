import { DemoPaymentProvider, verifyPaymentPreimage } from './payment-provider.mjs';
import { demoImpactReport, demoPrevalidation, demoReceiptExplanation } from '../ai/fallback.mjs';

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
    $('#payment-impact-report').disabled = state.fundedSats === 0;
  }

  function toBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  }

  $('#ai-prevalidate-evidence').addEventListener('click', async event => {
    const button = event.currentTarget;
    const condition = $('#milestone-condition').value.trim();
    const file = $('#milestone-evidence').files[0];
    if (!condition) return notice('Describí la condición del hito antes de revisar la evidencia.', 'error');
    if (!file) return notice('Elegí una foto, PDF o archivo de texto de prueba.', 'error');
    if (file.size > 8 * 1024 * 1024) return notice('El archivo supera el límite de 8 MB.', 'error');
    button.disabled = true;
    button.textContent = 'Revisando evidencia…';
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const payload = {
        condition,
        text: file.type === 'text/plain' ? await file.text() : '',
        file: { mediaType: file.type || 'application/octet-stream', data: toBase64(bytes) },
      };
      let result;
      try {
        const response = await fetch('/api/ai/prevalidate', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (!response.ok) {
          if (response.status === 404 || response.status === 405) {
            result = demoPrevalidation(payload.text, condition);
          } else {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || `Servicio IA no disponible (HTTP ${response.status}).`);
          }
        } else {
          result = await response.json();
        }
      } catch (error) {
        if (error instanceof TypeError || /Failed to fetch|NetworkError/i.test(error.message)) {
          result = demoPrevalidation(payload.text, condition);
        } else throw error;
      }
      $('#ai-suggestion').hidden = false;
      $('#ai-suggestion-title').textContent = result.suggestion === 'aprobar' ? 'Sugerencia: aprobar' : 'Sugerencia: revisar';
      $('#ai-suggestion-reason').textContent = result.reason;
      $('#ai-extracted-name').textContent = result.extracted?.nombre || 'No detectado';
      $('#ai-extracted-subject').textContent = result.extracted?.materia || 'No detectada';
      $('#ai-extracted-grade').textContent = result.extracted?.nota || 'No detectada';
      $('#ai-extracted-date').textContent = result.extracted?.fecha || 'No detectada';
      $('#ai-confidence').textContent = `${Math.round(result.confidence * 100)}% · no calibrada`;
      $('#ai-provider-badge').textContent = result.label || (result.provider === 'demo' ? 'IA (modo demo)' : 'Sugerido por IA');
      notice('Pre-validación completada. La sugerencia no aprueba el hito: la tutora revisa y decide.', 'info');
    } catch (error) {
      notice(error.message, 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Analizar y sugerir →';
    }
  });

  async function showReceipt(receipt, title) {
    state.receipt = receipt;
    $('#payment-receipt').hidden = false;
    const isRefund = Boolean(receipt.sponsorId);
    $('#payment-receipt-summary').textContent = isRefund
      ? `${receipt.amountSats.toLocaleString('es-AR')} sats de prueba devueltos al sponsor. No hubo transferencia Lightning.`
      : `${receipt.amountSats.toLocaleString('es-AR')} sats de prueba por ${title}. Esto no fue una transferencia Lightning.`;
    const explanationBox = $('.ai-receipt-explanation');
    explanationBox.hidden = isRefund;
    if (!isRefund) {
      const reservedSats = state.fundedSats - state.paidSats - state.refundedSats;
      const request = { amountSats: receipt.amountSats, milestoneTitle: title, reservedSats };
      let explanation;
      try {
        const response = await fetch('/api/ai/explain-receipt', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(request),
        });
        if (!response.ok && response.status !== 404 && response.status !== 405) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || `Servicio IA no disponible (HTTP ${response.status}).`);
        }
        explanation = response.ok ? await response.json() : demoReceiptExplanation(request);
      } catch (error) {
        if (error instanceof TypeError || /Failed to fetch|NetworkError/i.test(error.message)) explanation = demoReceiptExplanation(request);
        else throw error;
      }
      $('#ai-receipt-explanation').textContent = explanation.explanation;
      $('#ai-receipt-badge').textContent = explanation.label || (explanation.provider === 'demo' ? 'IA (modo demo)' : 'Sugerido por IA');
    }
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
      await showReceipt(receipt, `Hito ${state.approvedMilestones}`);
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

  $('#payment-impact-report').addEventListener('click', async event => {
    const button = event.currentTarget;
    const snapshot = {
      paidSats: state.paidSats,
      students: state.paidSats > 0 ? 1 : 0,
      completedMilestones: state.approvedMilestones,
      refundedSats: state.refundedSats,
    };
    button.disabled = true;
    button.textContent = 'Generando resumen…';
    try {
      let report;
      try {
        const response = await fetch('/api/ai/impact-report', {
          method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(snapshot),
        });
        if (!response.ok && response.status !== 404 && response.status !== 405) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || `Servicio IA no disponible (HTTP ${response.status}).`);
        }
        report = response.ok ? await response.json() : demoImpactReport(snapshot);
      } catch (error) {
        if (error instanceof TypeError || /Failed to fetch|NetworkError/i.test(error.message)) report = demoImpactReport(snapshot);
        else throw error;
      }
      $('#impact-paid').textContent = snapshot.paidSats.toLocaleString('es-AR');
      $('#impact-students').textContent = String(snapshot.students);
      $('#impact-milestones').textContent = String(snapshot.completedMilestones);
      $('#impact-refunded').textContent = snapshot.refundedSats.toLocaleString('es-AR');
      $('#impact-report-badge').textContent = report.label || (report.provider === 'demo' ? 'IA (modo demo)' : 'Sugerido por IA');
      $('#impact-report-summary').textContent = report.summary;
      $('#payment-impact-result').hidden = false;
      notice('Reporte generado con los totales del ledger de esta sesión. Es una simulación, no impacto observado.', 'info');
    } catch (error) {
      notice(error.message, 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Generar reporte →';
    }
  });

  renderLedger();
}
