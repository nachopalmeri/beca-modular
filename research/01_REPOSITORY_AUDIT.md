# 01 — Auditoría del repositorio `nachopalmeri/beca-modular`

Fecha de auditoría: 2026-10-26. Commit inspeccionado: `464984e` ("Sync published Beca Modular site v16"), clon superficial de `main`.
Convención: **[HECHO]** verificado en el repo o en la web; **[INFERENCIA]** deducción razonada; **[FALTA]** dato no disponible.

## 1. Qué hay

| Área | Estado | Evidencia |
|---|---|---|
| Stack | [HECHO] Sitio estático HTML/CSS + ES modules vanilla, servidor Node mínimo (`server.mjs`, puerto 4178). Sin framework, sin build. `dist/` es copia publicada. | `README.md`, árbol de archivos |
| Despliegue | [HECHO] OpenAI Sites (`.openai/hosting.json`, `static.directory: dist`). URL pública responde HTTP 200: https://beca-modular.ignaciopalmeri1.chatgpt.site/ (consultado 2026-10-26). | curl + render Playwright |
| Producto en la landing | [HECHO] "Beca por materia": meta ilustrativa 100 USD, 2 hitos 50/50, aporte individual o compartido desde 1 USD, devolución prorrata del saldo no liberado tras abandono confirmado. Track declarado: Nueva Educación. | `index.html`, `docs/product-strategy.md` |
| Simulador | [HECHO] `demo.html` + `funding-model.mjs` + `roadmap.mjs`: contabilidad en centavos enteros, método de mayor resto para devoluciones. Conceptual, sin dinero real. | Código + 12 tests |
| Laboratorio | [HECHO] `laboratorio.html` + `app.js` + `model.mjs` + `yield.mjs`: exploraciones previas (MPP de Solana, rendimiento/yield DeFi, economía de plataforma). | `docs/yield-strategy.md`, `docs/financial-model.md` |
| Firma local | [HECHO] `respaldo.html` + `scholarship.mjs` + `judge.mjs` + `verify-receipt.mjs`: firma ECDSA P-256 (WebCrypto) con autoridad sintética. No es blockchain. | `docs/architecture.md` |
| Contratos | [HECHO] `contracts/package.json` sólo instala `solc 0.8.37`, `ethers 6.17.0`, `ganache 7.9.2`. **No existe ningún archivo Solidity.** | `contracts/` |
| Tests | [HECHO] `node --test tests/funding.test.mjs tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs` → **48/48 pasan** (Node 22.22, 2026-10-26). `tests/browser.cjs` es histórico del laboratorio. | Ejecución local |
| Documentación | [HECHO] Muy completa y honesta: distingue simulación de producto, registra evidencia (`docs/evidence-register.md`), QA, kit de pitch, readiness. | `docs/` |
| Tamaño | [HECHO] ~950 líneas de código propio (archivos minificados en pocas líneas largas). | `wc -l` |

## 2. Objetivos originales

[HECHO] Según `docs/product-strategy.md` y `docs/execution.md` (14/10/2026):
1. Web previa como propuesta/roadmap (cumplido).
2. En el evento: contrato en **Ethereum Sepolia** + token ERC-20 de demo, roles (sponsor, aportantes, institución, estudiante, revisor), aportes, confirmación de hito, desembolso, anti-replay, devoluciones.
3. Historia previa (evidence register, 10/10): exploración de MPP/Solana, rendimiento DeFi y creator fees — descartada del núcleo.

[HECHO] La idea "inclusión financiera + conectividad" que mencionás aparece en el repo sólo indirectamente (MPP de pagos por canal, laboratorio). El producto vigente es educación/becas.

## 3. ¿Siguen siendo convenientes?

| Decisión previa | Veredicto | Motivo |
|---|---|---|
| Problema: continuidad educativa de estudiantes de bajos ingresos | **Mantener** | Evidencia fuerte (ver doc 04): el decil más pobre es 7,9% de 1.er año y 1,1% de 5.º; Progresar perdió 42% real. |
| Mecanismo: pagos condicionados a hitos académicos, devolución de saldo | **Mantener, simplificar** | Tiene respaldo empírico (becas por desempeño, MDRC; el propio Progresar retiene 20% contra regularidad). |
| Cadena: Ethereum Sepolia + ERC-20 sin valor | **Descartar** | [INFERENCIA] En una conferencia de Bitcoin con jurado de "referentes del ecosistema Bitcoin y blockchain" y premios en Bitcoin, un token de testnet sin valor es la demo más débil posible: no mueve valor real, exige wallets EVM y obliga a explicar Sepolia. Lightning permite mover valor real (sats) en vivo, en segundos. |
| Escrow por contrato inteligente de meses | **Descartar para el MVP** | Lightning no hace custodia condicional de meses; un contrato EVM sí, pero la demo pierde. Se reemplaza por tesorería transparente + recibos criptográficos de pago (preimage) — ver doc 09. |
| Crowdfunding por materia desde 1 USD | **Reducir** | La demanda de "financiar una materia" no está validada; el caso más simple es sponsor → programa → N estudiantes. El aporte múltiple queda como función secundaria. |
| Checklist asistido por IA | **Reformular** | Hoy es ornamental (no hay IA en vivo). Sólo vale si resuelve algo verificable; si no, quitarlo. |
| MPP, yield, tokenización, creator fees | **Archivar** | Complejidad sin relación con el problema; ya marcados fuera del núcleo. |
| "48 horas" en el plan | **Corregir** | [HECHO] Las bases dicen que el predio cierra el 30/10 a las 19:30 y hay que volver el 31 antes de la entrega. Tiempo real en sede ≈ 10 h día 1 + mañana del día 2. Planificar ~14–18 h efectivas. |

## 4. Componentes reutilizables

| Componente | Reutilizar | Cómo |
|---|---|---|
| `funding-model.mjs` (centavos enteros, mayor resto) | **Sí** | Núcleo contable de devoluciones prorrata y reparto por hitos. Portar a unidades de sats/ARS. |
| `tests/funding.test.mjs` | **Sí** | Base de invariantes (suma de aportes = liberado + reservado + devuelto). |
| Reglas de producto (`docs/product-strategy.md` §Reglas) | **Sí** | Fondeo completo antes de activar, pausa ≠ abandono, no clawback, datos personales fuera de registro público. Son buenas y defendibles ante jurado. |
| `verify-receipt.mjs` / patrón de recibo verificable | **Idea sí, código no** | El concepto de "recibo verificable por terceros" se reimplementa con preimage de Lightning (SHA-256(preimage) = payment_hash). |
| Diseño visual (`styles.css`, landing) | **Parcial** | Tipografía/paleta reutilizables; la narrativa de la landing debe reescribirse (USD/Sepolia). |
| Video intro, imágenes | **Opcional** | No aportan a un pitch de 60 s. |
| `docs/evidence-register.md` | **Sí** | Mantener la disciplina de evidencia; es diferencial ante un jurado escéptico. |

## 5. Elementos a descartar

`laboratorio.html`, `app.js`, `model.mjs`, `yield.mjs`, `docs/yield-strategy.md`, `docs/financial-model.md` (archivar, no borrar), `contracts/` (Solidity/Ganache/Sepolia), `respaldo.html` y la firma P-256 (confunde: "¿esto es blockchain?").

## 6. Riesgos detectados en el repo

1. **[HECHO] Inscripción**: `docs/hackathon/readiness.md` (14/10) marca inscripción y equipo como *Pendiente*. Las bases vigentes (doc 02) fijan cierre 25/10/2026 (tabla) o 16/10 (párrafo). **Hoy es 26/10: confirmar de inmediato que los 4–5 integrantes están aprobados en Luma.**
2. **[HECHO] Trabajo previo**: hay un sitio público con la idea y un simulador. Las bases no prohíben trabajo previo, pero dicen "un desafío de dos días en el que los equipos detectan un problema, desarrollan una solución". Ver doc 02 §Reglas sobre trabajo previo.
3. **[HECHO] La landing dice "USD"** en importes ilustrativos y "Plan de 48 h"; si se pivotea, la landing contradice la demo. Actualizarla o despublicarla antes del evento (decisión del equipo).
4. **[INFERENCIA] Exceso de disclaimers**: la honestidad del repo es un activo, pero un pitch de 60 s no admite cinco advertencias. Hay que convertir honestidad en *precisión* (qué está probado), no en ruido.

## 7. Conclusión de la auditoría

El repo tiene **pensamiento de producto y disciplina de evidencia valiosos** y **casi nada de código reutilizable para la demo final** (salvo la contabilidad de devoluciones). Arrastrar Sepolia sería arrastrar una decisión técnica equivocada para este jurado. Recomendación: conservar problema y reglas, cambiar el riel de pagos a Lightning y reconstruir la demo en el evento (doc 09–10).
