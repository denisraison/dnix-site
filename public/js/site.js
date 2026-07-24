// The traditional view: DATA rendered as a scrollable page, for visitors
// who'd rather read than type.

import { DATA, LOGO } from './data.js';
import { escapeHtml as esc } from './util.js';

/** @param {HTMLElement} container */
export function renderSite(container) {
  /** @param {typeof DATA.projects[number]} p */
  const card = (p) => `
    <div class="card">
      <div class="card-head">
        <span class="card-name">${esc(p.name)}</span>
        <span class="chip">${esc(p.tag)}</span>
      </div>
      <div class="card-desc">${esc(p.desc)}</div>
      ${p.url ? `<a href="https://${esc(p.url.replace(/^https?:\/\//, ''))}" target="_blank" rel="noopener">${esc(p.url)}</a>` : ''}
    </div>`;

  // Live bucket leads with Precision Coat here (the normal-site view is the
  // agency owner's skim); the terminal `projects` leads with GG. Split by tag.
  const live = DATA.projects.filter((p) => p.tag.startsWith('live'));
  const tools = DATA.projects.filter((p) => !p.tag.startsWith('live'));
  const leadFirst = [...live].sort((a, b) => (a.name === 'Precision Coat' ? -1 : b.name === 'Precision Coat' ? 1 : 0));
  const liveCards = leadFirst.map(card).join('');
  const toolCards = tools.map(card).join('');

  const stack = Object.entries(DATA.stack).map(([group, items]) => `
    <div class="stackgroup">
      <span class="label">${esc(group)}</span>
      ${items.map((it) => `<span class="chip">${esc(it)}</span>`).join('')}
    </div>`).join('');

  const model = DATA.model.map(([k, v]) => `
    <div class="modelrow"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('');

  const c = DATA.contact;
  container.innerHTML = `
    <section class="site-hero">
      <div class="site-logo">${LOGO}</div>
      <div class="site-tagline">${esc(DATA.brand)} :: ${esc(DATA.tagline)}</div>
      ${DATA.who.map((para) => `<p class="site-lede">${esc(para)}</p>`).join('')}
    </section>

    <h2>selected work</h2>
    <p class="sub" style="margin-bottom:16px">live products, then the tools I built for my own work.</p>
    ${liveCards}
    ${toolCards}

    <h2>stack</h2>
    ${stack}

    <h2>working with me</h2>
    <p class="sub" style="margin-bottom:14px">I take on scoped client work: one hard, well-defined piece at a time, done properly and shipped. Here's how that goes.</p>
    ${model}

    <div class="site-cta">
      <div class="big">Got a ticket? Email me and I'll tell you straight whether it's a fit and what it'd take.</div>
      <div class="contactgrid">
        <div class="row"><span class="ck">email</span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>
        <div class="row"><span class="ck">github</span><a href="https://${esc(c.github)}" target="_blank" rel="noopener">${esc(c.github)}</a></div>
        <div class="row"><span class="ck">linkedin</span><a href="https://${esc(c.linkedin)}" target="_blank" rel="noopener">${esc(c.linkedin)}</a></div>
        <div class="row"><span class="ck">location</span><span class="muted">${esc(c.location)}</span></div>
      </div>
    </div>

    <div class="site-foot">
      that dock at the bottom is a real terminal <span class="prompt-sym">$</span> open it and type <b class="blue">help</b>.<br />
      no framework, no build step. view source, that's the artifact.
    </div>`;
}
