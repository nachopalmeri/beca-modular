# Preparación y plan de ejecución para la hackatón

Actualizado: 16/10/2026. Antes del evento, la web presenta una propuesta y una simulación local; no es un contrato, escrow ni servicio de pagos. El equipo tiene dos jornadas de hackatón y debe salir del predio al cierre del día 1, según la copia de bases guardada el 14/10; el horario aún requiere confirmación actual. Sepolia y un token de prueba son opciones de arquitectura, no compromisos ni integraciones realizadas: primero se confirma el desafío y si blockchain resuelve algo necesario. ETH de prueba sólo cubriría gas; el token no representa USD reales.

## Producto propuesto

Una beca se define por materia, por ejemplo 100 unidades representativas para una materia. Una persona puede cubrir todo el compromiso o varias pueden aportar desde 1 unidad cada una. El estudiante es el beneficiario. Los pagos se desbloquean al aprobar exámenes definidos para la materia y confirmados por la institución.

Antes del primer aporte, el checklist/reglas pueden partir de un borrador generado con ayuda de IA, pero una persona lo revisa y aprueba. Después queda congelado para ese programa. No se afirma que haya una API de IA ni inferencia en vivo. El ejemplo conceptual puede dividir el compromiso en dos hitos de 50/50: el 100% del objetivo debe estar fondeado antes de activar desembolsos; si no se llega al objetivo al vencimiento, cada aportante recupera íntegramente lo que aportó.

Si hay abandono, sólo después de confirmación mediante revisión humana, las cuotas no liberadas se devuelven proporcionalmente a los aportantes. Lo ya ganado y liberado permanece con el estudiante. Ejemplo: contribuciones 60/40, 50 unidades liberadas y 50 restantes; se devuelven 30 y 20. La web puede explicar esta regla, pero no ejecuta reembolsos.

## Estado real y laboratorio

- **Web previa:** landing, resumen de resultado y demo local configurable en `demo.html`; el simulador sólo cambia estado en memoria y no realiza pagos.
- **Laboratorio ECDSA:** el prototipo local de firma WebCrypto es exploratorio y opcional; no es blockchain, escrow ni el producto de competencia. El reporte de 36 tests combinados pertenece a ese laboratorio, no prueba un contrato EVM.
- **Preparación técnica:** solc, ethers y Ganache se instalaron para preparar el evento. La preparación de herramientas no implica contrato compilado, probado o desplegado.
- **Durante el evento:** construir una demo funcional que responda al track y al desafío anunciado. Si hace falta blockchain y está permitido, considerar una integración sólo en testnet; informar por separado qué se probó localmente y qué llegó a funcionar en testnet.

No hay clientes, evidencia de mercado o impacto medido. El modelo financiero base existente no es rentable; no se modifica para aparentar rentabilidad. MPP/yield quedan como contexto histórico/roadmap y fuera del flujo de la competencia.

## Plan de construcción — dos jornadas del evento

| Hito | Trabajo y salida esperada |
|---|---|
| Inicio del día 1 | Leer desafío y criterios, confirmar permiso de código previo/IA y elegir track. No asumir que la propuesta actual coincide. |
| Primera parte del día 1 | Convertir el problema en un recorrido de usuario y una regla crítica; acordar demo mínima, responsable y criterio de aceptación. |
| Desarrollo del día 1 | Construir una sola vertical slice; probar estados inválidos y el caso de éxito. Hacer un spike testnet sólo si el reto lo requiere y está permitido. |
| Antes del cierre del predio (19:30) | Congelar una versión ejecutable, respaldar código/datos sintéticos, anotar bloqueos y definir tareas del día 2. Cada participante se retira; no planificar continuidad presencial durante la noche. |
| Inicio del día 2 | Volver al predio con tiempo antes de la entrega; comprobar que el repo y la demo arrancan desde un estado reproducible. |
| Cierre del día 2 | Priorizar test de extremo a extremo, contingencia offline, demo funcional y pitch de 1 minuto más Q&A de 1 minuto. No sumar funciones al final. |

Roles a repartir cuando el equipo esté confirmado (4–5 personas): desafío/producto; interfaz; estado/reglas; pruebas e integración; quinta persona opcional para QA, guion y operación. Si el desafío justifica testnet, asignar ahí una persona con experiencia. Planificar comida y traslados: el predio cierra a las 19:30 del día 1 y la demo se entrega presencialmente el día 2.

## Bases oficiales conocidas

Consulta pública 14–15/10/2026: inscripción cierra el 16/10 o antes si se agota el cupo; aprobación pendiente en Luma; participación reservada a miembros EDU HUB con universidad acreditada; equipos de 4–5 y posibilidad de anotarse individualmente para asignación el día 1. Evento 30–31/10 en Costa Salguero; demo funcional, pitch 1 minuto y preguntas 1 minuto. El track elegido tiene un desafío específico comunicado antes del evento. Las bases consultadas dicen que criterios/jurado siguen en definición; validar vigencia, permiso de código/IA y agenda del bootcamp. Fuentes: [LABITCONF](https://www.labitconf.com/mas/hackathon), [inscripción EDU HUB en Luma](https://luma.com/cwhw1uls) y [copia consultada de las bases](hackathon/bases-publicas-2026-10-14.txt).

**Revisión de fuentes públicas — 16/10/2026:** Luma todavía muestra “Request to Join” con aprobación, pero no publica fecha de cierre ni cupos; no se puede inferir que siga abierta o que haya lugar. La página general de EDU Hub dice equipos de 4, frente a 4–5 en Luma y la copia de bases. El documento de bases enlazado por LABITCONF requiere JavaScript y no se pudo contrastar su última revisión. Desafío, criterios actuales, jurado y horario de pitch continúan sin verificar. Ver [readiness actualizada](hackathon/readiness.md) y [registro de evidencia](evidence-register.md).

## Límites que deben conservarse

- No llamar USD al token de demostración ni atribuirle precio; usar “unidades representativas”.
- No describir la web o el laboratorio como contrato, escrow, transferencia real o despliegue Sepolia.
- Institución, examen y revisión son roles propuestos; ningún resultado académico se valida por código por sí solo.
- Una cuota liberada/obtenida no se recupera. Reembolso de saldo restante requiere abandono confirmado por revisión humana y distribución prorrata a aportantes.
- Si la consigna asignada no encaja con Nueva Educación o con el caso de becas, adaptar o abandonar el concepto actual para resolver el reto real.
