// The command set. Pure content-over-DATA; all printing goes through the
// terminal's print API.

import { DATA, NAV, MORE } from './data.js';
import { delay, escapeHtml as esc } from './util.js';

/**
 * @param {import('./terminal.js').Terminal} term
 * @param {{onExit?: () => void}} [opts] onExit re-runs the login (see main.js)
 */
export function buildCommands(term, { onExit } = {}) {
  const { print, blank, clear } = term;
  const ct = DATA.contact;

  /**
   * A key/value row whose value wraps under itself, not under the key.
   * @param {string} k
   * @param {string} vHtml
   */
  const row = (k, vHtml) => print(`  <b class="k">${esc(k)}</b><span>${vHtml}</span>`, 'row');

  /** @param {typeof DATA.projects[number]} p */
  function project(p) {
    print(`  <b>${esc(p.name)}</b>  <span class="soft">${esc(p.tag)}</span>`);
    print(`    ${esc(p.desc)}`);
    print(`    <a href="https://${esc(p.url)}" target="_blank" rel="noopener">${esc(p.url)}</a>`);
    blank();
  }

  /** @type {Record<string, () => void>} */
  const commands = {
    help() {
      blank();
      print(`<b>available commands</b>`);
      // NAV is the shared source (see data.js); clear/help are utility commands.
      [...NAV, ...MORE, ["clear", "wipe the screen"], ["help", "this list"]]
        .forEach(([c, d]) => row(c, `<span class="soft">${esc(d)}</span>`));
      blank();
      print(`  <span class="soft">↑↓ history · tab completes · ctrl-l clears · ctrl-b o moves between panes · esc comes back here</span>`);
      blank();
    },

    whoami() {
      blank();
      DATA.who.forEach((para, i) => {
        if (i > 0) { blank(); }
        print(`  ${esc(para)}`);
      });
      blank();
      print(`  <span class="soft">the page you're reading is a working terminal, not a screenshot.</span>`);
      print(`  <span class="soft">no framework, no build step. view source, it's unminified.</span>`);
      blank();
    },

    work() {
      blank();
      print(`<b>working with me</b>`);
      blank();
      print(`  I help brands make sense of their retail media spend. here's how that starts.`);
      blank();
      DATA.model.forEach(([k, v]) => {
        print(`  <b>${esc(k)}</b>`);
        print(`    ${esc(v)}`);
      });
      blank();
      print(`  <span class="soft">want 20 minutes? press enter, the prompt already says mail.</span>`);
      blank();
    },

    tools() {
      blank();
      print(`<b>tools</b> <span class="soft">· built for my own work, in the open</span>`);
      blank();
      DATA.projects.filter((p) => p.tag.startsWith('tool')).forEach(project);
    },

    projects() {
      blank();
      print(`<b>selected work</b> <span class="soft">· what I'm running now, then the tools I built</span>`);
      blank();
      DATA.projects.forEach(project);
    },

    stack() {
      blank();
      print(`<b>stack</b>`);
      for (const [group, items] of Object.entries(DATA.stack)) {
        row(group, esc(items.join(', ')));
      }
      blank();
    },

    contact() {
      blank();
      print(`<b>contact</b>`);
      row('email', `<a href="mailto:${esc(ct.email)}">${esc(ct.email)}</a>`);
      row('github', `<a href="https://${esc(ct.github)}" target="_blank" rel="noopener">${esc(ct.github)}</a>`);
      row('linkedin', `<a href="https://${esc(ct.linkedin)}" target="_blank" rel="noopener">${esc(ct.linkedin)}</a>`);
      row('location', esc(ct.location));
      blank();
    },

    // The prompt's prefill. The printed link is the fallback when no mail app
    // picks up the programmatic click.
    mail() {
      const href = `mailto:${ct.email}?subject=${encodeURIComponent(DATA.mailSubject)}`;
      const line = print(`  opening your mail app: <a class="mailto" href="${esc(href)}">${esc(ct.email)}</a>`);
      line.querySelector('a')?.click();
      blank();
    },

    clear,

    // easter eggs
    ls() {
      print(`  ${NAV.map(([c]) => c).join('  ')} <span class="soft">· they're commands, run them</span>`);
    },
    sudo() {
      print(`  denis is not in the sudoers file. This incident will be reported.`);
    },
    // Log out for real: show the message, let it sit a beat, then the caller
    // wipes the screen and runs the login again.
    async exit() {
      print(`  logout`);
      print(`  <span class="soft">Connection to dnix.io closed.</span>`);
      if (!onExit) {
        return;
      }
      term.logout();
      await delay(650);
      onExit();
    },
  };

  // aliases
  commands.about = commands.whoami;
  commands.hire = commands.work;
  commands.model = commands.work;
  commands.pricing = commands.work;

  return commands;
}
