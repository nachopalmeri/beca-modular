import test from 'node:test';
import assert from 'node:assert/strict';
import { AI_LIMITS, prevalidateMilestone } from '../ai/ai-provider.mjs';

test('demo AI extracts visible fields and suggests review when the grade meets the milestone', async () => {
  const result = await prevalidateMilestone({
    condition: 'Nota mínima 6',
    text: 'Estudiante: Ana Pérez\nMateria: Álgebra I\nNota: 8\nFecha: 12/10/2026',
    env: {},
  });
  assert.equal(result.provider, 'demo');
  assert.equal(result.label, 'IA (modo demo)');
  assert.equal(result.suggestion, 'aprobar');
  assert.equal(result.extracted.nombre, 'Ana Pérez');
  assert.equal(result.extracted.materia, 'Álgebra I');
  assert.equal(result.extracted.nota, '8');
  assert.equal(result.extracted.fecha, '12/10/2026');
  assert.equal(result.humanDecisionRequired, true);
});

test('demo AI recommends review for a missing or below-threshold grade and for opaque files', async () => {
  const below = await prevalidateMilestone({ condition: 'Nota mínima 7', text: 'Nota: 5' });
  const unknown = await prevalidateMilestone({
    condition: 'Materia aprobada con nota mínima 6',
    file: { mediaType: 'image/png', data: Buffer.from('synthetic-image').toString('base64') },
  });
  assert.equal(below.suggestion, 'revisar');
  assert.match(below.reason, /no alcanza/);
  assert.equal(unknown.suggestion, 'revisar');
  assert.equal(unknown.confidence, 0.2);
  assert.match(unknown.reason, /documento original/);
});

test('prevalidation rejects empty, unsupported, malformed and oversized evidence', async () => {
  await assert.rejects(prevalidateMilestone({ condition: 'Nota mínima 6' }), /Subí una evidencia/);
  await assert.rejects(prevalidateMilestone({ condition: '', text: 'Nota: 8' }), /condición del hito/);
  await assert.rejects(prevalidateMilestone({ condition: 'Nota mínima 6', file: { mediaType: 'application/octet-stream', data: 'YWJj' } }), /Adjuntá una imagen/);
  await assert.rejects(prevalidateMilestone({ condition: 'Nota mínima 6', file: { mediaType: 'image/png', data: '***' } }), /Adjuntá una imagen/);
  await assert.rejects(prevalidateMilestone({ condition: 'Nota mínima 6', file: { mediaType: 'image/png', data: Buffer.alloc(AI_LIMITS.maxEvidenceBytes + 1).toString('base64') } }), /supera el límite/);
});

test('Anthropic is selected server-side and response is normalized without logging the evidence', async () => {
  const requests = [];
  const result = await prevalidateMilestone({ condition: 'Nota mínima 6', text: 'Nota: 9' }, {
    env: { ANTHROPIC_API_KEY: 'server-secret', OPENAI_API_KEY: 'other-secret' },
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ content: [{ type: 'text', text: JSON.stringify({ suggestion: 'aprobar', reason: 'Nota sobre el umbral.', confidence: 1.4, extracted: { nota: '9' } }) }] }) };
    },
  });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, 'https://api.anthropic.com/v1/messages');
  assert.equal(requests[0].options.headers['x-api-key'], 'server-secret');
  assert.equal(result.provider, 'anthropic');
  assert.equal(result.label, 'Sugerido por IA');
  assert.equal(result.confidence, 1);
  assert.equal(result.humanDecisionRequired, true);
  assert.equal(JSON.stringify(result).includes('server-secret'), false);
});

test('OpenAI can receive an uploaded PDF while the provider key stays in the server request', async () => {
  let sentBody;
  const result = await prevalidateMilestone({
    condition: 'Nota mínima 6',
    file: { mediaType: 'application/pdf', data: Buffer.from('%PDF fake fixture').toString('base64') },
  }, {
    env: { OPENAI_API_KEY: 'openai-server-secret' },
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://api.openai.com/v1/responses');
      assert.equal(options.headers.authorization, 'Bearer openai-server-secret');
      sentBody = JSON.parse(options.body);
      return { ok: true, json: async () => ({ output_text: JSON.stringify({ suggestion: 'revisar', reason: 'El documento no es legible.', confidence: 0.15, extracted: {} }) }) };
    },
  });
  assert.equal(sentBody.input[0].content[1].type, 'input_file');
  assert.equal(result.provider, 'openai');
  assert.equal(result.suggestion, 'revisar');
});
