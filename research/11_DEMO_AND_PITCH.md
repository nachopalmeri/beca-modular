# 11 — Demo y pitch

Formato confirmado por bases: **60 s de pitch + 60 s de preguntas**, demo funcional obligatoria (doc 02).
Principios: sin testimonios inventados, sin números inflados, la demo ocupa la mayor parte del minuto.

## 1. Qué distingue a un pitch ganador de 60 s (aplicado)
- [INFERENCIA, doc 03] Los ganadores muestran *una* cosa funcionando de punta a punta y usan la tecnología del evento de forma esencial.
- En 60 s caben ~150 palabras habladas. Si la demo corre en paralelo, el discurso baja a ~110.
- Un solo número de problema. Una sola acción en vivo. Un solo resultado verificable.

## 2. Montaje físico
- Pantalla: página pública del programa (`/p/demo`), con el QR de fondeo visible.
- Integrante A habla. Integrante B (validador) en la laptop. Integrante C sostiene el teléfono "del estudiante" frente a una cámara/visor o lo muestra al jurado.
- Antes de empezar: el QR ya está proyectado; se invita a un jurado a escanearlo ("si tienen una wallet Lightning, pueden ser el sponsor").

## 3. Versión principal — 60 segundos (cronometrada, v2: ~120 palabras)

| t | Habla (A) | Acción en pantalla |
|---|---|---|
| 0–8 s | "La beca Progresar está congelada en 35 mil pesos desde 2024. Según el INDEC, hoy vale 42% menos." | Tarjeta con número y fuente |
| 8–16 s | "Hay egresados, empresas y bitcoiners que quieren complementarla. Falta cómo pagar poco, sólo cuando el estudiante cumple, y rendirlo." | Programa "Ingreso 2026": 5 estudiantes, hito "parcial aprobado" |
| 16–28 s | "Esto es Tramo. [Nombre] acaba de fondear el programa por Lightning desde su teléfono." | Aporte aparece en vivo |
| 28–40 s | "La tutora confirma que la estudiante aprobó su primer parcial…" *(B confirma; pausa)* "…y ya cobró: 25 mil pesos en sats, en tres segundos." | Teléfono vibra; pago en la página |
| 40–52 s | "Cada pago trae un recibo criptográfico que cualquiera verifica acá. Las reglas quedaron selladas en Bitcoin. Si alguien deja, lo no pagado vuelve a cada sponsor." | "Verificar" → ✓; prueba OTS |
| 52–60 s | "Tramo: el apoyo llega cuando se gana, y se puede auditar. Buscamos una facultad para el piloto." | URL final |

Reglas de ensayo: ensayar con cronómetro hasta ≤ 55 s con la demo real; las pausas de la demo (aporte y pago) no se rellenan con palabras. La versión v1 (157 palabras, ~63 s) se descartó por exceder el tiempo.
(*"La estudiante" es una cuenta de demo; en pantalla dice "Estudiante #1 (demo)".*)

## 4. Versión de respaldo (sin red) — 60 s
Igual guion, pero: "Esta es la grabación de la ejecución de esta mañana a las 9:42; los recibos siguen verificables en vivo" → se proyecta el video y luego se verifica un preimage localmente (el verificador funciona offline: SHA-256 en el navegador).

## 5. Apertura de alto impacto — alternativas (todas con dato real)
1. "35 mil pesos. Congelados desde septiembre de 2024. Hoy valen 42% menos." (IPC INDEC)
2. "La beca efectiva de 28 mil pesos ya no alcanza para lo que la Provincia calcula que cuesta un mes de colectivo para ir a cursar en el AMBA: 32 mil." (Res. 172/2026; Decreto PBA 390/2026)
3. "De cada 100 estudiantes del 10% más pobre que empiezan la facultad, la foto del quinto año muestra que casi no quedan." (Argentinos por la Educación, corte transversal — usar sólo si se puede explicar en Q&A)

Recomendada: la 1 (más simple de verificar).

## 6. Mecanismo tecnológico (una frase cada uno)
- **Lightning**: pagos de montos chicos que liquidan en segundos a cualquier billetera, desde cualquier país.
- **Preimage**: el comprobante matemático de que ese pago ocurrió; SHA-256(preimage) = hash de la factura.
- **OpenTimestamps**: el hash de las reglas queda sellado en un bloque de Bitcoin; nadie puede cambiarlas después sin que se note.
- **Contabilidad exacta**: aportes = pagado + devuelto + reservado, al sat.

## 7. "¿Por qué ustedes?"
"Venimos trabajando el problema desde hace semanas: auditamos los datos oficiales nosotros mismos (Presupuesto Abierto, IPC) y descartamos la versión anterior de esta idea en Ethereum porque no movía valor real. Somos estudiantes: este es el riel que nos gustaría que existiera para nuestros compañeros." *(Ajustar con la historia real del equipo, sin inventar.)*

## 8. Preguntas difíciles — respuestas ≤ 20 s

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿Quién custodia la plata? | Hoy, el operador del programa, con saldo y cada movimiento públicos. No es trustless y lo decimos. El paso siguiente es una tesorería multisig entre sponsor, facultad y operador. |
| 2 | ¿Por qué no Mercado Pago? | Para un sponsor local podría servir. No permite aportes desde el exterior sin cuenta argentina ni recibos que un tercero verifique sin pedirle nada a una empresa. |
| 3 | ¿Cómo saben que aprobó? | No lo sabe la blockchain: lo confirma una tutora con nombre y rol. Registramos quién, cuándo y bajo qué regla. No guardamos notas. |
| 4 | ¿Y la volatilidad? | El hito se fija en pesos y se paga al tipo de cambio del momento; el riesgo es del fondo, no del estudiante, que puede pasar a pesos en su app. |
| 5 | ¿Esto reduce el abandono? | No lo sabemos todavía. Becas condicionadas a desempeño tuvieron efectos modestos y positivos en ensayos aleatorios en EE.UU.; acá lo mediríamos en un piloto. |
| 6 | ¿El estudiante necesita wallet? | Si tiene una con Lightning address, cobra solo. Si usa Belo o Lemon, genera una factura en su app y la pega en el link de cobro. Si no tiene nada, le damos un voucher QR. *(probar los tres modos con 100 sats en Fase B)* |
| 13 | ¿No existen ya becas privadas? | Sí: la Fundación YPF paga 450 mil por mes a 50 estudiantes. No queremos competir con ellas; queremos ser su riel: pagar por hito, sumar aportes chicos y rendir públicamente. |
| 7 | ¿Es legal? | Con fondos propios en la demo, sí. A escala, custodiar fondos de terceros requiere registrarse como PSAV en la CNV o usar un modelo no custodial. |
| 8 | ¿Qué existía antes del evento? | La investigación y una landing de la idea anterior. El código de esta demo lo escribimos acá; el historial del repo lo muestra. |
| 9 | ¿Qué pasa si abandona? | Una revisión humana lo confirma; lo ya cobrado queda con el estudiante y lo no pagado vuelve a cada sponsor en proporción a su aporte. |
| 10 | ¿Por qué ese monto? | Es la brecha para que Progresar recupere su valor de septiembre de 2024 según el IPC; el sponsor puede cambiarlo. |
| 11 | ¿Usan IA? | No en el producto. No hacía falta. |
| 12 | ¿Y si los datos están desactualizados? | Mostramos fuente y fecha del último dato; el monto es una sugerencia que el sponsor confirma. |

## 9. Propuesta de continuidad
1. Piloto de 1 cuatrimestre: 5 estudiantes × 2 hitos con un programa de tutorías o centro de estudiantes.
2. Tesorería multisig.
3. Si los sponsors son todos locales: evaluar riel en pesos manteniendo los recibos.

## 10. Lo que NO decir
"Revolucionamos la educación", "eliminamos el abandono", "trustless", "la blockchain verifica las notas", cualquier testimonio que no sea real, cifras de pobreza que no podamos explicar.
