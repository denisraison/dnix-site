# dnix.io

My personal site. dnix is just my name said fast.

It's a real terminal, laid out like a tmux session. The big yellow pane is who
I am and the prompt, already filled in with `mail denis@dnix.io`, so Enter
emails me. On the right, one pane replays a made-up sponsored-search auction
and the other shows a real Shelf Report finding. Click a pane, or Ctrl-b then
an arrow, to move focus; Esc comes back to the prompt. You can type `help`,
`whoami`, `work`, `tools`, `contact` and the rest. Everything the commands
print is also on the page below the first screen, from the same content, so I
only write the copy once and it can't go out of sync.

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
  fonts/              Martian Mono, self-hosted (OFL), same face as Shelf Report
  robots.txt          points at the sitemap
  sitemap.xml         one URL
  llms.txt            the content as markdown, for AI crawlers
  styles/
    base.css          tokens, the font, utilities
    terminal.css      the prompt and the tmux status bar
    site.css          the panes and the scrollback under them
  js/
    data.js           all the content, the only file I touch for copy changes
    terminal.js       the shell engine: print, input, history, tab-complete
    commands.js       the commands, reading from data.js
    boot.js           the ssh login sequence
    tmux.js           the status bar: clickable window numbers, clock
    panes.js          pane focus: click, Ctrl-b, Esc
    site.js           renders the panes and the scrollback
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
(most AI crawlers). The panes and the scrollback render on load, before anyone
types, so anything that does run JS still indexes everything. `llms.txt` is the one copy I keep by hand, so when I change wording
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

Covers the login, Enter on the prefilled prompt opening a mailto, typing
commands, tab completion, history, the tmux bar, `exit` (it logs out and back
in clean), pane focus with Ctrl-b and Esc, the crawler content being present
and agreeing with the page, and no sideways scroll on a phone.

Typecheck:

```bash
nix flake check       # or: tsc --noEmit
```

## Deploy

Cloudflare Pages, straight upload:

```bash
nix run .#deploy       # or: wrangler pages deploy public --project-name dnix
```
