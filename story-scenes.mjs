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

/* I · Mapa: abandono interanual en secundaria, último período publicado */
function buildMap(svg, tip) {
  const year = abandonoYears.length - 1;
  svg.setAttribute('viewBox', geoViewBox);
  const values = Object.values(abandonoProvincias).map(p => p.secundaria[year]);
  const max = Math.max(...values), min = Math.min(...values);
  const ranked = Object.entries(abandonoProvincias).sort((a, b) => b[1].secundaria[year] - a[1].secundaria[year]);
  const rank = new Map(ranked.map(([id], i) => [id, i]));
  const nodes = [];
  for (const prov of provincias) {
    const data = abandonoProvincias[prov.id];
    if (!data) continue;
    const v = data.secundaria[year];
    const path = el('path', { d: prov.path, class: 'bm-prov', tabindex: '0', role: 'button', 'aria-label': `${data.nombre}: ${fmt(v, 2)}% de abandono interanual en secundaria (${abandonoYears[year]})` }, svg);
    path.style.setProperty('--heat', clamp((v - min) / (max - min)).toFixed(3));
    path.style.setProperty('--delay', `${rank.get(prov.id) * 45}ms`);
    const show = () => { tip.innerHTML = `<b>${data.nombre}</b> · ${fmt(v, 2)}% no volvió a inscribirse (${abandonoYears[year]})`; };
    path.addEventListener('pointerenter', show); path.addEventListener('focus', show); path.addEventListener('click', show);
    nodes.push(path);
  }
  for (const [id, data] of ranked.slice(0, 3)) {
    const prov = provincias.find(p => p.id === id);
    const [x, y] = prov.centro;
    const label = el('text', { x: x + 34, y: y + 12, class: 'bm-map-label' }, svg);
    label.textContent = `${data.nombre} ${fmt(data.secundaria[year])}%`;
    nodes.push(label);
  }
  return t => nodes.forEach((n, i) => n.classList.toggle('on', t > (i / nodes.length) * 0.85));
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

function buildSteps(list) {
  const items = [...list.querySelectorAll('li')];
  return t => items.forEach((li, i) => li.classList.toggle('on', t > 0.1 + i * 0.22));
}

function buildCounters(scope) {
  const nodes = [...scope.querySelectorAll('[data-count]')];
  return t => nodes.forEach(node => {
    const target = Number(node.dataset.count);
    node.textContent = `${fmt(target * ease(clamp(t / 0.7)), Number(node.dataset.decimals ?? 1))}${node.dataset.suffix ?? '%'}`;
  });
}

function play(driver, duration) {
  if (reduceMotion.matches) { driver(1); return; }
  const start = performance.now();
  const frame = now => { const t = clamp((now - start) / duration); driver(t); if (t < 1) requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}

function mount() {
  const scenes = [
    ['#bm-map', root => buildMap(root.querySelector('svg'), root.querySelector('.bm-map-tip')), 1700],
    ['#bm-gap', root => buildCounters(root), 1400],
    ['#bm-tree', root => buildTree(root.querySelector('svg')), 3000],
    ['#bm-receipt', root => buildSteps(root), 2200],
    ['#bm-chart', root => buildChart(root.querySelector('svg')), 2600],
  ];
  const nacional = document.querySelector('[data-abandono-nacional]');
  if (nacional) nacional.dataset.count = abandonoPais.secundaria.at(-1);
  for (const [selector, build, duration] of scenes) {
    const root = document.querySelector(selector);
    if (!root) continue;
    const driver = build(root);
    if (reduceMotion.matches) { driver(1); continue; } // sin animación: todo visible desde el inicio
    driver(0);
    let played = false;
    const io = new IntersectionObserver(entries => {
      if (played || !entries.some(e => e.isIntersecting)) return;
      played = true; io.disconnect(); play(driver, duration);
    }, { threshold: 0.45 });
    io.observe(root);
  }
}

mount();
