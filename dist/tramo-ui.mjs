// Interfaz de la landing de Tramo. Simulación local: no conecta billeteras ni mueve fondos.
import {
  SNAPSHOT, brechaProgresar, satsToArs, createProgram, contribute, approveMilestone,
  setStudentStatus, closeProgram, ledger,
} from './tramo-model.mjs';
import { verifyReceipt, randomPreimage, sha256Hex } from './tramo-verify.mjs';

const $ = id => document.getElementById(id);
const fmtInt = n => new Intl.NumberFormat('es-AR').format(n);
const fmtArs = n => `$${fmtInt(Math.round(n))}`;
const fmtPct = n => `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n * 100)}%`;
const short = hex => `${hex.slice(0, 10)}…${hex.slice(-6)}`;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const periodo = p => { const [y, m] = p.split('-'); return `${MESES[Number(m) - 1]}-${y}`; };
const sha256Text = text => sha256Hex(Array.from(new TextEncoder().encode(text), b => b.toString(16).padStart(2, '0')).join(''));

const data = {
  ipcBase: SNAPSHOT.ipc.base, ipcUltimo: SNAPSHOT.ipc.ultimo, ipcEstado: `snapshot ${SNAPSHOT.ipc.consultado.split('-').reverse().join('/')}`,
  rate: SNAPSHOT.cotizacion.arsPorBtc, rateNote: `Snapshot ${SNAPSHOT.cotizacion.fuente}, 26/10/2026.`,
};
let program = null;
let events = [];
let lastReceipt = null;

function setLive(name, text) { document.querySelectorAll(`[data-live="${name}"]`).forEach(el => { el.textContent = text; }); }

function renderData() {
  const b = brechaProgresar(SNAPSHOT.progresar.monto, data.ipcBase.valor, data.ipcUltimo.valor);
  setLive('perdida', `${fmtPct(b.perdidaReal)}`);
  document.querySelectorAll('.stat [data-live="perdida"]').forEach(el => { el.textContent = `−${fmtPct(b.perdidaReal)}`; });
  setLive('perdida-texto', `${fmtPct(b.perdidaReal)} menos`);
  setLive('ajustado', fmtArs(b.ajustado));
  setLive('brecha', fmtArs(b.brecha));
  setLive('ipc-periodos', `${periodo(data.ipcBase.periodo)} → ${periodo(data.ipcUltimo.periodo)}`);
  setLive('ipc-estado', data.ipcEstado);
  if (!program) {
    $('cfg-h1-ars').value = b.brecha;
    $('cfg-h2-ars').value = b.brecha;
    $('cfg-rate').value = Math.round(data.rate);
  }
  $('rate-note').textContent = data.rateNote;
}

async function refreshData() {
  const btn = $('btn-refresh');
  btn.disabled = true; btn.textContent = 'Consultando…';
  const notes = [];
  try {
    const url = `https://apis.datos.gob.ar/series/api/series/?ids=${SNAPSHOT.ipc.serie}&last=1&format=json`;
    const json = await (await fetch(url, { signal: AbortSignal.timeout(8000) })).json();
    const [fecha, valor] = json.data[0];
    data.ipcUltimo = { periodo: fecha.slice(0, 7), valor };
    data.ipcEstado = `en vivo, ${new Date().toLocaleDateString('es-AR')}`;
  } catch { notes.push('IPC: se mantiene el snapshot'); }
  try {
    const json = await (await fetch('https://api.yadio.io/exrates/ARS', { signal: AbortSignal.timeout(8000) })).json();
    if (!(json.BTC > 0)) throw new Error();
    data.rate = json.BTC;
    data.rateNote = `Yadio en vivo, ${new Date().toLocaleString('es-AR')}.`;
    if (!program) $('cfg-rate').value = Math.round(json.BTC);
  } catch { notes.push('cotización: se mantiene el snapshot'); }
  if (notes.length) data.rateNote += ` (${notes.join('; ')})`;
  renderData();
  btn.disabled = false; btn.textContent = 'Actualizar IPC y cotización';
}

function log(text, extra = '') {
  events = [{ t: new Date().toLocaleTimeString('es-AR'), text, extra }, ...events];
}

function showError(err) {
  const el = $('sim-error');
  el.textContent = err ? err.message || String(err) : '';
  el.hidden = !err;
}

function act(fn) {
  return async (...args) => {
    try { showError(null); await fn(...args); render(); } catch (err) { showError(err); }
  };
}

const sealRules = act(async () => {
  if (program && program.status !== 'closed' && !confirm('Esto reinicia el programa simulado. ¿Continuar?')) return;
  const rate = Number($('cfg-rate').value);
  program = createProgram({
    estudiantes: Number($('cfg-students').value),
    arsPorBtc: rate,
    hitos: [
      { label: $('cfg-h1-label').value, montoArs: Number($('cfg-h1-ars').value) },
      { label: $('cfg-h2-label').value, montoArs: Number($('cfg-h2-ars').value) },
    ],
  });
  const rules = JSON.stringify({ estudiantes: program.students.length, hitos: program.hitos, arsPorBtc: rate });
  const hash = await sha256Text(rules);
  events = [];
  log(`Reglas selladas: ${program.students.length} estudiantes × ${program.hitos.length} hitos. Meta ${fmtInt(program.goal)} sats (≈ ${fmtArs(satsToArs(program.goal, rate))}).`);
  const el = $('rules-hash');
  el.hidden = false;
  el.innerHTML = `Huella de las reglas: <code>${short(hash)}</code><br><small>En el producto, esta huella se sella en un bloque de Bitcoin con OpenTimestamps antes del primer aporte.</small>`;
});

const fund = act(event => {
  event.preventDefault();
  if (!program) throw new Error('Primero sellá las reglas.');
  const sats = Number($('fund-sats').value);
  const alias = $('fund-alias').value;
  program = contribute(program, { alias, sats });
  const c = program.contributions.at(-1);
  log(`Aporte de ${c.alias}: ${fmtInt(c.sats)} sats.`, program.status === 'active' ? 'Meta completa: el programa se activa.' : '');
  $('fund-sats').value = '';
  $('fund-alias').value = '';
});

const fill = act(() => {
  if (!program) throw new Error('Primero sellá las reglas.');
  if (!program.contributions.length) {
    program = contribute(program, { alias: 'Egresados 2019', sats: Math.max(1, Math.floor(program.goal * 0.6)) });
    log(`Aporte de Egresados 2019: ${fmtInt(program.contributions.at(-1).sats)} sats.`);
  }
  const falta = program.goal - program.funded;
  if (falta > 0) {
    program = contribute(program, { alias: 'Comunidad bitcoiner', sats: falta });
    log(`Aporte de Comunidad bitcoiner: ${fmtInt(falta)} sats.`, 'Meta completa: el programa se activa.');
  }
});

const close = act(() => {
  if (!program) throw new Error('No hay programa.');
  if (!confirm('Cerrar el programa devuelve a cada sponsor lo no pagado. ¿Continuar?')) return;
  program = closeProgram(program);
  const total = program.refunds.reduce((s, r) => s + r.sats, 0);
  log(`Programa cerrado. Devueltos ${fmtInt(total)} sats: ${program.refunds.map(r => `${r.alias} ${fmtInt(r.sats)}`).join(', ') || 'nada que devolver'}.`);
});

const approve = act(async studentId => {
  const preimage = randomPreimage();
  const paymentHash = await sha256Hex(preimage);
  program = approveMilestone(program, studentId, { preimage, paymentHash });
  const p = program.payouts.at(-1);
  lastReceipt = { preimage, paymentHash };
  log(`Pago a ${studentId} por "${p.label}": ${fmtInt(p.sats)} sats (≈ ${fmtArs(satsToArs(p.sats, program.arsPorBtc))}).`, `hash ${short(paymentHash)} · preimage ${short(preimage)}`);
});

const changeStatus = act((studentId, status) => {
  program = setStudentStatus(program, studentId, status);
  const msg = { revision: 'en revisión: se pausan sus pagos', activo: 'reanudado', baja: 'baja confirmada tras revisión: lo no cobrado volverá a los sponsors al cerrar' }[status];
  log(`${studentId} ${msg}.`);
});

function render() {
  const p = program;
  const pct = p ? Math.round((p.funded / p.goal) * 100) : 0;
  $('meter-bar').style.width = `${pct}%`;
  $('fund-status').textContent = !p ? 'Sellá las reglas para abrir el fondeo.'
    : p.status === 'funding' ? `${fmtInt(p.funded)} de ${fmtInt(p.goal)} sats (${pct}%). Falta ${fmtInt(p.goal - p.funded)}. Los pagos empiezan con la meta completa.`
    : p.status === 'closed' ? 'Programa cerrado.'
    : `Meta completa: ${fmtInt(p.goal)} sats. Programa activo.`;
  $('contrib-list').innerHTML = p ? p.contributions.map(c => `<li><span>${escape(c.alias)}</span><b>${fmtInt(c.sats)} sats</b></li>`).join('') : '';

  $('student-list').innerHTML = p ? p.students.map(s => {
    const done = s.cobrados >= p.hitos.length;
    const next = done ? 'Todos los hitos cobrados' : `Próximo: ${escape(p.hitos[s.cobrados].label)}`;
    const canPay = p.status === 'active' && s.status === 'activo' && !done;
    const statusLabel = { activo: 'Activo', revision: 'En revisión', baja: 'Baja' }[s.status];
    return `<article class="student ${s.status}">
      <header><b>${s.id}</b><span class="pill">${statusLabel}</span></header>
      <p>${s.cobrados}/${p.hitos.length} hitos · ${next}</p>
      <div class="row">
        <button class="btn small primary" data-act="approve" data-id="${s.id}" ${canPay ? '' : 'disabled'}>Validar hito</button>
        ${s.status === 'activo' && !done && p.status !== 'closed' ? `<button class="btn small ghost" data-act="revision" data-id="${s.id}">Revisión</button>` : ''}
        ${s.status === 'revision' ? `<button class="btn small ghost" data-act="activo" data-id="${s.id}">Reanudar</button><button class="btn small warn" data-act="baja" data-id="${s.id}">Confirmar baja</button>` : ''}
      </div></article>`;
  }).join('') : '<p class="hint">Sin programa todavía.</p>';

  if (p) {
    const l = ledger(p);
    $('totals').innerHTML = [
      ['Fondeado', l.funded], ['Pagado a estudiantes', l.paid], ['Devuelto a sponsors', l.refunded], ['Reservado', l.reserved],
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${fmtInt(v)} <small>sats</small></dd></div>`).join('');
    $('balance').textContent = l.balanced ? `✓ Cuadra: fondeado = pagado + devuelto + reservado (${fmtInt(l.funded)} sats).` : '✗ No cuadra.';
    $('balance').className = `balance ${l.balanced ? 'ok' : 'bad'}`;
  } else { $('totals').innerHTML = ''; $('balance').textContent = ''; }
  $('event-log').innerHTML = events.map(e => `<li><time>${e.t}</time> ${escape(e.text)}${e.extra ? `<small>${escape(e.extra)}</small>` : ''}</li>`).join('');
}

function escape(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

async function verify(event) {
  event.preventDefault();
  const out = $('v-result');
  try {
    const r = await verifyReceipt($('v-pre').value, $('v-target').value);
    out.className = `v-result ${r.ok ? 'ok' : 'bad'}`;
    out.innerHTML = r.ok
      ? `✓ Pago verificado. SHA-256(preimage) = <code>${short(r.computed)}</code>, igual al payment hash${r.fromInvoice ? ' de la factura' : ''}.`
      : `✗ No coincide. SHA-256(preimage) = <code>${short(r.computed)}</code> pero el hash esperado es <code>${short(r.expected)}</code>.`;
  } catch (err) {
    out.className = 'v-result bad';
    out.textContent = err.message;
  }
}

function init() {
  renderData();
  render();
  $('btn-refresh').addEventListener('click', refreshData);
  $('sim-config').addEventListener('submit', event => { event.preventDefault(); sealRules(); });
  $('fund-form').addEventListener('submit', fund);
  $('btn-fill').addEventListener('click', fill);
  $('btn-close').addEventListener('click', close);
  $('student-list').addEventListener('click', event => {
    const btn = event.target.closest('button[data-act]');
    if (!btn) return;
    const { act: action, id } = btn.dataset;
    if (action === 'approve') approve(id); else changeStatus(id, action);
  });
  $('verify-form').addEventListener('submit', verify);
  $('v-sample').addEventListener('click', () => {
    if (!lastReceipt) { $('v-result').className = 'v-result bad'; $('v-result').textContent = 'Todavía no hay pagos en el simulador: validá un hito primero.'; return; }
    $('v-pre').value = lastReceipt.preimage;
    $('v-target').value = lastReceipt.paymentHash;
    $('v-result').textContent = '';
  });
}

init();
