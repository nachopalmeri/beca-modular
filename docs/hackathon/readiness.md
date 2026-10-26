# Preparación para la hackatón — estado al 16/10/2026

**Rechequeo de páginas públicas (16/10):** Luma mantiene el botón “Solicitar unirse” y aprobación requerida, sin mostrar fecha límite ni cupo. Eso no confirma que haya vacantes ni la aprobación de una solicitud concreta. Luma indica equipos de 4–5 y el EDU HUB general indica equipos de 4; la regla vigente requiere confirmación. Hackathon y tracks están publicados; consigna, rúbrica, jurado y agenda detallada siguen pendientes. Ver [registro de fuentes](public-status-2026-10-16.md).

Este estado distingue la presentación previa del producto funcional que se construirá durante el evento. “Listo” se limita a preparación documental/laboratorio y requiere las comprobaciones indicadas; no afirma que haya contrato o pagos on-chain.

| Área | Estado | Evidencia / siguiente paso |
|---|---|---|
| Fechas y sede | Confirmadas en páginas oficiales actuales | 30–31/10/2026, Costa Salguero. LABITCONF anuncia una competencia de 48 horas, cuatro tracks y demo funcional. |
| Horario de jornada y pitch | Detalle de bases guardadas el 14/10; no reconfirmado al 16/10 | Esa copia indica cierre del predio a las 19:30 el día 1 y pitch de 1 minuto + 1 minuto de preguntas. Las fichas oficiales actuales no muestran esos horarios; el documento enlazado de bases requiere JavaScript y no se pudo confirmar que su versión actual coincida con la copia local. |
| Inscripción y elegibilidad | Solicitud sujeta a aprobación; cupo/fecha de cierre desconocidos | Al 16/10 Luma todavía muestra “Request to Join”; requiere membresía EDU HUB y universidad acreditada. La ficha no publica fecha de cierre ni confirma cupos. La copia oficial guardada el 14/10 decía 16/10 o agotamiento de cupo, por lo que no se puede confirmar si el plazo cambió o si queda lugar. |
| Equipo | Discrepancia pública entre páginas | Luma y la copia de bases dicen 4–5; la página general de EDU Hub dice equipos de 4. Ambas permiten registrarse sin equipo para asignación el día 1 según Luma/bases. Confirmar el tamaño vigente antes de formar el equipo. |
| Track y desafío | Cuatro tracks confirmados; desafío específico pendiente | Impacto y Comunidad, Nueva Educación, Inclusión Financiera y Creator Economy. Luma indica que cada equipo trabaja sobre un desafío específico; pedir la consigna y los criterios vigentes. Confirmar permisos de código previo e IA. |
| Bootcamp previo | Cantidad discrepante; agenda pendiente | La página de hackathon anuncia cuatro encuentros en octubre; la sección EDU HUB describe tres conversaciones. Confirmar agenda, asistencia y materiales vigentes. |
| Premios | Anunciados por organizadores; fuera del alcance del producto | LABITCONF anuncia USD 1.500 en premios; Luma detalla USD 1.000 para el primer puesto y USD 500 para el segundo. No incluirlos como señal de validación de Beca Modular. |
| Web y simulador conceptual | Verificados en local | La demo corta está en `../../demo.html`; configuración, recibo y saldos se probaron en fuente y `dist/`. Sin pagos reales; evidencia completa en `../qa.md`. |
| Laboratorio ECDSA | Experimento local separado | 16 tests del laboratorio de firma. No sumarlos a otras suites ni presentarlos como blockchain, contrato o escrow. |
| Contrato y Sepolia | Pendiente; construcción durante evento | No implementar/presentar como terminado antes del evento. Arquitectura propuesta: Sepolia + ERC-20 de demo; ETH de prueba sólo para gas. Sin cotización/USD real. |
| Checklist asistido | Pendiente de experiencia final | Borrador puede apoyarse en IA, pero persona revisa/aprueba antes del primer aporte; luego reglas congeladas. No hay IA en vivo. |
| Fondeo insuficiente | Pendiente de contrato/evento | Si el objetivo total no se alcanza al deadline, devolver el aporte completo a cada aportante; no activar la beca. |
| Abandono y saldo restante | Regla de producto acordada; falta construir | Sólo tras abandono confirmado por revisión humana: saldo aún no liberado se devuelve prorrata. Aportes 60/40, liberado 50/100 ⇒ reembolsos 30/20. Lo liberado queda al estudiante. |
| Mercado, impacto y economía | Pendiente | Sin entrevistas/clientes/resultados medidos. El modelo base sigue no rentable y sin validar. |
| MPP/yield | Fuera del núcleo | Investigación histórica/roadmap, no parte del pitch funcional. |

## Siguiente prioridad

**Al 16/10:** Luma sigue mostrando “Request to Join”, sujeto a aprobación. Eso no confirma cupo ni que la inscripción continúe abierta: la copia de bases del 14/10 marca cierre el 16/10 o al agotar cupo, y la ficha vigente no publica el plazo. Estado individual de aprobación, desafío, criterios y permiso de código/IA siguen pendientes de confirmar. La página de EDU Hub también contradice a Luma/bases sobre si el equipo es de 4 o de 4–5. No se enviaron formularios ni mensajes. En las 48 horas, adaptar el prototipo al desafío real antes de decidir tecnología.

Fuentes revisadas el 16/10/2026: [evento oficial LABITCONF](https://www.labitconf.com/mas/hackathon), [inscripción, elegibilidad, equipos, tracks y premios en Luma](https://luma.com/cwhw1uls?locale=es), [página general de EDU Hub](https://www.labitconf.com/mas/edu-hub) y [bases enlazadas por LABITCONF](https://docs.google.com/document/d/1h6GlcaLcnSlQdjanoidrk7rA0T6Q1Jwe1ttdXHUoUvk/edit?tab=t.0). El documento de Google requiere JavaScript; no se confirmó su última edición. Los detalles de cierre, horario y pitch siguen atribuidos a la [copia local consultada el 14/10](bases-publicas-2026-10-14.txt), no a una relectura actual de las bases. Ver el [informe de fuentes y decisiones del 16/10](public-status-2026-10-16.md).

## Ruta priorizada hasta el evento — revisión 16/10

**16/10 — estado de inscripción:** Luma aún muestra “Request to Join”, pero no informa plazo ni cupo y cada solicitud requiere aprobación. La copia del 14/10 decía cierre el 16/10 o al agotar cupo. No inferir de la ficha que sigue abierto ni que haya disponibilidad. Confirmar el estado de aprobación de cada integrante y conseguir la versión vigente de las bases. Aclarar también la diferencia 4 vs. 4–5 integrantes y permisos de código previo/IA.

**16–23/10 — probar la necesidad:** conseguir 3 conversaciones breves (sponsor, área académica, estudiante) si hay acceso; usar la [guía de preguntas y ficha anónima](problem-validation-guide.md), registrar sólo temas y no recolectar datos personales. Validar si el problema prioritario es pago por materia, continuidad del apoyo, o rendición transparente. Si no se consiguen entrevistas, decirlo y mantener esas hipótesis abiertas. Acordar un caso de uso y una regla verificable para el pitch.

**24–27/10 — reducir alcance:** convertir la regla en una máquina de estados y una tabla de invariantes; dibujar quién propone, revisa y confirma una constancia; decidir quién puede apelar y cómo se pausa. Hacer un spike en testnet sólo si el desafío permite código previo y alguien puede verificar RPC, wallet de prueba, faucet, compilación y transacción de extremo a extremo. Si falla o el caso no requiere blockchain, mantener la demo local y nombrarla simulación.

**28–29/10 — preflight:** congelar una demo de menos de 30 segundos, tener seed sintético reproducible, preparación sin internet si hace falta, guion de 60 segundos sujeto a confirmar en bases, respaldo en video/capturas, ensayar preguntas sobre autoridad académica, custodia, fondos no liberados, replay y reembolso. Preparar roles sólo después de confirmar integrantes.

**30–31/10 — las 48 horas:** primero leer consigna y rúbrica; confirmar con mentores que el problema/tratamiento encaja. Probar una integración mínima y sus límites antes de construir el resto. Priorizar presupuesto, aportes, autorización del hito, recibo y saldo. Reservar tiempo explícito para QA, demo offline y pitch. No añadir IA/Web3 si no resuelve una necesidad del reto.

La fecha/sede, cuatro tracks, demo funcional, mentoría y bootcamp se verificaron en [la página oficial del evento](https://www.labitconf.com/mas/hackathon); inscripción, elegibilidad, equipo, tracks y premios en [Luma](https://luma.com/cwhw1uls). Reconfirmar estado de cupo, plazo, reglas, agenda del bootcamp, cierre del día 1, formato de pitch, criterios y desafío específico directamente con la organización; las bases pueden cambiar.
