# SlateWeave

SlateWeave is a GenLayer dApp for selecting a coherent DAO agenda from competing proposals. Validators determine pairwise semantic conflicts from authenticated proposal documents. The contract then computes the highest-scoring feasible slate from immutable votes, conflict constraints, declared numeric costs, a budget, and a selection limit.

## Mechanism

```text
complete agenda + authors + voters + source policy + numeric constraints
  → exact participant consent
  → atomic GitHub evidence grounding
  → bounded semantic pair reviews
  → immutable conflict graph
  → one vote or abstention per registered voter
  → deterministic subset optimization
  → immutable winning slate
```

The contract supports 2–8 options and 1–8 voters. Each voter allocates up to 100 points. Finalization enumerates at most 256 subsets, excluding any subset with a conflicting pair, cost above the budget, or too many selected options. Ties choose fewer options and then the lowest option bitmask. Zero total scores yield the empty slate.

## Roles and reviewer access

- Main wallet deploys only. The constructor stores no owner/admin authority.
- Auxiliary wallets A and B are used as proposal authors, consent participants and voters in the live runner.
- Any reviewer can create a new ballot using their own address and chosen collaborators. No deployer permission is required.
- Every named author and voter accepts the complete existing ballot commitment. There is no API to add options, replace voters, or edit policy after creation.

## Evidence and limits

GitHub commit/tree/blob/raw observations authenticate exact proposal and policy text. They do not establish real DAO approval, source-code behavior, funding or external execution. The included Cedar DAO scenarios are explicitly synthetic.

The winning slate is an authoritative selection inside this registry. No external treasury transaction, token custody, production DAO integration or Sybil resistance is claimed. Pairwise analysis addresses pairwise incompatibility; higher-order semantic constraints beyond the graph are not modeled. Aggregate numeric cost is checked independently for every candidate subset.

There is no wall-clock deadline. All listed voters must vote or abstain; a disappearing voter can leave the ballot pending. Before voting begins the creator can cancel without producing a winner. Source failure keeps the ballot non-positive and permits retry. A pair has at most three insufficient semantic attempts; exhaustion produces `UNRESOLVED`, with no voting or winner.

## Run locally

```text
python -m pytest -q -p no:cacheprovider
npm --prefix frontend install
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix frontend run dev
```

The production frontend is configured for SlateWeave deployment `0xf04875D5FF900C87aFa08C84cb2D14c4daCb73Ff` on StudioNet. The Deployment control still permits independent deployments. The default creation form uses synthetic fixture commit `69437673e180f414efe6565a14b266110427845c`; authors and voters remain chosen by the user, not hardcoded test wallets.

## Public methods

```text
create_ballot(config_json)
accept_ballot(ballot_id, commitment)
ground_ballot(ballot_id)
resolve_pair(ballot_id, left, right)
open_voting(ballot_id, commitment, graph_digest)
cast_vote(ballot_id, commitment, graph_digest, scores_json)
finalize(ballot_id, graph_digest)
cancel_ballot(ballot_id)
get_ballot(ballot_id)
get_counts()
```

The frontend uses `genlayer-js`, checks finalized consensus and leader execution, validates the returned value, and reads back the exact affected ballot before confirming success. It clears selected state on ID/deployment changes and invalidates stale asynchronous reads.

See [architecture](docs/ARCHITECTURE.md), [threat model](docs/THREAT_MODEL.md), [claim-to-invariant mapping](verification/CLAIM_TO_INVARIANT.md), [source manifest](verification/SOURCE_MANIFEST.md), [live test plan](verification/E2E_PLAN.md), [actual StudioNet transaction ledger](verification/STUDIONET_E2E.md), and [separate browser read-only checks](verification/UI_READONLY.md).

## Current verification status

45 direct contract tests and 8 UI transport/action tests pass. Production frontend builds. Desktop and mobile initial-screen/form checks have been performed. The deployed source exactly matches the repository file. Live SDK E2E is recorded under `verification/live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/`; only finalized recorded transactions constitute live evidence, not the prospective test plan or local mock results.
