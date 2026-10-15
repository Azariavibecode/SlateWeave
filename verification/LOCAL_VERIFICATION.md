# Local verification

Current checks on 2026-10-15:

- Direct contract runtime: **45 passed**. Uses the real public entrypoints through `gltest.direct`, the pinned GenLayer runner, sender context and mocked web/model boundaries.
- UI protocol/transport/action tests: **8 passed**. Covers consensus failure, leader error, contract rejection, returned ID mismatch, readback failure, participant consent gating, duplicate/terminal vote gating, wrong pair readback.
- Frontend production build: successful.
- Frontend dependency audit: zero vulnerabilities in the final audit result.
- Browser smoke: desktop initial view and creation dialog; mobile 390px creation dialog, no horizontal overflow, creation disabled without wallet/deployment, background scroll locked while dialog is open.
- Images: supplied logo copied unchanged; `ui-desktop.png` and `ui-mobile-form.png` are local preview screenshots, not live transaction evidence.

Direct model and comparative-judge responses are mocked. The wrong-leader test independently re-evaluates a pair and supplies a deterministic comparison mock; it proves the validator wiring rejects a conflicting leader relationship under that mock. It does not measure real model reliability.

The source fixture is synthetic and has not yet been pinned to a public repository commit. There is no SlateWeave StudioNet deployment, public hosting deployment, or live E2E claim at this stage.
