// All site content lives here. The panes, the scrollback and the terminal all
// render from this one object, so copy can never drift between them.
// One exception: /llms.txt hand-mirrors this for crawlers that don't run JS.
// When copy here changes, update llms.txt too.

// The tmux windows, in order. Single source for the status bar, the top of the
// `help` listing and the scrollback sections, so they can't drift apart.
// [command, one-line help, plain label for the phone bar]
export const NAV = [
  ["whoami", "who I am and what I do", "about"],
  ["work", "making sense of your retail media spend", "work"],
  ["tools", "the tools I built for my own work", "tools"],
  ["contact", "email, github, linkedin", "contact"],
];

// Commands that work but don't get a window. [command, one-line help]
export const MORE = [
  ["mail", "email me about a 20-minute chat"],
  ["projects", "live products and the tools I built"],
  ["stack", "what I build with"],
];

export const DATA = {
  brand: "dnix",
  name: "Denis Santos",
  tagline: "independent retail media, from the ad tech side",
  headline: ["I built the machine that picks which ad you see.", "Now I check it for brands."],
  // What the hero prompt holds until you type. Enter runs it.
  prefill: "mail denis@dnix.io",
  promptHint: "press enter to email me about a 20-minute chat, or type help to look around.",
  // The phone hero has no shell, just this.
  mailCta: "Email me",
  mailNote: "A 20-minute chat about your retail media spend. No reports needed.",
  mailSubject: "20 minutes",
  // Career cred deliberately names the role, not the employers: past work is
  // verifiable via the LinkedIn link, and the current day job stays out of it.
  // Wording mirrors Shelf Report's "Who's behind this" block, keep them in step.
  who: [
    "I'm Denis Santos, a software engineer in Brisbane. I've spent years building the ad technology at the heart of retail media, the systems that decide which sponsored products shoppers see. Real-time ad serving, millions of requests a second on a sub-millisecond budget, most recently as a Senior Staff Engineer.",
    "Now I work from the brand's side. Each retail network reports on its own ads, in its own format. I help brands dig into their campaign data and understand where their money is going.",
    "I'm independent. I don't sell media, and I'm not affiliated with any retailer or media network.",
  ],
  // The offer, same hook and first step as shelf.dnix.io. The last two rows
  // are the trust content.
  model: [
    ["what it's for", "you know what you spent. Do you know what you got? Where your ads appeared, how sales were attributed, what your ROAS actually includes"],
    ["how it starts", "a 20-minute chat. No reports needed"],
    ["straight answers", "if your data can't answer a question, I'll say so rather than guess"],
    ["no strings", "I don't sell media or take a cut of your spend, so I've no reason to tell you to spend more"],
  ],
  stack: {
    "deepest in": ["Go", "TypeScript", "Postgres", "high-throughput backend", "system design"],
    "also ship with": ["Node", "Python", "React", "Next.js", "SvelteKit"],
    "and": ["payments (Stripe, Pix)", "code audit", "agent pipelines & evals", "Playwright / E2E"],
  },
  // Two buckets: live products (URL you can hit) lead, tools follow.
  // Tools are public — github.com/denisraison.
  projects: [
    {
      name: "Shelf Report",
      tag: "live · free tool",
      desc: "Type your brand and see who bought the sponsored spots on its searches at Coles, Woolworths, Chemist Warehouse and Priceline, and where you're missing. Dairy and personal care so far, more categories on request.",
      url: "shelf.dnix.io",
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
  // A real Shelf Report observation. Only what a shopper saw, no judgement.
  finding: {
    date: "20 Oct 2026",
    query: "milk",
    lede: "What a shopper saw searching \"milk\" on 20 Oct 2026, top 12 results:",
    rows: [
      { retailer: "Coles", sponsored: 10, of: 12 },
      { retailer: "Woolworths", sponsored: 6, of: 12 },
    ],
    cta: "see your brand's searches",
    url: "https://shelf.dnix.io/?src=dnix",
  },
  // The auction pane. Textbook mechanics (rank by bid x relevance, a reserve,
  // second-price clearing), made-up brands, no retailer. Scores and prices are
  // worked out from the bid and relevance figures, so the replay adds up.
  // [timestamp, text, kind]; paid = a sponsored placement.
  auction: [
    ["", "# replay: synthetic example. made-up brands, not retailer data", "comment"],
    ["", "# reserve $0.40. a winner pays just enough to win", "comment"],
    ["14:02:11.204", "search \"milk\" from a shopper, 2 sponsored slots", "plain"],
    ["14:02:11.204", "5 ads eligible. bid x relevance = score", "plain"],
    ["", "brindlewood full cream 2L  $0.90 x 0.94 = 0.85", "plain"],
    ["", "cloudhaven lite 2L  $1.40 x 0.71 = 0.99", "plain"],
    ["", "little tern barista 1L  $0.75 x 0.88 = 0.66", "plain"],
    ["", "pollen hill oat 1L  $1.10 x 0.42 = 0.46", "plain"],
    ["", "marrowby lactose free 2L  $0.35, under reserve", "plain"],
    ["14:02:11.205", "slot 1  cloudhaven lite 2L  pays $1.20", "paid"],
    ["14:02:11.205", "slot 2  brindlewood full cream 2L  pays $0.71", "paid"],
    ["14:02:11.205", "slots 3 to 12  regular results", "plain"],
    ["14:02:11.205", "done in 0.41ms", "plain"],
  ],
  cta: "Want to talk through your retail media spend? Email me and we'll find 20 minutes.",
  contact: {
    email: "denis@dnix.io",
    github: "github.com/denisraison",
    linkedin: "linkedin.com/in/denisraison",
    location: "Brisbane, Australia (UTC+10)",
  },
};
