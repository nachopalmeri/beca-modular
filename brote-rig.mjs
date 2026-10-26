// Brote en vector: libro abierto, página-cara y brote de dos hojas, con partes articuladas.
// Cada pose es una función pura del progreso (scroll o escena), así que avanzar o retroceder es exacto.
const clamp = v => Math.max(0, Math.min(1, v));
const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
let rigId = 0;

// Origen (en coordenadas del viewBox 0 0 200 240) de cada articulación.
const JOINTS = {
  body: [100, 214], page: [108, 172], head: [108, 150], armL: [76, 130], armR: [146, 128],
  legL: [84, 196], legR: [118, 196], stem: [66, 182], leafL: [80, 98], leafR: [98, 46], eyes: [112, 112],
};

export const REST = Object.freeze({
  x: 0, y: 0, rot: 0, squash: 1, page: 0, head: 0, armL: 0, armR: 0, legL: 0, legR: 0,
  stem: 0, leafL: 0, leafR: 0, lookX: 0, lookY: 0, blink: 0, mood: 'smile', brows: 0, zz: 0, cap: 0,
});

export function broteSVG(extraClass = '') {
  const id = ++rigId, paper = `brp${id}`, felt = `brf${id}`, leaf = `brl${id}`;
  return `<svg class="br-rig ${extraClass}" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${paper}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf2dc"/><stop offset="1" stop-color="#e6d3ad"/></linearGradient>
    <linearGradient id="${felt}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d6b47"/><stop offset="1" stop-color="#22432f"/></linearGradient>
    <linearGradient id="${leaf}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9dbb63"/><stop offset="1" stop-color="#6f9447"/></linearGradient>
  </defs>
  <ellipse class="br-shadow" cx="100" cy="230" rx="62" ry="7"/>
  <g class="br-all">
    <g class="br-stem-g" data-part="stem">
      <path class="br-stem" d="M66 182C54 150 60 112 82 84C92 70 96 58 98 46" stroke="url(#${felt})"/>
      <g class="br-leaf-l" data-part="leafL"><path d="M80 98C64 74 32 66 4 78C20 106 56 118 80 98Z" fill="url(#${felt})"/><path d="M78 97C62 84 40 80 18 84C34 100 58 106 78 97Z" fill="url(#${leaf})"/></g>
      <g class="br-leaf-r" data-part="leafR"><path d="M98 46C100 16 128 -6 170 -8C168 30 136 56 98 46Z" fill="url(#${felt})"/><path d="M101 43C106 22 126 6 156 2C150 28 128 44 101 43Z" fill="url(#${leaf})"/></g>
    </g>
    <g class="brote-leg brote-leg-left br-leg" data-part="legL"><path class="br-shin" d="M84 196Q78 210 82 222"/><path class="brote-shoe br-shoe" d="M84 216Q62 214 58 226Q76 232 92 226Z"/></g>
    <g class="brote-leg brote-leg-right br-leg" data-part="legR"><path class="br-shin" d="M118 196Q124 210 120 222"/><path class="brote-shoe br-shoe" d="M118 216Q140 214 144 226Q126 232 110 226Z"/></g>
    <g class="br-body" data-part="body">
      <path class="br-cover" d="M14 182Q100 204 186 182L190 196Q100 220 10 196Z" fill="url(#${felt})"/>
      <path class="br-sheet" d="M22 180Q62 162 100 186L100 198Q62 176 22 192Z" fill="url(#${paper})"/>
      <path class="br-sheet" d="M100 186Q140 162 178 180L178 192Q140 176 100 198Z" fill="url(#${paper})"/>
      <path class="br-sheet" d="M106 178Q144 156 174 168L174 178Q144 164 106 188Z" fill="url(#${paper})"/>
      <g class="br-page" data-part="page">
        <path class="br-face-page" d="M72 176C66 146 68 108 76 82C100 70 126 76 148 70C154 102 154 140 150 170C126 160 98 164 72 176Z" fill="url(#${paper})"/>
        <path class="br-curl" d="M148 70C156 74 158 84 152 92C150 84 148 78 142 74Z" fill="#e2cfa6"/>
        <g class="br-head" data-part="head">
          <g class="br-brows" data-part="brows"><path d="M92 99l11-3"/><path d="M133 96l-11-2"/></g>
          <g class="br-eyes" data-part="eyes">
            <g class="br-eyes-open"><circle cx="98" cy="112" r="6"/><circle cx="126" cy="110" r="6"/><circle class="br-glint" cx="100" cy="110" r="1.8"/><circle class="br-glint" cx="128" cy="108" r="1.8"/></g>
            <g class="br-eyes-happy"><path d="M92 113q6-7 12 0"/><path d="M120 111q6-7 12 0"/></g>
            <g class="br-eyes-closed"><path d="M92 112q6 5 12 0"/><path d="M120 110q6 5 12 0"/></g>
          </g>
          <ellipse class="br-blush" cx="90" cy="125" rx="6.5" ry="4"/><ellipse class="br-blush" cx="136" cy="122" rx="6.5" ry="4"/>
          <path class="br-mouth br-mouth-smile" d="M104 126Q113 134 122 125"/>
          <path class="br-mouth br-mouth-sad" d="M104 131Q113 124 122 130"/>
          <path class="br-mouth br-mouth-o" d="M110 127q3-4 6 0q-3 5-6 0Z"/>
          <path class="br-mouth br-mouth-grin" d="M102 124Q113 138 124 123Z"/>
        </g>
      </g>
    </g>
    <g class="br-arm br-arm-l" data-part="armL"><path d="M76 130Q56 140 50 160Q44 170 52 173Q58 174 61 162Q66 150 80 144Z" fill="url(#${paper})"/></g>
    <g class="br-arm br-arm-r" data-part="armR"><path d="M146 128Q166 138 172 158Q178 168 170 171Q164 172 161 160Q156 148 142 142Z" fill="url(#${paper})"/></g>
    <g class="br-cap" data-part="cap"><path d="M84 74 112 62 140 72 112 84Z"/><path d="M98 79v8c9 5 20 5 28 0v-8"/><path class="br-tassel" d="M138 73v13"/><circle cx="138" cy="88" r="2.6"/></g>
    <g class="br-zz" data-part="zz"><text x="150" y="70">z</text><text x="164" y="54">z</text><text x="176" y="40">Z</text></g>
  </g>
</svg>`;
}

const tf = (node, [ox, oy], value) => { if (node) { node.style.transformOrigin = `${ox}px ${oy}px`; node.style.transform = value; } };

export function mountRig(container, extraClass = '') {
  container.insertAdjacentHTML('beforeend', broteSVG(extraClass));
  const svg = container.lastElementChild;
  const part = name => svg.querySelector(`[data-part="${name}"]`);
  return {
    svg,
    parts: { all: svg.querySelector('.br-all'), shadow: svg.querySelector('.br-shadow'), body: part('body'), page: part('page'), head: part('head'), armL: part('armL'), armR: part('armR'), legL: part('legL'), legR: part('legR'), stem: part('stem'), leafL: part('leafL'), leafR: part('leafR'), eyes: part('eyes'), brows: part('brows'), cap: part('cap'), zz: part('zz') },
  };
}

export function applyPose(rig, input) {
  const p = { ...REST, ...input }, s = rig.parts;
  tf(s.all, JOINTS.body, `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${2 - p.squash}, ${p.squash})`);
  tf(s.page, JOINTS.page, `rotate(${p.page}deg)`);
  tf(s.head, JOINTS.head, `rotate(${p.head}deg)`);
  tf(s.armL, JOINTS.armL, `rotate(${p.armL}deg)`);
  tf(s.armR, JOINTS.armR, `rotate(${p.armR}deg)`);
  tf(s.legL, JOINTS.legL, `rotate(${p.legL}deg)`);
  tf(s.legR, JOINTS.legR, `rotate(${p.legR}deg)`);
  tf(s.stem, JOINTS.stem, `rotate(${p.stem}deg)`);
  tf(s.leafL, JOINTS.leafL, `rotate(${p.leafL}deg)`);
  tf(s.leafR, JOINTS.leafR, `rotate(${p.leafR}deg)`);
  tf(s.eyes, JOINTS.eyes, `translate(${p.lookX}px, ${p.lookY}px) scaleY(${1 - 0.9 * clamp(p.blink)})`);
  if (s.shadow) { s.shadow.style.transformOrigin = '100px 230px'; s.shadow.style.transform = `translateX(${p.x}px) scaleX(${1 - Math.min(0.6, Math.abs(Math.min(0, p.y)) / 90)})`; }
  rig.svg.dataset.mood = p.mood;
  rig.svg.dataset.eyes = p.blink > 0.92 ? 'closed' : p.mood === 'grin' ? 'happy' : 'open';
  s.brows.style.opacity = String(p.brows);
  s.zz.style.opacity = String(p.zz);
  s.cap.style.opacity = String(p.cap);
  s.cap.style.transform = `translateY(${(1 - p.cap) * -24}px)`;
}

/* ---------- Coreografías: funciones puras del progreso 0..1 ---------- */
export function walkCycle(phase, amp = 1) {
  const s = Math.sin(phase * Math.PI * 2), c = Math.cos(phase * Math.PI * 2);
  return { legL: s * 26 * amp, legR: -s * 26 * amp, armL: -s * 22 * amp, armR: s * 22 * amp, y: -Math.abs(c) * 5 * amp, rot: s * 2.5 * amp, leafL: s * 6, leafR: -s * 8, stem: s * 2 };
}

// Apertura: entra caminando, salta al titular, descansa y sale (mismas fases que openingPose).
export function openingRigPose(phase, progress) {
  const p = clamp(progress);
  if (phase === 'enter' || phase === 'walk') return { ...walkCycle(p * 7), mood: 'smile', lookX: 2 };
  if (phase === 'hop') {
    const t = clamp((p - 0.5) / 0.18), arc = Math.sin(t * Math.PI);
    return { squash: t < 0.15 ? mix(1, 0.86, t / 0.15) : t > 0.85 ? mix(1.06, 0.9, (t - 0.85) / 0.15) : mix(0.92, 1.08, arc), armL: 120 * arc, armR: -120 * arc, legL: -18 * arc, legR: 18 * arc, mood: 'o', leafR: -18 * arc, leafL: 14 * arc };
  }
  if (phase === 'rest') {
    const t = smooth((p - 0.68) / 0.19), wave = Math.sin(p * Math.PI * 40);
    return { armR: mix(0, -140, t) + wave * 14 * t, armL: mix(0, 18, t), head: mix(0, -6, t), page: mix(0, -3, t), mood: 'grin', lookX: -2, leafR: wave * 6 * t };
  }
  const t = clamp((p - 0.87) / 0.13);
  return { ...walkCycle(t * 3), mood: 'smile', lookX: 3 };
}

// Escenas del recorrido (progreso de la escena 0..1).
export function scenePose(scene, t, time = 0) {
  const blink = blinkAt(time);
  if (scene === 'mapa') {
    const look = Math.sin(t * Math.PI * 2) * 4;
    return { mood: t > 0.45 ? 'sad' : 'o', brows: smooth((t - 0.3) / 0.3), lookX: look, lookY: -1, head: look * 1.2, armR: mix(0, -96, smooth(t / 0.4)), armL: mix(0, 26, smooth((t - 0.4) / 0.4)), page: -2, blink };
  }
  if (scene === 'arbol') {
    const wave = Math.sin(time / 180) * 16;
    return { mood: t > 0.4 ? 'grin' : 'smile', armR: -130 + wave, armL: mix(0, 40, smooth(t)), head: 4, leafR: wave * 0.5, leafL: -wave * 0.3, lookX: -3, lookY: -2, blink };
  }
  if (scene === 'curva') {
    const cheer = smooth((t - 0.55) / 0.3), hop = Math.abs(Math.sin(time / 160)) * cheer;
    return { mood: cheer > 0.5 ? 'grin' : 'o', armR: mix(-70, -120, cheer), armL: mix(10, 120, cheer), y: -hop * 14, squash: 1 + hop * 0.05, lookX: mix(4, 0, cheer), lookY: mix(-3, 0, cheer), leafR: hop * -12, blink };
  }
  return { blink };
}

// Cierre: entra caminando, bosteza, se gradúa y descansa con los ojos cerrados.
export function closingPose(progress, time = 0) {
  const p = clamp(progress);
  if (p < 0.35) return { ...walkCycle(p * 6, 0.9), x: mix(140, 0, smooth(p / 0.35)), mood: 'smile', lookX: -3 };
  if (p < 0.55) { const t = smooth((p - 0.35) / 0.2); return { mood: 'o', armL: 125 * Math.sin(t * Math.PI), armR: -125 * Math.sin(t * Math.PI), head: -6 * t, blink: t * 0.6, cap: smooth((p - 0.42) / 0.13) }; }
  const t = smooth((p - 0.55) / 0.3), breathe = Math.sin(time / 900) * 0.015;
  return { mood: 'smile', blink: 1, zz: t, cap: 1, page: mix(0, -8, t), head: mix(-6, -12, t), armL: mix(0, 30, t), armR: mix(0, -30, t), squash: 1 - 0.05 * t + breathe, y: 4 * t, leafR: mix(0, 14, t), leafL: mix(0, -10, t) };
}

// Parpadeo natural cada ~3,6 s, de 140 ms.
export function blinkAt(time) {
  const cycle = time % 3600;
  return cycle < 140 ? Math.sin((cycle / 140) * Math.PI) : 0;
}
