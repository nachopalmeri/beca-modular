# Kit de presentación — Beca Modular

## Pitch de hasta 55 segundos

> ¿Qué pasa si el apoyo educativo llega tarde o todo junto y nadie puede seguir qué se pagó? Es una hipótesis por validar, no un diagnóstico nacional. Sobre Progresar: **[DATO A VERIFICAR + fuente]**. Beca Modular propone que un sponsor financie una beca por hitos; el estudiante no paga. Una tutora revisa la evidencia y decide: la IA solo sugiere. El recibo de demo permite comprobar preimage y hash entre sí; el QR y el pago son simulados, no mueven fondos. El saldo no usado se devuelve en el escenario. El modelo base todavía pierde USD 5.914,40 al mes. Buscamos validar el proceso, el costo y quién pagaría con un piloto institucional.

**Tiempo estimado:** 45–52 segundos a ritmo claro. Reemplazar el placeholder solo con una cifra comprobada y su fuente primaria; si no se encuentra, conservarlo o quitar la frase al presentar. No leer el placeholder como si fuera un dato.

## Recorrido de demo — 90 segundos

1. **0–10 s · Problema:** explicar que pagos tardíos o concentrados dificultan previsibilidad y seguimiento; aclarar que es una hipótesis a validar.
2. **10–20 s · Sponsor:** abrir `demo.html`, mostrar presupuesto en sats ficticios, pago por hito y Lightning Address de ejemplo (`.invalid`).
3. **20–35 s · Fondeo:** crear el QR y señalar el aviso **SIMULADO / no es BOLT11**; pulsar **Simular pago del sponsor**. Sin wallet ni pago externo.
4. **35–50 s · IA + persona:** subir `constancia-demo.txt`, mostrar campos detectados y **IA (modo demo)**. La IA sugiere; la tutora revisa y pulsa aprobar.
5. **50–68 s · Recibo:** mostrar pago simulado, explicación IA, preimage y hash; verificar que coinciden. Aclarar que la prueba solo verifica el dato generado, no una transferencia Lightning.
6. **68–78 s · Saldo:** devolver el saldo exacto no usado al sponsor ficticio; mostrar ledger en sats reconciliado.
7. **78–90 s · Sponsor + negocio:** generar el reporte de esta sesión y abrir `/modelo`: pérdida base de USD 5.914,40/mes y supuestos editables.

Reiniciar la demo y repetir el recorrido tres veces antes de salir a escena. Esas son pruebas locales del flujo simulado, no tres pagos en vivo.

## Guion de grabación — respaldo de 60–90 segundos

- Grabar pantalla completa a 1440×900, zoom 100%, sin notificaciones ni datos personales. Usar solo el archivo sintético incluido en `tests` o escribir uno de prueba; no subir documentación real.
- Narrar el recorrido anterior con las mismas aclaraciones de simulación. Mantener visibles las etiquetas **SIMULADO**, **IA (modo demo)** y **Sugerido por IA**.
- Grabar una toma continua si es posible. Si se edita, no ocultar errores ni representar el QR como cobrable.
- Exportar MP4 local y probarlo sin conexión. Si no hay grabación lista, usar el ZIP offline y narrar la interacción en vivo.

## Cinco preguntas del jurado

1. **¿El dinero se mueve por Lightning?** No en esta entrega. El proveedor demo, el QR `beca-demo:` y los recibos son simulados; no son facturas BOLT11. Blink no está habilitado sin cuenta, credenciales, autorización y operación segura.
2. **¿La IA aprueba el hito?** No. Sugiere extraer/comparar evidencia y explicar el recibo; la tutora mira el original y decide siempre. Sin clave, la sugerencia determinística se etiqueta **IA (modo demo)**.
3. **¿Quién paga y cuál es el negocio?** El sponsor pagaría la licencia administrativa; el estudiante no paga y el principal de beca no es ingreso. Los supuestos no están validados: el caso base pierde USD 5.914,40/mes; con la licencia base, el cálculo actual requiere 701 sponsors para cubrir los costos proyectados.
4. **¿Qué demuestra el recibo con preimage?** Que el preimage de la simulación coincide por SHA-256 con el hash mostrado. No demuestra que se haya enviado o recibido un pago real.
5. **¿Ya midieron el problema o el impacto de Progresar?** No. La necesidad y el impacto siguen por validar. No inventamos una cifra de Progresar: el guion conserva **[DATO A VERIFICAR + fuente]** hasta verificar valor, período y fuente primaria.

## Fallback sin internet o si falla la demo

- Abrir `beca-demo-offline.zip`, ejecutar `node server.mjs` y navegar a `http://127.0.0.1:4178/demo.html`.
- Si falla una interacción, abrir el MP4 o capturas y decir qué no funcionó. No afirmar una transferencia, validación institucional o impacto que no ocurrió.
- El QR de respaldo tampoco es cobrable; la ausencia de internet nunca convierte una simulación en un pago.

## Checklist de escenario

- [ ] Abrir `http://127.0.0.1:4178/demo.html` y verificar que la pantalla inicial indique claramente **MODO DEMO · SIMULADO**.
- [ ] Confirmar que el QR tiene `beca-demo:` y que no se anuncia como BOLT11.
- [ ] Hacer tres ensayos completos: fondeo simulado → evidencia → sugerencia IA → decisión de tutora → recibo/hash → devolución exacta → reporte.
- [ ] Revisar que pagado + devuelto + reservado sea igual al fondeado en sats.
- [ ] Confirmar `/modelo`, la pérdida base, los supuestos y el punto de equilibrio; no esconder el caso negativo.
- [ ] Tener abierto el ZIP offline y probado el MP4 como respaldo.
- [ ] No introducir claves, facturas reales, documentos académicos reales ni datos personales en la demo.
- [ ] Reemplazar el placeholder de Progresar solo con cifra, período y fuente primaria comprobables; de lo contrario, no presentar cifra.
- [ ] Verificar con la organización las reglas de código previo/IA, el desafío y el tiempo real de pitch; adaptar el guion a la consigna asignada.

## Límites técnicos de esta entrega

No hay cuenta Blink, API key, transferencia real, pago público ni persistencia. El endpoint IA local usa `ANTHROPIC_API_KEY` o `OPENAI_API_KEY` solo en servidor; la versión estática y el modo sin claves recurren al fallback demo. Los tests mockean proveedores: no son pruebas live de Blink ni de modelos. El reporte refleja solo el ledger de la sesión, que es sintético.
