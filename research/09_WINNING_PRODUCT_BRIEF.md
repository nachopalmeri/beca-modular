# 09 — Product brief: **Tramo**

> Complementos de beca que se pagan por Lightning en segundos cuando el estudiante cumple un hito validado, con un recibo que cualquiera puede verificar.

Fecha: 2026-10-26. Nombre provisional. Evoluciona Beca Modular: conserva problema y reglas, cambia el riel (Sepolia → Lightning) y reduce el alcance.

## 1. Propuesta de valor

| Para | Valor |
|---|---|
| Sponsor (egresados, empresa, comunidad bitcoiner) | Financia exactamente lo que quiere premiar, ve cada pago con prueba criptográfica y recupera lo no usado. Sin cuentas bancarias argentinas. |
| Estudiante | Recibe el complemento en segundos en la wallet que ya usa (o en un voucher QR), sin trámite ni espera mensual. |
| Validador (tutor/bienestar) | Un botón para confirmar un hito; el resto (pago, rendición, devolución) es automático. |

## 2. Perfil de usuario (para la demo; persona ilustrativa, NO testimonio)

- **Estudiante**: 19 años, 1.er año en una universidad del conurbano, primera generación, cobra Progresar ($28.000 efectivos), trabaja medio tiempo. Hito: aprobar el primer parcial de una materia troncal.
- **Sponsor**: grupo de 20 egresados que aporta 200.000 sats para 5 estudiantes.
- **Validador**: tutor de ingreso de la facultad.

*En el pitch se presenta explícitamente como "caso ilustrativo".*

## 2b. Verificaciones técnicas hechas sin dinero (2026-10-26)

| Supuesto | Resultado |
|---|---|
| Blink API producción | Responde, `network: mainnet` |
| Blink API staging | Responde, `network: signet` (sirve como plan B sin dinero real) |
| Blink expone preimage | Sí: `SettlementViaLn.preImage` y `paymentPreimage` en el schema GraphQL público |
| Lightning address de Blink / WoS / Alby | Resuelven LNURL-pay (HTTP 200) |
| Strike | Resuelve pero "User can't receive" para usuario inexistente — no evaluado |
| Lemon / Belo address fija | No encontrada (404); ambos usan facturas de un solo uso |
| OpenTimestamps | Calendario `a.pool.opentimestamps.org` devolvió atestación pendiente en 0,5 s (digest de prueba) |
| Cotización ARS/BTC | `api.yadio.io` responde; 1 BTC ≈ $131,06 M (26/10) |

## 3. Problema y evidencia (resumen del doc 04)
- Progresar: $35.000 sin actualizar desde sept-2024 → **–42% real** (IPC INDEC).
- 2025: 1.767.524 inscriptos, 953.169 becarios.
- Decil más pobre: 7,9% de 1.er año → 1,1% de 5.º.
- Becas condicionadas a desempeño: efectos modestos pero positivos en RCT (MDRC).

## 4. Flujo principal (end-to-end, lo que se demuestra)

1. **Crear programa** (sponsor): nombre, cupo de estudiantes, hitos (p.ej. "parcial 1", "materia aprobada"), monto por hito en ARS. El sistema **sugiere** el monto = brecha mensual de Progresar ajustada por IPC (≈$25.330) con fuente y fecha.
2. **Congelar reglas**: se calcula SHA-256 del JSON de reglas y se ancla en Bitcoin con **OpenTimestamps** (prueba "pending" → confirmada en un bloque en horas). Después del primer aporte las reglas no cambian.
3. **Fondear**: aparece un QR Lightning (invoice). Cualquiera (el jurado) paga desde su teléfono. El aporte registra alias + Lightning address para devolución.
4. **Activar**: sólo con la meta completa (regla heredada de Beca Modular).
5. **Validar hito**: el validador entra con PIN, elige estudiante (seudónimo) y hito → "Confirmar".
6. **Pagar**: el servidor convierte ARS → sats con cotización (fuente + hora) y paga por uno de tres modos. Guarda `payment_hash` + `preimage`.
   - **Push a Lightning address** (Blink, Wallet of Satoshi, Alby: verificado que resuelven LNURL-pay el 26/10). Instantáneo, sin acción del estudiante. *Modo de la demo.*
   - **Pull por factura** (Belo y Lemon reciben Lightning con **facturas de un solo uso**, no con address fija — centro de ayuda de Belo, mar-2026): el estudiante abre un link "Cobrá tu tramo", genera en su app una factura por el monto exacto y la pega; el servidor valida monto y vencimiento y paga.
   - **Voucher LNURL-withdraw (QR)**: para quien no tiene wallet o datos en ese momento; cobra después. Validar en Fase B qué wallets argentinas lo escanean.
7. **Recibo público**: `/p/<programa>` muestra fondos, pagos, devoluciones y, por cada pago, hash, preimage, monto, hora y regla aplicada — **sin nombres ni notas**. Botón "Verificar" calcula SHA-256(preimage) en el navegador y lo compara con el hash.
8. **Cerrar**: abandono confirmado (revisión humana) o fin de programa → saldo no liberado vuelve prorrata a sponsors (contabilidad `funding-model.mjs`).

**Momento de demo**: pasos 3, 5, 6, 7 en < 40 s.

## 5. Arquitectura mínima

```
[Navegador sponsor/jurado] --QR invoice--> [Proveedor Lightning (Blink API)]
          |                                         ^
          v                                         | pay / invoice / webhook
[Web estática + Node server] --SQLite-- [eventos append-only con hash encadenado]
          |            |                          
          |            +--> api.yadio.io (ARS/BTC)       
          |            +--> apis.datos.gob.ar (IPC)  [caché + snapshot]
          |            +--> OpenTimestamps calendars (anclaje reglas)
          v
[Página pública /p/:id + verificador SHA-256 en el cliente]
```

- Un único proceso Node 22 (HTTP nativo o Express), HTML + ES modules (estilo del repo), SQLite (`better-sqlite3`) o JSON con escritura atómica.
- Proveedor Lightning **primario: Blink API** (GraphQL, `X-API-KEY`, tiene staging en signet; el schema público expone `preImage` en `SettlementViaLn` — verificado en `blinkbitcoin/blink`). **Respaldo: Alby Hub vía NWC (`@getalby/sdk`)** o LNbits.
- Despliegue: laptop + Cloudflare Tunnel para el QR, y una copia en un VPS/Render como respaldo.

## 6. Fuentes de datos concretas

| Dato | Fuente | Acceso | Uso |
|---|---|---|---|
| IPC nacional mensual | INDEC vía `apis.datos.gob.ar/series` id `148.3_INIVELNAL_DICI_M_26` | Sin clave | Monto sugerido |
| Monto Progresar | Res. 172/2026 ($35.000) | Constante documentada | Monto sugerido |
| Ejecución Progresar | Presupuesto Abierto CSV | Sin clave (snapshot en `research/data`) | Pitch/Q&A |
| Cotización ARS/BTC | `api.yadio.io/convert/{monto}/ARS/BTC` | Sin clave | Conversión en el pago |
| OpenARG (opcional) | MCP/API, clave gratuita | 200 pedidos/mes | Proveedor alternativo con atribución |

## 7. Modelo de información

```
Program { id, name, rules_json, rules_sha256, ots_proof, milestone_types[{code,label,amount_ars}],
          seats, goal_sats, deadline, status: draft|funding|active|paused|closed }
Contribution { id, program_id, alias, refund_lnaddress, sats, payment_hash, settled_at }
Student { id, program_id, pseudonym, lnaddress (privado), status: active|paused|withdrawn }
Approval { id, student_id, milestone_code, validator_id, created_at, note (privada) }
Payout { id, approval_id, amount_ars, rate_ars_btc, rate_source, rate_ts, sats,
         payment_hash, preimage, status, settled_at }
Refund { id, contribution_id, sats, payment_hash, preimage, settled_at }
Event { seq, type, payload_public, prev_hash, hash }   // log encadenado, publicable
```
Invariante: Σ contribuciones = Σ pagos + Σ devoluciones + saldo reservado (± redondeo documentado al sat).

## 8. Funcionalidades imprescindibles (MVP de competencia)

1. Crear programa con 1–2 tipos de hito y monto sugerido por IPC.
2. Anclaje OTS del hash de reglas.
3. Fondeo por QR Lightning con confirmación en vivo (webhook o polling).
4. Aprobación de hito por validador (PIN).
5. Pago automático a Lightning address con conversión ARS→sats.
6. Página pública con recibos y verificador en el navegador.
7. Devolución prorrata de saldo a sponsors (al menos 1 ejecutada en vivo o pregrabada como evidencia).

## 9. Excluir explícitamente

Login social, KYC, chat, IA generativa, marketplace de estudiantes, ranking de estudiantes, notas en el sistema, multi-moneda, tokens propios, smart contracts EVM, yield, app móvil nativa, dashboard de datos públicos, notificaciones por email.

## 10. Integraciones externas y riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Wi-Fi del predio cae | Alta | Alto | 2 hotspots móviles; servidor en VPS; video de respaldo grabado el día 2 a la mañana |
| Blink API caída/limita | Baja | Alto | Alby Hub/NWC preconfigurado; modo signet |
| Pago a Lightning address falla (ruteo) | Media | Alto | Estudiante de demo con wallet en el mismo proveedor (pago interno instantáneo) + segunda wallet externa probada |
| Estudiante con Belo/Lemon no tiene address fija | **Confirmado** | Medio | Modo pull por factura (paso 6); probar con 100 sats reales en Fase B |
| Yadio caído | Baja | Medio | Cotización cacheada con hora visible |
| OTS calendario lento | Media | Bajo | Mostrar "pendiente" es correcto; anclar el día 1 para tener confirmación el día 2 |
| Regulatorio (custodia de terceros) | — | Alto a escala | Declarado: el MVP usa fondos propios; producción requiere PSAV (CNV RG 1058/2025) o modelo no custodial |
| Volatilidad | Media | Medio | Montos en ARS, conversión al pagar; buffer del 10% en meta |

## 11. Estrategia de validación

- **Antes del evento** (doc 12): 3 entrevistas con posibles sponsors (pedir un compromiso concreto, aunque sea simbólico) y 3 con estudiantes que cobran Progresar (¿tienen wallet Lightning o Lemon/Belo? ¿qué hito sería justo?).
- **En el evento**: n.º de aportes reales del público/jurado; tiempo validación→pago; 100% de recibos verificables.
- **Después**: piloto con un programa de tutorías o un centro de estudiantes: 5 estudiantes × 2 hitos.

## 12. Métricas verificables

| Métrica | Dónde se ve | Meta en demo |
|---|---|---|
| Tiempo aprobación → pago liquidado | Recibo (timestamps) | < 5 s |
| Recibos verificables | Verificador | 100% |
| Exactitud contable | Test de invariantes + página | Diferencia 0 sats |
| Aportes en vivo | Página pública | ≥ 1 externo al equipo |
| Reglas ancladas | Prueba OTS | Confirmada en bloque antes del pitch |
