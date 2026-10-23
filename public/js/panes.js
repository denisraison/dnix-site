// Pane focus, tmux style: the focused pane burns, the others dim (CSS keys off
// .is-focus). Click a pane, or Ctrl-b then an arrow or `o`, to move. Esc always
// comes back to the hero prompt.

/**
 * @param {Object} opts
 * @param {HTMLElement[]} opts.panes hero first; DOM order is the `o` cycle
 * @param {HTMLElement} opts.prefixEl shown while Ctrl-b is waiting for a key
 * @param {() => void} opts.focusHero puts the caret back in the prompt
 */
export function initPanes({ panes, prefixEl, focusHero }) {
  const hero = panes[0];
  let active = hero;
  let armed = false;

  /**
   * @param {HTMLElement} pane
   * @param {{move?: boolean}} [opts] move: also take keyboard focus
   */
  function setActive(pane, { move = true } = {}) {
    active = pane;
    for (const p of panes) {
      p.classList.toggle('is-focus', p === pane);
    }
    if (!move) {
      return;
    }
    if (pane === hero) {
      focusHero();
      return;
    }
    pane.focus();
  }

  /**
   * Nearest pane whose box lies wholly on that side of the active one, so the
   * arrows follow the layout whether the panes sit side by side or stacked.
   * @param {string} key
   */
  function neighbour(key) {
    const a = active.getBoundingClientRect();
    /** @type {HTMLElement | null} */
    let best = null;
    let bestDist = Infinity;
    for (const p of panes) {
      const r = p.getBoundingClientRect();
      const beside =
        key === 'ArrowLeft' ? r.right <= a.left + 1 :
        key === 'ArrowRight' ? r.left >= a.right - 1 :
        key === 'ArrowUp' ? r.bottom <= a.top + 1 :
        r.top >= a.bottom - 1;
      if (p === active || !beside) {
        continue;
      }
      const dist = Math.hypot(r.left + r.width / 2 - (a.left + a.width / 2), r.top + r.height / 2 - (a.top + a.height / 2));
      if (dist < bestDist) {
        best = p;
        bestDist = dist;
      }
    }
    return best;
  }

  /** @param {boolean} on */
  function arm(on) {
    armed = on;
    prefixEl.hidden = !on;
  }

  // Capture phase, so the prefix and its follow-up key never reach the prompt.
  document.addEventListener('keydown', (e) => {
    if (armed) {
      arm(false);
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'o') {
        setActive(panes[(panes.indexOf(active) + 1) % panes.length]);
        return;
      }
      if (e.key.startsWith('Arrow')) {
        setActive(neighbour(e.key) ?? active);
      }
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      e.stopPropagation();
      arm(true);
      return;
    }
    if (e.key === 'Escape') {
      setActive(hero);
    }
  }, true);

  // click, not pointerdown: a thumb scrolling past a pane shouldn't focus it.
  for (const p of panes) {
    p.addEventListener('click', () => {
      if (p !== active) {
        setActive(p, { move: p !== hero });
      }
    });
    p.addEventListener('focusin', () => setActive(p, { move: false }));
  }

  return { setActive, get active() { return active; } };
}
