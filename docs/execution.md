# Preparación y plan de ejecución para la hackatón

Actualizado: 14/10/2026. Antes del evento, la web presenta una propuesta y un simulador conceptual; no es un contrato, escrow ni servicio de pagos. La implementación funcional se construirá durante las 48 horas de la hackatón. Ethereum Sepolia con un token ERC-20 de demostración es la arquitectura propuesta, no una integración realizada. ETH de prueba sólo cubriría gas. Las unidades del token representan una beca en el ejemplo, no USD reales: no hay cotización ni dinero actual.

## Producto propuesto

Una beca se define por materia, por ejemplo 100 unidades representativas para una materia. Una persona puede cubrir todo el compromiso o varias pueden aportar desde 1 unidad cada una. El estudiante es el beneficiario. Los pagos se desbloquean al aprobar exámenes definidos para la materia y confirmados por la institución.

Antes del primer aporte, el checklist/reglas pueden partir de un borrador generado con ayuda de IA, pero una persona lo revisa y aprueba. Después queda congelado para ese programa. No se afirma que haya una API de IA ni inferencia en vivo. El ejemplo conceptual puede dividir el compromiso en dos hitos de 50/50: el 100% del objetivo debe estar fondeado antes de activar desembolsos; si no se llega al objetivo al vencimiento, cada aportante recupera íntegramente lo que aportó.

Si hay abandono, sólo después de confirmación mediante revisión humana, los tramos no liberados se devuelven proporcionalmente a los aportantes. Lo ya ganado y liberado permanece con el estudiante. Ejemplo: contribuciones 60/40, 50 unidades liberadas y 50 restantes; se devuelven 30 y 20. La web puede explicar esta regla, pero no ejecuta reembolsos.

## Estado real y laboratorio

- **Web previa:** presentación de la propuesta, simulador conceptual y roadmap; describirla como tal tras las comprobaciones de la página principal.
- **Laboratorio ECDSA:** el prototipo local de firma WebCrypto es exploratorio y opcional; no es blockchain, escrow ni el producto de competencia. El reporte de 36 tests combinados pertenece a ese laboratorio, no prueba un contrato EVM.
- **Preparación técnica:** solc, ethers y Ganache se instalaron para preparar el evento. La preparación de herramientas no implica contrato compilado, probado o desplegado.
- **Durante las 48 horas:** construir contrato e integración de Sepolia; reportar de forma separada resultados locales, interacción en testnet y cualquier límite.

No hay clientes, evidencia de mercado o impacto medido. El modelo financiero base existente no es rentable; no se modifica para aparentar rentabilidad. MPP/yield quedan como contexto histórico/roadmap y fuera del flujo de la competencia.

## Plan de construcción — 48 horas del evento

| Tiempo | Trabajo y salida esperada |
|---|---|
| 0–2 h | Recibir consigna y confirmar reglas de código previo/IA; spike de red/contrato en Sepolia y cerrar alcance. |
| 2–10 h | Construir escrow, programa por materia, dos hitos y reglas de fondeo; pruebas del contrato. |
| 10–20 h | Integrar interfaz y roles: patrocinador/aportantes, institución y estudiante; aportes parciales desde 1 unidad. |
| 20–28 h | Implementar liberación por examen aprobado, rechazo de replay y reembolso por underfunded; probar caso de abandono confirmado y reparto proporcional. |
| 28–32 h | Integrar recorrido completo, verificar en testnet si es posible y congelar funciones. |
| 32–40 h | Preparar pitch, Q&A, ensayo, y distinguir claramente simulador local, Ganache y Sepolia. |
| 40–48 h | Margen para fallos, entrega y contingencia; no sumar funciones sin necesidad. |

Roles sugeridos para un equipo de 4–5: producto y consigna; contrato; interfaz/wallet; pruebas e integración; quinta persona opcional para QA, guion y operación. Asignar nombres cuando el equipo esté confirmado. El predio cierra a las 19:30 del día 1: prever salida, regreso y comidas.

## Bases oficiales conocidas

Consulta pública registrada el 14/10/2026: inscripción cierra el 16/10 o al agotarse cupo; evento 30–31/10 en Costa Salguero; equipos de 4–5; demo funcional obligatoria; pitch de 60 segundos más preguntas de 60 segundos. Consigna exacta y criterios no definidos aún en el documento consultado; no hay ponderaciones conocidas. Permiso de código previo y uso de IA sin especificar: confirmar con la organización. Fuentes: [LABITCONF](https://www.labitconf.com/mas/hackathon) y [bases consultadas](hackathon/bases-publicas-2026-10-14.txt).

## Límites que deben conservarse

- No llamar USD al token de demostración ni atribuirle precio; usar “unidades representativas”.
- No describir la web o el laboratorio como contrato, escrow, transferencia real o despliegue Sepolia.
- Institución, examen y revisión son roles propuestos; ningún resultado académico se valida por código por sí solo.
- Un tramo liberado/ganado no se recupera. Reembolso de saldo restante requiere abandono confirmado por revisión humana y distribución prorrata a aportantes.
- Si la consigna asignada no encaja con Nueva Educación, adaptar la propuesta al reto real.
