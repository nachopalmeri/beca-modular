# Beca Modular 2.0 — editable economics

Updated 2026-10-10. Currency USD, all scenarios monthly. **All inputs are explicit assumptions; outputs are arithmetic projections only.** No actual customers, revenue, quotes, adoption, yield, or costs have been measured.

## Core scholarship flow

Let `N` = sponsor programs, `S` = student scholarships/program, `B` = committed scholarship/student, `U` = fraction of scheduled tranches released after authorized milestones, `L` = platform license/sponsor/month, `F` = optional sponsor-paid fee on tranches released, `P` = estimated payment/conversion cost fraction, `I/A/H` = infrastructure/optional AI/support per student/month, `O` = platform fixed monthly operating cost.

```text
funded seats = N × S
committed education principal = N × S × B
student installments released = committed principal × U
future / not-yet-released balance = committed principal − installments released
platform subscription revenue = N × L
optional sponsor-paid service fee = installments released × F
platform revenue = subscription revenue + optional sponsor-paid service fee
payment/conversion cost = installments released × P
other service costs = funded seats × (I + A + H)
contribution = platform revenue − payment/conversion cost − other service costs
operating result = contribution − O
```

The scholarship principal is pass-through money, not platform revenue. “Future/not-yet-released balance” is governed by the sponsor agreement; it is not automatically savings, yield, or another student's award. `U` models paid milestone shares, not learning quality or graduation. An optional `F` is separately charged to the sponsor, never withheld from a student's promised tranche.

The optional treasury simulator is a separate program-impact worksheet, not part of the platform P&L. It can estimate whole additional-award equivalents as `floor(education-directed positive net return / assumed award amount)` and show the remainder. The award amount is an editable assumption, not a quote or student count. A realized student bonus is also excluded from platform revenue.

## Editable presets

| Assumption | Conservative | Base | Optimistic |
|---|---:|---:|---:|
| Sponsor programs/month | 3 | 10 | 30 |
| Students/program | 30 | 80 | 150 |
| Committed scholarship/student | $80 | $120 | $160 |
| Tranches released `U` | 40% | 65% | 80% |
| License/sponsor/month | $120 | $250 | $1,000 |
| Sponsor-paid extra fee `F` | 0% | 0% | 0% |
| Estimated payment/conversion `P` | 1.0% | 0.6% | 0.4% |
| Infrastructure/student | $1.20 | $0.80 | $0.60 |
| Optional AI/student | $0.40 | $0.25 | $0.15 |
| Human support/student | $2.50 | $1.50 | $1.00 |
| Platform fixed operating cost | $3,000 | $6,000 | $12,000 |

These values are assumptions, not market benchmarks. Set AI cost to zero if the product uses deterministic guidance.

## Base arithmetic and warning

Base inputs yield 800 funded seats, $96,000 committed scholarship principal, $62,400 in modeled student installments and $33,600 not yet released. Platform revenue is $2,500. Payment/conversion estimate is $374.40; other per-student costs total $2,040; fixed cost is $6,000. Modeled monthly operating result is **−$5,914.40**. The design is not commercially validated, and the base case is intentionally not hidden.

Optimistic assumptions yield $7,821/month operating result only because 30 sponsors pay $1,000/month and per-student costs are lower. None of those assumptions is validated. Under base scale and cost inputs, license alone would need to be $841.44/sponsor/month to reach modeled operating break-even, before exclusions. Treat this as a buyer-validation question, not a price recommendation.

## Sensitivity and exclusions

- At base scale, license +$1/sponsor adds $10/month.
- Support +$1/student reduces result by $800/month.
- If `F=0`, releasing more scholarship tranches raises direct transaction cost but does not raise subscription revenue. Do not reduce educational access to improve margin.
- AI inference can be removed; human advising cost cannot be assumed to be zero.
- The model does not include CAC, sales cycles, churn, taxes, legal structuring, audits, wallet recovery, custody/on/off-ramp, refunds, FX changes, bad debt, sponsorship of network fees, integration, insurance, or step-function staffing.
- The aggregate payment/conversion input is not a Solana fee quote or gas estimate. Production requires actual transaction counts, compute/network fee treatment, fee sponsorship, rent/locked capital, conversion, and retry measurements.
- No treasury income or yield appears in platform revenue. Realized investment returns belong to the policy chosen for the scholarship program after obligations/costs; they are not double-counted as platform revenue.

## Yield is a separate ledger

The dedicated [treasury scenario model](yield-strategy.md) has different inputs: total fund, committed student obligations, free surplus, assumed rate, costs, capital-loss stress, withdrawal delay, notice window, and return recipient. It must not be added to subscription revenue. The safe mode caps investment at uncommitted surplus; the exposed-commitment toggle is a counterexample only.

## Pilot measurements before pricing

Record sponsor administrative time per cohort; number and age of pending installments; exception/appeal handling; payout failures; student comprehension and wallet friction; costs per confirmed transfer; institution signer workload; actual procurement willingness-to-pay; and conventional-process baseline. Separate all observed values from assumptions. One cohort is not market validation.
