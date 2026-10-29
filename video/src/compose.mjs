// Composición determinista: renderAt(t) dibuja el cuadro exacto del segundo t.
// Dos montajes con los mismos materiales: ?mode=promo (60 s) y ?mode=loop (40 s, cíclico).
import { mountRig, applyPose, walkCycle, openingRigPose, closingPose, blinkAt } from '/brote-rig.mjs';

const MODE = new URLSearchParams(location.search).get('mode') || 'promo';
const FPS = 30;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ramp = (t, a, b) => clamp((t - a) / (b - a));
const smooth = v => { const t = clamp(v); return t * t * (3 - 2 * t); };
const easeOut = v => 1 - Math.pow(1 - clamp(v), 3);
const easeIO = v => { const t = clamp(v); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const lerp = (a, b, t) => a + (b - a) * t;
const layers = document.getElementById('layers');
const pending = new Set();
const PLATE = (name, i) => `/video/plates/${name}/${String(Math.max(0, Math.round(i))).padStart(6, '0')}.jpg`;
const PHOTO = name => `/video/assets/photos/${name}.png`;

const el = (html, parent = layers) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const n = d.firstElementChild; parent.appendChild(n); return n; };
const words = html => html.replace(/(<[^>]+>)|([^<\s]+)/g, (m, tag, w) => tag || `<span class="w">${w}</span>`);
function reveal(root, lt, delay = 0, per = .07, dur = .8) {
  root.querySelectorAll('.w').forEach((w, i) => {
    const e = easeOut(ramp(lt, delay + i * per, delay + i * per + dur));
    w.style.opacity = e; w.style.transform = `translateY(${(1 - e) * 26}px)`; w.style.filter = e < 1 ? `blur(${(1 - e) * 8}px)` : 'none';
  });
}
function setSrc(img, src) {
  if (img.dataset.src === src) return;
  img.dataset.src = src;
  const p = new Promise(r => { img.onload = img.onerror = () => r(); });
  img.src = src; pending.add(p); p.then(() => pending.delete(p));
}

// ---------- Tipos de plano ----------
const shots = [];
function shot(start, end, { fin = .7, fout = .7, build, update }) {
  const node = el('<div class="layer"></div>');
  const s = { start, end, fin, fout, node, update };
  build?.(node, s);
  shots.push(s);
  return s;
}

function photo(start, end, name, { from, to, side = 'l', eyebrow, head, sub, delay = .5, fin, fout, extra } = {}) {
  return shot(start, end, {
    fin, fout,
    build(n, s) {
      s.img = el(`<img class="fill" alt="">`, n); setSrc(s.img, PHOTO(name));
      if (head) {
        el(`<div class="scrim-${side}"></div>`, n);
        s.copy = el(`<div class="copy" style="${side === 'l' ? 'left:120px' : 'right:120px;text-align:right'};bottom:150px">
          ${eyebrow ? `<div class="eyebrow">${words(eyebrow)}</div>` : ''}<h1 class="head">${words(head)}</h1>${sub ? `<div class="sub">${words(sub)}</div>` : ''}</div>`, n);
      }
      extra?.build?.(n, s);
    },
    update(lt, d, t, s) {
      const k = lt / d;
      const sc = lerp(from.s, to.s, k), x = lerp(from.x || 0, to.x || 0, k), y = lerp(from.y || 0, to.y || 0, k);
      s.img.style.transform = `translate(${x}px,${y}px) scale(${sc})`;
      if (s.copy) reveal(s.copy, lt, delay);
      extra?.update?.(lt, d, t, s);
    },
  });
}

// Plano a pantalla completa de la web real (plate 2160x1215 = 16:9)
function plate(start, end, name, frameAt, { focus = [.5, .5], z0 = 1, z1 = 1.06, chip, fin, fout, extra } = {}) {
  return shot(start, end, {
    fin, fout,
    build(n, s) {
      s.img = el('<img class="fill" alt="">', n);
      s.img.style.transformOrigin = `${focus[0] * 100}% ${focus[1] * 100}%`;
      if (chip) s.chip = el(`<div class="chip" style="left:64px;bottom:64px">${chip}</div>`, n);
      extra?.build?.(n, s);
    },
    update(lt, d, t, s) {
      setSrc(s.img, PLATE(name, frameAt(lt, d)));
      s.img.style.transform = `scale(${lerp(z0, z1, easeIO(lt / d))})`;
      if (s.chip) { const e = easeOut(ramp(lt, .6, 1.3)); s.chip.style.opacity = e; s.chip.style.transform = `translateY(${(1 - e) * 14}px)`; }
      extra?.update?.(lt, d, t, s);
    },
  });
}

function rig(parent, w, extra = '') {
  const wrap = el(`<div class="rigwrap" style="width:${w}px;height:${w * 1.2}px"></div>`, parent);
  const r = mountRig(wrap, extra);
  return { wrap, r };
}

// ---------- Montaje promocional (60 s) ----------
function promo() {
  // Mapas de frames de los plates (ver tools/capture.cjs: story hold mapa 141-276, árbol 342-477, curva 543-678)
  const storyMap = (lt, d) => lerp(112, 276, lt / d);
  const storyCurve = (lt, d) => lerp(540, 678, lt / d);
  const storyTree = (lt, d) => lerp(342, 477, lt / d);

  photo(0, 5.2, 'kitchen', { fin: .9, from: { s: 1.12, x: 30 }, to: { s: 1.03, x: -10 }, eyebrow: 'Argentina · 2026', head: 'Estudiar cuesta<br><em>todos los meses.</em>', delay: .6 });
  plate(4.5, 9.8, 'story', storyMap, { focus: [.56, .52], z0: 1.02, z1: 1.1, chip: '<b>DiNIEE</b> · abandono interanual 2024-25 · dato oficial' });
  plate(9.1, 13.8, 'story', storyCurve, { focus: [.66, .5], z0: 1.03, z1: 1.1, chip: '<b>Progresar</b> · valor real desde sep-2024 · IPC-INDEC' });
  photo(13.1, 17.9, 'supporter', { from: { s: 1.04, x: 0 }, to: { s: 1.12, x: 40 }, side: 'r', eyebrow: 'Egresados · empresas · bitcoiners', head: 'Y hay personas<br>que <em>quieren ayudar.</em>', delay: .5 });
  plate(17.2, 21.6, 'story', storyTree, { focus: [.62, .55], z0: 1.04, z1: 1.12, chip: '<b>Cada hoja, un aporte</b> · ilustrativo' });

  // Presentación de marca: Brote entra, salta y saluda; aparece la marca y se llenan los tramos.
  shot(20.9, 26.6, {
    build(n, s) {
      el('<div class="brand-bg"></div>', n);
      el('<div class="floor" style="top:470px"></div>', n);
      s.b = rig(n, 250); s.b.wrap.style.top = '168px';
      s.mark = el(`<div class="wordmark" style="position:absolute;left:0;right:0;top:530px;text-align:center"><span class="logo"><i></i><i></i><i></i><i></i></span><b>Beca</b>Modular</div>`, n);
      s.tag = el(`<div class="tagline" style="position:absolute;left:0;right:0;top:712px;text-align:center">${words('Financiar una carrera. <em>Un tramo a la vez.</em>')}</div>`, n);
      s.bar = el('<div class="tramos" style="position:absolute;left:600px;width:720px;top:830px"><span><i></i></span><span><i></i></span><span><i></i></span><span><i></i></span></div>', n);
    },
    update(lt, d, t, s) {
      const cx = 960 - 125, walkEnd = 1.5;
      let x = cx, pose;
      if (lt < walkEnd) { const k = easeOut(lt / walkEnd); x = lerp(-300, cx, k); pose = { ...walkCycle(lt * 1.6), mood: 'smile', lookX: 3 }; }
      else if (lt < 2.2) pose = openingRigPose('hop', lerp(.5, .68, (lt - walkEnd) / .7));
      else pose = openingRigPose('rest', lerp(.68, .87, clamp((lt - 2.2) / 1.6)));
      pose.blink = Math.max(pose.blink || 0, blinkAt(lt * 1000 + 900));
      s.b.wrap.style.left = x + 'px'; applyPose(s.b.r, pose);
      const m = easeOut(ramp(lt, 1.7, 2.6)); s.mark.style.opacity = m; s.mark.style.transform = `translateY(${(1 - m) * 30}px)`; s.mark.style.filter = m < 1 ? `blur(${(1 - m) * 10}px)` : 'none';
      reveal(s.tag, lt, 2.4, .08);
      s.bar.style.opacity = easeOut(ramp(lt, 2.9, 3.3));
      s.bar.querySelectorAll('i').forEach((i, k) => { i.style.transform = `scaleX(${easeIO(ramp(lt, 3.2 + k * .55, 3.7 + k * .55))})`; });
    },
  });

  // Cómo funciona: la web real dentro de una ventana, con los cuatro pasos.
  const simFrame = t => {
    if (t < 28.8) return (t - 26.0) * 30;
    if (t < 33.3) return 84 + (t - 28.8) * 45;
    if (t < 35.8) return 287;
    if (t < 40.8) return 287 + (t - 35.8) * 42;
    return Math.min(730, 497 + (t - 40.8) * 39);
  };
  // Encuadres de cámara (en coordenadas 0..1 de la captura) por paso
  const cams = [
    { t: 26.0, f: [.3, .62], z: 1.18 },
    { t: 28.4, f: [.3, .66], z: 1.28 },
    { t: 29.3, f: [.7, .42], z: 1.42 },
    { t: 33.0, f: [.7, .45], z: 1.45 },
    { t: 35.8, f: [.5, .4], z: 1.12 },
    { t: 39.0, f: [.5, .4], z: 1.16 },
    { t: 40.3, f: [.72, .42], z: 1.3 },
    { t: 41.4, f: [.4, .55], z: 1.18 },
    { t: 43.0, f: [.33, .62], z: 1.3 },
    { t: 46.8, f: [.33, .66], z: 1.36 },
  ];
  const cam = t => {
    let i = cams.findIndex(c => c.t > t); if (i < 0) return cams.at(-1); if (i === 0) return cams[0];
    const a = cams[i - 1], b = cams[i], k = easeIO((t - a.t) / (b.t - a.t));
    return { f: [lerp(a.f[0], b.f[0], k), lerp(a.f[1], b.f[1], k)], z: lerp(a.z, b.z, k) };
  };
  const STEPS = [
    ['Reglas selladas', 'Hitos, montos y devolución quedan fijos antes del primer aporte.', 26.0, 28.8],
    ['Aportes en sats', 'Sponsors completan la meta. Si no se completa, cada aporte vuelve.', 28.8, 33.3],
    ['La tutora valida', 'Con el hito confirmado, el tramo se paga por Lightning en segundos.', 35.8, 40.8],
    ['Recibo verificable', 'Cualquiera comprueba el pago desde su navegador, sin pedir permiso.', 40.8, 47.2],
  ];
  shot(25.7, 47.4, {
    build(n, s) {
      el('<div class="brand-bg"></div>', n);
      s.title = el(`<div class="eyebrow" style="position:absolute;left:110px;top:150px">Cómo funciona · la web real</div>`, n);
      s.steps = el(`<div class="steps">${STEPS.map(([h, p], i) => `<div class="step"><div class="n">${i + 1}</div>${i < 3 ? '<div class="rail"><i></i></div>' : ''}<h3>${h}</h3><p>${p}</p></div>`).join('')}</div>`, n);
      s.win = el(`<div class="window" style="left:620px;top:150px;width:1200px;height:719px"><div class="bar"><i></i><i></i><i></i><span class="url">beca-clara.vercel.app/<b>#simulador</b></span></div><span class="sim-tag">Simulación · sin dinero real</span><div class="view"><img alt=""></div></div>`, n);
      s.img = s.win.querySelector('img');
    },
    update(lt, d, t, s) {
      setSrc(s.img, PLATE('sim', simFrame(t)));
      s.win.querySelector('.url b').textContent = simFrame(t) >= 520 ? '#verificar' : '#simulador';
      const c = cam(t), W = 1200, H = 675;
      // escala con el punto de foco centrado (sin dejar bordes vacíos)
      const tx = clamp(W / 2 - c.f[0] * W * c.z, W - W * c.z, 0), ty = clamp(H / 2 - c.f[1] * H * c.z, H - H * c.z, 0);
      s.img.style.transform = `translate(${tx}px,${ty}px) scale(${c.z})`;
      const wi = easeOut(ramp(lt, .1, .9)); s.win.style.transform = `translateY(${(1 - wi) * 40}px)`; s.win.style.opacity = wi;
      s.steps.querySelectorAll('.step').forEach((st, i) => {
        const [, , a, b] = STEPS[i];
        const on = smooth(ramp(t, a - .2, a + .3)) * (1 - .55 * smooth(ramp(t, b - .1, b + .4)));
        const seen = smooth(ramp(t, a - .2, a + .3));
        st.style.opacity = .28 + .72 * Math.max(on, seen * .45);
        st.querySelector('.n').style.background = on > .5 ? 'rgba(229,199,140,.16)' : 'transparent';
        const rail = st.querySelector('.rail i'); if (rail) rail.style.transform = `scaleY(${ramp(t, a, b)})`;
        st.querySelector('p').style.opacity = .35 + .65 * on;
      });
      s.title.style.opacity = easeOut(ramp(lt, .2, 1));
    },
  });

  photo(33.0, 36.1, 'tutor', { fin: .5, fout: .5, from: { s: 1.03, x: 0 }, to: { s: 1.09, x: -30 }, side: 'r', eyebrow: 'Paso 3', head: 'Una tutora<br><em>confirma el hito.</em>', delay: .25 });
  photo(46.9, 52.3, 'hallway', { from: { s: 1.06, x: 20 }, to: { s: 1.0, x: -20 }, eyebrow: 'Beca Modular', head: 'Cada tramo,<br><em>cuando se gana.</em>', sub: 'Lo que no se usa vuelve a cada sponsor.', delay: .5 });

  // Cierre: Brote se gradúa y descansa; marca y llamado.
  shot(51.6, 60.0, {
    fout: .9,
    build(n, s) {
      el('<div class="brand-bg"></div>', n);
      el('<div class="floor" style="top:556px;left:180px;right:1100px"></div>', n);
      s.b = rig(n, 300, 'br-closing'); s.b.wrap.style.left = '340px'; s.b.wrap.style.top = '196px';
      s.copy = el(`<div style="position:absolute;left:860px;top:300px;width:960px">
        <div class="wordmark" style="font-size:118px"><span class="logo"><i></i><i></i><i></i><i></i></span><b>Beca</b>Modular</div>
        <div class="tagline" style="margin-top:34px;font-size:44px">${words('Financiar una carrera. <em>Un tramo a la vez.</em>')}</div>
        <div class="cta" style="margin-top:58px;font:500 30px/1 var(--mono);color:var(--paper);letter-spacing:.02em">Probá el simulador → <span style="color:var(--gold)">beca-clara.vercel.app</span></div></div>`, n);
      s.fine = el('<div class="fine" style="left:860px;top:860px;width:960px">Propuesta en validación · LABITCONF EDU 2026<br>La web simula los pagos: no recibe fondos.</div>', n);
    },
    update(lt, d, t, s) {
      applyPose(s.b.r, closingPose(clamp(lt / 6.2), lt * 1000));
      const m = easeOut(ramp(lt, .6, 1.5)); s.copy.firstElementChild.style.opacity = m; s.copy.firstElementChild.style.transform = `translateY(${(1 - m) * 26}px)`;
      reveal(s.copy.children[1], lt, 1.2, .08);
      const c = easeOut(ramp(lt, 2.4, 3.2)); s.copy.children[2].style.opacity = c; s.copy.children[2].style.transform = `translateY(${(1 - c) * 18}px)`;
      s.fine.style.opacity = easeOut(ramp(lt, 3.2, 4));
    },
  });
  return 60;
}

// ---------- Loop ambiental (45 s): mismo material, ritmo calmo, último cuadro = primero ----------
function loop() {
  document.body.classList.add('loop');
  const T = 45;
  const label = (n, h, p) => ({
    build(node, s) {
      s.lab = el(`<div class="chip" style="right:64px;bottom:${p ? 118 : 58}px;font-size:19px"><b>${n}</b> · ${h}</div>`, node);
      if (p) s.sub = el(`<div class="chip" style="right:64px;bottom:58px;font-size:15px;color:#cfc6b2">${p}</div>`, node);
    },
    update(lt, d, t, s) { const e = easeOut(ramp(lt, .9, 1.8)); s.lab.style.opacity = e; s.lab.style.transform = `translateY(${(1 - e) * 10}px)`; if (s.sub) s.sub.style.opacity = e; },
  });
  // La biblioteca abre y cierra el ciclo: la escala depende del tiempo "envuelto", sin salto en la unión.
  const lib = shot(-1.6, 6.4, {
    fin: 1.6,
    build(n, s) { s.img = el('<img class="fill" alt="">', n); setSrc(s.img, PHOTO('library')); el('<div class="scrim-b"></div>', n); },
    update(lt, d, t, s) { const u = lt - 1.6; s.img.style.transform = `scale(${1.04 + u * .006}) translateX(${-u * 3}px)`; },
  });
  lib.wrap = true;
  plate(5.4, 12.4, 'story', (lt, d) => lerp(120, 276, clamp(lt / (d * .8))), { fin: 1, fout: 1, focus: [.56, .52], z0: 1.02, z1: 1.08, extra: label('01', 'Ubicar el problema', 'Abandono interanual · DiNIEE 2024-25') });
  plate(11.4, 18.4, 'story', (lt, d) => lerp(342, 477, clamp(lt / (d * .8))), { fin: 1, fout: 1, focus: [.62, .55], z0: 1.03, z1: 1.09, extra: label('02', 'Sumar apoyos', 'Cada hoja, un aporte · ilustrativo') });
  plate(17.4, 24.4, 'story', (lt, d) => lerp(540, 678, clamp(lt / (d * .8))), { fin: 1, fout: 1, focus: [.66, .5], z0: 1.03, z1: 1.09, extra: label('03', 'Levantar la beca', 'Valor real de Progresar · IPC-INDEC') });
  plate(23.4, 30.4, 'sim', (lt, d) => lerp(300, 497, lt / d), { fin: 1, fout: 1, focus: [.5, .45], z0: 1.06, z1: 1.12, extra: label('04', 'Pagar por hito', 'Simulación en la web · sin dinero real') });
  plate(29.4, 35.4, 'sim', (lt, d) => lerp(560, 730, clamp(lt / (d * .85))), { fin: 1, fout: 1, focus: [.36, .6], z0: 1.12, z1: 1.18, extra: label('05', 'Verificar cada pago', 'SHA-256(preimage) = payment hash') });
  photo(34.4, 40.4, 'hallway', { fin: 1, fout: 1, from: { s: 1.08, x: 20 }, to: { s: 1.02, x: -20 }, extra: label('06', 'Cada tramo, cuando se gana') });
  shot(39.4, 45.0, {
    fin: 1, fout: 0,
    build(n, s) {
      el('<div class="brand-bg"></div>', n); s.b = rig(n, 250); s.b.wrap.style.left = '835px'; s.b.wrap.style.top = '230px';
      el('<div class="floor" style="top:528px;left:600px;right:600px"></div>', n);
      s.tag = el(`<div class="tagline" style="position:absolute;left:0;right:0;top:600px;text-align:center">${words('Financiar una carrera. <em>Un tramo a la vez.</em>')}</div>`, n);
    },
    update(lt, d, t, s) { applyPose(s.b.r, closingPose(.62 + lt * .02, t * 1000)); reveal(s.tag, lt, .8, .08); },
  });
  return T;
}

const DURATION = MODE === 'loop' ? loop() : promo();

function renderAt(t) {
  for (const s of shots) {
    let tt = t;
    if (s.wrap && MODE === 'loop' && t > s.end) tt = t - DURATION; // tramo final del ciclo
    const vis = tt >= s.start && tt <= s.end;
    let o = 0;
    if (vis) o = smooth(ramp(tt, s.start, s.start + s.fin)) * (s.fout ? 1 - smooth(ramp(tt, s.end - s.fout, s.end)) : 1);
    if (s.wrap && tt < s.start + s.fin && s.start < 0 && tt >= 0) o = 1; // en t=0 la biblioteca ya está entera
    s.node.style.display = o > 0.001 ? '' : 'none';
    if (s.wrap) s.node.style.zIndex = tt < 0 ? 5 : ''; // en el cierre del ciclo, la biblioteca entra por encima
    s.node.style.opacity = o;
    if (o > 0.001) s.update(tt - s.start, s.end - s.start, tt, s);
  }
  // grano animado de forma determinista
  const f = Math.round(t * FPS);
  document.querySelector('#grain rect').setAttribute('transform', `translate(${(f * 37) % 40 - 20},${(f * 23) % 40 - 20})`);
  return Promise.all([...pending]).then(() => document.fonts.ready);
}

window.COMPOSE = { MODE, FPS, DURATION, renderAt };
window.__composeReady = true;
