// The login sequence: ssh in, host warning, last login, motd, prompt.

import { DATA, LOGO } from './data.js';
import { delay, REDUCED_MOTION } from './util.js';

const LOCAL_PROMPT = `<span class="muted">you@local</span><span class="dim">:~$</span>`;

// Yesterday, formatted like a real last-login stamp: "Tue Jul 22 17:03:11 2026".
function lastLogin() {
  const d = new Date(Date.now() - 86400000);
  return `${d.toDateString().slice(0, 10)} ${d.toTimeString().slice(0, 8)} ${d.getFullYear()}`;
}

/** @returns {import('./terminal.js').BootLine[]} */
function motd() {
  return [
    [`<span class="dim">Warning: Permanently added 'dnix.io' (ED25519) to the list of known hosts.</span>`, '', 340],
    [`<span class="muted">Last login: ${lastLogin()} from 203.0.113.42</span>`, '', 380],
    [`&nbsp;`, '', 140],
    [`<span class="logo">${LOGO}</span>`, '', 80],
    [`  <span class="muted">${DATA.brand} :: ${DATA.tagline}</span>`, '', 200],
    [`  <span class="dim">Denis Santos · senior full-stack · Brisbane · denis@dnix.io</span>`, '', 260],
    [`&nbsp;`, '', 100],
    [`  <span class="white">real shell. type</span> <span class="blue">help</span><span class="white"> to look around, or just read the page behind it.</span>`, '', 120],
    [`&nbsp;`, '', 40],
  ];
}

/** @param {import('./terminal.js').Terminal} term */
export async function runBoot(term) {
  if (!REDUCED_MOTION) {
    await delay(350);
  }
  await term.typeCommand(LOCAL_PROMPT, 'ssh guest@dnix.io');
  if (!REDUCED_MOTION) {
    await delay(300);
  }
  await term.printLines(motd());
}
