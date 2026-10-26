const {chromium}=require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.BECA_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    const fixture='<html lang="es"><head><meta charset="utf-8"><title>Fixture de prueba</title></head><body><p>Explorador sintético de QA.</p></body></html>';
    await context.route(/^https:\/\//,route=>route.fulfill({contentType:'text/html',body:fixture}));
    await page.goto(process.env.BECA_SITE_URL||'http://127.0.0.1:4178/');
    await page.waitForSelector('#evidencia-svg .ev-area');
    // The lab draws the committed official series, not a live request.
    assert.equal(await page.locator('#evidencia-svg .ev-area').count(),24,'one area per jurisdiction');
    assert.equal(await page.locator('#evidencia-svg .ev-point').count(),24,'one proportional dot per jurisdiction');
    assert.equal(await page.locator('#evidencia-year option').count(),13,'2012-13 through 2024-25');
    assert.equal(await page.locator('#evidencia-jurisdiccion option').count(),24);
    assert.equal(await page.locator('#evidencia-year').inputValue(),'12','the newest year is shown first');
    assert.match(await page.locator('#evidencia-readout').innerText(),/Buenos Aires/);
    assert.match(await page.locator('#evidencia-readout').innerText(),/2024-25/);
    assert.match(await page.locator('#evidencia-ranking span').first().innerText(),/MAYORES TASAS/);
    assert.equal(await page.locator('#evidencia-ranking ol button').count(),5,'top five ranking');
    assert.match(await page.locator('#evidencia-source').innerText(),/DiNIEE/);
    assert.match(await page.locator('#evidencia-source').innerText(),/negativos/,'the source line repeats the negative-value caveat');

    // Area view is the default; the points overlay starts hidden.
    assert.doesNotMatch(await page.locator('#evidencia-svg').getAttribute('class')||'',/is-points/);
    await page.locator('[data-vista="puntos"]').click();
    assert.match(await page.locator('#evidencia-svg').getAttribute('class'),/is-points/);
    assert.equal(await page.locator('.ev-points').evaluate(element=>getComputedStyle(element).display),'block');
    assert.equal(await page.locator('[data-vista="puntos"]').getAttribute('aria-pressed'),'true');
    const radii=await page.locator('#evidencia-svg .ev-point').evaluateAll(dots=>[...new Set(dots.map(dot=>dot.getAttribute('r')))]);
    assert.ok(radii.length>3,`proportional dots must vary with the value, got ${radii.length} distinct radii`);
    await page.locator('[data-vista="areas"]').click();

    // Primaria over an old period publishes documented negative values; they must render, not vanish.
    await page.locator('[data-nivel="primaria"]').click();
    assert.match(await page.locator('#evidencia-legend').innerText(),/TASA PRIMARIA/);
    await page.locator('#evidencia-year').selectOption('8');
    assert.match(await page.locator('#evidencia-legend').innerText(),/2020-21/);
    assert.ok(await page.locator('#evidencia-svg .ev-area.is-negative').count()>0,'published negative values keep their own marker');
    // The series chart must plot published negatives below the zero line, not clamp them onto it.
    await page.locator('#evidencia-jurisdiccion').selectOption('58');
    const zeroVsPoint=await page.evaluate(()=>{
      const chart=document.querySelector('#evidencia-chart');
      const zeroText=[...chart.querySelectorAll('.ev-chart-grid text')].find(text=>text.textContent.trim()==='0');
      const point=chart.querySelector('.ev-chart-point[data-year="8"] circle:not(.ev-chart-hit)');
      return {zeroY:Number(zeroText?.previousElementSibling?.getAttribute('y1')),pointCy:Number(point?.getAttribute('cy'))};
    });
    assert.ok(zeroVsPoint.pointCy-zeroVsPoint.zeroY>3,`Neuquén primaria 2020-21 (-1.16) must plot below zero (cy ${zeroVsPoint.pointCy} vs ${zeroVsPoint.zeroY})`);
    await page.locator('#evidencia-year').selectOption('12');
    await page.locator('[data-nivel="secundaria"]').click();

    // Ranking selects a jurisdiction; the chart and readout follow.
    const rankingLabel=(await page.locator('#evidencia-ranking ol button span').first().innerText()).trim();
    await page.locator('#evidencia-ranking ol button').first().click();
    assert.equal(await page.locator('#evidencia-ranking ol button').first().getAttribute('aria-pressed'),'true');
    assert.equal((await page.locator('#evidencia-readout h4').innerText()).trim(),rankingLabel);
    assert.equal(await page.locator('#evidencia-jurisdiccion').inputValue(),await page.locator('#evidencia-ranking ol button').first().getAttribute('data-id'));

    // Linked series: 13 points, a national reference, and click-to-travel on the rail.
    assert.equal(await page.locator('#evidencia-chart .ev-chart-point').count(),13);
    assert.match(await page.locator('#evidencia-chart .ev-chart-national').getAttribute('d'),/L/);
    assert.match(await page.locator('#evidencia-chart .ev-chart-selected').getAttribute('d'),/L/);
    await page.locator('#evidencia-chart .ev-chart-point[data-year="0"]').click();
    assert.equal(await page.locator('#evidencia-year').inputValue(),'0');
    assert.match(await page.locator('#evidencia-readout').innerText(),/2012-13/);
    await page.locator('#evidencia-chart .ev-chart-point[data-year="12"]').click();

    // Keyboard path: focus a province and press Enter.
    await page.locator('path.ev-area[data-id="22"]').focus();
    assert.equal(await page.locator('#evidencia-tooltip').isVisible(),true,'focus shows the value tooltip');
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#evidencia-readout h4').innerText(),/Chaco/);
    await page.locator('path.ev-area[data-id="06"]').focus();
    await page.keyboard.press('Enter');

    // Full table inside progressive disclosure.
    assert.match(await page.locator('#evidencia-tabla-summary').innerText(),/24 valores/);
    await page.locator('.evidencia-table summary').click();
    assert.equal(await page.locator('#evidencia-tabla-body tbody tr').count(),24);
    assert.match(await page.locator('#evidencia-tabla-body thead').innerText(),/2024-25/);

    await page.locator('#evidencia-lab').screenshot({path:path.resolve('docs/captures/evidencia-desktop.png')});

    // Story tree scene: leaves (bills and coins) appear once the scene is shown.
    await page.locator('[data-story-go="2"]').click();
    await page.waitForFunction(()=>document.querySelectorAll('#bm-tree .bm-leaf.on').length>40,null,{timeout:8000});
    await page.waitForTimeout(500);
    await page.locator('#bm-tree').screenshot({path:path.resolve('docs/captures/arbol-escena.png')});

    // Closing companion reveals itself and keeps Brote resting.
    await page.locator('#companero').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('#companero').classList.contains('is-visible'),null,{timeout:4000});
    assert.match(await page.locator('#companero h2').innerText(),/Brote/);
    assert.equal(await page.locator('#companero .companion-stage img').evaluate(image=>getComputedStyle(image).opacity),'1');
    await page.waitForTimeout(1700);
    await page.locator('#companero').screenshot({path:path.resolve('docs/captures/companero-desktop.png')});

    // Mobile: no horizontal overflow, map stays usable through the selector.
    await page.setViewportSize({width:390,height:844});
    await page.locator('#evidencia-lab').scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow with the lab');
    await page.locator('#companero').scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow with the companion');
    await page.locator('#evidencia-lab').screenshot({path:path.resolve('docs/captures/evidencia-mobile.png')});
    assert.deepEqual(errors,[],'no page errors while exercising the lab');
    console.log('PASS: evidence lab (areas/points, level and year rails, ranking, chart, table, keyboard), story tree scene and closing companion at desktop and mobile widths.');
    await context.close();

    // Reduced motion: the teaser renders instantly and the companion never hides content.
    const reduced=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
    const reducedPage=await reduced.newPage();
    await reducedPage.goto(process.env.BECA_SITE_URL||'http://127.0.0.1:4178/');
    await reducedPage.waitForSelector('#evidencia-svg .ev-area');
    await reducedPage.waitForFunction(()=>document.querySelectorAll('#bm-tree .bm-leaf.on').length>40);
    assert.doesNotMatch(await reducedPage.locator('#companero').getAttribute('class')||'',/is-armed/,'reduced motion must not arm the reveal');
    assert.equal(await reducedPage.locator('#companero .companion-copy').evaluate(element=>getComputedStyle(element).opacity),'1');
    await reduced.close();
    console.log('PASS: reduced motion keeps the teaser, lab and companion readable without hidden content.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
