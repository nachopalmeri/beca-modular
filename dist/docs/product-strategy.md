# Beca Modular 2.0 — product source of truth

Updated 2026-10-10. This is a research-backed product hypothesis and an explanatory site, **not a validated business, active scholarship program, deployed escrow, or investment service**.

## Product decision

The primary product is a **scholarship paid to the student in fixed tranches after institution-attested academic milestones**. The student is the beneficiary; an NGO, foundation, university, employer, or public program could be the buyer/funder; a school or program administrator is the human verifier.

Three adjacent mechanisms stay distinct:

| Module | Recipient | Trigger | Status |
|---|---|---|---|
| A. Scholarship escrow | Student | Authorized institution attests a milestone | Core concept; website demo is local only |
| B. Content micropayments | Education provider | Agreed content unit is delivered | Optional separate budget; historic Solana MPP sandbox experiment exists |
| C. Treasury yield | Chosen beneficiary under a pre-agreed rule | Net positive result is realized on uncommitted surplus | Research/roadmap only; no investment in MVP |

MPP is not the academic escrow. It supports capped, metered payment sessions; it does not certify grades, enforce scholarship reallocation, or bind an institution to an educational judgment. Do not combine its balance with an academic vault by assumption.

## Human problem and evidence boundary

Hypothesis: a scholarship beneficiary may face uncertain timing, conditions, appeals, or restricted-use processes; sponsors may need a clearer audit of promised, released, and future tranches. These are specific questions for user discovery, **not a demonstrated frequency or market need**. Do not claim that scholarships are normally lost when a student pauses or leaves; each program's rules differ.

First validation segment to test: a foundation/NGO already running a small cohort scholarship and one partner institution. This choice is operationally narrow, not a market-size conclusion. Ask for the last real program's rules, payout calendar, exceptions, costs, current reconciliation steps, and rights of appeal. Compare the existing database + bank transfer route first.

## B2B2C roles and jobs

| Role | Job | Value hypothesis | Unresolved barrier |
|---|---|---|---|
| Sponsor / buyer | Fund a cohort, state rules, reconcile obligations | Rule-based, auditable release and clearer future balance | Current finance/registrar system may already suffice; procurement and legal status unknown |
| Student / beneficiary | Know what is earned, when it is paid, and how to pause or appeal | No advance payment; fixed installments; no automatic clawback | Wallets, stablecoins, connectivity, device access, privacy, and recovery can add burden |
| Institution / attestor | Confirm a defined milestone and handle corrections | A bounded signer workflow and one-time claims | It retains the grading responsibility and may reject on-chain attestations |
| Program administrator | Enroll, pause, resolve appeals, and close the cohort | Explicit status, consent, and audit trail | More operational work unless integrated with existing systems |

Student-facing value: “Sabés qué libera cada tramo y qué podés hacer si necesitás pausar.” Buyer-facing value: “Conciliá compromiso, atestación, pago y saldo sin mezclarlo con los ingresos del programa.” These propositions still need testing.

## Lifecycle and rights

1. Sponsor defines an amount, beneficiary address, fixed tranches, permitted attestors, due/expiry windows, pause and appeal rules, and treatment of uncommitted funds.
2. Human administrator checks eligibility and obtains clear consent. Do not use AI to score poverty, eligibility, dropout risk, or academic merit.
3. Institution assesses progress using its normal process and signs a narrowly scoped claim. A signature proves which key made the statement, not that the educational decision was true or fair.
4. The program validates program ID, student destination, mint, amount, milestone sequence, expiry, authority, and unused nonce; one atomic transaction marks the milestone consumed and transfers the tranche.
5. A student can request pause/review. No previous paid tranche is clawed back. “No activity” is not evidence of withdrawal.
6. Reassignment may concern only future, uncommitted balance after notice, a grace period, appeal, and human approval. It is not an automatic consequence of failing an event.
7. Close and reconcile remaining principal, distributed tranches, disputes, and any separately realized investment return. Education principal is never platform revenue.

Content purchase is a separate optional workflow: student chooses an approved unit, an institution controls a capped provider budget, delivery is measured under an agreed contract, and MPP may settle the provider. Watching content is not an academic milestone or proof of learning.

## AI and product experience

AI is optional and **not the innovation or payment authority**. It may help translate a student's goal into options from a human-approved catalog, explain prerequisite order, or draft questions for an advisor. Deterministic filters are the baseline. The student chooses; an advisor can override.

Use only consented, minimal input (goal, declared level/time, approved catalog). Do not provide the model with DNI, grades, financial hardship notes, or a signing key. Validate output to approved IDs and budget. Compare AI against deterministic filters for educator-rated relevance, selection time, prerequisite errors, and invalid IDs; remove AI if it does not improve a measured outcome. No connected model or AI inference is present in the current site.

## Web3 necessity and differentiation

Potential on-chain value: the program can enforce a fixed token amount and beneficiary, reject the same milestone twice, and expose an independently inspectable ledger to more than one organization. Those properties are useful only if sponsor and institution need shared enforcement beyond their current trusted system. A central database and bank transfers may be cheaper and easier.

No cryptographic primitive validates the underlying grade. Institution-authorized attestations remain the trust boundary. No product moat is established: milestone funding, scholarships, LMS records, token transfers, and MPP each have prior art. The distinct hypothesis is their bounded combination for a specific sponsor program, not “scholarships on blockchain.”

## Business and sustainability

First buyer hypothesis: the sponsor/program operator pays a monthly or per-cohort administration license. Optional implementation/reporting work is later revenue. The scholarship principal and any donor yield are segregated pass-through money. No proprietary token or fee on student receipt is proposed. A transaction fee must be separately agreed and billed to the sponsor; never subtract it from the promised student tranche.

Pricing, costs, sales cycle, regulatory eligibility, customer acquisition, support load, and willingness to pay are unverified. The editable financial model exposes a deliberately weak base case; see [financial-model.md](financial-model.md). No customers, revenue, adoption, or unit economics are measured.

## Optional treasury policy

The default is no investment. Keep all promised tranches available in the same asset. A future, separately authorized strategy may consider only uncommitted surplus after its actual exit path, due dates, fees, loss policy, and sponsor backstop have been tested. See [yield-strategy.md](yield-strategy.md). The sponsor must choose any distribution policy before enrollment: education-first, revolving scholarship pool, student bonus, explicit split, or program-directed educational use. If a student bonus is offered, the sponsor may allow the student to choose among pre-authorized destinations (flexible support, eligible educational costs, or an optional future-tranche supplement); the student cannot be compelled to reinvest promised principal. Only reconciled positive net returns can be distributed. No student owes protocol losses. Website controls illustrate this choice; they do not move money.

Pump creator fees are a possible external voluntary donation after receipt, not yield or dividends. Robinhood Stock Tokens are documented derivatives, not direct share ownership. `$SI` contract identity and rights remain unverified. None is a funding assumption.

## Impact: what to measure

Measure process before claiming educational outcomes: time from milestone approval to receipt; payment failures; support/appeal completion; student understanding of terms; admin minutes and reconciliation errors; number funded and number paid on time. Separately measure enrollment, completion, learning assessment, and post-course outcome with consent and suitable follow-up. The website reports no impact results.

## Kill / change criteria

- If existing bank/database controls meet the same needs at lower cost, remove on-chain escrow.
- If no institution accepts a scoped attestation role, the escrow cannot honestly trigger payouts.
- If student wallet access or recovery creates a new exclusion, use a conventional payment route or supported custody model only after legal review.
- If committed funds must be invested to make the business work, reject the yield feature.
- If learners/sponsors do not confirm the underlying timing/control problem, change or abandon the product.
- If the hackathon challenge does not align with New Education, reselect against the actual prompt.

## Current state

Built: explanatory static website, local scholarship simulator, content-payment demo, catalog route rules, business/yield scenario calculators. Historically reported: an MPP sandbox payment-channel experiment for content usage, documented separately. Not built: scholarship Anchor program, school signer, production backend, vault adapter, connected AI, wallet recovery, real pilot, or audited financial contracts. See [evidence-register.md](evidence-register.md) and [qa.md](qa.md).
