import test from 'node:test';
import assert from 'node:assert/strict';
import { AI_LIMITS, explainReceipt, generateImpactReport, prevalidateMilestone } from '../ai/ai-provider.mjs';

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

test('receipt explanation fallback uses exact sats and clearly says the payment is simulated', async () => {
  const result = await explainReceipt({ amountSats: 50000, milestoneTitle: 'aprobar el hito 1', reservedSats: 50000 });
  assert.equal(result.label, 'IA (modo demo)');
  assert.match(result.explanation, /te llegaron 50\.000 sats/);
  assert.match(result.explanation, /Quedan 50\.000 sats reservados/);
  assert.match(result.explanation, /No hubo un pago real en Lightning/);
});

test('configured AI explains receipts but cannot change the exact amount facts in its prompt', async () => {
  let sentPrompt;
  const result = await explainReceipt({ amountSats: 1234, milestoneTitle: 'Examen final', reservedSats: 8766 }, {
    env: { OPENAI_API_KEY: 'server-secret' },
    fetchImpl: async (_url, options) => {
      sentPrompt = JSON.parse(options.body).input[0].content[0].text;
      return { ok: true, json: async () => ({ output_text: 'En esta simulación llegaron 1.234 sats. Otros 8.766 sats siguen reservados y volverían al sponsor. No es un pago real.' }) };
    },
  });
  assert.match(sentPrompt, /1234 sats/);
  assert.match(sentPrompt, /8766 sats/);
  assert.equal(result.provider, 'openai');
  assert.equal(result.label, 'Sugerido por IA');
});

test('receipt explanation rejects invalid or invented-unit inputs', async () => {
  await assert.rejects(explainReceipt({ amountSats: 1.2, milestoneTitle: 'Hito', reservedSats: 0 }), /importes enteros en sats/);
  await assert.rejects(explainReceipt({ amountSats: 10, milestoneTitle: '', reservedSats: 0 }), /hito válido/);
});

test('impact report fallback repeats exact app totals and disclaims real-world outcomes', async () => {
  const result = await generateImpactReport({ paidSats: 50000, students: 1, completedMilestones: 1, refundedSats: 50000 });
  assert.equal(result.label, 'IA (modo demo)');
  assert.match(result.summary, /50\.000 sats pagados a 1 estudiante/);
  assert.match(result.summary, /1 hito.*cumplido/);
  assert.match(result.summary, /50\.000 sats devueltos/);
  assert.match(result.summary, /no transferencias ni resultados educativos observados/);
});

test('impact report requires non-negative integer totals and uses configured AI server-side', async () => {
  await assert.rejects(generateImpactReport({ paidSats: -1, students: 0, completedMilestones: 0, refundedSats: 0 }), /enteros y no negativos/);
  let prompt;
  const result = await generateImpactReport({ paidSats: 1234, students: 2, completedMilestones: 3, refundedSats: 99 }, {
    env: { ANTHROPIC_API_KEY: 'server-secret' },
    fetchImpl: async (_url, options) => {
      prompt = JSON.parse(options.body).messages[0].content[0].text;
      return { ok: true, json: async () => ({ content: [{ type: 'text', text: 'En la sesión se marcaron tres hitos con 2 estudiantes de ejemplo. Se pagaron 1.234 sats y devolvieron 99 sats; son cifras simuladas, no resultados educativos.' }] }) };
    },
  });
  assert.match(prompt, /pagos registrados 1234 sats/);
  assert.match(prompt, /hitos marcados cumplidos 3/);
  assert.equal(result.provider, 'anthropic');
  assert.equal(result.label, 'Sugerido por IA');
});
