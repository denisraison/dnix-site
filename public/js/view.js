// The terminal is a bottom dock over the always-present page, like an IDE
// panel. Three states live on <body>: dock-collapsed (thin strip),
// dock-open (~half height, typeable), dock-full (old full-screen terminal).
//
// Precedence for the initial state: ?view= in the URL (a shareable direct
// link) beats the remembered choice, which beats the default (collapsed).

import { renderSite } from './site.js';

const DOCK_KEY = 'dnix.dock';
/** @typedef {'collapsed' | 'open' | 'full'} Dock */

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.siteEl
 * @param {HTMLElement} opts.handleEl
 * @param {HTMLElement} opts.hintEl
 * @param {() => void} opts.focusTerminal
 * @param {() => void} opts.onFirstReveal fires once, the first time the
 *   terminal becomes visible (open or full), to run the boot sequence lazily.
 */
export function initViews({ siteEl, handleEl, hintEl, focusTerminal, onFirstReveal }) {
  // Rendered up front, not on first open: this is the only real text on the
  // page, so it has to be in the DOM for crawlers. Contained, so a render
  // failure can't take the terminal down with it.
  try {
    renderSite(siteEl);
  } catch (err) {
    console.error('site render failed', err);
  }

  /** @type {Dock} */
  let current = 'full';
  let revealed = false;

  /**
   * @param {Dock} dock
   * @param {{remember?: boolean}} [opts]
   */
  function setDock(dock, { remember = false } = {}) {
    current = dock;
    document.body.classList.toggle('dock-collapsed', dock === 'collapsed');
    document.body.classList.toggle('dock-open', dock === 'open');
    document.body.classList.toggle('dock-full', dock === 'full');
    // The handle labels the action, not the state: it says what a click does.
    hintEl.textContent = dock === 'collapsed' ? 'terminal · click to open' : 'terminal';
    handleEl.setAttribute('aria-expanded', String(dock !== 'collapsed'));
    if (remember) {
      try { localStorage.setItem(DOCK_KEY, dock); } catch (_) {}
    }
    if (dock === 'collapsed') {
      return;
    }
    if (!revealed) {
      revealed = true;
      onFirstReveal();
      return; // boot sequence takes focus itself once it's done
    }
    focusTerminal();
  }

  // Clicking the handle toggles between collapsed and open. Full is only
  // reached by a direct ?view=term link or a remembered maximize.
  handleEl.addEventListener('click', () => {
    setDock(current === 'collapsed' ? 'open' : 'collapsed', { remember: true });
  });

  // `exit`: log out. Collapse the dock, forget the remembered open state, and
  // re-arm the boot so the next open replays the ssh login on a clean screen.
  function exitTerminal() {
    revealed = false;
    try { localStorage.removeItem(DOCK_KEY); } catch (_) {}
    setDock('collapsed');
  }

  /** @returns {Dock} */
  function initialDock() {
    const forced = new URLSearchParams(location.search).get('view');
    if (forced === 'term') {
      return 'full';
    }
    if (forced === 'site') {
      return 'collapsed';
    }
    let saved = null;
    try { saved = localStorage.getItem(DOCK_KEY); } catch (_) {}
    return saved === 'open' || saved === 'full' ? /** @type {Dock} */ (saved) : 'collapsed';
  }

  return { setDock, initialDock, exitTerminal, get dock() { return current; } };
}
