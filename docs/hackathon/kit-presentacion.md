# Kit de presentación — Beca Modular

## Pitch de 60 segundos — versión previa a consigna

Una beca puede financiarse por etapas, pero al estudiante y a quien la sostiene les cuesta ver qué regla habilita cada tramo y cuánto queda disponible. Beca Modular propone organizar el apoyo por módulo: presupuesto máximo visible, hitos definidos por personas y un registro entendible de cada avance. En la demo local, dos aportes ficticios completan un presupuesto de 100 dólares de ejemplo. Una constancia institucional sintética libera 50; el recibo deja otros 50 reservados. Si reintentamos el mismo comprobante, se rechaza y el saldo no cambia. Consultar contenido o informar progreso no libera fondos ni demuestra aprendizaje. Esto es una simulación: no verifica notas, no conecta una institución ni mueve dinero. En la hackatón adaptaremos la idea al desafío asignado y construiremos una demo funcional acorde con las reglas del evento.

Este pitch es una hipótesis de producto previa al track/desafío específico. Reescribirlo después de recibir el brief, sin presentar la simulación como integración terminada.

## Guion de demo local — menos de 30 segundos

1. **0–5 s:** abrir `demo.html`; señalar el módulo asignado al estudiante sintético, el presupuesto máximo y las dos reglas.
2. **5–10 s:** pulsar **Dos aportes · 60% + 40%**. El simulador completa el presupuesto ficticio sin cobrar.
3. **10–18 s:** dejar **Constancia institucional de prueba** seleccionada y pulsar **Registrar avance o constancia**. Mostrar 50 USD liberados y 50 USD reservados.
4. **18–25 s:** mostrar ID, concepto y saldo del comprobante. Pulsar **Reintentar el último comprobante**: el duplicado se rechaza y el balance queda igual.
5. **25–30 s:** cerrar con la aclaración visible: es una simulación en memoria, no una nota verificada ni un pago.

La elección de módulo/reglas también puede recorrerse editando el presupuesto y los dos importes para mostrar que deben sumar exactamente el límite. No afirmar que la constancia sintética representa una verificación real.

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
10. **¿Qué evidencia técnica tienen ahora?** El motor local tiene reglas de presupuesto, hitos, límites, repetición y saldo cubiertas por tests; la UI se probó en Chrome en móvil, tablet y escritorio. Hay además un laboratorio local ECDSA separado. Ninguna de esas pruebas demuestra contrato, institución ni pago on-chain.

## Fallback

Si la demo local falla, abrir capturas/video guardados y explicar el problema; decir claramente que la interacción no estuvo disponible. El laboratorio ECDSA sólo sirve si el desafío requiere hablar de firmas y siempre se presenta como experimento local independiente. No presentar transferencia, contrato o despliegue que no exista.

## Checklist de entrega

- [ ] Confirmar con la organización el estado de inscripción, cupo y plazo: al 16/10 Luma sigue mostrando “Request to Join” con aprobación, pero no publica deadline ni cupos. La copia de bases del 14/10 dice cierre el 16/10 o al agotar cupo; esto no confirma que siga abierto.
- [ ] Confirmar tamaño de equipo: Luma y la copia de bases dicen 4–5; la página general de EDU HUB dice 4. Cada integrante debe inscribirse individualmente con el mismo nombre, según Luma.
- [ ] Confirmar track, desafío, criterios actuales, reglas de código previo/IA y agenda del bootcamp. La página de hackathon anuncia cuatro encuentros en octubre; la página EDU HUB describe tres conversaciones.
- [ ] Verificar que la web se presenta como simulación local y no afirma un contrato listo.
- [ ] Ensayar pitch de 1 minuto + Q&A de 1 minuto sólo como hipótesis tomada de la copia de bases del 14/10; reconfirmar formato vigente y reescribir el pitch cuando se conozca el desafío.
- [ ] Explicar el caso de fondeo incompleto y prorrata por abandono confirmado por separado.
- [ ] Evitar datos personales, claves privadas, tx hashes o resultados académicos inventados.
- [ ] Planificar traslado y comida; la copia de bases del 14/10 indica cierre del predio a las 19:30 el 30/10. Confirmar el horario vigente.

## Fuentes y vigencia

Revisión de fuentes públicas 16/10/2026: [Luma](https://luma.com/cwhw1uls?locale=es) requiere aprobación y elegibilidad EDU HUB/universidad acreditada; no muestra cierre ni cupos. La [página de hackathon de LABITCONF](https://www.labitconf.com/mas/hackathon) anuncia 30–31/10, solución funcional en 48 horas, cuatro tracks y cuatro encuentros de bootcamp en octubre. La [página general de EDU HUB](https://www.labitconf.com/mas/edu-hub) dice equipos de 4, frente a 4–5 en Luma/bases, y describe tres conversaciones de bootcamp. La copia local de las bases consultada el 14/10 menciona cierre el 16/10 o al agotar cupo, predio hasta 19:30 y pitch + Q&A de 1 minuto cada uno; esos detalles no se confirmaron en las páginas actuales. Consultar el [informe de estado y fuentes del 16/10](public-status-2026-10-16.md). El guion no sustituye la consigna específica.
