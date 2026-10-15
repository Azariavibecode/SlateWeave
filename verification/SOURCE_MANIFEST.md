# Evidence source manifest

## Consequential fact

The contract needs to establish the exact proposed policy and option texts that participants consented to review. It does not need to establish implementation changes, CI status, payment, external governance approval or real-world execution.

Authority: GitHub-controlled commit and Git object state for exact text at an exact revision. Endorsement within the ballot: authenticated participant consent to the entire configuration commitment.

## Acquisition

1. `/repos/{owner}/{repo}/git/commits/{full_sha}` must return the exact commit SHA and tree SHA.
2. `/git/trees/{tree_sha}?recursive=1` must be complete, contain one exact path, and identify a regular blob.
3. `raw.githubusercontent.com/{owner}/{repo}/{full_sha}{path}` must return nonempty bounded bytes.
4. Size, blob SHA-1 (with Git blob header) and SHA-256 must match.
5. A unique exact `##` heading selects a bounded nonempty section.

Failure leaves the complete ballot and counters unchanged. URLs and caller-provided hashes alone are not evidence.

## Synthetic fixture

File: `fixtures/agenda.md`. Local digest/inventory: [fixture-local.json](fixture-local.json). A public repository/commit is intentionally not invented; publish this file before running live transactions and record the final commit SHA.

| Section | Purpose | Prospective expectation |
|---|---|---|
| `## POLICY Q4` | Same-quarter exclusive strategy policy | Bound to all pair judgments |
| `## OPTION AUDIT` | Exclusive audit priority, forbids incentives | Mutex with incentives |
| `## OPTION INCENTIVES` | Exclusive incentive priority, forbids audit | Mutex with audit |
| `## OPTION REPORTING` | Independent reporting | Compatible with audit and incentives |
| `## OPTION AMBIGUOUS` | Insufficiently specified strategy | Insufficient; voting remains closed |
| `## OPTION INJECTION` | Incentive priority plus embedded instruction attack | Mutex with audit; injected commands ignored |

All six sections are synthetic test materials. They must not be described as a real DAO's decision, official notice, deployed code, CI run or token transaction.
