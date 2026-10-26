> Revisión actual14/10/2026: propuesta por materia, financiación individual/compartida desde1USD, hitos y devolución proporcional. Web preparatoria; contrato durante48h. Ver [verificación actual](hackathon/verificacion.md). Las entradas siguientes son históricas.

# Design brief and QA receipt

Date: 2026-10-10. Requested: premium Spanish education/fintech product website, credible interaction and evidence boundaries.

## Design decisions

Audience: prospective sponsor, student, provider, developer and hackathon evaluator. Primary action: explore a bounded scholarship session. Secondary action: edit business assumptions. Emotional target: agency, clarity and institutional trust.

Reference directions: Vercel for typography/technical clarity, Linear for compact workspace hierarchy, Stripe for explicit money-flow communication. No brand assets or templates copied. Subject-specific signature: modular blocks convert allocated budget into delivered units and expose the remainder. No GPU shader: it would add decoration and accessibility/performance cost without explaining this product.

Wireframes considered: (A) long marketing page with dashboard hero; (B) editorial product lab with scholarship blocks, interactive session and open model. Selected B because simulation/evidence boundaries and editable economics are central, not footnotes.

System: Segoe UI/system sans for body and assertive large headings, locally available monospace for units, state and financial amounts. Dark ink panels, mint for approved/allocated funding, amber for assumptions/rejections, neutral slate for remaining funds. No remote fonts/assets. 1200px content width, responsive recomposition at 1050/760px; offcanvas mobile navigation, vertical money flow, single-column forms where needed. Restrained hover/state transitions; reduced motion removes transforms and smooth scroll. Native inputs/buttons/details and visible keyboard focus.

## Verification executed

- Runtime: Node **v26.9.0**. No dependency installation. Bundled Playwright package already available; its default expected Chromium revision was absent. First browser invocation failed with missing `chromium_headless_shell-1234`; switched to existing Google Chrome executable, without downloading a browser or changing the user's interactive session.
- `node --check app.js`, `node --check model.mjs`, `node --check server.mjs`: passed.
- `node --test tests/model.test.mjs`: **9 passed, 0 failed**. Educational and platform accounts, surcharge conservation, zero revenue, invalid values, utilization sensitivity, optimistic profitability assumption, cumulative session close, duplicates, over-cap, pause, invalid amount and zero-use refund covered.
- `node tests/browser.cjs`: **PASS**, details in `../browser-results.json`. Validated controls/state transitions, financial presets and zero/invalid inputs, all local anchor/doc targets, role and journey changes, deterministic recommendation, funding-flow boundary, mobile menu, keyboard skip link and reduced motion. No captured page or console errors. Viewports **1440×900, 768×1024, 390×844**, no document horizontal overflow.
- Browser screenshots captured in `../screenshots/`. Desktop/mobile hero and desktop product/financial sections plus tablet hero were visually inspected. Section captures hide sticky navigation to avoid screenshot-only overlap. Full-page screenshots retained for responsive evidence. No claim of user usability testing, full screen-reader audit or formal WCAG certification.
- Re-ran focused checks after changing the optimistic license assumption from 500 to 1,000 and rendering fractional money-flow blocks accurately. Base remains unprofitable; optimistic profitability depends on unvalidated willingness to pay/efficiency.

## Independent review and fixes

Actual reviewer `/root/beca_review` ran two read-only passes on source and documentation. It found no P0/P1 within the local simulation scope. P2 fixes: added a debounced live financial-result status for screen readers; unified subscription as per institution/month with one active program assumed. No manufactured consensus or human review claimed. Reviewer did not execute browser tests, audit external protocols or validate buyer demand.

Strongest unresolved objection: conventional direct payment + LMS/invoices may already suffice; provider modular pricing and sponsor willingness to pay are not validated. Architecture review approval is only for the explanatory proposal, never production finance readiness.

## Visual rubric (primary's inspection)

Subject specificity 2; hierarchy 2; composition 2; typography 2; color rationale 2; responsive integrity 2; accessibility 1; motion purpose 1; generic-pattern avoidance 2. **16/18**, all dimensions at least 1. Accessibility remains 1 because screen reader/zoom/complete contrast audit is not performed. Motion is restrained and optional, not the primary explanation.

## Delivery and limits

Local validation server: http://127.0.0.1:4178 (loopback only). The live Site is public at https://beca-modular.ignaciopalmeri1.chatgpt.site. `index.html` can also be served by any static host with adjacent module files. The module-based site should be served over HTTP rather than opened as `file://`.

No React build/typecheck was run: this deliverable is a standalone semantic HTML/CSS/ES-module site without TypeScript or build dependencies. Proposed React backend is documentation only. Local UI test success is not new MPP settlement, real AI inference, verified customer adoption or educational impact.

Delivery copy verified at `D:/Codex/outputs/beca-modular-2026-10-10/beca-modular/`. Project guide saved at `D:/Facultad/UADE-Vault/Efforts/Proyectos/Beca Modular/Beca Modular - Product and engineering guide.md`, with two verified Data Engineering class-note links. No unrelated vault notes, Atlas entries or MOCs changed.


## Revisión del audio y portada — 10/10/2026
Transcripción local completa inspeccionada. Portada corregida a becas al alumno por hitos, contenido por uso separado. Browser comprobó: aprobar 20 USD, pausa bloquea nuevo hito, reasignar 80, mantener 20 del alumno y restablecer. 9 pruebas Node previas pasaron, syntax check y Chrome UI en 1440/768/390 sin errores/overflow. Inspección visual de portada desktop/mobile. Es simulación en memoria, no escrow ni prueba académica real.


## Tesorería y opciones de beneficiario — 10/10/2026
15 pruebas Node pasaron (9 anteriores + 6 proyecciones: saldo decreciente, destinatarios, estrés negativo, límites, un mes e inválidos). Syntax checks app.js/yield.mjs pasaron. Chrome comprobó opciones Aave/Morpho, distribución al alumno, estrés5%, dato inválido y reset; resto de flujos existentes pasaron. Escritorio1440, tablet768 y móvil390 sin overflow ni errores capturados. Capturas de sección inspeccionadas en desktop/mobile. No pruebas de protocolos o retiros onchain; simulador no usa tasas de mercado.

## Student-choice and award-equivalent model — 10/10/2026

- `node --test tests/model.test.mjs tests/yield.test.mjs`: **20 passed, 0 failed**. Includes the award-equivalent cent-rounding boundary, fractional award-count prevention, student/fund destination, committed-principal safety, and stress coverage.
- `node --check app.js`, `model.mjs`, `yield.mjs`, `server.mjs`, and `tests/browser.cjs`: passed.
- `node tests/browser.cjs`: **PASS** in installed Chrome. Added checks for free surplus, committed amount, whole scholarship-equivalents/remainder, student-benefit options (only visible for a positive beneficiary allocation), updated institution role, and Morpho details. Existing session, invalid-input, reset, anchor/doc, responsive, reduced-motion, keyboard skip-link, and browser-error checks passed at 1440×900, 768×1024, and 390×844 with no horizontal overflow or captured browser errors. Screenshots regenerated in `../screenshots/`; report in `../browser-results.json`.
- A first unit test exposed floating-point rounding at an exact whole-award boundary; calculation now compares integer cents. Earlier browser attempts exposed stale assertions in the existing test file (role title, lifecycle copy, old slider selector, old yield numbers); assertions were aligned with current UI and rerun successfully.
- Desktop and mobile yield-section captures visually inspected. This verifies local presentation and scenario arithmetic only; it does not verify a student-benefit transfer, a vault, live APY, school attestation, AI inference, user demand, screen-reader completeness, or WCAG certification.


## DatosHoy resource card and Minimax montage — 2026-10-11

- Added a top navigation item and sponsor-facing institutional-context section linking to [DatosHoy's university explorer](https://www.datoshoy.com/universidades) and Argentina's official university-institution register. The site does not scrape, embed, copy or score with third-party data; it explains varying coverage/periods and says the indicators cannot evaluate students or determine scholarship eligibility. No API or integration fee is used; reuse rights were not assumed.
- Node model/yield tests: 20 passed, 0 failed. Browser regression suite: PASS, including internal anchor targets, desktop/tablet/mobile overflow, navigation, reduced motion, keyboard skip link and no captured browser errors. A focused Chrome check confirmed both external links, target blank, rel noopener/noreferrer, section content and no horizontal overflow at 1440px and 390px. Desktop/mobile section screenshots saved in screenshots/universidades-desktop.png and screenshots/universidades-mobile.png.
- Reviewed all three 15.08-second MiniMax MP4s (H.264/AAC, 1344x768, 24 fps), generated contact sheets and transcribed the audio locally. The first has a strong opening but a grammar error later; the second has the cleanest closing narration, but generated dashboard text is incoherent; the third is music-only and has some text glitches, so only its two readable title moments were used.
- Rendered a new 18.75-second 1920x1080 H.264/AAC montage with clean cuts, resized with a minimal crop to 16:9, leveled audio, and a final “Prototipo conceptual · simulación” label. The montage combines the human hook from clip 1, two clean title moments from clip 3, milestone and release moments from clip 1, and the student/brand ending from clip 2. Incoherent dashboard frames and the first clip's later misgendered voiceover were removed. Final audio transcription: “El talento está en todas partes, las oportunidades no siempre. Cada logro libera una parte de la beca. Presentamos Beca Modular, un patrocinador aporta los fondos, una institución verifica el progreso. Cada avance cuenta.” Output: ../outputs/beca-modular-video/beca-modular-montaje-final.mp4 (7.67 MB). No real scholarship transaction or user testimonial is shown.


## Site deployment verification — 2026-10-11

Version 5 was saved and published successfully to the existing public Site. The public audience/access mode was preserved. Deployment ID: appgdep_6acc0fcd17e88191b462da50cef2ed94. This only publishes the explanatory site; scholarship payment, AI, and institutional verification remain simulations/proposals.


## Visual direction for the hackathon demo — 2026-10-15

The target is a sponsor or juror who should understand the action, cap and receipt in under 30 seconds. Use a short image-led introduction, one primary action, then the live result and limitations. The current screen runs: configure module/rule → fill a synthetic budget → record a categorized event → inspect release and reserved balance. It keeps the project’s existing forest/cream/terracotta identity, adds a warm editorial hero, and uses the existing generated library illustration with an explicit caption. This is a product demo, not a long conversion page.

### Reference choices and adaptation

- [Ato launch page](https://heyato.ai/es/launch): adapt its brisk progression from promise to product story and concrete details, ending at a clear next action. Beca Modular has no launch reservation, purchase funnel, testimonial, partner badge, or adoption metric, so those sections and claims are not copied.
- [Taste Library](https://github.com/MartinPuli/taste-library) selections: [Mercury](https://github.com/MartinPuli/taste-library/blob/main/profiles/mercury.md) informed restrained financial surfaces and editorial hierarchy; [Ramp](https://github.com/MartinPuli/taste-library/blob/main/profiles/ramp.md) informed legibility for money and a single emphasized action; [Anthropic](https://github.com/MartinPuli/taste-library/blob/main/profiles/anthropic.md) informed warm light surfaces and serif/sans contrast. Adapted into the repo palette and Spanish labels rather than copying any brand identity or assets.
- The Taste Library profiles label their extraction `extracted_unverified`; evidence is saved screenshot composition and literal CSS checks, not live interaction or responsive testing. Its [rights note](https://github.com/MartinPuli/taste-library/blob/main/RIGHTS.md) says the repository grants no blanket license to third-party brands/assets. Treat these as directional observations, not certified design systems or permission to copy assets.

### Rejected layout

A long launch-style sales narrative with reviews, press logos, pricing/checkout, feature catalog and origin story would imply traction and a live offer that Beca Modular cannot support. A standalone dashboard with dense finance controls would bury the student-facing effect. Selected a compact editorial intro plus a two-column interactive ledger, stacked on mobile: clear enough for a first-time juror while keeping the actual rule inspectable.

### New visual / browser verification

The browser run used installed Playwright and Google Chrome; no browser or dependencies were downloaded.

- `node --test tests/funding.test.mjs tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs`: **53 passed, 0 failed**.
- `node --check funding-model.mjs`, `node --check roadmap.mjs`, `node --check tests/demo-browser.cjs`: passed.
- `node tests/demo-browser.cjs`: **PASS** against both `/demo.html` and `/dist/demo.html` at 1440×900, 768×1024 and 390×844. It verified rejected budget mismatch without state mutation, editable budget/rules, a $30 release under a $120 cap with $90 remaining, repeated-receipt rejection without balance change, content consumption without payout, reset, no horizontal overflow and no browser errors.
- Node SHA-256 comparison: **PASS**, all eight synchronized source/dist pairs are byte-identical.
- Visually inspected full-page desktop and mobile captures in `screenshots/demo-desktop.png` and `screenshots/demo-mobile.png`. Inspection caught a global mobile-navigation style leaking into the standalone demo; `.demo-header nav` is now isolated. Tablet overflow is covered by browser assertion, but tablet capture was not separately reviewed at full visual detail.

No screen-reader audit, user usability study, academic verification, contract test or testnet transaction is claimed. Browser captures are local QA artifacts and ignored by Git.

## Demo UX states and mobile audit — 2026-10-15

- Walked the live local landing and demo before editing. The landing hero states the proposal and links to the demo; the simulator already showed its cap, released balance and reserve together. The largest demo friction was an unclear first action and visually similar success/error feedback; the replay rejection did not explain its balance effect.
- Named the 60/40 preset as the fast synthetic-demo path and explained that it advances the user to the milestone step without a real charge. Inline status now has distinct information, success, warning and error treatments. Duplicate receipt feedback says explicitly that the balance did not change; the current funding state gets a matching visual label.
- Improved small touch targets and light-surface keyboard focus styling; widened the standalone demo at narrow mobile sizes; disabled its smooth scrolling and button motion for reduced-motion preference. No new loading animation was added because all current demo actions are synchronous and local.
- `node --test tests/funding.test.mjs tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs`: **53 passed, 0 failed**. `node --check funding-model.mjs`, `node --check roadmap.mjs`, `node --check tests/demo-browser.cjs`: passed. `git diff --check`: passed after removing an extra final blank line.
- `node tests/demo-browser.cjs` and `BECA_DEMO_URL=http://127.0.0.1:4178/dist/demo.html node tests/demo-browser.cjs`: **PASS** at 1440×900, 768×1024, 390×844 and 320×720. Covers landing-to-demo route, skip-link first keyboard focus, state feedback, invalid rules, cap/balance, replay rejection, content-consumed no-payment, reset, reduced motion, no overflow and no browser errors.
- Synchronized the changed source pages and project docs into `dist/`. This remains a local synthetic simulation. No user study, screen-reader audit, formal WCAG review, academic verification, production payment, contract deployment or testnet transaction is claimed.

### Sponsor rule-validation feedback — 2026-10-15

- A budget/tranche mismatch now gives the sponsor a nearby explanation with both totals, marks the affected fields `aria-invalid`, and moves keyboard focus to the first amount to adjust. Editing the rules clears the inline error and announces that the configuration must be applied again. The general status stays concise to avoid repeating the same full error in the other column.
- Added required form fields and assistive descriptions for the amount controls. The browser test passes at 1440×900, 768×1024, 390×844 and 320×720; it checks the exact mismatch message, visible inline error, invalid state, focus target, clearing behavior and successful reapplication along with prior receipt/balance checks.

### OpenArg map handoff — 2026-10-15

- The embedded third-party dashboard displayed its own header and filters inside a 440 px iframe, leaving its map content below a nested scroll area. Replaced the frame/loader with a compact, attributed launch panel. One primary link opens the complete map in its own tab; the page now explains why it leaves Beca Modular. This avoids clipping another product's interface and reduces the chance that its controls or data are mistaken for Beca Modular features.
- The browser walkthrough checks that no map iframe is embedded, the outbound link points to the named OpenArg map and uses a new tab with `noopener`, and the landing page still has no overflow at desktop/tablet/mobile/narrow mobile sizes.

### Hackathon readiness evidence refresh — 2026-10-15

- Rechecked the current LABITCONF and Luma event pages. Their visible summaries confirm 30–31 October at Costa Salguero, four tracks, a 48-hour functional-demo event, four October bootcamp meetings, EDU HUB/accredited-university eligibility, teams of 4–5, approval-based registration, and announced prizes. The current Luma summary does not show a registration cutoff, day-one closing time, or pitch timing.
- Kept the official-bases copy dated 14/10 as a dated snapshot rather than replacing it. Public roadmap, readiness table, and presenter checklist now label the 16/10-or-cap deadline, 19:30 close, and 1+1-minute pitch as details from that copy that need organizer reconfirmation. No registration or message was sent.
- Updated the browser check to guard those uncertainty labels and official links in the public roadmap. Source and distribution versions were checked independently.

### Assigned-module handoff in the demo — 2026-10-15

- Made the synthetic student handoff explicit in the demo lead, progress panel, and limits text. The selected module is assigned in this scenario; the site does not imply a student catalogue, matching, eligibility decision or institutional connection.
- Browser coverage now changes the sponsor-configured module and verifies that the synthetic student's assigned-module summary updates with it.

### Freeze scenario presets after funding — 2026-10-15

- Disabled both quick-start funding presets after the first contribution, alongside editing controls. Their helper text and summary now explain that the scenario is frozen; the user must choose the explicit reset action to begin again.
- Browser coverage checks that preset/configuration controls stay disabled after funding and replay rejection, and are restored only after the explicit reset.


## Landing audit and refresh — 2026-10-15

### Highest-impact issues found

- The home page still contained an older inline funding interface with controls such as `#funding-exam`, while the shared script had moved to the configurable demo controls. A real Chrome load of `/` produced `Cannot read properties of null (reading 'addEventListener')`; the old controls also did not drive the current receipt flow.
- The primary action scrolled to that stale section, so the first screen promised an interactive scholarship flow that was broken and duplicated the maintained demo.
- The hero called Nueva Educación the target track even though the team had not yet received its official challenge.

### Changes and design principles adapted

- Kept the landing's existing image-led hero and forest/cream editorial system. Its promise now describes a proposal, and the track label says the challenge is pending.
- Replaced the duplicate controls with a compact two-part preview: module + two equal tranches, beside a clearly labelled illustrative receipt showing the $50 / $50 split. The call to action opens the maintained, editable simulation directly.
- The standalone demo remains the interaction: configure a budget, set tranches, record a typed event and inspect the receipt/balance. This follows the reference site's progression from promise to product detail to action, without importing Ato's checkout, claims, testimonials or assets.
- Adapted Taste Library observations: warm surface and serif/sans contrast (Anthropic), readable financial information on light surfaces (Ramp), and restrained editorial hierarchy (Mercury). Kept Beca Modular colors and Spanish copy. These profiles are `extracted_unverified`; the available evidence is saved composition/CSS, not certification of live behavior or responsive design. No external brand asset was copied.
- Tightened spacing and contrast inside the preview, stacked its panels on mobile, retained keyboard focus styling and reduced-motion behavior, and bumped page asset query versions to avoid stale CSS/JS.

### Verification

`node tests/demo-browser.cjs` now opens the landing, confirms no stale `#funding-demo` remains, follows its primary action into the interactive demo, and verifies the budget/release/replay/content flows at desktop, tablet and mobile widths. It was run against both `/index.html` + `/demo.html` and `/dist/index.html` + `/dist/demo.html`; both runs passed without script/console errors or horizontal overflow. Captures: `screenshots/landing-desktop.png`, `screenshots/landing-mobile.png`, `screenshots/demo-desktop.png`, `screenshots/demo-mobile.png`.

### Original mascot and pinned story chapters — 2026-10-15

- Generated and added an original “Brote” guide character: a friendly book with a new leaf. It appears in the four story scenes and does not depict a real student.
- At desktop widths, the reader's ordinary vertical scroll advances a pinned horizontal sequence: question → public evidence → synthetic program → test receipt. Chapter dots and left/right arrows let keyboard users move both ways. Mobile and reduced-motion settings use the stacked reading order; no JavaScript leaves the same four complete panels in the document.
- `node --check roadmap.mjs` and `node --check tests/demo-browser.cjs`: passed. `node --test tests/funding.test.mjs tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs`: 53 passed. `node tests/demo-browser.cjs`: passed at 1440×900, 768×1024, 390×844, and 320×720; it checks mascot loading, pinned scroll translation, keyboard navigation, mobile/reduced-motion/no-JavaScript fallbacks, the demo flow, budget limits, replay, and no overflow/browser errors. `git diff --check`: passed (Git emits line-ending conversion warnings for touched files).
- Captures: `screenshots/story-desktop.png`, `screenshots/story-mobile.png`, `screenshots/landing-desktop.png`, and `screenshots/landing-mobile.png`.
- Remaining limits: the demo and receipt remain synthetic/local; no institution or payment is connected. Browser coverage is not a full assistive-technology/WCAG audit, and the chapter rhythm has not been validated with students or sponsors.


### Interactive evidence maps and Brote chapter path - 2026-10-16

- Local Brave browser confirmed the official Mapa Educativo Nacional map, the OpenArg GBA dashboard and the DatosHoy university map all load in the main-page viewer iframe. The OpenArg frame exposes the 24-party filters, indicators and map controls; DatosHoy exposes university points, search, metrics and geographic filters.
- The landing page provides an always-visible source link and source notes. The OpenArg description warns that the dashboard ranking attaches territorial indicators to school locations and is not a school-performance measure. DatosHoy's 2024 browser view conflicts with the page text fetch reporting fictional/development data; no figures were duplicated.
- `node tests/demo-browser.cjs`: **PASS** after these edits at 1440×900, 768×1024, 390×844, and 320×720. It checks all three map choices, iframe URL changes, attribution/fallback links, chapter movement, keyboard/reduced-motion/no-JavaScript states, demo limits, and no overflow or browser errors. Captures were regenerated in `screenshots/` and copied into tracked `docs/captures/`.
- Production was deployed to `https://beca-clara.vercel.app/`. The first Vercel build treated the browser `app.js` as a server function and returned 500; `vercel.json` now selects the static `dist/` output. The corrected production page loaded in Brave, and the OpenArg iframe showed its actual dashboard text and filters. No Git push or merge was performed.
- 2026-10-16: Added a problem-discovery guide to the method section. `node tests/demo-browser.cjs` verifies the link, opens the guide, and checks that it labels itself as a tool rather than interview evidence and instructs users not to record interviews. Four responsive viewport checks remained clear; no interviews were conducted or represented as results.


### Applied rules and accessible budget ? 2026-10-16

- Reproduced three UI defects before correction: 60 of 120 USD announced as 41.67% (mixed percentage/currency units); a manual contribution accepted while edited rules were unapplied; a preset error hidden in a closed configuration disclosure.
- The meter now uses USD consistently with an explicit funded/target text. Manual contributions and complete-budget actions require applied rules, reopening the editor with focus on Apply when needed. Invalid presets open the editor and focus the invalid field. Reset clears pending edits and stale errors; presets continue applying the visible rules before funding.
- New self-contained regression: node tests/demo-rules-browser.cjs ? PASS at 390?844, including both manual funding entry points and reset after an invalid configuration. Two mobile captures are in docs/captures/demo-unapplied-rules-mobile.png and docs/captures/demo-rule-error-mobile.png.
- node --test tests/funding.test.mjs ? 17 passed, 0 failed. node tests/demo-browser.cjs ? PASS at 1440?900, 768?1024, 390?844 and 320?720, including replay, balances, reduced motion and no-JavaScript chapter fallback. node --check roadmap.mjs and git diff --check passed.
- Map embed availability remains an external dependency. The previous full-page capture's blank frame is not proof of a production failure: lazy iframes and cross-origin inspection require a focused live visual check. No map-loading repair is claimed in this increment. The promotional five-hito video remains distinct from the configurable two-hito example.


### Brote motion and responsive lifecycle ? 2026-10-16

- Reproduced clipping in the final desktop scene and overlap with scene copy; switching a pinned desktop page to mobile left three chapters inert. The former CSS also bounced the mascot continuously while idle.
- Reserved a bottom lane for Brote, bounded horizontal travel by the actual character width, and kept receipt/text above that lane. Explicit image height avoids stretching from the asset's HTML dimensions. Movement is now derived from scroll position, with a resting lean in the last scene and no repeating animation.
- Pinning now responds to viewport and reduced-motion changes at runtime. Mobile, reduced motion and screens shorter than 760px restore all chapters, clear transforms and keep native anchor navigation. The stacked layout hides the inapplicable pinned progress meter.
- node tests/story-browser.cjs: PASS for containment, text separation, forward/backward settled scrolling, runtime desktop/mobile switching, 320/390/768px widths, reduced motion and 1024?600 fallback. Desktop 1440?900 and mobile captures: captures/story-fixed-desktop.png and captures/story-fixed-mobile.png.
- node tests/demo-browser.cjs: PASS at all four configured sizes, including no-JavaScript fallback. node tests/demo-rules-browser.cjs: PASS. node --check roadmap.mjs: PASS. Source/distribution synced; no new dependency or image asset.
- Brote remains a single illustrated character moved with CSS and scroll-derived transforms; it is not a skeletal animation or a WebGL scene. External map rendering remains a separate follow-up.


### Brote headline choreography and chapter gestures ? 2026-10-16

- Added an original articulated SVG rig around the existing Brote illustration and a scroll-controlled opening: enter, walk, hop, rest on the measured headline, exit. Each pose is derived from scroll position; reversing restores the same pose. Chapter gestures continue inside the previously verified bounded lane.
- node --test tests/brote-motion.test.mjs tests/funding.test.mjs: 21 passed, 0 failed. New motion cases cover narrative phase order, reverse determinism, finite/bounded parameters and body-position continuity.
- node tests/story-browser.cjs: PASS. Checks opening walk/rest/exit and exact reverse pose, desktop/mobile lifecycle, mascot containment and copy separation, reduced motion, short-screen fallback and settled chapter scrolling. Desktop and mobile opening captures were inspected visually.
- node tests/demo-browser.cjs: PASS at 1440x900, 768x1024, 390x844 and 320x720, including the no-JavaScript fallback and unchanged synthetic receipt/replay flow. node tests/demo-rules-browser.cjs: PASS. node --check brote-motion.mjs and node --check roadmap.mjs: PASS.
- Mobile and reduced motion deliberately use the static illustration with normal document scrolling. This is an original CSS/SVG adaptation of the reference's narrative behavior, not its canvas/frame asset sequence. Maps remain external explorers with their own availability.


### Evidence map activation and recoverable loading ? 2026-10-16

- In Brave, the published native-lazy iframe remained about:blank while its viewer intersected the viewport. A local A/B change to eager navigation loaded the real National map and OpenArg. The final implementation keeps initial deferral but explicitly starts an eager iframe near the viewer (200px margin) or upon source selection.
- Added loading, slow (12 seconds), offline and retry states. Each navigation replaces the iframe and invalidates older callbacks/timers. The direct original-source link remains available. A load event does not verify map tiles or data; the completion copy explicitly offers the original map if content does not appear.
- Real source checks in Brave: the National map exposed its controls and January 2025/RA 2023 notes in the explicit-load experiment. The final local viewer loaded OpenArg after retry; changing its party filter to La Matanza changed the displayed view from 8,931 to 1,201 establishments. DatosHoy loaded in the final viewer and searching UNAHUR returned Universidad Nacional de Hurlingham. These are observed external UI results, not imported data or personal eligibility evidence. DatosHoy's locations are institutional reference points; no building-level precision is claimed. Its previously documented source discrepancy is not resolved by successful rendering.
- node tests/maps-browser.cjs: PASS with explicitly synthetic response fixtures for deterministic loading, delayed/stale responses, source switching, offline/retry, CSP frame-ancestors blocking, direct map anchor activation, 390px overflow and text contrast >=4.5:1. New status copy initially measured 1.15:1 because inherited section text was light; scoped foreground colors fixed it. Captures: captures/map-loading-desktop.png and captures/map-offline-mobile.png. The fixture test does not claim that a public source is online.
- node tests/demo-browser.cjs, node tests/story-browser.cjs and node tests/demo-rules-browser.cjs: PASS. node --test tests/brote-motion.test.mjs tests/funding.test.mjs: 21 passed, 0 failed. node --check roadmap.mjs: PASS. No dependency, credentials, data ingestion or new external dataset added.


## Brote scroll refinement - 2026-10-16

- `node --test tests/brote-motion.test.mjs tests/funding.test.mjs`: 22 passed, 0 failed. The new path assertion failed before implementation.
- `node tests/story-browser.cjs`: passed. Off-stage entry/exit, raised landing, shoe/headline contact, exact reverse pose, title reveal, chapter navigation, 320/390/768px fallback, runtime viewport changes, reduced motion and short screens.
- `node tests/demo-browser.cjs`: passed at 1440x900, 768x1024, 390x844 and 320x720, no browser errors. An earlier attempt failed because the local server was stopped; it passed after restarting `node server.mjs`.
- `node --check brote-motion.mjs` and `node --check roadmap.mjs`: passed. `git diff --check`: passed with line-ending warnings.
- Captures: Brote walking, jumping, resting on the headline and static mobile alternative.
- Brave local observation confirmed natural scroll moves from entry to walking and exit. Automated browser checks cover the full timeline deterministically.
- No new dependency, WebGL renderer, copied Ato assets, payment behavior or data changes. The character remains a 2D articulated illustration; mobile intentionally uses the static accessible alternative.


## Historical receipt reconciliation - 2026-10-16

## Hackathon readiness gate refresh - 2026-10-16

## Offline demo fallback - 2026-10-16

With `demo.html` loaded from the local Node server, Playwright switched the browser to offline and completed the shared synthetic funding preset, institutional test record, receipt readout and duplicate replay rejection. The balances stayed 50/50 after the rejected replay; there were no failed requests or page errors. This validates the local simulation after load; it does not make the external educational maps or Vercel-hosted page available without internet. Capture: `docs/captures/demo-offline-receipt-mobile.png`.

Reopened Luma, LABITCONF hackathon and EDU HUB public pages. Luma states EDU HUB/accredited-university eligibility, host approval, and 4–5 participants; EDU HUB says teams of 4. LABITCONF advertises four bootcamp meetings; EDU HUB describes three conversations. Luma publishes no cutoff or remaining capacity. The October 14 bases copy says October 16 or capacity; this does not establish whether a request made today will still be accepted. The roadmap now shows these conditions and links to the three sources, while keeping the challenge open.

Executed: `node tests/demo-browser.cjs` (PASS at 1440x900, 768x1024, 390x844 and 320x720, no horizontal overflow or browser errors). Assertions verify the eligibility copy, conflicts, deadline caveat and all three link destinations. Mobile capture: `docs/captures/event-gate-mobile.png`. Facts were checked on the official public pages; no registration or organizer contact was attempted.

Reproduced a false present-tense claim after release, review and refund: the receipt said the remainder was still reserved while the dashboard correctly showed zero. The regression failed on that sentence before the fix.

The receipt now labels its original balance as historical and preserves it; a separate current reconciliation shows released + reserved + refunded = contributions, with the cap visible. Event history also labels each balance as a snapshot.

Executed: `node tests/demo-rules-browser.cjs` (PASS, 390x844: review, refund, replay rejection, immutable displayed snapshot, reset and full completion); `node --test tests/funding.test.mjs` (17 PASS); `node --check roadmap.mjs` (PASS); `git diff --check` (PASS, line-ending warnings only). Capture: `docs/captures/receipt-after-refund-mobile.png`. No financial rules changed; all money and records remain synthetic and in memory.


## Statistical evidence lab, contribution tree and companion — 2026-10-17

- Committed the official DiNIEE “Tasa de Abandono Interanual” series (2012-13 → 2024-25; 24 jurisdictions; primaria/secundaria) as `data/abandono-interanual.mjs`, reproducibly generated by `scripts/build-evidencia.mjs` from the official workbook; source URLs, download date and the published method limitations live inside the module. Province geometry is the official Georef/IGN dataset in `data/geo-provincias.mjs`. Nothing is fetched at runtime; no figure is derived or interpolated by the site.
- `node --test tests/evidence.test.mjs`: **5 passed, 0 failed** (data-shape invariants: 24 jurisdictions × 13 years, published ranges preserved, national series present, negative values kept as published). `node --test tests/`: **63 passed, 0 failed**.
- `node tests/evidence-browser.cjs`: **PASS** at desktop 1440 and mobile 390 — choropleth/points toggle, primaria/secundaria, year rail, ranking selection, series chart with dashed national reference, full table, keyboard selection on map paths and ranking, teaser growth (3 leaves + 1 fruit), companion arming, and no horizontal overflow. A second pass with reduced motion keeps the lab, teaser and companion readable; `node --check evidence-map.mjs` and `node --check tree.mjs`: PASS.
- `node tests/tree-browser.cjs`: **PASS** — empty scenario stays bare, the shared preset grows 2 leaves, the institutional test record adds exactly 1 fruit (no leaf), review state pauses the copy, refund marks the leaves, reset returns to the bare tree.
- Regressions after the change: `node tests/demo-browser.cjs` **PASS** at 1440×900, 768×1024, 390×844 and 320×720 for both source and `/dist/`; `node tests/story-browser.cjs` **PASS**; `node tests/demo-rules-browser.cjs` **PASS**; `node tests/evidence-browser.cjs` and `node tests/tree-browser.cjs` also run against `/dist/index.html` and `/dist/demo.html` with the same PASS results.
- Dist sync verified by Node SHA-256: all checked source/dist pairs identical (site files, `data/`, docs, captures). The offline ZIP was rebuilt (`node scripts/build-offline-demo.mjs`, 12 files, 1,737,175 bytes), extracted into a clean folder and served by its own `node server.mjs`: the tree grew 2 leaves + 1 fruit with zero external requests and no console/page errors. This validates the extracted ZIP only; the external explorers remain online-only by design.
- Ground ellipse added under the trunk in both tree SVGs after inspecting regenerated captures; all tree-related suites were re-run after this final edit. Captures: `docs/captures/evidencia-desktop.png`, `evidencia-mobile.png`, `arbol-teaser.png`, `arbol-demo.png`, `companero-desktop.png`.
- Limits: this is not a screen-reader/WCAG audit or a user study; negatives and the Buenos Aires regime-change note are shown as published, and jurisdiction aggregates are not causal evidence for any individual or scholarship. `git diff --check`: clean (line-ending warnings only). No commit, push or deploy.


## Bugfix round (B1–B6) — 2026-10-17

Detection preceded the fixes: three parallel agents on different free models (static code/data/dist/ZIP review; landing runtime; demo/lab/visual) plus primary re-validation of every claim with its own repro. One agent claim (negative rows reaching the ranking top-5) was downgraded to hardening: unreachable with the current data, where each year keeps ≥5 positive jurisdictions.

- B1 — Stale cache-bust: `laboratorio.html` (`styles.css`, `app.js`) and `respaldo.html` (`styles.css`, `judge.mjs`) were still on `?v=16` while this branch had already changed `app.js` and the laboratorio markup. Both pages now use `?v=28`, and the new `tests/versions.test.mjs` enforces a single version across all four pages in source and `dist/`. `node --test tests/versions.test.mjs`: PASS.
- B2 — Map viewer success claim: in Chrome a refused or CSP-blocked frame commits an error page and fires `load`, never `error`, so the old copy (“El visor terminó de cargar…”) could sit over a blank frame. The viewer now (a) uses neutral copy that is true in both cases — “La carga del visor finalizó. Si no aparece el mapa, abrilo completo o reintentá.” — and (b) runs a `no-cors` preflight fetch that puts the viewer into an explicit unavailable state with retry (“No se pudo abrir el visor. Reintentá o usá el mapa completo.”) when the host rejects; a failure guard keeps a late error-page `load` from overwriting it. `tests/maps-browser.cjs` gained a real `route.abort('connectionrefused')` case that then recovers on retry: PASS.
- Test bug found during B2: the untracked `maps-browser.cjs` deep-link assertion had never run green. `#datos-abiertos` is a ~3.8k-px section and the loader intentionally starts only when the viewer is within 200px, so a deep link alone correctly leaves it resting (state `waiting`); the assertion now scrolls the viewer into view before requiring `loading="eager"` and `external`. No product change was needed for deep links.
- B3 — Chart axis: `evidence-map.mjs` clamped published negatives with `Math.max(0, value)`. The y-domain now extends to a negative floor snapped to the grid and negative grid labels are drawn. `tests/evidence-browser.cjs` asserts that Neuquén primaria 2020-21 (−1.16) plots below the zero line: PASS.
- B4 — Offline kit dead links: the builder exports `buildOfflineEntries`/`buildOfflineZip`, adds a 13th entry (`index.html` shim in Spanish: offline-copy note, link to `demo.html`, online landing URL) and, in the zipped copy only, replaces the self-download paragraph with “Ya estás dentro del respaldo offline…”. New `tests/offline-kit.test.mjs` asserts the entries, shim and transformed paragraph. Rebuilt ZIP: 13 files, 1,738,358 bytes; extracted to a clean folder and served on a scratch port: shim → demo → “Propuesta y roadmap” → shim round trip with zero external requests and no 404s.
- B5 — Duplicated `prefers-reduced-motion` block removed from `styles.css`; count is now 1. `node tests/story-browser.cjs`: PASS.
- B6 — Ranking bar: a negative row now renders a zero bar instead of a positive-looking 4% bar (unreachable with current data; one-line hardening). Covered by `evidence-browser.cjs`.

Regressions after the fixes: `node --test tests/`: **65 passed, 0 failed** (63 + `versions` + `offline-kit`). Browser suites **PASS** for source and `dist/`: `demo-browser` (4 viewports, no browser errors), `story-browser`, `tree-browser`, `evidence-browser`, `maps-browser`; `demo-rules-browser` runs its own local server. `git diff --check`: clean (line-ending warnings only). Dist re-synced with Node SHA-256 comparison (site files, `data/`, docs, captures); captures regenerated (`map-loading-desktop.png`, `map-offline-mobile.png`, `evidencia-*.png`, landing/story set). No commit, push or deploy.
