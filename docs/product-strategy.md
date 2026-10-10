> Corrección de alcance — 10/10/2026: revisada la transcripción completa del audio original. La propuesta principal paga tramos al ESTUDIANTE por materias aprobadas por una institución. La web ahora lo explica primero y ofrece una simulación local. El contenido siguiente documenta el COMPLEMENTO de pago por contenido al PROVEEDOR, no un escrow académico implementado. MPP no certifica materias ni reasigna becas. Presupuestos separados; IA no autoriza pagos. No hay contrato de becas desplegado ni demanda validada.

# Beca Modular — product source of truth

Version: 2026-10-10. Status: research-backed concept, working explanatory website, **no validated business**.

## Decision

Design a B2B2C funding and reconciliation tool for **small NGO/foundation programs funding short digital-skills modules across a closed provider catalog**. This beachhead is a hypothesis chosen for a narrow pilot: an existing cohort, one decision maker and two providers. Employers are a later segment: they may have larger budgets but incumbent coverage and procurement/integration demands. Universities add academic integration and approvals. None is a confirmed customer.

The product funds educational access, not student living expenses. The student is the beneficiary, the institution pays, approved providers receive content payments, and the platform invoices a separate license. No investor return, student debt, proprietary token or speculative yield.

## Problem and demand boundaries

Precise hypothesis: some sponsored short-course programs need learners to access approved modules without advancing tuition, while administrators reconcile usage across providers. Current workarounds: direct tuition payment, vouchers, LMS enrollment, reimbursement, spreadsheets and invoices. Guild already provides direct education payments; Scholarship America administers institutional scholarships. These sources support existing workflows, **not demand for our product in Argentina**. Progresar already conditions payments on certification. Do not claim tranche release or removing upfront tuition is new.

What must be true: a sponsor has a costly recurring reconciliation/access problem; providers accept a billable unit at a negotiated price; students can use those units meaningfully; program savings/benefits exceed platform and payment overhead; a conventional processor is inadequate for the chosen multi-party flow. If these are false, simplify or abandon.

## Personas and jobs

| Role | Job | Value hypothesis | Adoption obstacle |
|---|---|---|---|
| NGO program manager / buyer | Allocate restricted funds and reconcile delivery across providers | One ledger of commitments, spend and remaining balances | Existing invoices may be adequate; no budget for another tool |
| Student / beneficiary | Start a useful course without advancing cash | Sponsor-funded access and informed choice, with pause rights | Device/connectivity, quality, accessibility and onboarding |
| Provider | Supply approved modules and receive agreed payment | Clear rate and auditable settlement | Per-module economics may conflict with course licensing |
| Administrator | Apply rules and resolve exceptions fairly | Explicit review queue, permissions and consent trail | Additional work, legal responsibility and oracle accuracy |

Positioning: “Infraestructura para programas que financian formación por módulos, con presupuestos acotados y conciliación entre instituciones y proveedores.” The buyer-facing offer is administration and reconciliation; the student-facing offer is funded access. Blockchain is implementation, not the student proposition.

## Lifecycle and product requirements

1. Sponsor defines program, catalog and educational reserve; agrees platform license separately. Human administrator sets eligibility, withdrawal and appeal policy.
2. Student enrolls with informed consent. No identity or grades on chain. No automated poverty/eligibility score.
3. Student states a goal; optional AI proposes approved module IDs and explanations; student chooses. Deterministic prerequisite and budget checks run afterwards.
4. Sponsor-controlled payer approves **one provider/session ceiling** after allocation validation. The student does not receive unrestricted signing authority.
5. Provider delivers a clearly specified unit. Idempotent delivery confirmation permits the authorized signer to issue a new cumulative voucher. Define delivery failure/retry before billing.
6. MPP settles the highest accepted total; close returns unused deposit to its payer. Program allocation is reconciled separately off chain.
7. Remaining uncommitted allocation may be reused only under agreed program rules, notice, grace period and human review. Already paid funds are not automatically recovered.
8. Reporting distinguishes reserved, authorized, settled, returned, disputed, content-delivered, evaluated and approved. A watch event is not an educational outcome.

## Business and go-to-market

- Primary hypothesis: subscription per institution/month, assuming exactly one active program per institution in the model. Multiple programs require a separately validated pricing policy; the simulator does not silently multiply the license. Illustrative base price **USD 250/month**, not a benchmark or quote. No sales or willingness-to-pay evidence.
- Transaction surcharge: optional alternative, disabled in base. If enabled, separately invoiced to sponsor on delivered-content spend. Never deducted from educational reserve or provider payout in the model. Avoid charging overlapping “administration” fees for the same service.
- Integration/reporting services: later negotiated work, excluded from simulator; estimate effort before offering.
- Distribution: direct outreach to existing small program administrators; a bounded pilot with one cohort and two providers. No mass marketplace or speculative community launch.
- Pilot contract gates: signed content-unit definition, provider rates, responsible payer/signer, dispute SLA, consent, withdrawal rights, reserve accounting and data retention policy.
- Success: sponsor can complete a real reconciliation with less effort/error than its current flow; students can start without an advance; provider accepts the payment schedule; economics cover variable costs and a plausible acquisition path.

## Unit economics and credibility

See [financial-model.md](financial-model.md). Educational principal is pass-through funding, never platform revenue. Scenarios show potential losses. Monthly student count is budgeted seats; not graduates or unique people per year. No market-size extrapolation, customers, partner logos or invented metrics.

Potential defensibility would come from useful provider agreements, integrated workflows, operational trust and distribution. MPP itself is open infrastructure; an AI recommender is available elsewhere. No moat has been established.

## Contradictions resolved

| Earlier claim / temptation | Resolution |
|---|---|
| “Scholarship money is lost if student drops out” | Unverified, often funds remain with sponsor. Investigate actual accounting before claiming loss. |
| “Pay only when the student passes” + “pay per delivered segment” | Distinct products. MVP pays agreed delivery; academic certification is separate. Milestone stipend escrow stays roadmap. |
| “Smart trust / fideicomiso” | Technical escrow does not establish legal fiduciary structure. Use programmable funding language. |
| “One shared decentralized scholarship vault” | MPP channel reserves one session; app budget is offchain. No new vault contract in MVP. |
| “Automatically move remainder to next student” | Protocol returns to payer; allocator reassignment requires review and no outstanding commitment. |
| “AI must be central” | Optional catalog matching, no financial authority; retain only if it beats filters. Website is deterministic. |
| “Memecoin revenue makes it sustainable” | Unreliable external contribution, not core funding or base model. No new token. |
| “Website proves payments work” | It proves local UI/model behavior. Prior sandbox evidence is separately recorded. |

## Scope of source recovery

Read relevant source bodies: `tasks/todo.md`, `zero-base-reset/01-event-ground-truth.md`, `03-independent-solution-design.md` (scholarship passages), `04-candidate-universe.md`, `05-prior-art-and-differentiation.md`, `track-validation-operational-tests.md` (scholarship passages), `pumpfun-token-mechanisms.md`, `payment-channel-deep-dive.md`, `spike-execution-log.md`, archived `bridge/trusted-read-chunked/document-text.md` and scholarship innovation attachment. The archived Doc is older than the conversation's latest edits; the live Doc body was not refetched for this build. No existing Beca HTML was found in the workspace filename inventory; no audio transcription or new chain test was performed. Prior reports contain historical contradictions in test availability; use dated actual execution results, not older “not run” entries.

Primary sources and inspection limitations: [evidence-register.md](evidence-register.md).
