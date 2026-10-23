---
name: dnix
description: Denis Santos's site, drawn as a live tmux session on an ad tech engineer's screen.
colors:
  sun: "#ffd60a"
  paid: "#ff3d7f"
  ink: "#0c0c0b"
  paper: "#f2f2ee"
  ash: "#8c8c88"
  sun-dim: "#5c4f00"
  paper-dim: "#5e5e59"
  ink-raised: "#2a2a28"
typography:
  display:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "clamp(2.5rem, min(5vw, 8.5svh), 6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 112.5"
  headline:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.3
    fontVariation: "\"wdth\" 112.5"
  title:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\""
  label:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "\"wdth\" 87.5"
  log:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "\"wdth\" 75"
spacing:
  gutter: "4px"
  pane: "clamp(20px, 3vw, 44px)"
  pane-side: "clamp(20px, 1.75vw, 24px)"
  bar: "40px"
  bar-phone: "48px"
  section: "clamp(56px, 7vw, 88px)"
components:
  pane-hero:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    padding: "{spacing.pane}"
  pane-hero-dim:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.sun-dim}"
  pane-shelf:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "{spacing.pane-side}"
  pane-shelf-dim:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-dim}"
  pane-auction:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.log}"
    padding: "{spacing.pane-side}"
  pane-auction-dim:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ash}"
  log-line-paid:
    textColor: "{colors.paid}"
    typography: "{typography.log}"
  button-key:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sun}"
    padding: "0 1.25rem"
    height: "44px"
  button-key-hover:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.sun}"
  tmux-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "{spacing.bar}"
  tmux-window-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  slot:
    backgroundColor: "{colors.paper}"
    size: "1:1"
  slot-paid:
    backgroundColor: "{colors.paid}"
    size: "1:1"
---

# Design System: dnix

## Overview

**Creative North Star: "The Live Session"**

The site is a tmux session left running on an ad tech engineer's screen. Three panes sit on a near-black frame, each one a solid field of colour: a signal-yellow hero pane with a working shell prompt, a black pane tailing a synthetic auction log, and an off-white pane holding a real Shelf Report finding. A tmux status bar pins the bottom edge and acts as navigation. Below the first screen the session keeps going as scrollback on the black frame, written as command output.

Everything is one monospace face. Hierarchy comes from Martian Mono's width and weight axes, not from extra faces, tints or decoration. The surface is flat and square: no rounded corners, no shadows, no gradients, no glow, no scanlines. Depth is focus, shown by brightness. The focused pane burns at full ink and the others dim their text, never their field.

Motion is one orchestrated beat: the auction log streaming in line by line, plus the focus dim moving between panes. The block cursor blinks. With reduced motion the final frame shows at once.

**Key Characteristics:**
- Colour owns whole pane fields, separated by a 4px ink gutter.
- Martian Mono only, width (75% to 112.5%) and weight (300 to 800) do the hierarchy.
- Pink means a paid placement and nothing else.
- The terminal is real: a prompt, a block cursor, an Enter key you can reach with a thumb.
- Flat and square everywhere; focus is brightness, not a ring or a lift.

## Colors

Four colours, each owning a whole field, plus three dim or hover inks derived for contrast.

### Primary
- **Signal Yellow** (`sun`): the hero pane's field, the text colour of every ink key (the Enter key and the Shelf link), the `$` prompt in scrollback headings, definition terms and links on the black scrollback, the global focus ring and the text selection.

### Secondary
- **Paid Pink** (`paid`): a sponsored placement. Used for the winning paid lines in the auction log and the filled squares in the Shelf slot strip. Shares its meaning with Shelf Report on shelf.dnix.io.

### Neutral
- **Terminal Ink** (`ink`): the page and frame colour, the auction pane field, all text on yellow and off-white panes, the field of the ink keys and of the active tmux window.
- **Raised Ink** (`ink-raised`): hover field for the ink keys only.
- **Paper** (`paper`): the Shelf pane field, the tmux status bar, and body text on ink.
- **Ash** (`ash`): log comments, the auction log when its pane is not focused, scrollback notes and footer, contact labels. 5.8:1 on ink.
- **Sun Dim** (`sun-dim`): hero pane text when another pane has focus. 5.8:1 on yellow.
- **Paper Dim** (`paper-dim`): Shelf pane text when another pane has focus. 5.8:1 on paper.

### Named Rules
**The Paid Pink Rule.** Pink is only ever a paid placement. It never marks a link, a hover, a brand moment or an error. The same meaning holds on Shelf Report, so a buyer who has seen pink squares there reads them the same way here.

**The Whole Field Rule.** Colour fills a whole pane or not at all. No tints, no gradients, no coloured panels inside a pane.

**The Dim the Ink Rule.** An unfocused pane dims its text to a derived ink that still clears AA, and keeps its field at full colour. Opacity is never used for the dim: it greys the off-white and turns the pink magenta.

## Typography

**Display Font:** Martian Mono (with ui-monospace, monospace)
**Body Font:** Martian Mono (with ui-monospace, monospace)
**Label/Mono Font:** Martian Mono

**Character:** One self-hosted variable monospace, weight 100 to 800 and width 75% to 112.5%. Wide and heavy for the one sentence that matters, condensed and light for machine output. Numerals are tabular everywhere.

### Hierarchy
- **Display** (800, `clamp(2.5rem, min(5vw, 8.5svh), 6rem)`, 1.02, -0.03em, width 112.5%): the hero sentence only, each clause on its own balanced block. About 72px at 1440x900. On phones the width drops to 87.5% and it lands at 40px. Once a command runs it collapses to the headline size on one line.
- **Headline** (800, 1.25rem, 1.3, width 112.5%): the Shelf pane name and scrollback section headings.
- **Title** (700, 1.25rem, 1.6): the closing call to action in scrollback, held to 40ch.
- **Body** (400, 1rem, 1.6; 0.9375rem on phones): byline, shell output, scrollback paragraphs at 68 to 72ch. Bold 700 carries prompts, terms and command echoes; 500 carries the byline and Shelf lede; 300 carries soft shell output.
- **Label** (400, 0.8125rem, width 87.5%): pane titles, the tmux bar (condensed to 75% on phones), the prompt hint, scrollback notes.
- **Log** (400, 0.8125rem, 1.55, width 75%): auction log lines, on a 12ch timestamp column. Paid lines go to 700.

### Named Rules
**The One Face Rule.** Martian Mono is the only typeface. Hierarchy is width and weight, never a second family.

**The Four Sizes Rule.** Display, lead (1.25rem), body (1rem) and small (0.8125rem) are the whole scale. A new role picks one of the four and changes width or weight.

## Layout

At 900px and up the session is a grid filling the viewport above the status bar: the hero pane spans two thirds on the left across both rows, the auction pane sits top right and the Shelf pane bottom right, with the right column at least 360px. Panes are separated by a 4px ink gutter. The hero pane pads with `clamp(20px, 3vw, 44px)`, the side panes with `clamp(20px, 1.75vw, 24px)`. The hero's prompt sits at the bottom of its pane with output stacking up above it like a real shell.

Below 900px the panes stack: hero, Shelf, then the auction log trimmed to six lines. The terminal is a desktop thing: on a phone the hero drops the shell (login lines, prompt, hint) and holds the headline, the byline and one full-width 52px "Email me" mail link, sized to its content so the Shelf numbers land in the first screen. Panes do not dim on phones, since touch has no pane focus. The status bar grows to 48px.

The tmux status bar is fixed to the bottom edge on every size: session name, numbered windows, host and clock. On phones it becomes plain navigation: no session name, host or clock, the windows read `about`, `work`, `tools`, `contact`, a tap jumps to that scrollback section, and the active mark follows the scroll.

Scrollback runs on the ink frame below the session at 76ch, with sections spaced `clamp(56px, 7vw, 88px)` apart. Definition lists use a fixed term column (18ch for offer and tools, 10ch for contact) that collapses to one column on phones.

No sideways scroll at 390px.

## Elevation & Depth

The system is flat. There are no shadows, no blur and no layering. Depth is focus: the active pane shows full-strength ink, the others dim their text over 0.4s on `cubic-bezier(0.16, 1, 0.3, 1)`. The only element above the page is the fixed status bar, and it sits flush, separated by colour alone.

### Named Rules
**The Brightness Is Focus Rule.** A pane shows focus by brightness, not by an outline, a shadow or a lift. Interactive elements inside panes still get a 2px focus outline.

## Shapes

Every corner is square. Borders appear only where a terminal would draw them: 2px ink outlines on empty slot squares and on the hollow cursor. Slots are 1:1 squares in a 12-column strip with 3px gaps, capped at 26rem. The block cursor is 0.62em by 1.15em, solid when the prompt has focus and hollow when it does not.

## Components

### Buttons (ink keys)
Hard, physical keys on the yellow and off-white fields.
- **Shape:** square, minimum 44px tall (52px and full width for the phone Enter key).
- **Primary:** ink field, signal-yellow text, weight 700, `0 1.25rem` padding. The Shelf link uses the same key with `0.6rem 1.25rem` padding and aligns to the start.
- **Hover / Focus:** hover raises the field to raised ink. Focus is a 2px ink outline with a 3px offset on light panes.
- The Enter key's label follows the prompt: "email me" while the suggestion is prefilled, "run" once the visitor types.

### Navigation (tmux status bar)
- **Style:** paper bar, ink label type, `[dnix]` session name in 700, windows as `0:whoami 1:work ...` buttons.
- **States:** hover underlines; the active window inverts to an ink block with paper text, weight 700 and a trailing `*`; focus is a 2px ink outline inset 4px (yellow on the active block). A `^b` ink block appears while the tmux prefix is armed.
- **Mobile:** 48px tall, condensed to 75% width, windows scroll sideways inside the bar without a scrollbar.

### Panes
- **Corner Style:** square.
- **Background:** one solid field per pane: yellow hero, paper Shelf, ink auction.
- **Shadow Strategy:** none, see Elevation & Depth.
- **Title:** label type at 87.5% width, written as a shell line where it makes sense (`$ tail -f auction.log`).
- **Focus:** click or Ctrl-b then an arrow or `o` moves focus; Esc returns to the hero prompt.

### Shell prompt
`guest@dnix:~$` in 700, the input styled as plain text with a block cursor right after the typed text, and a small hint line under it. On phones the user part of the prompt is dropped.

### Auction log (signature)
A synthetic sponsored-search replay, labelled synthetic in a pinned first line. Lines sit on a 12ch timestamp column; candidate rows drop the timestamp and indent 4ch; comments are ash with a hanging indent. Paid lines are pink and bold. The body tails like `tail -f`: newest at the bottom, oldest clipped whole from the top. Lines enter with a 0.5s rise from 0.5em, 140ms apart after a 350ms beat. The log dims to ash when its pane loses focus.

### Slot strip (signature)
Twelve 1:1 squares per retailer row, one per search result. Paid results fill pink, regular results are empty squares outlined 2px in ink. The count reads in words beside the retailer name ("10 of 12 sponsored"); the strip is decorative and hidden from assistive tech.

### Scrollback sections
Headings read as commands: a yellow `$`, the section name in headline type, then a `# note` in ash label type. Content is paragraphs and definition lists with yellow bold terms. Links are underlined at 1px with a 0.22em offset and thicken to 2px on hover; in the contact list they are yellow.

## Do's and Don'ts

### Do:
- **Do** give each pane one solid field from the four colours and dim only its text when unfocused (`sun-dim`, `paper-dim`, `ash`).
- **Do** build hierarchy from Martian Mono's width (75%, 87.5%, 100%, 112.5%) and weight (300 to 800) inside the four sizes.
- **Do** keep pink for paid placements, matching Shelf Report.
- **Do** write labels and headings as terminal lines: `$ command`, `# comment`, tmux window names.
- **Do** keep every pane's content in the DOM and readable without typing.
- **Do** show the final frame with no animation under `prefers-reduced-motion`.
- **Do** keep tap targets at 44px or more and the email link in thumb reach on phones.
- **Don't** ask a phone visitor to type: no prompt, no commands, no keyboard.

### Don't:
- **Don't** use cards, rounded chips or pills, glow, scanlines, gradients or shadows.
- **Don't** round a corner.
- **Don't** dim a pane with opacity.
- **Don't** use pink for links, hovers, accents or errors.
- **Don't** add a second typeface or set system fonts for display.
- **Don't** trap vertical scrolling in an inner scroller on phones; the page itself scrolls.
