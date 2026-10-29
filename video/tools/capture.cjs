// Graba "plates" de la web real cuadro por cuadro con reloj virtual.
// Uso: node capture.cjs <plate> [baseUrl]   (plates: story, sim, hero, companero)
// Salida: video/plates/<plate>/000000.jpg … a 30 fps, 1440x810 CSS px con DPR 1.5.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FPS = 30, DT = 1000 / FPS;
const plate = process.argv[2];
const BASE = process.argv[3] || 'http://localhost:4178/';
const OUT = path.join(__dirname, '..', 'plates', plate);
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1.5 });
  await ctx.addInitScript({ path: path.join(__dirname, 'vclock.js') });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });

  let frame = 0;
  const tick = async () => {
    await p.evaluate(() => new Promise(r => window.__realRAF(() => window.__realRAF(r))));
    await p.evaluate(dt => { const V = window.__VC; V.now += dt; V.flushers.forEach(f => f()); }, DT);
  };
  const shoot = async () => {
    await tick();
    await p.screenshot({ path: path.join(OUT, String(frame++).padStart(6, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  };
  const warm = async n => { for (let i = 0; i < n; i++) await tick(); };
  const scrollY = () => p.evaluate(() => scrollY);
  const setY = y => p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
  const hold = async s => { for (let i = 0, n = Math.round(s * FPS); i < n; i++) await shoot(); };
  const scrollTo = async (y1, s) => {
    const y0 = await scrollY(); const n = Math.max(1, Math.round(s * FPS));
    for (let i = 1; i <= n; i++) { await setY(y0 + (y1 - y0) * ease(i / n)); await shoot(); }
  };
  const top = sel => p.evaluate(s => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY), sel);

  // Cursor sintético para que las interacciones se lean en video.
  await p.evaluate(() => {
    const c = document.createElement('div');
    c.id = '__cursor';
    c.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28"><path d="M5 3l17 10-7.5 1.6L11 22z" fill="#f7efdf" stroke="#14110d" stroke-width="1.6" stroke-linejoin="round"/></svg><i></i>';
    Object.assign(c.style, { position: 'fixed', left: '0', top: '0', zIndex: 99999, pointerEvents: 'none', opacity: '0', transform: 'translate(720px,600px)', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.45))' });
    const ring = c.querySelector('i');
    Object.assign(ring.style, { position: 'absolute', left: '-14px', top: '-14px', width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e5c78c', opacity: '0', transform: 'scale(.4)' });
    document.body.appendChild(c);
    window.__cur = { x: 720, y: 600 };
  });
  const cursorShow = v => p.evaluate(v => { document.getElementById('__cursor').style.opacity = v; }, v);
  const cursorAt = (x, y) => p.evaluate(([x, y]) => { window.__cur = { x, y }; document.getElementById('__cursor').style.transform = `translate(${x - 4}px,${y - 2}px)`; }, [x, y]);
  const center = sel => p.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
  const moveTo = async (sel, s = .7) => {
    const [x1, y1] = await center(sel); const { x: x0, y: y0 } = await p.evaluate(() => window.__cur);
    const n = Math.round(s * FPS);
    for (let i = 1; i <= n; i++) { const e = ease(i / n); await cursorAt(x0 + (x1 - x0) * e, y0 + (y1 - y0) * e - Math.sin(Math.PI * e) * 30); await shoot(); }
  };
  const ripple = async () => {
    for (let i = 0; i < 9; i++) {
      await p.evaluate(k => { const r = document.querySelector('#__cursor i'); r.style.opacity = String(1 - k / 9); r.style.transform = `scale(${.4 + k / 9 * 1.2})`; }, i);
      await shoot();
    }
    await p.evaluate(() => { document.querySelector('#__cursor i').style.opacity = '0'; });
  };
  const click = async sel => { await moveTo(sel); await p.evaluate(s => document.querySelector(s).click(), sel); await ripple(); };
  const clickText = async (scope, re) => {
    const id = await p.evaluate(([scope, src]) => { const rx = new RegExp(src); const b = [...document.querySelectorAll(scope + ' button')].find(b => rx.test(b.textContent.trim())); b.id ||= '__b' + Math.random().toString(36).slice(2); return '#' + b.id; }, [scope, re]);
    await click(id);
  };
  const type = async (sel, text, cps = 18) => {
    await moveTo(sel, .5);
    await p.evaluate(s => { const e = document.querySelector(s); e.focus(); e.value = ''; }, sel);
    for (const ch of text) {
      await p.evaluate(([s, ch]) => { const e = document.querySelector(s); e.value += ch; e.dispatchEvent(new Event('input', { bubbles: true })); }, [sel, ch]);
      for (let i = 0; i < Math.max(1, Math.round(FPS / cps)); i++) await shoot();
    }
    await p.evaluate(s => document.querySelector(s).dispatchEvent(new Event('change', { bubbles: true })), sel);
  };

  if (plate === 'story') {
    const rec = await top('#recorrido');
    // posiciones medidas con probe.cjs a 1440x810: mapa centrado ≈ rec+2462, árbol ≈ rec+3695, curva ≈ rec+4922
    await setY(rec); await warm(20);
    await hold(1.5);
    await scrollTo(rec + 2462, 3.2); await hold(4.5);
    await scrollTo(rec + 3695, 2.2); await hold(4.5);
    await scrollTo(rec + 4922, 2.2); await hold(4.5);
    await scrollTo(await top('#companero') - 110, 2.2); await hold(4);
  } else if (plate === 'hero') {
    await setY(0); await warm(10); await hold(5);
  } else if (plate === 'sim') {
    await setY(await top('#simulador .panel.config') - 140); await warm(20);
    await cursorShow('1'); await hold(.6);
    await clickText('#simulador', '^Sellar reglas'); await hold(1.2);
    await type('#fund-alias', 'Egresada 2009'); await type('#fund-sats', '60000', 12);
    await clickText('#simulador', '^Aportar'); await hold(.8);
    await click('#btn-fill'); await hold(1.6);
    await cursorShow('0');
    await scrollTo(await top('#simulador .panel.students') - 110, 1.4);
    await cursorShow('1');
    await click('#student-list .student button'); await hold(1.6);
    await click('#student-list .student:nth-child(2) button'); await hold(2);
    await cursorShow('0');
    await scrollTo(await top('#verificar') + 40, 1.6); await hold(.4);
    await cursorShow('1');
    await click('#v-sample'); await hold(.8);
    await clickText('#verificar', '^Verificar$'); await hold(3);
  } else if (plate === 'companero') {
    await setY(await top('#companero') - 110); await warm(20); await hold(5);
  }
  console.log(plate, frame, 'frames');
  await browser.close();
})();
