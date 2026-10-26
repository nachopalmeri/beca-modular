import test from 'node:test';
import assert from 'node:assert/strict';
import { broteSVG, walkCycle, openingRigPose, scenePose, closingPose, blinkAt } from '../brote-rig.mjs';
import { openingPose } from '../brote-motion.mjs';

test('el SVG de Brote trae todas las articulaciones y el zapato derecho que mide la apertura', () => {
  const svg = broteSVG();
  for (const part of ['body', 'page', 'head', 'armL', 'armR', 'legL', 'legR', 'stem', 'leafL', 'leafR', 'eyes', 'cap', 'zz']) assert.match(svg, new RegExp(`data-part="${part}"`));
  assert.match(svg, /brote-leg-right[^>]*>[\s\S]*?class="brote-shoe/);
});

test('las poses son funciones puras del progreso: ir y volver da la misma pose', () => {
  for (const p of [0.05, 0.3, 0.59, 0.8, 0.95]) {
    const phase = openingPose(p).phase;
    assert.deepEqual(openingRigPose(phase, p), openingRigPose(phase, p));
  }
  assert.deepEqual(closingPose(0.7, 1234), closingPose(0.7, 1234));
});

test('caminar alterna piernas y brazos en oposición', () => {
  const a = walkCycle(0.25), b = walkCycle(0.75);
  assert.ok(a.legL > 0 && a.legR < 0 && b.legL < 0 && b.legR > 0);
  assert.equal(Math.sign(a.armL), -Math.sign(a.legL));
});

test('el cierre termina graduado y dormido; el mapa preocupa y la curva festeja', () => {
  const end = closingPose(1, 0);
  assert.equal(end.cap, 1); assert.equal(end.blink, 1); assert.equal(end.zz, 1);
  assert.equal(scenePose('mapa', 1, 0).mood, 'sad');
  assert.equal(scenePose('curva', 1, 0).mood, 'grin');
});

test('el parpadeo es breve y periódico', () => {
  assert.ok(blinkAt(70) > 0.9);
  assert.equal(blinkAt(1000), 0);
  assert.equal(blinkAt(3600 + 70), blinkAt(70));
});
