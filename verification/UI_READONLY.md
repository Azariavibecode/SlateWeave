# Production frontend — read-only StudioNet smoke

Date: 2026-10-15. Local production preview at `127.0.0.1:5182`, built with default contract `0xf04875D5FF900C87aFa08C84cb2D14c4daCb73Ff`, chain 61999.

This was a browser read-only check with **no connected wallet, no injected test provider and no browser signing**. The auxiliary-wallet transaction suite is separate.

Observed checks:

1. Ballot ID 0 loads `happy_create`, 3 options, 2 voters, budget 100, state `PAIRING`.
2. The three authenticated option sections appear with costs 60, 40 and 0. Every pair initially remains pending. The next review action is disabled without a connected wallet.
3. Changing the selected ID to 999999 immediately removes the previously loaded ballot cards/actions. The authoritative read displays “No ballot at this ID. Create a new agenda or choose an existing ID.” No previous proposal remains actionable under the new ID.
4. Returning to ID 0 initiates a fresh contract read rather than trusting the former selection.
5. After the finalized SDK transaction, a fresh production-page load displays `FINALIZED`, selected options Incentive priority + Transparency report, total score 140, cost 40/100, totals `[60,70,70]`, and aggregate counters 1 agenda / 1 finalized / 0 cancelled. No vote, cancel or finalize action is offered for that terminal ballot.
6. After rebuilding the strict-ID guard, clearing the ID input removes ballot state/counters and displays the integer-ID validation error. It does not alias the empty field to ballot 0. This is also a dedicated frontend protocol regression.

Artifacts:

- [PAIRING screen](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/ui-readonly-pairing.png)
- [Unknown ID screen](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/ui-readonly-missing-id.png)
- [Finalized winner screen](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/ui-readonly-finalized.png)
- [Blank ID guard](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/ui-readonly-blank-id.png)

The source-grounding transaction may already be reflected by a read before its FINALIZED checkpoint is saved by the SDK runner. These screenshots prove displayed readback, not transaction finality. The runner's receipt/consensus/leader record supplies the independent finality evidence.
