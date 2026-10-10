# Beca Modular — reserva, rendimiento y distribución
Actualizado e inspeccionado: 10/10/2026. Propuesta de producto; no una inversión operativa ni recomendación personal.

## Decisión de alcance
La beca por hitos paga al estudiante. La tesorería es opcional y no debe ser requisito para cumplir pagos. Por defecto, sin inversión en el primer MVP. Aave es un candidato para probar integración, no un ganador financiero seleccionado. Sky/Spark y Morpho requieren evaluar productos concretos. Activos tokenizados y aportes de creator fees son líneas diferentes, no componentes intercambiables.

## Alternativas y evidencia primaria
- Reserva líquida: decisión de diseño sin tasa. No elimina riesgos de custodia, red, stablecoin ni inflación.
- [Aave — Supply Tokens](https://aave.com/help/supplying/supply-tokens): intereses variables del mercado de préstamos. [FAQ](https://aave.com/faq): riesgos y retiro sujeto a liquidez. No se consultó un mercado/tasa en vivo ni se depositó.
- [Sky — User Risks](https://docs.sky.money/legal/skybase-international/user-risks): tasas y capital no garantizados. [Spark Savings](https://docs.spark.finance/products/spark-savings): productos con fuentes/operadores distintos; [integración](https://docs.spark.finance/integrators/spark-vaults-v2) documenta operaciones y solicitudes de retiros grandes. No hay adapter nuestro implementado.
- [Morpho — Yield & Fees](https://docs.morpho.org/developers/earn/concepts/yield-fees/): fuentes, gestión y desempeño. [Risks](https://docs.morpho.org/learn/resources/risks/): liquidez, deuda, oráculos, roles de vault. No seleccionamos vault ni inspeccionamos código para integrarlo en esta revisión.
- [Robinhood Classic Stock Tokens](https://robinhood.com/eu/en/support/articles/about-stock-tokens/): derivados sin propiedad del subyacente; no se asume disponibilidad para instituciones argentinas, permiso de emisión o API externa. No son reemplazo de una reserva líquida.
- [Pump creator fee sharing](https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md): reparto a direcciones configuradas, ejemplos TS/Rust. Fuente: trading, no rendimiento del presupuesto. Revisión documental, no verificación onchain ni licencia de SDK. Donaciones efectivamente recibidas únicamente.
- $SI: identidad/contrato desconocidos. No se verificó titularidad de acciones, pagos ni sostenibilidad; no figura como integración recomendada.

## Mejorar rendimiento neto, sin inventar garantías
1. Usar calendario de desembolsos, misma moneda y una reserva para compromisos próximos; porcentajes del simulador no son recomendación.
2. Comparar rendimiento sin recompensas promocionales y neto de gestión, desempeño, gas, conversiones, slippage y operación. No publicar APY de marketing como tasa propia.
3. Un solo activo y red reduce complejidad de puentes; agrupar operaciones puede reducir costo, con cuentas por programa y restricciones por financiador.
4. Lista de estrategias autorizadas, límite por exposición, revisión humana y salida de emergencia. No rotación autónoma por IA, deuda, apalancamiento, LP volátil ni promesas de principal garantizado.
5. No mezclar cuentas del donante, programas y plataforma. No atribuir el rendimiento a ingresos de plataforma además de distribuirlo.

## Opciones para la persona
- Beca normal sin exposición a rendimiento.
- Bono al estudiante: 100% del resultado positivo neto conciliado; separado del tramo principal.
- Fondo solidario: 100% a nuevas becas.
- Compartido: proporción acordada (ejemplo 50/50).
- Acceso a contenido financiado es un presupuesto adicional, no un segundo cobro del mismo hito.
Las reglas se aceptan al ingresar; no habilitamos al estudiante a invertir fondos ajenos. Reasignación requiere revisión, plazo y apelación; no recuperar pagos ya realizados. Si hay pérdida, el contrato no crea dinero: exigir política de cobertura/reducción y consentimiento; nunca una deuda automática del alumno. Una donación no se convierte silenciosamente en inversión con retorno al donante.

## Arquitectura propuesta
Financiador → escrow del programa → reserva líquida + adapter autorizado → posición del protocolo. Un evaluador autorizado certifica el hito; escrow retira lo necesario (si hay liquidez) y transfiere al alumno. Registrar capital, resultado realizado, pagos y comisiones en cuentas separadas. Liquidación final con resultado positivo distribuible solo tras obligaciones y costos.
Autorización y activos del escrow no pueden quedar en una wallet discrecional de frontend. Eventos idempotentes, roles separados, límites de aprobaciones, retiro a destinos permitidos y pausa. Auditar reentrancia/redondeos/share accounting antes de fondos reales.
Aave/Morpho/Spark EVM no son un plugin directo de Solana MPP. Elegir red y arquitectura académica primero; canales MPP son un flujo diferente de contenido. No hay bridge propuesto para la hackathon.

## Simulador: fórmulas y límites
Supuestos editables; sin datos de mercado ni rendimiento real. Capital P, meses n, reserva r%, tasa nominal anual t%, costo C, pérdida de estrés l%.
Exposición inicial E=P×(1-r/100). Al inicio del mes m: E×(1-(m-1)/n). Interés mensual = exposición inicial del mes × t/100/12. Desembolsos iguales al final de cada mes; reserva y exposición se consumen proporcionalmente; intereses no se capitalizan. Neto = suma de intereses − C − E×l/100.
Solo max(neto,0) se distribuye. Neto negativo es déficit, no rendimiento cero oculto. Estrés es un ajuste final al resultado total del escenario: no prueba que pagos intermedios puedan ocurrir, no modela insolvencia ni orden temporal del shock. Costos son un agregado manual, no una cotización.
Default P=1000, n=12, reserva30%, tasa4%, costo5, pérdida0: exposición700, interés15.1667, neto10.1667. Con pérdida5%: pérdida35, neto−24.8333. Un 4% sobre 1000 todo el año sin retiros daría40 brutos, pero no corresponde a una beca desembolsada progresivamente.

## Spike máximo de 2 horas (propuesto, no ejecutado)
0–20 min: escoger contrato, red de prueba o fork local, activo, versión y reglas; consultar disponibilidad. 20–50: depósito desde escrow/adapter de prueba, registrar shares o saldo. 50–90: hito autorizado, retiro parcial y pago al alumno; rechazar actor no autorizado y repetición. 90–120: cierre, fallo de retiro y conciliación capital/resultado/costo.
PASS: depósito y retiro reproducibles, destino autorizado, sin doble pago, cuentas conservadas, error explícito cuando falta liquidez. FAIL: requiere puente, permisos inexistentes, retiro no comprobable o dinero del programa controlado discrecionalmente por un agente. Si no pasa, MVP sin rendimiento. No simular avance temporal local como interés real de mainnet.

## Hipótesis de negocio e impacto
Institución paga licencia/operación fuera de capital y rendimiento educativos. El rendimiento podría ampliar apoyo pero no demuestra continuidad ni egreso. Validar autorización de inversión con un sponsor, uso del bono con estudiantes, costos, alternativas bancarias y cumplimiento. Mayor rendimiento no equivale a mayor impacto: pagos puntuales y preservación de capacidad de apoyo importan más que una tasa de portada.
