// Narrativa con scroll horizontal: mapa, brecha, árbol, tramo y curva. Sin dependencias.
import { MAP, AGLOMERADOS, PROGRESAR_REAL } from './story-data.mjs';

const NS = 'http://www.w3.org/2000/svg';
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => 1 - Math.pow(1 - t, 3);
const el = (tag, attrs = {}, parent) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
};
const fmt = (n, d = 1) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Brote, la mascota ---------- */
export function broteSVG() {
  return `<svg viewBox="0 0 120 150" class="brote-svg">
    <g class="b-cap"><path d="M34 22 60 10 86 22 60 34Z" fill="#1f1a15" stroke="#d9b56a" stroke-width="1.5"/><path d="M46 27v9c8 5 20 5 28 0v-9" fill="#1f1a15" stroke="#d9b56a" stroke-width="1.5"/><path d="M84 23v14" stroke="#d9b56a" stroke-width="1.5"/><circle cx="84" cy="39" r="2.4" fill="#d9b56a"/></g>
    <path class="b-stem" d="M60 74C60 62 59 52 60 40" stroke="#6f8a4f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path class="b-leaf-l" d="M59 56C46 58 34 52 30 40c13-3 26 2 29 16Z" fill="#7e9c5a" stroke="#4f6a37" stroke-width="1.5"/>
    <path class="b-leaf-r" d="M61 46C70 36 84 32 94 36c-5 12-19 16-33 10Z" fill="#8fae66" stroke="#4f6a37" stroke-width="1.5"/>
    <rect x="22" y="70" width="76" height="13" rx="4" fill="#9a4f3a" stroke="#5e2b20" stroke-width="1.5"/>
    <path d="M27 83h66l-8 50c-1 6-5 9-11 9H46c-6 0-10-3-11-9Z" fill="#82402f" stroke="#5e2b20" stroke-width="1.5"/>
    <ellipse cx="42" cy="114" rx="6" ry="3.5" fill="#c46e5a" opacity=".55"/><ellipse cx="78" cy="114" rx="6" ry="3.5" fill="#c46e5a" opacity=".55"/>
    <g class="b-eyes-open" fill="#1b120d"><circle cx="47" cy="104" r="4.6"/><circle cx="73" cy="104" r="4.6"/><circle cx="48.6" cy="102.4" r="1.4" fill="#f4ead6"/><circle cx="74.6" cy="102.4" r="1.4" fill="#f4ead6"/></g>
    <g class="b-eyes-happy" stroke="#1b120d" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M42 105q5-6 10 0"/><path d="M68 105q5-6 10 0"/></g>
    <g class="b-eyes-closed" stroke="#1b120d" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M42 104q5 4 10 0"/><path d="M68 104q5 4 10 0"/></g>
    <g class="b-brows" stroke="#1b120d" stroke-width="2.2" stroke-linecap="round"><path d="M42 97l9-3"/><path d="M78 97l-9-3"/></g>
    <path class="b-mouth-smile" d="M54 116q6 6 12 0" stroke="#1b120d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path class="b-mouth-sad" d="M54 119q6-5 12 0" stroke="#1b120d" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g class="b-zz" fill="#d9b56a" font-family="Cormorant Garamond, serif" font-weight="700"><text x="92" y="60" font-size="16">z</text><text x="102" y="46" font-size="12">z</text></g>
  </svg>`;
}

const FRASES = {
  hola: 'Hola, soy Brote.',
  preocupado: 'Esto duele un poco…',
  triste: 'Muchos se quedan en el camino.',
  saludo: '¡Mirá cuánta gente quiere ayudar!',
  feliz: 'Cada parcial aprobado, una hoja para mí.',
  atento: 'Probá armar un programa.',
  verifica: 'Esto sí es real: verificá un pago.',
  reposo: '',
};

function setMood(mood) {
  const b = document.getElementById('brote');
  if (!b || b.dataset.mood === mood) return;
  b.dataset.mood = mood;
  const bubble = document.getElementById('brote-bubble');
  bubble.textContent = FRASES[mood] ?? '';
  bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
}

/* ---------- Escena I: mapa ---------- */
function buildMap() {
  const svg = document.getElementById('map');
  svg.setAttribute('viewBox', `0 0 ${MAP.w} ${MAP.h}`);
  const land = el('g', { class: 'land' }, svg);
  for (const p of MAP.paths) el('path', { d: p.d, class: `prov r-${p.r}` }, land);
  const dots = el('g', { class: 'dots' }, svg);
  const tip = document.getElementById('map-tip');
  const sorted = [...AGLOMERADOS].sort((a, b) => a.p - b.p);
  const nodes = sorted.map(a => {
    const r = 2.2 + ((a.p - 10) / 46) * 8.5;
    const g = el('g', { class: `dot${a.cv > 16 ? ' careful' : ''}`, tabindex: '0', role: 'button', 'aria-label': `${a.n}: ${fmt(a.p)}% de personas bajo la línea de pobreza` }, dots);
    g.style.setProperty('--hot', clamp((a.p - 15) / 40).toFixed(2));
    el('circle', { cx: a.xy[0], cy: a.xy[1], r: r + 5, class: 'halo' }, g);
    el('circle', { cx: a.xy[0], cy: a.xy[1], r, class: 'core' }, g);
    if (a.cv > 16) el('circle', { cx: a.xy[0], cy: a.xy[1], r: r + 2.6, class: 'ring' }, g);
    const show = () => { tip.innerHTML = `<b>${a.n}</b> · ${fmt(a.p)}% de las personas bajo la línea de pobreza${a.cv > 16 ? ' <i>(tomar con cuidado: CV ' + fmt(a.cv) + '%)</i>' : ''}`; };
    g.addEventListener('pointerenter', show); g.addEventListener('focus', show); g.addEventListener('click', show);
    return g;
  });
  const OFFSET = { Concordia: [14, 5, 'start'], 'Gran Resistencia': [-14, -8, 'end'], Posadas: [12, -10, 'start'] };
  for (const a of [...AGLOMERADOS].sort((x, y) => y.p - x.p).slice(0, 3)) {
    const [dx, dy, anchor] = OFFSET[a.n.split('-')[0]] || [12, 4, 'start'];
    const label = el('text', { x: a.xy[0] + dx, y: a.xy[1] + dy, 'text-anchor': anchor, class: 'map-label' }, dots);
    label.textContent = `${a.n.split('-')[0]} ${fmt(a.p)}%`;
    nodes.push(label);
  }
  return t => nodes.forEach((n, i) => n.classList.toggle('on', t > 0.05 + (i / nodes.length) * 0.75));
}

/* ---------- Escena III: árbol ---------- */
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

function buildTree() {
  const svg = document.getElementById('tree');
  const rand = rng(20261030);
  const branches = el('g', { class: 'branches' }, svg);
  const leaves = el('g', { class: 'leaves' }, svg);
  const segs = [], tips = [];
  const MAXD = 6;
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
  el('ellipse', { cx: 300, cy: 548, rx: 150, ry: 9, class: 'ground' }, svg);
  const leafNodes = tips.map(([x, y], i) => {
    const kind = rand();
    const g = el('g', { class: 'leaf' }, leaves);
    const rot = (rand() - 0.5) * 70;
    g.setAttribute('transform', `translate(${(x + (rand() - 0.5) * 14).toFixed(1)} ${(y + (rand() - 0.5) * 14).toFixed(1)}) rotate(${rot.toFixed(0)})`);
    const inner = el('g', { class: 'leaf-inner' }, g);
    if (kind < 0.42) {
      el('circle', { r: 9, class: 'coin' }, inner);
      const t = el('text', { class: 'coin-t', 'text-anchor': 'middle', y: 4 }, inner); t.textContent = '₿';
    } else {
      el('rect', { x: -12, y: -7, width: 24, height: 14, rx: 2, class: kind < 0.75 ? 'bill' : 'bill peso' }, inner);
      el('ellipse', { rx: 4.2, ry: 4.6, class: 'bill-oval' }, inner);
      const t = el('text', { class: 'bill-t', 'text-anchor': 'middle', y: 3.4 }, inner); t.textContent = '$';
    }
    return { g, at: 0.5 + (i / tips.length) * 0.42 };
  });
  return t => {
    const g = clamp(t / 0.55) * (MAXD + 1); // las ramas crecen por nivel, del tronco hacia afuera
    for (const s of segs) s.path.style.strokeDashoffset = String(1 - clamp(g - s.d));
    for (const l of leafNodes) l.g.classList.toggle('on', t > l.at);
  };
}

/* ---------- Escena IV: recibo ---------- */
function buildReceipt() {
  const items = [...document.querySelectorAll('.receipt li')];
  return t => items.forEach((li, i) => li.classList.toggle('on', t > 0.15 + i * 0.2));
}

/* ---------- Escena V: curva ---------- */
function buildChart() {
  const svg = document.getElementById('chart');
  const W = 640, H = 400, L = 54, R = 26, T = 30, B = 52;
  const xs = i => L + (i / (PROGRESAR_REAL.length - 1)) * (W - L - R);
  const ys = v => T + ((105 - v) / (105 - 50)) * (H - T - B);
  const grid = el('g', { class: 'grid' }, svg);
  for (const v of [50, 60, 70, 80, 90, 100]) {
    el('line', { x1: L, x2: W - R, y1: ys(v), y2: ys(v) }, grid);
    const t = el('text', { x: L - 10, y: ys(v) + 4, 'text-anchor': 'end' }, grid); t.textContent = v;
  }
  PROGRESAR_REAL.forEach((p, i) => {
    if (i % 6 !== 0 && i !== PROGRESAR_REAL.length - 1) return;
    const [y, m] = p.m.split('-');
    const t = el('text', { x: xs(i), y: H - B + 24, 'text-anchor': 'middle' }, grid);
    t.textContent = `${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][m - 1]} ${y.slice(2)}`;
  });
  const pts = PROGRESAR_REAL.map((p, i) => [xs(i), ys(p.real)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  const gap = el('path', { d: `${line}L${xs(PROGRESAR_REAL.length - 1)} ${ys(100)}L${xs(0)} ${ys(100)}Z`, class: 'gap' }, svg);
  const top = el('path', { d: `M${xs(0)} ${ys(100)}H${xs(PROGRESAR_REAL.length - 1)}`, class: 'restored', pathLength: '1' }, svg);
  const fall = el('path', { d: line, class: 'fall', pathLength: '1' }, svg);
  const last = pts.at(-1);
  const endDot = el('circle', { cx: last[0], cy: last[1], r: 5, class: 'end-dot' }, svg);
  const lbl1 = el('text', { x: last[0] - 8, y: last[1] + 26, 'text-anchor': 'end', class: 'chart-note fall-t' }, svg);
  lbl1.textContent = `Progresar hoy: ${fmt(PROGRESAR_REAL.at(-1).real, 0)}`;
  const lbl2 = el('text', { x: xs(PROGRESAR_REAL.length - 1) - 8, y: ys(100) - 12, 'text-anchor': 'end', class: 'chart-note gold-t' }, svg);
  lbl2.textContent = 'Con el complemento: 100';
  const arrow = el('path', { d: `M${last[0]} ${last[1] - 10}V${ys(100) + 10}`, class: 'lift', 'marker-end': 'url(#arrowhead)', pathLength: '1' }, svg);
  const defs = el('defs', {}, svg);
  const mk = el('marker', { id: 'arrowhead', viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  el('path', { d: 'M0 0 10 5 0 10z', fill: 'currentColor', class: 'arrow-tip' }, mk);
  return t => {
    const a = ease(clamp(t / 0.55));
    fall.style.strokeDashoffset = String(1 - a);
    endDot.classList.toggle('on', a > 0.98);
    lbl1.classList.toggle('on', a > 0.98);
    const b = ease(clamp((t - 0.55) / 0.3));
    arrow.style.strokeDashoffset = String(1 - b);
    gap.style.opacity = String(b * 0.85);
    top.style.strokeDashoffset = String(1 - b);
    lbl2.classList.toggle('on', b > 0.95);
  };
}

/* ---------- Contadores ---------- */
function buildCounter(node) {
  const target = Number(node.dataset.count);
  const suffix = node.textContent.includes('%') ? '%' : '';
  return t => { node.textContent = `${fmt(target * ease(clamp(t / 0.6)))}${suffix}`; };
}

/* ---------- Scroll horizontal ---------- */
function initStory() {
  const story = document.querySelector('.story');
  const track = story.querySelector('.story-track');
  const scenes = [...story.querySelectorAll('.scene')];
  const bar = document.getElementById('story-bar');
  // Cada escena ocupa 1 unidad de scroll: se queda quieta durante HOLD (mientras se anima) y luego se desliza.
  const N = scenes.length, HOLD = 0.55, UNIT_VH = 135;
  const SPAN = N - 1 + HOLD;
  const easeInOut = f => (f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2);
  const toX = v => { const k = Math.floor(v), f = v - k; return Math.min(N - 1, k + (f < HOLD ? 0 : easeInOut((f - HOLD) / (1 - HOLD)))); };
  const drivers = [
    [buildMap(), ...[...scenes[0].querySelectorAll('[data-count]')].map(buildCounter)],
    [...scenes[1].querySelectorAll('[data-count]')].map(buildCounter),
    [buildTree()],
    [buildReceipt()],
    [buildChart()],
  ];
  let horizontal = false, ticking = false;

  const layout = () => {
    horizontal = !reduceMotion.matches;
    story.classList.toggle('is-horizontal', horizontal);
    story.style.height = horizontal ? `${SPAN * UNIT_VH + 100}vh` : '';
    if (!horizontal) { track.style.transform = ''; drivers.forEach(ds => ds.forEach(d => d(1))); }
    update();
  };

  function update() {
    ticking = false;
    if (!horizontal) return;
    const rect = story.getBoundingClientRect();
    const total = story.offsetHeight - innerHeight;
    const p = clamp(-rect.top / total);
    const v = p * SPAN;
    const x = toX(v);
    track.style.transform = `translate3d(${(-x * 100).toFixed(3)}vw,0,0)`;
    bar.style.width = `${(x / (N - 1)) * 100}%`;
    scenes.forEach((s, i) => {
      const t = i === 0 ? clamp(0.25 + v / HOLD) : clamp((v - i + 0.4) / (HOLD + 0.4));
      drivers[i].forEach(d => d(t));
      s.classList.toggle('active', Math.abs(x - i) < 0.5);
    });
    if (rect.top <= 0 && rect.bottom >= innerHeight) setMood(scenes[Math.round(x)].dataset.mood);
  }

  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', layout);
  reduceMotion.addEventListener('change', layout);
  layout();

  // Teclado: las flechas laterales avanzan de a una escena.
  story.addEventListener('keydown', e => {
    if (!horizontal || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const total = story.offsetHeight - innerHeight;
    const x = toX(clamp(-story.getBoundingClientRect().top / total) * SPAN);
    const target = clamp(Math.round(x) + (e.key === 'ArrowRight' ? 1 : -1), 0, N - 1);
    const y = story.offsetTop + ((target + HOLD * 0.6) / SPAN) * total;
    scrollTo({ top: y, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });
}

/* ---------- Ánimo por sección y cierre ---------- */
function initMoods() {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting && !e.target.classList.contains('story')) setMood(e.target.dataset.mood);
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-mood]:not(.scene)').forEach(s => io.observe(s));

  const closing = document.querySelector('.closing');
  const reveal = new IntersectionObserver(entries => {
    for (const e of entries) {
      closing.classList.toggle('shown', e.isIntersecting);
      document.getElementById('brote').classList.toggle('away', e.isIntersecting);
    }
  }, { threshold: 0.35 });
  reveal.observe(closing);
}

function splitWords(node) {
  const walk = n => {
    for (const child of [...n.childNodes]) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(w => {
          if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else walk(child);
    }
  };
  walk(node);
  node.querySelectorAll('.w').forEach((w, i) => w.style.setProperty('--i', i));
}

document.getElementById('brote-body').innerHTML = broteSVG();
document.getElementById('closing-mascot').innerHTML = broteSVG();
document.getElementById('brote').dataset.mood = 'hola';
splitWords(document.querySelector('.reveal-words'));
initStory();
initMoods();
