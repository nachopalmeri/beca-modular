# Beca Modular — propuesta y roadmap previos a la hackatón

Actualizado14/10/2026. Decisiones del usuario: la web existe antes del evento para explicar, iterar y ordenar el proyecto. La implementación funcional con contrato se construye durante las48h. El simulador actual es conceptual y no recibe dinero.

## Producto

Una beca por materia, con meta ilustrativa100USD. Un sponsor puede cubrir toda la meta o varios aportantes suman desde1USD. El ejemplo tiene2hitos50/50: primerexamen y aprobación de la materia. No es un arancel universitario ni un precio de mercado. La institución, el estudiante y el responsable acuerdan condiciones antes del primeraporte.

Las becas son el primer caso de una plataforma de aportes solidarios condicionados a hitos. El MVP se limita a una materia, un estudiante, una institución, dos hitos y varios aportantes; no se construye un marketplace genérico.

## Reglas elegidas

1. Reglas, destinatario, montos, plazos y devolución visibles antes de aportar; checklist de IA revisado y aprobado por una persona. Congelar condiciones al primer aporte.
2. Una persona puede financiar100%; varios pueden aportar partes. Mínimo ilustrativo1USD; si falta menos de1, se permite completar el saldo exacto. No sobrefinanciar la meta.
3. Meta completa antes de activar la beca. Si no se alcanza en el plazo acordado, devolver íntegramente los aportes.
4. Una institución autorizada confirma un examen; el futuro contrato valida autorización, importe, destinatario y que ese hito no haya pagado antes.
5. Pausa o revisión no equivale a abandono y no devuelve automáticamente. Contemplar aviso, plazo y apelación.
6. Abandono confirmado: sólo el saldo no liberado vuelve proporcionalmente a aportantes. Lo ya ganado queda estudiante. Ejemplo60+40, liberado50 => devuelve30+20. No clawback.
7. Identidad, notas, motivos y documentos fuera de cadena; mínimo registro público.

## Tecnología planificada

Sepolia, Solidity y un token ERC20 de prueba(6decimales) para representar unidades. ETH de prueba para gas. No son dólares ni activos con valor. Sepolia es recomendación oficialEthereum para desarrollo de aplicaciones. El prototipo funcional requiere wallets de prueba y desplegar/verificar contrato durante el evento.

IA: ayuda a redactar/checklist, no selecciona alumnos, califica, autoriza pagos ni infiere abandono. La web no hace llamadas a un modelo. El checklist de ejemplo está preparado con asistencia deCodex y debe ser revisado.

## Estado y evidencia

- Hoy:index.html propuesta, demo.html simulador conceptual, funding-model.mjs contabilidad local, roadmap, video conceptual, mapas externos y kit de presentación.
- Laboratorio:largo de exploraciones conservado en laboratorio.html. FirmaECDSA local con autoridad sintética en respaldo.html; MPP, rendimiento y economía son exploraciones separadas.
- Herramientas instaladas autorizadamente: solc0.8.37, ethers6.17.0, ganache7.9.2 en contracts/. No hay fuenteSolidity compilada, EVM desplegada ni contratoSepolia.
- Pendiente: desafío/rúbrica y código previo/IA, inscripción/equipo, entrevistas, piloto, operación, costos reales y necesidad de blockchain. No hay tracción ni impacto medidos.

## Prueba decisiva de48h

Crear programa2hitos; aportar desde2cuentas; aprobar checklist humano; institución confirma; transferir token test al estudiante; consultarreceipt/explorador; repetirhito y mostrarrevert; revisiónpausa y devoluciónproporcional del saldo. Una operación local no se presenta como transacciónSepolia.

## Criterios de cambio

Si banco/base de datos resuelve el proceso con menor costo, evaluar esa arquitectura. Para aportes reales pequeños, comprobar costos/gas y acceso del alumno antes de habilitar pagos. El caso financiero del laboratorio sigue no rentable con sus supuestos; no altera el capital educativo.
