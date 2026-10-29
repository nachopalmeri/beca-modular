// Reloj virtual determinista: reemplaza tiempo, timers, rAF y animaciones CSS
// en cada frame (incluidos iframes) para capturar cuadro por cuadro.
(() => {
  const top = (() => { try { return window.top; } catch { return window; } })();
  if (!top.__VC) top.__VC = { now: 0, flushers: [] };
  const VC = top.__VC;
  const realRAF = window.requestAnimationFrame.bind(window);
  window.__realRAF = realRAF;
  window.__realSetTimeout = window.setTimeout.bind(window);
  const epoch = Date.parse('2026-10-30T15:00:00-03:00');
  const RealDate = Date;
  class VDate extends RealDate { constructor(...a) { if (a.length) super(...a); else super(epoch + VC.now); } static now() { return epoch + VC.now; } }
  window.Date = VDate;
  performance.now = () => VC.now;
  let seq = 0, rafs = [], timers = [];
  window.requestAnimationFrame = cb => { rafs.push({ id: ++seq, cb }); return seq; };
  window.cancelAnimationFrame = id => { rafs = rafs.filter(r => r.id !== id); };
  window.setTimeout = (cb, ms = 0, ...args) => { timers.push({ id: ++seq, due: VC.now + Math.max(0, +ms || 0), cb: typeof cb === 'function' ? () => cb(...args) : () => {} }); return seq; };
  window.clearTimeout = id => { timers = timers.filter(t => t.id !== id); };
  window.setInterval = (cb, ms = 0, ...args) => { const id = ++seq; const tick = due => timers.push({ id, due, cb: () => { tick(VC.now + Math.max(1, ms)); cb(...args); } }); tick(VC.now + Math.max(1, ms)); return id; };
  window.clearInterval = window.clearTimeout;
  const anims = new WeakMap();
  const flush = () => {
    for (let guard = 0; guard < 200; guard++) {
      timers.sort((a, b) => a.due - b.due);
      if (!timers.length || timers[0].due > VC.now) break;
      const t = timers.shift(); try { t.cb(); } catch (e) { console.error(e); }
    }
    const batch = rafs; rafs = [];
    for (const r of batch) { try { r.cb(VC.now); } catch (e) { console.error(e); } }
    if (!document.getAnimations) return;
    for (const a of document.getAnimations()) {
      if (!anims.has(a)) { anims.set(a, VC.now - (a.currentTime || 0)); }
      try { a.pause(); a.currentTime = VC.now - anims.get(a); } catch {}
    }
  };
  VC.flushers.push(flush);
})();
