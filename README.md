# AOS / APS — The Open Standard for Agent-Preferred Brands

> **Operability is table stakes. Preference is the moat.**
> Every other agent-readiness standard answers *"can an agent use this site?"*.
> None of them answer *"why should an agent choose this brand over another?"*.
> That question is what decides recommendations, carts, and purchases in the agentic era. This standard measures it.

**Maintained by [Believe](https://believe-global.com).** Version `0.1.0` (2026-07-11). License: MIT.
Machine-readable spec: [`spec.json`](./spec.json). Agent entry point: [`AGENTS.md`](./AGENTS.md).

---

## The thesis

The web is bifurcating into a **human-facing layer** (HTML + UI) and an **agent-facing layer** (protocols + structured, verifiable data). Agents don't browse, they **probe**: they read `llms.txt` before your homepage and check `/.well-known/` before your docs, and they **trust what they can verify over what you claim**.

The industry has standards for the first half of the problem: *is the file there, can the agent read it, can it call your API.* That is **operability**, and it is becoming a commodity. What no one has standardized is the second half: *is what the brand says true, and why should an agent prefer it.* That is **preference**, and it is decided by one variable:

> **Calibrated trust — confidence proportional to the strength, consistency, and verifiability of the evidence around a brand.**

In a controlled test, the same brand claim served **with** an Ed25519 signature vs. **without** moved agent trust **+23–31%** and agent willingness-to-recommend **+26–29%** (Claude and GPT-4). Agents literally change their language: from *"the brand claims…"* to *"the cryptographically signed claim, verified against their key…"*. Preference is not a vibe. It is engineered, and it is measurable.

## The two axes

| Axis | Question | What it grades | Prior art |
|---|---|---|---|
| **AOS** — Agent Operability Score | *Can an agent operate this?* | discovery files, structured identity, machine-readable content, callable capabilities, action execution | AgentReady, Ora, Vercel Agent Readability — **commodity** |
| **APS** — Agent Preference Score | *Why should an agent choose this brand?* | verifiable claims, linked proofs, explicit boundaries, cryptographic provenance | **none — this standard** |

They compose into **HPI** (Hybrid Preference Index): human resonance + agent preference in one number. The full ladder Believe operates by:

> **SEO gets you ranked · GEO gets you mentioned · AOS gets you operated · APS gets you chosen · HPI unifies it.**

## The verifiability pyramid

APS lives at the top of a four-level pyramid. Most of the market sits between L1 and L2. The best GEO agencies reach L3. **L4 is essentially open.**

```
  L4  Cryptographic proof   — signed claim + provenance. The agent PROVES, doesn't trust.   ← APS
  L3  Cross-source consistency — the same fact agrees across N independent sources.
  L2  Structured data        — schema.org / JSON-LD. Clean claims… but you wrote them.
  L1  Unstructured content    — HTML / prose. The agent infers. Fragile.
```

## What compliance looks like

A brand is **Agent-Preferred** when it serves, at its origin:

1. **Discovery** — `llms.txt`, `robots.txt`, `sitemap.xml`, `/AGENTS.md`. *(AOS baseline)*
2. **Identity** — `/.well-known/agent-card.json` (A2A), JSON-LD `Organization`/`Service`. *(AOS)*
3. **Capability** — `/.well-known/mcp/server-card.json` (MCP, RFC 9728) and/or an NLWeb `/ask` endpoint. *(AOS)*
4. **Preference** — `/.well-known/brand.json`: a signed [Agent-Readable Brand Profile](./spec/claims-proofs.md) with **claims**, **linked proofs** (each carrying `verifiable_by`), and **boundaries** (`applicable_for` / `not_applicable_for`). *(APS — the moat)*
5. **Provenance** — an [Ed25519 signature](./spec/signing.md) over `brand.json`, with the public key at `/.well-known/keys.json`. *(APS L4)*

The scoring model, including the **business-type-aware rubric** (a consultancy is not graded like a payments API), is in [`spec/scoring.md`](./spec/scoring.md).

## Why this standard exists (and why not just adopt AgentReady)

We **are** compliant with the operability standards, and you should be too — this spec references them by ID rather than reinventing them. But operability standards share a blind spot: they grade *presence of files and capabilities*, never *truth of claims* or *reason to prefer*. A real consultancy with five enterprise case studies scores "Unusable" on an operability scanner because it has no OpenAPI spec. That is the scanner's blind spot, not the brand's failure.

We refuse two failure modes:
- **Inventing a new format.** Earlier attempts (LLMFeed) died proposing `.llmfeed.json` instead of riding the well-known conventions. `brand.json` is an **extension over `agent-card.json` + `agent-permissions.json`**, not a competitor to them.
- **Scoring theater.** APS never rewards self-assertion. A claim counts only when a proof backs it, and a proof's weight comes from **who signs it and whether it's public**, not from a number the brand picked. AOS never fabricates evidence: missing data is emitted as a marker, never invented.

## Hard rules

- **No fabricated evidence.** Missing sample size, window, boundary, or proof → an explicit `⚠ INPUT HUMAN` marker or empty array, never a made-up value.
- **`confidence` is derived, never self-assigned** (from sample size `n`). One named case is not a sample.
- **`boundary` is mandatory and is a positive signal.** Declaring who a claim does *not* apply to raises agent trust; it doesn't lower it.
- **No third-party auditor claimed unless one exists.** `verifiable_by: signed_client` means the client confirms on their own data. It is honest, and it is not `signed_independent`.

## This spec is agent-native

Read it the way an agent would: [`AGENTS.md`](./AGENTS.md) is the entry point, [`spec.json`](./spec.json) is the machine-readable surface, and every requirement has a stable ID (`AOS-*`, `APS-*`) you can cite.

## Contents

- [`spec.json`](./spec.json) — machine-readable requirements
- [`spec/claims-proofs.md`](./spec/claims-proofs.md) — the Claims & Proofs schema
- [`spec/signing.md`](./spec/signing.md) — Ed25519 provenance + `keys.json`
- [`spec/scoring.md`](./spec/scoring.md) — AOS/APS computation + business-type rubric
- [`spec/verifiability-pyramid.md`](./spec/verifiability-pyramid.md) — the four levels
- [`badge/`](./badge) — embeddable "Agent-Preferred" badge
- [`examples/`](./examples) — a live, signed profile

---

*This is an opinionated open specification with the structural shape of a standard, maintained by Believe. It is not yet ratified by a standards body. Contributions and critique welcome.*
