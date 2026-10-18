## Actualización14/10/2026 — fuente de verdad actual

- Bases completas recuperadas desde enlace oficialGoogleDocs y archivadas en hackathon/bases-publicas-2026-10-14.txt: 30–31/10, inscripción16/10, equipo4–5, demo funcional, pitch60s+preguntas60s. Consigna/rúbrica y permisoIA/código previo siguen pendientes.
- Decisiones aprobadas por usuario: web ahora como roadmap; funcional durante48h; financiación completa o desde1USD; beca100USDpor materia ilustrativa, hitos por exámenes; devolución proporcional de saldo no liberado tras revisión, sin recuperar lo ya ganado.
- Sepolia recomendada oficialmente para appsEthereum; token de prueba para unidades, ETHtestgas. Contrato NO implementado.
- funding-model.mjs:12tests de contabilidad/simulador; laboratorioECDSA16tests+20previos;48tests combinados pasaron14/10. No evidencia de pago blockchain.
- Source primary: https://ethereum.org/developers/docs/networks/ y bases enlazadas desde https://www.labitconf.com/mas/hackathon.

El resto de este archivo es histórico y conserva sus límites originales.

# Evidence register and inspection log

Inspected 2026-10-10 unless otherwise stated. Status words describe evidence, not product endorsement. Web access of a page is not a code audit. No interviews, buyer validation or new MPP test occurred in this build.

| ID | Claim | Evidence / inspection | Status and limits |
|---|---|---|---|
| E1 | LABITCONF dates, location, four tracks, functional 48-hour build | [Official page](https://www.labitconf.com/mas/hackathon), full extracted body inspected | OFFICIAL VERIFIED. No detailed jury rubric on page. |
| E2 | 4–5 members, 1-minute pitch + Q&A, challenge prompt and jury pending, venue closes first evening | [Bases](https://docs.google.com/document/d/1h6GlcaLcnSlQdjanoidrk7rA0T6Q1Jwe1ttdXHUoUvk/edit), `../../zero-base-reset/01-event-ground-truth.md` body inspected | REPORTED FROM PRIOR OFFICIAL INSPECTION. Live bases not refetched here. Do not silently call this a current recheck. |
| E3 | Progresar uses regularity, academic advance/certifications and retained payments | [Official FAQ](https://www.argentina.gob.ar/educacion/progresar/preguntas-frecuentes-progresar/educacion-superior-faq), body inspected | OFFICIAL VERIFIED. Does not validate our buyer problem. |
| E4 | Direct education payments and education-benefits operations already exist | [Guild FAQ](https://guild.com/faq), search extraction inspected; direct page yielded no body | FIRST-PARTY SEARCH EXTRACT ONLY. No technical inspection or API access; no claims about unsupported capabilities. |
| E5 | Institutions already purchase scholarship design/administration | [Scholarship America corporations](https://scholarshipamerica.org/sponsors/corporations/), page body inspected, publication Oct 4 2024 | FIRST-PARTY VERIFIED OFFER, no independent pricing/adoption audit. Corrected failed initial www URL by using canonical domain. |
| E6 | Course completion tracking is existing LMS functionality | [Moodle course completion](https://docs.moodle.org/503/en/Course_completion), official page extracted | OFFICIAL DOCS, not a local Moodle implementation test. |
| E7 | Blockchain scholarship portals have prior art | [DirectEd](https://projectcatalyst.io/funds/8/self-sovereign-identity/directed-student-scholarship-portal), public proposal page opened | PRIMARY PROJECT PROPOSAL, not independently verified working product or traction. |
| E8 | MPP session opens capped channel, uses signed cumulative vouchers and later settlement | [Solana MPP docs](https://solana.com/docs/payments/agentic-payments/mpp), full relevant technical body inspected | OFFICIAL VERIFIED DOCUMENTATION. Specs evolving; does not establish Beca integration. |
| E9 | Existing channel and Pay Kit source inspected previously; MIT | [Payment channels](https://github.com/solana-foundation/payment-channels), [Pay Kit](https://github.com/solana-foundation/pay-kit), local deep dive/log and local package/LICENSE read | PRIOR SOURCE INSPECTION + CURRENT LOCAL LICENSE/VERSION CHECK. No new audit of protocol. |
| E10 | Seven sandbox vouchers, 700 paid/999300 returned base units, successful transaction | `../../spike-execution-log.md` body inspected | REPORTED EXPERIMENTAL RESULT, NOT REPRODUCED THIS BUILD. Sandbox, not mainnet. |
| E11 | Creator fee sharing implementation described | [Pump public docs](https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md), GitHub document opened; local prior mechanism report read | DOCUMENTED FEATURE, not transfer-by-transfer verified. No Beca integration or reliable funding implied. |
| E12 | Existing Beca product framing and historical candidate objections | Conversation, scholarship attachment, `../../bridge/trusted-read-chunked/document-text.md`, dated local reset docs | USER INPUT / HISTORICAL RESEARCH, not market proof. Archived Doc predates latest changes. |
| E13 | Website financial identities and local session transitions | `../tests/model.test.mjs`, actual test results in QA log | LOCAL EXPERIMENTAL VERIFICATION only when run. No crypto guarantees. |
| E14 | Website responsive interactions and errors | Playwright run / screenshots in QA log | LOCAL UI VERIFICATION only; no user usability study. |

## Research gaps

No exact assigned challenge, current jury list, AI/pre-existing code permissions, buyer willingness, real module rates, expected unit usage, comparative retention, production compliance, channel recovery experiment, independent delivery measurement or confirmed content integration. Website design references are structural only: typography/hierarchy from [Vercel](https://vercel.com/), compact product navigation from [Linear](https://linear.app/), explanatory finance from [Stripe](https://stripe.com/). Their brand assets, metrics and testimonials are not copied. No screenshot reference audit claimed.

The original prompt's “commercially viable” and “world-class” are goals; no label in this artifact treats them as verified outcomes. The defensible current claim is a working explanation/simulation with documented assumptions and prior payment evidence.


## Audio original revisado — 10/10/2026
Transcripción local completa mediante FFmpeg whisper.cpp, modelo base español; algunos fragmentos finales ambiguos. Confirma intención del proponente: donación reservada, desembolsos parciales al alumno tras materias aprobadas y reasignación del remanente al dejar el programa. Es evidencia de intención, no de demanda, seguridad, impacto o integración. No se publica el audio ni datos del remitente.


## Tesorería opcional — 10/10/2026
Inspección directa de documentación de Aave, Sky, Spark, Morpho, Robinhood Classic Stock Tokens y Pump creator fee sharing. Fuentes, límites y decisiones en [yield-strategy.md](yield-strategy.md). No hubo tasas en vivo, contratos inspeccionados/ejecutados ni operaciones financieras. Simulador hipotético independiente de ingresos de plataforma. $SI sigue sin contrato verificado.

## Revisión adicional de retiro y beneficio al estudiante — 10/10/2026

- Reabiertas fuentes primarias de [Aave withdrawal](https://aave.com/help/supplying/withdraw-tokens), [Spark Vault V2 integration](https://docs.spark.finance/integrators/spark-vaults-v2), [Morpho deposit/withdraw developer guide](https://docs.morpho.org/developers/earn/tutorials/assets-flow/), [Morpho liquidity curation](https://docs.morpho.org/curate/concepts/liquidity/), [Kamino docs](https://kamino.com/docs), [Pump fee-sharing instructions](https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md) and [Robinhood Stock Tokens](https://robinhood.com/eu/en/support/articles/about-stock-tokens/). Inspected via page bodies/docs on 2026-10-10; see protocol-specific interpretation and limits in `yield-strategy.md`.
- OFFICIAL DOCUMENTATION VERIFIED: Aave withdrawals are limited by available unborrowed liquidity; Spark distinguishes immediate withdrawal from eligible asynchronous intents; Morpho V2 requires SDK/state-based withdrawal-capacity calculation and gate checks; Pump creator-fee split docs establish a configuration mechanism, not an actual donor stream. No protocol balance/rate/transaction was inspected.
- Website change: the model now asks for a clearly labeled assumed full-award amount, calculates only whole future-award equivalents from education-directed net return, and exposes student-use choices only when the selected distribution policy yields a positive student amount. The choices are local UI simulations, not payment functionality.
- No protocol tests, buyer interviews, student interviews, sponsor agreements, real yield, new contract, connected AI or live transaction were executed in this update.


## DatosHoy como recurso de contexto institucional — 2026-10-11

- [Explorador de universidades de DatosHoy](https://www.datoshoy.com/universidades) inspeccionado el 2026-10-11: permite consultar mapas, fichas, comparaciones y rankings; declara metodología, fuentes y cobertura distinta por indicador. Algunos indicadores son cocientes o estimaciones, no tasas de cohorte ni gasto efectivamente asignado a una persona.
- [Términos de DatosHoy](https://www.datoshoy.com/terminos/) inspeccionados el 2026-10-11: el servicio se presenta como informativo y advierte posibles demoras, errores u omisiones; su contenido, diseño y elementos están protegidos por sus titulares. No se verificó una licencia abierta de reutilización ni una API pública.
- [Registro oficial de instituciones universitarias](https://www.argentina.gob.ar/educacion/universidades/informacion-universitaria/instituciones-universitarias) enlazado como fuente institucional de consulta.
- Decisión de producto: agregar enlaces externos, no copiar ni republicar tablas, métricas, mapas o rankings. No hay costo de integración por enlazar; no se afirma una licencia para reutilizar datos. Los indicadores pueden ayudar a un sponsor a formular preguntas de cobertura, pero nunca sirven para puntuar estudiantes, decidir elegibilidad o medir mérito individual.


## Mapas educativos y universidades - revision 2026-10-15

- [Mapa Educativo Nacional](https://www.argentina.gob.ar/educacion/planeamiento/mapa-educativo) is an official georeferenced planning and monitoring tool. The linked [interactive map](https://mapa.educacion.gob.ar/mapa-interactivo) and [official establishments register](https://www.argentina.gob.ar/educacion/evaluacion-e-informacion-educativa/padron-oficial-de-establecimientos-educativos) are linked directly; no local copy of their map data is used.
- [OpenArg dashboard catalog](https://openarg.org/dashboards) identifies the Education GBA map as a separate product by Colossus Lab. The live map, inspected in browser on 2026-10-15, showed 10,923 census radii, 8,931 geocoded school locations across the 24 GBA partidos, and 1,685 low-confidence geocodes excluded from its ranking. It combines Census 2022 territorial indicators with school locations; this is aggregated context, not a measure of school quality or personal eligibility. The dashboard itself is the source for those dynamic counts. We link the [dashboard](https://mapa-educacion-gba.vercel.app/) and the [Colossus Lab public repositories](https://github.com/colossus-lab), without claiming the map source code lives in a particular repo.
- [DatosHoy universities](https://www.datoshoy.com/universidades) was inspected in the live browser and via a text page fetch on 2026-10-15. The browser showed an interactive university map and 2024-labeled indicators; the text fetch for the same URL reported a development view with fictional/non-representative data and temporary unavailability. This discrepancy means the Beca site embeds and links to the external view but does not reproduce any numbers. The page methodology says graduates per 1,000 is an annual ratio, not a cohort graduation rate; foreign-student-associated spending is proportional estimation, not a budget line for a nationality. [SPU statistical yearbooks](https://www.argentina.gob.ar/educacion/universidades/informacion/publicaciones/anuarios) are linked as the primary-source directory.
- Decision: no indicator or map is used to rank students, determine scholarship eligibility, infer individual circumstances, or claim causal impact. External interactive views can change or refuse embedding; a visible link opens each source in a full tab.

## Hackathon public status - checked 2026-10-16

- [Luma registration page](https://luma.com/cwhw1uls?locale=es) still showed “Request to Join” and approval required. It did not display the deadline or remaining capacity, so this does not prove that registration remains open or that a place is available.
- The saved [official bases copy dated 2026-10-14](hackathon/bases-publicas-2026-10-14.txt) says registration closes 2026-10-16 or when capacity is reached, and gives the 19:30 day-one venue close and 1-minute pitch + 1-minute Q&A. The current Google Doc linked from [LABITCONF](https://docs.google.com/document/d/1h6GlcaLcnSlQdjanoidrk7rA0T6Q1Jwe1ttdXHUoUvk/edit?tab=t.0) requires JavaScript in the review browser; its current revision was not verified. Keep those details attributed to the dated snapshot.
- [Luma](https://luma.com/cwhw1uls?locale=es) says teams of 4–5; the [general EDU Hub page](https://www.labitconf.com/mas/edu-hub) says teams of 4. Confirm which rule applies before using it as a current requirement.
- [LABITCONF's hackathon page](https://www.labitconf.com/mas/hackathon) and Luma list October 30–31, 2026, four tracks, a functional demo, and mentor support. The specific challenge, current judging criteria, jury composition, agenda and pitch timing remain unverified in the current public summaries. A Martín Yeza session on problem framing is not evidence that he is a judge or endorses Beca Modular.
- The hackathon page's October bootcamp card advertises four meetings, while the EDU HUB page describes three conversations; the current schedule and count are unknown.
- See the full [dated public-status report](hackathon/public-status-2026-10-16.md) for source-by-source findings and roadmap consequences.
