// The login: two lines of ssh, then the prompt with its suggestion. Printed in
// one go, nothing typed out: the auction pane owns the page's motion.

import { DATA } from './data.js';

const LOCAL_PROMPT = `<span class="soft">you@local:~$</span>`;

// Yesterday, formatted like a real last-login stamp: "Tue Jul 22 17:03:11 2026".
function lastLogin() {
  const d = new Date(Date.now() - 86400000);
  return `${d.toDateString().slice(0, 10)} ${d.toTimeString().slice(0, 8)} ${d.getFullYear()}`;
}

/**
 * @param {import('./terminal.js').Terminal} term
 * @param {{focus?: boolean}} [opts]
 */
export function runBoot(term, { focus = true } = {}) {
  term.print(`${LOCAL_PROMPT} ssh guest@dnix.io`, 'boot');
  term.print(`<span class="soft">Last login: ${lastLogin()} from 203.0.113.42</span>`, 'boot');
  term.suggest(DATA.prefill);
  term.setReady({ focus });
}
