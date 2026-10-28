const { chromium } = require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BECA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const failures = [], externalRequests = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
  page.on('request', request => { if (new URL(request.url()).hostname !== '127.0.0.1') externalRequests.push(request.url()); });
  const url = process.env.BECA_DEMO_URL || 'http://127.0.0.1:4178/demo.html';

  try {
  for (let run = 1; run <= 3; run++) {
    await page.goto(url, { waitUntil: 'load' });
    await page.locator('#payment-create-invoice').click();
    await page.locator('#payment-invoice-card').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#payment-qr svg').count(), 1, `run ${run}: local QR must render`);
    assert.match(await page.locator('.payment-simulation-warning').innerText(), /SIMULADO.*no es BOLT11.*no puede recibir pagos/);
    assert.match(await page.locator('#payment-invoice-text').innerText(), /^beca-demo:invoice:/);

    await page.locator('#payment-confirm-funding').click();
    await page.waitForFunction(() => document.querySelector('#payment-funded-readout').textContent === '100.000 sats');
    await page.locator('#milestone-evidence').setInputFiles({
      name: 'constancia-demo.txt', mimeType: 'text/plain',
      buffer: Buffer.from('Estudiante: Ana Pérez\nMateria: Álgebra I\nNota: 8\nFecha: 12/10/2026'),
    });
    await page.locator('#ai-prevalidate-evidence').click();
    await page.locator('#ai-suggestion').waitFor({ state: 'visible' });
    assert.match(await page.locator('#ai-provider-badge').innerText(), /IA \(modo demo\)/);
    assert.equal(await page.locator('#ai-suggestion-title').innerText(), 'Sugerencia: aprobar');
    assert.match(await page.locator('#ai-suggestion-reason').innerText(), /alcanza el mínimo de 6/);
    assert.equal(await page.locator('#ai-extracted-name').innerText(), 'Ana Pérez');
    assert.equal(await page.locator('#ai-extracted-subject').innerText(), 'Álgebra I');
    assert.equal(await page.locator('#ai-extracted-grade').innerText(), '8');
    assert.match(await page.locator('.ai-suggestion .ai-human-loop').innerText(), /La tutora debe revisar.*decidir manualmente/);
    await page.locator('#payment-approve-milestone').click();
    await page.locator('#payment-receipt').waitFor({ state: 'visible' });
    assert.match(await page.locator('#payment-receipt .payment-mode-badge').innerText(), /SIMULADO/);
    assert.match(await page.locator('#payment-receipt-summary').innerText(), /50\.000 sats de prueba/);
    assert.match(await page.locator('#payment-proof-check').innerText(), /coinciden criptográficamente.*SIMULADO/);
    const proof = await page.evaluate(async () => {
      const fromHex = text => new Uint8Array(text.match(/.{2}/g).map(pair => Number.parseInt(pair, 16)));
      const preimage = document.querySelector('#payment-preimage').textContent;
      const expected = document.querySelector('#payment-hash').textContent;
      const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', fromHex(preimage)));
      return [...digest].map(byte => byte.toString(16).padStart(2, '0')).join('') === expected;
    });
    assert.equal(proof, true, `run ${run}: receipt preimage must verify against its hash`);

    await page.locator('#payment-refund-unused').click();
    await page.waitForFunction(() => document.querySelector('#payment-refunded-readout').textContent === '50.000 sats');
    assert.match(await page.locator('#payment-flow-status').innerText(), /Devolución exacta simulada: 50\.000 sats/);
    const totals = await page.evaluate(() => ({
      funded: Number(document.querySelector('#payment-funded-readout').textContent.replace(/\D/g, '')),
      paid: Number(document.querySelector('#payment-paid-readout').textContent.replace(/\D/g, '')),
      refunded: Number(document.querySelector('#payment-refunded-readout').textContent.replace(/\D/g, '')),
      reserved: Number(document.querySelector('#payment-reserved-readout').textContent.replace(/\D/g, '')),
    }));
    assert.deepEqual(totals, { funded: 100000, paid: 50000, refunded: 50000, reserved: 0 }, `run ${run}: sats ledger must conserve exactly`);
  }

  assert.deepEqual(externalRequests, [], 'demo payment flow must not call external services');
  assert.deepEqual(failures, [], 'demo payment flow must have no browser errors');
  console.log('PASS: demo Lightning payment flow completed 3 times: simulated QR/funding → human approval → SHA-256 preimage receipt → exact unused-balance refund; zero external requests.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
