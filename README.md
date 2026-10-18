# Beca Modular

Demo pública de esta versión: <https://beca-clara.vercel.app/>. Usa datos sintéticos; no recibe fondos ni valida hitos académicos reales.

Propuesta y demo local para financiar formación por módulos con un presupuesto limitado, reglas visibles y comprobantes entendibles. La demo usa datos sintéticos y sirve para revisar el flujo; no opera una beca real.

## Ejecutar localmente

Requiere Node.js. No hace falta instalar dependencias.

```powershell
node server.mjs
```

Abrí <http://127.0.0.1:4178/> para la propuesta y el recorrido horizontal guiado por scroll; la portada enlaza a la demo interactiva en <http://127.0.0.1:4178/demo.html>. No requiere build ni dependencias. El server local sirve el código fuente. `dist/` contiene una copia estática sincronizada de la web.

## Demo rápida

1. En **Editar presupuesto y reglas**, ajustá el módulo y dos hitos. Los importes deben sumar el presupuesto.
2. Elegí **Dos aportes · 60% + 40%** para financiar el escenario sintético.
3. Registrá una **Constancia institucional de prueba**. La regla libera el primer tramo y muestra el comprobante, lo liberado y lo reservado.
4. Reintentá el comprobante para ver que el registro duplicado se rechaza. Elegí **Contenido consultado** o **Avance informado**: quedan en el historial, pero no liberan fondos.

## Qué está conectado y qué no

- `demo.html`, `roadmap.mjs` y `funding-model.mjs` forman una simulación interactiva en memoria. El motor usa centavos enteros, congela el presupuesto al recibir aportes, limita liberaciones al monto financiado y rechaza IDs de comprobante repetidos.
- `respaldo.html`, `scholarship.mjs` y `scholarship-ui.mjs` son otro laboratorio local: firma ECDSA con una autoridad sintética creada en el navegador. No están conectados con la demo de financiación.
- `index.html` y `docs/` explican la propuesta y distinguen lo planeado de lo comprobado. El plan técnico para la hackatón queda sujeto a la consigna, sus reglas y una prueba reproducible.
- `contracts/` no contiene un contrato de beca implementado. No hay wallet, testnet, backend, datos de una institución ni transferencia de fondos.

## Comprobaciones locales

```powershell
node --test tests/funding.test.mjs tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs
node --check funding-model.mjs
node --check roadmap.mjs
```

Regresión de reglas en navegador: `node tests/demo-rules-browser.cjs`. Inicia su propio servidor local y comprueba presupuesto accesible, cambios sin aplicar y errores visibles en móvil. Usa la instalación de Playwright del entorno Codex indicada en el archivo y Chrome; `BECA_BROWSER` permite elegir otro ejecutable. Para ejecutarla fuera de este entorno hay que adaptar la ruta de Playwright.

Con `node server.mjs` activo, `node tests/story-browser.cjs` revisa la coreografía y `node tests/maps-browser.cjs` comprueba carga, demora, desconexión, reintento, restricciones de iframe y contraste. Las respuestas del último son fixtures sintéticos de QA; la verificación de los exploradores reales se registra aparte en `docs/qa.md`.

Los tests son de lógica local. No prueban una nota académica, un contrato, una transferencia o un reembolso real. La prueba de navegador histórica en `tests/browser.cjs` cubre otra página y no es evidencia de esta demo.

## Proyecto y límites

La interfaz no guarda información personal de estudiantes. Consultar contenido no demuestra aprendizaje; un avance informado tampoco acredita un logro académico. En la demo sólo una constancia institucional sintética habilita el próximo tramo. La IA puede asistir a la explicación o sugerir módulos, pero no decide elegibilidad ni autoriza pagos.

El estado del producto, el plan hasta el evento y las decisiones abiertas están en [`docs/execution.md`](docs/execution.md), [`docs/hackathon/readiness.md`](docs/hackathon/readiness.md) y [`docs/qa.md`](docs/qa.md).


## Copia local para presentar sin internet

Desde la demo p?blica descarg? **Respaldo local de la demo (sin internet)**, o regener? el paquete desde el repositorio con `node scripts/build-offline-demo.mjs`. Extra? `beca-demo-offline.zip`, abr? una terminal en la carpeta extra?da y ejecut? `node server.mjs`. No requiere paquetes ni conexi?n. Abr? `http://127.0.0.1:4178/demo.html` antes de desconectarte. Eleg? **Iniciar demo ? 2 aportes ficticios**, registr? una **Constancia institucional de prueba** y reintent? el comprobante para mostrar el rechazo de repetici?n. Los mapas externos requieren internet y no est?n en el paquete. Probado en Chromium (390 ? 844) despu?s de cargar la demo local.
