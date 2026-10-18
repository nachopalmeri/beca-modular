// Original "árbol de aportes": each synthetic contribution becomes a leaf, each released
// milestone a fruit. It illustrates the demo's in-memory state; no real money or crypto is shown.
const svgNS = 'http://www.w3.org/2000/svg';

const BRANCHES = [
  { x0: 220, y0: 336, cx: 148, cy: 286, x1: 92, y1: 238 },
  { x0: 220, y0: 306, cx: 292, cy: 258, x1: 350, y1: 204 },
  { x0: 220, y0: 270, cx: 154, cy: 212, x1: 114, y1: 148 },
  { x0: 220, y0: 240, cx: 284, cy: 182, x1: 336, y1: 122 },
  { x0: 220, y0: 208, cx: 194, cy: 150, x1: 202, y1: 92 }
];
const SLOT_T = [0.4, 0.68, 0.9];
const MOTIFS = ['billete', 'moneda', 'hoja'];
const MAX_LEAVES = 15;

const bezier = (branch, t) => ({
  x: (1 - t) ** 2 * branch.x0 + 2 * (1 - t) * t * branch.cx + t ** 2 * branch.x1,
  y: (1 - t) ** 2 * branch.y0 + 2 * (1 - t) * t * branch.cy + t ** 2 * branch.y1,
  a: Math.atan2(2 * (1 - t) * (branch.cy - branch.y0) + 2 * t * (branch.y1 - branch.cy), 2 * (1 - t) * (branch.cx - branch.x0) + 2 * t * (branch.x1 - branch.cx)) * 180 / Math.PI
});

function motifSvg(kind) {
  if (kind === 'moneda') return '<circle class="ft-outline" r="13"/><circle class="ft-line" r="8"/><path class="ft-line" d="M-3.4 0h6.8M0 -4.8v9.6"/>';
  if (kind === 'hoja') return '<path class="ft-outline" d="M0 -12C9 -6 10 4 0 12C-10 4 -9 -6 0 -12Z"/><path class="ft-line" d="M0 -8v16"/>';
  return '<rect class="ft-outline" x="-20" y="-11" width="40" height="22" rx="3"/><rect class="ft-line" x="-15.5" y="-6.5" width="31" height="13" rx="1.5"/><circle class="ft-line" r="4.6"/>';
}

export function mountFundingTree(root, { illustrative = false, seed = 0 } = {}) {
  if (!root) return null;
  const svg = root.querySelector('svg');
  const status = root.querySelector('[data-tree-status]');
  if (!svg) return null;
  const features = document.createElementNS(svgNS, 'g');
  const leafLayer = document.createElementNS(svgNS, 'g');
  const fruitLayer = document.createElementNS(svgNS, 'g');
  features.setAttribute('class', 'ft-features');
  leafLayer.setAttribute('class', 'ft-leaves');
  fruitLayer.setAttribute('class', 'ft-fruits');
  features.append(fruitLayer, leafLayer);
  svg.append(features);
  root.querySelector('[data-tree-fallback]')?.remove();

  const slots = BRANCHES.flatMap((branch, branchIndex) => SLOT_T.map((t, slotIndex) => {
    const point = bezier(branch, t);
    return { ...point, order: slotIndex * BRANCHES.length + branchIndex };
  })).sort((a, b) => a.order - b.order);

  function leafElement(index, amount, total) {
    const slot = slots[(index + seed) % slots.length];
    const weight = total > 0 && amount != null ? Math.min(1, amount / total) : .4;
    const scale = 0.8 + weight * 0.4;
    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute('transform', `translate(${slot.x.toFixed(1)} ${slot.y.toFixed(1)}) rotate(${(slot.a + (index % 2 ? 24 : -22)).toFixed(1)})`);
    const inner = document.createElementNS(svgNS, 'g');
    inner.setAttribute('class', `ft-leaf motif-${MOTIFS[index % MOTIFS.length]}`);
    inner.style.setProperty('--ft-delay', (Math.floor(index / BRANCHES.length) * 0.09).toFixed(2) + 's');
    const motif = document.createElementNS(svgNS, 'g');
    motif.setAttribute('transform', `scale(${scale.toFixed(2)})`);
    motif.innerHTML = motifSvg(MOTIFS[index % MOTIFS.length]);
    inner.append(motif);
    group.append(inner);
    return group;
  }
  function fruitElement(index, milestone) {
    const anchor = index === 0 ? bezier(BRANCHES[3], .97) : bezier(BRANCHES[4], .95);
    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute('class', 'ft-fruit');
    group.setAttribute('transform', `translate(${(anchor.x + (index === 0 ? 9 : 14)).toFixed(1)} ${(anchor.y + (index === 0 ? 10 : 8)).toFixed(1)})`);
    group.innerHTML = `<g class="ft-fruit-inner"><circle class="ft-fruit-body" r="13"/><path class="ft-fruit-stem" d="M0 -13q6 -8 14 -7"/><path class="ft-check" d="M-5.4 .8L-1.4 4.8L6 -4"/></g>`;
    group.dataset.milestone = String(milestone);
    return group;
  }

  function syncLeaves(contributions, total, { instant = false } = {}) {
    const target = Math.min(contributions.length, MAX_LEAVES);
    const fresh = [];
    while (leafLayer.children.length > target) leafLayer.lastElementChild.remove();
    while (leafLayer.children.length < target) {
      const index = leafLayer.children.length;
      const element = leafElement(index, contributions[index]?.amount, total);
      leafLayer.append(element);
      fresh.push(element.firstChild);
    }
    if (fresh.length) {
      if (instant) fresh.forEach(leaf => leaf.classList.add('is-in'));
      else requestAnimationFrame(() => fresh.forEach((leaf, index) => { leaf.classList.add('is-in', 'is-new'); void index; }));
    }
    let overflow = features.querySelector('.ft-overflow');
    const hidden = contributions.length - target;
    if (hidden > 0) {
      if (!overflow) {
        overflow = document.createElementNS(svgNS, 'g');
        overflow.setAttribute('class', 'ft-overflow');
        overflow.innerHTML = '<circle r="13" cx="220" cy="404"/><text y="408" x="220"></text>';
        features.append(overflow);
      }
      overflow.querySelector('text').textContent = '+' + hidden;
    } else overflow?.remove();
  }
  function syncFruits(milestones, { instant = false } = {}) {
    const fresh = [];
    while (fruitLayer.children.length > milestones.length) fruitLayer.lastElementChild.remove();
    while (fruitLayer.children.length < milestones.length) {
      const index = fruitLayer.children.length;
      const element = fruitElement(index, milestones[index]);
      fruitLayer.append(element);
      fresh.push(element);
    }
    if (fresh.length) {
      if (instant) fresh.forEach(fruit => fruit.classList.add('is-in'));
      else requestAnimationFrame(() => fresh.forEach(fruit => fruit.classList.add('is-in')));
    }
  }

  function render(state, { instant = false } = {}) {
    const contributions = state?.contributions ?? [];
    const milestones = [...new Set((state?.events ?? []).filter(event => event.kind === 'institution-test' && event.milestone).map(event => event.milestone))].sort((a, b) => a - b);
    const total = state?.target ?? contributions.reduce((sum, c) => sum + (c.amount ?? 0), 0);
    syncLeaves(contributions, total, { instant });
    syncFruits(milestones, { instant });
    const rootState = state?.status ?? 'illustrative';
    svg.dataset.treeState = rootState;
    if (status) {
      const pieces = [
        `${contributions.length} ${contributions.length === 1 ? 'hoja' : 'hojas'} de aportes ficticios`,
        `${milestones.length} ${milestones.length === 1 ? 'fruto' : 'frutos'} de hitos confirmados`
      ];
      if (rootState === 'review') pieces.push('revisión abierta: el crecimiento queda en pausa');
      if (rootState === 'refunded') pieces.push('aportes devueltos: volvió el saldo no liberado y las hojas quedan marcadas');
      status.textContent = `Árbol de aportes · ${pieces.join(' · ')}. Ilustración del escenario en memoria; no representa dinero real ni criptoactivos.`;
    }
    return { leaves: leafLayer.children.length, fruits: fruitLayer.children.length };
  }

  if (illustrative) {
    const example = {
      status: 'active',
      target: 10000,
      contributions: [{ id: 'ejemplo-01', amount: 4000 }, { id: 'ejemplo-02', amount: 2500 }, { id: 'ejemplo-03', amount: 3500 }],
      events: [{ kind: 'institution-test', milestone: 1 }]
    };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) render(example, { instant: true });
    else {
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        [1, 2, 3].forEach(count => setTimeout(() => {
          render({ ...example, contributions: example.contributions.slice(0, count), events: count === 3 ? example.events : [] });
        }, 430 * count));
      }, { threshold: .35 });
      observer.observe(root);
    }
    return { render, example };
  }
  return { render };
}
