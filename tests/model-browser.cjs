const { chromium } = require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BECA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4178/', { waitUntil: 'load' });
    assert.match(await page.locator('#hero-title').innerText(), /Pagos tarde o de una vez\?.*Y la trazabilidad\?/s);
    assert.equal(await page.locator('nav a[href="modelo.html"]').count(), 1);
    await page.goto(process.env.BECA_MODEL_URL || 'http://127.0.0.1:4178/modelo', { waitUntil: 'load' });
    assert.match(await page.title(), /Modelo de negocio/);
    assert.equal(await page.locator('#operating-result').innerText(), '−$5,914.40');
    assert.equal(await page.locator('#kpi-seats').innerText(), '800');
    assert.equal(await page.locator('#kpi-principal').innerText(), '$96,000.00');
    assert.equal(await page.locator('#kpi-payouts').innerText(), '$62,400.00');
    assert.equal(await page.locator('#kpi-revenue').innerText(), '$2,500.00');
    assert.equal(await page.locator('#break-even-title').innerText(), '701 sponsors para cubrir costos con la licencia actual.');
    assert.equal(await page.locator('#required-license').innerText(), '$841.44');
    assert.match(await page.locator('.model-roles article:nth-child(2)').innerText(), /El estudiante no paga licencia, comisión ni costos de red/);
    await page.locator('[data-preset="optimistic"]').click();
    assert.ok((await page.locator('#operating-result').innerText()).includes('$'));
    await page.locator('input[name="subscription"]').fill('0');
    assert.match(await page.locator('#operating-result').innerText(), /−/);
    await page.locator('input[name="utilization"]').fill('101');
    assert.equal(await page.locator('#model-error').isVisible(), true);
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'model must not overflow on mobile');
    console.log('PASS: /modelo shows editable assumptions, base-case loss, break-even, student-free payment rule and responsive layout.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
