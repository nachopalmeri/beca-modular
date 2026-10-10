# Beca Modular 2.0 — treasury, yield, and beneficiary policies

Research and model updated 2026-10-10. This is product/technical research, **not investment advice**. No funds are connected; no APY snapshot is used; no vault has been selected or integrated. Current website numbers are editable assumptions.

## Decision and invariant

**MVP: 0% of promised scholarship principal is invested.** A student installment already committed in the program must remain payable on time even if protocol yield becomes zero, capital loses value, a stablecoin depegs, a vault pauses, an RPC fails, or withdrawal is delayed.

A later treasury could consider only explicitly authorized, uncommitted surplus in a separate accounting pool. Withdrawals must be demonstrated in the same asset before any due date. A top-up/responsibility policy must be signed by the sponsor before enrollment. Students never incur strategy losses or repay an earlier tranche. Do not move yield requirements into the scholarship contract until an actual sponsor demands it.

## What “better yield” means here

Optimize **realized net benefit with payout reliability**, not a headline APY:

```text
realized net benefit = interest / distributions received
  − vault/management/performance fees
  − network and transaction costs
  − conversion / spread / slippage
  − operational and reconciliation costs
  − realized capital losses
```

Do not count unclaimed incentive tokens as cash return. Do not count one amount both as student bonus and platform revenue. Compare one asset, chain, horizon, committed schedule, and exit amount at a time. A variable rate and a successful historical withdrawal do not guarantee next month's exit.

Operational efficiency ideas for later validation: segregated accounts per program; no unnecessary bridges; one supported token and network; batch administration while preserving individual receipts; schedule redemptions with a tested lead time; cap exposure by sponsor-approved policy; pause new deposits on incident; reconcile received tokens before marking liquidity. These can reduce failure/cost but do not guarantee a higher return.

## Protocol candidates — mechanisms and exit limits

| Candidate | Source of potential return | Exit / integration facts | Current product decision |
|---|---|---|---|
| Same-asset liquid reserve | None from a yield protocol | Operationally simplest; still issuer, custodian, wallet, freeze, network, and par risk | Hold all promised tranches here in MVP |
| Aave V3 | Variable interest paid by borrowers; rate depends on reserve utilization and parameters | `Pool.withdraw` is a chain transaction and is bounded by available reserve liquidity. Current MPP experiment is Solana; Aave integrations are EVM and separate | Best simple EVM candidate for a future test, not a date-certain student reserve |
| Sky `sUSDS` | Variable Sky Savings Rate set by governance | Rate may change or reach zero; USDS, governance, smart-contract, and redemption risks. Not the same product as Spark vaults | Evaluate exact product; no integration |
| Spark Savings / `spUSDC` | Spark Liquidity Layer allocations and exact product strategy | Larger exits can use request/fulfilment with Spark infrastructure; documented timing is not a user guarantee. Need exact version, network, and eligibility | Future test only after exit is demonstrated for payout amount/date |
| Morpho vault | Borrower-paid yield in curator-selected markets, net of applicable fees | The current Vault V2 developer guide says the generic ERC-4626 `max*` views return zero; integrators must compute limits from fresh vault state and check gates. Plain withdrawals cover idle assets plus the liquidity adapter, not all allocations. In-kind exit changes exposure but does not create liquidity | Do not choose by brand/APY. Name exact vault/curator/adapter/gates and test the computed withdrawal path first |
| Kamino KLend (Solana) | Variable borrower-paid lending interest | TypeScript SDK repository is MIT-licensed; use of the SDK does not make the KLend program itself MIT. Withdraw depends on reserve liquidity. MPP channel funds do not compose automatically with a KLend position | Plausible same-chain candidate to spike after scholarship escrow exists; not an escrow plug-in |
| Tokenized debt / money-market product | Depends on issuer, underlying, wrapper, custody, and redemption | Eligibility, transfer restrictions, fees, settlement/redemption windows, issuer and jurisdiction matter. Never use a token name as proof of legal claim | Only excess; no eligible instrument or Argentine institutional access verified |
| Tokenized stock exposure | Price/distribution contract terms | Robinhood’s European Stock Tokens are described as derivative contracts, not direct share ownership; no permissionless Beca integration or Argentine eligibility verified | Reject as tuition reserve or guaranteed “dividend” source |
| Pump.fun creator-fee share | Trading fees actually generated and assigned by creator | Official docs describe fee distribution to configured recipient wallets. It is driven by real trading activity and token/product permissions; not return on scholarship principal, a dividend, or holder entitlement | Treat as external voluntary donation only after receipt; no token and no core funding dependency |

Primary documentation inspected 2026-10-10:

- [Aave supply](https://aave.com/help/supplying/supply-tokens), [Aave withdraw](https://aave.com/help/supplying/withdraw-tokens), [Aave V3 Pool](https://aave.com/docs/aave-v3/smart-contracts/pool?language=en).
- [Sky/Spark savings products](https://docs.spark.finance/products/spark-savings), [Spark Vaults V2 integration and withdrawals](https://docs.spark.finance/integrators/spark-vaults-v2), [Sky risks](https://docs.sky.money/legal/skybase-international/user-risks).
- [Morpho assets flow](https://docs.morpho.org/developers/earn/tutorials/assets-flow/), [Morpho liquidity](https://docs.morpho.org/curate/concepts/liquidity/), [Morpho SDK](https://docs.morpho.org/developers/sdks/morpho-sdk/).
- [Kamino KLend TypeScript SDK](https://github.com/Kamino-Finance/klend-sdk), [Kamino lending program repository/license notice](https://github.com/Kamino-Finance/klend).
- [Robinhood Stock Tokens](https://robinhood.com/eu/en/support/articles/about-stock-tokens/).
- [Pump creator-fee sharing documentation](https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md).

These sources establish documented mechanisms, not a live Beca transaction, product eligibility, legal treatment, particular yield, audit conclusion, or user demand. No on-chain Pump transfer was verified during this product update.

### Targeted documentation recheck — 2026-10-10

- Aave's current user guide says supplied assets plus accrued interest are withdrawable only if enough unborrowed reserve liquidity exists; its docs describe rates as variable with utilization and governance parameters. A high displayed rate is not a scheduled payout guarantee.
- Spark's V2 guide distinguishes immediate idle-liquidity withdrawals from larger withdrawals through an on-chain intent that Spark infrastructure fulfills after preparing liquidity. There is a deadline, one active request per account/vault, whitelisting and amount bounds. This is not a deterministic date promise suitable for an already-due student installment.
- Morpho's V2 guide is stricter than the earlier shorthand: `maxDeposit`, `maxMint`, `maxWithdraw`, and `maxRedeem` generic views always return zero; the SDK computes capacity from fresh state, while withdrawal caps include idle assets plus the liquidity adapter, exclude assets in other adapters, and do not check gates. `in-kind` exit moves exposure and does not create underlying liquidity. This raises integration complexity and makes the exact vault/adapter essential.
- Kamino's official docs and SDK can support a same-chain Solana research path, but network overlap does not unify the lending reserve with MPP payment-channel accounting. No supply/withdraw transaction was run for Beca.
- Pump public docs are documentation for a configurable creator-fee split. They do not prove a current revenue stream for a specific token/creator or yield on the scholarship principal.
- Robinhood's public Stock Token explanation is not a permissionless institutional treasury API; it does not establish a direct equity ownership claim for Beca's intended users.

These rechecks validate documented product mechanics only. No current rate, APY, protocol liquidity reading, token contract, recipient eligibility or transaction has been independently sampled here. The website deliberately uses user-entered scenario rates instead of presenting stale or unverifiable rates as live.

## Pump / memecoin mechanism: where it fits

The useful primitive is **fee distribution from an actual source of revenue**. Pump's public docs describe creator-fee share configuration. If a creator voluntarily allocates fees to an educational wallet, Beca could record the amount as a donation only after the incoming transfer is confirmed. Trading volume is speculative and may disappear. Fee-sharing implementation is not the same as a promised dividend; it does not mean a holder owns a company or its revenue. Do not promise scholarship amounts against trading volume, launch a Beca token, or claim `$SI` pays NVIDIA share dividends until the exact contract, rights, flow, and legal basis are independently verified. That `$SI` claim remains **unknown / not integrated**.

Other options have different economics:

- Direct stablecoin donation: identifiable sender, amount, and receipt; not recurring yield.
- Creator fee donation: potentially programmatic but volatile and creator-controlled.
- Quadratic / matching grants: matching pool and anti-Sybil policy create the added incentive; matching funds must be real and committed.
- Token holder rewards: may be fee redistribution, inflation, buyback, or marketing; classify the source before calling it yield.

No creator, donor, matching pool, or token partnership is in place.

## Five beneficiary policies

The sponsor chooses before any student enrolls and the terms remain visible; change only for future programs with consent:

1. **Education first (recommended default):** positive, reconciled net return goes to future scholarship budgets.
2. **Revolving scholarship pool:** return funds a next eligible student after a separate human allocation decision.
3. **Student bonus:** after all promised tranches and costs settle, 100% of positive net realized return goes as additional support to the current student.
4. **Shared:** an explicit percentage (e.g. 50/50) splits positive net between student bonus and future education.
5. **Program-directed education:** sponsor specifies permitted uses before enrollment (e.g. learning materials, accessibility, transit, future awards). The return stays in a restricted education-program budget; it is not sponsor profit. No retroactive redirection.

If the result is zero/negative, nothing is distributed. A donation is not silently converted into an investment where the donor receives financial return. The program's exact legal status, student rights, taxes, custody, consumer rules, and investment permissions require professional review before real operation.

### Student choice within a pre-authorized policy

If the sponsor selects a student-bonus or shared-benefit policy, the program can allow the beneficiary to choose the approved use of their **additional, realized net benefit**: flexible support, a listed educational expense (such as materials/connectivity/transport), or adding it to a later installment with the student's consent. The original promised tranche remains unchanged; the student cannot be forced to reinvest a bonus. For the hackathon site, this is an illustrative selector only: it neither checks eligibility nor sends money. Real payment routing, tax and benefit eligibility, provider price/quality controls, and the student's right to choose cash or decline the option require validation.

The simulator now also asks for an assumed full-award amount and reports only whole award equivalents from the education share plus its remainder. This is a unit conversion for discussion, not an estimate of new enrollments or impact. With the default assumptions (USD 1,200 total; USD 1,000 committed; 4% assumed simple annual return on USD 200 surplus for 12 months; USD 5 modeled cost), net return is USD 3, so the student benefit is USD 0 under education-first and additional full awards are 0 if an award is assumed to cost USD 500. Under a student-bonus policy, that same hypothetical USD 3 can be assigned among the pre-approved uses above. These are model outputs, not a quoted protocol rate or realized return.

## Stress-model inputs and interpretation

The website's [`yield.mjs`](../yield.mjs) is a pure local screening model, not a protocol simulator. Inputs are total funds, student commitments, strategy horizon, number of payout months, percentage of eligible surplus invested, assumed nominal annual rate, aggregate costs, capital-loss shock, withdrawal delay, advance notice, and return recipient.

- Safe mode invests `min(investmentPct × max(0,totalFunds − studentCommitments), freeSurplus)`; promised capital is excluded.
- Unsafe counterexample mode can include committed capital solely to show liquidity/capital shortfall.
- Gross return is simple and non-compounded; monthly interest is calculated on remaining assumed position across the strategy horizon. No current rates or protocol balances are read.
- A loss shock reduces invested principal. Costs and negative returns reduce modeled coverage; positive assumed yield is not relied on to fund promised student principal.
- If withdrawal delay exceeds stated notice, the conservative screen treats invested position as unavailable at scheduled payout dates. This can overstate real timing risk; it is a warning boundary, not a forecast.
- Tranches are equal and scheduled over selected payout months; months use an equal-period abstraction. No weekday, bank holiday, request queue, actual vault adapter, or intra-day settlement is modeled.
- `capitalTopUp` is the capital/fee gap after stress. `dueDateTopUp` is the amount not paid by scheduled dates under this simplified scenario. Neither is an insurance or a legal guarantee.

Ten automated stress cases are regenerated from current visible inputs: base, zero rate, negative rate, 5% principal loss, 10% principal loss, elevated costs, 45-day exit vs 14-day notice, 90-day exit vs 14-day notice, all commitments due in one month, and no free surplus. The tests check safe investment bounds, beneficiary distribution, loss, time-liquidity, and underfunded cases. Scenarios are illustrative, not probabilities or measured incidents.

## Next technical spike — no real funds

After scholarship escrow is independently tested, compare one exact candidate at a time using one test asset and same-chain wallet:

1. Name protocol, network, contract/vault/reserve, asset and version.
2. Read exact deposit balance/shares and current redeemable/withdrawable amount via official SDK/docs.
3. Deposit a tiny test asset from a separately authorized sponsor wallet.
4. Simulate the next due date using the actual required exit amount; withdraw, measure received tokens, time, fees, and failure state.
5. Reconcile principal, realized yield, cost, and untouched student obligation. Test pause, unavailable liquidity, wrong asset, RPC outage, and emergency recovery.
6. Stop if any promised tranche relies on a best-effort withdrawal or if custody/eligibility cannot be established.

Possible comparison: Aave V3 direct `withdraw` vs Spark `spUSDC` V2 request/fulfilment; separately, test Kamino SDK only if Solana is the chosen core network. The current site executed no such deposit/withdraw test. The prior MPP sandbox experiment was for a separate content-payment session, not yield or scholarship release.
