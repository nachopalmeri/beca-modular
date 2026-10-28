import { demoPrevalidation } from './fallback.mjs';

const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain']);

function normalizeText(value, limit = 12000) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, ' ').slice(0, limit).trim() : '';
}

function validateRequest({ condition, text = '', file } = {}) {
  const cleanCondition = normalizeText(condition, 500);
  const cleanText = normalizeText(text, 12000);
  if (!cleanCondition) throw new Error('Describí la condición del hito antes de revisar la evidencia.');
  if (file !== undefined) {
    if (!file || !ALLOWED_TYPES.has(file.mediaType) || typeof file.data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.data)) throw new Error('Adjuntá una imagen PNG/JPEG/WebP, un PDF o texto plano válido.');
    if (Buffer.byteLength(file.data, 'base64') > MAX_EVIDENCE_BYTES) throw new Error('El archivo supera el límite de 8 MB.');
    if (Buffer.from(file.data, 'base64').length === 0) throw new Error('El archivo está vacío.');
  }
  if (!cleanText && !file) throw new Error('Subí una evidencia o pegá su texto para iniciar la revisión.');
  return { condition: cleanCondition, text: cleanText, file };
}

function jsonFromModel(text) {
  const candidate = text.match(/\{[\s\S]*\}/)?.[0];
  if (!candidate) throw new Error('El proveedor de IA no devolvió una respuesta estructurada.');
  const parsed = JSON.parse(candidate);
  if (!['aprobar', 'revisar'].includes(parsed.suggestion) || typeof parsed.reason !== 'string') throw new Error('La respuesta de IA no cumple el formato esperado.');
  const confidence = Number(parsed.confidence);
  return {
    suggestion: parsed.suggestion,
    reason: normalizeText(parsed.reason, 500),
    confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0.2,
    extracted: Object.fromEntries(['nombre', 'materia', 'nota', 'fecha'].map(key => [key, normalizeText(parsed.extracted?.[key], 100) || null])),
    humanDecisionRequired: true,
  };
}

const instruction = condition => `Ayudás a una tutora a revisar evidencia académica. Extraé nombre, materia, nota y fecha si son legibles. Compará solo con esta condición: "${condition}". Nunca decidas ni apruebes; sugerí "aprobar" solo si el documento parece cumplir y "revisar" ante duda, falta de datos o conflicto. No infieras datos ausentes. Respondé únicamente JSON: {"suggestion":"aprobar|revisar","reason":"motivo breve en español","confidence":0.0,"extracted":{"nombre":null,"materia":null,"nota":null,"fecha":null}}`;

async function callAnthropic(input, apiKey, fetchImpl) {
  const content = [{ type: 'text', text: `${instruction(input.condition)}\n\nTexto extraído/proporcionado:\n${input.text || '(sin texto extraído)'}` }];
  if (input.file?.mediaType.startsWith('image/')) content.push({ type: 'image', source: { type: 'base64', media_type: input.file.mediaType, data: input.file.data } });
  if (input.file?.mediaType === 'application/pdf') content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: input.file.data } });
  const response = await fetchImpl('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest', max_tokens: 500, messages: [{ role: 'user', content }] }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error('El proveedor Anthropic no pudo revisar la evidencia.');
  return payload.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') ?? '';
}

async function callOpenAI(input, apiKey, fetchImpl) {
  const content = [{ type: 'input_text', text: `${instruction(input.condition)}\n\nTexto extraído/proporcionado:\n${input.text || '(sin texto extraído)'}` }];
  if (input.file?.mediaType.startsWith('image/')) content.push({ type: 'input_image', image_url: `data:${input.file.mediaType};base64,${input.file.data}` });
  if (input.file?.mediaType === 'application/pdf') content.push({ type: 'input_file', filename: 'evidencia.pdf', file_data: `data:application/pdf;base64,${input.file.data}` });
  const response = await fetchImpl('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', input: [{ role: 'user', content }], max_output_tokens: 500 }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error('El proveedor OpenAI no pudo revisar la evidencia.');
  return payload.output?.flatMap(item => item.content ?? []).filter(item => item.type === 'output_text').map(item => item.text).join('\n') ?? payload.output_text ?? '';
}

export async function prevalidateMilestone(request, { env = {}, fetchImpl = fetch } = {}) {
  const input = validateRequest(request);
  if (env.ANTHROPIC_API_KEY) {
    return { ...jsonFromModel(await callAnthropic(input, env.ANTHROPIC_API_KEY, fetchImpl)), provider: 'anthropic', label: 'Sugerido por IA' };
  }
  if (env.OPENAI_API_KEY) {
    return { ...jsonFromModel(await callOpenAI(input, env.OPENAI_API_KEY, fetchImpl)), provider: 'openai', label: 'Sugerido por IA' };
  }
  return demoPrevalidation(input.text, input.condition);
}

export const AI_LIMITS = Object.freeze({ maxEvidenceBytes: MAX_EVIDENCE_BYTES, allowedTypes: [...ALLOWED_TYPES] });
