import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.png': 'image/png' };
createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = path.resolve(root, '.' + relative);
    if (!file.startsWith(root) || !types[path.extname(file)]) { res.writeHead(403); return res.end('Forbidden'); }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4178,'127.0.0.1',()=>console.log('Beca Modular → http://127.0.0.1:4178 (local simulation)'));
