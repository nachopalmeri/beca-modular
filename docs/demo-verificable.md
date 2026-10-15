> Experimento de laboratorio anterior al alcance final. No es el contrato Sepolia; la propuesta actual y el plan de48h están en product-strategy.md y architecture.md.

# Demo verificable — alcance técnico

14/10/2026. Entrada: [laboratorio de firma local](../respaldo.html). Motor compartido con la landing: scholarship.mjs y scholarship-ui.mjs.

## Implementado

- WebCrypto genera una pareja ECDSA P-256. La clave privada no se exporta; la pública identifica una autoridad sintética sólo para esa sesión.
- La atestación versionada firma programa, alumno sintético, número de hito, importe en centavos, nonce, emisión y vencimiento. Codificación JSON canónica y SHA-256.
- releaseScholarship usa la clave pública fijada por la sesión, comprueba firma, destinatario, importe configurado, vigencia de dos minutos, secuencia y uso único. Devuelve nuevo estado inmutable sólo si pasa todo.
- 10000 centavos simulados = 100 USD, cinco tramos de 2000. Pagado + reservado + reasignado = total. Pausa bloquea pagos futuros.
- Descargar JSON exporta una atestación pública y un resumen contable local. verify-receipt.mjs exige una huella de confianza explícita y verifica firma; la contabilidad adjunta no está firmada y no prueba un pago.

## Límites

La firma identifica una clave, no una institución real ni una calificación verdadera. La misma aplicación genera y usa la clave de prueba; no hay separación de roles real, backend, concurrencia distribuida, persistencia o control de acceso productivo. Una persona puede modificar código/estado en su navegador. Recargar o reiniciar elimina la sesión y rota la clave. Esta demo no garantiza seguridad financiera ni custodia.

El verificador independiente valida una firma histórica; la función de liberación aplica vigencia para una nueva autorización. La huella debe obtenerse de una autoridad conocida por otro canal; confiar en la huella del propio archivo recibido no autentica al emisor.

MPP, IA, yield, mapas y métricas financieras no participan en esta prueba. El contrato en devnet es trabajo pendiente que requiere el desafío real, herramientas y un spike reproducible.

## Casos cubiertos

Tests Node: firma válida, replay, modificación de importe, firmante no autorizado, destino/programa incorrecto aun con firma válida, tramo distinto, vencimiento/futuro, secuencia salteada, pausa/reasignación, agotamiento, formato inválido, configuración monetaria inválida, autoridad sustituida en comprobante y recibo adulterado.

    node --test tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs

Pruebas de la demo son locales. No se reportan entrevistas, notas, pagos, instituciones ni clientes reales.
