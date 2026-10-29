// Renderiza la composición cuadro por cuadro y la codifica con FFmpeg.
// Uso: node render.cjs <promo|loop> [salida.mp4] [--from s] [--to s] [--every n]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const mode = args[0] || 'promo';
const out = args[1] && !args[1].startsWith('--') ? args[1] : path.join(__dirname, '..', 'build', `${mode}-video.mp4`);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? +args[i + 1] : undefined; };
const BASE = process.env.BASE || 'http://localhost:4178';
const QC = path.join(__dirname, '..', 'build', 'qc', mode);
(async () => {
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.mkdirSync(QC, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  p.on('console', m => m.type() === 'error' && console.log('CONSOLE', m.text()));
  await p.goto(`${BASE}/video/src/compose.html?mode=${mode}`, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__composeReady);
  const { FPS, DURATION } = await p.evaluate(() => ({ FPS: COMPOSE.FPS, DURATION: COMPOSE.DURATION }));
  const f0 = Math.round((opt('--from') || 0) * FPS), f1 = Math.round((opt('--to') ?? DURATION) * FPS);
  const every = opt('--every') || 1;
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS / every), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.1',
    '-r', String(FPS / every), '-movflags', '+faststart', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const stage = await p.$('#stage');
  const t0 = Date.now();
  for (let f = f0; f < f1; f += every) {
    await p.evaluate(t => COMPOSE.renderAt(t), f / FPS);
    const buf = await stage.screenshot({ type: 'jpeg', quality: 96 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 30 === 0) fs.writeFileSync(path.join(QC, `${String(f).padStart(5, '0')}.jpg`), buf);
    if (f % 150 === 0) console.log(mode, f, '/', f1, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('ok', out);
})();
