const {chromium}=require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.BECA_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.goto(new URL('demo.html',process.env.BECA_SITE_URL||'http://127.0.0.1:4178/').href);
    await page.waitForSelector('#funding-tree svg .ft-trunk');
    await page.locator('#funding-tree').scrollIntoViewIfNeeded();

    // An empty scenario is a bare tree, not a decorative one.
    assert.equal(await page.locator('#funding-tree .ft-leaf').count(),0);
    assert.match(await page.locator('#funding-tree [data-tree-status]').innerText(),/0 hojas/);
    assert.match(await page.locator('#funding-tree [data-tree-status]').innerText(),/no representa dinero real/i);

    // Two synthetic contributions become two leaves.
    await page.locator('[data-funding-preset="shared"]').click();
    await page.waitForFunction(()=>document.querySelectorAll('#funding-tree .ft-leaf').length===2);
    assert.equal(await page.locator('#funding-tree .ft-fruit').count(),0);
    assert.match(await page.locator('#funding-tree [data-tree-status]').innerText(),/2 hojas/);
    assert.equal(await page.locator('#funding-tree svg').getAttribute('data-tree-state'),'active');

    // The institutional test receipt grows exactly one fruit.
    await page.locator('#funding-progress-record').click();
    await page.waitForFunction(()=>document.querySelectorAll('#funding-tree .ft-fruit').length===1);
    assert.match(await page.locator('#funding-tree [data-tree-status]').innerText(),/1 fruto/);
    assert.equal(await page.locator('#funding-tree .ft-leaf').count(),2,'a released milestone must not add leaves');
    await page.locator('#funding-tree').screenshot({path:path.resolve('docs/captures/arbol-demo.png')});

    // Review pauses the growth claim and the refunded scenario marks the paid leaves.
    await page.locator('#funding-review').click();
    assert.equal(await page.locator('#funding-tree svg').getAttribute('data-tree-state'),'review');
    assert.match(await page.locator('#funding-tree [data-tree-status]').innerText(),/revisión abierta/);
    await page.locator('#funding-abandon').click();
    assert.equal(await page.locator('#funding-tree svg').getAttribute('data-tree-state'),'refunded');
    assert.match(await page.locator('#funding-tree [data-tree-status]').innerText(),/aportes devueltos/);
    assert.equal(await page.locator('#funding-tree .ft-leaf').count(),2,'returned leaves stay visible as history, marked by the refunded state');

    // Reset empties the tree again.
    await page.locator('#funding-reset').click();
    await page.waitForFunction(()=>document.querySelectorAll('#funding-tree .ft-leaf').length===0);
    assert.equal(await page.locator('#funding-tree .ft-fruit').count(),0);

    // A single full contribution also grows one leaf.
    await page.locator('[data-funding-preset="solo"]').click();
    await page.waitForFunction(()=>document.querySelectorAll('#funding-tree .ft-leaf').length===1);
    assert.match(await page.locator('#funding-tree [data-tree-status]').innerText(),/1 hoja\b/);

    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow around the demo tree');
    assert.deepEqual(errors,[],'no page errors while exercising the tree');
    console.log('PASS: the demo contribution tree grows leaves per synthetic aporte, one fruit per released milestone, pauses on review, marks refunds and resets.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
