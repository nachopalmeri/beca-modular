const { chromium } = require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BECA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(process.env.BECA_SITE_URL || 'http://127.0.0.1:4178/');
    const shell = page.locator('.story-track-shell');
    const panels = page.locator('.story-panel');
    const opening = page.locator('.brote-opening');
    const openingMascot = page.locator('.brote-opening-mascot');
    const seekOpening = async (progress, phase) => {
      await opening.evaluate((element, fraction) => {
        const stage = element.querySelector('.brote-opening-stage');
        window.scrollTo({top:scrollY+element.getBoundingClientRect().top-88+(element.offsetHeight-stage.offsetHeight)*fraction,behavior:'instant'});
      }, progress);
      await page.waitForFunction(expected => document.querySelector('.brote-opening-mascot').dataset.broteAction === expected, phase);
      await page.waitForFunction(expected => Math.abs(Number(document.querySelector('.brote-opening-mascot').dataset.broteProgress)-expected)<.002,progress);
    };
    assert.equal(await opening.evaluate(e=>e.classList.contains('is-animated')),true);
    await seekOpening(.01,'enter');
    assert.ok(await openingMascot.evaluate(e=>e.getBoundingClientRect().left<0),'entry starts beyond the stage edge');
    await seekOpening(.3,'walk');
    const walking = await openingMascot.getAttribute('style');
    await page.screenshot({path:path.resolve('docs/captures/brote-walking-desktop.png'),style:'.skip{visibility:hidden!important}'});
    await seekOpening(.59,'hop');
    await page.screenshot({path:path.resolve('docs/captures/brote-hop-desktop.png'),style:'.skip{visibility:hidden!important}'});
    await seekOpening(.8,'rest');
    const resting = await openingMascot.getAttribute('style');
    assert.notEqual(walking,resting);
    assert.ok(await page.locator('[data-brote-reveal]').evaluate(e=>Number(getComputedStyle(e).opacity)===1),'the complete headline is revealed by landing');
    const contactGap=await opening.evaluate(e=>{
      const word=e.querySelector('[data-brote-landing]'),shoe=e.querySelector('.brote-leg-right .brote-shoe');
      const glyphTop=word.getBoundingClientRect().top+parseFloat(getComputedStyle(word).fontSize)*.44;
      return Math.abs(shoe.getBoundingClientRect().bottom-glyphTop);
    });
    assert.ok(contactGap<18,`shoe must meet headline, gap ${contactGap}`);
    await page.screenshot({path:path.resolve('docs/captures/story-opening-desktop.png'),style:'.skip{visibility:hidden!important}'});
    await seekOpening(.95,'exit');
    await seekOpening(.999,'exit');
    assert.ok(await openingMascot.evaluate(e=>e.getBoundingClientRect().left>innerWidth-15),'exit clears the stage');
    await seekOpening(.8,'rest');
    assert.equal(await openingMascot.getAttribute('style'),resting,'reverse scroll restores the exact headline pose');
    const checkGeometry = async () => {
      const violations = await panels.evaluateAll(items => items.flatMap(panel => {
        const visual = panel.querySelector('.story-visual').getBoundingClientRect();
        const mascot = panel.querySelector('.story-mascot').getBoundingClientRect();
        const copy = panel.querySelector('.story-art-copy,.evidence-sample').getBoundingClientRect();
        const intersects = mascot.left < copy.right && mascot.right > copy.left && mascot.top < copy.bottom && mascot.bottom > copy.top;
        return mascot.left < visual.left - 1 || mascot.right > visual.right + 1 || mascot.top < visual.top - 1 || mascot.bottom > visual.bottom + 1 || intersects ? [panel.id] : [];
      }));
      assert.deepEqual(violations, [], 'Brote must fit its scene and leave the copy unobscured');
    };
    await checkGeometry();
    await page.locator('[data-story-go="3"]').click();
    await page.waitForFunction(() => document.querySelector('#story-release').getAttribute('aria-current') === 'step');
    await page.waitForFunction(() => Math.abs(document.querySelector('#story-release').getBoundingClientRect().left) < 1);
    await checkGeometry();
    assert.equal(await page.locator('.story-mascot img').evaluateAll(items => items.some(item => getComputedStyle(item).animationIterationCount === 'infinite')), false, 'mascot must stop when scrolling stops');
    await page.screenshot({ path: path.resolve('docs/captures/story-fixed-desktop.png'), style: '.skip{visibility:hidden!important}' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => !document.querySelector('.story-track-shell').classList.contains('is-pinned'));
    assert.equal(await panels.evaluateAll(items => items.every(item => !item.inert)), true, 'resize must restore every chapter to keyboard navigation');
    assert.equal(await opening.evaluate(e=>e.classList.contains('is-animated')),false);
    assert.equal(await openingMascot.isVisible(),true,'mobile preserves Brote without a pinned canvas');
    assert.equal(await page.locator('[data-brote-reveal]').evaluate(e=>getComputedStyle(e).opacity),'1','fallback never hides the headline');
    await opening.screenshot({path:path.resolve('docs/captures/story-opening-mobile.png'),style:'.header,.skip{visibility:hidden!important}'});
    await checkGeometry();
    await page.locator('#story-release .story-visual').screenshot({ path: path.resolve('docs/captures/story-fixed-mobile.png'), style: '.header,.skip{visibility:hidden!important}' });
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await checkGeometry();
      assert.equal(await panels.evaluateAll(items => items.every(item => !item.inert)), true);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForFunction(() => document.querySelector('.story-track-shell').classList.contains('is-pinned'));
    await page.locator('[data-story-go="0"]').click();
    await page.waitForFunction(() => document.querySelector('#story-question').getAttribute('aria-current') === 'step');
    await page.waitForFunction(() => Math.abs(document.querySelector('#story-question').getBoundingClientRect().left) < 1);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.story-track-shell').classList.contains('is-pinned'));
    assert.equal(await panels.evaluateAll(items => items.every(item => !item.inert)), true);
    await checkGeometry();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1024, height: 600 });
    await page.waitForFunction(() => !document.querySelector('.story-track-shell').classList.contains('is-pinned'));
    await checkGeometry();
    console.log('PASS: mascot containment/copy separation, forward/backward story, runtime resize, reduced motion and short-screen fallback.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
