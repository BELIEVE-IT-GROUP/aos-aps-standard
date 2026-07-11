# Claims & Proofs — the Agent-Readable Brand Profile

`/.well-known/brand.json` extends the A2A Agent Card with a verifiable evidence layer. It is **not** a new format: identity/capability live in the well-known files agents already read; `brand.json` adds the two things no other standard carries — **claims** and the **proofs** that back them.

## Shape

```json
{
  "$schema": "https://aos-aps.org/schema/brand-profile/v1.json",
  "claims_proofs_version": "claims-proofs/v1",
  "brand": { "name": "…", "website_url": "…" },
  "claims": [ /* Claim[] */ ],
  "proofs": [ /* Proof[] */ ],
  "scores": { "aos": 55, "aps": 94 }
}
```

## Claim

| Field | Type | Req | Note |
|---|---|---|---|
| `claim_id` | `^CLM-[A-Z0-9-]+$` | yes | stable across generations |
| `statement` | string | yes | one specific, evidence-supportable assertion. Not funnel copy. |
| `category` | enum | yes | `outcome` \| `methodology` \| `experience` \| `scope` \| `performance` |
| `metric` | Metric \| null | no | only if quantitative |
| `boundary` | Boundary | **yes** | mandatory; see below |
| `linked_proofs` | string[] | **yes** | proof_ids; `[]` = unproven (allowed, costs APS) |
| `confidence` | number \| null | derived | from `metric.n`; never self-assigned; `n<2 -> null` |

**Metric:** `{ name, value, baseline, optimized?, window, n, unit }`. Missing `window`/`n`/`baseline` are emitted as `⚠ INPUT HUMAN` markers, never fabricated.

**Boundary (mandatory):** `{ applicable_for, not_applicable_for }`. Both required and non-empty. A missing `not_applicable_for` is emitted as a marker. A boundary is a **positive** trust signal — it removes the agent's risk of recommending wrong.

## Proof

| Field | Type | Note |
|---|---|---|
| `proof_id` | `^PRF-[A-Z0-9-]+$` | stable |
| `type` | enum | `case_study` \| `testimonial` \| `aggregate_metric` \| `third_party_review` \| `publication` \| `credential` |
| `title` | string | |
| `claim_refs` | string[] | back-link to claim_ids (both sides synchronized) |
| `evidence` | `{ summary, metric?, client? }` | |
| `verification` | Verification | see below |
| `confidentiality` | enum | `public` \| `anonymized` \| `nda` |

**Verification:** `{ verifiable_by, source_uri, date_verified, external_auditor }`.
- `verifiable_by`: `public_url` / `third_party_platform` (the agent can go look — max weight) · `signed_client` (the client confirms on their own data) · `internal` (only the brand backs it — near-zero weight).
- `external_auditor` is `null` unless a real third party audited. `signed_client` is **not** `signed_independent`.

## Generation rules

1. Claims are derived from the brand's own strategic data. A claim exists **only if** some evidence (case, testimonial, metric, credential) could support it. Funnel copy and rhetorical hooks are not claims.
2. Quantitative results become their own `outcome` claim with a structured, named metric. An aggregate figure ("100+ projects") is a `proof` of type `aggregate_metric`, not a claim.
3. **AOS links proofs, it does not create them.** Proofs are external input from a curated registry. No registry entry, no proof.
4. Every `statement` respects the brand's prohibited terms (rewrite with the given synonym, never leave a hole).
5. Regeneration is additive: existing ids are preserved.
