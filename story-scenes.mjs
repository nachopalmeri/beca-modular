// Escenas de datos del recorrido. roadmap.mjs mueve los paneles y a Brote; este módulo dibuja
// cada visualización y la anima cuando su panel entra en pantalla. Sin dependencias.
import { abandonoYears, abandonoPais, abandonoProvincias } from './data/abandono-interanual.mjs?v=29';
import { geoViewBox, provincias } from './data/geo-provincias.mjs?v=29';
import { PROGRESAR_REAL } from './data/progresar-real.mjs?v=29';

const NS = 'http://www.w3.org/2000/svg';
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => 1 - Math.pow(1 - t, 3);
const fmt = (n, d = 1) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
const el = (tag, attrs = {}, parent) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

/* I · Mapa: una marca roja por provincia, proporcional al abandono interanual en secundaria */
function buildMap(svg, tip) {
  const year = abandonoYears.length - 1;
  svg.setAttribute('viewBox', geoViewBox);
  const land = el('g', { class: 'bm-land' }, svg);
  for (const prov of provincias) el('path', { d: prov.path, class: 'bm-prov' }, land);
  const max = Math.max(...Object.values(abandonoProvincias).map(p => p.secundaria[year]));
  const ranked = Object.entries(abandonoProvincias).sort((a, b) => b[1].secundaria[year] - a[1].secundaria[year]);
  const marks = el('g', { class: 'bm-marks' }, svg);
  const nodes = [];
  // De menor a mayor, así las marcas más grandes quedan arriba y aparecen al final.
  for (const [id, data] of [...ranked].reverse()) {
    const prov = provincias.find(p => p.id === id);
    if (!prov) continue;
    const v = data.secundaria[year], [x, y] = prov.centro;
    const r = 10 + Math.sqrt(Math.max(0, v) / max) * 46;
    const g = el('g', { class: 'bm-mark', tabindex: '0', role: 'button', 'aria-label': `${data.nombre}: ${fmt(v, 2)}% de abandono interanual en secundaria (${abandonoYears[year]})` }, marks);
    el('circle', { cx: x, cy: y, r: r + 9, class: 'bm-mark-halo' }, g);
    el('circle', { cx: x, cy: y, r, class: 'bm-mark-dot' }, g);
    // Trazo "a mano": un segundo anillo levemente corrido, como una marca hecha con lápiz.
    el('ellipse', { cx: x + 2, cy: y - 1.5, rx: r + 4, ry: r + 1, class: 'bm-mark-ring', transform: `rotate(${(Number(id) * 37) % 50 - 25} ${x} ${y})` }, g);
    const show = () => { tip.innerHTML = `<b>${data.nombre}</b> · ${fmt(v, 2)}% no volvió a inscribirse (${abandonoYears[year]})`; };
    g.addEventListener('pointerenter', show); g.addEventListener('focus', show); g.addEventListener('click', show);
    nodes.push(g);
  }
  for (const [id, data] of ranked.slice(0, 3)) {
    const prov = provincias.find(p => p.id === id);
    const [x, y] = prov.centro;
    const label = el('text', { x: x + 64, y: y + 12, class: 'bm-map-label' }, svg);
    label.textContent = `${data.nombre} ${fmt(data.secundaria[year])}%`;
    nodes.push(label);
  }
  return t => nodes.forEach((n, i) => n.classList.toggle('on', t > 0.08 + (i / nodes.length) * 0.8));
}

/* III · Árbol: cada hoja es un aporte (billete, peso o bitcoin) */
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

function buildTree(svg) {
  const rand = rng(20261030);
  const branches = el('g', { class: 'bm-branches' }, svg);
  const leaves = el('g', { class: 'bm-leaves' }, svg);
  const segs = [], tips = [], MAXD = 6;
  (function grow(x, y, ang, len, w, d) {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    const bend = (rand() - 0.5) * len * 0.35;
    const cx = (x + x2) / 2 + Math.cos(ang + Math.PI / 2) * bend, cy = (y + y2) / 2 + Math.sin(ang + Math.PI / 2) * bend;
    const path = el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, 'stroke-width': w.toFixed(1), pathLength: '1' }, branches);
    segs.push({ path, d });
    if (d >= MAXD) { tips.push([x2, y2]); return; }
    const n = d < 2 ? 2 : rand() < 0.35 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const spread = (n === 3 ? [-0.55, 0, 0.55][i] : i ? 0.42 : -0.42) + (rand() - 0.5) * 0.35;
      grow(x2, y2, ang + spread, len * (0.7 + rand() * 0.12), w * 0.66, d + 1);
    }
    if (d >= 3 && rand() < 0.5) tips.push([x2, y2]);
  })(300, 545, -Math.PI / 2, 132, 26, 0);
  el('ellipse', { cx: 300, cy: 548, rx: 150, ry: 9, class: 'bm-ground' }, svg);
  const leafNodes = tips.map(([x, y], i) => {
    const kind = rand();
    const g = el('g', { class: 'bm-leaf' }, leaves);
    g.setAttribute('transform', `translate(${(x + (rand() - 0.5) * 14).toFixed(1)} ${(y + (rand() - 0.5) * 14).toFixed(1)}) rotate(${((rand() - 0.5) * 70).toFixed(0)})`);
    const inner = el('g', { class: 'bm-leaf-inner' }, g);
    if (kind < 0.42) {
      el('circle', { r: 9, class: 'bm-coin' }, inner);
      const t = el('text', { class: 'bm-coin-t', 'text-anchor': 'middle', y: 4 }, inner); t.textContent = '₿';
    } else {
      el('rect', { x: -12, y: -7, width: 24, height: 14, rx: 2, class: kind < 0.75 ? 'bm-bill' : 'bm-bill peso' }, inner);
      el('ellipse', { rx: 4.2, ry: 4.6, class: 'bm-bill-oval' }, inner);
      const t = el('text', { class: 'bm-bill-t', 'text-anchor': 'middle', y: 3.4 }, inner); t.textContent = '$';
    }
    return { g, at: 0.5 + (i / tips.length) * 0.45 };
  });
  return t => {
    const g = clamp(t / 0.55) * (MAXD + 1); // las ramas crecen por nivel, del tronco hacia afuera
    for (const s of segs) s.path.style.strokeDashoffset = String(1 - clamp(g - s.d));
    for (const l of leafNodes) l.g.classList.toggle('on', t > l.at);
  };
}

/* V · Curva: valor real de Progresar y lo que el complemento restituye */
function buildChart(svg) {
  const W = 640, H = 400, L = 54, R = 26, T = 30, B = 52, n = PROGRESAR_REAL.length;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const xs = i => L + (i / (n - 1)) * (W - L - R);
  const ys = v => T + ((105 - v) / (105 - 50)) * (H - T - B);
  const grid = el('g', { class: 'bm-grid' }, svg);
  for (const v of [50, 60, 70, 80, 90, 100]) {
    el('line', { x1: L, x2: W - R, y1: ys(v), y2: ys(v) }, grid);
    el('text', { x: L - 10, y: ys(v) + 4, 'text-anchor': 'end' }, grid).textContent = v;
  }
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  PROGRESAR_REAL.forEach((p, i) => {
    if (i % 6 && i !== n - 1) return;
    const [y, m] = p.m.split('-');
    el('text', { x: xs(i), y: H - B + 24, 'text-anchor': 'middle' }, grid).textContent = `${MESES[m - 1]} ${y.slice(2)}`;
  });
  const pts = PROGRESAR_REAL.map((p, i) => [xs(i), ys(p.real)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  const defs = el('defs', {}, svg);
  const mk = el('marker', { id: 'bm-arrow', viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  el('path', { d: 'M0 0 10 5 0 10z', class: 'bm-arrow-tip' }, mk);
  const gap = el('path', { d: `${line}L${xs(n - 1)} ${ys(100)}L${xs(0)} ${ys(100)}Z`, class: 'bm-gap' }, svg);
  const top = el('path', { d: `M${xs(0)} ${ys(100)}H${xs(n - 1)}`, class: 'bm-restored', pathLength: '1' }, svg);
  const fall = el('path', { d: line, class: 'bm-fall', pathLength: '1' }, svg);
  const last = pts.at(-1);
  const endDot = el('circle', { cx: last[0], cy: last[1], r: 5, class: 'bm-end' }, svg);
  const lbl1 = el('text', { x: last[0] - 8, y: last[1] + 26, 'text-anchor': 'end', class: 'bm-note bm-note-fall' }, svg);
  lbl1.textContent = `Progresar hoy: ${fmt(PROGRESAR_REAL.at(-1).real, 0)}`;
  const lbl2 = el('text', { x: xs(n - 1) - 8, y: ys(100) - 12, 'text-anchor': 'end', class: 'bm-note bm-note-gold' }, svg);
  lbl2.textContent = 'Con el complemento: 100';
  const lift = el('path', { d: `M${last[0]} ${last[1] - 10}V${ys(100) + 10}`, class: 'bm-lift', 'marker-end': 'url(#bm-arrow)', pathLength: '1' }, svg);
  return t => {
    const a = ease(clamp(t / 0.55)), b = ease(clamp((t - 0.55) / 0.35));
    fall.style.strokeDashoffset = String(1 - a);
    endDot.classList.toggle('on', a > 0.98);
    lbl1.classList.toggle('on', a > 0.98);
    lift.style.strokeDashoffset = String(1 - b);
    top.style.strokeDashoffset = String(1 - b);
    gap.style.opacity = String(b * 0.85);
    lbl2.classList.toggle('on', b > 0.95);
  };
}



// Cada cuadro de una escena avisa su progreso: Brote (brote-live.mjs) reacciona a la par.
const emit = (scene, t) => document.dispatchEvent(new CustomEvent('bm-scene', { detail: { scene, t } }));

function play(scene, driver, duration) {
  if (reduceMotion.matches) { driver(1); emit(scene, 1); return; }
  const start = performance.now();
  const frame = now => { const t = clamp((now - start) / duration); driver(t); emit(scene, t); if (t < 1) requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}

function mount() {
  const scenes = [
    ['mapa', '#bm-map', root => buildMap(root.querySelector('svg'), root.querySelector('.bm-map-tip')), 2200],
    ['arbol', '#bm-tree', root => buildTree(root.querySelector('svg')), 3000],
    ['curva', '#bm-chart', root => buildChart(root.querySelector('svg')), 2600],
  ];
  const nacional = document.querySelector('[data-abandono-nacional]');
  if (nacional) nacional.textContent = `${fmt(abandonoPais.secundaria.at(-1), 2)}%`;
  for (const [scene, selector, build, duration] of scenes) {
    const root = document.querySelector(selector);
    if (!root) continue;
    const driver = build(root);
    if (reduceMotion.matches) { driver(1); emit(scene, 1); continue; } // sin animación: todo visible desde el inicio
    driver(0);
    let played = false;
    const io = new IntersectionObserver(entries => {
      if (played || !entries.some(e => e.isIntersecting)) return;
      played = true; io.disconnect(); play(scene, driver, duration);
    }, { threshold: 0.45 });
    io.observe(root);
  }
}

mount();
