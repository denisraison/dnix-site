// The status bar: session name, the commands as clickable numbered windows
// (active one gets tmux's inverted highlight and a `*`), host and clock.

import { NAV } from './data.js';

// `help` leads (window 0), then the shared NAV order — one source with the
// help listing, so the bar and `help` can't disagree on membership or order.
const WINDOWS = ['help', ...NAV.map(([name]) => name)];

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.windowsEl
 * @param {HTMLElement} opts.clockEl
 * @param {(name: string) => void} opts.onSelect
 */
export function initTmux({ windowsEl, clockEl, onSelect }) {
  const wins = WINDOWS.map((name, i) => {
    const el = document.createElement('span');
    el.className = 'tm-win';
    el.textContent = `${i}:${name}`;
    el.addEventListener('click', () => onSelect(name));
    windowsEl.appendChild(el);
    return { name, i, el };
  });

  /**
   * Marks the window matching a just-run command; any other name clears all.
   * @param {string} name
   */
  function mark(name) {
    for (const w of wins) {
      const active = w.name === name;
      w.el.classList.toggle('active', active);
      w.el.textContent = `${w.i}:${w.name}${active ? '*' : ''}`;
    }
  }

  // Show HH:MM and re-tick on the minute boundary, not every N seconds, so the
  // displayed minute never lags the wall clock.
  function tick() {
    const d = new Date();
    clockEl.textContent =
      String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const msToNextMinute = (60 - d.getSeconds()) * 1000 - d.getMilliseconds();
    setTimeout(tick, msToNextMinute);
  }
  tick();

  return { mark };
}
