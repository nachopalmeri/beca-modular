const {chromium}=require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BECA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const base='http://127.0.0.1:4178';await page.goto(base);await page.waitForSelector('#profit');
 await page.locator('#scholar-approve').click();assert.equal(await page.locator('#scholar-paid').innerText(),'20 USD');await page.locator('#scholar-pause').click();assert.equal(await page.locator('#scholar-approve').isDisabled(),true);await page.locator('#scholar-reassign').click();assert.equal(await page.locator('#scholar-reassigned').innerText(),'80 USD');assert.equal(await page.locator('#scholar-paid').innerText(),'20 USD');await page.locator('#scholar-reset').click();
 assert.match(await page.locator('#profit').innerText(),/5[.,]914/);
 await page.getByRole('button',{name:'Abrir sesión',exact:false}).click();await page.locator('[data-unit="sql-1"]').click();
 assert.equal(await page.locator('#authorized').innerText(),'2,00');
 await page.getByRole('button',{name:'Probar duplicado',exact:true}).click();await page.getByRole('button',{name:'Probar gasto de 11 USDC',exact:true}).click();
 assert.match(await page.locator('#event-log').innerText(),/ya autorizada/);assert.match(await page.locator('#event-log').innerText(),/excede/);
 await page.getByRole('button',{name:'Pausar',exact:true}).click();assert.equal(await page.locator('[data-unit="sql-2"]').isDisabled(),true);
 await page.getByRole('button',{name:'Reanudar',exact:true}).click();await page.locator('[data-unit="sql-2"]').click();await page.getByRole('button',{name:'Cerrar y conciliar',exact:false}).click();
 assert.equal(await page.locator('#settled').innerText(),'5,00 USDC');assert.equal(await page.locator('#returned').innerText(),'5,00 USDC');
 await page.getByRole('button',{name:'Reiniciar',exact:true}).click();assert.equal(await page.locator('#session-state').innerText(),'Sin abrir');
 await page.locator('[data-role="student"]').click();assert.match(await page.locator('#role-title').innerText(),/libera/);await page.locator('[data-role="institution"]').click();assert.match(await page.locator('#role-content').innerText(),/La firma acredita el origen/i);
 await page.locator('[data-role="sponsor"]').click();await page.locator('[data-stage="5"]').click();assert.match(await page.locator('#stage-title').innerText(),/reglas públicas/);
 await page.locator('#learning-goal').selectOption('web');await page.locator('#recommend').click();assert.match(await page.locator('#recommendation').innerText(),/HTML/);
 await page.locator('#flow-milestones-range').fill('0');await page.locator('#flow-milestones-range').dispatchEvent('input');assert.equal(await page.locator('#flow-return').innerText(),'100 USD');
 await page.locator('[data-scenario="optimistic"]').click();assert.equal(await page.locator('[name="sponsors"]').inputValue(),'30');
 await page.locator('[data-scenario="base"]').click();await page.locator('[name="sponsors"]').fill('0');assert.match(await page.locator('#profit').innerText(),/6[.,]000/);;
 await page.locator('[name="utilization"]').fill('101');assert.equal(await page.locator('#finance-error').isVisible(),true);await page.locator('[data-scenario="base"]').click();assert.equal(await page.locator('#finance-error').isVisible(),false);
 // Internal navigation/document targets must exist. No remote links are probed.
 await page.locator('[data-yield-option="aave"]').click();assert.match(await page.locator('#yield-title').innerText(),/Aave/);
 await page.locator('[data-yield-option="morpho"]').click();assert.match(await page.locator('#yield-risk').innerText(),/curador/);
 assert.match(await page.locator('#yield-net').innerText(),/3[,.]00/);assert.equal(await page.locator('#yield-education-awards').innerText(),'0');assert.match(await page.locator('#yield-education-leftover').innerText(),/3[,.]00/);assert.match(await page.locator('#yield-committed-value').innerText(),/1[.,]000/);assert.match(await page.locator('#yield-free-value').innerText(),/200/);
 await page.locator('#yield-recipient').selectOption('student');assert.match(await page.locator('#yield-distribution').innerText(),/3[,.]00/);assert.equal(await page.locator('#student-benefit-choice').isVisible(),true);await page.locator('#student-benefit-use').selectOption('approved');assert.match(await page.locator('#student-benefit-preview').innerText(),/gasto educativo aprobado/);await page.locator('#yield-recipient').selectOption('education');assert.equal(await page.locator('#student-benefit-choice').isVisible(),false);
 await page.locator('#yield-stress').click();assert.match(await page.locator('#yield-warning').innerText(),/Protección activa/);assert.match(await page.locator('#yield-net').innerText(),/7[,.]40/);assert.match(await page.locator('#yield-net').innerText(),/[−-]/);
 await page.locator('#yield-months').fill('0');assert.equal(await page.locator('#yield-error').isVisible(),true);assert.equal(await page.locator('#yield-net').innerText(),'—');
 await page.locator('#yield-default').click();assert.equal(await page.locator('#yield-error').isVisible(),false);assert.match(await page.locator('#yield-net').innerText(),/3[,.]00/);
 const links=await page.locator('a[href]').evaluateAll(xs=>xs.map(a=>a.getAttribute('href')));
 for(const link of links){if(link.startsWith('#')&&link.length>1)assert.equal(await page.locator(link).count(),1,link);else if(link.startsWith('docs/'))assert.equal((await page.request.get(base+'/'+link)).status(),200,link);}
 const out=path.join(__dirname,'../screenshots');fs.mkdirSync(out,{recursive:true});
 await page.locator('[data-stage="0"]').click();await page.locator('#learning-goal').selectOption('data');await page.locator('#recommend').click();
 await page.locator('#rendimiento').screenshot({path:path.join(out,'desktop-yield.png'),style:'.header,.skip{visibility:hidden!important}'});
 await page.locator('#experiencia').screenshot({path:path.join(out,'desktop-product.png'),style:'.header,.skip{visibility:hidden!important}'});
 await page.locator('#simulador').screenshot({path:path.join(out,'desktop-financial.png'),style:'.header,.skip{visibility:hidden!important}'});
 for(const [label,width,height]of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844]]){
  await page.setViewportSize({width,height});await page.goto(base);await page.waitForSelector('#profit');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,'Horizontal overflow '+label);
  await page.screenshot({path:path.join(out,label+'.png'),fullPage:true});await page.screenshot({path:path.join(out,label+'-hero.png')});
  if(label==='mobile') await page.locator('#rendimiento').screenshot({path:path.join(out,'mobile-yield.png'),style:'.header,.skip{visibility:hidden!important}'});
  if(label==='mobile') await page.locator('#simulador').screenshot({path:path.join(out,'mobile-financial.png'),style:'.header,.skip{visibility:hidden!important}'});
 }
 await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');await page.locator('#nav a[href="#simulador"]').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 await page.goto(base);await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'skip');
 assert.deepEqual(errors,[]);await browser.close();
 const report={date:new Date().toISOString(),result:'PASS',checks:['base arithmetic','yield options and distribution','declining yield and stress deficit','yield invalid inputs and reset','session open/consume/pause/close','duplicate/cap rejection','role and lifecycle navigation','route recommendation','fund flow boundary','financial zero/invalid states','internal links','responsive overflow 1440/768/390','mobile navigation','reduced-motion','keyboard skip link','no browser errors'],errors,screenshots:fs.readdirSync(out)};
 fs.writeFileSync(path.join(__dirname,'../browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1);});
