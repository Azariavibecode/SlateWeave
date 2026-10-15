# Local verification

Current checks on 2026-10-15:

- Direct contract runtime: **45 passed**. Uses the real public entrypoints through `gltest.direct`, the pinned GenLayer runner, sender context and mocked web/model boundaries.
- UI protocol/transport/action tests: **9 passed**. Covers consensus failure, leader error, contract rejection, returned ID mismatch, readback failure, participant consent gating, duplicate/terminal vote gating, wrong pair readback, and blank/noncanonical/unsafe ballot IDs.
- Frontend production build: successful.
- Frontend dependency audit: zero vulnerabilities in the final audit result.
- Browser smoke: desktop initial view and creation dialog; mobile 390px creation dialog, no horizontal overflow, creation disabled without wallet/deployment, background scroll locked while dialog is open.
- Images: supplied logo copied unchanged; `ui-desktop.png` and `ui-mobile-form.png` are local preview screenshots, not live transaction evidence.

Direct model and comparative-judge responses are mocked. The wrong-leader test independently re-evaluates a pair and supplies a deterministic comparison mock; it proves the validator wiring rejects a conflicting leader relationship under that mock. It does not measure real model reliability.

The synthetic fixture is now pinned to public commit `69437673e180f414efe6565a14b266110427845c`. The user deployed contract `0xf04875D5FF900C87aFa08C84cb2D14c4daCb73Ff`; SDK readback confirms exact source equality (SHA-256 `d4ace3bea0f610214af25fa8f99d7e5613d083dde0d57e22b05bed70236a5bfc`). Both live suites subsequently completed with 47 finalized transactions and an independent read-only audit of all hashes; see [the separate live evidence](STUDIONET_E2E.md). Local pass counts are not substitutes for that evidence. No public frontend hosting deployment is claimed here.
