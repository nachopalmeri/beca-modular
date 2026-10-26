# 06 — Portafolio de ideas (10)

Fecha: 2026-10-26. Datos citados en docs 04 y 05. Cada idea responde los 16 puntos pedidos, en formato compacto.
Leyenda complejidad: B baja / M media / A alta.

---

## I-1. Beca Modular original (Sepolia)
1. **Nombre**: Beca Modular.
2. **Problema**: abandono de estudiantes de bajos ingresos; falta de reglas claras para financiar una materia.
3. **Usuario**: aportantes particulares + estudiante + institución.
4. **Datos**: decil 1: 7,9% → 1,1% (1.º→5.º año); Progresar –42% real.
5. **Solución**: contrato escrow en Sepolia, ERC-20 sin valor, 2 hitos, devoluciones prorrata.
6. **Diferenciación**: reglas de devolución finas. Prior art: DirectEd (Cardano).
7. **Por qué existir**: transparencia de fondos condicionados.
8. **Track**: Nueva Educación.
9. **Tecnología**: Ethereum testnet — **desalineado con un evento Bitcoin**.
10. **Demo en vivo**: transacciones Sepolia con token sin valor.
11. **Complejidad**: A (contrato + seguridad + wallets EVM).
12. **Dependencias**: RPC Sepolia, faucets, MetaMask.
13. **Riesgos**: bug de contrato en vivo; jurado Bitcoin; oráculo de notas.
14. **Riesgo de genérico**: medio.
15. **Impacto medible**: bajo en el evento (tokens sin valor).
16. **Rechazo probable**: "¿Por qué Ethereum testnet en LABITCONF y por qué no mueve nada real?"

## I-2. **Tramo** — complemento por hito, pagado por Lightning ★
1. **Nombre**: Tramo.
2. **Problema**: Progresar perdió 42% real y llega a ~54% de los inscriptos; sponsors privados no tienen riel simple para complementar con condiciones, rapidez y rendición verificable.
3. **Usuario**: (a) sponsor (egresados, empresa, comunidad bitcoiner); (b) estudiante de 1.er–2.º año; (c) validador (tutor/bienestar estudiantil).
4. **Datos**: IPC INDEC (calc. propio), Presupuesto Abierto (ejecución 99% del vigente 2025), Infobae/JGM (inscriptos vs becarios), MDRC (becas por desempeño).
5. **Flujo**: sponsor crea programa (monto por hito calculado por la brecha IPC) → fondea con Lightning → validador marca "hito cumplido" (p.ej. parcial aprobado) → el sistema paga al estudiante en segundos a su wallet Lightning (Lemon/Belo/otra) → recibo verificable (preimage) en página pública sin datos personales → al cierre, saldo no usado vuelve prorrata a sponsors.
6. **Diferenciación**: vs Progresar (estatal, congelado, lento); vs Geyser (crowdfunding sin condiciones); vs transferencia bancaria (sin rendición pública ni pagos globales). Lo nuevo: **pago condicionado + recibo criptográfico por pago + devolución exacta**.
7. **Por qué existir**: canaliza dinero privado hacia el momento de mayor abandono con reglas auditables.
8. **Track**: Inclusión Financiera (primario) y Nueva Educación (alternativo).
9. **Bitcoin justificado**: pagos chicos instantáneos 24/7 a cualquier wallet; sponsors globales sin banco local; **prueba de pago criptográfica** (SHA-256(preimage) = payment_hash) que cualquiera verifica. IA: ninguna en el núcleo (evita IA ornamental).
10. **Demo**: un jurado escanea un QR y fondea con sats reales; el validador aprueba un hito; el teléfono del "estudiante" recibe sats en < 5 s; la página pública muestra el recibo y el verificador lo valida.
11. **Complejidad**: M.
12. **Dependencias**: proveedor Lightning con API (Blink/Alby Hub-NWC/LNbits), cotización BTC/ARS (p.ej. Yadio), datos.gob.ar.
13. **Riesgos**: custodia del fondo (confianza en el operador); volatilidad entre fondeo y pago; validador como oráculo; KYC/UIF si escala.
14. **Genérico**: medio-bajo si el pitch se centra en el mecanismo.
15. **Impacto medible**: en evento, pagos reales y recibos; en piloto, % hitos pagados y tiempo de liquidación.
16. **Rechazo probable**: "¿Quién custodia el fondo y por qué no Mercado Pago?" (respuestas en doc 08).

## I-3. **Puente** — microayuda de emergencia en minutos
1. **Nombre**: Puente.
2. **Problema**: shocks chicos (SUBE, apunte, fotocopias, celular roto) interrumpen la cursada; las ayudas existentes tardan semanas.
3. **Usuario**: estudiante en emergencia; área de bienestar/centro de estudiantes que valida; donantes.
4. **Datos**: GSU Panther Retention Grants (observacional), Notre Dame RCT (+25 pp con acompañamiento); boleto AMBA $32.482/mes. Argentina: sin datos de shocks — [FALTA].
5. **Flujo**: pedido breve → validador aprueba con checklist → pago Lightning inmediato → recibo público anonimizado → acompañamiento posterior.
6. **Diferenciación**: velocidad + transparencia; ninguna universidad argentina publica algo así (no verificado exhaustivamente).
7. **Por qué existir**: la evidencia internacional dice que la velocidad importa.
8. **Track**: Inclusión Financiera / Impacto y Comunidad.
9. **Bitcoin**: igual que I-2.
10. **Demo**: igual motor que I-2, con pedido de emergencia.
11. **Complejidad**: M.
12. **Dependencias**: igual I-2.
13. **Riesgos**: fraude, pedidos falsos, carga emocional/privacidad.
14. **Genérico**: medio ("app de donaciones").
15. **Impacto**: tiempo pedido→pago.
16. **Rechazo**: "Evidencia mixta y ¿cómo evitan abuso?"

## I-4. Tutorías por sats
1. Tutorías por sats. 2. 1.er año con alto abandono académico + estudiantes avanzados que necesitan ingreso. 3. Tutor avanzado, ingresante, sponsor. 4. Abandono 1.er año ~40% (prensa); 80% trabaja (UNQ). 5. Sponsor fondea; cada sesión confirmada por ambos se paga en sats al tutor. 6. Doble impacto. 7. Ingreso compatible con estudiar. 8. Nueva Educación. 9. Micropago por sesión. 10. Sesión → doble confirmación → pago. 11. M-A (dos lados). 12. Lightning. 13. Calidad de tutorías, colusión tutor-alumno. 14. Medio. 15. Sesiones pagadas. 16. "Marketplace de dos lados sin usuarios."

## I-5. Navegador de beneficios estudiantiles
1. Mapa Beneficios. 2. Estudiantes no saben a qué beneficios acceden ni plazos (Progresar, boleto, becas propias). 3. Estudiante. 4. 46% de inscriptos 2025 sin beca (no todos por desinformación). 5. Cuestionario → elegibilidad → plazos → recordatorios. 6. Bajo. 7. Información. 8. Nueva Educación. 9. Sin Bitcoin; IA opcional. 10. Formulario funcional. 11. B. 12. Reglas cargadas a mano. 13. Reglas desactualizadas. 14. **Alto**. 15. Bajo. 16. "Esto lo hace ChatGPT o una búsqueda."

## I-6. Retenido (Progresar 20%)
1. Retenido. 2. El 20% retenido depende de la certificación institucional. 3. Becario. 4. FAQ oficial; sin cifras de pérdida — [FALTA]. 5. Seguimiento de certificaciones + avisos a la institución. 6. Alto. 7. Plata ya asignada. 8. Inclusión Financiera. 9. Sin Bitcoin. 10. **Simulada** (sin acceso a ANSES). 11. M. 12. ANSES/Capital Humano. 13. Datos inaccesibles. 14. Bajo. 15. No medible. 16. "Demo falsa."

## I-7. Escuela Abierta (arreglos escolares financiados con hitos)
1. Escuela Abierta. 2. Escuelas sin calefacción/gas (Radar PBA, 135 municipios relevados). 3. Cooperadora escolar, donantes. 4. Radar PBA (Colossus) — [FALTA acceso a datos]. 5. Necesidad verificada → fondeo Lightning → pago a proveedor contra evidencia. 6. Medio. 7. Infraestructura comunitaria. 8. Impacto y Comunidad. 9. Lightning + recibos. 10. Fondeo y pago a proveedor simulado. 11. M. 12. Radar PBA, proveedor real. 13. Verificación de obra; político. 14. Medio. 15. Bajo en evento. 16. "¿Quién certifica la obra?"

## I-8. Señal Cero (pagos Lightning por SMS, idea original de conectividad)
1. Señal Cero. 2. Personas sin datos móviles no pueden pagar/cobrar digitalmente. 3. Trabajador informal sin plan de datos. 4. **[FALTA]** evidencia argentina sólida de esa población; prior art Machankura (África). 5. SMS/USSD → custodio → Lightning. 6. Bajo (Machankura). 7. Acceso. 8. Inclusión Financiera. 9. Lightning. 10. SMS gateway en vivo (frágil). 11. A. 12. Proveedor SMS argentino. 13. Regulatorio (custodia), entrega SMS. 14. Medio. 15. Bajo. 16. "Ya existe y no probaron que el problema exista acá."

## I-9. Apuntes L402 (creator economy estudiantil)
1. Apuntes L402. 2. Estudiantes que producen apuntes/resúmenes no monetizan. 3. Estudiante creador. 4. **[FALTA]**. 5. Paywall Lightning por apunte; agentes de IA pagan por acceso (L402). 6. Medio; tendencia agent-payments. 7. Ingreso. 8. Creator Economy. 9. Lightning nativo. 10. Pago y desbloqueo. 11. B-M. 12. Lightning. 13. Derechos de autor de material de cátedra. 14. Medio. 15. Bajo. 16. "¿Problema real o solución buscando problema?"

## I-10. Pedido de Acceso (OpenARG → Ley 27.275)
1. Pedido de Acceso. 2. Ciudadanos/periodistas no pueden obtener datos de becas por provincia (no son abiertos). 3. Centro de estudiantes, periodista. 4. Becarios por provincia sólo vía informes de gestión. 5. Busca datos en OpenARG → si no existen, genera pedido formal de acceso → seguimiento de plazos. 6. Alto. 7. Gobernanza. 8. Impacto y Comunidad. 9. OpenARG núcleo; sin Bitcoin. 10. Generación del pedido. 11. B. 12. OpenARG, trámite. 13. Plazos de 15 días: no se ve resultado. 14. Medio. 15. Bajo en 48 h. 16. "¿Dónde está lo blockchain?"

---

### Descartadas antes del portafolio
- Ahorro en BTC para estudiantes (ética de volatilidad).
- Comedores con donaciones verificables (alto riesgo político, verificación imposible en 48 h).
- Credenciales académicas en cadena (prior art masivo, no resuelve la fricción económica).
