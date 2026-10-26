# 10 — Plan de ejecución

Fecha: 2026-10-26 (lunes). Evento: vie 30 y sáb 31/10. Tiempo en sede ≈ 10 h el día 1 (cierre 19:30) + mañana del día 2 hasta la entrega (horario [FALTA]).

## Regla de oro sobre trabajo previo
Las bases no prohíben preparación (doc 02 §4). Para no exponernos:
- **Antes**: investigación, cuentas, claves, wallets, datos, diseño, guion, *spikes descartables* para confirmar que las APIs funcionan.
- **Durante**: todo el código del producto se escribe en el evento, en un repo nuevo creado el 30/10 (historia de commits visible).
- **Pedir por escrito** a contacto@labitconf.com si se pueden traer librerías/boilerplate propios. Si responden que sí, se puede adelantar el esqueleto.

## FASE A — Investigación y elección (hoy, lun 26)
- [x] Auditoría, reglas, benchmark, datos (este directorio).
- [ ] **Confirmar inscripción de todos en Luma** (bloqueante).
- [ ] Mail a la organización (preguntas del doc 02 §6).
- [ ] Decisión del equipo: Tramo como principal, Puente como reencuadre.

## FASE B — Preparación permitida (mar 27 – jue 29)

| Tarea | Responsable | Salida |
|---|---|---|
| Cuenta Blink (prod + staging) y API key; probar `lnInvoiceCreate` y pago a una Lightning address con 100 sats; confirmar que se obtiene `preImage` | Dev Lightning | Nota de spike (no código del producto) |
| Alby Hub o LNbits como respaldo; conexión NWC probada | Dev Lightning | URL NWC en gestor de secretos |
| 3 wallets de demo: estudiante (mismo proveedor), estudiante (externo: Lemon/Belo si recibe Lightning en 2026 — **verificar**), sponsor | Producto | Lightning addresses |
| Fondos de demo: ~50.000 sats (≈ $65.500 ARS con Yadio del 26/10: 1 BTC ≈ $131,06 M; un hito de $25.330 ≈ 19.300 sats) | Equipo | Saldo |
| Probar OpenTimestamps (cliente JS o CLI) | Dev backend | Nota |
| Snapshot de IPC y Presupuesto Abierto | Datos | Ya en `research/data/` |
| Clave OpenARG (opcional) y prueba `listar_fuentes` | Datos | Sí/no |
| Wireframes de 4 pantallas: crear programa, QR, validador, página pública | Diseño | Figma/papel |
| Guion de pitch v1 + ensayos cronometrados | Pitch | Doc 11 |
| 3 entrevistas sponsors + 3 estudiantes (doc 12) | Producto | Notas con citas reales, con permiso |
| Actualizar o despublicar la landing (dice USD/Sepolia) | Producto | Decisión |
| Logística: 2 hotspots, cargadores, alargue, comida | Todos | Checklist |

## FASE C — Desarrollo en la hackathon

### Día 1 (vie 30)
| Hora | Hito | Camino crítico |
|---|---|---|
| Apertura | Leer desafío del track. **Decisión de encuadre en 20 min**: Tramo (Inclusión Financiera / Nueva Educación) o Puente (Impacto y Comunidad). | ★ |
| +0:30 | Repo nuevo, esqueleto Node, `.env` con claves, modelo de datos | ★ |
| +1:30 | Fondeo por QR funcionando contra Blink (invoice → pago desde teléfono → estado "pagado") | ★ |
| +3:00 | Pago a Lightning address desde el servidor + guardado de `payment_hash`/`preimage` | ★ |
| +4:30 | Aprobación de hito → pago automático (end-to-end feo pero real) | ★ **Hito de seguridad: demo mínima existe** |
| +6:00 | Página pública + verificador SHA-256 | ★ |
| +7:00 | Monto sugerido por IPC; conversión ARS→sats con fuente/hora | |
| +8:00 | Anclaje OTS de reglas (para que confirme durante la noche) | |
| +9:00 | Devolución prorrata (portar `funding-model.mjs` + tests) | |
| 19:30 | Salida. Deploy en VPS. Ensayo 1 del pitch en casa. | |

### Noche / Día 2 (sáb 31)
| Hora | Hito |
|---|---|
| Noche (opcional, en casa) | Pulido visual, textos, manejo de errores. **Congelar features a medianoche.** |
| Llegada | Prueba completa en la red del predio y en hotspot. Grabar video de respaldo de la demo real. |
| Entrega −2 h | Ensayos de pitch (≥5) y de Q&A. |
| Entrega | Repo + link + video. |

## Tareas paralelizables (equipo de 4–5)

| Rol | Día 1 | Día 2 |
|---|---|---|
| 1. Lightning/back-end | Fondeo, pagos, preimage, webhooks | Robustez, reintentos |
| 2. Back-end/contabilidad | Modelo, eventos, devoluciones, tests de invariantes | Log encadenado, OTS |
| 3. Front-end | 4 pantallas, QR, verificador | Pulido, mobile |
| 4. Datos + producto | IPC, cotización, textos, reglas; validación con mentores (incl. Colossus si mentorea) | Q&A y números |
| 5. Pitch + QA + demo ops | Guion, pruebas manuales, checklist de red | Video de respaldo, ensayo, manejo del tiempo |

## Camino crítico
Cuenta Lightning operativa → invoice/fondeo → pago saliente con preimage → aprobación que dispara pago → página pública. **Todo lo demás es opcional.**

## FASE D — Validación, pruebas y contingencias

| Falla | Señal | Contingencia |
|---|---|---|
| Internet del predio | Latencia/timeout | Hotspot 1 → hotspot 2 → video de respaldo (declarado como grabación de una ejecución real con hora) |
| API Lightning | Error 5xx/timeouts | Cambiar `LN_PROVIDER=nwc` (Alby Hub) — variable de entorno lista |
| Ruteo a wallet externa | Pago falla | Usar wallet del estudiante en el mismo proveedor (pago interno) |
| Datos (IPC/Yadio) | Error | Snapshot cacheado con fecha visible |
| Autenticación validador | PIN no funciona | PIN de respaldo en `.env` |
| Laptop | Se cuelga | Segunda laptop con el repo clonado y `.env`; servidor en VPS |
| Jurado no paga el QR | Nadie escanea | Integrante "sponsor" paga desde su teléfono |

Pruebas mínimas: tests de invariantes contables (Node test runner); prueba manual end-to-end ×3 en red del predio; prueba con montos de 1 sat y de 10.000 sats.

## FASE E — Demo y pitch
Ver doc 11. Regla: **la demo es el pitch**. Proyectar la página pública; el teléfono del estudiante en mano (o en cámara) para que se vea llegar el pago.
