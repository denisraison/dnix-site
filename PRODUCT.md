# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary, all from the retail media industry:

- Brand-side buyers at Australian FMCG suppliers (shopper or customer marketing, ecommerce, commercial finance), arriving from Shelf Report (shelf.dnix.io) or a LinkedIn post. They want to know who is behind the free tool before they book a chat.
- Industry leaders and senior technical people: CEOs, CTOs and principal engineers in retail media and ad tech. They judge Denis as a peer, so the engineering depth has to hold up to someone who has built these systems.

Secondary, not designed for yet: developers who find the open-source tools, and viewers of the dnix TikTok channel (Brazilian Portuguese). The channel has no posted videos yet; revisit at video 16.

## Product Purpose

dnix.io is Denis Santos's own site. It answers "who is this person and should I talk to him" for retail media buyers, and turns that into a 20-minute chat by email. Success is a buyer emailing denis@dnix.io or going to Shelf Report.

## Positioning

An engineer who spent years building the ad technology at the heart of retail media, now working from the brand's side. Independent: doesn't sell media, takes no cut of spend, isn't affiliated with any retailer or media network.

## Operating Context

Visitors usually come from shelf.dnix.io or LinkedIn, often on a phone. The offer is the same as Shelf's: "You know what you spent. Do you know what you got?", starting with a 20-minute chat with no reports needed. The paid audit behind it is not sold on this page.

## Capabilities and Constraints

- The site is a working terminal (ssh boot, commands, tmux bar). Binding: Denis wants the terminal kept.
- No framework, no build step, no npm. ES modules served as-is from `public/`, typed with JSDoc and `tsc --noEmit`.
- All copy lives in `public/js/data.js`. `llms.txt` and the JSON-LD in `index.html` mirror it by hand and must stay in sync; Playwright tests guard this.
- Content must stay readable without typing: the page renders in the DOM for crawlers even under the full terminal.
- Cloudflare Pages, deployed with `nix run .#deploy`.

## Brand Commitments

- Name: dnix, "my name said fast". Lives on the same domain as Shelf Report (shelf.dnix.io).
- English, first person, plain and direct. No em dashes, no unsupported claims, no invented testimonials.
- Names the role, never an employer, current or past.
- The "who" wording mirrors Shelf Report's "Who's behind this" block; change both together.

## Evidence on Hand

- Shelf Report, live at shelf.dnix.io: Dairy and Personal care, across Coles, Woolworths, Chemist Warehouse and Priceline.
- Open-source tools: github.com/denisraison/gitknown, github.com/denisraison/claude-plugins.
- No clients, testimonials, case studies or pricing to show yet. Do not invent them.

## Product Principles

- The buyer's question first, the engineer second.
- One action: email for 20 minutes, or go check your brand at Shelf.
- Say only what can be backed. No numbers on the page that aren't sourced.
- What you see is what ships: view source is part of the pitch.

## Accessibility & Inclusion

WCAG AA contrast. Full keyboard use of the terminal and the page. The boot animation respects `prefers-reduced-motion`. No sideways scroll at 390px.
