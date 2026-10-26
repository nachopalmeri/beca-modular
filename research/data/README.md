# Datos de soporte (consultados 2026-10-26)

| Archivo | Origen | Uso |
|---|---|---|
| `bases-oficiales-2026-10-26.txt` | Export TXT del Google Doc oficial de bases enlazado desde labitconf.com/mas/hackathon | Diff contra la copia del 14/10 (`docs/hackathon/bases-publicas-2026-10-14.txt`) |
| `ipc_indec_nacional_2023-10_2026-08.csv` | API Series de Tiempo datos.gob.ar, serie `148.3_INIVELNAL_DICI_M_26` (IPC nacional INDEC, base dic-2016) | Pérdida real de Progresar |
| `progresar_calculo_ipc.txt` | Cálculo propio sobre el CSV anterior | Cifra del pitch |
| `progresar_presupuesto_abierto_2025_2026.txt` | Presupuesto Abierto, crédito anual 2025 y 2026, actividad "Otorgamiento de Becas Educativas: Progresar" | Ejecución presupuestaria verificada |
| `devpost_8_hackathons_proyectos.psv` | Galerías públicas de Devpost (TreeHacks 2025/2026, Hack the North 2025, PennApps XXV, HackGT 12, HackHarvard 2025, HackPrinceton S25, MHacks 2024). `W` = marcado Winner (cualquier premio, incluidos premios de sponsors) | Test del sesgo "ganan proyectos de accesibilidad" |

Reproducir IPC: `curl "https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&start_date=2023-10-01&format=csv"`.
