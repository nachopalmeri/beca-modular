const {chromium}=require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.BECA_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const held=[],heldUniversities=[];
  try{
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();let blockNational=false;
    const fixture='<html lang="es"><head><meta charset="utf-8"><title>Fixture de prueba</title></head><body><h1>Explorador sintético de QA</h1><p>No contiene datos educativos.</p></body></html>';
    await context.route(/https:\/\/(mapa\.educacion\.gob\.ar|mapa-educacion-gba\.vercel\.app|www\.datoshoy\.com)\//,route=>{
      if(route.request().resourceType()==='fetch')return route.fulfill({contentType:'text/html',body:fixture}); // no-cors preflight must resolve
      if(route.request().url().includes('mapa-educacion-gba'))held.push(route);
      else if(route.request().url().includes('datoshoy.com'))heldUniversities.push(route);
      else if(blockNational)return route.fulfill({contentType:'text/html',headers:{'Content-Security-Policy':"frame-ancestors 'none'"},body:fixture});
      else return route.fulfill({contentType:'text/html',body:fixture});
    });
    await page.goto(process.env.BECA_SITE_URL||'http://127.0.0.1:4178/');
    assert.equal(await page.locator('#map-load-status').count(),1,'viewer must explain its loading state');
    await page.clock.install();
    const requested = page.waitForRequest(request=>request.url().includes('mapa-educacion-gba'));
    await page.locator('[data-map="openarg"]').click();
    await requested;
    assert.equal(await page.locator('#evidence-map').getAttribute('loading'),'eager','explicit selection must bypass the browser lazy gate');
    assert.match(await page.locator('#map-load-status').innerText(),/Cargando/);
    await page.clock.fastForward(12001);
    assert.equal(await page.locator('#map-viewer').getAttribute('data-load-state'),'slow');
    assert.equal(await page.locator('#map-retry').isEnabled(),true);
    assert.equal(await page.locator('#map-open').getAttribute('href'),'https://mapa-educacion-gba.vercel.app/');
    await page.locator('#map-viewer').screenshot({path:path.resolve('docs/captures/map-loading-desktop.png')});
    const universityRequest=page.waitForRequest(request=>request.url().includes('datoshoy.com'));
    await page.locator('[data-map="universities"]').click();
    await universityRequest;
    for(const route of held.splice(0))await route.fulfill({contentType:'text/html',body:fixture}).catch(()=>{});
    await page.clock.fastForward(5000);
    assert.equal(await page.locator('#map-viewer').getAttribute('data-load-state'),'loading','old source completion must not end the new source loading state');
    await heldUniversities.shift().fulfill({contentType:'text/html',body:fixture});
    await page.frameLocator('#evidence-map').getByRole('heading',{name:'Explorador sintético de QA'}).waitFor();
    assert.equal(await page.locator('#map-viewer').getAttribute('data-load-state'),'external');
    assert.equal(await page.locator('#map-open').getAttribute('href'),'https://www.datoshoy.com/universidades#universitiesMap','late responses must not change the selected source');
    await context.setOffline(true);
    await page.locator('[data-map="national"]').click();
    assert.match(await page.locator('#map-load-status').innerText(),/Sin conexión/);
    assert.equal(await page.locator('#map-viewer').getAttribute('data-load-state'),'offline');
    for(const selector of ['#map-load-status','#map-loading-copy']){
      const ratio=await page.locator(selector).evaluate(element=>{
        const rgb=color=>color.match(/[\d.]+/g).slice(0,3).map(Number);
        const luminance=values=>values.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
        let parent=element;while(parent&&getComputedStyle(parent).backgroundColor==='rgba(0, 0, 0, 0)')parent=parent.parentElement;
        const foreground=luminance(rgb(getComputedStyle(element).color)),background=luminance(rgb(getComputedStyle(parent).backgroundColor));
        return (Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05);
      });
      assert.ok(ratio>=4.5,`${selector} contrast ${ratio.toFixed(2)} must be at least 4.5:1`);
    }
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('#map-viewer').screenshot({path:path.resolve('docs/captures/map-offline-mobile.png')});
    await context.setOffline(false);
    await page.locator('#map-retry').click();
    await page.frameLocator('#evidence-map').getByRole('heading',{name:'Explorador sintético de QA'}).waitFor();
    assert.equal(await page.locator('#map-viewer').getAttribute('data-load-state'),'external');
    assert.match(await page.locator('#map-load-status').innerText(),/Si no aparece/);
    blockNational=true;
    await page.locator('#map-retry').click();
    await page.waitForFunction(()=>document.querySelector('#map-viewer').dataset.loadState!=='loading');
    assert.equal(await page.locator('#map-open').isVisible(),true,'embedding restrictions must preserve the direct-source route');
    assert.doesNotMatch(await page.locator('#map-load-status').innerText(),/verificado|datos actualizados|listo/i,'an iframe load event must not claim verified map data');
    blockNational=false;
    // A refused host must surface the unavailable state, not a success claim: Chromium fires load
    // (not error) for committed error pages, so the no-cors preflight distinguishes the failure.
    await page.route('**mapa.educacion.gob.ar**',route=>route.abort('connectionrefused'));
    await page.locator('#map-retry').click();
    await page.waitForFunction(()=>document.querySelector('#map-viewer').dataset.loadState==='unavailable',undefined,{timeout:8000});
    assert.match(await page.locator('#map-load-status').innerText(),/No se pudo abrir el visor/);
    await page.waitForTimeout(900);
    assert.equal(await page.locator('#map-viewer').getAttribute('data-load-state'),'unavailable','a late frame load event must not overwrite the failure state');
    await page.unroute('**mapa.educacion.gob.ar**');
    await page.locator('#map-retry').click();
    await page.frameLocator('#evidence-map').getByRole('heading',{name:'Explorador sintético de QA'}).waitFor();
    assert.equal(await page.locator('#map-viewer').getAttribute('data-load-state'),'external');
    const deepLink=await context.newPage();
    await deepLink.goto(new URL('#datos-abiertos',process.env.BECA_SITE_URL||'http://127.0.0.1:4178/').href);
    // The anchor lands at the section top while the loader is designed to start only near the
    // viewer, so the deep link alone leaves the native lazy frame unmanaged until scrolling closer.
    await deepLink.waitForTimeout(1500);
    await deepLink.locator('#map-viewer').scrollIntoViewIfNeeded();
    await deepLink.waitForFunction(()=>document.querySelector('#map-viewer').dataset.loadState==='external',undefined,{timeout:8000});
    assert.equal(await deepLink.locator('#evidence-map').getAttribute('loading'),'eager','a direct map URL must activate the near-view loader');
    await deepLink.close();
    console.log('PASS: explicit loading, slow-source fallback, source switching, stale-response isolation, offline/retry, mobile layout and refused-host reporting (unavailable instead of a success claim). External responses are synthetic QA fixtures; live source verification is separate.');
  }finally{for(const route of [...held,...heldUniversities])await route.abort().catch(()=>{});await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
