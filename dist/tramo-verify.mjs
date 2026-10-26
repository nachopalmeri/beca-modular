// Verificación de recibos Lightning: SHA-256(preimage) debe ser igual al payment hash de la factura.
// Funciona sin conexión. Sólo lee el payment hash de la factura BOLT11; no valida la firma del nodo.

const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

function bech32Polymod(values) {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= GEN[i];
  }
  return chk >>> 0;
}

function hrpExpand(hrp) {
  const out = [];
  for (const c of hrp) out.push(c.charCodeAt(0) >> 5);
  out.push(0);
  for (const c of hrp) out.push(c.charCodeAt(0) & 31);
  return out;
}

function bech32Decode(input) {
  const str = input.trim().toLowerCase().replace(/^lightning:/, '');
  const sep = str.lastIndexOf('1');
  if (sep < 1 || sep + 7 > str.length) throw new Error('No parece una factura Lightning (BOLT11).');
  const hrp = str.slice(0, sep);
  const data = [];
  for (const c of str.slice(sep + 1)) {
    const v = CHARSET.indexOf(c);
    if (v === -1) throw new Error('La factura tiene caracteres inválidos.');
    data.push(v);
  }
  if (bech32Polymod([...hrpExpand(hrp), ...data]) !== 1) throw new Error('La factura está incompleta o mal copiada (checksum inválido).');
  return { hrp, words: data.slice(0, -6) };
}

function wordsToBytes(words) {
  let acc = 0, bits = 0;
  const out = [];
  for (const w of words) {
    acc = (acc << 5) | w; bits += 5;
    while (bits >= 8) { bits -= 8; out.push((acc >> bits) & 0xff); }
  }
  return out;
}

const toHex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');

export function paymentHashFromInvoice(invoice) {
  const { hrp, words } = bech32Decode(invoice);
  if (!hrp.startsWith('ln')) throw new Error('No es una factura Lightning.');
  const sigWords = 104; // 65 bytes de firma
  let i = 7; // 35 bits de timestamp
  const end = words.length - sigWords;
  while (i + 3 <= end) {
    const type = words[i];
    const len = words[i + 1] * 32 + words[i + 2];
    const field = words.slice(i + 3, i + 3 + len);
    if (type === 1 && len === 52) return { network: hrp, paymentHash: toHex(wordsToBytes(field).slice(0, 32)) };
    i += 3 + len;
  }
  throw new Error('La factura no contiene un payment hash.');
}

export function normalizeHex(value, label) {
  const hex = String(value || '').trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{64}$/.test(hex)) throw new Error(`${label} debe tener 64 caracteres hexadecimales.`);
  return hex;
}

export async function sha256Hex(hex) {
  if (hex.length % 2) throw new Error('Hex de longitud impar.');
  const bytes = new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return toHex(new Uint8Array(digest));
}

// target: payment hash en hex o una factura BOLT11 completa.
export async function verifyReceipt(preimage, target) {
  const pre = normalizeHex(preimage, 'El preimage');
  const t = String(target || '').trim();
  const fromInvoice = /^(lightning:)?ln/i.test(t);
  const expected = fromInvoice ? paymentHashFromInvoice(t).paymentHash : normalizeHex(t, 'El payment hash');
  const computed = await sha256Hex(pre);
  return { ok: computed === expected, computed, expected, fromInvoice };
}

export function randomPreimage() {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return toHex(bytes);
}
