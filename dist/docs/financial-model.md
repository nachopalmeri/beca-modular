> Corrección de alcance — 10/10/2026: revisada la transcripción completa del audio original. La propuesta principal paga tramos al ESTUDIANTE por materias aprobadas por una institución. La web ahora lo explica primero y ofrece una simulación local. El contenido siguiente documenta el COMPLEMENTO de pago por contenido al PROVEEDOR, no un escrow académico implementado. MPP no certifica materias ni reasigna becas. Presupuestos separados; IA no autoriza pagos. No hay contrato de becas desplegado ni demanda validada.

# Financial assumptions and open model

Date: 2026-10-10. Currency **USD**, period **one month** throughout. Every numeric input below is an **explicit assumption**, not historical performance, a provider quote or an external benchmark. Website outputs are **calculated projections**. No actual customers, revenue or profit exist.

## Definitions and formulas

N = sponsors; S = funded students/sponsor; B = educational budget/student/month; U = utilization fraction; L = institutional license/month; F = optional extra fee fraction; P = aggregate payment/conversion fraction; I/A/H = infrastructure/AI/support dollars per funded student/month; O = fixed monthly overhead.

```
funded seats = N × S
allocated reserve = N × S × B
provider payouts = allocated reserve × U
unused educational balance = allocated reserve − payouts
subscription revenue = N × L
additional fee revenue = payouts × F
platform revenue = subscription revenue + additional fee revenue
payment/conversion cost = payouts × P
other direct costs = funded seats × (I + A + H)
direct cost of service = payment cost + other direct costs
contribution (gross profit in this simplified model) = revenue − direct cost
contribution margin = contribution / revenue; undefined when revenue = 0
operating result = contribution − O
realized sponsor outlay = provider payouts + platform revenue
maximum sponsor commitment = allocated reserve + platform revenue
```

Unused reserve is sponsor money, not platform income, margin, causal savings or verified new access. “Realized outlay” excludes still-locked liquidity until actual close/refund; the model presumes monthly settlement. Stablecoin/USD parity, no asset loss and full collection are simplifying assumptions.

Payment/conversion percentage is an estimated aggregate cost allocation, **not a claim about Solana gas**. Production needs explicit transaction counts, SOL gas conversion, sponsored fees, rent/locked capital, on/off ramp, compliance and retry costs. AI dollars/student are budgeting assumptions, not model-vendor quotes; derive later from tokens × current prices × sessions.

## Scenario inputs

| Input (assumption) | Conservative | Base | Optimistic |
|---|---:|---:|---:|
| Sponsors | 3 | 10 | 30 |
| Students per sponsor | 30 | 80 | 150 |
| Budget per student | 80 | 120 | 160 |
| Utilization | 40% | 65% | 80% |
| License per sponsor | 120 | 250 | 1,000 |
| Extra fee on usage | 0% | 0% | 0% |
| Aggregate payment cost on usage | 1% | 0.6% | 0.4% |
| Infra / student | 1.20 | 0.80 | 0.60 |
| AI / student | 0.40 | 0.25 | 0.15 |
| Support / student | 2.50 | 1.50 | 1.00 |
| Fixed operation | 3,000 | 6,000 | 12,000 |

Base: 800 seats; 96,000 educational reserve; 62,400 payouts; 33,600 unused; 2,500 platform revenue; 374.40 payment costs; 640 infrastructure; 200 AI; 1,200 support; 2,414.40 direct costs; 85.60 contribution; **−5,914.40 operating result**. This is a deliberately visible economic warning, not “commercially viable” by assertion.

Optimistic: 4,500 seats; 576,000 provider payouts; 30,000 platform revenue; 10,179 direct costs; 12,000 fixed costs; **7,821 operating result**. Profit depends on a 1,000 USD institutional license plus lower per-student costs. Neither willingness to pay nor those efficiency gains are verified. At base scale/costs and no extra fee, a license of **841.44 USD per institution/month** would only reach modeled operating break-even, before excluded costs. This threshold should inform buyer validation rather than be advertised as a validated price.

## Break-even

Per-sponsor contribution = L + S × B × U × (F − P) − S × (I + A + H).

If contribution/sponsor <= 0, adding sponsors cannot cover fixed overhead in the model. Otherwise break-even sponsors = ceiling(O / contribution-per-sponsor). Base contribution/sponsor is 8.56, so simplified break-even is 701 sponsors; this is operationally implausible without revising staffing/costs. Scaling linearly would be misleading. The website labels that fixed costs do not step up in this extrapolation.

## Sensitivity and dominant assumptions

- At base cohort size, license +1 USD/sponsor improves monthly result by N USD.
- Support +1 USD/student reduces result by N × S USD; base sensitivity is −800 USD/month.
- AI cost could be set to zero if recommendations use deterministic tags. Zero inference does not eliminate human advising costs.
- With fee=0, utilization increases provider payouts and payment cost, not platform license revenue. Never optimize educational access downward to manufacture profitability.
- Adding a fee may improve margins but is an unvalidated purchase decision and may worsen sponsor total cost. Pilot must test willingness to pay and procurement.
- Scenario selector changes all inputs together; sensitivity changes one input against the current editable state. Preset comparison remains fixed and is labeled as such.

## Exclusions and next measurements

No CAC, sales cycle, bad debt, churn, tax, legal/custody setup, security audit, reserve cost, FX volatility, refunds, chargebacks, commercial content licensing, acquisition onboarding or step-function hires. Content principal is already represented as payouts, not platform COGS. Add these costs before investment decisions. Break-even is an arithmetic exercise, not forecast. No annual aggregation of monthly seats.

Pilot should measure administrative minutes/case, support tickets/student, paid unit pricing, completed settlement cost, tokens/recommendation, student starts and program continuation. Distinguish observed values from assumptions in the next version. Formulas are shared in `model.mjs` and exercised by meaningful invariant tests.
