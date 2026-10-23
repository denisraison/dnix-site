---
version: 1
slug: "public-index-html"
primary_target: "public/index.html"
related_targets: []
---

## Direction contract

THESIS: Denis built the machine that decides which sponsored product a shopper sees; now he checks it for brands. The page proves it by showing the machine running, labelled synthetic, next to what a shopper actually sees on a real search, with one obvious next step: email for 20 minutes or go to Shelf.

OWN-WORLD: a live tmux session on an ad tech engineer's screen. Three panes, solid colour fields: a signal-yellow #ffd60a hero pane with near-black #0c0c0b type, a black auction pane tailing a synthetic sponsored-search log where paid lines burn pink #ff3d7f, and an off-white #f2f2ee Shelf pane with the real finding. Martian Mono only, width and weight axes doing the hierarchy. No cards, chips, glow, scanlines, gradients or shadows.

STORY: a buyer lands and reads one giant sentence, sees the auction pick a winner in under a millisecond, sees that a real "milk" search at two retailers is mostly paid slots, and the prompt already says `mail denis@dnix.io`. Enter sends the email. The tmux status bar holds the rest (whoami, work, tools, contact) for anyone who wants depth.

FIRST VIEWPORT: desktop 1440x900, hero pane two-thirds left with the h1 at 72-96px and the pre-filled prompt visible above the fold; auction pane top right streaming; Shelf pane bottom right with the 10 of 12 / 6 of 12 finding and the Shelf link; tmux status bar pinned at the bottom. Phone 390x844: hero pane fills most of the screen, h1 about 40px, prompt in thumb reach, status bar at the bottom; Shelf pane then a 6-line auction pane follow below.

FORM: split-pane session, the roll's assigned direction, seed key 9b1c5c03. Focused pane at full brightness, the others dim (opacity only, still AA). Click or Ctrl-b then arrow/o moves focus; Esc returns to the hero prompt. One orchestrated motion: the log streaming in plus the focus dim. Reduced motion shows the final frame. All content stays in the DOM for crawlers.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
