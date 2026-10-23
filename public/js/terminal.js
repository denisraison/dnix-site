// The shell engine: a screen that prints lines, an input with history and
// tab-completion, a block cursor that hugs the typed text, and a prefilled
// suggestion that typing replaces. Commands are registered by the caller; the
// engine knows nothing about the content.

import { escapeHtml } from './util.js';

/** @typedef {ReturnType<typeof createTerminal>} Terminal */

export const PROMPT = `<b class="ps1"><span class="ps1-user">guest@dnix:</span>~$</b>`;

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.screen
 * @param {HTMLInputElement} opts.input
 * @param {HTMLElement} opts.inputrow
 * @param {HTMLButtonElement} opts.enter the on-screen Enter key, for thumbs
 * @param {(name: string) => void} [opts.onExec] fires after a known command ran
 */
export function createTerminal({ screen, input, inputrow, enter, onExec }) {
  /** @type {Record<string, () => void>} */
  const commands = {};
  /** @type {string[]} */
  const history = [];
  let histIdx = -1;
  let ready = false;
  let suggestion = '';
  let prefilled = false;

  /**
   * Leading spaces become a hanging indent, so wrapped output lines up under
   * the text instead of falling back to column 0.
   * @param {string} html
   * @param {string} [cls]
   */
  function print(html, cls) {
    const d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    const indent = html.length - html.trimStart().length;
    if (indent > 0) {
      d.style.paddingInlineStart = indent + 'ch';
    }
    d.innerHTML = html.slice(indent);
    screen.appendChild(d);
    screen.scrollTop = screen.scrollHeight;
    return d;
  }
  const blank = () => print('&nbsp;');
  const clear = () => { screen.innerHTML = ''; };

  /** @param {boolean} on */
  function setPrefilled(on) {
    prefilled = on;
    enter.textContent = on ? 'email me' : 'run';
  }

  // Puts the suggestion back in an empty prompt, so the next step is always
  // one Enter away.
  function prefill() {
    if (input.value && !prefilled) {
      return;
    }
    input.value = suggestion;
    setPrefilled(true);
    positionCursor();
  }

  /** @param {string} text */
  function suggest(text) {
    suggestion = text;
    prefill();
  }

  /** @param {string} raw */
  function exec(raw) {
    const cmd = raw.trim();
    if (!cmd) {
      return;
    }
    history.unshift(cmd);
    histIdx = -1;
    const echo = print(`${PROMPT} <span class="cmd-echo">${escapeHtml(cmd)}</span>`);
    const name = cmd.split(/\s+/)[0].toLowerCase();
    const fn = commands[name];
    if (!fn) {
      print(`  command not found: <b>${escapeHtml(name)}</b>`);
      print(`  type <b>help</b> for what works.`);
      blank();
      return;
    }
    fn();
    onExec?.(name);
    // Long output reads from the top, like a pager, not from its last line.
    // On a phone the screen doesn't scroll (terminal.css); the page does.
    if (getComputedStyle(screen).overflowY === 'visible') {
      echo.scrollIntoView({ block: 'start' });
      return;
    }
    screen.scrollTop = echo.offsetTop;
    if (screen.scrollTop >= echo.offsetTop) {
      return;
    }
    // Clamped short of the echo: snap up to a whole line so no sliver shows.
    let top = 0;
    for (const el of screen.children) {
      if (!(el instanceof HTMLElement) || el.offsetTop > screen.scrollTop) {
        break;
      }
      top = el.offsetTop;
    }
    screen.scrollTop = top;
  }

  function submit() {
    if (!ready) {
      return;
    }
    const v = input.value;
    input.value = '';
    setPrefilled(false);
    exec(v);
    prefill();
  }

  /** @param {Record<string, () => void>} map */
  function register(map) {
    Object.assign(commands, map);
  }

  /* ---- input handling ---- */

  // Sizes the input to its text so the block cursor sits right after it.
  const measure = document.createElement('span');
  measure.className = 'measure';
  input.after(measure);
  function positionCursor() {
    measure.textContent = input.value;
    input.style.width = (measure.getBoundingClientRect().width + 2) + 'px';
  }

  function moveCaretEnd() {
    positionCursor();
    requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
  }

  // Typing over the suggestion replaces it. beforeinput rather than keydown:
  // phone keyboards report most keys as "Unidentified".
  input.addEventListener('beforeinput', (e) => {
    if (!prefilled) {
      return;
    }
    e.preventDefault();
    input.value = e.inputType.startsWith('insert') ? (e.data ?? e.dataTransfer?.getData('text') ?? '') : '';
    setPrefilled(false);
    moveCaretEnd();
  });
  input.addEventListener('input', positionCursor);
  input.addEventListener('keydown', (e) => {
    if (!ready) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx];
        setPrefilled(false);
        moveCaretEnd();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx];
        setPrefilled(false);
      } else {
        histIdx = -1;
        input.value = '';
        prefill();
      }
      moveCaretEnd();
      return;
    }
    // Tab completes a typed fragment; with nothing typed it moves focus on,
    // so keyboard users are never trapped in the prompt.
    if (e.key === 'Tab') {
      const part = input.value.trim().toLowerCase();
      if (prefilled || !part || e.shiftKey) {
        return;
      }
      e.preventDefault();
      const match = Object.keys(commands).find((c) => c.startsWith(part));
      if (match) {
        input.value = match;
        positionCursor();
      }
      return;
    }
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clear();
    }
  });

  enter.addEventListener('click', submit);

  /** @param {{focus?: boolean}} [opts] */
  function setReady({ focus = true } = {}) {
    ready = true;
    inputrow.hidden = false;
    // Announce command output from here on, not the login lines before it.
    screen.setAttribute('aria-live', 'polite');
    positionCursor();
    if (focus) {
      input.focus({ preventScroll: true });
    }
  }

  function logout() {
    ready = false;
    inputrow.hidden = true;
  }

  return {
    print, blank, clear, exec, register, suggest, prefill, setReady, logout,
    focus: () => input.focus({ preventScroll: true }),
    get ready() { return ready; },
  };
}
