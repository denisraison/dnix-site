# dnix.io

The dnix landing page: overflow engineering for agencies.

It's a real interactive terminal. You land on `ssh guest@dnix.io`, get a motd,
and type (`help`, `whoami`, `projects`, `hire`). A toggle flips to a
traditional page for people who'd rather read than type. Both views render
from the same data, so copy can't drift.

Live: https://dnix.io

## Design

No framework, no build step, no dependencies. Native ES modules; the source
is the artifact. That's a choice: a landing page doesn't earn a toolchain,
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
    base.css          tokens, utilities, view-switch chrome
    terminal.css      shell, prompt, tmux status bar
    site.css          the traditional view
  js/
    data.js           ALL content — the only file to touch for copy changes
    terminal.js       shell engine: print, input, history, tab-complete
    commands.js       the command set, content-over-DATA
    boot.js           ssh login sequence
    tmux.js           status bar: clickable command windows, clock
    site.js           traditional view renderer
    view.js           terminal/site switching, ?view= links, persistence
    main.js           entry: wires the above
tests/                Playwright E2E against the served page
```

Boundaries: `terminal.js` knows nothing about the content, `commands.js` and
`site.js` know nothing about input handling, `data.js` knows nothing about
rendering.

## Crawlers

A terminal that waits for typed commands is invisible to search engines and
AI crawlers, so the crawlable surface is explicit: JSON-LD in the head and
`llms.txt` for raw-HTML fetchers (most AI crawlers don't run JS), plus the
traditional view rendering eagerly on load, hidden, so JS-running crawlers
index the full content. `llms.txt` is the one hand-maintained mirror of
`data.js`; a copy change means touching both.

## Run

Any static server pointed at `public/` (ES modules don't load from `file://`):

```bash
nix run .#serve        # or: python3 -m http.server 8000 --directory public
```

## Test

End-to-end with Playwright (system-wide here, no node_modules):

```bash
playwright test
```

Covers the boot sequence, typed commands, tab completion, the tmux window
bar, view toggling with persistence, and mobile overflow.

Typecheck:

```bash
nix flake check       # or: tsc --noEmit
```

## Deploy

Cloudflare Pages, direct upload:

```bash
nix run .#deploy       # or: npx wrangler pages deploy public --project-name dnix
```
