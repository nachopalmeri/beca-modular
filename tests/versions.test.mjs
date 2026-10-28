import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Every page shares one release version in its ?v= cache-bust. A page left behind on an old
// version can serve stale CSS/JS to returning visitors while its markup already changed.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'demo.html', 'laboratorio.html', 'respaldo.html', 'modelo.html'];

test('all pages share one current cache-bust version (root and dist)', () => {
  const found = new Set();
  let pagesWithVersion = 0;
  for (const dir of ['', 'dist']) {
    for (const page of pages) {
      const html = readFileSync(path.join(root, dir, page), 'utf8');
      const versions = [...html.matchAll(/\?v=(\d+)/g)].map(match => match[1]);
      if (versions.length) pagesWithVersion++;
      versions.forEach(version => found.add(version));
    }
  }
  assert.equal(pagesWithVersion, pages.length * 2, 'every page (root and dist) must reference versioned assets');
  assert.equal(found.size, 1, `expected a single cache-bust version across pages, found: ${[...found].join(', ')}`);
});
