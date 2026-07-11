# Scoring — how AOS and APS are computed

Both scores are 0–100. Both are computed from **public, observable signals** — what the site actually serves, not what it claims. Weights below are the `v0.1` default; changing them is a new spec version, never a silent tweak.

## APS (Agent Preference Score)

Everything comes from the Claims & Proofs layer.

```
proof_coverage    = claims_with_at_least_one_proof / total_claims
boundary_coverage = claims_with_a_real_not_applicable_for / total_claims
evidence_strength = mean over proofs of ( w_verifiable_by * w_confidentiality )
        w_verifiable_by:  public_url | third_party_platform = 1.0 ; signed_provenance = 0.8 ; signed_client = 0.6 ; internal = 0.2
        w_confidentiality: public = 1.0 ; anonymized = 0.5 ; nda = 0.3
smoke_penalty     = fraction of statements that graze the brand's prohibited terms (should be 0)

APS = 100 * ( 0.35*proof_coverage + 0.25*boundary_coverage + 0.30*evidence_strength + 0.10*(1 - smoke_penalty) )
```

- `confidence` per claim is derived from sample size `n`: `clamp(1 - 1/sqrt(n), 0.5, 0.95)` for `n>=2`, else `null`. One named case is not a sample; a 0.5 confidence on a single data point would be false sophistication.
- A brand with many claims and no verifiable proofs scores low. Correct.
- `signed_provenance` (0.8) applies when the whole `brand.json` is Ed25519-signed and served with a resolvable public key. It is the reward for Level-4 provenance.

## AOS (Agent Operability Score) — business-type aware

This is the deliberate departure from one-size-fits-all operability scanners. A brand/consultancy is **not** graded like a payments API. AOS selects a rubric by business type and marks inapplicable requirements `N/A` instead of failing them.

| Surface | Weight | Brand / service | Product / API |
|---|---|---|---|
| Discovery files (llms.txt, AGENTS.md, sitemap) | 0.30 | required | required |
| Structured identity (agent-card, JSON-LD, trust pages) | 0.30 | required | required |
| Capability manifests (MCP server-card, NLWeb /ask) | 0.25 | recommended | required |
| Action execution (operable forms, callable tools) | 0.15 | recommended | required |
| Public API / OpenAPI / OAuth / SDK / webhooks | — | **N/A** | required |
| Agentic payments (x402 / ACP / UCP) | — | N/A unless commerce | conditional |

AOS = weighted mean over the **applicable** surfaces for the detected business type. Inapplicable surfaces are excluded from the denominator, not scored as zero. This is why a consultancy with strong discovery + identity + evidence scores well here and "Unusable" on an API-shaped scanner.

## Reporting

Report per requirement by `id` (`AOS-DISC-01`, `APS-PROV-01`, …) with status `pass | fail | n/a` and the observed evidence. A score without a per-requirement breakdown is a badge, not a diagnosis.
