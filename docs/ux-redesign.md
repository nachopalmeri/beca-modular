# UX/UI redesign — October 15, 2026

## Product model and current state

The current product direction is a scholarship funded by one or more sponsors and paid to the student in configured tranches after an authorized institution confirms a milestone. The latest product/execution notes select this model. Historical experiments that route payment to a provider are separate explorations and are not part of this public journey.

The website is a proposal plus local simulation. The interactive demo uses synthetic contributions, milestone attestations, receipts and balances in memory. It does not verify a real institution, academic outcome, student identity, wallet, contract or payment. A viewed class and student-reported progress do not authorize funds. Only the synthetic institutional test record releases the next configured tranche.

## Visual direction and interaction

The page keeps Beca Modular’s forest green, warm paper, rust accent and serif/sans contrast. The first screen now pairs a concise explanation with a visible three-step example: capped budget → two institutional milestones → fixed total. The main CTA opens the maintained demo directly.

The story uses normal vertical page scrolling. At desktop widths and when reduced motion is not requested, a pinned chapter stage moves four complete panels horizontally: problem question → public evidence → program rules → synthetic receipt. Native scrolling still moves the page forward and backward; keyboard arrows and chapter links navigate the stages. It never captures the wheel. On mobile, reduced-motion settings, or if the module does not initialize, the four panels remain stacked as ordinary content.

This adapts the reference’s long vertical rhythm, persistent visual stage and chapter progression to Beca’s subject. A live inspection of Heyato’s current page showed a long story region (about 10,859 CSS pixels in the inspected viewport) with sticky visual regions. I did not verify that the live section uses a continuous horizontally translated rail at every breakpoint; this page implements that horizontal translation as its own explicit adaptation. No Ato copy, branding, assets or product claims are reused.

3D and shaders were intentionally not added: the visual story is a sequence and accounting cap, which is explained more directly by CSS panels and text. There is no third-party runtime, WebGL dependency or remote image requirement for the new story.

## Evidence sources and limits

- [Argentina Ministry of Education — Educational indicators](https://www.argentina.gob.ar/educacion/evaluacion-e-informacion-educativa/indicadores): the official page lists promotion, repetition, interannual dropout, schooling and overage indicators by education level and jurisdiction, with methodological documents and Excel series from 2003. The UI uses interannual dropout only as a candidate question. No value is imported or plotted; a future pilot must choose a period, inspect its method and cite the selected file. It cannot establish why an individual leaves school or prove that a scholarship changes that outcome.
- [OpenArg dashboard catalog](https://openarg.org/dashboards): the catalog describes 15 active dashboards as independent products that open separately. The linked [Education GBA map](https://mapa-educacion-gba.vercel.app/) is external context, not a Beca Modular integration, partnership or endorsement. The catalog currently describes the map as 10,900 census radii × 8,800 schools, but that count is not displayed here because it is unnecessary to the product flow and the page has not independently validated its underlying data/method.
- [DatosHoy - Universities](https://www.datoshoy.com/universidades): checked October 15, 2026. The live browser rendered its interactive university map and 2024-labeled indicators, while a text fetch of the same URL reported fictional development data and temporary unavailability. The discrepancy is recorded; no figures are republished. Its methodology says graduates per 1,000 is an annual ratio, not a cohort graduation rate, and some spending measures are estimates.
- [EDU Hub bootcamp transcript](https://app.notion.com/p/Meeting-3fa8de073039808fba1fd0d1db96c451): the automatic transcript is cited only for the workflow of defining a problem, measuring it, comparing alternatives, designing a program, considering cost/risk/timeline/requirements and communicating it, and for TOMI as an external aid. The transcript says the specific hackathon prompt arrives at the event start and Colossus Lab mentors teams; that is not a Beca partnership, endorsement or jury confirmation. The transcript can contain transcription errors.
- No current source found in this review supports strikes or days of class lost with a method appropriate for this page. Those claims are excluded rather than estimated from a proxy.

## Other design references

- [Heyato launch](https://www.heyato.ai/es/launch): long-form vertical narrative and sticky visual stages; adapt pacing only.
- [The Pudding](https://pudding.cool/): visual explanation that reveals a chapter with its supporting graphic.
- [Our World in Data](https://ourworldindata.org/): keep definitions, provenance and caveats near quantitative claims.
- [Stripe](https://stripe.com/): present financial rules and outcomes in plain, scan-friendly summaries.
- [Taste Library](https://github.com/MartinPuli/taste-library): use named design systems as reference vocabulary, not as permission to copy a brand. Preserve local colors and Spanish copy.

## Files and local verification

- index.html, styles.css, roadmap.mjs: hero, chapters, fallback, keyboard controls and content.
- assets/beca-brote-mascot.png: original character asset generated for this product; “Brote” is a visual guide, not a student or testimonial.
- dist/: synchronized static distribution copy.
- docs/ux-redesign.md: decisions, evidence and exclusions.
- docs/captures/landing-desktop.png, docs/captures/landing-mobile.png, docs/captures/story-desktop.png and docs/captures/story-mobile.png: desktop/mobile captures after implementation, kept outside the locally ignored screenshots/ folder.

Run node server.mjs, then visit http://127.0.0.1:4178/. No dependencies were added. The demo is at /demo.html.

## Used skills and agents

- Skills: frontend-design for the interface direction; obsidian-vault and project-learning-guide to refresh the project guide; computer-use for reference-site inspection and visual QA workflow.
- Agents used: product/data audit, Heyato/reference interaction research, and interaction/WebGL engineering. Product and data auditing shared one agent; no separate fourth agent was available. The reports were combined before implementation.
- Not verified in this review: a complete screen-reader conformance audit, actual student/sponsor usability study, live map data quality, an active Beca program, institution integration, or testnet/mainnet funds.

## Scroll chapter and original character

### Scroll choreography refinement, October 16

Rechecked Heyato's live opening: words reveal as scrolling advances and the character uses a scroll-controlled canvas sequence (`data-frame` observed at 80). This inspection does not prove every frame or every gesture on the reference site. Beca adapts the pinned headline, staged entrance, walking, jump, resting pose and departure with its own lightweight SVG limbs and original book/sprout illustration.

The previous path faded in/out within the frame and returned to the same elevation after jumping. Brote now enters from beyond the left edge, walks toward a raised landing, meets the visible headline with its shoes, and exits beyond the right edge. A contact shadow scales during the jump. The second title line brightens with progress while staying readable; the full semantic text is always present. Every pose is reversible. Mobile, short screens, reduced motion and no JavaScript retain a static character and the complete copy. This is a 2D articulated illustration, not a fully rigged 3D character or a reproduction of Ato's frame sequence.

The desktop chapter borrows the interaction principle seen in Heyato's long pinned story: normal vertical scrolling advances a sequence while the visual scene stays in place. Beca Modular translates that into four horizontal story panels—question, evidence, program, and a synthetic receipt—with visible chapter controls and arrow-key navigation. It does not reproduce Heyato's copy, branding, composition, mascot, or source assets. On narrow screens and under reduced motion, the panels remain stacked in their semantic order; the HTML stays complete without JavaScript.

“Brote” is an original book-and-sprout guide character created for this product. It appears in each chapter with a small, restrained pose change so it connects the investigation, budget, and receipt without suggesting a real beneficiary. The desktop scene uses local assets and CSS; no WebGL, shader, animation package, or new dependency is needed for this interaction.

The browser walkthrough covers desktop vertical-to-horizontal progress, reverse and forward keyboard navigation, chapter selection, responsive fallback, reduced motion, no-JavaScript content, and screenshot capture. It does not establish formal WCAG conformance or a user-tested preference for the mascot.

## Problem discovery support — October 16, 2026

- Linked a short interview guide and anonymized note sheet from the design-method section. Questions start with recent, concrete experiences and compare existing alternatives before introducing Beca Modular.
- The guide explicitly forbids collecting student identity, grades, financial circumstances, records, wallets, or contact data, and warns that a few exploratory conversations are not representative market validation.
- The browser test opens the linked document and checks that it does not claim interview results and includes a privacy instruction. No interview has been conducted or fabricated.


## Map and mascot interaction update - October 16, 2026

- The pinned chapter now places Brote on four large verbs (PREGUNTAR, UBICAR, ORDENAR, AVANZAR). Native vertical scroll moves the chapter rail and character across the lettering; the final pose leans on the last word. Stacked layout and reduced-motion fallback remain.
- The evidence section has a full-width external map viewer with three selectable sources: the official national map, OpenArg's GBA school/context map, and DatosHoy's university map. All three loaded in the real Brave browser in an iframe; an always-visible full-tab link remains as fallback.
- The official map shows active establishments from the January 2025 register; school detail sheets use the 2023 Annual Survey and show a periodic review dated 2026-03-05. OpenArg showed 10,923 census radii, 8,931 geocoded locations, 29 EPH quarters (2017T1-2025T3), and 1,685 low-confidence locations excluded from its ranking when inspected on 2026-10-15. Its school list reflects an attached census-area index, not school performance.
- DatosHoy's map visibly loaded 2024 indicators in-browser, but a text fetch of that same URL identified a fictional development state. No university counts are copied into the Beca site; the dashboard remains externally attributed and its caveats are displayed. SPU's official statistical-yearbook page is linked as primary source.
- No data is used for individual eligibility, and no institutional endorsement or Beca integration is implied.


## Brote as a participant in the story ? 2026-10-16

Reference rechecked in Brave: https://heyato.ai/es/launch (www.heyato.ai redirected there). The opening uses a sticky viewport over roughly four viewport heights, oversized headline typography, and a character slot above the headline. The rendered DOM exposes a 600-by-600 canvas with start/end poster fallbacks. The character slot scales down on mobile. Later sections combine testimonial imagery and another sticky family chapter. These observations describe the rendered reference, not an independent verification of every canvas animation frame.

Adaptation: an original Brote opening before the four existing program chapters. Native vertical scrolling controls entrance, articulated walking, a hop onto the headline, a resting lean, and departure. The same book-and-leaf illustration gains lightweight original SVG paper arms and leaf shoes; chapter gestures wave, point, guide and rest. The landing target is measured from the actual headline word rather than fixed screen coordinates. A visible anchor skips directly to the program chapters.

The design uses Beca Modular's forest/cream palette and program narrative. It reuses the existing Brote asset and adds no media package, canvas, WebGL dependency, or third-party character asset. Mobile/short screens and reduced motion keep the opening in ordinary document flow with a static illustration. The core product explanation and demo CTA appear before the sequence.

Implementation: brote-motion.mjs, roadmap.mjs, styles.css, index.html; mirrored in dist. Validation is recorded in qa.md. Captures: captures/story-opening-desktop.png and captures/story-opening-mobile.png.

## Statistical evidence lab, contribution tree and closing companion — October 17, 2026

Goal: make the landing and demo more statistical and interactive with official open data, keeping the evidence discipline (cite, caveat, no invented figures).

### Evidence lab (`#evidencia-lab`, evidence-map.mjs)

- The official DiNIEE “Tasa de Abandono Interanual” series (2012-13 → 2024-25; 24 jurisdictions; primaria and secundaria) is committed as `data/abandono-interanual.mjs`, generated from the official workbook by `scripts/build-evidencia.mjs`. The module records the exact source: Secretaría de Educación de la Nación · Subsecretaría de Evaluación e Información Educativa · DiNIEE · Red-FIE, official page and workbook URLs, download date 2026-10-17, and the published method limitations.
- Province geometry is the official Georef/IGN dataset committed as `data/geo-provincias.mjs`. Nothing in the lab is fetched at runtime.
- The reader can switch indicator (primaria/secundaria), school year, and map rendering between choropleth areas and proportional points. The readout, the 13-year series chart with a dashed national reference, the ranking strip and the full data table all follow the same selection; chart points and ranking entries are clickable and keyboard-operable, and map paths respond to Enter/Space.
- Caveats travel with the numbers instead of being relegated to a footnote: the official closed-flow model can produce negative values, which are shown as published and labelled as such; the Buenos Aires secondary-regime change note from the workbook is displayed; jurisdiction aggregates cannot explain individual causes or demonstrate a scholarship effect.
- Fallbacks: a `<noscript>` message, a complete data table, reduced-motion handling and a mobile layout without horizontal overflow. No value on the page is derived, estimated or interpolated by this site.

### Contribution tree (tree.mjs)

- Each synthetic contribution becomes a leaf (banknote, coin or leaf motif by slot), each released milestone a fruit with a check. Open review dims the growth claim, a refund marks the leaves, and an overflow badge summarizes contributions beyond the 15 drawn.
- Landing teaser (`#arbol-ejemplo`): a fixed illustrative example grows when it enters the viewport, instantly under reduced motion. Demo figure (`#funding-tree`): wired to the live in-memory scenario, with a written status line assembled from the current leaf/fruit counts.

### Closing companion (`#companero`)

- A teal epilogue with original Spanish copy: Brote rests next to a sprout whose stem and leaf draw in when the section enters the viewport. The stage adds a subtle ground line; Brote breathes gently while the section is visible and holds a static frame under reduced motion. It is an original illustration and copy; it does not reproduce any reference site’s text or assets and implies no partner or testimonial.

Files: `evidence-map.mjs`, `tree.mjs`, `data/abandono-interanual.mjs`, `data/geo-provincias.mjs`, `scripts/build-evidencia.mjs`, wiring in `index.html`, `demo.html`, `roadmap.mjs` and `styles.css`, plus the offline ZIP built by `scripts/build-offline-demo.mjs`. Captures: `docs/captures/evidencia-desktop.png`, `evidencia-mobile.png`, `arbol-teaser.png`, `arbol-demo.png`, `companero-desktop.png`.

### Bugfix round — October 17, 2026

- The map viewer no longer implies success when a frame commits an error page: the completion copy is neutral in both outcomes, a `no-cors` preflight turns a rejected host into an explicit “No se pudo abrir el visor. Reintentá o usá el mapa completo.” state with a retry button, and that state cannot be overwritten by a late frame `load`. The loader still starts only near the viewer (200px), so a deep link to `#datos-abiertos` deliberately leaves the frame resting until the reader scrolls closer.
- The evidence chart now plots the published negatives: the y-axis extends to a negative floor snapped to the grid, with negative labels, instead of clamping values onto the 0 line.
- The offline kit is self-consistent: the ZIP carries a small Spanish `index.html` that explains the offline copy and links both the demo and the online landing, and the demo's self-download paragraph becomes an “Ya estás dentro del respaldo offline…” note inside the kit.
- Page cache-bust consistency (`?v=28` across all four pages, source and dist) is enforced by `tests/versions.test.mjs`.
