const { chromium } = require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer((request, response) => {
    const file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    fs.readFile(file, (error, content) => {
      if (error) { response.writeHead(404).end(); return; }
      response.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.css': 'text/css', '.png': 'image/png' })[path.extname(file)] || 'application/octet-stream');
      response.end(content);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.BECA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`http://127.0.0.1:${server.address().port}/demo.html`);
    await page.locator('#funding-config-panel summary').click();
    await page.locator('#funding-target').fill('120');
    await page.locator('#milestone-one-amount').fill('60');
    await page.locator('#milestone-two-amount').fill('60');
    await page.locator('#funding-configure').click();
    await page.locator('#funding-amount').fill('60');
    await page.locator('#funding-add').click();
    const meter = page.locator('.funding-progress');
    const ratio = Number(await meter.getAttribute('aria-valuenow')) / Number(await meter.getAttribute('aria-valuemax'));
    assert.equal(ratio, .5, 'accessible meter must announce 50% when 60 of 120 USD is funded');

    await page.locator('#funding-reset').click();
    await page.locator('#funding-config-panel summary').click();
    await page.locator('#funding-module').fill('Módulo editado sin aplicar');
    await page.locator('#funding-config-panel summary').click();
    await page.locator('#funding-add').click();
    assert.match(await page.locator('#funding-contributors').innerText(), /Todavía no hay aportes/);
    assert.equal(await page.locator('#funding-config-panel').getAttribute('open'), '', 'unapplied rules must reopen for review');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'funding-configure');
    await page.locator('#funding-complete').click();
    assert.match(await page.locator('#funding-contributors').innerText(), /Todavía no hay aportes/);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'funding-configure');
    await page.screenshot({ path: path.join(root, 'docs/captures/demo-unapplied-rules-mobile.png') });
    await page.locator('#funding-configure').click();
    await page.locator('#funding-add').click();
    assert.match(await page.locator('#funding-module-summary').innerText(), /Módulo editado sin aplicar/);
    assert.equal(await page.locator('#funding-module').isDisabled(), true);

    await page.locator('#funding-reset').click();
    await page.locator('#funding-config-panel summary').click();
    await page.locator('#milestone-one-amount').fill('50');
    await page.locator('#funding-config-panel summary').click();
    await page.locator('[data-funding-preset="shared"]').click();
    assert.equal(await page.locator('#funding-config-feedback').isVisible(), true, 'invalid preset must expose its error inside the disclosure');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'milestone-one-amount');
    assert.match(await page.locator('#funding-contributors').innerText(), /Todavía no hay aportes/);
    await page.screenshot({ path: path.join(root, 'docs/captures/demo-rule-error-mobile.png') });
    await page.locator('#funding-reset').click();
    assert.equal(await page.locator('#funding-config-feedback').isVisible(), false);
    await page.locator('#funding-add').click();
    assert.match(await page.locator('#funding-contributors').innerText(), /Aportante 1/);
    await page.goto(`http://127.0.0.1:${server.address().port}/demo.html`);
    await page.locator('[data-funding-preset="shared"]').click();
    await page.locator('#progress-kind').selectOption('institution-test');
    await page.locator('#funding-progress-record').click();
    const historicalBalance=await page.locator('#funding-latest-balance').innerText();
    await page.locator('#funding-review').click();
    assert.match(await page.locator('#funding-latest-current').innerText(),/50 USD liberados.*50 USD reservados.*0 USD devueltos.*100 USD/);
    await page.locator('#funding-abandon').click();
    assert.equal(await page.locator('#funding-reserved').innerText(),'0 USD');
    assert.equal(await page.locator('#funding-latest-balance').innerText(),historicalBalance,'refund must preserve the historical receipt');
    assert.doesNotMatch(await page.locator('#funding-latest-note').innerText(),/el resto sigue reservado/,'receipt must not describe a refunded balance as still reserved');
    assert.match(await page.locator('#funding-latest-current').innerText(),/50 USD liberados.*0 USD reservados.*50 USD devueltos.*100 USD/);
    await page.locator('#funding-replay').click();
    assert.equal(await page.locator('#funding-latest-balance').innerText(),historicalBalance);
    await page.locator('#funding-latest').screenshot({path:path.join(root,'docs/captures/receipt-after-refund-mobile.png')});
    await page.locator('#funding-reset').click();
    assert.equal(await page.locator('#funding-latest').isVisible(),false);
    await page.locator('[data-funding-preset="solo"]').click();
    await page.locator('#funding-progress-record').click();
    await page.locator('#funding-progress-record').click();
    assert.match(await page.locator('#funding-latest-current').innerText(),/100 USD liberados.*0 USD reservados.*0 USD devueltos.*100 USD/);
    console.log('PASS: rule editor, accessibility and historical receipt/current balance after refund (390x844).');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
