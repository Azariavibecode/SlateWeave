# Claim → invariant → evidence

| Product claim | Invariant | Direct evidence | Required live evidence |
|---|---|---|---|
| Complete consent | Full immutable config exists before any acceptance | Locked config and cross-ballot/duplicate/wrong-actor tests | Full pre/post snapshots and exact commitment |
| Verified proposed text | Commit/tree/blob/raw bytes and section match | Changed bytes, wrong digest, truncated tree, blob mismatch, unavailable source, duplicate marker tests | Frozen public commit and grounded readback |
| Conflict-aware voting | Every pair substantive before voting | Incomplete graph, malformed model, wrong binding, replay and insufficient-retry tests | Semantic relation transactions and actual validator history |
| One vote per named voter | Exact sender, commitment, graph; immutable vote vector | Wrong actor, bad vector, double vote, wrong graph tests | Signed forbidden transactions plus equality |
| Coherent winning slate | Feasible subset with optimal deterministic score | Full lifecycle plus independent combinations reference across six budgets | Actual votes, winning mask, recomputation |
| Terminal integrity | Finalized/cancelled ballot cannot reopen | Finalize/vote/consent/cancel replay tests | Returned rejection codes and exact snapshots |
| Honest UI success | Finalized consensus + leader success + exact object readback | Nine transport/action/ID tests | UI/SDK readback tied to deployment/IDs |

Local tests do not establish any entry in the final column. Executed live cases and their exact coverage are recorded in [STUDIONET_E2E.md](STUDIONET_E2E.md), separately from the prospective plan. Source variants, outsider voting and cross-ballot attacks remain direct-runtime evidence unless an exact live transaction is listed. Browser evidence is read-only synchronization, not browser-wallet signing. A proposal's semantic conflict must not be presented as natural validator disagreement.
