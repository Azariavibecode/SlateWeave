# Threat model and boundaries

| Attack | Contract control |
|---|---|
| Accept parent, then add consequential option | Entire option set locked before first consent; no mutation entrypoint |
| Reuse another ballot's consent | Contract address, ballot ID, creator and full config are commitment-bound |
| Impersonate author/voter | Authenticated transaction sender must belong to exact participant/voter list |
| Swap policy or proposal bytes | Fetch/recompute SHA-256 and Git blob identity; no partial ground committed |
| Inject duplicate heading or ambiguous file identity | Exact unique heading and exact unique tree path required |
| Prompt injection | Proposal text is data; bounded output, bound pair identity and independent comparative judgment |
| Wrong leader binding or unknown enum | Invalid positive rejected at boundary; malformed model response becomes insufficient |
| Open voting with missing/insufficient pair | Hard graph-completion gate |
| Rejudge a resolved relation | Pair replay rejected; graph cannot be rewritten |
| Vote against another graph | Ballot commitment plus exact graph digest checked |
| Double vote, wrong voter, negative/fractional/bool or oversized vector | Deterministic input and identity guards |
| Finalize before every vote | Hard count/phase gate; voter roster immutable |
| Cancel after seeing votes | Cancellation forbidden once voting opens |
| Select incompatible proposals | Deterministic solver excludes every conflicting pair |
| Three individually affordable options exceed aggregate budget | Cost sum checked for every candidate subset |
| Replay finalization | Terminal phase prevents winner/counter mutation |

Local direct tests mock website/model responses and the comparative judge. They prove code-path and invariant behavior under those mocks; they are not evidence of live validator consensus. The prepared SDK runner records actual network votes, execution, return values and complete before/after snapshots when deployed.

No custody or clock primitive is used. Liveness depends on a fixed voter roster completing its vote/abstention. Pending voting cannot be cancelled by the creator. This is explicit; continuous monitoring, automatic expiry and eventual completion despite absent voters are not claimed.
