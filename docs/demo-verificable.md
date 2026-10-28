> Experimento de laboratorio anterior al alcance final. No es el contrato Sepolia; la propuesta actual y el plan de48h están en product-strategy.md y architecture.md.

# Demo verificable — alcance técnico

14/10/2026. Entrada: [laboratorio de firma local](../respaldo.html). Motor compartido con la landing: scholarship.mjs y scholarship-ui.mjs.

## Implementado

- WebCrypto genera una pareja ECDSA P-256. La clave privada no se exporta; la pública identifica una autoridad sintética sólo para esa sesión.
- La atestación versionada firma programa, alumno sintético, número de hito, importe en centavos, nonce, emisión y vencimiento. Codificación JSON canónica y SHA-256.
- releaseScholarship usa la clave pública fijada por la sesión, comprueba firma, destinatario, importe configurado, vigencia de dos minutos, secuencia y uso único. Devuelve nuevo estado inmutable sólo si pasa todo.
- 10000 centavos simulados = 100 USD, cinco cuotas de 2000. Pagado + reservado + reasignado = total. Pausa bloquea pagos futuros.
- Descargar JSON exporta una atestación pública y un resumen contable local. verify-receipt.mjs exige una huella de confianza explícita y verifica firma; la contabilidad adjunta no está firmada y no prueba un pago.

## Límites

La firma identifica una clave, no una institución real ni una calificación verdadera. La misma aplicación genera y usa la clave de prueba; no hay separación de roles real, backend, concurrencia distribuida, persistencia o control de acceso productivo. Una persona puede modificar código/estado en su navegador. Recargar o reiniciar elimina la sesión y rota la clave. Esta demo no garantiza seguridad financiera ni custodia.

El verificador independiente valida una firma histórica; la función de liberación aplica vigencia para una nueva autorización. La huella debe obtenerse de una autoridad conocida por otro canal; confiar en la huella del propio archivo recibido no autentica al emisor.

MPP, IA, yield, mapas y métricas financieras no participan en esta prueba. El contrato en devnet es trabajo pendiente que requiere el desafío real, herramientas y un spike reproducible.

## Casos cubiertos

Tests Node: firma válida, replay, modificación de importe, firmante no autorizado, destino/programa incorrecto aun con firma válida, cuota distinta, vencimiento/futuro, secuencia salteada, pausa/reasignación, agotamiento, formato inválido, configuración monetaria inválida, autoridad sustituida en comprobante y recibo adulterado.

    node --test tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs

Pruebas de la demo son locales. No se reportan entrevistas, notas, pagos, instituciones ni clientes reales.

## Demo de presupuesto y comprobantes — 15/10/2026

La entrada principal para mostrar la propuesta ahora es [`../demo.html`](../demo.html), con [`../funding-model.mjs`](../funding-model.mjs) y [`../roadmap.mjs`](../roadmap.mjs). Es un segundo simulador, separado del laboratorio ECDSA descrito arriba.

- El sponsor de prueba configura módulo, presupuesto y dos hitos. Los importes deben sumar exactamente el presupuesto; al registrar aportes, la configuración queda congelada.
- Después del primer aporte, la edición de reglas y los presets de inicio quedan deshabilitados. Sólo “Reiniciar ejemplo” empieza otro escenario; así el atajo no borra recibos ni saldos por accidente.
- Para completar el recorrido, este escenario asigna el módulo configurado al estudiante sintético alumno-demo-01. No implementa catálogo/elección, matching, validación de elegibilidad ni integración institucional.
- Un avance informado o contenido consultado se registra sin liberar dinero. Sólo `institution-test`, una constancia sintética, habilita la próxima cuota configurada.
- Cada evento genera un ID local. Repetirlo se rechaza. El comprobante muestra monto del evento, total liberado y saldo reservado; los centavos se calculan con enteros.
- La demo permanece en memoria: el nombre de estudiante, la constancia y los aportes son ficticios. No prueba una nota, no autentica una institución y no paga fondos.

Casos específicos: `node --test tests/funding.test.mjs`. Evidencia de navegador y capturas, si están disponibles, se registra en [`qa.md`](qa.md); este apartado no convierte el simulador en integración blockchain.
