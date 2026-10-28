import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { explainReceipt, generateImpactReport, prevalidateMilestone } from './ai/ai-provider.mjs';
const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.zip': 'application/zip' };
createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const aiRoutes = new Map([
      ['/api/ai/prevalidate', prevalidateMilestone],
      ['/api/ai/explain-receipt', explainReceipt],
      ['/api/ai/impact-report', generateImpactReport],
    ]);
    if (aiRoutes.has(url.pathname) && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 11 * 1024 * 1024) {
          res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
          return res.end(JSON.stringify({ error: 'La solicitud supera el límite de 11 MB.' }));
        }
      }
      try {
        const result = await aiRoutes.get(url.pathname)(JSON.parse(body));
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        return res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        return res.end(JSON.stringify({ error: error.message || 'No se pudo revisar la evidencia.' }));
      }
    }
    const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname === '/modelo' ? '/modelo.html' : url.pathname);
    const file = path.resolve(root, '.' + relative);
    if (!file.startsWith(root) || !types[path.extname(file)]) { res.writeHead(403); return res.end('Forbidden'); }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT || 4178),'127.0.0.1',()=>console.log(`Beca Modular → http://127.0.0.1:${Number(process.env.PORT || 4178)} (local simulation)`));
