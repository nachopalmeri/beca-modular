# 07 — Matriz de decisión competitiva

Fecha: 2026-10-26. Pesos: los propuestos. **No se modificaron** porque los criterios oficiales no están publicados (doc 02). Si el día 1 se publican, re-ponderar con la misma tabla.

| Criterio | Peso |
|---|---:|
| P — Problema demostrado y relevante | 20% |
| D — Diferenciación real | 15% |
| M — Calidad y viabilidad de la demo | 20% |
| I — Impacto verificable | 15% |
| T — Ajuste a track/criterios | 15% |
| F — Factibilidad para el equipo | 10% |
| N — Potencia narrativa | 5% |

## Puntajes (0–10)

| Idea | P | D | M | I | T | F | N | Bruto | Penalizaciones | **Final** |
|---|---|---|---|---|---|---|---|---:|---|---:|
| I-2 Tramo | 8 | 7 | 9 | 6 | 8 | 7 | 8 | 7,65 | –0,3 custodia/oráculo | **7,35** |
| I-3 Puente | 7 | 7 | 8 | 6 | 8 | 7 | 8 | 7,25 | –0,4 evidencia mixta + fraude | **6,85** |
| I-4 Tutorías por sats | 6 | 6 | 8 | 5 | 7 | 6 | 7 | 6,45 | –0,3 dos lados | **6,15** |
| I-7 Escuela Abierta | 7 | 6 | 6 | 5 | 7 | 5 | 7 | 6,15 | –0,5 datos externos + verificación simulada | 5,65 |
| I-10 Pedido de Acceso | 6 | 7 | 7 | 5 | 5 | 7 | 5 | 6,10 | –0,3 sin rol Bitcoin | 5,80 |
| I-5 Navegador | 7 | 3 | 7 | 5 | 6 | 8 | 5 | 5,95 | –0,5 ya existe / ChatGPT | 5,45 |
| I-9 Apuntes L402 | 3 | 6 | 8 | 3 | 7 | 7 | 5 | 5,55 | –0,5 problema no probado | 5,05 |
| I-1 Beca Modular Sepolia | 6 | 5 | 5 | 4 | 6 | 5 | 6 | 5,25 | –0,5 blockchain desalineada + oráculo | 4,75 |
| I-6 Retenido | 6 | 7 | 3 | 4 | 5 | 6 | 6 | 5,10 | –0,8 demo simulada | 4,30 |
| I-8 Señal Cero | 4 | 4 | 5 | 4 | 7 | 4 | 6 | 4,75 | –0,6 ya existe + dependencia SMS | 4,15 |

## Fundamento de puntajes clave

**I-2 Tramo**
- P=8: números oficiales verificados (IPC → –42%; ejecución presupuestaria) + brecha socioeconómica documentada. No 10: la demanda del *sponsor* no está validada.
- D=7: combinación pago condicionado + recibo criptográfico + devolución exacta no la encontré en el ecosistema (búsqueda no exhaustiva). Componentes individuales existen.
- M=9: mueve valor real en vivo, con participación del jurado, en < 20 s. No 10: depende de red.
- I=6: el evento sólo prueba el riel (pagos, recibos, devoluciones), no el efecto educativo.
- T=8: encaja literal en "Blockchain como herramienta para dar acceso financiero a quienes el sistema tradicional deja afuera" y, alternativamente, en Nueva Educación.
- F=7: Lightning API + web + contabilidad (reutilizable del repo); 4–5 personas en ~16 h.
- N=8: "La beca vale 42% menos. Esto le paga en 3 segundos cuando aprueba."

**I-3 Puente**: mismo motor que Tramo; pierde en P (evidencia mixta, sin datos argentinos de shocks) y por riesgo de abuso. **Comparte el 80% del código con Tramo**: si el desafío del track del día 1 premia "emergencia/comunidad", se reencuadra sin reescribir.

**I-1 Beca Modular Sepolia**: buenas reglas, peor demo (token sin valor) y peor ajuste al jurado. La mejora más grande disponible es cambiar el riel, no la idea → eso es I-2.

### Revisión iteración 2 (2026-10-26)
- Nueva evidencia (doc 04 §4b): sponsors privados ya financian becas condicionadas al rendimiento. Esto **refuerza P de Tramo** (sigue en 8; no sube a 9 porque la preferencia por un riel nuevo no está probada).
- Nueva restricción (doc 09 §2b): Belo y Lemon no tienen Lightning address fija → M de Tramo sigue en 9 sólo si la demo usa una wallet con address (Blink/WoS) y el modo pull por factura queda como función secundaria probada.
- **El orden no cambia.**

## Penalizaciones aplicadas (explícitas)

| Penalización | Ideas afectadas |
|---|---|
| Dependencias no controladas | I-7 (Radar PBA), I-8 (SMS), I-6 (ANSES) |
| Blockchain artificial/desalineada | I-1 (EVM testnet en evento Bitcoin) |
| IA ornamental | Ninguna idea final la usa en el núcleo; el checklist IA de Beca Modular queda eliminado |
| Datos incompletos | I-3, I-6, I-8, I-9 |
| Problema inventado / no probado | I-9 |
| Ya existe | I-5, I-8 |
| Demo simulada | I-6, I-7 parcial |
| Demasiada explicación | I-1 (escrow + testnet + ERC-20), I-10 |

## Clasificación relativa y supuestos

1. **Tramo** 2. **Puente** 3. **Tutorías por sats**.

Supuestos que, si fallan, cambian el orden:
- S1: el desafío del track de Inclusión Financiera o Nueva Educación es compatible con "pagos condicionados" (si el desafío es, p.ej., "educación sobre Bitcoin", Tramo pierde T).
- S2: se puede operar Lightning con dinero real en el predio (red + proveedor).
- S3: el jurado valora mover valor real por sobre arquitectura on-chain compleja.

**Incertidumbre**: alta en T (criterios no publicados) y en D (no hay catálogo exhaustivo de competidores). La diferencia Tramo–Puente (0,5) está dentro del margen de error; por eso se construye **un motor común** y se decide el encuadre al conocer el desafío.
