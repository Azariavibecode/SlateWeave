# Independent reviewer path

## Start the frontend

From the repository root:

```text
npm --prefix frontend ci
npm --prefix frontend run build
node frontend/node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5182 --outDir frontend/dist
```

Alternatively run `npm --prefix frontend run dev` with `VITE_CONTRACT_ADDRESS` set to the deployment address. The production environment file already sets the submitted deployment. The Deployment panel lets you inspect or override the exact address and open Explorer.

Open the public frontend at https://slateweave.pages.dev. Use StudioNet, chain ID **61999**, and a funded test wallet. Do not use mainnet assets. The contract does not custody or transfer tokens.

## Inspect existing evidence without signing

Enter ballot ID **0** and refresh canonical state. This is the auxiliary-wallet test ballot, not a ballot on which arbitrary reviewers may impersonate the named voters. Inspect the commitment, public source sections, pair relations, participant list, votes and result as applicable to the current on-chain phase. The linked transaction ledger records finality separately from browser reads.

## Create a complete independent ballot using your own wallet

1. Connect your wallet. Select **Create an agenda** or **New agenda**.
2. Keep the published synthetic fixture defaults. The policy/option texts are test proposals, not claims of real DAO approval or execution. Source owner is `Azariavibecode`, repository `SlateWeave`, commit `69437673e180f414efe6565a14b266110427845c`, path `/fixtures/agenda.md`, SHA-256 `cf32b7eefa58525a01e381d4f87827cc0d95972efcb5f6e82039b7aaf6f57220`.
3. Keep budget 100, maximum selected 3, and option costs 60, 40, 0. For a one-wallet independent review, leave author and voter address fields blank: the connected wallet becomes the author of all options and the sole registered voter. You do **not** need either auxiliary wallet's key or the deployer.
4. Create the agenda and wait for finalized consensus, successful leader execution, the returned ballot ID and exact state readback. Never infer your ID from the aggregate count. Save the returned ID.
5. **Accept locked agenda**. With a sole participant this enables source grounding. If you specified other authors/voters, every named participant must first consent using their own wallet.
6. **Verify public sources**. Expected state: `PAIRING`, with the exact authenticated sections displayed. Missing or mismatched source bytes must not allow this state transition.
7. Review all three option pairs. Expected relations: audit/incentives `MUTUALLY_EXCLUSIVE`; audit/reporting and incentives/reporting `COMPATIBLE`. An insufficient judgment keeps voting closed; after three insufficient attempts that ballot becomes `UNRESOLVED` rather than granting a winner.
8. **Open voting** once the graph is complete. You cannot cancel after this transition. With your one registered voter, allocate `[0,70,30]` to audit/incentives/reporting and submit. Zero allocations are permitted abstentions; total allocation cannot exceed 100.
9. Finalize. For the one-wallet score vector above, expected selected indices are `[1,2]`, score **100**, cost **40**, state `FINALIZED`. This differs intentionally from the two-wallet evidence case, which has a score of 140.
10. Refresh and inspect the immutable result plus Explorer transaction links. Terminal ballots must not offer voting/finalization again.

## Two-wallet reproduction of the recorded happy path

Use two wallets you control, set both as voters and as the audit/incentives authors respectively; make reporting authored by the first wallet. Both consent. The first votes `[60,0,40]`, the second `[0,70,30]`. After both votes, expected selected indices are `[1,2]`, score **140**, cost **40**. No audit and incentive option may coexist in a selected slate even though the numeric budget would fit all three.

No frontend action grants deployer privileges. Registering a wallet in a ballot does not confer authority over other ballots. There is no permissionless replacement of an absent named voter after voting begins, so use wallets you can access or explicitly choose to abstain.
