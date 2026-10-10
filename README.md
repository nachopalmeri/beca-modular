# Beca Modular — interactive product lab

Spanish product website and transparent financial model. No installation, credentials, remote fonts or external runtime dependencies. This is a **local interactive simulation**, not a deployed payment system or an AI inference service.

Run from this folder: `node server.mjs`, then open http://127.0.0.1:4178. `node --test tests/model.test.mjs tests/yield.test.mjs` checks accounting, session state and treasury scenarios. `node tests/browser.cjs` checks the site using the already bundled Playwright runtime (see QA report).

## Deliverables

- [Source of truth, product and business strategy](docs/product-strategy.md)
- [Web3 and AI architecture](docs/architecture.md)
- [Financial assumptions and formulas](docs/financial-model.md)
- [Competition, pitch, roadmap and validation](docs/execution.md)
- [Sources and inspection limits](docs/evidence-register.md)
- [Design brief and verification](docs/qa.md)
- [Treasury options, stress model and beneficiary policies](docs/yield-strategy.md)
- [Learning guide — repository draft](docs/learning-guide.md)

## Implementation map

`index.html`: semantic sections and UI. `styles.css`: responsive visual system. `app.js`: interaction wiring and rendering. `model.mjs`: pure financial and demonstration-state functions, shared by browser and tests. `server.mjs`: localhost-only static server with restricted paths. No user input is uploaded. Nothing is persisted across reloads.

This standalone format avoids introducing dependencies into a research repository. Proposed hackathon backend: React/TypeScript UI, Node/Express, Supabase and the existing MIT Pay Kit adapter. The website is deliberately independent of that future integration. No new chain settlement or LLM call is claimed.
