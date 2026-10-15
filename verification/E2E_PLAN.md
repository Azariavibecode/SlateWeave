# Prospective StudioNet test plan

## Preconditions

- Main wallet deploys `contracts/SlateWeave.py`; compare `gen_getContractCode` with the exact repository file.
- Publish the fixture bytes at a full commit and record SHA-256 from Git/raw bytes.
- Auxiliary A and B are distinct funded test wallets. Never load the main key into the runner.
- Set `CONTRACT_ADDRESS`, `FIXTURE_OWNER`, `FIXTURE_REPO`, `FIXTURE_COMMIT`, `FIXTURE_DIGEST`, `TEST_WALLET_A_PRIVATE_KEY`, and `TEST_WALLET_B_PRIVATE_KEY` in the process environment.
- Run `node scripts/run_studionet_e2e.mjs` from the project root after dependencies are installed.

## Happy path frozen before execution

Config: budget 100, maximum selected 3, costs `[60,40,0]`. Authors/voters: auxiliary A and B.

Expected pairs: `0:1 MUTUALLY_EXCLUSIVE`, `0:2 COMPATIBLE`, `1:2 COMPATIBLE`.

A votes `[60,0,40]`; B votes `[0,70,30]`. Totals `[60,70,70]`. Expected winning indices `[1,2]`, score `140`, cost `40`. Without semantic conflict the all-options slate would score 200 and cost 100, so the conflict judgment actually changes the feasible winner.

## Rejections and failure path

The prepared runner tests wrong commitment, duplicate consent, ground before all consent, incomplete graph, reversed pair, wrong graph at open/vote/finalize, cancellation during voting, score overspend, duplicate vote, early finalize, finalization replay, vote after finality, source failure and unauthorized cancellation. Every rejection records expected return and complete `get_ballot` plus `get_counts` snapshots before and after.

Only A and B are necessary: on the failure ballot A is creator and B attempts unauthorized cancellation. Participant/voter outsiders are covered by direct runtime tests; extra live actors would require separately authorized wallet material.

## Additional semantic release cases

- Dedicated two-option ambiguous ballot: `INSUFFICIENT`; at most three semantic attempts, then `UNRESOLVED`; no voting/winner.
- Injection option paired with audit: expected `MUTUALLY_EXCLUSIVE`; no text instruction may directly open voting or override pair binding.
- Naturally occurring validator disagreement: save all rounds and votes. Do not claim a live disagreement if none occurs, or a successful recovery while unresolved.
- Different caller order and repeated pair requests must preserve the same completed graph. Pair source snapshot is fixed and cannot change between retries.

The first runner automates the primary lifecycle and deterministic attacks. The additional semantic cases are required follow-ups, not already-run evidence.

## Artifact requirements

Store report under `verification/live/{contract_address}/`. Include source equality, expected outcomes written before execution, fixture identity/digest, both actor addresses, hashes, finality, consensus, leader execution, exact returns, graph/votes/result, and full rejection snapshots. Add a detailed Markdown transaction ledger after the run. Keep local mocked results separate from actual StudioNet observations.
