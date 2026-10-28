const { chromium } = require('C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BECA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const source = process.env.BECA_PRESENTATION_URL || 'http://127.0.0.1:4178';
    for (const base of [source, `${source}/dist`]) {
      for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
        const page = await browser.newPage({ viewport });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`${base}/presentacion.html`, { waitUntil: 'load' });
        assert.match(await page.title(), /Presentación audiovisual/);
        assert.equal(await page.locator('video').count(), 3);
        assert.equal(await page.locator('video track[default]').count(), 3);
        assert.equal(await page.locator('.film-transcript').count(), 3);
        assert.equal(await page.locator('a[download][href$=".mp4"]').count(), 3);
        if (viewport.width === 1440) {
          const media = await page.locator('video').first().evaluate(video => new Promise((resolve, reject) => {
            video.preload = 'metadata';
            video.addEventListener('loadedmetadata', () => resolve({ duration: video.duration, width: video.videoWidth, height: video.videoHeight }), { once: true });
            video.addEventListener('error', () => reject(new Error(`video failed to load: ${video.error?.message || video.error?.code}`)), { once: true });
            video.load();
          }));
          assert.equal(media.width, 1920);
          assert.equal(media.height, 1080);
          assert.ok(media.duration > 45);
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no horizontal overflow at ${viewport.width}`);
        if (viewport.width < 700) {
          await page.locator('#menu').click();
          assert.equal(await page.locator('#menu').getAttribute('aria-expanded'), 'true');
          await page.locator('#nav a[href="#films"]').click();
          assert.equal(await page.locator('#menu').getAttribute('aria-expanded'), 'false');
          await page.goBack();
        }
        await page.locator('#film-recorrido .film-transcript summary').click();
        assert.equal(await page.locator('#film-recorrido .film-transcript').getAttribute('open'), '');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        assert.equal(await page.locator('video[autoplay]').count(), 0, 'videos must never autoplay');
        assert.equal(await page.locator('#presentation-title').isVisible(), true, 'presentation remains readable with reduced motion');
        assert.deepEqual(errors, []);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        if (viewport.width !== 768) await page.screenshot({ path: `D:/Dev/temp/opencode/presentacion-${base.endsWith('/dist') ? 'dist-' : ''}${viewport.width}.png`, fullPage: false });
        await page.close();
      }
    }
    console.log('PASS: presentation page works in source/dist at desktop, tablet and mobile; transcripts, captions, downloads, menu, and overflow checked.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
