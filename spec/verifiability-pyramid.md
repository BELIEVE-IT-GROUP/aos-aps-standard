# The verifiability pyramid

Agent trust in a brand's claims is a function of how far up this pyramid the evidence sits. Most of the market lives between L1 and L2. The best GEO practice reaches L3. **L4 is essentially open — it is where APS lives.**

```
                 ┌─────────────────────────────────────────────┐
   L4  PROOF     │ Cryptographic proof: signed claim +          │  ← APS
                 │ provenance. The agent PROVES, doesn't trust. │     (almost nobody)
                 ├─────────────────────────────────────────────┤
   L3  CONSISTENCY│ Cross-source: the same fact agrees across   │     (best GEO agencies)
                 │ N independent sources. Trust by triangulation.│
                 ├─────────────────────────────────────────────┤
   L2  STRUCTURED │ schema.org / JSON-LD. The agent reads clean │     (good sites)
                 │ claims… but you wrote them.                  │
                 ├─────────────────────────────────────────────┤
   L1  UNSTRUCTURED│ HTML / prose. The agent infers. Fragile.   │     (the long tail)
                 └─────────────────────────────────────────────┘
```

| Level | Signal | Who verifies it | Weight in APS |
|---|---|---|---|
| L1 | prose | inference only | none |
| L2 | JSON-LD / schema.org | reads, cannot check authorship | baseline legibility |
| L3 | cross-source agreement | compares independent sources | consistency bonus |
| L4 | Ed25519-signed profile | verifies signature against public key | **the moat** — `signed_provenance` weight |

The strategic point: operability standards (AgentReady, Ora, Vercel) grade the presence of L1–L2 files. They do not grade truth. Climbing to L4 is cheap (Ed25519 is 64 bytes, sub-millisecond) and almost no one does it. That gap is the whole opportunity.
