// Prueba de reproducción real en Chrome: reproduce cada MP4 completo (el loop, dos ciclos)
// y verifica que avance sin errores ni atascos.
const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

const dir = path.join(__dirname, '..', 'out');
const server = http.createServer((req, res) => {
  const f = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(dir) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(f).size, range = req.headers.range;
  if (range) {
    const [a, b] = range.replace('bytes=', '').split('-'); const s = +a, e = b ? +b : size - 1;
    res.writeHead(206, { 'Content-Type': 'video/mp4', 'Content-Range': `bytes ${s}-${e}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': e - s + 1 });
    return fs.createReadStream(f, { start: s, end: e }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': size, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(f).pipe(res);
}).listen(4179);

(async () => {
  const exe = process.env.BECA_BROWSER || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
  const b = await chromium.launch({ executablePath: exe, args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setContent('<video id="v" muted playsinline></video>');
  for (const [file, cycles] of [['beca-modular-promo.mp4', 1], ['beca-modular-loop.mp4', 2]]) {
    const r = await p.evaluate(async ([src, cycles]) => {
      const v = document.getElementById('v');
      const can = v.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"');
      v.src = src; v.playbackRate = 4; v.loop = cycles > 1;
      let wraps = 0, last = 0, errors = 0, stalls = 0;
      v.onerror = () => errors++; v.onstalled = () => stalls++;
      await v.play();
      const t0 = performance.now();
      return await new Promise(res => {
        const check = () => {
          if (v.currentTime + 0.5 < last) wraps++;
          last = v.currentTime;
          if ((cycles === 1 && v.ended) || wraps >= cycles - 1 && cycles > 1 && v.currentTime > v.duration - 0.6 || performance.now() - t0 > 120000)
            return res({ can, duration: v.duration, w: v.videoWidth, h: v.videoHeight, ended: v.ended, wraps, decoded: v.getVideoPlaybackQuality().totalVideoFrames, dropped: v.getVideoPlaybackQuality().droppedVideoFrames, errors, stalls, wallSeconds: ((performance.now() - t0) / 1000).toFixed(1) });
          setTimeout(check, 100);
        };
        check();
      });
    }, [`http://localhost:4179/${file}`, cycles]);
    console.log(file, JSON.stringify(r));
  }
  await b.close(); server.close();
})();
