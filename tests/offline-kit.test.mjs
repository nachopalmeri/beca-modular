import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOfflineEntries, OFFLINE_FILES } from '../scripts/build-offline-demo.mjs';

test('offline kit bundles every runtime file plus an index shim and rewrites the self-download link', async () => {
  const entries = await buildOfflineEntries();
  const names = entries.map(([name]) => name);
  assert.equal(names.length, OFFLINE_FILES.length + 1, 'kit entries are the runtime files plus index.html');
  for (const required of [
    'demo.html', 'styles.css', 'roadmap.mjs', 'funding-model.mjs', 'brote-motion.mjs', 'tree.mjs',
    'evidence-map.mjs', 'server.mjs', 'offline-demo-README.md', 'index.html',
    'payments/payment-provider.mjs', 'payments/demo-ui.mjs', 'vendor/qrcode-generator.js', 'vendor/THIRD-PARTY-NOTICES.md',
    'ai/ai-provider.mjs', 'ai/fallback.mjs',
    'data/abandono-interanual.mjs', 'data/geo-provincias.mjs', 'assets/beca-library-hero.png'
  ]) {
    assert.ok(names.includes(required), `kit missing ${required}`);
  }
  const demo = entries.find(([name]) => name === 'demo.html')[1].toString('utf8');
  assert.ok(!demo.includes('beca-demo-offline.zip'), 'the kit must not link to its own archive');
  assert.match(demo, /Ya estás dentro del respaldo offline/);
  assert.match(demo, /href="index\.html#roadmap"/, 'the landing link stays and now resolves to the shim');
  const shim = entries.find(([name]) => name === 'index.html')[1].toString('utf8');
  assert.match(shim, /href="demo\.html"/);
  assert.match(shim, /beca-clara\.vercel\.app/);
});
