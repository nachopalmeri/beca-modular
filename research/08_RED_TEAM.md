# 08 — Red team: intento de destruir las tres finalistas

Fecha: 2026-10-26. Jurado simulado: escéptico, del ecosistema Bitcoin, con 60 s de preguntas.

## Finalista 1 — Tramo (complemento por hito pagado por Lightning)

| Pregunta del jurado | Respuesta honesta | Evidencia / prueba prevista | ¿Resiste? |
|---|---|---|---|
| ¿Por qué es un problema real? | La beca nacional quedó fija en $35.000 desde sept-2024; con el IPC del INDEC vale 42% menos. Y 46% de los inscriptos 2025 no la recibió. | IPC serie oficial (calc. reproducible); Infobae/JGM; Presupuesto Abierto | Sí |
| ¿De dónde vienen los datos? | INDEC vía API datos.gob.ar; Presupuesto Abierto (MECON); informes de gestión al Congreso vía prensa. | `research/data/` | Sí |
| ¿Por qué nadie lo resolvió? | Hay fundaciones y becas privadas, pero pagan por banco, en tandas, con rendición en PDF; no encontramos un riel abierto con pago condicionado + recibo verificable. **No afirmamos que no exista en ningún lado.** | Búsqueda no exhaustiva (doc 06) | Parcial |
| ¿Por qué sería usado? | Ya hay sponsors que becan y condicionan al rendimiento (Fundación YPF: 50 becas de $450.000/mes; padrinazgos UCASAL: promedio > 7). Pagan cuota fija y controlan con papeles una vez por año. Tramo les ofrece pagar por hito y rendir públicamente. **Que quieran cambiar de riel no está validado.** | Doc 04 §4b; experimento doc 12 | **Punto débil #1** (atenuado: la demanda de becas condicionadas existe; la del riel no está probada) |
| ¿Mejor que Google? | Google no mueve plata ni produce recibos. | Demo | Sí |
| ¿Qué agrega frente a ChatGPT? | Nada que ver: no es un asistente. No usamos IA en el núcleo. | — | Sí |
| ¿Por qué blockchain/Bitcoin? | (1) Pagos de montos chicos, instantáneos, 24/7, a cualquier wallet, desde sponsors de cualquier país; (2) cada pago trae una **prueba criptográfica** (preimage) que cualquiera verifica; (3) las reglas del programa se anclan en Bitcoin (OpenTimestamps) antes del primer aporte. **No** usamos blockchain para "verificar notas". | Demo de verificación en el navegador | Sí, si no se sobrevende |
| ¿Y por qué no Mercado Pago? | Para un sponsor local, MP podría pagar. No da: aportes internacionales sin cuenta argentina, recibos verificables por terceros sin pedirle nada a una empresa, ni reglas ancladas. Si el piloto muestra que todos los sponsors son locales y no valoran la rendición, MP es la mejor opción y lo diríamos. | — | Sí (con honestidad) |
| ¿Quién custodia el fondo? | En el MVP, un operador (nosotros) con saldo público y cada movimiento con recibo. Es confianza, no trustless. Roadmap: tesorería multisig 2-de-3 (sponsor, institución, operador). A escala en Argentina, operar fondos de terceros en cripto exige registro como PSAV ante la CNV. | Página pública de saldos | **Punto débil #2** (declararlo) |
| ¿Volatilidad? | Hitos fijados en pesos; se pagan sats a la cotización del momento. El riesgo lo absorbe el fondo (sponsor), no el estudiante, que puede convertir a pesos en su app. | Cotización con fuente y hora en el recibo | Parcial |
| ¿Quién valida el hito? ¿No es un oráculo centralizado? | Sí: un tutor o área de bienestar. Lo decimos. El sistema registra quién validó, cuándo y qué regla; no inventa verdad sobre notas. | Log público sin datos personales | Sí, si se declara |
| ¿Qué falla sin internet? | El pago necesita red. Si el estudiante no tiene wallet/datos, se emite un **voucher LNURL-withdraw (QR)** que cobra cuando tenga conexión. | Prueba en demo (opcional) | Parcial |
| ¿Datos desactualizados? | El monto muestra "IPC hasta ago-2026, consultado el …". El sponsor confirma el monto; el dato sugiere, no decide. | UI | Sí |
| ¿Qué parte es artificial? | El estudiante y el validador son integrantes del equipo; el programa es de demo. **Los pagos y recibos son reales** (mainnet, montos chicos). Si la red falla, se declara y se usa signet. | Guion de demo | Sí |
| ¿Qué construyen en el evento? | Servidor de programas, fondeo por QR, aprobación de hito, pago automático, página pública con verificador, devoluciones prorrata, anclaje OTS. | Doc 10 | Sí |
| ¿Innovación defendible? | No es la tecnología, es el **diseño de reglas** (fondeo completo, pausa ≠ abandono, no clawback, devolución exacta) + recibo verificable por pago. | Tests de invariantes | Moderada |
| ¿Qué miden en 48 h? | N.º de pagos reales; tiempo aprobación → acreditación; 100% de recibos verificables; suma exacta aportes = pagado + devuelto + reservado. | Contadores en la página pública | Sí |
| ¿Qué impide copiarlo? | Nada técnico. La ventaja sería un piloto con una universidad y la confianza de sponsors. En una hackathon eso es aceptable. | — | Sí |

**Veredicto**: resiste si (a) no se sobrevende Bitcoin como verificador de notas, (b) se declara la custodia, (c) la demo mueve sats reales. Su debilidad principal es la demanda de sponsors → primer experimento.

## Finalista 2 — Puente (microayuda de emergencia)

| Pregunta | Respuesta | ¿Resiste? |
|---|---|---|
| ¿Problema real? | Evidencia internacional mixta; en Argentina **no hay datos** de shocks que causen abandono. | **Débil** |
| ¿Abuso? | Validación humana + tope por estudiante + acompañamiento; difícil de demostrar en 48 h. | Débil |
| ¿Por qué Bitcoin? | Igual que Tramo. | Sí |
| ¿Demo? | Igual motor. | Sí |
| ¿Por qué sería usado? | Bienestar estudiantil ya da ayudas; no está probado que la velocidad sea su cuello de botella. | Débil |

**Veredicto**: reserva táctica. Se activa sólo si el desafío del track lo pide explícitamente (emergencia, comunidad).

## Finalista 3 — Tutorías por sats

| Pregunta | Respuesta | ¿Resiste? |
|---|---|---|
| ¿Problema real? | Abandono de 1.er año alto; tutorías son intervención conocida; sin dato argentino de efecto. | Parcial |
| ¿Por qué sería usado? | Mercado de dos lados: requiere tutores, alumnos y sponsor a la vez. | **Débil** |
| ¿Colusión? | Tutor y alumno pueden confirmar sesiones falsas para cobrar. | **Débil** |
| ¿Demo? | Buena. | Sí |

**Veredicto**: descartada como principal; su mecánica ("pago por sesión confirmada") cabe como un tipo de hito dentro de Tramo si el desafío es de Nueva Educación.

## Prueba de supervivencia de la ganadora

> "Sin esta solución, un estudiante con una beca que perdió 42% de su valor no recibe el complemento que un sponsor estaría dispuesto a darle, porque nadie administra pagos chicos, condicionados y rendibles. Con esta solución, cuando aprueba un parcial validado, recibe el pago en segundos y cualquiera puede verificar que ocurrió."

Se sostiene **como mecanismo**. Falta probar la **voluntad del sponsor** → doc 12.
