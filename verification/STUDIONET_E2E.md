# SlateWeave — StudioNet E2E evidence

This report is generated from the actual SDK checkpoint files. Prepared scenarios and local mocks are not counted as live passes.

## Deployment and sources

- Contract: [0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff](https://explorer-studio.genlayer.com/address/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff)
- Network: StudioNet, chain ID 61999.
- Repository: [Azariavibecode/SlateWeave](https://github.com/Azariavibecode/SlateWeave).

## studionet-suite

Status: **IN PROGRESS — NOT A COMPLETED SUITE**. Started 2026-10-15T04:08:45.409Z; completed not yet.
2/3 recorded transactions finalized; 1 recorded assertions passed.

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
| consent_a | A | [0xbeae2e2919…](https://explorer-studio.genlayer.com/transactions/0xbeae2e2919af0e0e02eb24200e6baa51b6eeeb505824dfd5fa07bbb195932e2f) | not finalized | pending | pending | pending |

### Assertions and full readbacks

| Check | Recorded result |
|---|---|
| wrong_commitment | PASS; expected COMMITMENT_MISMATCH |

Raw evidence: [studionet-suite.json](live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff/studionet-suite.json). Rejected-call entries contain complete ballot plus aggregate counter snapshots before and after, and require exact equality. A contract rejection is a successful transaction returning a rejection enum, not a VM exception.

Observed validator disagreement/rotation flag: **not assessed until suite completion**. Semantic MUTUALLY_EXCLUSIVE is a proposal conflict, not validator disagreement.

## Scope and limitations

- These are real SDK-signed contract calls by auxiliary wallets, not browser-wallet signing E2E.
- Browser read-only synchronization must be reported separately; local UI protocol tests do not prove that every browser signing path ran.
- Synthetic DAO proposals establish exact proposed text, not external DAO approval, payments, code behavior, CI success or treasury execution.
- The application does not transfer funds, promise Sybil resistance, or guarantee progress if a registered voter disappears.
- Source/model unavailable or unresolved results must not be described as successful semantic recovery.
- Local verification: 45 direct-runtime tests and 8 frontend protocol tests; model/web boundaries in those local tests are mocked.
