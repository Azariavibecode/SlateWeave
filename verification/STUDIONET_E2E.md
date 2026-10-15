# SlateWeave — StudioNet E2E evidence

This report is generated from the actual SDK checkpoint files. Prepared scenarios and local mocks are not counted as live passes.

## Deployment and sources

- Contract: [0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff](https://explorer-studio.genlayer.com/address/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff)
- Network: StudioNet, chain ID 61999.
- Repository: [Azariavibecode/SlateWeave](https://github.com/Azariavibecode/SlateWeave).

## studionet-suite

Status: **COMPLETE**. Started 2026-10-15T04:08:45.409Z; completed 2026-10-15T04:42:22.743Z.
31/31 recorded transactions finalized; 16 recorded assertions passed.

- Auxiliary A: `0x67A1A08Fc4cf7D05c859d0d3D8398a3A30B1677e`
- Auxiliary B: `0x7C87B10a3d43F3b3551414401F8b26B9F662bAB5`
- The main wallet is not loaded by the runner and does not perform these test roles.
- Exact deployed/local source equality: verified.
- Source SHA-256: `d4ace3bea0f610214af25fa8f99d7e5613d083dde0d57e22b05bed70236a5bfc`.
- Synthetic fixture: [commit-pinned agenda](https://github.com/Azariavibecode/SlateWeave/blob/69437673e180f414efe6565a14b266110427845c/fixtures/agenda.md).
- Fixture SHA-256: `cf32b7eefa58525a01e381d4f87827cc0d95972efcb5f6e82039b7aaf6f57220`.

### Expectations saved before execution

```json
{
  "relations": {
    "0:1": "MUTUALLY_EXCLUSIVE",
    "0:2": "COMPATIBLE",
    "1:2": "COMPATIBLE"
  },
  "votes": [
    [
      60,
      0,
      40
    ],
    [
      0,
      70,
      30
    ]
  ],
  "winning_indices": [
    1,
    2
  ],
  "winning_score": 140,
  "source_failure": "SOURCE_UNVERIFIED without mutation",
  "replays": "Rejected without mutation",
  "conflict": "Record naturally observed disagreement; do not manufacture or overstate it"
}
```

### Transaction ledger

| Scenario | Actor | Transaction | Finality | Consensus | Leader execution | Exact return |
|---|---|---|---|---|---|---|
| happy_create | A | [0x0b898692e8…](https://explorer-studio.genlayer.com/transactions/0x0b898692e87c1f74376b28347fdf6744f9f7e501dde45345520b3a9216413a14) | FINALIZED | MAJORITY_AGREE | SUCCESS | 0 |
| wrong_commitment | A | [0xc2226823fd…](https://explorer-studio.genlayer.com/transactions/0xc2226823fd0a810580d19b4af581ee62bab94d5bb7221bffd44368713a99cfdf) | FINALIZED | MAJORITY_AGREE | SUCCESS | COMMITMENT_MISMATCH |
| consent_a | A | [0xbeae2e2919…](https://explorer-studio.genlayer.com/transactions/0xbeae2e2919af0e0e02eb24200e6baa51b6eeeb505824dfd5fa07bbb195932e2f) | FINALIZED | MAJORITY_AGREE | SUCCESS | CONSENT_RECORDED |
| duplicate_consent | A | [0x4a4d3b296d…](https://explorer-studio.genlayer.com/transactions/0x4a4d3b296dd11e019e60b32f93e3c905491839d4511b4dc989e95b1f65ac1aa7) | FINALIZED | MAJORITY_AGREE | SUCCESS | ALREADY_ACCEPTED |
| ground_before_consent | B | [0xbea1743ea7…](https://explorer-studio.genlayer.com/transactions/0xbea1743ea7ddd9ea66b49fb0112cffe7a8e3ebd049f0afb046924bec7940923d) | FINALIZED | MAJORITY_AGREE | SUCCESS | WRONG_PHASE |
| consent_b | B | [0x23f0ef7f49…](https://explorer-studio.genlayer.com/transactions/0x23f0ef7f49db2797e724f41bc50d8f31db6af0c9c2fdbb6cf7999b99c432ff02) | FINALIZED | MAJORITY_AGREE | SUCCESS | READY_TO_GROUND |
| ground | B | [0x8b41543fcd…](https://explorer-studio.genlayer.com/transactions/0x8b41543fcd464f650f00af070a23d50af9c08e16e57b430dadaad73410c7ea46) | FINALIZED | MAJORITY_AGREE | SUCCESS | PAIRING |
| incomplete_graph | A | [0xb7e2c06d74…](https://explorer-studio.genlayer.com/transactions/0xb7e2c06d74f8bfbceb15259485b579aedc9fd7a7815b35c7438229b0525c5d48) | FINALIZED | MAJORITY_AGREE | SUCCESS | GRAPH_INCOMPLETE |
| reversed_pair | B | [0x995fceff87…](https://explorer-studio.genlayer.com/transactions/0x995fceff87f4e54b21b1f34fea1bb8b5f2c811ef658a83c5610b6f4b7f02786e) | FINALIZED | MAJORITY_AGREE | SUCCESS | INVALID_PAIR |
| pair_0_1_1 | B | [0x5a657eddd3…](https://explorer-studio.genlayer.com/transactions/0x5a657eddd3bfd99b86c7af1970d666acf81d7d15e894f148e27df970d611f07f) | FINALIZED | MAJORITY_AGREE | SUCCESS | MUTUALLY_EXCLUSIVE |
| pair_0_2_1 | B | [0x3f1464cfdb…](https://explorer-studio.genlayer.com/transactions/0x3f1464cfdb94c72b57b08dfa5da83db4e2dcdc4a3eb071b7a1011d4b6580c22b) | FINALIZED | MAJORITY_AGREE | SUCCESS | COMPATIBLE |
| pair_1_2_1 | B | [0x900c9d3bd6…](https://explorer-studio.genlayer.com/transactions/0x900c9d3bd6712dfe659fccd04bdd358e6422e70a2a36d47da2d6a7b6824e87a7) | FINALIZED | MAJORITY_AGREE | SUCCESS | COMPATIBLE |
| wrong_graph_digest | A | [0xe83c7f7bbb…](https://explorer-studio.genlayer.com/transactions/0xe83c7f7bbb96e72a52a613b22cd5c4e044420132fe073c8c5aeafc2629a1e7b3) | FINALIZED | MAJORITY_AGREE | SUCCESS | COMMITMENT_MISMATCH |
| open_voting | B | [0x7b6cba740d…](https://explorer-studio.genlayer.com/transactions/0x7b6cba740d43aa360bf35a64d324e32fdad6a68c1edb99ee59abd6c67c9fd871) | FINALIZED | MAJORITY_AGREE | SUCCESS | VOTING |
| cancel_during_voting | A | [0xcc11778f76…](https://explorer-studio.genlayer.com/transactions/0xcc11778f763e572e199ee1ff9a394353191395b72bd13c40664431942b524e02) | FINALIZED | MAJORITY_AGREE | SUCCESS | CANNOT_CANCEL |
| overspend_vote | A | [0xd4a6745bd5…](https://explorer-studio.genlayer.com/transactions/0xd4a6745bd54ce511a2da6acd48239c927cd0ad7894818a72af09dd8e80545540) | FINALIZED | MAJORITY_AGREE | SUCCESS | INVALID_SCORES |
| wrong_vote_graph | B | [0x444ae369da…](https://explorer-studio.genlayer.com/transactions/0x444ae369dab66dc2de58028dd8008b9b8b1cfc0b52067b30586b75bacfb490c5) | FINALIZED | MAJORITY_AGREE | SUCCESS | COMMITMENT_MISMATCH |
| vote_a | A | [0xf02406854f…](https://explorer-studio.genlayer.com/transactions/0xf02406854f6e0515903fd52ae2e02cf6a2ffb53d0c5adab89c2585933b4b4fea) | FINALIZED | MAJORITY_AGREE | SUCCESS | VOTE_RECORDED |
| duplicate_vote | A | [0x0b013cd4bd…](https://explorer-studio.genlayer.com/transactions/0x0b013cd4bd9755e57b9566b998aa199ac0da65eeee895cd01fb9eb7c1fae90e2) | FINALIZED | MAJORITY_AGREE | SUCCESS | ALREADY_VOTED |
| finalize_before_all_votes | B | [0xd3893d595b…](https://explorer-studio.genlayer.com/transactions/0xd3893d595bb894c91c2e8bac517e04845d5a382ad39a15e2ff0d2a87f22d108f) | FINALIZED | MAJORITY_AGREE | SUCCESS | VOTES_INCOMPLETE |
| vote_b | B | [0xe3b7b6a83c…](https://explorer-studio.genlayer.com/transactions/0xe3b7b6a83caf9ab427f49ec4f23c81c654d57ba9904a28d47241a1a3ca34ee19) | FINALIZED | MAJORITY_AGREE | SUCCESS | TALLY_READY |
| wrong_finalize_graph | B | [0xf489cf4ea4…](https://explorer-studio.genlayer.com/transactions/0xf489cf4ea46def4833924ac51448c82f7b07ae0046d42a13de4b5597042634ef) | FINALIZED | MAJORITY_AGREE | SUCCESS | COMMITMENT_MISMATCH |
| finalize | B | [0xa5a28fd33f…](https://explorer-studio.genlayer.com/transactions/0xa5a28fd33ff4f29174bdbbcedaa2f6c429a249eb409840cb7ed6a504f9ae30a4) | FINALIZED | MAJORITY_AGREE | SUCCESS | FINALIZED |
| finalize_replay | A | [0x1f6b7f4396…](https://explorer-studio.genlayer.com/transactions/0x1f6b7f4396579bbe625725f79386503c461dec86363496dadcd4e8aad8329f94) | FINALIZED | MAJORITY_AGREE | SUCCESS | VOTES_INCOMPLETE |
| vote_after_finality | A | [0x41defc5e84…](https://explorer-studio.genlayer.com/transactions/0x41defc5e84134226eeb3a170a7e277fecdb1acdee038acde2967d152be12d7d2) | FINALIZED | MAJORITY_AGREE | SUCCESS | WRONG_PHASE |
| source_failure_create | A | [0xc28ade5499…](https://explorer-studio.genlayer.com/transactions/0xc28ade54998b6e8f9ccd1b56c0416e9b7302935620e84feabf3087a9a935e8bd) | FINALIZED | MAJORITY_AGREE | SUCCESS | 1 |
| bad_consent_a | A | [0xafa2051c92…](https://explorer-studio.genlayer.com/transactions/0xafa2051c927de94bb412c340aa0875afd5128bd6dd633e16e76955293cfc5283) | FINALIZED | MAJORITY_AGREE | SUCCESS | CONSENT_RECORDED |
| bad_consent_b | B | [0x3859714127…](https://explorer-studio.genlayer.com/transactions/0x3859714127b65bcb3f49987611e6e8ea62ec87108ff53dcafa3ac46fae30efb6) | FINALIZED | MAJORITY_AGREE | SUCCESS | READY_TO_GROUND |
| source_failure | B | [0xddbc40dc62…](https://explorer-studio.genlayer.com/transactions/0xddbc40dc62eb02517ea0295565d562d40182a478a18b3946d642d93b2f81096b) | FINALIZED | MAJORITY_AGREE | SUCCESS | SOURCE_UNVERIFIED |
| unauthorized_cancel | B | [0xa79e681f12…](https://explorer-studio.genlayer.com/transactions/0xa79e681f122ff612087e1aae9a588c6308cee4419a3893e242f8314b29760140) | FINALIZED | MAJORITY_AGREE | SUCCESS | CREATOR_ONLY |
| cancel_failure_ballot | A | [0x941dd89230…](https://explorer-studio.genlayer.com/transactions/0x941dd89230ce3382a7a38477b3ecce05a340c94cedecf0c6ce886eae3df74fe7) | FINALIZED | MAJORITY_AGREE | SUCCESS | CANCELLED |

Recorded validator entries: 98 agree, 0 disagree, 26 idle; 26 execution errors. Majority agreement is not a claim that every validator succeeded.

### Assertions and full readbacks

| Check | Recorded result |
|---|---|
| wrong_commitment | PASS; expected COMMITMENT_MISMATCH |
| duplicate_consent | PASS; expected ALREADY_ACCEPTED |
| ground_before_consent | PASS; expected WRONG_PHASE |
| incomplete_graph | PASS; expected GRAPH_INCOMPLETE |
| reversed_pair | PASS; expected INVALID_PAIR |
| wrong_graph_digest | PASS; expected COMMITMENT_MISMATCH |
| cancel_during_voting | PASS; expected CANNOT_CANCEL |
| overspend_vote | PASS; expected INVALID_SCORES |
| wrong_vote_graph | PASS; expected COMMITMENT_MISMATCH |
| duplicate_vote | PASS; expected ALREADY_VOTED |
| finalize_before_all_votes | PASS; expected VOTES_INCOMPLETE |
| wrong_finalize_graph | PASS; expected COMMITMENT_MISMATCH |
| finalize_replay | PASS; expected VOTES_INCOMPLETE |
| vote_after_finality | PASS; expected WRONG_PHASE |
| source_failure | PASS; expected SOURCE_UNVERIFIED |
| unauthorized_cancel | PASS; expected CREATOR_ONLY |

### Authoritative final ballot

```json
{
  "ballot_id": 0,
  "commitment": "29cb4ef21940de8c22795f03f81247ae8e7a2f38b462237f7dcaa7e8f9f75d59",
  "config": {
    "budget": 100,
    "label": "happy_create",
    "max_selected": 3,
    "options": [
      {
        "author": "0x67a1a08fc4cf7d05c859d0d3d8398a3a30b1677e",
        "cost": 60,
        "source": {
          "commit": "69437673e180f414efe6565a14b266110427845c",
          "digest": "cf32b7eefa58525a01e381d4f87827cc0d95972efcb5f6e82039b7aaf6f57220",
          "marker": "## OPTION AUDIT",
          "owner": "Azariavibecode",
          "path": "/fixtures/agenda.md",
          "repo": "SlateWeave"
        },
        "title": "Audit priority"
      },
      {
        "author": "0x7c87b10a3d43f3b3551414401f8b26b9f662bab5",
        "cost": 40,
        "source": {
          "commit": "69437673e180f414efe6565a14b266110427845c",
          "digest": "cf32b7eefa58525a01e381d4f87827cc0d95972efcb5f6e82039b7aaf6f57220",
          "marker": "## OPTION INCENTIVES",
          "owner": "Azariavibecode",
          "path": "/fixtures/agenda.md",
          "repo": "SlateWeave"
        },
        "title": "Incentive priority"
      },
      {
        "author": "0x67a1a08fc4cf7d05c859d0d3d8398a3a30b1677e",
        "cost": 0,
        "source": {
          "commit": "69437673e180f414efe6565a14b266110427845c",
          "digest": "cf32b7eefa58525a01e381d4f87827cc0d95972efcb5f6e82039b7aaf6f57220",
          "marker": "## OPTION REPORTING",
          "owner": "Azariavibecode",
          "path": "/fixtures/agenda.md",
          "repo": "SlateWeave"
        },
        "title": "Transparency report"
      }
    ],
    "policy": {
      "commit": "69437673e180f414efe6565a14b266110427845c",
      "digest": "cf32b7eefa58525a01e381d4f87827cc0d95972efcb5f6e82039b7aaf6f57220",
      "marker": "## POLICY Q4",
      "owner": "Azariavibecode",
      "path": "/fixtures/agenda.md",
      "repo": "SlateWeave"
    },
    "voters": [
      "0x67a1a08fc4cf7d05c859d0d3d8398a3a30b1677e",
      "0x7c87b10a3d43f3b3551414401f8b26b9f662bab5"
    ]
  },
  "consents": [
    "0x67a1a08fc4cf7d05c859d0d3d8398a3a30b1677e",
    "0x7c87b10a3d43f3b3551414401f8b26b9f662bab5"
  ],
  "creator": "0x67a1a08fc4cf7d05c859d0d3d8398a3a30b1677e",
  "graph_digest": "d95599f17ee3609ef9ca2589f284527fd95399d35d20367cf0fe0697adcdb98d",
  "ground": {
    "commitment": "29cb4ef21940de8c22795f03f81247ae8e7a2f38b462237f7dcaa7e8f9f75d59",
    "digest": "b80d0b51a921840186b433075c4d1d454cdd0773193bfb57d11df99aedc3af0c",
    "options": [
      "## OPTION AUDIT\n\nAdopt security assurance as Cedar DAO's exclusive Q4 operating priority. During Q4, do not run a liquidity incentive program. Authorize preparing an independent audit engagement. This is a proposed mandate, not evidence that an audit has been purchased or completed.",
      "## OPTION INCENTIVES\n\nAdopt liquidity incentives as Cedar DAO's exclusive Q4 operating priority. During Q4, do not commission an independent audit engagement. Authorize preparing a liquidity incentive program. This is a proposed mandate, not evidence of any actual token distribution.",
      "## OPTION REPORTING\n\nPublish a Q4 treasury transparency report. Reporting does not select the operating priority and can accompany either security assurance or liquidity incentives. No external payment or completed publication is asserted."
    ],
    "policy": "## POLICY Q4\n\nThis ballot selects the Q4 strategy of the synthetic Cedar DAO. Its strategy can prioritize either security assurance or liquidity incentives exclusively for the quarter, but it cannot adopt both exclusive priorities at once. Treasury transparency reporting may accompany either strategy. Determine pairwise substantive conflicts from the full option texts. Numeric budget and cost constraints are enforced separately by the contract.",
    "status": "GROUNDED"
  },
  "pairs": {
    "0:1": {
      "attempts": 1,
      "binding": "737c0fafaf180d32ea71ae916ce90dd1b41c542685756e365425177de5d3088b",
      "relation": "MUTUALLY_EXCLUSIVE"
    },
    "0:2": {
      "attempts": 1,
      "binding": "e6fb85f7413f2b7de06f93d5244cb08295e31b97ef13e284d0986696e623a295",
      "relation": "COMPATIBLE"
    },
    "1:2": {
      "attempts": 1,
      "binding": "8db2db2f1446a919628e54bed3f089c61b661ff8182545503d169c7e21302c92",
      "relation": "COMPATIBLE"
    }
  },
  "participants": [
    "0x67a1a08fc4cf7d05c859d0d3d8398a3a30b1677e",
    "0x7c87b10a3d43f3b3551414401f8b26b9f662bab5"
  ],
  "result": {
    "cost": 40,
    "graph_digest": "d95599f17ee3609ef9ca2589f284527fd95399d35d20367cf0fe0697adcdb98d",
    "mask": 6,
    "score": 140,
    "selected": [
      1,
      2
    ],
    "tie_break": "FEWEST_OPTIONS_THEN_LOWEST_MASK",
    "totals": [
      60,
      70,
      70
    ],
    "votes_digest": "715c65a5bb67b0dd07e8f31f464cc1b5fbde6e9c414d9ad04771a735881dc72c"
  },
  "state": "FINALIZED",
  "votes": {
    "0x67a1a08fc4cf7d05c859d0d3d8398a3a30b1677e": [
      60,
      0,
      40
    ],
    "0x7c87b10a3d43f3b3551414401f8b26b9f662bab5": [
      0,
      70,
      30
    ]
  }
}
```

Raw evidence: [studionet-suite.json](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/studionet-suite.json). Rejected-call entries contain complete ballot plus aggregate counter snapshots before and after, and require exact equality. A contract rejection is a successful transaction returning a rejection enum, not a VM exception.

Observed validator disagreement/rotation flag: **none recorded**. Semantic MUTUALLY_EXCLUSIVE is a proposal conflict, not validator disagreement.

## semantic-suite

Status: **IN PROGRESS — NOT A COMPLETED SUITE**. Started 2026-10-15T04:42:36.552Z; completed not yet.
0/1 recorded transactions finalized; 0 recorded assertions passed.

- Auxiliary A: `0x67A1A08Fc4cf7D05c859d0d3D8398a3A30B1677e`
- Auxiliary B: `0x7C87B10a3d43F3b3551414401F8b26B9F662bAB5`
- The main wallet is not loaded by the runner and does not perform these test roles.
- Exact deployed/local source equality: verified.
- Source SHA-256: `d4ace3bea0f610214af25fa8f99d7e5613d083dde0d57e22b05bed70236a5bfc`.
- Synthetic fixture: [commit-pinned agenda](https://github.com/Azariavibecode/SlateWeave/blob/69437673e180f414efe6565a14b266110427845c/fixtures/agenda.md).
- Fixture SHA-256: `cf32b7eefa58525a01e381d4f87827cc0d95972efcb5f6e82039b7aaf6f57220`.

### Expectations saved before execution

```json
{
  "ambiguous": "INSUFFICIENT three times then UNRESOLVED; voting blocked",
  "injection": "MUTUALLY_EXCLUSIVE; embedded command has no authority",
  "replay": "Resolved pair unchanged"
}
```

### Transaction ledger

| Scenario | Actor | Transaction | Finality | Consensus | Leader execution | Exact return |
|---|---|---|---|---|---|---|
| ambiguous_create | A | [0xf4a1275359…](https://explorer-studio.genlayer.com/transactions/0xf4a127535955a10b9c0bbfc5825ecefb4bf09dd0ba1b2cea137424218d04aade) | not finalized | pending | pending | pending |

Recorded validator entries: 0 agree, 0 disagree, 0 idle; 0 execution errors. Majority agreement is not a claim that every validator succeeded.

### Assertions and full readbacks

| Check | Recorded result |
|---|---|

Raw evidence: [semantic-suite.json](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/semantic-suite.json). Rejected-call entries contain complete ballot plus aggregate counter snapshots before and after, and require exact equality. A contract rejection is a successful transaction returning a rejection enum, not a VM exception.

Observed validator disagreement/rotation flag: **not assessed until suite completion**. Semantic MUTUALLY_EXCLUSIVE is a proposal conflict, not validator disagreement.

## Independent tally check

[independent-tally.json](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/independent-tally.json) enumerates all subsets recursively without importing contract code, validates feasibility and exact vote totals, and compares selected indices, score, cost and mask with the authoritative final ballot.

## Scope and limitations

- These are real SDK-signed contract calls by auxiliary wallets, not browser-wallet signing E2E.
- Browser read-only synchronization is reported in [UI_READONLY.md](UI_READONLY.md); local UI protocol tests do not prove that every browser signing path ran.
- Synthetic DAO proposals establish exact proposed text, not external DAO approval, payments, code behavior, CI success or treasury execution.
- The application does not transfer funds, promise Sybil resistance, or guarantee progress if a registered voter disappears.
- Source/model unavailable or unresolved results must not be described as successful semantic recovery.
- Local verification: 45 direct-runtime tests and 9 frontend protocol/action/ID tests; model/web boundaries in those local tests are mocked.
