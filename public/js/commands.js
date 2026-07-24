// The command set. Pure content-over-DATA; all printing goes through the
// terminal's print API.

import { DATA, LOGO } from './data.js';
import { delay } from './util.js';

/**
 * @param {import('./terminal.js').Terminal} term
 * @param {{onExit?: () => void}} [opts] onExit collapses the dock (see view.js)
 */
export function buildCommands(term, { onExit } = {}) {
  const { print, blank, clear } = term;

  /** @type {Record<string, () => void>} */
  const commands = {
    help() {
      blank();
      print(`<span class="gold">available commands</span>`);
      const rows = [
        ["whoami", "who I am and what I do"],
        ["projects", "live products and the tools I built"],
        ["stack", "what I build with"],
        ["work", "working with me on scoped tickets"],
        ["contact", "email, github, linkedin"],
        ["clear", "wipe the screen"],
        ["help", "this list"],
      ];
      rows.forEach(([c, d]) => print(`  <span class="blue">${c.padEnd(10)}</span><span class="muted">${d}</span>`));
      blank();
      print(`  <span class="dim">↑↓ history · tab completes · ctrl-l clears · the bar below is clickable</span>`);
      blank();
    },

    whoami() {
      blank();
      print(`<span class="logo">${LOGO}</span>`);
      print(`  <span class="muted">${DATA.brand} :: ${DATA.tagline}</span>`);
      blank();
      DATA.who.forEach((para, i) => {
        if (i > 0) { blank(); }
        print(`  <span class="white">${para}</span>`);
      });
      blank();
      print(`  <span class="muted">the page you're reading is the kind of thing I build. a working terminal,</span>`);
      print(`  <span class="muted">not a screenshot. no framework, no build step. view source, it's unminified.</span>`);
      blank();
    },

    projects() {
      blank();
      print(`<span class="gold">selected work</span> <span class="muted">· live products, then the tools I built</span>`);
      blank();
      DATA.projects.forEach((p, i) => {
        print(`  <span class="blue">[${i + 1}]</span> <span class="white">${p.name}</span>  <span class="chip">${p.tag}</span>`);
        print(`      <span class="muted">${p.desc}</span>`);
        if (p.url) {
          print(`      <a href="https://${p.url.replace(/^https?:\/\//, '')}" target="_blank" rel="noopener">${p.url}</a>`);
        }
        blank();
      });
    },

    stack() {
      blank();
      print(`<span class="gold">stack</span>`);
      for (const [group, items] of Object.entries(DATA.stack)) {
        print(`  <span class="blue">${group}</span>`);
        print(`    ${items.map((i) => `<span class="chip">${i}</span>`).join('')}`);
      }
      blank();
    },

    work() {
      blank();
      print(`<span class="gold">working with me</span>`);
      blank();
      print(`  <span class="muted">I take on scoped client work: one hard, well-defined piece at a time,</span>`);
      print(`  <span class="muted">done properly and shipped. here's how that goes.</span>`);
      blank();
      DATA.model.forEach(([k, v]) => {
        print(`  <span class="blue">${k}</span>`);
        print(`    <span class="muted">${v}</span>`);
      });
      blank();
      print(`  <span class="muted">got one? run <span class="gold">contact</span> and I'll tell you straight whether it's a fit.</span>`);
      blank();
    },

    contact() {
      blank();
      print(`<span class="gold">contact</span>`);
      print(`  <span class="blue">email   </span> <a href="mailto:${DATA.contact.email}">${DATA.contact.email}</a>`);
      print(`  <span class="blue">github  </span> <a href="https://${DATA.contact.github}" target="_blank" rel="noopener">${DATA.contact.github}</a>`);
      print(`  <span class="blue">linkedin</span> <a href="https://${DATA.contact.linkedin}" target="_blank" rel="noopener">${DATA.contact.linkedin}</a>`);
      print(`  <span class="blue">location</span> <span class="muted">${DATA.contact.location}</span>`);
      blank();
    },

    clear,

    // easter eggs
    ls() {
      print(`  <span class="muted">whoami  projects  stack  work  contact</span> <span class="dim">· they're commands, run them</span>`);
    },
    sudo() {
      print(`  <span class="muted">denis is not in the sudoers file. This incident will be reported.</span>`);
    },
    // Log out for real: show the message, let it sit a beat, collapse the dock
    // back down, then wipe the screen so the next open re-boots fresh.
    async exit() {
      print(`  <span class="muted">logout</span>`);
      print(`  <span class="dim">Connection to dnix.io closed.</span>`);
      if (!onExit) {
        return;
      }
      await delay(650);
      onExit();
      clear();
    },
  };

  // aliases
  commands.about = commands.whoami;
  commands.hire = commands.work;
  commands.model = commands.work;
  commands.pricing = commands.work;

  return commands;
}
