// Entry point: build the terminal, register the commands, wire the chrome,
// pick a view, run the login sequence.

import { byId } from './util.js';
import { createTerminal } from './terminal.js';
import { buildCommands } from './commands.js';
import { initTmux } from './tmux.js';
import { runBoot } from './boot.js';
import { initViews } from './view.js';

/** @type {ReturnType<typeof initTmux> | undefined} */
let tmux;
const term = createTerminal({
  screen: byId('screen'),
  input: /** @type {HTMLInputElement} */ (byId('cmdline')),
  inputrow: byId('inputrow'),
  onExec: (name) => tmux?.mark(name),
});

tmux = initTmux({
  windowsEl: byId('tmwindows'),
  clockEl: byId('clock'),
  onSelect: (cmd) => {
    if (term.ready) {
      term.exec(cmd);
    }
  },
});

// The ssh-login sequence plays the first time the terminal is revealed (open
// or full), not on page load: a visit that never opens the dock never pays for
// it, and opening from collapsed still gets the full boot.
async function boot() {
  await runBoot(term);
  term.setReady();
}

const views = initViews({
  siteEl: byId('site'),
  handleEl: byId('dockhandle'),
  hintEl: byId('dockhint'),
  focusTerminal: () => {
    if (term.ready) {
      term.focus();
    }
  },
  onFirstReveal: boot,
});

// Register commands last: `exit` needs views.exitTerminal to collapse the dock.
term.register(buildCommands(term, { onExit: views.exitTerminal }));

// Wait for load, not module eval, so the typing starts after the font is in.
// setDock runs the boot on first reveal; a collapsed start defers it until the
// dock is opened. Nothing to arm here (a collapsed terminal can't be typed in).
window.addEventListener('load', () => {
  views.setDock(views.initialDock());
});
