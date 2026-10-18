// Generates data/abandono-interanual.mjs and data/geo-provincias.mjs from official sources.
//
// Official inputs (download manually or with the URLs below; this script reads local copies):
//  1. Tasa de Abandono Interanual (zip with XLSX workbooks):
//     https://www.argentina.gob.ar/sites/default/files/2018/04/tasa_de_abandono_interanual.zip
//     Expected: "Tasa de Abandono Interanual 2025-2012 según división político-territorial.xlsx"
//     extracted into a folder (pass with --series-dir).
//  2. Province boundaries (GeoJSON, geometries from IGN via Georef):
//     https://infra.datos.gob.ar/georef/provincias.geojson  (pass with --geojson)
//
// Usage:
//   node scripts/build-evidencia.mjs --series-dir "D:/path/to/extracted-xlsx" --geojson "D:/path/to/provincias.geojson"
//
// The generated modules are committed so the site keeps working offline and no runtime
// dependency or live fetch is added. Re-run this script only to refresh the series.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argValue = flag => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
const seriesDir = argValue('--series-dir');
const geojsonPath = argValue('--geojson');
if (!seriesDir || !geojsonPath) {
  console.error('Usage: node scripts/build-evidencia.mjs --series-dir <extracted xlsx folder> --geojson <provincias.geojson>');
  process.exit(1);
}

// ---------- XLSX reading (minimal, works with the DiNIEE workbooks) ----------
const decodeXml = s => s
  .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
function sharedStrings(xml) {
  const out = [];
  for (const m of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    out.push([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => decodeXml(x[1])).join(''));
  }
  return out;
}
const colIndex = ref => { let n = 0; for (const ch of ref.match(/^[A-Z]+/)[0]) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; };
function parseSheet(xml, ss) {
  const rows = [];
  for (const rm of xml.matchAll(/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    for (const cm of rm[2].matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
      const ref = (cm[1].match(/r="([A-Z]+\d+)"/) ?? [])[1];
      const t = (cm[1].match(/t="([^"]+)"/) ?? [])[1];
      const v = (cm[2].match(/<v>([\s\S]*?)<\/v>/) ?? [])[1];
      let value = null;
      if (t === 's' && v != null) value = ss[Number(v)];
      else if (t === 'inlineStr') { const inline = (cm[2].match(/<t[^>]*>([\s\S]*?)<\/t>/) ?? [])[1]; value = inline != null ? decodeXml(inline) : null; }
      else if (v != null) value = t === 'str' ? decodeXml(v) : Number(v);
      if (ref) cells[colIndex(ref)] = value;
    }
    rows.push(cells);
  }
  return rows;
}
function loadSheets(dir) {
  const ss = sharedStrings(readFileSync(join(dir, 'xl', 'sharedStrings.xml'), 'utf8'));
  const wb = readFileSync(join(dir, 'xl', 'workbook.xml'), 'utf8');
  const rels = readFileSync(join(dir, 'xl', '_rels', 'workbook.xml.rels'), 'utf8');
  const relMap = Object.fromEntries([...rels.matchAll(/Id="(rId\d+)"[^>]*Target="([^"]+)"/g)].map(m => [m[1], m[2].replace(/^\/?xl\//, '')]));
  return [...wb.matchAll(/<sheet name="([^"]+)"[^>]*?r:id="(rId\d+)"/g)]
    .map(m => ({ name: decodeXml(m[1]), file: relMap[m[2]] }));
}

// ---------- Series extraction ----------
// Column map (validated against 2012-13, 2015-16, 2020-21 and 2024-25 sheets):
//   Province rows:  C = total primaria, D..I = 1°..6°, J = 7° (sistemas 7-5), K = total secundaria, L..Q = grados nacionales
//   "Total País" row keeps the total primaria in B (row is shifted one column left, no structure code).
// The "Limitaciones" sheet of the same workbook documents the method caveats kept in the module.
const nameToId = new Map([
  ['ciudad de buenos aires', '02'], ['buenos aires', '06'], ['catamarca', '10'], ['cordoba', '14'],
  ['corrientes', '18'], ['chaco', '22'], ['chubut', '26'], ['entre rios', '30'], ['formosa', '34'],
  ['jujuy', '38'], ['la pampa', '42'], ['la rioja', '46'], ['mendoza', '50'], ['misiones', '54'],
  ['neuquen', '58'], ['rio negro', '62'], ['salta', '66'], ['san juan', '70'], ['san luis', '74'],
  ['santa cruz', '78'], ['santa fe', '82'], ['santiago del estero', '86'], ['tucuman', '90'],
  ['tierra del fuego', '94']
]);
const normalize = name => String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const round2 = v => v == null ? null : Math.round(v * 100) / 100;

function extractSeries(dir) {
  const sheets = loadSheets(dir).filter(s => /(^|\/)sheet\d+\.xml$/.test(s.file));
  const withTitle = [];
  for (const sheet of sheets) {
    const rows = parseSheet(readFileSync(join(dir, 'xl', sheet.file), 'utf8'), sharedStrings(readFileSync(join(dir, 'xl', 'sharedStrings.xml'), 'utf8')));
    const title = rows.flat().find(v => typeof v === 'string' && /Tasa de Abandono Interanual\s+\d{4}-\d{4}/.test(v));
    if (!title) continue;
    const range = title.match(/Tasa de Abandono Interanual\s+(\d{4})-(\d{4})/);
    const label = `${range[1]}-${range[2].slice(2)}`;
    const data = { nacional: null, provincias: {} };
    for (const row of rows) {
      const name = typeof row[0] === 'string' ? row[0].trim() : '';
      if (!name) continue;
      const normalized = normalize(name);
      if (normalized === 'total pais') {
        data.nacional = { primaria: round2(row[1]), secundaria: round2(row[10]) };
        continue;
      }
      if (normalized === 'conurbano' || normalized === 'resto de bs as') continue;
      const id = nameToId.get(normalized);
      if (!id) continue;
      const structure = typeof row[1] === 'string' ? row[1].trim() : null;
      const secundaria = round2(row[10] ?? (structure === '6-6' ? row[9] : null));
      data.provincias[id] = { estructura: structure, primaria: round2(row[2]), secundaria };
    }
    withTitle.push({ label, ...data });
  }
  withTitle.sort((a, b) => Number(a.label.slice(0, 4)) - Number(b.label.slice(0, 4)));
  const years = withTitle.map(y => y.label);
  const ids = [...new Set(withTitle.flatMap(y => Object.keys(y.provincias)))].sort();
  const provincias = {};
  for (const id of ids) {
    const structure = withTitle.at(-1).provincias[id]?.estructura ?? withTitle.flatMap(y => y.provincias[id] ? [y.provincias[id].estructura] : []).at(-1);
    provincias[id] = {
      estructura: structure,
      primaria: withTitle.map(y => y.provincias[id]?.primaria ?? null),
      secundaria: withTitle.map(y => y.provincias[id]?.secundaria ?? null)
    };
  }
  const pais = { primaria: withTitle.map(y => y.nacional?.primaria ?? null), secundaria: withTitle.map(y => y.nacional?.secundaria ?? null) };
  return { years, pais, provincias };
}

// ---------- Province geometry ----------
function simplify(points, tolerance) {
  if (points.length <= 3) return points;
  const sqTolerance = tolerance * tolerance;
  const sqDist = (a, b, c) => {
    let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((c[0] - x) * dx + (c[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = c[0] - x; dy = c[1] - y; return dx * dx + dy * dy;
  };
  const first = 0, last = points.length - 1;
  const keep = new Uint8Array(points.length); keep[first] = 1; keep[last] = 1;
  const stack = [[first, last]];
  while (stack.length) {
    const [start, end] = stack.pop();
    let maxSq = sqTolerance, index = -1;
    for (let i = start + 1; i < end; i++) {
      const sq = sqDist(points[start], points[end], points[i]);
      if (sq > maxSq) { maxSq = sq; index = i; }
    }
    if (index > -1) { keep[index] = 1; stack.push([start, index], [index, end]); }
  }
  return points.filter((_, i) => keep[i]);
}
function buildGeometry(geojsonPath, tolerance) {
  const gj = JSON.parse(readFileSync(geojsonPath, 'utf8'));
  const stdParallel = -38 * Math.PI / 180;
  const project = ([lon, lat]) => [lon * Math.cos(stdParallel), -lat];
  const ringsOf = f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).flat();
  // The official file includes the claimed Antarctic sector and South Atlantic islands in
  // Tierra del Fuego; keep only Isla Grande and nearby rings so the display map stays continental.
  const rings = [];
  for (const f of gj.features) {
    for (const ring of ringsOf(f)) {
      if (f.properties.id === '94') {
        let minLat = 999, maxLon = -999;
        for (const p of ring) { minLat = Math.min(minLat, p[1]); maxLon = Math.max(maxLon, p[0]); }
        if (minLat < -56.6 || maxLon > -63.5) continue;
      }
      if (ring.length < 4) continue;
      rings.push({ id: f.properties.id, ring: ring.map(project) });
    }
  }
  const xs = rings.flatMap(r => r.ring.map(p => p[0])), ys = rings.flatMap(r => r.ring.map(p => p[1]));
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 14;
  const scale = (1000 - pad * 2) / (maxX - minX);
  const height = Math.round((maxY - minY) * scale + pad * 2);
  const toView = ([x, y]) => [+(pad + (x - minX) * scale).toFixed(1), +(pad + (y - minY) * scale).toFixed(1)];
  const features = [];
  let pointsBefore = 0, pointsAfter = 0;
  for (const f of gj.features) {
    const featureRings = rings.filter(r => r.id === f.properties.id);
    if (!featureRings.length) continue;
    let path = '';
    for (const { ring } of featureRings) {
      pointsBefore += ring.length;
      const simplified = simplify(ring, tolerance);
      pointsAfter += simplified.length;
      const view = simplified.map(toView);
      path += `M${view[0][0]} ${view[0][1]}`;
      for (const [x, y] of view.slice(1)) path += `L${x} ${y}`;
      path += 'Z';
    }
    let centroid = project([f.properties.centroide.lon, f.properties.centroide.lat]);
    if (f.properties.id === '94') {
      // The published centroid falls inside the claimed sector; use Isla Grande's main ring instead.
      const main = featureRings.reduce((a, b) => b.ring.length > a.ring.length ? b : a);
      centroid = main.ring.reduce((sum, p) => [sum[0] + p[0] / main.ring.length, sum[1] + p[1] / main.ring.length], [0, 0]);
    }
    const [cx, cy] = toView(centroid);
    features.push({ id: f.properties.id, nombre: f.properties.nombre, nombreCorto: f.properties.nombre.replace('Tierra del Fuego, Antártida e Islas del Atlántico Sur', 'Tierra del Fuego'), iso: f.properties.iso_id, centro: [cx, cy], path });
  }
  features.sort((a, b) => a.id.localeCompare(b.id));
  return { features, viewBox: `0 0 1000 ${height}`, pointsBefore, pointsAfter, geojsonMeta: { fuente: 'IGN', nombreFuente: gj.features.length } };
}

const fmt = list => '[' + list.map(v => v == null ? 'null' : v).join(', ') + ']';
const series = extractSeries(seriesDir);
const nombres = JSON.parse(readFileSync(geojsonPath, 'utf8')).features.reduce((map, f) => (map[f.properties.id] = f.properties.nombre, map), {});
const shortName = id => nombres[id]?.replace('Tierra del Fuego, Antártida e Islas del Atlántico Sur', 'Tierra del Fuego') ?? id;

const seriesModule = `// Generated by scripts/build-evidencia.mjs from the official DiNIEE workbook. Do not edit by hand.
// Values are the published "Tasa de Abandono Interanual" totals per jurisdiction and school year.
export const abandonoMeta = {
  titulo: 'Tasa de Abandono Interanual',
  definicion: 'Porcentaje de alumnos que no se matriculan en el año lectivo siguiente.',
  fuente: 'Secretaría de Educación de la Nación · Subsecretaría de Evaluación e Información Educativa · DiNIEE · Red-FIE',
  pagina: 'https://www.argentina.gob.ar/educacion/evaluacion-e-informacion-educativa/indicadores',
  archivo: 'https://www.argentina.gob.ar/sites/default/files/2018/04/tasa_de_abandono_interanual.zip',
  planilla: 'Tasa de Abandono Interanual 2025-2012 según división político-territorial',
  descargado: '2026-10-17',
  realizacion: '01/04/2026 (según la planilla 2024-2025)',
  limitaciones: [
    'El modelo de flujo de alumnos supone un sistema cerrado: no contempla reincorporaciones ni transferencias entre cohortes y puede producir valores negativos de abandono (documento Limitaciones de la planilla oficial).',
    'Buenos Aires: la Resolución 1650/2024 DGCyE cambió el régimen académico de la secundaria; el archivo advierte que la definición operativa puede incidir en el total nacional.',
    'Los valores son agregados por jurisdicción: no explican causas individuales ni miden el efecto de una beca.'
  ],
  cobertura: 'Educación común. El mapa usa la fila Buenos Aires completa; el archivo también separa Conurbano y Resto de Buenos Aires (no usados aquí).'
};
export const abandonoYears = [${series.years.map(y => `'${y}'`).join(', ')}];
export const abandonoPais = { primaria: ${fmt(series.pais.primaria)}, secundaria: ${fmt(series.pais.secundaria)} };
export const abandonoProvincias = {
${Object.entries(series.provincias).map(([id, v]) => `  '${id}': { nombre: '${shortName(id)}', estructura: '${v.estructura}', primaria: ${fmt(v.primaria)}, secundaria: ${fmt(v.secundaria)} }`).join(',\n')}
};
`;

const geo = buildGeometry(geojsonPath, 0.02);
const geoModule = `// Generated by scripts/build-evidencia.mjs from Georef (datos.gob.ar, geometries by IGN). Do not edit by hand.
// Plate carrée with standard parallel -38°; rings simplified with Douglas-Peucker (0.02°) for display.
// The claimed Antarctic sector is not drawn. Paths are display geometry, not survey boundaries.
export const geoMeta = {
  fuentes: 'Servicio de Normalización de Datos Geográficos (Georef) · datos.gob.ar — geometrías aportadas por el IGN',
  archivo: 'https://infra.datos.gob.ar/georef/provincias.geojson',
  descargado: '2026-10-17',
  proyeccion: 'Plate carrée, paralelo estándar -38°',
  generalizacion: 'Douglas-Peucker 0,02° sobre el archivo publicado',
  alcance: 'Visualización estilizada. No se representa el sector antártico reclamado ni superficies oficiales.'
};
export const geoViewBox = '${geo.viewBox}';
export const provincias = [
${geo.features.map(f => `  { id: '${f.id}', nombre: ${JSON.stringify(f.nombre)}, nombreCorto: ${JSON.stringify(f.nombreCorto)}, iso: '${f.iso}', centro: [${f.centro.join(', ')}], path: ${JSON.stringify(f.path)} }`).join(',\n')}
];
`;

mkdirSync(join(root, 'data'), { recursive: true });
writeFileSync(join(root, 'data', 'abandono-interanual.mjs'), seriesModule);
writeFileSync(join(root, 'data', 'geo-provincias.mjs'), geoModule);

const missing = Object.entries(series.provincias).flatMap(([id, v]) => v.secundaria.includes(null) ? [id] : []);
console.log('Series:', series.years[0], '..', series.years.at(-1), '| jurisdictions:', Object.keys(series.provincias).length, '| years:', series.years.length);
console.log('Pais secundaria:', series.pais.secundaria.map(v => v ?? '–').join(' '));
console.log('Jurisdictions with a missing secundaria year:', missing.join(', ') || 'none');
console.log('Geometry points:', geo.pointsBefore, '->', geo.pointsAfter, '| viewBox', geo.viewBox);
console.log('Wrote data/abandono-interanual.mjs and data/geo-provincias.mjs');
