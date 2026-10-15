# Cloudflare production deployment

- Public website: https://slateweave.pages.dev
- Immutable deployment: https://fc2c9d23.slateweave.pages.dev
- Cloudflare project: `slateweave`
- Environment / branch: `Production` / `main`
- Deployment ID: `fc2c9d23-87be-4594-8597-888dc9b6eef9`
- Source commit: `680cd506bd959ffb46dfc19a1c1b71471ad10d3a`
- Configured StudioNet contract: `0xf04875D5FF900C87aFa08C84cb2D14c4daCb73Ff`

## Post-deployment verification

On 2026-10-15 the stable production domain returned HTTP 200. All five files in `frontend/dist` were fetched from that domain and matched their local SHA-256 digest byte-for-byte. The compiled application bundle also contains the configured contract address.

The machine-readable record, including every asset path and digest, is in [`cloudflare-deployment.json`](cloudflare-deployment.json). The API token was passed only through the deployment process environment and is not stored in this repository.

This hosting check proves that the published static files match the tested build. StudioNet transaction and contract-behavior evidence remains separately documented in [`STUDIONET_E2E.md`](STUDIONET_E2E.md).
