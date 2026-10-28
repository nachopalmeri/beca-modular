import test from 'node:test';
import assert from 'node:assert/strict';
import prevalidate from '../api/ai/prevalidate.mjs';
import explainReceipt from '../api/ai/explain-receipt.mjs';
import impactReport from '../api/ai/impact-report.mjs';

function response() {
  return {
    headers: {}, statusCode: 200, body: '',
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(body) { this.body = body; },
    json() { return JSON.parse(this.body); },
  };
}

function request({ method = 'POST', body = {}, headers = {}, remoteAddress = '127.0.0.1' } = {}) {
  return { method, body, headers: { host: 'localhost:3000', ...headers }, socket: { remoteAddress } };
}

test('Vercel IA handlers return deterministic demo responses without provider credentials', async () => {
  const old = { anthropic: process.env.ANTHROPIC_API_KEY, openai: process.env.OPENAI_API_KEY, enabled: process.env.AI_API_ENABLED };
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.AI_API_ENABLED;
  try {
    for (const [handler, body] of [
      [prevalidate, { condition: 'Nota mínima 6', text: 'Nota: 8' }],
      [explainReceipt, { amountSats: 1000, milestoneTitle: 'Examen', reservedSats: 500 }],
      [impactReport, { paidSats: 1000, students: 1, completedMilestones: 1, refundedSats: 0 }],
    ]) {
      const res = response();
      await handler(request({ body }), res);
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['cache-control'], 'no-store');
      assert.equal(typeof res.json().label, 'string');
      assert.match(res.json().label, /demo/i);
    }
  } finally {
    for (const [key, value] of [['ANTHROPIC_API_KEY', old.anthropic], ['OPENAI_API_KEY', old.openai], ['AI_API_ENABLED', old.enabled]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test('Vercel handler enforces method, origin, request size and input validation', async () => {
  for (const [req, expected] of [
    [request({ method: 'GET' }), 405],
    [request({ headers: { origin: 'https://attacker.example' } }), 403],
    [request({ headers: { 'content-length': String(12 * 1024 * 1024) } }), 413],
    [request({ body: { condition: '', text: '' } }), 400],
  ]) {
    const res = response();
    await prevalidate(req, res);
    assert.equal(res.statusCode, expected);
    assert.equal(typeof res.json().error, 'string');
  }
});

test('configured external providers remain opt-in', async () => {
  const old = { key: process.env.OPENAI_API_KEY, enabled: process.env.AI_API_ENABLED };
  process.env.OPENAI_API_KEY = 'test-only-secret';
  delete process.env.AI_API_ENABLED;
  try {
    const res = response();
    await prevalidate(request({ body: { condition: 'Nota mínima 6', text: 'Nota 8' } }), res);
    assert.equal(res.statusCode, 503);
    assert.match(res.json().error, /no está habilitada/i);
  } finally {
    if (old.key === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = old.key;
    if (old.enabled === undefined) delete process.env.AI_API_ENABLED; else process.env.AI_API_ENABLED = old.enabled;
  }
});

test('Vercel handler applies a per-client sliding-window limit', async () => {
  const client = `rate-test-${Date.now()}`;
  let last;
  for (let index = 0; index < 9; index++) {
    last = response();
    await impactReport(request({ body: { paidSats: 0, students: 0, completedMilestones: 0, refundedSats: 0 }, remoteAddress: client }), last);
  }
  assert.equal(last.statusCode, 429);
  assert.equal(last.headers['retry-after'], '60');
});
