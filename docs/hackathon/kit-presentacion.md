# Kit de presentación — Beca Modular

## Pitch de 60 segundos

¿Cómo dar claridad a una beca financiada por varias personas y condicionada a exámenes? Beca Modular propone becas por materia. En el ejemplo, una materia requiere 100 unidades representativas: una persona puede aportar todo o varias desde una unidad. Antes del primer aporte, una persona aprueba las reglas y el checklist, que luego quedan congelados. La institución confirma exámenes y el estudiante recibe los tramos ganados. Si no se completa el fondeo a tiempo, cada aportante recupera su aporte. Si una revisión humana confirma abandono, el saldo no liberado vuelve a prorrata; lo liberado queda con el estudiante. Hoy mostramos la propuesta y un simulador conceptual. Durante la hackatón construiremos el contrato en Sepolia con un token de demostración, sin valor ni equivalencia a dólares.

## Guion de simulador — 30 segundos

1. **0–5 s:** mostrar beca por materia con objetivo de 100 unidades representativas y dos hitos de 50.
2. **5–10 s:** mostrar el borrador de reglas/checklist; una persona lo revisa y aprueba antes del primer aporte. Aclarar que no hay IA en vivo.
3. **10–15 s:** mostrar ejemplo de un aportante cubriendo todo o varios aportes desde 1 unidad; es una simulación conceptual.
4. **15–22 s:** ilustrar examen confirmado por institución y liberación de un tramo al estudiante como flujo propuesto, no transacción realizada.
5. **22–30 s:** explicar dos cierres: fondeo incompleto al vencimiento devuelve aportes completos; abandono confirmado devuelve sólo saldo restante a prorrata. Los tramos ya liberados permanecen con el alumno.

No mostrar identificadores de transacción ficticios ni llamar USD al token. Sepolia es arquitectura y trabajo planeado para el evento, no evidencia actual.

## Preguntas difíciles del jurado

1. **¿Ya hicieron un pago en blockchain?** No. La web previa presenta la propuesta y el simulador es conceptual; la implementación funcional es trabajo de las 48 horas.
2. **¿El estudiante recibe dinero real?** No hay dinero real en la web ni en el token planeado. El token de demostración no tiene cotización ni representa USD.
3. **¿Quién recibe la beca?** El estudiante. Aportantes financian; la institución confirma exámenes; una persona aprueba reglas y revisa disputas.
4. **¿La IA decide condiciones o elegibilidad?** No. El checklist puede partir de un borrador asistido, pero una persona lo aprueba antes del primer aporte y queda congelado. No hay inferencia de IA en vivo.
5. **¿Qué pasa si no se reúne el total?** Al vencer el plazo, los aportantes recuperan íntegramente sus aportes; no se activa la beca.
6. **¿Y si el estudiante abandona?** Primero debe confirmarse mediante revisión humana. Sólo se devuelve el saldo aún no liberado, prorrateado según aporte. Los tramos ganados no se reclaman.
7. **¿Cómo funciona el prorrateo?** Con aportes 60/40 y 50 unidades ya liberadas de 100, restan 50: se devuelven 30 y 20, respectivamente.
8. **¿Por qué Sepolia?** Es la testnet propuesta para construir y demostrar el flujo. No implica contrato desplegado hoy ni valida el examen académico.
9. **¿Ya validaron demanda o impacto?** No tenemos clientes, entrevistas ni resultados de impacto que reportar; sigue siendo una hipótesis.
10. **¿Qué evidencia técnica tienen ahora?** Hay un laboratorio local ECDSA con 36 tests combinados reportados; no es contrato, blockchain ni escrow. El contrato se construirá en el evento.

## Fallback

Si el simulador falla, presentar las pantallas de propuesta y explicar el flujo como roadmap, declarando que el simulador falló. El laboratorio ECDSA local es respaldo opcional para mostrar firma y verificación; aclarar que no es blockchain ni escrow. No presentar transferencia, contrato o despliegue que no exista.

## Checklist de entrega

- [ ] Confirmar inscripción antes del 16/10/2026, elegibilidad EDU HUB y universidad acreditada.
- [ ] Confirmar equipo de 4–5; cada integrante se inscribe individualmente con el mismo nombre.
- [ ] Consultar consigna, criterios y reglas de código previo/IA; no asumir permiso.
- [ ] Verificar que la web se presenta como propuesta/simulador y que no afirma un contrato listo.
- [ ] Ensayar pitch 60 s y Q&A 60 s con unidades representativas, no USD.
- [ ] Explicar el caso de fondeo incompleto y prorrata por abandono confirmado por separado.
- [ ] Evitar datos personales, claves privadas, tx hashes o resultados académicos inventados.
- [ ] Planificar traslado y comida; el predio cierra a las 19:30 el 30/10.
