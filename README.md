# Beca Modular

Sitio público: <https://beca-clara.vercel.app/>. Propuesta para la Hackathon EDU HUB de LABITCONF 2026 (track Inclusión Financiera): complementos de beca que se pagan por Lightning cuando el estudiante cumple un hito validado, con un recibo verificable y devolución exacta de lo no usado. El sitio es una propuesta con simulaciones: no recibe fondos, no conecta billeteras ni valida hitos académicos reales. Los pagos reales se construyen durante la hackathon.

## Ejecutar localmente

Requiere Node.js; no hay dependencias ni build.

```sh
node server.mjs
```

Abrí <http://127.0.0.1:4178/>. Vercel publica la carpeta `dist/` (ver `vercel.json`), que es una copia sincronizada del sitio; `research/` no se copia a `dist/`.

## Qué hay en la página

- **Historia** (`index.html`, `roadmap.mjs`, `story-scenes.mjs`): apertura con Brote y tres escenas con datos oficiales en scroll horizontal: mapa con una marca roja por provincia (abandono interanual en secundaria, DiNIEE), árbol de aportes y curva del valor real de Progresar (IPC INDEC). Luego el cierre con Brote.
- **Brote** (`brote-rig.mjs`, `brote-rig.css`, `brote-live.mjs`): personaje vectorial con partes articuladas; cada pose es una función del scroll. Aparece en la apertura, las escenas, el cierre y como compañero fijo. Sin JavaScript queda la ilustración PNG.
- **Simulador en sats** (`tramo-model.mjs`, `tramo-ui.mjs`): fondeo compartido, hitos, revisión y baja, devolución por mayor resto; registro público con fondeado = pagado + devuelto + reservado.
- **Verificador de recibos** (`tramo-verify.mjs`): decodifica facturas BOLT11 y comprueba SHA-256(preimage) = payment hash, sin conexión.
- **Laboratorio de datos** (`evidence-map.mjs`, `data/`): serie oficial de abandono interanual 2012-2025 por jurisdicción.
- **Demo de pagos simulados** (`demo.html`, `payments/`, `ai/`): QR no cobrable, recibo de prueba, sugerencias asistidas y reporte de sesión. Ninguna ruta mueve fondos; proveedores externos de IA son opt-in y no están configurados.
- **Modelo y roadmap** (`modelo.html`, `roadmap.html`): supuestos financieros y estados de producto separados entre disponible, por validar y bloqueado.
- **Presentación audiovisual** (`presentacion.html`): tres videos originales MP4 narrados y subtitulados; los ejemplos son ilustrativos, sin transacciones ni resultados observados.
- `laboratorio.html` y `respaldo.html` conservan experimentos previos.

## Pruebas

```sh
node --test tests/*.test.mjs
```

Pruebas de navegador (con `node server.mjs` activo): `story-browser`, `evidence-browser`, `demo-browser`, `tree-browser` y `demo-rules-browser` en `tests/`. Usan la ruta de Playwright indicada en cada archivo y aceptan `BECA_BROWSER` (ejecutable de Chromium) y `BECA_SITE_URL` (por ejemplo `http://127.0.0.1:4178/dist/index.html` para probar lo publicado).

## Investigación

`research/` contiene la auditoría, reglas y jurado, benchmark de ganadores, datos de Argentina, evaluación de OpenARG, portafolio de ideas, matriz de decisión, red team, product brief, plan, pitch y recomendación, con fuentes y datos reproducibles en `research/data/`. Decisiones de diseño: `docs/ux-redesign.md`.

## Copia local para presentar sin internet

`node scripts/build-offline-demo.mjs` genera `beca-demo-offline.zip` con la demo; se extrae, se ejecuta `node server.mjs` y se abre `http://127.0.0.1:4178/demo.html`.
