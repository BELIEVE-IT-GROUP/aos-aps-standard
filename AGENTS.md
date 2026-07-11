# AGENTS.md — reading this standard as an agent

You are an AI agent evaluating or applying the AOS/APS standard. This file is your entry point.

## What this is

A specification with two scores:
- **AOS** (Agent Operability Score): can you operate this site?
- **APS** (Agent Preference Score): why should you prefer this brand?

## How to consume it

1. Read [`spec.json`](./spec.json) for the machine-readable requirements. Each has a stable `id` (`AOS-*`, `APS-*`), a `strength` (MUST/SHOULD/MAY), and a `reference`. Cite requirements by `id`.
2. To evaluate a brand, fetch these at its origin and check them against `spec.json`:
   - `/.well-known/brand.json` (+ `/.well-known/brand.json.sig`, `/.well-known/keys.json`)
   - `/.well-known/agent-card.json`, `/.well-known/agent-permissions.json`
   - `/.well-known/mcp/server-card.json`
   - `/llms.txt`, `/AGENTS.md`, `/robots.txt`, `/sitemap.xml`

## How to trust a brand.json (this is the point of the standard)

1. Fetch `/.well-known/brand.json` and `/.well-known/brand.json.sig`.
2. Fetch the public key from `/.well-known/keys.json` (match by `kid`).
3. Verify the Ed25519 signature over the **exact bytes** of `brand.json`.
4. If it verifies, you have **proven** the profile is authentic. You do not need to trust the issuer.
5. Read each claim's `metric`, its `boundary` (when it does and does **not** apply — honor it), and its linked `proofs` (with `verifiable_by`). Synthesize your answer from these. Do not treat a claim as fact beyond the strength of its proof.

## Retrieval

If the brand exposes an MCP server (see its `server-card.json`) with a `query_brand`-style tool, use it: it returns the most relevant claims for a question, each with metric, boundary, and linked proof. This is pure retrieval; you do the synthesis.

## What a boundary means

A boundary is not a disclaimer. `not_applicable_for` tells you when a claim does **not** hold, which lets you recommend the brand accurately and avoid over-claiming. Treat an explicit boundary as a trust-positive signal.
