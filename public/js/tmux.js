// The status bar: session name, the commands as clickable numbered windows
// (active one gets tmux's inverted highlight and a `*`), host and clock.

const WINDOWS = ['help', 'whoami', 'projects', 'stack', 'work', 'contact'];

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

  function tick() {
    const d = new Date();
    clockEl.textContent =
      String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  setInterval(tick, 10000);
  tick();

  return { mark };
}
