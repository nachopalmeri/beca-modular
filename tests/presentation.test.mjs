import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const kit = readFileSync(new URL('../docs/hackathon/kit-presentacion.md', import.meta.url), 'utf8');
const laboratory = readFileSync(new URL('../laboratorio.html', import.meta.url), 'utf8');
const respaldo = readFileSync(new URL('../respaldo.html', import.meta.url), 'utf8');
const timer = readFileSync(new URL('../judge.mjs', import.meta.url), 'utf8');

test('pitch stays within the 55-second brief and keeps the unsourced Progresar placeholder', () => {
  const pitch = kit.match(/## Pitch de hasta 55 segundos\s+\n> ([\s\S]*?)\n\n\*\*Tiempo estimado/)[1];
  assert.ok(pitch.split(/\s+/).length <= 115, 'pitch should fit 55 seconds at a clear speaking pace');
  assert.match(pitch, /\[DATO A VERIFICAR \+ fuente\]/);
  assert.match(pitch, /el estudiante no paga/i);
  assert.match(pitch, /preimage y hash/);
  assert.match(pitch, /simulados, no mueven fondos/);
  const livePitch = laboratory.match(/id="pitch-text">([\s\S]*?)<\/p>/)?.[1] ?? '';
  assert.ok(livePitch.split(/\s+/).length <= 115, 'visible laboratory pitch should fit 55 seconds');
  assert.match(livePitch, /\[DATO A VERIFICAR \+ fuente\]/);
  assert.doesNotMatch(laboratory, /GUIÓN OBJETIVO 60 SEGUNDOS|Guion objetivo de 60 segundos/);
  const qa = kit.match(/## Cinco preguntas del jurado\n([\s\S]*?)(?=\n## |$)/)?.[1] ?? '';
  assert.equal((qa.match(/^\d+\. \*\*/gm) ?? []).length, 5, 'exactly five juror Q&A answers');
});

test('stage timer is capped at 55 seconds', () => {
  assert.match(respaldo, /PITCH DE 55 SEGUNDOS/);
  assert.match(respaldo, />00:55</);
  assert.match(timer, /performance\.now\(\)\+55000/);
  assert.doesNotMatch(timer, /performance\.now\(\)\+60000/);
});
