// All site content lives here. Both views (terminal and traditional) render
// from this one object, so copy can never drift between them.
// One exception: /llms.txt hand-mirrors this for crawlers that don't run JS.
// When copy here changes, update llms.txt too.

export const LOGO =
`     _       _
  __| |_ __ (_)_  __
 / _\` | '_ \\| \\ \\/ /
| (_| | | | | |>  <
 \\__,_|_| |_|_/_/\\_\\`;

export const DATA = {
  brand: "dnix",
  tagline: "senior full-stack + product engineer",
  // Career cred deliberately names the role, not the employers: past work is
  // verifiable via the LinkedIn link, and the current day job stays out of it.
  who: [
    "I'm Denis Santos, a full-stack engineer in Brisbane. I've been building things for as long as I can remember, front to back, because I genuinely love it. What I care about most is getting real things into people's hands.",
    "I'm strongest on the backend at scale. Real-time ad serving, decisioning at millions of requests a second on a sub-millisecond budget, most recently as a Senior Staff Engineer. But I do a lot of front-end too, and I mean that. Custom sites and real product UIs I actually enjoy building, taken all the way to production. Not a side thing.",
    "I run coding agents hard. I've been writing code by hand for years though, and I still read every line that ships. The agents make me faster. The judgment's mine.",
  ],
  // Working with me: a real service Denis runs, framed as confident and
  // concrete (client self-selects on "what I'm best for"), equal weight to the
  // rest of the page. The bad-news + no-commitment rows are the trust content.
  model: [
    ["what I'm best for", "the hard backend piece someone's stuck on: a gnarly integration, a payments or billing flow, an API that has to hold up under load, a system that needs designing properly. Also a custom site or product UI, built and shipped for real, not left at a mockup"],
    ["how it runs", "hand me one scoped piece, I quote it, per-hour or fixed. Work lands as PRs into your repo with async updates as I go, so you always know where it's at. Senior rates, quoted per piece"],
    ["bad news early", "if something blocks or a piece is going to slip, you hear it from me that day, not at the deadline. I'd rather have the awkward conversation early than a nasty surprise late"],
    ["no lock-in", "start with one piece and see how it comes back. If it's good, send more. Nothing owed past the ticket in front of us"],
  ],
  stack: {
    "deepest in": ["Go", "TypeScript", "Postgres", "high-throughput backend", "system design"],
    "also ship with": ["Node", "Python", "React", "Next.js", "SvelteKit"],
    "and": ["payments (Stripe, Pix)", "code audit", "agent pipelines & evals", "Playwright / E2E"],
  },
  // Two buckets: live products (URL you can hit) lead, tools follow. GG leads
  // the live bucket here in the terminal `projects`; site.js leads with
  // Precision Coat in the normal-site view. Order is per-surface by design.
  // Live repos are private (GG, Precision Coat) — link the site only, never
  // the code. Tools are public — github.com/denisraison.
  projects: [
    {
      name: "Guardian Gamers",
      tag: "live · Cloudflare + Go",
      desc: "A live anti-toxicity gaming platform: one verified account per person, so bad behaviour actually costs something instead of spinning up a new alt. WebAuthn passkeys, real-time lobbies and chat over WebSockets, a dedicated Go service tracking Dota 2 matches. Real users on it now.",
      url: "guardiansgamers.com",
    },
    {
      name: "Precision Coat",
      tag: "live · SvelteKit",
      desc: "Custom site for a Gold Coast trade business, built and shipped, not a template. Server-rendered on Cloudflare, quote form, in production winning the client real leads.",
      url: "precisioncoatpainting.com.au",
    },
    {
      name: "gitknown",
      tag: "tool · Go CLI",
      desc: "A dashboard for the dozens of worktrees you end up with when coding agents run in parallel. It diffs each tree against the merge-base of HEAD and its upstream, never against origin/main, so a stale branch doesn't report its whole history as unmerged work. Tells me which trees have real uncommitted or unpushed changes. Tested, CI-backed, readable Go.",
      url: "github.com/denisraison/gitknown",
    },
    {
      name: "claude-plugins",
      tag: "tool · agent tooling",
      desc: "The plugins and tooling I run my coding agents with, in the open.",
      url: "github.com/denisraison/claude-plugins",
    },
  ],
  contact: {
    email: "denis@dnix.io",
    github: "github.com/denisraison",
    linkedin: "linkedin.com/in/denisraison",
    location: "Brisbane, Australia (UTC+10) · async-first, works with any timezone",
  },
};
