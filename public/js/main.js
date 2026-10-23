// Entry point: render the panes and scrollback, build the terminal, register
// the commands, wire the status bar and pane focus, log in.

import { byId } from './util.js';
import { renderSite, tailLog } from './site.js';
import { createTerminal } from './terminal.js';
import { buildCommands } from './commands.js';
import { initTmux } from './tmux.js';
import { initPanes } from './panes.js';
import { runBoot } from './boot.js';

const hero = byId('pane-hero');

// Rendered first: this is the page's real text, so it has to be in the DOM for
// crawlers. Contained, so a render failure can't take the terminal down too.
try {
  renderSite({
    head: byId('herohead'),
    hint: byId('hint'),
    actions: byId('heroactions'),
    shelf: byId('pane-shelf'),
    auction: byId('pane-auction'),
    scrollback: byId('scrollback'),
  });
  tailLog(byId('pane-auction'));
} catch (err) {
  console.error('site render failed', err);
}

/** @type {ReturnType<typeof initTmux> | undefined} */
let tmux;
const term = createTerminal({
  screen: byId('screen'),
  input: /** @type {HTMLInputElement} */ (byId('cmdline')),
  inputrow: byId('inputrow'),
  enter: /** @type {HTMLButtonElement} */ (byId('enter')),
  onExec: (name) => {
    tmux?.mark(name);
    if (name !== 'mail') {
      session(name !== 'clear');
    }
  },
});

/** @param {boolean} on */
function session(on) {
  hero.classList.toggle('is-session', on);
}

// On a phone, focusing the prompt throws up the keyboard over the answer, so
// only fine pointers get the caret back automatically.
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Esc lands here: out of the session view, back to the poster and the prompt.
function focusPrompt() {
  session(false);
  term.prefill();
  if (term.ready) {
    term.focus();
  }
}

const panes = initPanes({
  panes: [hero, byId('pane-shelf'), byId('pane-auction')],
  prefixEl: byId('tmprefix'),
  focusHero: focusPrompt,
});

// The stacked phone layout (same breakpoint as site.css). There the windows are
// navigation: printing into the hero pushed the email button away and later
// output landed off screen.
const stacked = window.matchMedia('(max-width: 899px)');

tmux = initTmux({
  windowsEl: byId('tmwindows'),
  clockEl: byId('clock'),
  onSelect: (cmd) => {
    if (stacked.matches) {
      byId(`sb-${cmd}`).scrollIntoView({ block: 'start' });
      tmux?.mark(cmd);
      return;
    }
    if (!term.ready) {
      return;
    }
    term.exec(cmd);
    panes.setActive(hero, { move: false });
    if (finePointer) {
      term.focus();
    }
    if (hero.getBoundingClientRect().top < 0) {
      hero.scrollIntoView({ block: 'start' });
    }
  },
});

// On the phone the window mark follows the scroll, so the bar says where you are.
const visible = new Set();
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      visible.add(e.target.id);
    } else {
      visible.delete(e.target.id);
    }
  }
  if (!stacked.matches) {
    return;
  }
  const first = [...document.querySelectorAll('.sb')].find((s) => visible.has(s.id));
  tmux?.mark(first ? first.id.slice(3) : '');
}, { rootMargin: '-35% 0px -60% 0px' });
document.querySelectorAll('.sb').forEach((s) => spy.observe(s));

// A click on the hero's bare yellow puts the caret back in the prompt, unless
// it was a link, a button, or the end of a text selection.
hero.addEventListener('click', (e) => {
  const t = /** @type {HTMLElement} */ (e.target);
  if (!finePointer || !term.ready || t.closest('a, button') || String(getSelection())) {
    return;
  }
  term.focus();
});

term.register(buildCommands(term, {
  onExit: () => {
    session(false);
    term.clear();
    runBoot(term);
  },
}));

runBoot(term, { focus: finePointer });
