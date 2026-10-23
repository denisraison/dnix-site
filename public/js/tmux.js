// The status bar: session name, the NAV commands as numbered windows (the
// active one gets tmux's inverted block and a `*`), host and clock.

import { NAV } from './data.js';

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.windowsEl
 * @param {HTMLElement} opts.clockEl
 * @param {(name: string) => void} opts.onSelect
 */
export function initTmux({ windowsEl, clockEl, onSelect }) {
  const wins = NAV.map(([name, help], i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'tm-win';
    el.textContent = `${i}:${name}`;
    el.title = help;
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
      if (active) {
        w.el.setAttribute('aria-current', 'true');
      } else {
        w.el.removeAttribute('aria-current');
      }
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
