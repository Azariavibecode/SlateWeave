# SlateWeave architecture

## Distinct mechanism

SlateWeave is a bounded preference aggregation mechanism. Its core data structures are an immutable agenda, a semantic conflict graph, a voter ledger and a deterministic subset solver. It does not compare contract upgrades, issue capabilities or permits, or activate implementations. Its UI is an agenda workspace with option cards, pair relations and point allocation.

## Consent commitment

The configuration commitment is domain separated by `SLATEWEAVE_CONFIG_V1`, contract address, ballot ID, creator and normalized complete configuration. The configuration includes every option, author, voter, source descriptor, policy, declared cost, budget and maximum selection count. Authors and voters are deduplicated into participants, all of whom must accept the same commitment before grounding.

## Grounding and graph binding

Grounding authenticates full Git commit identity, tree inclusion, unique file path, blob type/mode/size, Git blob hash and raw SHA-256. Section extraction requires a unique exact Markdown heading line. Evidence documents are cached within one acquisition to avoid repeatedly fetching the same file. The complete snapshot is stored atomically.

Each pair binding includes the full ballot commitment, ground digest and ordered option indices. The model returns only `{binding, relation}`. A comparative validator independently evaluates the same sources. Malformed model output becomes `INSUFFICIENT`. The state boundary checks binding and enum again before storage.

Resolved relations cannot be overwritten. Insufficient pairs can be reevaluated against the same grounded snapshot at most three times. They cannot open voting. Missing consensus does not commit a pair result. When every unordered pair has a substantive relation, the graph digest binds all relations, ground digest and original ballot commitment.

## Voting and selection

Voting opens only after graph completion. Each registered wallet submits one integer vector of 0–100 scores whose sum is at most 100, or zeros to abstain. Votes carry the ballot commitment and exact graph digest. Every voter must submit before finalization.

The solver checks all subsets (maximum 256). It excludes mutex pairs, excessive total declared cost and excessive size. It maximizes total points, then minimizes number of selected options, then minimizes the bitmask. All-zero votes choose the empty slate. Terminal results bind the votes digest and graph digest and cannot be overwritten.

## Source authority

An author wallet's consent endorses the exact proposed text in this ballot. It does not prove that wallet owns the repository or has external DAO authority. Fixture documents contain proposals rather than evidence of completed actions. The product makes no claim that a real DAO approved or executed the selected agenda.
