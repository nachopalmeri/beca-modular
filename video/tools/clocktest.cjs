const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript({ path: __dirname + '/vclock.js' });
  const p = await ctx.newPage();
  p.on('console', m => m.type() === 'error' && console.log('ERR', m.text()));
  await p.goto('http://localhost:4178/', { waitUntil: 'networkidle' });
  const step = async ms => { await p.evaluate(ms => { const V = window.__VC; V.now += ms; V.flushers.forEach(f => f()); }, ms); await p.evaluate(() => new Promise(r => window.__realRAF(() => window.__realRAF(r)))); await p.evaluate(() => { window.__VC.flushers.forEach(f => f()); }); };
  for (let i = 0; i < 30; i++) await step(33.3);
  const y0 = 960, y1 = 8400, N = 360;
  for (let i = 0; i <= N; i++) {
    const t = i / N; const y = y0 + (y1 - y0) * t;
    await p.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await step(33.3);
    if (i % 30 === 0) await p.screenshot({ path: `${out}/f${String(i).padStart(4,'0')}.jpg`, quality: 85 });
  }
  await b.close();
})();
