// Brote vivo en toda la página: apertura, escenas, cierre y compañero fijo.
// El movimiento depende del scroll (cuadro a cuadro); sólo el parpadeo y los gestos de festejo usan el reloj.
import { mountRig, applyPose, walkCycle, openingRigPose, scenePose, closingPose, blinkAt } from './brote-rig.mjs?v=29';

const clamp = v => Math.max(0, Math.min(1, v));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const visible = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };

// Reemplaza la ilustración PNG (que queda como respaldo sin JavaScript) por el Brote articulado.
function swap(figure, extraClass) {
  if (!figure) return null;
  figure.querySelector('.brote-puppet')?.remove();
  figure.querySelector(':scope > img')?.remove();
  figure.classList.add('has-rig');
  const rig = mountRig(figure, extraClass);
  applyPose(rig, {});
  return rig;
}

/* Apertura: misma coreografía que brote-motion.mjs (entra, camina, salta, saluda, sale). */
function mountOpening() {
  const figure = document.querySelector('.brote-opening-mascot');
  const rig = swap(figure, 'br-opening');
  if (!rig) return;
  const render = () => {
    const phase = figure.dataset.broteAction, progress = Number(figure.dataset.broteProgress);
    applyPose(rig, phase && phase !== 'static' && !Number.isNaN(progress) ? openingRigPose(phase, progress) : { mood: 'smile' });
  };
  new MutationObserver(render).observe(figure, { attributes: true, attributeFilter: ['data-brote-progress', 'data-brote-action'] });
  render();
}

/* Escenas: camina mientras el panel se desliza y reacciona a la animación de cada dato. */
function mountScenes() {
  const progress = { mapa: 0, arbol: 0, curva: 0 };
  document.addEventListener('bm-scene', e => { progress[e.detail.scene] = e.detail.t; });
  const actors = [...document.querySelectorAll('.story-panel')].map(panel => ({
    panel, scene: panel.id.replace('story-', ''), rig: swap(panel.querySelector('.story-mascot'), 'br-scene'),
  })).filter(a => a.rig);
  return now => {
    for (const a of actors) {
      if (!visible(a.panel)) continue;
      const left = a.panel.getBoundingClientRect().left;
      if (!reduceMotion.matches && Math.abs(left) > 6 && Math.abs(left) < innerWidth) {
        applyPose(a.rig, { ...walkCycle(-left / 150), mood: 'smile', lookX: left > 0 ? -3 : 3, blink: blinkAt(now) });
      } else {
        applyPose(a.rig, scenePose(a.scene, progress[a.scene], reduceMotion.matches ? 0 : now));
      }
    }
  };
}

/* Cierre: entra con el scroll, bosteza, se gradúa y descansa. */
function mountClosing() {
  const section = document.getElementById('companero');
  const stage = section?.querySelector('.companion-stage');
  const rig = swap(stage, 'br-closing');
  if (!rig) return () => {};
  return now => {
    if (!visible(section)) return;
    if (reduceMotion.matches) { applyPose(rig, closingPose(1, 0)); return; }
    const top = section.getBoundingClientRect().top;
    applyPose(rig, closingPose(clamp((innerHeight - top) / (innerHeight * 0.95)), now));
  };
}

/* Compañero fijo: aparece donde no hay otro Brote en pantalla y camina mientras scrolleás. */
const LINES = {
  hero: ['Hola, soy Brote. Te acompaño en el recorrido.', { armR: -135, mood: 'grin' }, true],
  reglas: ['Primero, reglas claras. Después, la plata.', { armR: -90, mood: 'smile' }],
  simulador: ['Probá armar un programa y seguí cada sat.', { armL: 110, armR: -110, mood: 'grin' }],
  verificar: ['Esto sí es real: verificá un pago.', { armR: -100, mood: 'o', lookX: -3 }],
  lightning: ['Lo bueno de Bitcoin, y lo que todavía no hace.', { armL: 30, armR: -30, mood: 'smile', head: 5 }],
  datos: ['La serie completa, con fuente y fecha.', { armR: -95, mood: 'smile', lookX: -3 }],
  plan: ['Lo construimos en la hackathon.', { armL: 120, armR: -120, mood: 'grin' }],
  fuentes: ['Todo lo que dije tiene fuente.', { mood: 'smile' }],
};

function mountCompanion() {
  const aside = document.getElementById('br-companion');
  const bubble = document.getElementById('br-bubble');
  const rig = aside && mountRig(document.getElementById('br-companion-body'), 'br-fixed');
  if (!rig) return () => {};
  const hideFor = [document.getElementById('recorrido'), document.getElementById('companero')].filter(Boolean);
  const sections = [document.querySelector('.hero'), ...Object.keys(LINES).filter(k => k !== 'hero').map(id => document.getElementById(id))].filter(Boolean);
  let current = null, phase = 0, speed = 0, lastY = scrollY;
  const say = key => {
    if (key === current) return;
    current = key;
    bubble.textContent = LINES[key][0];
    bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
  };
  return now => {
    const hidden = hideFor.some(visible);
    aside.classList.toggle('is-away', hidden);
    if (hidden) return;
    const mid = innerHeight * 0.5;
    const section = sections.find(s => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; }) || sections[0];
    say(section.classList.contains('hero') ? 'hero' : section.id);
    const [, gesture, waves] = LINES[current];
    const dy = scrollY - lastY; lastY = scrollY;
    if (reduceMotion.matches) { applyPose(rig, gesture); return; }
    phase += dy / 140;                                       // un paso cada ~140 px de scroll
    speed = Math.max(Math.min(1, Math.abs(dy) / 18), speed * 0.9); // se detiene cuando dejás de scrollear
    const walk = walkCycle(phase, speed);
    const wave = waves ? Math.sin(now / 170) * 14 : 0;
    applyPose(rig, {
      ...gesture, ...walk,
      armL: (gesture.armL ?? 0) * (1 - speed) + walk.armL * speed,
      armR: (gesture.armR ?? 0) * (1 - speed) + walk.armR * speed + wave * (1 - speed),
      mood: speed > 0.4 ? 'smile' : gesture.mood, blink: blinkAt(now),
    });
  };
}

mountOpening();
const tickers = [mountScenes(), mountClosing(), mountCompanion()];
const loop = now => { for (const tick of tickers) tick(now); requestAnimationFrame(loop); };
requestAnimationFrame(loop);
