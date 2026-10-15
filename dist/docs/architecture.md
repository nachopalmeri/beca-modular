# Arquitectura propuesta — becas por materia en Sepolia

14/10/2026. Diseño para implementar durante la hackatón. No existe contrato desplegado; la web actual sólo simula contabilidad.

## Actores

- Responsable/sponsor: define materia, estudiante, institución, meta,2importes, plazo y reglas. Puede cubrir todo o abrir aportes compartidos.
- Aportantes: contribuyen hasta la meta, desde1unidad de ejemplo. La aportación queda ligada al programa para calcular devolución.
- Revisor humano: aprueba el checklist antes de primeraporte y resuelve pausas/abandono bajo reglas públicas.
- Institución: confirma hitos académicos; su autorización es condición, no verdad criptográfica sobre una nota.
- Estudiante: recibe tokens test por hitos y puede pedir revisión; no devuelve automáticamente tramos ganados.

## Cadena y activo

Ethereum Sepolia, chainID11155111. TokenERC20DEMO6decimales sin valor: 100unidades de ejemplo y2tramos de50. ETHtest para gas. Sin oracle deprecio, rendimiento, tokenespeculativo ni puente. Wallets y datos sintéticos.

## Estado de un programa

Borrador -> reglas aprobadas -> campaña abierta -> financiada -> activa -> completada. Revisión pausa nuevos pagos. Abandono confirmado cancela sólo hitos futuros y habilita retiros proporcionales. Campaña vencida sin meta => devolución completa. No inferir abandono por silencio ni aplazo.

Cada programa guarda: responsables/autoridades, destinatario, token, meta, hitos/importes, plazos, hash de reglas aprobadas, aportes, pagado/reservado, hitos reclamados y estado. Nunca publicar notas, DNI, documentos o motivos personales.

## Operaciones candidatas

- createProgram: parámetros validados, roles definidos, montos suman meta, reglas aceptadas antes del primeraporte.
- contribute: programa/activo correctos, campaña abierta, monto positivo, mínimo/regla de saldo final y cap. Registrar por aportante sin mezclarprogramas.
- approveChecklist: responsable humano, versión fijada antes de recibir fondos.
- confirmMilestone: sólo institución autorizada, hito configurado y no consumido; guardar confirmación.
- releaseMilestone: financiado/activo, confirmación válida, destino/importe fijos, no replay; efectos antes de interacción y protección contra reentrancia.
- requestReview/resolveReview: pausa explícita y resolución autorizada. No equivale a verificar que hubo proceso humano justo; eso requiere operación offchain.
- claimRefund: cuota de saldo no liberado por aportante; impedirdoble retiro, no iterar sobre todos losdonantes en una sola tx.

## Invariantes y pruebas del contrato futuro

1. Aportes contabilizados = pagado al alumno + reservado + devoluciones. Fondos aislados porprograma.
2. No pagar antes de metacompleta, sin checklist aprobado, sin institución, en pausa, con monto/destino cambiado o hito ya pagado.
3. No recuperar pagos anteriores ni reasignar unilateralmente fondos comprometidos.
4. Devolución proporcional exacta, con regla de redondeo documentada a unidad mínima deltoken y protección contra claims repetidos.
5. Probarreentrancia, token malicioso/revertido, permisos, orden, montos, cap, liveness, expiración de campaña y recuperación bajo revisión.
6. Web no marca pagado hasta receipt exitoso en redcorrecta. Guardar chainID,address,hash,y balances deltoken.

## Web previa

funding-model.mjs usa centavos enteros y mayorresto para devoluciones delsimulador. roadmap.mjs muestra esa lógica como ejemplo. No verifica instituciones, fechasreales, firmas o pagos.

El laboratorioECDSA previa es otra prueba local y no se reutiliza como autorización Ethereum: P-256 deWebCrypto no equivale a la firma Ethereum de una wallet. No presenta una integración onchain.

Fuentes primarias: [Ethereum networks](https://ethereum.org/developers/docs/networks/), [Solidity security](https://docs.soliditylang.org/en/latest/security-considerations.html), [OpenZeppelin contracts](https://docs.openzeppelin.com/contracts/5.x/).
