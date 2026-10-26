# 04 — Investigación: pobreza, educación y oportunidades perdidas en Argentina

Consultas: 2026-10-26. **[HECHO]** con fuente; **[INFERENCIA]**; **[FALTA]**.

## 1. Contexto macro

| Dato | Valor | Fuente |
|---|---|---|
| Pobreza personas, 1.er sem. 2026 (31 aglomerados EPH) | **32,3%**; indigencia 7,5%; +4,1 pp vs 2.º sem. 2025 (28,2%); 0–14 años: 44,5%; NEA 41,5% | INDEC vía Forbes Argentina (https://www.forbesargentina.com/today/la-pobreza-subio-323-primer-semestre-2026-afecta-casi-10-millones-personas-n98687), publicado 24/09/2026. [HECHO, fuente secundaria del informe INDEC] |
| Ingresos vs canastas 1S-2026 | ingreso per cápita +11,5% vs CBT +19,6% | ídem |
| **Verificación primaria** | PDF INDEC "Incidencia de la pobreza y la indigencia en 31 aglomerados urbanos. Primer semestre de 2026": personas **32,3%** (9,7 M), hogares 24,4%, indigencia 2,2 M personas; 0–14 años 44,5%; **15–29 años: 36,9%** (cuadro 3.2). La cifra 32,9% de Perfil es errónea. | https://www.indec.gob.ar/uploads/informesdeprensa/eph_pobreza_09_2670733F4C4D.pdf (consultado 2026-10-26) [HECHO primario] |

## 2. Educación superior: quién se queda afuera

| Dato | Valor | Fuente |
|---|---|---|
| Decil más pobre en la matrícula universitaria | **7,9% en 1.er año → 1,1% en 5.º año**; decil más rico 5,3% → 12,7% | Templado et al., Argentinos por la Educación (2022), citado en Pensamiento Universitario (https://www.pensamientouniversitario.com.ar/index.php/2025/08/21/brechas-en-la-graduacion-en-la-educacion-superior-argentina-y-su-impacto-sobre-la-equidad/) [HECHO; es corte transversal, no cohorte] |
| Primera generación | 73% de los ingresantes 2022 a universidades nacionales tienen padres con secundario completo como máximo | Ministerio de Capital Humano 2024, ídem |
| Graduados | 64 por 10.000 habitantes (2022), por debajo de Chile, Colombia, España | Red ÍNDICE 2024, ídem |
| Factores de abandono | Mayor probabilidad entre quienes trabajan, varones, hogares de menor ingreso y menor clima educativo (EPH) | Estudios citados en búsqueda (CONICET/EPH) [HECHO cualitativo] |
| Trabajo | UNQ: "más del 80%" de sus estudiantes trabaja o busca empleo; UNaM: estudiantes cursan menos materias por razones económicas | La Prensa Austral 04/05/2026; MisionesOnline 18/09/2026 [HECHO, declaraciones institucionales] |
| Abandono 1.er año | ~40% citado en prensa (El Día, 26/12/2024) | [FALTA dato oficial nacional reciente] |

**[INFERENCIA]** El abandono no es sólo económico: también académico (preparación previa), laboral (tiempo) y de información. La falta de dinero es *un* factor fuertemente asociado, no la única causa. Cualquier producto que prometa "evitar el abandono" con plata sola sobre-promete.

## 3. Progresar: la beca pública principal

| Dato | Valor | Fuente |
|---|---|---|
| Monto Progresar Superior 2026 | **$35.000/mes bruto**, sin actualización desde sept. 2024 (Resolución 172/2026) | Ámbito, iProfesional, NewsDigitales (búsqueda 2026-10-26) [HECHO] |
| Pago efectivo | 80% mensual ($28.000); **20% retenido** hasta acreditar regularidad / avance académico | ídem; FAQ oficial (https://www.argentina.gob.ar/educacion/progresar/preguntas-frecuentes-progresar/educacion-superior-faq): "9 cuotas regulares, de las que se retendrá el 20%" [HECHO] |
| Requisito académico | Aprobar ≥4 materias cuatrimestrales o 2 anuales en el ciclo; avanzados ≥50% del plan; edad ≤25 (ingresantes), ≤30 (avanzados) | FAQ oficial [HECHO] |
| **Pérdida real** | IPC nacional ago-2026 / sep-2024 = 1,7237 → los $35.000 valen **42,0% menos**; para conservar el poder de compra deberían ser **≈$60.330** | Cálculo propio, serie INDEC `148.3_INIVELNAL_DICI_M_26` vía API datos.gob.ar (`data/progresar_calculo_ipc.txt`) [HECHO] |
| Inscriptos vs becarios | 2024: 2.189.769 inscriptos / 1.359.274 becarios (62%). 2025: 1.767.524 / 953.169 (≈54%) | Infobae 17/05/2026 (https://www.infobae.com/politica/2026/05/17/becas-progresar-que-paso-con-la-cifra-de-beneficiarios-y-su-presupuesto-en-la-gestion-de-milei/), con datos de informes de Jefatura de Gabinete y Capital Humano [HECHO secundario] |
| Motivos de rechazo 2024 | "evaluación socioeconómica", límites de edad, no ser alumno regular (sin cantidades) | Informe JGM N.º 142, vía Infobae [HECHO] |
| Becarios 2023 → 2025 | 1.860.871 → 953.169 | Infobae [HECHO secundario] |
| Ejecución presupuestaria 2025 | Presupuestado $392.332 M → vigente $296.587 M → devengado $293.769 M (**99,0% del vigente**) | Presupuesto Abierto, crédito anual 2025 (`data/progresar_presupuesto_abierto_2025_2026.txt`) [HECHO primario] |
| Ejecución 2026 al 23/10 | Vigente $359.231 M; devengado $201.115 M (56%) | Presupuesto Abierto 2026 [HECHO primario] |
| Actividad "Acompañamiento a las Trayectorias – PROGRESAR" | 2025: vigente $206 M, devengado $0; 2026: $546 M, devengado $0 | Presupuesto Abierto [HECHO primario] |

**Corrección importante a la hipótesis "becas subutilizadas":** [HECHO] en 2025 la plata de Progresar **no quedó ociosa**: se recortó el crédito (≈ –$95.700 M) y se ejecutó el 99% de lo que quedó. La brecha es una **decisión de política** (menos becarios, monto congelado), no una falla de distribución que un software pueda destrabar. Sí es cierto que la línea de *acompañamiento* (tutorías) figura sin ejecución.

## 4. Costos indirectos: transporte

| Dato | Valor | Fuente |
|---|---|---|
| Boleto universitario PBA 2026 | Recarga SUBE automática para hasta **45 viajes/mes**; AMBA: **282.654** usuarios, **$32.482,35/mes**; La Plata–Berisso–Ensenada: $35.375,40; total provincial proyectado 376.850 | Decreto 390/2026 vía Código Baires 17/04/2026 (https://www.codigobaires.com.ar/2026-04-17/boleto-universitario-hasta-45-viajes-por-mes-y-montos-diferenciados-segun-el-municipio-247730/) [HECHO secundario] |
| Comparación | El Progresar efectivo ($28.000) es **menor** que lo que la propia Provincia calcula para 45 viajes en el AMBA ($32.482). | [INFERENCIA, comparación de dos cifras oficiales; no son el mismo estudiante necesariamente] |
| Estudiantes fuera de PBA/CABA | Beneficios dispares por jurisdicción | [FALTA mapa completo] |

## 4b. Becas privadas existentes (el lado sponsor)

| Programa | Qué hace | Fuente | Lectura |
|---|---|---|---|
| Fundación YPF, becas de grado 2026 | **50 becas**, **$450.000/mes × 9 cuotas** (abr–dic 2026), ingeniería y afines en universidades públicas; selección por provincia, ingresos, promedio, género; renovación anual según reglamento; "debiendo el becario realizar los trámites que fueren necesarios para hacer efectivo su cobro" | Bases 2026: https://becas.fundacionypf.org.ar/documents/BASES%20DE%20LA%20CONVOCATORIA%202026.pdf (consultado 2026-10-26) [HECHO] | Existen sponsors que pagan 12,9× Progresar, pero a muy pocos, con cuota mensual fija y control anual por documentación. |
| UCASAL, becas de padrinazgo | Empresas (SINER, Cerámica Salteña, Fund. María Calderón de la Barca) seleccionan y financian; para mantenerla: promedio > 7 y carrera al día | https://www.ucasal.edu.ar/noticias/noticias-home/empresas-que-transforman-ucasal-impulsa-las-becas-de-padrinazgo-para-estudiantes (nota de ~2 años) [HECHO] | **Los sponsors ya condicionan al rendimiento.** |
| Fundación Cimientos, Futuros Egresados | Beca + acompañamiento a secundarios en contextos vulnerables; 2.201 estudiantes en 2021 | EECC 2021: https://cimientos.org/pdf/EECC%20Fundaci%C3%B3n%20Cimientos%2031.12.2021%20-%20Firmado%20y%20legalizado.pdf [HECHO] | Modelo "beca + acompañamiento", el que la evidencia internacional (Notre Dame) señala como más efectivo. Potencial socio, no competidor. |
| Fundación Señor González (2023) | $30.000/mes terciario, $50.000/mes universitario | Diario de Cuyo 20/04/2023 [HECHO, desactualizado] | — |

**[INFERENCIA]** El lado sponsor no hay que inventarlo: ya existe y ya condiciona al desempeño. Lo que no encontramos es un riel que permita (a) pagar contra hitos en vez de cuota fija, (b) sumar muchos aportantes chicos con devolución exacta, (c) rendir públicamente sin exponer al becario. **Tramo es infraestructura para estos programas, no un competidor.** El experimento del doc 12 debe incluir a una fundación de este tipo.

## 5. Respuestas concretas a tus preguntas

| Pregunta | Respuesta con evidencia |
|---|---|
| ¿Qué oportunidad se pierde? | Terminar una carrera universitaria (y su prima salarial). El decil más pobre prácticamente desaparece entre 1.º y 5.º año (7,9% → 1,1%). |
| ¿Quién la pierde? | Estudiantes de primera generación, de hogares de bajos ingresos, que trabajan, en universidades del conurbano y del NEA. Progresar llega a ≈953 mil (2025) y rechaza a ≈46% de los inscriptos. |
| ¿Cuánto dinero falta? | Para restaurar el poder de compra de Progresar: **≈$25.330/mes por becario** ($60.330 – $35.000). Para cubrir el transporte de una cursada en AMBA, la referencia oficial es $32.482/mes. |
| ¿Por qué falta? | Monto congelado desde sept. 2024 con inflación acumulada 72%; recorte de crédito; recorte de becarios. |
| ¿Qué soluciones existen? | Progresar (nacional), boletos estudiantiles (PBA, CABA, otras provincias), becas propias de universidades (p. ej. UBA, UNLP), becas privadas/fundaciones. |
| ¿Por qué no alcanzan? | Monto real decreciente; cobertura en caída; y — **[INFERENCIA]** — no hay un canal simple para que actores privados (egresados, empresas, comunidad bitcoiner) **complementen** a un estudiante con reglas claras, pagos rápidos y rendición verificable. Las fundaciones existentes usan transferencias bancarias y rendición en PDF. |
| ¿Qué parte podemos resolver? | **No** el presupuesto público. **Sí** el riel de un complemento privado condicionado: fondear, liberar por hito académico validado, pagar en segundos, rendir cuentas con recibos verificables, devolver lo no usado. |
| ¿Quién lo usaría mañana? | Lado oferta: un sponsor concreto (grupo de egresados, empresa, comunidad bitcoiner — hay 1 en el propio evento). Lado demanda: un estudiante con Progresar que ya acredita hitos. Intermediario: un tutor/área de bienestar que valida. **[FALTA]** ninguno está comprometido hoy. |
| ¿Cómo sabemos que el usuario lo necesita? | Estudiante: evidencia macro fuerte (arriba). Sponsor: **[FALTA]** — es la hipótesis más débil; primer experimento (doc 12). |
| ¿Qué evidencia dice que tendría impacto? | Becas condicionadas a desempeño: RCT de MDRC (Performance-Based Scholarship Demonstration) con efectos "modestos pero positivos" en créditos aprobados; Louisiana (Opening Doors) mejoró créditos, notas y persistencia (https://www.mdrc.org/work/publications/performance-based-scholarships-emerging-findings-national-demonstration). Microayudas de emergencia: evidencia **mixta**; el único RCT (Notre Dame) mostró +25 pp de permanencia cuando la ayuda se combina con acompañamiento (Bipartisan Policy Center, https://bipartisanpolicy.org/explainer/college-emergency-aid-micro-grant-programs); Georgia State (Ithaka S+R, observacional): graduación más rápida y menos deuda (https://sr.ithaka.org/publications/the-impacts-of-emergency-micro-grants-on-student-success/). **No hay evidencia argentina propia; no prometer reducción del abandono.** |

## 6. Fricción elegida (una, medible, solucionable)

> **Un sponsor privado que quiere complementar a estudiantes de bajos ingresos no tiene hoy una forma simple de pagar montos chicos, condicionados a hitos académicos validados, con liquidación inmediata y rendición verificable por terceros; y el estudiante no tiene forma de recibirlo sin trámites.**

- Medible en el evento: tiempo de validación → acreditación (segundos), recibos verificables, exactitud de devoluciones.
- Medible en piloto: % de hitos pagados a tiempo, costo por pago, retención de los becarios del piloto vs. su propia cohorte (no causal).
- Lo que **no** podemos medir en 48 h: impacto en abandono.

## 7. Candidatos descartados y por qué

| Candidato | Por qué no |
|---|---|
| "Becas que no llegan por mala distribución" | Ejecución 2025 = 99% del vigente. El problema es de monto/política. |
| Recuperar el 20% retenido de Progresar | Depende de que la institución cargue la certificación en sistemas de ANSES/Capital Humano: sin acceso a esos datos, la demo sería simulada. Sin cifras públicas de cuánto se pierde. |
| Navegador de beneficios | Real, pero replicable con una búsqueda o un chatbot; sin rol para Bitcoin en un evento Bitcoin. |
| Ahorro en BTC para estudiantes pobres | Traslada volatilidad a quien menos puede absorberla. Éticamente débil y fácil de atacar. |
