# 03 — Benchmark de ganadores 2024–2026 y qué predice el éxito

Consultas: 2026-10-26. **[HECHO]** = verificado en fuente pública; **[INFERENCIA]**; **[HIPÓTESIS]**; **[FALTA]**.

## 1. Límite honesto de esta investigación

- No encontré **videos de pitch ni comentarios públicos de jurados** con razones explícitas de victoria para los eventos comparables relevados. Ese campo queda como [FALTA] en casi todas las filas; no lo invento.
- Las descripciones de proyectos vienen de la tarjeta pública de cada proyecto (texto escrito por el propio equipo), no de una verificación de su código.
- Esta es la **primera** hackathon presencial de LABITCONF (prensa: Territorio Bitcoin, Criptoinforme), así que no hay ganadores previos del mismo evento.

## 2. Eventos y ganadores relevados

### 2.1 Bitcoin 2025 Official Hackathon (Devpost, conferencia Bitcoin 2025, Las Vegas)
Fuente: https://b25.devpost.com/project-gallery (2026-10-26). Proyectos marcados "Winner":

| Proyecto | Qué es (tarjeta pública) | Categoría |
|---|---|---|
| Portal | Identidad digital soberana con Bitcoin y Nostr; login sin contraseñas, pagos sin fricción | Identidad/pagos |
| descriptor-encrypt | Cifrado de descriptores de billetera con la misma política de acceso | Infra seguridad |
| Arcana Seed Lodge | Brain wallet/firmante con mapas y símbolos | Custodia |
| BitLend | Préstamos respaldados en Bitcoin en exSat | DeFi |
| SatsPay | "Buy now, pay later" con sBTC como colateral | DeFi/pagos |
| BareBtc | Crédito subcolateralizado basado en historial Bitcoin, "para emprendedores del mundo" | Crédito/inclusión |
| sBTC Wallet | Billetera móvil sBTC | Wallet |
| btc-dungeon | Juego roguelike con alertas de ballenas | Juego |
| Tiny Satoshi | RPG 2D para enseñar autocustodia a principiantes y niños | **Educación** |
| Acai | Contrato WASM resistente a RBF en L1 | Infra |
| Advanced DriveChain Launcher / Drivechain Revamped | UX de sidechains | Infra |

[HECHO] 0 de 12 ganadores son de accesibilidad/discapacidad. Predominan infraestructura, custodia, crédito y pagos; 1 educativo.

### 2.2 ETHGlobal Buenos Aires 2025 (21–23/11/2025)
Fuentes: ETHGlobal en X (https://x.com/ETHGlobal/status/1992678906978259449), KuCoin/PANews (https://www.kucoin.com/news/flash/ethglobal-buenos-aires-hackathon-announces-10-winning-projects-in-nft-defi-and-prediction-markets), Waterloo (https://uwaterloo.ca/computer-science/news/waterloo-blockchain-wins-25850-usd-ethglobal-buenos-aires).
- [HECHO] 475 proyectos, 1.750 participantes, 10 finalistas: Paybot, JetLagged, BMCP, Hubble Trading Arena, Payload Exchange, Yoga (gestor de posiciones Uniswap v4 en un NFT), LensMint Web3 Camera, Halo, zkx402 (ProofofLeak), Aqua0.
- [INFERENCIA] Por los nombres (zkx402, Paybot, Payload Exchange) hay presencia notable de **pagos para agentes de IA (x402)**: tendencia 2025 de "IA que paga". No verifiqué el contenido de cada uno.
- [HECHO] Criterios de sponsors publicados en la página de premios: LayerZero "creativity, functionality, and how effectively the project uses omnichain"; 1inch "practicality and usefulness, plus code quality and completeness"; Zircuit "completeness, execution, and creativity"; Coinbase CDP "product quality, use of CDP tools… social signal" (https://ethglobal.com/events/buenosaires/prizes).

### 2.3 Aleph Hackathon (Crecimiento, Argentina)
- Marzo 2025 (https://crecimiento.build/es/blog/aleph-hackathon-march-25): [HECHO] 260+ hackers, 61 proyectos, >USD 40k; ganadores elegidos **por cada sponsor**: Circuls (World), Big Brain MCP (Mantle, mejor app de IA), MetaCitizen (ZKsync), OpenProxy Gov (Polkadot), PayGo (Stellar); menciones: ObscuraProtocol, Stellar Orbit, Passwallet. Sin descripciones ni criterios publicados.
- Agosto 2024 (LA NACION, iProUP): [HECHO] ganador TornadoCodes (gestión de acceso para transacciones sin exponer direcciones); finalistas ValidAR y Certo.
- 2026 (20–22/03): [FALTA] ganadores no publicados en las fuentes encontradas.

### 2.4 MIT Bitcoin Hackathon 2025 ("Freedom Tech")
- [HECHO] TANOS (atomic swaps entre eventos Nostr y UTXOs Taproot con adaptor signatures) ganó el track 3 (fuente secundaria: https://blog.lightningbounties.com/lightning-bounties-mentoring-mit-bitcoin-hackathon-2025). Lista completa: [FALTA].

### 2.5 Hackathons estudiantiles generalistas (IA/impacto) — análisis cuantitativo
Fuente: galerías públicas de Devpost de 8 eventos (TreeHacks 2025 y 2026, Hack the North 2025, PennApps XXV, HackGT 12, HackHarvard 2025, HackPrinceton Spring 2025, MHacks 2024), descargadas el 2026-10-26. Datos crudos: `data/devpost_8_hackathons_proyectos.psv`.

Método: clasificación por palabras clave sobre título + tagline (ingles). "Ganador" = cualquier premio, **incluidos premios de sponsors** (por eso hay 308 ganadores sobre 1.651 proyectos).

| Tema | % de ganadores | % de no ganadores | Sobre-representación |
|---|---:|---:|---:|
| Accesibilidad/discapacidad | 9,7% (30) | 5,1% (68) | **1,9×** |
| Finanzas/cripto | 10,1% | 8,2% | 1,2× |
| Clima/ambiente | 5,5% | 5,1% | 1,1× |
| Educación | 10,7% | 12,7% | 0,85× |
| Salud | 10,4% | 13,8% | 0,75× |

Ejemplos de ganadores de accesibilidad: Iris, Miru, Edith, BrailleBot (TreeHacks 2025), Shepherd (TreeHacks 2026), Vraille y BeyondSight (Hack the North 2025), VisionNav (HackGT 12), SignVerse (MHacks 2024).

## 3. Tu impresión: "muchos ganadores son de accesibilidad"

- **[HECHO] Hay un patrón real pero acotado**: en hackathons estudiantiles generalistas de EE.UU., accesibilidad está ~2× sobre-representada entre premiados, aunque sigue siendo <10% de los ganadores.
- **[HECHO] No se replica en hackathons Bitcoin/Web3**: 0/12 en Bitcoin 2025; en ETHGlobal BA y Aleph dominan pagos, DeFi, identidad, IA-agentes.
- **[INFERENCIA] Sesgo de selección**: (a) recordamos proyectos de accesibilidad porque su demo es emocional y visual (un ciego que "ve"); (b) muchos premios son de sponsors de hardware/visión (cámaras, VLMs), que favorecen demos de percepción; (c) la categoría tiene un **usuario identificable y un antes/después observable en 30 segundos** — esa es la variable de fondo, no la discapacidad.
- **Conclusión**: copiar "accesibilidad" sería seguir una correlación espuria. Lo que sí hay que copiar es su mecanismo: *usuario concreto + cambio visible en vivo*.

## 4. Factores que predicen el éxito (separados por nivel de evidencia)

| Factor | Evidencia | Nivel |
|---|---|---|
| Demo que funciona de punta a punta | Criterios publicados de sponsors ETHGlobal ("functionality", "completeness", "execution"); bases LABITCONF exigen "demo funcional" | [HECHO] |
| Uso **esencial** de la tecnología del evento (no decorativo) | LayerZero: "how effectively the project uses omnichain"; CDP: "use of CDP tools"; en Bitcoin 2025 todos los ganadores son nativos Bitcoin | [HECHO] criterio / [INFERENCIA] generalización |
| Usuario y antes/después visible | Sobre-representación de accesibilidad en eventos generalistas | [INFERENCIA] |
| Ajuste a tendencia del momento (2025–26: pagos para agentes, x402/L402, Nostr, crédito con colateral BTC) | Nombres de finalistas ETHGlobal BA y ganadores B25 | [INFERENCIA] |
| Alcance pequeño y terminado vs. plataforma | Ganadores B25 son herramientas puntuales (un cifrador, un launcher, una wallet) | [INFERENCIA] |
| Pitch | [FALTA] evidencia directa de jurados; en 60 s sólo cabe: problema con un número, demo, por qué ahora | [HIPÓTESIS] |

## 5. Lecciones aplicables a LABITCONF EDU

1. **Bitcoin no puede ser decorativo**: el jurado son "referentes del ecosistema Bitcoin y blockchain". Una demo que mueve sats reales por Lightning es nativa; un ERC-20 de testnet no lo es.
2. **Un antes/después en vivo**: algo que el jurado vea cambiar en pantalla (o en su propio teléfono) en < 20 s.
3. **Alcance mínimo, terminado y robusto** a un desafío de track que conocemos el mismo día.
4. **Problema con un número oficial**, no una historia.
5. **No perseguir el tema "admirable"**: perseguir el mecanismo verificable.
