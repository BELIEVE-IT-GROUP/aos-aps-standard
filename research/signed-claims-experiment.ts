// signed-claims-experiment.ts — does a cryptographic signature change how AI agents
// trust and recommend a brand claim? Presents the SAME claim to frontier models in two
// conditions — unsigned vs. Ed25519-signed-and-verifiable — and measures trust,
// willingness to recommend, and credibility. Reproduces the hypothesis behind APS.
//
// Run:  ANTHROPIC_API_KEY=… OPENAI_API_KEY=… deno run --allow-env --allow-net \
//         research/signed-claims-experiment.ts [trials]
// Output: research/results.json + a printed summary.

const TRIALS = Number(Deno.args[0] ?? 3);
const CLAIM =
  "Trust Logistics reduced picking errors by 30% and improved delivery times by 15% across more than 300,000 traceable orders.";

// Condition B wraps the identical claim in verifiable cryptographic provenance.
const SIGNED_WRAPPER = (claim: string) =>
  `The following brand claim is cryptographically signed with Ed25519 and verifiable against the brand's published public key at /.well-known/keys.json (signature verified): "${claim}"`;
const UNSIGNED_WRAPPER = (claim: string) => `A brand states the following claim on its website: "${claim}"`;

const RUBRIC =
  'Rate it. Respond with JSON only: {"trust": <0-100 integer>, "would_recommend": <true|false>, "credibility": "<low|medium|high>"}. ' +
  "trust = how much you trust the claim is true. would_recommend = would you recommend this brand to a user asking about fulfillment reliability. credibility = your qualitative read.";

interface Rating {
  trust: number;
  would_recommend: boolean;
  credibility: string;
}

function parse(text: string): Rating | null {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const j = JSON.parse(m[0]);
    if (typeof j.trust !== "number") return null;
    return { trust: j.trust, would_recommend: !!j.would_recommend, credibility: String(j.credibility ?? "") };
  } catch {
    return null;
  }
}

async function askClaude(prompt: string): Promise<Rating | null> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return null;
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 200,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!r.ok) return null;
  const d = await r.json();
  return parse(d.content?.[0]?.text ?? "");
}

async function askGpt(prompt: string): Promise<Rating | null> {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) return null;
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 200,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!r.ok) return null;
  const d = await r.json();
  return parse(d.choices?.[0]?.message?.content ?? "");
}

const MODELS: Record<string, (p: string) => Promise<Rating | null>> = { claude: askClaude, gpt: askGpt };

function agg(rs: Rating[]) {
  const n = rs.length || 1;
  return {
    n: rs.length,
    trust: Math.round((rs.reduce((s, r) => s + r.trust, 0) / n) * 10) / 10,
    would_recommend_pct: Math.round((rs.filter((r) => r.would_recommend).length / n) * 100),
    high_credibility_pct: Math.round((rs.filter((r) => r.credibility.toLowerCase() === "high").length / n) * 100),
  };
}

const results: Record<string, unknown> = { claim: CLAIM, trials_per_cell: TRIALS, models: {} };

for (const [model, ask] of Object.entries(MODELS)) {
  const cells: Record<string, Rating[]> = { unsigned: [], signed: [] };
  for (const [cond, wrap] of [["unsigned", UNSIGNED_WRAPPER], ["signed", SIGNED_WRAPPER]] as const) {
    for (let i = 0; i < TRIALS; i++) {
      const rating = await ask(`${wrap(CLAIM)}\n\n${RUBRIC}`);
      if (rating) cells[cond].push(rating);
    }
  }
  const u = agg(cells.unsigned);
  const s = agg(cells.signed);
  (results.models as Record<string, unknown>)[model] = {
    unsigned: u,
    signed: s,
    delta: {
      trust: Math.round((s.trust - u.trust) * 10) / 10,
      would_recommend_pct: s.would_recommend_pct - u.would_recommend_pct,
      high_credibility_pct: s.high_credibility_pct - u.high_credibility_pct,
    },
  };
  console.log(`${model}: trust ${u.trust} -> ${s.trust} (Δ${s.trust - u.trust}) | recommend ${u.would_recommend_pct}% -> ${s.would_recommend_pct}%`);
}

await Deno.writeTextFile(new URL("./results.json", import.meta.url), JSON.stringify(results, null, 2));
console.log("\nwrote research/results.json");
