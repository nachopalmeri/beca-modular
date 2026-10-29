const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 810 } });
  await p.goto('http://localhost:4178/', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => { const g = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)]; };
    const btn = [...document.querySelectorAll('#simulador button')].map(b => [b.textContent.trim().slice(0, 30), g(b)]);
    return { sim: g(document.querySelector('#simulador')), panels: [...document.querySelectorAll('#simulador .card, #simulador section, #simulador article, #simulador [class*=panel]')].slice(0, 8).map(e => [e.className, g(e)]), btn, students: g(document.querySelector('#student-list')), log: g(document.querySelector('#event-log')), ver: g(document.querySelector('#verificar')), vres: g(document.querySelector('#v-result')) }; });
  console.log(JSON.stringify(r, null, 0));
  await b.close();
})();
