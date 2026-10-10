# MVP, competition, validation and operating risks

Date: 2026-10-10. Proposed primary track: **Nueva Educación**. Official landing page verifies four tracks and 48-hour functional build. Prior inspected bases record 1-minute pitch + 1-minute Q&A, 4–5 members, challenge assigned before build, day-one venue closure at 19:30. Specific prompt, rubric, current named jury and AI/pre-existing-code permission remain unresolved; see evidence register.

## Competitive case

One memorable capability: sponsor grants a bounded educational allowance; a learner obtains a priced approved resource; provider receives exact authorized amount; unused budget is reconciled with independently inspectable sandbox settlement. It could stand out if the live flow is reliable, the human need is specific and the team explains the trust boundaries. No prediction of juror votes.

Closest alternatives: Guild (direct education benefit payments), Scholarship America (program administration), Moodle + payment processor (course delivery/progress + conventional billing). Progresar and DirectEd directly undermine novelty claims around milestone scholarships. What is original must be established with a concrete underserved workflow. Main competitive weakness: sponsors may prefer invoices and a closed LMS; providers may reject per-unit prices; an integration is easy to replicate.

## Scope

One test sponsor, synthetic student, one provider per channel, three approved content units, capped signer, delivery event, cumulative voucher, sandbox close/receipt/refund and durable state. Student progress display explicitly separates delivery and teacher assessment. Optional route advisor can remain tagged deterministic logic; never delay core for AI.

Exclude: production funds, new smart contracts, speculative tokens, wallet recovery service, memecoin revenue integration, university APIs, custom ZK, open marketplace, automated abandonment, legal trust, employment predictions and multi-agent purchases.

## Team and 48-hour critical path

| Time | Critical path / milestone | Parallel assignments |
|---|---|---|
| 0–2 | Prove sponsor-controlled cap, provider receipt and close; define exact delivery unit | All inspect hardest assumption. If fail, conventional adapter fallback explicitly labeled. |
| 2–4 | Freeze catalog, unit prices, data schema, API contract and demo | D1 product/React; D2 API/DB; D3 MPP adapter/signing; D4 content/pitch/QA. |
| 4–8 | API returns approved catalog; auth binds sponsor/student/allocation | D1 roles/catalog, D2 transaction ledger, D3 sandbox channel, D4 content and adversarial fixtures. |
| 8–12 | First priced unit authorizes monotonic voucher | Integrate price lookup, idempotency and signer. D4 records cluster and amount evidence. |
| 12–16 | Close/refund and settlement reconciliation visible | D1 status UI; D2 persistence/recovery; D3 close and receipt; D4 test edge cases. |
| 16–20 | One complete route works after reload; no fake settlement | Integration checkpoint. Freeze adding features. |
| 20–24 | Role isolation, wrong resource/payee, duplicate and cap tests | D4 independent reproducibility; D2/3 fix critical failures. |
| 24–28 | Failure/retry and close recovery; optional AI vs filter spike only if core ready | D1 accessibility/mobile; D4 timed demo and honest fallback. |
| 28–32 | Deploy/preflight approved environment and restore from clean start | End-to-end deadline; capture actual transactions and exact versions. |
| 32–36 | Security/reliability fixes; pitch and skeptical Q&A | No new features. |
| 36–40 | Three rehearsals on stage-like connection; submission preparation | D4 scripts, D1 visual clarity, D2/3 standby. |
| 40–48 | Contingency, rest, final demo and permitted submission | Reserve, not 32 extra person-hours of features. |

This is not 192 productive engineer-hours. Work after day-one closure needs offsite arrangements; confirm team rest and availability. A production auth/custody system is beyond hackathon scope.

## Decisive two-hour technical spike (not executed as part of this website)

Hypothesis: existing MPP stack can implement sponsor-controlled authorization for a student-requested resource without giving student/AI unbounded financial power.

0–20 min: use local MIT Pay Kit version 0.13.1 checkout, existing sandbox-only example, synthetic catalog with fixed integer prices; create sponsor test context and one student allocation.

20–50 min: reserve 1 USDC test budget, open channel to pinned provider, bind request to student/session/catalog, authorize delivered unit. Student cannot substitute price or recipient.

50–80 min: run tampered price, duplicate resource, unauthorized role, stale/nonmonotonic voucher and over-cap attempts. Assert ledger remains unchanged and invalid authorization never reaches settlement.

80–105 min: close and query correct sandbox RPC; confirm successful transfer amount and return equal deposit exactly. Restart service and inspect persisted final state. Never query mainnet and call a null result failure/success on another cluster.

105–120 min: record command, versions, network, receipt signature, transfer amounts, failures and limits. Check recovery branch or mark it unproven.

PASS: provider/mint/network bound, cap enforced by actual adapter, duplicate not billable twice, unauthorized caller cannot authorize, close transfers reconcile, restart does not reopen spend. FAIL: any invalid attempt becomes billable, stale state changes liability, wrong provider, or only a mock is available. The UI simulation cannot satisfy this gate. Recovery unavailable under time budget is a partial pass, not a full security pass.

## Neutral business validation

- Sponsor: show last actual program invoices/allocation (anonymized), identify recurring reconciliation failure or upfront-access problem, measure current time, then ask willingness to pilot at an explicit license price. GO requires concrete workflow evidence and commitment, not positive feedback.
- Provider: negotiate one unit definition and price, delivery evidence, failure/retry and dispute terms. FAIL if content rights or billing model make modular access impossible.
- Student: compare existing funded-access process versus mock route. Check understanding of cap, privacy, pause and no debt. GO requires fewer actual access steps or a removed verified upfront barrier; do not measure preference using only enthusiastic pitch reactions.
- AI: randomized small comparison against tag filters with identical catalog; measure correct IDs, prerequisites, time and teacher relevance. Drop AI if no improvement.

## Risk register

| Risk | Severity | Mitigation / kill condition |
|---|---|---|
| No buyer problem | Critical | Kill if existing invoices/LMS/direct pay suffice and nobody commits pilot. |
| Providers will not price modules | Critical | Written one-provider unit agreement before full build. |
| Protocol cannot bind sponsor-funded student use safely | Critical | Two-hour adapter spike; remove financial claims if not proven. |
| Financial base model weak | High | Pilot true support/payment costs and willingness to pay. Current base loses money. |
| Delivery fraud/collusion | High | Define measurable unit, audit trails, disputes; don't call chain proof of education. |
| Concurrent allocations overspend | High | Atomic reservation across sessions, not UI-only balance. |
| Server outage locks funds | High | Verify protocol unilateral close/time windows; show unavailable state honestly. |
| Privacy/custody/legal burden | High | Synthetic demo only; review before pilot with real funds/data. |
| Automatic reassignment harms student | High | Human review, notice/grace/appeal and no clawback. |
| Exact challenge incompatible | Critical | Switch to challenge-appropriate scaffold; do not force fit. |
| Stablecoin/creator volatility | High | No memecoin dependency; production treasury risk review. |

## Demo and pitches

10-second hook: “Una beca no debería pedirte que primero tengas el dinero para estudiar.”

30 seconds: show student's goal/catalog (0–5), sponsor cap (5–10), actual delivery + voucher and rejected over-cap (10–20), sandbox settlement + returned balance (20–30). Current website can explain this sequence but is local simulation. An integrated demo must show actual network evidence. If RPC fails: execute local flow clearly labeled and show previously recorded sandbox trace only as recording; never call it live.

60-second script and 2-minute investor script are in the website's pitch section. Use its proposed-demo wording only when stage flow is connected; otherwise explicitly say “esta web simula”. Keep the distinction between grant access, content delivery and actual assessment. No personal poverty story is presented as an interviewed person.

## Additional judge questions

1. Who says a module was delivered? Service/provider; agreed auditable unit, not AI or blockchain truth.
2. How do you refund bad content? Separate commercial dispute/refund procedure; settled chain transfer is not retroactively editable.
3. Why isn't this Guild? Similar core value exists. Need to prove small-program modular cross-provider reconciliation advantage.
4. Why not free courses? If they serve the student's need, use them; avoid charging for available adequate alternatives.
5. Does the student receive tokens? Not in MVP; sponsor pays approved provider. Stipends are a different roadmap.
6. Who holds keys? Sponsor test signer in adapter; production custody unresolved. No secrets in frontend.
7. Does unused money support a second student automatically? No. It returns to payer then follows approved allocation policy.
8. Are you promising employment? No; only access and observed delivery can be measured initially.
9. What happens without AI? Catalog filters continue; AI is optional until experimentally better.
10. What happens without blockchain? Central payments may work better. Compare against multi-party transparency requirement.
11. Does MPP prove grades? No. Teacher/institution attestation is a separate trust boundary.
12. Do creator fees pay for the core program? No. Optional voluntary contributions after independent integration proof.
13. What is actually built? This website and local model; prior sandbox test separately documented.
14. What would reverse this decision? No buyer/provider commitment, poor economics, unsafe authorization, or challenge mismatch.

## Next decision deadline

Within 72 hours of a real validation session: one sponsor workflow, one provider unit agreement, student comprehension test and two-hour adapter spike. Lock hackathon scope only after assigned challenge is known and prior-code/AI rules confirmed. The next concrete action is to validate an actual program's billing unit and sponsor authorization; not add a second smart contract.
