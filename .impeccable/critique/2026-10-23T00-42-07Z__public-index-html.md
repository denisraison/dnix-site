---
target: dnix.io homepage
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/home/denis/workspace/dnix/site/public/index.html"
target_fingerprint: "sha256:fe628dd72cf7f108195f7d85d250e95272782c2e41b59cd0ebe4f5ac3f33d197"
target_path: /home/denis/workspace/dnix/site/public/index.html
timestamp: 2026-10-23T00-42-07Z
slug: public-index-html
---
DEGRADED: single-context (sub-agents not spawned without an explicit request; detector output had already been seen in this session, so Assessment A is anchored)

## Design Health Score (Persuade surface: dnix.io after the retail media copy change)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | tmux active mark, boot sequence and dock chevron all report state |
| 2 | Match System / Real World | 2 | ssh, tmux, guest@dnix, whoami are developer metaphors for a retail media buyer |
| 3 | User Control and Freedom | 2 | no Esc to close the dock; exit and the handle are the only ways out of the full terminal |
| 4 | Consistency and Standards | 2 | h2 (15px) smaller than body (16px); offer rows start lowercase; terminal wraps break the hanging indent |
| 5 | Error Prevention | 3 | little to get wrong |
| 6 | Recognition Rather Than Recall | 3 | page is fully visible, tmux bar lists commands |
| 7 | Flexibility and Efficiency | 3 | history, tab complete, ?view=term deep link, clickable windows |
| 8 | Aesthetic and Minimalist Design | 2 | flat hierarchy, stack chips and dev tools irrelevant to the buyer |
| 9 | Error Recovery | 3 | "command not found" names the problem and points to help |
| 10 | Help and Documentation | 3 | help command, motd hint, footer hint |
| Total | | 26/40 | Acceptable |

## Design Specificity Verdict
Category-interchangeable. Any developer portfolio could ship this unchanged: dark editor palette, mono at one size, bordered cards, tag chips, a terminal easter egg. Only the copy says retail media. Shelf Report, by contrast, builds a world out of its subject (till dockets on a checkout belt). The terminal is a real idea here but lives in a 42px strip, not in the composition.

Deterministic scan: source scan 3 findings (side-tab site.css:55, height transitions index.html and terminal.css:15). Rendered scan 16: side-tab x4, low contrast x6 (#737e7a at 4.1:1 on #171b1d cards, 4.50:1 on page), line length ~86 chars x3, height transition x2, tight leading x1 (false positive: the ASCII logo). Live overlay skipped: live-server would inject a script tag into index.html.

## Priority Issues
- [P1] Flat type hierarchy. 8 sizes between 12px and 20px; the biggest thing on the page is the 20px tagline; h2 is smaller than body; no h1. Fix: one display line at 48-72px, a 3-step scale, an h1. Command: typeset, bolder.
- [P1] The terminal is not the page. The idea lives in a dock strip; the page is generic cards. Fix: either render the page as the terminal session (scrollback as layout, giant mono display) or drop the dock. Command: shape (redesign).
- [P1] No primary action. Email sits at the bottom in a grid with GitHub; the Shelf link is a small dotted link inside card 1. On a 390px phone the Shelf card starts at 778px, behind the dock. Fix: Shelf and "email for 20 minutes" in the first viewport. Command: layout, clarify.
- [P2] Template components: side-tab offer rows x4, chips for tags and stack, cards around one-line facts. Fix: plain rows with rules, cut the stack section for this audience. Command: distill.
- [P2] Accessibility: Shelf's own description is #737e7a at 4.1:1; no designed :focus-visible (browser default ring on dark); no h1; no Esc on the dock. Command: audit, harden.

## Persona Red Flags
Jordan (brand manager, first time here): lands from shelf.dnix.io, sees ASCII art and "click to open" a terminal, does not know whether to. The offer is the fourth section down.
Casey (on the LinkedIn app, one thumb): first screen is the logo and three paragraphs; no link, no action, the dock strip takes the thumb zone. Links are 22px tall.
Sam (keyboard): tab order starts on shelf.dnix.io (good) but the focus ring is the default; dock cannot be closed with Esc.

## Minor Observations
- Terminal output wraps to column 0, breaking the indent ("were attributed...", "more").
- Dock animates height (layout thrash).
- Offer rows start lowercase, the page uses sentence case.
- Footer "view source, that's the artifact" speaks to developers; the page ends on it instead of the offer.
- "selected work" with one live item reads thin.
- JetBrains Mono comes from Google Fonts; Shelf self-hosts its face.

## Questions to Consider
- What if the first screen were one sentence at 64px and two actions?
- Does a retail media buyer need a terminal, or does the terminal need to earn its place by being the whole page?
- What would dnix.io look like as Shelf's sibling: same face, different material?
