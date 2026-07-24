# dnix.io

My personal site. dnix is just my name said fast.

It's a real terminal. The page loads as a normal portfolio and the terminal
sits docked at the bottom like the one in your editor. Click the strip to open
it, or hit `/?view=term` if you just want the full-screen shell. It boots with
`ssh guest@dnix.io`, prints a motd, and then you can type: `help`, `whoami`,
`projects`, `work`, `contact`. The page and the terminal both read from the
same content, so I only write the copy once and it can't go out of sync.

Live at https://dnix.io.

## Why it's built this way

No framework and no build step. Nothing to install. It's just ES modules the
browser loads directly. I wanted the source to be readable, since half the
point of the site is showing how I work, and a build pipeline would bury that
under generated output. So what you see in `public/` is exactly what ships.

It's still fully typed. I write JSDoc on the plain JS and run `tsc --noEmit`
with strict on to check it (`tsconfig.json`). I want the type safety, I just
don't need tsc to emit anything, the browser runs the source as-is.

```
public/               exactly what ships, nothing else
  index.html          the markup shell + JSON-LD
  robots.txt          points at the sitemap
  sitemap.xml         one URL
  llms.txt            the content as markdown, for AI crawlers
  styles/
    base.css          tokens, utilities, dock/page chrome
    terminal.css      the dock, prompt, tmux status bar
    site.css          the normal page view
  js/
    data.js           all the content — the only file I touch for copy changes
    terminal.js       the shell engine: print, input, history, tab-complete
    commands.js       the commands, reading from data.js
    boot.js           the ssh login sequence
    tmux.js           the status bar: clickable window numbers, clock
    site.js           renders the normal page view
    view.js           dock state (collapsed/open/full), ?view= links, memory
    main.js           wires it all together
    util.js           escaping, delay, byId, the reduced-motion check
tests/                Playwright, run against the real served page
```

The modules stay in their lanes. `terminal.js` doesn't know what content it's
printing. `commands.js` and `site.js` don't touch input handling. `data.js`
doesn't know anything about how it gets rendered. The list of commands lives in
one spot (`NAV` in `data.js`) and both the `help` output and the tmux bar read
from it, so they can't drift apart.

## Crawlers

A terminal that waits for you to type is invisible to Google and the AI
crawlers, so I made the content reachable a few ways. There's JSON-LD in the
head, and `llms.txt` for anything that fetches raw HTML without running JS
(most AI crawlers). The normal page view also renders on load and stays in the
DOM even under the full terminal, so anything that does run JS still indexes
everything. `llms.txt` is the one copy I keep by hand, so when I change wording
in `data.js` I update it too.

## Run it

Any static server pointed at `public/`. ES modules won't load over `file://`,
so you do need a server:

```bash
nix run .#serve        # or: python3 -m http.server 8000 --directory public
nix run .#dev          # same thing with live-reload when you save
```

## Tests

End-to-end with Playwright. It's installed system-wide here, so no node_modules:

```bash
playwright test
```

Covers the boot sequence, typing commands, tab completion, the tmux bar, the
dock states, `exit` (it collapses and re-boots clean), the view sticking across
reloads, the crawler content being present, and no sideways scroll on a phone.

Typecheck:

```bash
nix flake check       # or: tsc --noEmit
```

## Deploy

Cloudflare Pages, straight upload:

```bash
nix run .#deploy       # or: wrangler pages deploy public --project-name dnix
```
