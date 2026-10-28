const WINDOW_MS = 60_000;
const REQUESTS_PER_WINDOW = 8;
const MAX_BODY_BYTES = 11 * 1024 * 1024;
const hitsByIp = new Map();

function json(res, status, payload, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(payload));
}

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const configured = (process.env.AI_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  const forwardedHost = req.headers['x-forwarded-host'] || req.headers.host;
  const forwardedProto = req.headers['x-forwarded-proto'] || 'https';
  const sameOrigin = `${forwardedProto}://${forwardedHost}`;
  return configured.length ? configured.includes(origin) : origin === sameOrigin;
}

function rateLimit(req) {
  const now = Date.now();
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() || req.socket?.remoteAddress || 'unknown';
  const recent = (hitsByIp.get(ip) || []).filter(timestamp => now - timestamp < WINDOW_MS);
  if (recent.length >= REQUESTS_PER_WINDOW) {
    hitsByIp.set(ip, recent);
    return false;
  }
  recent.push(now);
  hitsByIp.set(ip, recent);
  if (hitsByIp.size > 2_000) {
    for (const [key, values] of hitsByIp) {
      if (!values.some(timestamp => now - timestamp < WINDOW_MS)) hitsByIp.delete(key);
    }
  }
  return true;
}

export function createAiHandler(operation) {
  return async function aiHandler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return json(res, 405, { error: 'Usá POST para esta ruta.' });
    }
    if (!originAllowed(req)) return json(res, 403, { error: 'Origen no permitido.' });
    if (!rateLimit(req)) return json(res, 429, { error: 'Demasiadas solicitudes. Esperá un minuto y volvé a intentar.' }, { 'Retry-After': '60' });

    const contentLength = Number(req.headers['content-length'] || 0);
    if (contentLength > MAX_BODY_BYTES) return json(res, 413, { error: 'La solicitud supera el límite de 11 MB.' });

    try {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      if (body === undefined) body = {};
      if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
        return json(res, 413, { error: 'La solicitud supera el límite de 11 MB.' });
      }
      const hasProviderKey = Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
      if (hasProviderKey && process.env.AI_API_ENABLED !== 'true') {
        return json(res, 503, { error: 'La IA con proveedor externo no está habilitada para este despliegue.' });
      }
      const result = await operation(body, { env: process.env });
      return json(res, 200, result);
    } catch (error) {
      const message = error instanceof SyntaxError ? 'El cuerpo JSON no es válido.' : (error?.message || 'No se pudo procesar la solicitud.');
      const status = error instanceof SyntaxError ? 400 : /Subí|Describí|Adjuntá|supera el límite|está vacío|importes enteros|hito válido|totales enteros/i.test(message) ? 400 : 502;
      return json(res, status, { error: message });
    }
  };
}

export const AI_API_LIMITS = Object.freeze({ windowMs: WINDOW_MS, requestsPerWindow: REQUESTS_PER_WINDOW, maxBodyBytes: MAX_BODY_BYTES });
