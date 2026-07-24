// The shell engine: a screen that prints lines, an input with history and
// tab-completion, and a block cursor that hugs the typed text. Commands are
// registered by the caller; the engine knows nothing about the content.

import { escapeHtml, delay, REDUCED_MOTION } from './util.js';

/**
 * @typedef {[html: string, cls?: string, pauseMs?: number]} BootLine
 *
 * @typedef {ReturnType<typeof createTerminal>} Terminal
 */

export const PROMPT =
  `<span class="prompt-user">guest</span><span class="muted">@</span>` +
  `<span class="prompt-host">dnix</span><span class="muted">:</span>` +
  `<span class="blue">~</span><span class="prompt-sym">$</span>`;

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.screen
 * @param {HTMLInputElement} opts.input
 * @param {HTMLElement} opts.inputrow
 * @param {(name: string) => void} [opts.onExec] fires after a known command ran
 */
export function createTerminal({ screen, input, inputrow, onExec }) {
  /** @type {Record<string, () => void>} */
  const commands = {};
  /** @type {string[]} */
  const history = [];
  let histIdx = -1;
  let ready = false;

  /**
   * @param {string} html
   * @param {string} [cls]
   */
  function print(html, cls) {
    const d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    screen.appendChild(d);
    screen.scrollTop = screen.scrollHeight;
    return d;
  }
  const blank = () => print('&nbsp;');
  const clear = () => { screen.innerHTML = ''; };

  /** @param {string} raw */
  function exec(raw) {
    const cmd = raw.trim();
    if (!cmd) {
      return;
    }
    history.unshift(cmd);
    histIdx = -1;
    print(`${PROMPT} <span class="cmd-echo">${escapeHtml(cmd)}</span>`);
    const name = cmd.split(/\s+/)[0].toLowerCase();
    const fn = commands[name];
    if (!fn) {
      print(`  <span class="gold">command not found:</span> <span class="white">${escapeHtml(name)}</span>`);
      print(`  <span class="muted">type <span class="blue">help</span> for what works.</span>`);
      blank();
      return;
    }
    fn();
    onExec?.(name);
  }

  /** @param {Record<string, () => void>} map */
  function register(map) {
    Object.assign(commands, map);
  }

  /* ---- typing effects, used by the boot sequence ---- */

  /**
   * Types a command char by char after a prompt, like a human at a keyboard.
   * @param {string} prefixHtml
   * @param {string} cmd
   */
  async function typeCommand(prefixHtml, cmd) {
    if (REDUCED_MOTION) {
      print(`${prefixHtml} <span class="cmd-echo">${escapeHtml(cmd)}</span>`);
      return;
    }
    const line = print(`${prefixHtml} <span class="cmd-echo"></span>`);
    const span = line.querySelector('.cmd-echo');
    if (!span) {
      return;
    }
    for (const ch of cmd) {
      span.textContent += ch;
      await delay(30 + Math.random() * 70);
    }
  }

  /**
   * Prints [html, cls, pauseAfterMs] tuples in sequence.
   * @param {BootLine[]} lines
   */
  async function printLines(lines) {
    for (const [html, cls, pause] of lines) {
      print(html, cls);
      if (!REDUCED_MOTION) {
        await delay(pause ?? 90);
      }
    }
  }

  /* ---- input handling ---- */

  // Sizes the input to its text so the block cursor sits right after it.
  const measure = document.createElement('span');
  measure.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit;';
  document.body.appendChild(measure);
  function positionCursor() {
    measure.textContent = input.value;
    input.style.width = (measure.getBoundingClientRect().width + 2) + 'px';
  }

  function moveCaretEnd() {
    positionCursor();
    requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
  }

  input.addEventListener('input', positionCursor);
  input.addEventListener('keydown', (e) => {
    if (!ready) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      const v = input.value;
      input.value = '';
      positionCursor();
      exec(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx];
        moveCaretEnd();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx];
      } else {
        histIdx = -1;
        input.value = '';
      }
      moveCaretEnd();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const part = input.value.trim().toLowerCase();
      if (part) {
        const match = Object.keys(commands).find((c) => c.startsWith(part));
        if (match) {
          input.value = match;
          positionCursor();
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clear();
    }
  });

  // Clicking anywhere inside an open/full dock (screen, input row, tmux bar)
  // refocuses the prompt, so a scroll or a stray click doesn't leave you
  // unable to type. Scoped to the shell so page clicks above the dock don't
  // steal focus. Ignore clicks on links/buttons so they still work.
  const dock = screen.closest('.shell') || screen;
  dock.addEventListener('click', (e) => {
    if (!ready || document.body.classList.contains('dock-collapsed')) {
      return;
    }
    const t = /** @type {HTMLElement} */ (e.target);
    if (t.closest('a, button')) {
      return;
    }
    input.focus();
  });

  /** @param {{focus?: boolean}} [opts] */
  function setReady({ focus = true } = {}) {
    ready = true;
    inputrow.style.display = 'flex';
    positionCursor();
    if (focus) {
      input.focus();
    }
  }

  return {
    print, blank, clear, exec, register,
    typeCommand, printLines, setReady,
    focus: () => input.focus(),
    get ready() { return ready; },
  };
}
