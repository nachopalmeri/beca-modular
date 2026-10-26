# 13 — Registro de iteraciones

## Iteración 2 — 2026-10-26

### Verificaciones nuevas
| Qué | Resultado | Impacto |
|---|---|---|
| Bases oficiales re-descargadas | Sin cambios respecto de la mañana (jurado y criterios siguen sin publicar) | Ninguno |
| Blink API prod / staging | mainnet / signet operativas | Plan B sin dinero real disponible |
| Lightning address (LNURL-pay) | Blink, Wallet of Satoshi y Alby resuelven; Lemon y Belo no | **Cambio de diseño**: 3 modos de pago (push, pull por factura, voucher) — doc 09 |
| Belo, centro de ayuda (mar-2026) | Recibe Lightning con factura de un solo uso | ídem |
| OpenTimestamps | Calendario respondió con atestación pendiente en 0,5 s | Anclaje de reglas factible en el evento |
| Fundación YPF 2026 | 50 becas, $450.000/mes × 9; renovación anual; trámites a cargo del becario | **Evidencia del lado sponsor** — doc 04 §4b |
| Padrinazgos UCASAL | Condición: promedio > 7 y carrera al día | ídem |
| Cimientos | Beca + acompañamiento (2.201 estudiantes en 2021) | Posible socio; patrón "beca + acompañamiento" |

### Cambios en documentos
- 04: nueva sección 4b (becas privadas existentes).
- 07: nota de revisión; el orden no cambia.
- 08: "¿Por qué sería usado?" con evidencia de sponsors.
- 09: modos de pago y tabla de verificaciones técnicas.
- 11: guion v2 (115 palabras, ≤142 palabras/min por tramo; la v1 tenía 157 palabras ≈ 63 s); nuevas respuestas Q6 y Q13.
- 12: el experimento incluye 2 programas de becas existentes.

### Pendientes abiertos (no resolubles desde acá)
1. Confirmación de inscripción en Luma.
2. Respuesta de la organización sobre código previo, horario de entrega y conectividad.
3. Prueba real de 100 sats a Belo y Lemon en modo pull.
4. ~~Cifra de pobreza del INDEC en el PDF primario~~ **Resuelto**: 32,3% personas; 15–29 años 36,9% (doc 04).
5. Contenido de la charla de Martín Yeza en el bootcamp (si alguien del equipo asistió).

## Iteración 3 — 2026-10-26 · la web

- Nueva landing `index.html` (Tramo). La anterior quedó en `beca-modular.html`; los enlaces de `demo.html`, `laboratorio.html` y `respaldo.html` apuntan a ella. `dist/` (lo publicado) **no** se tocó: no hubo deploy.
- Secciones: problema con 4 cifras oficiales y fuente/fecha; "lo que no es el problema" (ejecución 99%) y sponsors existentes (YPF, UCASAL); cómo funciona; lo que Tramo no hace; simulador; verificador; comparación honesta con riel local; qué existe hoy vs qué se construye en el evento; fuentes.
- Datos en vivo: IPC (API datos.gob.ar) y cotización (Yadio), ambos con CORS habilitado (verificado); si fallan, snapshot del 26/10 con aviso.
- Simulador: reglas → huella SHA-256 → fondeo compartido → validación por estudiante → revisión/baja (sólo tras revisión) → cierre con devolución por mayor resto; registro público con invariante fondeado = pagado + devuelto + reservado.
- Verificador real: decodifica facturas BOLT11 (bech32 con checksum) y compara SHA-256(preimage) con el payment hash. Probado con el vector oficial de la especificación BOLT 11.
- Pruebas: 9 tests nuevos (`tests/tramo.test.mjs`); suite completa 57/57. E2E con Playwright en 1440×900 (claro) y 390×844 (oscuro): sin errores de consola, sin desborde horizontal, contabilidad cuadra, actualización en vivo OK.
- No se agregó ninguna funcionalidad de pago real (eso se construye en el evento, doc 10).

## Iteración 4 — 2026-10-26 · la web según el boceto del equipo

Pedido: narrativa con scroll horizontal, estética dark academia (referencia de interacción: heyato.ai/es/launch), mapa → árbol con hojas-billete → gráfico de subida → cierre con mascota planta.

- `index.html` reescrita como historia en 5 escenas (`story.mjs`, `story-data.mjs`) + cierre + secciones funcionales (simulador, verificador) reestilizadas en `tramo.css`.
- Marca: **Beca Modular** (como en el boceto); "tramo" queda como concepto. Mascota: **Brote** (nombre provisorio), con estados por sección y versión graduada y dormida en el cierre.
- Decisiones de honestidad sobre el boceto:
  - "X personas no terminan por falta de fondos": no hay dato oficial con esa formulación → mapa con pobreza **por aglomerado** (INDEC 1S-2026, cuadro 4.1, 31 aglomerados con GBA dividido en CABA y partidos), marcando los de CV 16–25% como "tomar con cuidado"; y el dato del decil 7,9% → 1,1%.
  - "Gráfico de subida de graduados": sería una proyección inventada → gráfico real del valor de Progresar deflactado (100 → 58) y el área que el complemento restituye. Se aclara que el efecto en graduación se medirá en un piloto.
  - "Web3": reemplazado por "Bitcoin y Lightning" (evento y jurado Bitcoin).
- Geometría: límites provinciales del IGN (WFS oficial), simplificados con Douglas-Peucker a ~59 KB.
- Interacción: cada escena se detiene mientras se anima (55% de su tramo de scroll) y luego se desliza; flechas ←/→ navegan escenas; con `prefers-reduced-motion` la historia se apila en vertical con todo visible.
- Verificación: 57/57 tests; Playwright en 1440×900 y 390×844 (más modo de movimiento reducido): sin errores de consola, sin desborde horizontal.
