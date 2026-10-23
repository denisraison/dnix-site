// The page itself: the hero heading, the Shelf and auction panes, and the
// scrollback under the first screen, all from DATA. This is the text crawlers
// read, so none of it waits for typing.

import { DATA, NAV } from './data.js';
import { escapeHtml as esc } from './util.js';

// The replay's pacing, ms: a beat before the first line, then one line per tick.
const LOG_START = 350;
const LOG_TICK = 140;

/**
 * The log body clips from the top like `tail`; this hides any line the clip
 * would cut through, so the oldest visible line is always whole.
 * @param {HTMLElement} auction
 */
export function tailLog(auction) {
  const body = auction.querySelector('.log-body');
  const log = auction.querySelector('.log');
  if (!(body instanceof HTMLElement) || !log) {
    return;
  }
  const fit = () => {
    for (const line of log.children) {
      const el = /** @type {HTMLElement} */ (line);
      el.style.visibility = el.offsetTop < 0 ? 'hidden' : '';
    }
  };
  const ro = new ResizeObserver(fit);
  ro.observe(body);
  ro.observe(log);
}

/**
 * @param {Object} els
 * @param {HTMLElement} els.head
 * @param {HTMLElement} els.hint
 * @param {HTMLElement} els.actions
 * @param {HTMLElement} els.shelf
 * @param {HTMLElement} els.auction
 * @param {HTMLElement} els.scrollback
 */
export function renderSite({ head, hint, actions, shelf, auction, scrollback }) {
  const c = DATA.contact;
  const f = DATA.finding;
  const live = DATA.projects.find((p) => p.tag.startsWith('live'));
  const link = (/** @type {string} */ url) =>
    `<a href="https://${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>`;

  head.innerHTML = `
    <h1 class="headline">${DATA.headline.map((s) => `<span>${esc(s)}</span>`).join(' ')}</h1>
    <p class="byline">${esc(DATA.name)} · ${esc(DATA.tagline)}</p>`;
  hint.textContent = DATA.promptHint;
  actions.innerHTML = `
    <a class="hero-mail" href="mailto:${esc(c.email)}?subject=${encodeURIComponent(DATA.mailSubject)}">${esc(DATA.mailCta)}</a>
    <p class="hero-note">${esc(DATA.mailNote)}</p>`;

  const slots = (/** @type {number} */ paid, /** @type {number} */ of) =>
    Array.from({ length: of }, (_, i) => `<i class="slot${i < paid ? ' paid' : ''}"></i>`).join('');
  shelf.innerHTML = `
    <h2 class="shelf-name" id="shelf-title">${esc(live?.name ?? '')}</h2>
    <p class="shelf-lede">${esc(f.lede)}</p>
    <dl class="finding">
      ${f.rows.map((r) => `
        <div class="finding-row">
          <dt>${esc(r.retailer)}</dt>
          <dd><span class="count">${r.sponsored} of ${r.of} sponsored</span><span class="slots" aria-hidden="true">${slots(r.sponsored, r.of)}</span></dd>
        </div>`).join('')}
    </dl>
    <a class="shelf-link" href="${esc(f.url)}">${esc(f.cta)} at shelf.dnix.io</a>`;

  // The first comment line stays pinned so the "synthetic" label is always on
  // screen; the rest tails into the space left, oldest lines clipped first.
  const [label, ...rest] = DATA.auction;
  /** @param {typeof DATA.auction[number]} line @param {number} i */
  const logLine = ([ts, text, kind], i) =>
    `<div class="log-line ${kind}" style="--d:${LOG_START + i * LOG_TICK}ms"><span class="ts">${esc(ts)}</span><span class="msg">${esc(text)}</span></div>`;
  auction.innerHTML = `
    <p class="pane-title">$ tail -f auction.log</p>
    <div class="log-head">${logLine(label, 0)}</div>
    <div class="log-body"><div class="log">${rest.map((l, i) => logLine(l, i + 1)).join('')}</div></div>`;

  /** @param {string} name @param {string} body */
  const section = (name, body) => {
    const note = NAV.find(([n]) => n === name)?.[1] ?? '';
    return `
    <section class="sb" id="sb-${name}" aria-labelledby="sb-${name}-h">
      <h2 id="sb-${name}-h"><span class="sb-ps" aria-hidden="true">$ </span>${esc(name)} <span class="sb-note"># ${esc(note)}</span></h2>
      ${body}
    </section>`;
  };

  const tools = DATA.projects.filter((p) => p.tag.startsWith('tool'));
  scrollback.innerHTML = `
    ${section('whoami', DATA.who.map((p) => `<p class="sb-p">${esc(p)}</p>`).join(''))}
    ${section('work', `
      <p class="sb-p">I help brands make sense of their retail media spend. Here's how that starts.</p>
      <dl class="offer">${DATA.model.map(([k, v]) => `<div class="offer-row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`)}
    ${section('tools', `
      <dl class="tools">${tools.map((p) => `
        <div class="tool"><dt>${esc(p.name)} <span class="sb-note">${esc(p.tag)}</span></dt><dd>${esc(p.desc)} ${link(p.url)}</dd></div>`).join('')}</dl>`)}
    ${section('contact', `
      <p class="sb-cta">${esc(DATA.cta)}</p>
      <dl class="contact">
        <div class="contact-row"><dt>email</dt><dd><a href="mailto:${esc(c.email)}?subject=${encodeURIComponent(DATA.mailSubject)}">${esc(c.email)}</a></dd></div>
        <div class="contact-row"><dt>github</dt><dd>${link(c.github)}</dd></div>
        <div class="contact-row"><dt>linkedin</dt><dd>${link(c.linkedin)}</dd></div>
        <div class="contact-row"><dt>location</dt><dd>${esc(c.location)}</dd></div>
      </dl>`)}
    <p class="sb-foot">on a computer, the yellow pane up top is a real terminal. type <b>help</b> in it.<br />no framework, no build step. view source, that's the artifact.</p>`;
}
