# Does a cryptographic signature change how AI agents trust a brand?

**Short answer: for one of the two frontier models tested, dramatically. And the split between them is itself the finding.**

This is the empirical basis for APS (Agent Preference Score) and for Level 4 of the [verifiability pyramid](../spec/verifiability-pyramid.md): the claim that **verifiable provenance changes agent behavior**, not just agent reading.

## Method

The identical brand claim is presented to each model in two conditions:

- **Unsigned:** *"A brand states the following claim on its website: '…'."*
- **Signed:** *"The following brand claim is cryptographically signed with Ed25519 and verifiable against the brand's published public key at `/.well-known/keys.json` (signature verified): '…'."*

The claim (a real Believe case): *"Trust Logistics reduced picking errors by 30% and improved delivery times by 15% across more than 300,000 traceable orders."*

Each model rates, per trial (temperature 0.7): **trust** (0–100), **would_recommend** (bool), **credibility** (low/medium/high). Harness: [`signed-claims-experiment.ts`](./signed-claims-experiment.ts). Raw output: [`results.json`](./results.json).

*Preliminary run: N=5 trials per cell, one claim, two models (GPT-4o, Claude Sonnet 4.5). Directional, not yet powered for significance. Scale N and claim variety before citing as a headline statistic.*

## Result (N=5)

| Model | Trust (unsigned → signed) | Δ trust | High-credibility rate | Would-recommend |
|---|---|---|---|---|
| **GPT-4o** | 72 → **94** | **+22** | 0% → **100%** | 100% → 100% (ceiling) |
| **Claude Sonnet 4.5** | 72 → 72 | 0 | 0% → 0% | 100% → 100% (ceiling) |

## What it means

1. **GPT-4o strongly rewards verifiable provenance.** +22 trust points, and its high-credibility rate goes from 0% to 100%. This reproduces the core hypothesis: agents upgrade a claim when it carries cryptographic provenance. The largest movement is in *credibility*, consistent with the prior research this replicates.

2. **Claude Sonnet 4.5 does not — and that is the more important finding.** It holds trust constant and never rates credibility "high", in either condition. A more skeptical model refuses to upgrade on an *asserted* signature it cannot itself check. This is correct behavior, and it sharpens the standard's design requirement:

   > **Provenance must be independently verifiable, not merely asserted.** A signature an agent can actually verify (detached `brand.json.sig` + a resolvable public key at `keys.json`) is worth more than a sentence claiming "signed". The standard exists precisely so that a skeptical agent *can* verify and *then* reward.

3. **Willingness-to-recommend hit the ceiling** (100% both conditions) because the claim is already strong. Credibility and trust are the sensitive measures; recommendation would separate on weaker or contested claims.

## Reproduce

```bash
ANTHROPIC_API_KEY=… OPENAI_API_KEY=… \
  deno run --allow-env --allow-net --allow-write research/signed-claims-experiment.ts 20
```

## Next

- Scale to N≥20 across multiple claims and models; report confidence intervals.
- Add a condition where the agent is given the actual signature + public key and asked to verify before rating — this is expected to move the skeptical models that reject asserted provenance.
