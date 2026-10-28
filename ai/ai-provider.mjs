import { demoImpactReport, demoPrevalidation, demoReceiptExplanation } from './fallback.mjs';

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

async function callAnthropic(prompt, apiKey, fetchImpl, file) {
  const content = [{ type: 'text', text: prompt }];
  if (file?.mediaType.startsWith('image/')) content.push({ type: 'image', source: { type: 'base64', media_type: file.mediaType, data: file.data } });
  if (file?.mediaType === 'application/pdf') content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: file.data } });
  const response = await fetchImpl('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest', max_tokens: 500, messages: [{ role: 'user', content }] }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error('El proveedor Anthropic no pudo revisar la evidencia.');
  return payload.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') ?? '';
}

async function callOpenAI(prompt, apiKey, fetchImpl, file) {
  const content = [{ type: 'input_text', text: prompt }];
  if (file?.mediaType.startsWith('image/')) content.push({ type: 'input_image', image_url: `data:${file.mediaType};base64,${file.data}` });
  if (file?.mediaType === 'application/pdf') content.push({ type: 'input_file', filename: 'evidencia.pdf', file_data: `data:application/pdf;base64,${file.data}` });
  const response = await fetchImpl('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', input: [{ role: 'user', content }], max_output_tokens: 500 }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error('El proveedor OpenAI no pudo revisar la evidencia.');
  return payload.output?.flatMap(item => item.content ?? []).filter(item => item.type === 'output_text').map(item => item.text).join('\n') ?? payload.output_text ?? '';
}

async function callConfiguredModel(prompt, { env, fetchImpl, file } = {}) {
  if (env?.ANTHROPIC_API_KEY) return { text: await callAnthropic(prompt, env.ANTHROPIC_API_KEY, fetchImpl, file), provider: 'anthropic' };
  if (env?.OPENAI_API_KEY) return { text: await callOpenAI(prompt, env.OPENAI_API_KEY, fetchImpl, file), provider: 'openai' };
  return null;
}

export async function prevalidateMilestone(request, { env = {}, fetchImpl = fetch } = {}) {
  const input = validateRequest(request);
  const prompt = `${instruction(input.condition)}\n\nTexto extraído/proporcionado:\n${input.text || '(sin texto extraído)'}`;
  const configured = await callConfiguredModel(prompt, { env, fetchImpl, file: input.file });
  if (configured) return { ...jsonFromModel(configured.text), provider: configured.provider, label: 'Sugerido por IA' };
  return demoPrevalidation(input.text, input.condition);
}

export async function explainReceipt(request, { env = {}, fetchImpl = fetch } = {}) {
  const { amountSats, milestoneTitle, reservedSats } = request ?? {};
  if (!Number.isSafeInteger(amountSats) || amountSats <= 0 || !Number.isSafeInteger(reservedSats) || reservedSats < 0 || typeof milestoneTitle !== 'string' || !milestoneTitle.trim() || milestoneTitle.length > 100) {
    throw new Error('El recibo requiere importes enteros en sats y un hito válido.');
  }
  const fallback = demoReceiptExplanation({ amountSats, milestoneTitle, reservedSats });
  const prompt = `Explicá este recibo a un estudiante o su familia en español simple, en 2 o 3 frases breves. Usá exactamente estos datos, no inventes ni cambies importes: se liberaron ${amountSats} sats al aprobar el hito "${milestoneTitle}"; quedan ${reservedSats} sats reservados, que vuelven al sponsor si no se usan. No afirmes que ocurrió un pago real; es una simulación.`;
  const configured = await callConfiguredModel(prompt, { env, fetchImpl });
  if (!configured) return fallback;
  const explanation = normalizeText(configured.text, 500);
  if (!explanation) throw new Error('El proveedor de IA no devolvió una explicación del recibo.');
  return { explanation, provider: configured.provider, label: 'Sugerido por IA' };
}

export async function generateImpactReport(request, { env = {}, fetchImpl = fetch } = {}) {
  const { paidSats, students, completedMilestones, refundedSats } = request ?? {};
  if (![paidSats, students, completedMilestones, refundedSats].every(Number.isSafeInteger) || paidSats < 0 || students < 0 || completedMilestones < 0 || refundedSats < 0) {
    throw new Error('El reporte requiere totales enteros y no negativos tomados del ledger de la app.');
  }
  const fallback = demoImpactReport({ paidSats, students, completedMilestones, refundedSats });
  const prompt = `Redactá un resumen de impacto de 1 o 2 frases, en español simple, usando exclusivamente estos datos de la sesión local (no son impacto educativo real): pagos registrados ${paidSats} sats; estudiantes de ejemplo ${students}; hitos marcados cumplidos ${completedMilestones}; devoluciones registradas ${refundedSats} sats. No inventes resultados, causas, beneficiarios ni calificaciones. Aclarà que son datos de simulación y no transferencias reales.`;
  const configured = await callConfiguredModel(prompt, { env, fetchImpl });
  if (!configured) return fallback;
  const summary = normalizeText(configured.text, 600);
  if (!summary) throw new Error('El proveedor de IA no devolvió el resumen de impacto.');
  return { summary, provider: configured.provider, label: 'Sugerido por IA' };
}

export const AI_LIMITS = Object.freeze({ maxEvidenceBytes: MAX_EVIDENCE_BYTES, allowedTypes: [...ALLOWED_TYPES] });
