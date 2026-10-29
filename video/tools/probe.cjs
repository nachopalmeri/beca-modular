const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });
  await ctx.addInitScript({ path: __dirname + '/vclock.js' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4178/', { waitUntil: 'networkidle' });
  const info = await p.evaluate(() => { const r = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; }; return { rec: r('#recorrido'), comp: r('#companero'), reglas: r('#reglas'), sim: r('#simulador'), ver: r('#verificar'), H: document.documentElement.scrollHeight }; });
  console.log(JSON.stringify(info));
  for (let y = info.rec; y < info.comp + 200; y += 150) {
    await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y);
    await p.evaluate(() => new Promise(r => window.__realRAF(() => window.__realRAF(r))));
    await p.evaluate(() => { const V = window.__VC; for(let i=0;i<40;i++){V.now += 33; V.flushers.forEach(f => f());} });
    const L = await p.evaluate(() => ['#story-mapa', '#story-arbol', '#story-curva'].map(s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().left) : null; }));
    console.log(y, L.join(' '));
  }
  await b.close();
})();
