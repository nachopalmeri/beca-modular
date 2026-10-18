import test from 'node:test';
import assert from 'node:assert/strict';
import { abandonoMeta, abandonoYears, abandonoPais, abandonoProvincias } from '../data/abandono-interanual.mjs';
import { geoMeta, geoViewBox, provincias } from '../data/geo-provincias.mjs';

const flat = (nivel) => Object.values(abandonoProvincias).flatMap((province) => province[nivel]).filter((value) => value != null);

test('the committed dropout series keeps the published shape: 13 school years and 24 jurisdictions', () => {
  assert.equal(abandonoYears.length, 13);
  assert.equal(abandonoYears[0], '2012-13');
  assert.equal(abandonoYears.at(-1), '2024-25');
  const ids = Object.keys(abandonoProvincias).sort();
  assert.equal(ids.length, 24);
  assert.deepEqual(ids, geoProvincesIds());
  for (const [id, province] of Object.entries(abandonoProvincias)) {
    assert.equal(province.primaria.length, 13, `${id} primaria must have one value per year`);
    assert.equal(province.secundaria.length, 13, `${id} secundaria must have one value per year`);
    assert.ok(['6-6', '7-5'].includes(province.estructura), `${id} must carry the published school structure`);
    assert.equal(typeof province.nombre, 'string');
  }
});

function geoProvincesIds() {
  return provincias.map((province) => province.id).sort();
}

test('no value is missing or invented: the published ranges match the official workbook', () => {
  for (const nivel of ['primaria', 'secundaria']) {
    for (const [id, province] of Object.entries(abandonoProvincias)) {
      for (const value of province[nivel]) {
        assert.equal(typeof value, 'number', `${id} ${nivel} must not contain gaps`);
        assert.ok(Number.isFinite(value), `${id} ${nivel} must be finite`);
      }
    }
  }
  const secundaria = flat('secundaria');
  const primaria = flat('primaria');
  assert.equal(Math.min(...secundaria), 2.18);
  assert.equal(Math.max(...secundaria), 15.53);
  assert.equal(Math.min(...primaria), -1.49);
  assert.equal(Math.max(...primaria), 5.01);
  assert.equal(abandonoPais.secundaria[0], 11.37);
  assert.equal(abandonoPais.secundaria.at(-1), 6.92);
});

test('published negative values stay visible and the limitations are documented in the data module', () => {
  const negative = Object.entries(abandonoProvincias).flatMap(([id, province]) => province.primaria.filter((value) => value < 0).map(() => id));
  assert.ok(negative.length > 0, 'the closed-system model published negative values; they must not be clamped at load');
  assert.ok(abandonoMeta.limitaciones.some((line) => /negativos/.test(line)), 'the negative-value caveat must travel with the data');
  assert.ok(abandonoMeta.limitaciones.some((line) => /1650/.test(line)), 'the Buenos Aires regime change must travel with the data');
  assert.ok(abandonoMeta.limitaciones.some((line) => /agregados por jurisdicción/.test(line)));
});

test('the source metadata points at the official pages and the committed download date', () => {
  assert.equal(abandonoMeta.pagina, 'https://www.argentina.gob.ar/educacion/evaluacion-e-informacion-educativa/indicadores');
  assert.equal(abandonoMeta.archivo, 'https://www.argentina.gob.ar/sites/default/files/2018/04/tasa_de_abandono_interanual.zip');
  assert.equal(abandonoMeta.descargado, '2026-10-17');
  assert.equal(geoMeta.archivo, 'https://infra.datos.gob.ar/georef/provincias.geojson');
  assert.match(geoMeta.alcance, /antártico/i, 'the geometry scope must state the excluded Antarctic sector');
});

test('the display geometry stays inside the declared viewBox and describes every jurisdiction', () => {
  assert.equal(geoViewBox, '0 0 1000 2088');
  for (const province of provincias) {
    assert.ok(province.path.startsWith('M') && province.path.includes('Z'), `${province.id} must carry a closed path`);
    const [x, y] = province.centro;
    assert.ok(x >= 0 && x <= 1000, `${province.id} centroid x outside viewBox`);
    assert.ok(y >= 0 && y <= 2088, `${province.id} centroid y outside viewBox`);
    assert.match(province.iso, /^AR-[A-Z]$/, `${province.id} keeps the ISO code`);
  }
});
