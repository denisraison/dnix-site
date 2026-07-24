# dnix.io

Denis Santos's personal site. Say "dnix" fast and it's just the name.

It's a real interactive terminal. The page renders as a normal portfolio, with
the terminal docked at the bottom like an IDE panel: a collapsed strip you can
click to open, or `?view=term` for the full-screen shell. You `ssh guest@dnix.io`,
get a motd, and type (`help`, `whoami`, `projects`, `work`, `contact`). Both the
page and the terminal render from the same data, so copy can't drift between them.

Live: https://dnix.io

## Design

No framework, no build step, no dependencies. Native ES modules; the source
is the artifact. That's a choice: a personal site doesn't earn a toolchain,
and the unminified source doubles as the work sample.

Fully typechecked anyway: JSDoc annotations under `tsc --noEmit` with
`strict` on (see `tsconfig.json`). Typechecking and transpilation are
separate concerns; this repo only needs the first.

```
public/               exactly what ships, nothing else
  index.html          markup shell + JSON-LD
  robots.txt          crawlers welcome, points at the sitemap
  sitemap.xml         one URL
  llms.txt            the content as markdown, for AI crawlers
  styles/
    base.css          tokens, utilities, dock/page chrome
    terminal.css      dock, prompt, tmux status bar
    site.css          the traditional page view
  js/
    data.js           ALL content — the only file to touch for copy changes
    terminal.js       shell engine: print, input, history, tab-complete
    commands.js       the command set, content-over-DATA
    boot.js           ssh login sequence
    tmux.js           status bar: clickable command windows, clock
    site.js           traditional page renderer
    view.js           dock state (collapsed/open/full), ?view= links, persistence
    main.js           entry: wires the above
    util.js           escaping, delay, byId, reduced-motion flag
tests/                Playwright E2E against the served page
```

Boundaries: `terminal.js` knows nothing about the content, `commands.js` and
`site.js` know nothing about input handling, `data.js` knows nothing about
rendering. The primary command list lives once in `data.js` (`NAV`); the
`help` listing and the tmux window bar both derive from it.

## Crawlers

A terminal that waits for typed commands is invisible to search engines and
AI crawlers, so the crawlable surface is explicit: JSON-LD in the head and
`llms.txt` for raw-HTML fetchers (most AI crawlers don't run JS), plus the
page view rendering eagerly on load (present even under the full terminal) so
JS-running crawlers index the full content. `llms.txt` is the one
hand-maintained mirror of `data.js`; a copy change means touching both.

## Run

Any static server pointed at `public/` (ES modules don't load from `file://`):

```bash
nix run .#serve        # or: python3 -m http.server 8000 --directory public
nix run .#dev          # same, with live-reload on save
```

## Test

End-to-end with Playwright (system-wide here, no node_modules):

```bash
playwright test
```

Covers the boot sequence, typed commands, tab completion, the tmux window
bar, the dock states, `exit` (collapse + re-boot), view persistence, the
crawlable-content invariant, and mobile overflow.

Typecheck:

```bash
nix flake check       # or: tsc --noEmit
```

## Deploy

Cloudflare Pages, direct upload:

```bash
nix run .#deploy       # or: wrangler pages deploy public --project-name dnix
```
