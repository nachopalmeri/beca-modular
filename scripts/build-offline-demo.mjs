import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const OFFLINE_FILES = [
  'demo.html', 'modelo.html', 'modelo.mjs', 'model.mjs', 'styles.css', 'roadmap.mjs', 'funding-model.mjs',
  'brote-motion.mjs', 'server.mjs', 'offline-demo-README.md',
  'tree.mjs', 'evidence-map.mjs',
  'payments/payment-provider.mjs', 'payments/demo-ui.mjs',
  'ai/ai-provider.mjs', 'ai/fallback.mjs',
  'docs/financial-model.md',
  'vendor/qrcode-generator.js', 'vendor/THIRD-PARTY-NOTICES.md',
  'data/abandono-interanual.mjs', 'data/geo-provincias.mjs',
  'assets/beca-library-hero.png',
];
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function buildZip(entries) {
  const local = [], central = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const filename = Buffer.from(name, 'utf8'), compressed = deflateRawSync(data), checksum = crc32(data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x800, 6); head.writeUInt16LE(8, 8);
    head.writeUInt32LE(checksum, 14); head.writeUInt32LE(compressed.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(filename.length, 26);
    local.push(head, filename, compressed);
    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50, 0); record.writeUInt16LE(20, 4); record.writeUInt16LE(20, 6); record.writeUInt16LE(0x800, 8); record.writeUInt16LE(8, 10);
    record.writeUInt32LE(checksum, 16); record.writeUInt32LE(compressed.length, 20); record.writeUInt32LE(data.length, 24); record.writeUInt16LE(filename.length, 28); record.writeUInt32LE(offset, 42);
    central.push(record, filename);
    offset += head.length + filename.length + compressed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

// The kit keeps the demo's own links honest: a tiny index explains the offline copy, and the
// redundant self-download paragraph becomes a note, so no link inside the extracted folder 404s.
export function buildIndexShim() {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f1ead8"><title>Beca Modular — copia offline</title>
<style>body{margin:0;background:#f4eddd;color:#26362a;font:16px/1.7 Georgia,serif}main{max-width:640px;margin:0 auto;padding:64px 24px}a{color:#754436}a.button{display:inline-block;margin:8px 0;padding:12px 18px;border-radius:8px;background:#203b2e;color:#fff8e8;text-decoration:none}small{display:block;margin-top:28px;color:#5b5b50;font-size:12px}</style></head>
<body><main><span style="letter-spacing:.14em;font:600 11px monospace;color:#80503d">BECA MODULAR · COPIA OFFLINE</span>
<h1 style="font-weight:500">Estás usando el respaldo local.</h1>
<p>Esta carpeta contiene la demo sintética y sus archivos para usar sin internet: no incluye mapas externos ni la landing completa.</p>
<p><a class="button" href="demo.html">Abrir la demo →</a></p>
<p><small>La landing completa vive en <a href="https://beca-clara.vercel.app/" target="_blank" rel="noopener noreferrer">beca-clara.vercel.app</a>. La simulación no representa pagos ni verificaciones reales.</small></p>
</main></body></html>
`;
}
export function transformOfflineDemo(html) {
  const next = html.replace(/<p class="offline-kit-link">[\s\S]*?<\/p>/, '<p class="offline-kit-link"><span>Ya estás dentro del respaldo offline: este archivo no necesita descargarse de nuevo. La landing completa sigue en línea en https://beca-clara.vercel.app/.</span></p>');
  if (next === html) throw new Error('offline kit: expected the demo download paragraph in demo.html');
  return next;
}
export async function buildOfflineEntries() {
  const entries = await Promise.all(OFFLINE_FILES.map(async name => {
    const data = await readFile(path.join(root, name));
    return [name, name === 'demo.html' ? Buffer.from(transformOfflineDemo(data.toString('utf8')), 'utf8') : data];
  }));
  entries.push(['index.html', Buffer.from(buildIndexShim(), 'utf8')]);
  return entries;
}
export async function buildOfflineZip() {
  return buildZip(await buildOfflineEntries());
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) {
  const zip = await buildOfflineZip();
  await Promise.all([
    writeFile(path.join(root, 'beca-demo-offline.zip'), zip),
    writeFile(path.join(root, 'dist', 'beca-demo-offline.zip'), zip),
  ]);
  console.log(`Built ${OFFLINE_FILES.length + 1} files into beca-demo-offline.zip (${zip.length} bytes).`);
}
