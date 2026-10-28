# Beca Modular — next steps to hackathon

## Current presentation-video/web slice — 2026-10-28

- [x] Create three narrated Spanish presentation videos (product thesis, guided simulation, evidence-first roadmap) as original motion graphics; keep synthetic/status claims explicit.
- [x] Build a responsive presentation page with MP4 playback, downloadable files, readable transcripts, and links from the product’s main routes.
- [x] Replace the generic existing promo-video placement with the product-specific presentation; sync `dist/` and the offline kit.
- [x] Verify MP4 duration/codec/audio/subtitles, view representative frames, and QA the web page at mobile and desktop widths with reduced-motion/accessibility checks.
- [x] Update the presentation kit and QA evidence; no publish/deploy without separate authorization.

Assumption: use the installed offline Spanish system voice and original animated graphics. Do not claim generated footage, a Higgsfield connection, live AI inference, real payments, or measured impact.

Updated 2026-10-17. Repo: `D:\Dev\Hackaton\beca-modular`. Work branch: `feat/funded-milestone-receipt`, based on `main` at `464984e3374585366d68faacbbef1c6ca42a5024`. Keep work off `main`; no push or merge. The current site is deployed at `https://beca-clara.vercel.app/`.

## Evidence lab, tree and closing scene — 2026-10-17

Goal: make the landing and demo more statistical and interactive with official open data, keep the evidence discipline (cite, caveat, no invented figures).

- [x] Download and parse the official DiNIEE "Tasa de Abandono Interanual" series (2012-13 → 2024-25, 24 jurisdicciones) and the Georef/IGN province geometry; commit generated modules under `data/` plus the reproducible generator `scripts/build-evidencia.mjs`.
- [x] Build `evidence-map.mjs`: interactive Argentina map (choropleth + points toggle), year rail 2012-13→2024-25, indicator toggle (primaria/secundaria), jurisdiction readout, linked series chart with national reference, ranking strip, full data table, keyboard access and reduced-motion/table fallbacks.
- [x] Insert the lab into `index.html` inside `#datos-abiertos`, above the existing external explorers.
- [x] Build `tree.mjs`: contribution tree for the demo (leaf per synthetic aporte, fruit per released milestone, refunded/returned leaves, review state) and a landing teaser with a fixed illustrated example.
- [x] Add the closing companion scene (teal panel, Brote resting, sprout growth on scroll) at the end of the landing.
- [x] Tests: data invariants (`tests/evidence.test.mjs`), browser regression for the lab and the tree; four-viewport check; captures.
- [x] Docs: ux-redesign section, qa entries, dist sync, version bump v28.

Acceptance: no invented figures; every number traceable to the committed file and its official URL; negative values shown as published with the method caveat; mobile layout without horizontal overflow; reduced motion and no-JS keep the content readable.

## Bug hunt + fix plan — 2026-10-17

Detection: three parallel agents with different free models — reviewer `opencode/glm-5.3-flash-free` (static code/data/dist/ZIP review), general `opencode/longcat-2.5-preview-free` (landing runtime), general `opencode/nemotron-3.5-super-vl-free` (demo/lab/laboratorio/dist/visual). Cost $0 (free tier). Every finding below was re-validated by the primary with its own repro; one agent claim (negative rows reaching the ranking top-5) was downgraded to one-line hardening because each year currently has ≥5 positive jurisdictions. All six were fixed on 2026-10-17 and re-verified; results below.

- [x] B1 [P1] Stale cache-bust on `laboratorio.html` (`styles.css?v=16`, `app.js?v=16`) and `respaldo.html` (`styles.css?v=16`, `judge.mjs?v=16`) → bump both to `?v=28`. Why: this branch changed `app.js` (deleted the `#load-education-map` listener) while `laboratorio.html` dropped that element; a returning visitor with `?v=16` cached runs the old module against the new markup and also misses the new CSS. Evidence: version grep across pages (index/demo = v28; laboratorio/respaldo = v16); `git diff app.js`. Verify: single version across all pages; `node tests/demo-browser.cjs` (it opens laboratorio); sync dist. Optional hardening: a tiny node test asserting every page references one current `?v=` per asset.
- [x] B2 [P1] Map viewer claims success after a failed external navigation. `roadmap.mjs:89`: in Chrome a refused or CSP-blocked frame fires only `load` (error page commits), never `error`, so the state machine shows "El visor terminó de cargar…" over a blank frame and the 12s slow timer is cleared. Primary repro: route.abort(connectionrefused) + tab click → `data-load-state=external` with that sentence, still after 12s. Fix: neutral copy true in both cases, keeping the phrases the tests rely on — "La carga del visor finalizó. Si el mapa no aparece, abrilo completo o reintentá." Optional B2b: `fetch(src,{mode:'no-cors'})` preflight to set `unavailable` when the host rejects (one extra request; deterministic). Verify: repro script asserts the new copy; `node tests/maps-browser.cjs` (+ add a real-abort case).
- [x] B3 [P2] Series chart clamps published negatives to the 0 line (`evidence-map.mjs:116`, `Math.max(0,value)`), while readout/table/tooltip show them as published. Fix: extend the y-domain with a negative floor (min(0, floor(min/step)*step)) plus negative grid labels; alternative (weaker, only if that misbehaves): keep the clamp with an explicit chart note. Verify: Neuquén primaria 2020-21 = −1.16 must plot below the 0 line; add that assertion to `tests/evidence-browser.cjs`; regenerate `docs/captures/evidencia-*.png`.
- [x] B4 [P2] Offline ZIP dead links: zipped `demo.html` keeps `href="index.html#roadmap"` (`demo.html:19`, no index.html in the kit) and the self-referential `beca-demo-offline.zip` download (`demo.html:163`). Fix in `scripts/build-offline-demo.mjs`: (a) generate a tiny Spanish `index.html` shim entry (offline-copy note + link to demo.html + online landing URL); (b) in the zipped copy only, replace the download paragraph with "Ya estás dentro del respaldo offline…". Refactor the builder to export `buildKit()` so a node test can assert entries + shim + transformed paragraph; keep the CLI. Verify: rebuild → `tar -tf` → extract to temp → `node server.mjs` → click both links, no 404s.
- [x] B5 [P2] Duplicate reduced-motion rule: `styles.css:566` repeats `styles.css:551` verbatim (`.story-mascot,.story-mascot img{animation:none!important;…}`). Delete the later copy. Verify: grep count = 1; `node tests/story-browser.cjs`; sync dist.
- [x] B6 [P2] Ranking bar hardening (`evidence-map.mjs:155`): `Math.max(4, value/max*100)` gives a negative row a 4% beige bar. Use `value < 0 ? 0 : Math.max(4, …)`. Reachability is near zero with current data (≥5 positive jurisdictions every year); one-line fix so the display can never contradict the sign. Verify: `node tests/evidence-browser.cjs`.
- [x] F Final pass after B1–B6: full regressions (`node --test tests/`, demo/story/evidence/tree/maps/demo-rules browser suites at 4 viewports, source + dist), rebuild + re-extract the ZIP, hash-sync `dist/`, update `docs/qa.md` and `docs/ux-redesign.md` (map copy, chart axis, zip shim), regenerate captures. No push or deploy.

Accepted as-is (documented, not fixing): external-source availability; mixed-content iframe console noise; sticky-header screenshot artifact; published negatives in readout/table; leaf/companion geometry already browser-verified this round.

Fix round executed — 2026-10-17: B1 bumped `laboratorio.html`/`respaldo.html` to `?v=28` and added `tests/versions.test.mjs` (single version across source and dist). B2 shipped the neutral copy plus the recommended B2b `no-cors` preflight with a failure guard, and a real-abort browser case; while adding it, the never-green deep-link assertion in the untracked `maps-browser.cjs` turned out to be a test bug (the loader intentionally starts only within 200px of the viewer; the test now scrolls first). B3 added the negative-floor axis and the Neuquén −1.16 below-zero assertion. B4 added the kit `index.html` shim and the transformed self-download note, exported as `buildOfflineEntries` with `tests/offline-kit.test.mjs`. B5 removed the duplicate reduced-motion rule; B6 gives negative rows a zero bar. Regressions: `node --test tests/` 65 pass; demo/story/evidence/tree/maps suites PASS at 4 viewports for source and dist; ZIP rebuilt (13 files, 1,738,358 bytes) and e2e-verified from a clean extraction with zero external requests; dist hash-synced; captures regenerated. No commit, push or deploy.

## Current slice — complete locally

- Make the synthetic budget and two tranche rules editable and enforce that their sum equals the cap.
- Connect categorized progress to release, replay rejection, remaining balance and a readable receipt.
- Explain that content consumption/self-report are not academic verification and that this remains an in-memory simulation.
- Improve the short demo's editorial hierarchy and responsive header; record Taste Library/Ato design choices and evidence limits.
- Tests: 53 Node tests pass; `node tests/demo-browser.cjs` passes at desktop/tablet/mobile/narrow-mobile; `git diff --check` passes. OpenArg dashboard now opens as a full-page external resource rather than a clipped iframe; sponsor rule mismatch receives inline feedback and accessible focus.
- The current static landing, four-step Brote story, source-cited external map viewer, and demo are published in Vercel. Production browser check passed; there is no live data ingestion or institutional/payment integration.
- A neutral, privacy-aware problem discovery guide is linked from the method section; the browser regression checks its link and disclosure. No interviews are reported as evidence.

## Open decisions before expanding scope

- As of 16/10, Luma still shows “Request to Join” with approval required but no published deadline or capacity. The official-bases copy saved 14/10 says 16/10 or capacity; current closure and available seats remain unverified. LABITCONF's EDU HUB page says teams of 4, while the event page/Luma and dated copy say 4–5; the bootcamp event card says four sessions while EDU HUB describes three conversations. Resolve those discrepancies before stating one rule or schedule.
- Confirm team members and get the actual challenge, judging criteria, pitch format, day-one schedule, prior-code/AI policy and bootcamp schedule from current organizer materials.
- Use only the current, cited official event details in the website. Keep the 14/10 copy for historical comparison; do not overwrite it.
- Validate the core problem with sponsor, academic and student perspectives if access is available; record themes only, no personal data.
- Ask whether prior code, AI use and testnet work are allowed, then decide if a testnet spike belongs in the event scope.

## Dependency-ordered work

1. **Problem and demo script** — depends on confirmed track/brief. Acceptance: one real problem statement, a sub-30-second local demo, and claims all matched to evidence.
2. **Trust and state diagram** — depends on accepted scenario. Acceptance: roles/authority, pause, appeal, replay and no-funding/abandonment outcomes are explicit and reviewable.
3. **Testnet feasibility spike (conditional)** — depends on permission and a challenge that needs it. Acceptance: reproducible compile, testnet-only transaction/verification, and a written fallback to simulation if any prerequisite fails.
4. **Pre-event QA and pitch** — depends on 1–3. Acceptance: seeded demo, offline backup, mobile/desktop screenshots, short pitch and candid limitations.

Next action: the team must confirm its registration approval/capacity and current cutoff directly with the organizer, then update readiness. This repo work does not submit registrations or send messages.


## UX redesign slice — 2026-10-15

- [x] Inspect the source landing, simulator, product notes, live Heyato story structure and public-data references. Preserve the existing branch and user changes.
- [x] Keep the student-tranche canonical model; label the budget and receipt as synthetic.
- [x] Add a first-screen flow preview and four-step pinned horizontal story driven by native vertical scroll; stack the same content on mobile and under reduced motion.
- [x] Add an evidence candidate with source/period limitations, external OpenArg labeling, and the eight-step program-design method from the bootcamp transcript.
- [x] Sync source to dist; verify source/dist, keyboard navigation, mobile and reduced-motion behavior, no-JS fallback, checks and screenshots. There is no separate landing build script/package manifest in this static project.
- [x] Record final evidence and blockers in QA/design notes.


## UX rule correctness ? 2026-10-16

- [x] Reproduce and fix mixed progressbar units for budgets other than 100 USD.
- [x] Prevent manual funding against previously applied rules while the visible editor contains pending changes.
- [x] Expose preset validation errors in a closed editor and preserve focus; reset clears pending/error state.
- [x] Run focused mobile browser regression, four-viewport regression and funding-model tests; sync static distribution.
- [x] Reproduce native-lazy empty frames, verify explicit loading against real sources, and capture slow/offline handling with clearly synthetic fixtures. External availability and dataset validity remain separate from load-event completion.


## Brote corrections ? 2026-10-16

- [x] Reproduce mascot clipping, copy overlap and inert chapters after desktop-to-mobile resize.
- [x] Bound character movement, reserve its own lane and replace idle bouncing with scroll-derived motion.
- [x] Restore chapter access when viewport or reduced-motion changes; use stacked fallback on short screens.
- [x] Verify geometry, settled forward/backward scroll and responsive lifecycle; preserve desktop/mobile captures and sync dist.


## Brote headline choreography ? 2026-10-16

- [x] Reinspect Heyato in Brave and record sticky opening, headline placement, canvas/poster fallback and mobile scaling.
- [x] Add original paper arms/leaf shoes and a reversible enter/walk/hop/rest/exit timeline tied to the headline.
- [x] Connect chapter gestures, provide a skip anchor, preserve static mobile/reduced-motion/no-JavaScript content.
- [x] Run 21 motion/funding tests and three browser regressions; inspect opening desktop/mobile captures; sync dist.


## Recoverable maps - 2026-10-16

## Brote scroll refinement - 2026-10-16

- [x] Reinspect live Heyato word reveal and canvas frame progression.
- [x] Reproduce missing raised landing and in-frame fade-out with a failing motion test.
- [x] Implement off-stage entrance/exit, raised landing, contact shadow and readable title reveal.
- [x] Test exact reverse pose, shoe/headline contact, entry/exit, responsive and reduced-motion fallback.
- [x] Run 22 motion/funding tests and the four-viewport demo browser regression.
- [x] Sync distribution and publish the verified revision to the previously authorized Vercel site.

Deployment dpl_9tMnjoMHpqQ3ffGXB3r8vvKqwMAz is READY and aliased to https://beca-clara.vercel.app. Brave confirmed v26, the new contact shadow, walking at progress 0.1804 and rest at 0.7120. No commit, push or main merge.

- [x] Compare native lazy and explicit loading against the real external sources.
- [x] Start the map near the viewer; add slow/offline/retry feedback and isolate stale responses.
- [x] Verify live OpenArg filtering and university search, and synthetic blocked/delayed/offline states plus contrast.
- [x] Preserve source attribution and institutional-location limitations.

Production verification: Vercel deployment dpl_H6hUxEWn9SnvzY4QPDXhA49ZPmvw is READY. Brave loaded the actual OpenArg dashboard heading inside https://beca-clara.vercel.app/#datos-abiertos through the new viewer. No commit, push or main merge performed.


## Historical receipt reconciliation - 2026-10-16

- [x] Reproduce present-tense reserved-balance claim after refund.
- [x] Preserve receipt snapshot and display current reconciliation separately.
- [x] Verify review, refund, replay, reset and completion at mobile size, plus 17 model tests.
- [x] Sync distribution.
- [x] Publish and verify revision 27.

Vercel deployment dpl_Sc4WpF1h24qtkU8CzPzpkHaa1o1r READY. Actual Brave production flow: two contributions, first institutional test record, review, confirmed refund. Historical receipt stayed at 50 released / 50 reserved; current reconciliation showed 50 released + 0 reserved + 50 returned = 100 contributed. No commit, push or main merge.


## Hackathon readiness refresh - 2026-10-16

- [x] Recheck Luma, LABITCONF hackathon and EDU HUB public summaries.
- [x] Add a sourced pre-event checklist for eligibility/approval, team-size conflict, bootcamp-count conflict and stale deadline caveat.
- [x] Keep prompt selection, deadline and agenda status unresolved where the public pages do not prove them.
- [x] Verify all three links and copy at four viewport widths; capture mobile card; sync dist.
- [x] Publish and verify the checklist in production.

Vercel deployment dpl_4Rygudkpt3cKHPkjZUTuyBtjCuxa READY. Brave production accessibility tree showed all three bullets and official links. No registration, organizer contact, commit, push or merge.
