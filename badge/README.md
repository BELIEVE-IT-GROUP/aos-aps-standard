# Badge

Embed on a compliant site. The badge asserts **preference with verifiable evidence**, not mere operability — it links to the brand's signed profile so an agent (or a human) can verify.

```html
<a href="https://YOURDOMAIN/.well-known/brand.json" rel="agent-profile">
  <img src="https://files.believe-global.com/aos/badge/agent-preferred.svg" alt="Agent-Preferred — APS verified" height="46">
</a>
```

Light footers: use `agent-preferred-light.svg`. Both carry a subtle "powered by Believe".

Only embed it once your `brand.json` is served, signed (`brand.json.sig` + `keys.json`), and its claims are backed by real proofs. The badge is a pointer to verifiable evidence; a badge without a verifying signature behind it is theater, and agents that follow the link will find out.
