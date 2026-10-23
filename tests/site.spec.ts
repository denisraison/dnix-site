import { test, expect } from '@playwright/test';

// The login prints two ssh lines and then shows the prompt, prefilled with
// `mail denis@dnix.io`. "Wait for the input" is "wait for the login".
async function bootedTerminal(page) {
  await page.goto('/');
  const input = page.locator('#cmdline');
  await expect(input).toBeVisible({ timeout: 15000 });
  return input;
}

test('boots through the ssh login into a live, prefilled prompt', async ({ page }) => {
  const input = await bootedTerminal(page);
  await expect(page.locator('#screen')).toContainText('ssh guest@dnix.io');
  await expect(page.locator('#screen')).toContainText('Last login:');
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('mail denis@dnix.io');
});

test('Enter on the prefilled prompt opens a mailto', async ({ page }) => {
  const input = await bootedTerminal(page);
  // Catch the mail link's click before the browser hands it to a mail app.
  await page.evaluate(() => {
    document.addEventListener('click', (e) => {
      const a = (e.target as HTMLElement).closest('a[href^="mailto:"]');
      if (a) {
        e.preventDefault();
        (window as any).__mailto = a.getAttribute('href');
      }
    }, true);
  });
  await input.press('Enter');
  await expect.poll(() => page.evaluate(() => (window as any).__mailto))
    .toBe('mailto:denis@dnix.io?subject=20%20minutes');
  // The prompt offers it again for next time.
  await expect(input).toHaveValue('mail denis@dnix.io');
});

test('typing replaces the prefill and runs commands', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('projects');
  await expect(input).toHaveValue('projects');
  await input.press('Enter');
  const screen = page.locator('#screen');
  await expect(screen).toContainText('gitknown');
  await expect(screen).toContainText('shelf.dnix.io');
});

test('tab completes command names', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('who');
  await input.press('Tab');
  await expect(input).toHaveValue('whoami');
});

test('history recalls the last command', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('stack');
  await input.press('Enter');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('stack');
});

test('tmux windows run their command and take the active mark', async ({ page }) => {
  await bootedTerminal(page);
  await page.locator('.tm-win', { hasText: '1:work' }).click();
  await expect(page.locator('#screen')).toContainText('working with me');
  await expect(page.locator('.tm-win.active')).toHaveText('1:work*');
  await expect(page.locator('#pane-hero')).toHaveClass(/is-session/);
});

test('unknown commands fail politely', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('vim');
  await input.press('Enter');
  await expect(page.locator('#screen')).toContainText('command not found: vim');
});

test('exit logs out, clears, and logs back in', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('exit');
  await input.press('Enter');
  const screen = page.locator('#screen');
  await expect(screen).toContainText('Connection to dnix.io closed.');

  // The screen wipes and the login replays on a clean screen.
  await expect(screen).not.toContainText('Connection to dnix.io closed.');
  await expect(screen).toContainText('ssh guest@dnix.io');
  await expect(input).toHaveValue('mail denis@dnix.io');
});

test('ctrl-b moves pane focus, esc comes back to the prompt', async ({ page }) => {
  const input = await bootedTerminal(page);
  await expect(page.locator('#pane-hero')).toHaveClass(/is-focus/);

  await page.keyboard.press('Control+b');
  await page.keyboard.press('o');
  await expect(page.locator('#pane-shelf')).toHaveClass(/is-focus/);
  await expect(page.locator('#pane-hero')).not.toHaveClass(/is-focus/);

  await page.keyboard.press('Control+b');
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#pane-auction')).toHaveClass(/is-focus/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#pane-hero')).toHaveClass(/is-focus/);
  await expect(input).toBeFocused();
});

// The page is the only crawlable text, so it's rendered up front and needs no
// typing: the h1, the finding, the synthetic label and the scrollback.
test('renders the page content without typing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('I built the machine that picks which ad you see.');
  await expect(page.locator('#site .sb-p').first()).toContainText('Denis Santos');
  await expect(page.locator('#pane-shelf')).toContainText('10 of 12 sponsored');
  await expect(page.locator('#pane-shelf a')).toHaveAttribute('href', 'https://shelf.dnix.io/?src=dnix');
  await expect(page.locator('#pane-auction')).toContainText('# replay: synthetic example. made-up brands, not retailer data');
  for (const id of ['whoami', 'work', 'tools', 'contact']) {
    await expect(page.locator(`#sb-${id}`)).toBeAttached();
  }
});

test('serves the static crawler files', async ({ request }) => {
  for (const [path, marker] of [
    ['/llms.txt', 'Denis Santos'],
    ['/robots.txt', 'Sitemap: https://dnix.io/sitemap.xml'],
    ['/sitemap.xml', '<loc>https://dnix.io/</loc>'],
  ]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(await res.text(), path).toContain(marker);
  }
});

// The crawler surface (llms.txt, JSON-LD) is hand-mirrored from data.js. This
// guards the mirrors against the drift a code review caught once: a
// "Guardians Gamers" typo and an email/name mismatch shipping to crawlers.
test('crawler surface agrees with the rendered site', async ({ page, request }) => {
  await page.goto('/');
  const shelfName = await page.locator('#shelf-title').textContent();
  const headline = await page.locator('h1').innerText();
  const html = await page.content();
  const llms = await (await request.get('/llms.txt')).text();

  // The live product must be named identically across page, llms.txt, JSON-LD.
  expect(shelfName, 'rendered page').toBe('Shelf Report');
  expect(llms, 'llms.txt').toContain('Shelf Report');
  expect(html).toContain('Shelf Report');
  // The headline and the finding say the same thing in both places.
  expect(llms).toContain(headline.replace(/\s+/g, ' ').trim());
  expect(llms).toContain('Coles: 10 of 12 sponsored');
  expect(llms).toContain('Woolworths: 6 of 12 sponsored');
  // The old typo must not resurface anywhere on the crawler surface.
  expect(llms).not.toContain('Guardians Gamers');
  expect(html).not.toContain('Guardians Gamers');

  // One email everywhere, no stale gmail.
  expect(llms).toContain('denis@dnix.io');
  expect(html).toContain('mailto:denis@dnix.io');
  expect(html).not.toContain('deeraison@gmail.com');
});

test('has no horizontal overflow on a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await bootedTerminal(page);
  await page.locator('.tm-win', { hasText: '2:tools' }).click();
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});

// The terminal is a scroll area inside the page. It must hand the wheel on to
// the page once it has nothing left to scroll, or the page below is unreachable.
test('the wheel over the terminal scrolls the page', async ({ page }) => {
  const input = await bootedTerminal(page);
  /** @param {import('@playwright/test').Page} p */
  const wheelOverScreen = async (p) => {
    const box = await p.locator('#screen').boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    // two gestures: Chromium latches one burst to the inner scroller
    for (const pause of [700, 0]) {
      for (let i = 0; i < 6; i++) {
        await p.mouse.wheel(0, 300);
        await p.waitForTimeout(50);
      }
      await p.waitForTimeout(pause);
    }
  };

  await wheelOverScreen(page);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);

  await input.fill('whoami');
  await input.press('Enter');
  await page.evaluate(() => scrollTo(0, 0));
  await wheelOverScreen(page);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

// On the stacked phone layout the windows navigate: they jump to their section
// below and leave the hero, and its email button, alone.
test('phone: windows jump to their section instead of printing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await bootedTerminal(page);
  const enterTop = await page.locator('#enter').evaluate((el) => el.getBoundingClientRect().top + scrollY);

  for (const name of ['work', 'contact']) {
    await page.locator('.tm-win', { hasText: name }).click();
    // at the top of the screen, or as close as the end of the page allows
    await expect.poll(() => page.locator(`#sb-${name}`).evaluate((el) => {
      const atEnd = scrollY >= document.documentElement.scrollHeight - innerHeight - 1;
      return Math.abs(el.getBoundingClientRect().top) < 40 || atEnd;
    })).toBe(true);
    await expect(page.locator('.tm-win.active')).toContainText(name);
  }
  await expect(page.locator('#screen')).not.toContainText('working with me');
  const enterTopAfter = await page.locator('#enter').evaluate((el) => el.getBoundingClientRect().top + scrollY);
  expect(enterTopAfter).toBe(enterTop);
});

test('phone: links are thumb-sized', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await bootedTerminal(page);
  const heights = await page.locator('.tool dd a, .contact a, .shelf-link').evaluateAll(
    (els) => els.map((el) => el.getBoundingClientRect().height),
  );
  expect(heights.length).toBeGreaterThan(0);
  for (const h of heights) {
    expect(h).toBeGreaterThanOrEqual(44);
  }
});
