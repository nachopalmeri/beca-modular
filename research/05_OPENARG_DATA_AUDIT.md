# 05 — Auditoría de OpenARG como fuente e infraestructura

Consultas: 2026-10-26. Fuentes: https://openarg.org/ , https://openarg.tech/ , https://openarg.org/como-funciona , https://openarg.org/desarrolladores , https://mcp.openarg.org/empezar.html , https://mcp.openarg.org/llms.txt , https://www.colossuslab.org/lab , https://www.colossuslab.org/about .

## 1. Qué es

| Punto | Dato | Estado |
|---|---|---|
| Responsable | Colossus Lab (Buenos Aires), "Rediseñando la Democracia"; contacto devops@colossuslab.org; GitHub github.com/colossuslab | [HECHO] |
| Producto | Motor de análisis de datos abiertos argentinos en lenguaje natural: 4 agentes (planificación, recolección, análisis, síntesis), respuestas con gráficos y citas | [HECHO] |
| Cobertura declarada | "más de 33.000 datasets" de "38 portales" (openarg.org); openarg.tech dice 32 portales, 23.101 archivos, 63,3 GB | [HECHO] — cifras inconsistentes entre sitios; el treemap regional está rotulado "Cifras ilustrativas" |
| Portales | datos.gob.ar, INDEC, BCRA, Diputados, Senado, Justicia, Energía, Transporte, Salud, Desarrollo Social, PAMI, CABA, PBA, Mendoza, Santa Fe, Córdoba, municipios (La Plata, Venado Tuerto, Luján de Cuyo…) | [HECHO] |
| Arquitectura | Frontend Next.js 16/React 19; backend FastAPI multi-agente; conectores CKAN; caché LRU con TTL | [HECHO, autodeclarado] |
| Familia | Presupuesto Abierto (presupuesto.openarg.org, 3.292 programas, 2025–2027), Grafo del Estado, Vigía (Boletín Oficial), Radar PBA (infraestructura escolar), Educación CABA, Mapa Educación GBA (8.800 escuelas × censo), Club Social OS | [HECHO] |

## 2. Acceso técnico

| Punto | Dato |
|---|---|
| MCP | `https://mcp.openarg.org/mcp`, Streamable HTTP, header `Authorization: Bearer oarg_sk_…` |
| API HTTP | `POST https://api.openarg.org/api/v1/ask`; `GET /api/v1/catalogo/buscar?q=`; `GET /api/v1/catalogo/tabla?nombre=`; `POST /api/v1/catalogo/datos`; `POST /api/v1/catalogo/agregar` |
| Herramientas MCP | `buscar_datasets`, `describir_tabla` (incluye frescura: fecha de lectura vs último dato), `obtener_datos` (CSV, ≤500 filas por pedido, paginado hasta 10.000), `agregar_datos` (suma/promedio/conteo/min/max agrupado), `listar_fuentes`, `consultar_datos_publicos` (modo respuestas) |
| Clave | Gratis, login con Google en openarg.org/desarrolladores; una sola clave activa; "Guardamos el texto de las preguntas que hacés con ella" |
| **Cupos** | Modo datos: **200 pedidos/mes** (30/min). Modo respuestas: **10 preguntas/mes** (2/min). Renueva el 1.º de cada mes 00:00 UTC. "Fundadores" (aportantes): 2.000 y 100. Además existe un **cupo público diario global**: "El cupo público de hoy está agotado… Se renueva a las 21:00". Errores 402 (sin cupo) y 429 (rate limit). |
| Licencia | [FALTA] No declarada en las páginas consultadas. Los datos de origen son públicos; la licencia de cada dataset es la del portal de origen. |
| Frecuencia de actualización | "monitoreo continuo" sin calendario; `describir_tabla` expone frescura por tabla | [HECHO] |

**No probé la API**: requiere crear una clave con una cuenta de Google personal. Primer paso operativo: un integrante crea su clave y ejecuta `listar_fuentes` y `buscar_datasets("progresar")`, `buscar_datasets("IPC")`, `buscar_datasets("becas")`.

## 3. Evaluación para nuestro caso

| Necesidad del producto | ¿OpenARG lo da? | Alternativa directa |
|---|---|---|
| IPC mensual INDEC (para calcular el complemento que restaura el valor real de Progresar) | Probablemente sí (indexa INDEC/datos.gob.ar) — [FALTA verificar tabla] | **API Series de Tiempo datos.gob.ar, sin clave** (verificada hoy: serie `148.3_INIVELNAL_DICI_M_26`, último dato ago-2026) |
| Ejecución presupuestaria de Progresar | Sí, vía presupuesto.openarg.org / Presupuesto Abierto | **CSV oficial Presupuesto Abierto sin clave** (verificado hoy) |
| Becarios Progresar por provincia | [FALTA] — no encontré dataset oficial abierto; la cifra 2025 por provincia proviene de informes de gestión vía prensa | Ninguna abierta confirmada |
| Pobreza por región (EPH) | Probable (INDEC) | Microdatos EPH en indec.gob.ar |
| Lista de becas privadas/universitarias | No (no es dato abierto estructurado) | — |
| Validación de identidad o regularidad de un estudiante | **No** y no debe | — |

### Granularidad y limitaciones metodológicas
- Los datos sociales relevantes (pobreza, educación) son agregados (aglomerado/región/provincia), no individuales. **Sirven para fijar montos y focalizar programas, nunca para decidir sobre una persona.**
- Los LLM del modo respuestas agregan una capa de interpretación; para cifras del pitch usar modo datos o la fuente oficial directa y citar el link oficial.
- Inconsistencias de conteo entre sitios de Colossus: no usar sus totales como cifra propia.

## 4. Veredicto

1. **OpenARG no aporta una ventaja técnica sustancial para el núcleo del producto.** Los dos datos que necesitamos (IPC y presupuesto de Progresar) están disponibles sin clave y sin cupo en fuentes oficiales, que además son la cita correcta.
2. **Uso legítimo y útil (opcional)**: como **capa de evidencia para el sponsor** — una pantalla "¿por qué este monto?" que consulta vía MCP/API el IPC y la ejecución de Progresar, mostrando fuente y fecha de corte. Es una acción concreta: *el dato fija el monto del complemento* (no es un dashboard). Con caché local y fallback a datos.gob.ar.
3. **Descartado**: hacer de OpenARG el centro del pitch, construir un chatbot sobre OpenARG, o un dashboard de becas. Sería un wrapper, replicaría su propio producto y, si alguien de Colossus integra el jurado, un uso ornamental se notaría más, no menos.
4. **Atribución**: "Datos: INDEC vía datos.gob.ar; Presupuesto Abierto (MECON). Consulta asistida: OpenARG (Colossus Lab)" — sólo si efectivamente se usó.
5. **Riesgo operativo**: cupo diario global + 10 preguntas/mes. Nunca depender de OpenARG en vivo durante el pitch; precalcular y cachear.

## 5. Integraciones factibles durante la hackathon

| Integración | Esfuerzo | Valor | Decisión |
|---|---|---|---|
| `GET` IPC desde datos.gob.ar → calcula monto | 30 min | Alto (fija el monto) | **Hacer** |
| Snapshot de ejecución Progresar (CSV) | ya hecho (`data/`) | Medio (pitch/Q&A) | **Hacer** |
| OpenARG `agregar_datos` como proveedor alternativo con caché | 1–2 h | Bajo-medio | Opcional, si sobra tiempo |
| OpenARG `consultar_datos_publicos` en vivo | 30 min | Bajo, riesgoso | **No** |
