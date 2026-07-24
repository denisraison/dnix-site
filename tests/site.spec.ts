import { test, expect } from '@playwright/test';

// The boot sequence types `ssh guest@dnix.io` and prints a motd before the
// prompt appears, so "wait for the input" is "wait for boot to finish".
async function bootedTerminal(page) {
  await page.goto('/?view=term');
  const input = page.locator('#cmdline');
  await expect(input).toBeVisible({ timeout: 15000 });
  return input;
}

test('boots through the ssh login into a live prompt', async ({ page }) => {
  const input = await bootedTerminal(page);
  await expect(page.locator('.screen')).toContainText('ssh guest@dnix.io');
  await expect(page.locator('.screen')).toContainText('Last login:');
  await expect(input).toBeFocused();
});

test('runs commands typed at the prompt', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('projects');
  await input.press('Enter');
  const screen = page.locator('.screen');
  await expect(screen).toContainText('gitknown');
  await expect(screen).toContainText('precisioncoatpainting.com.au');
});

test('tab completes command names', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('who');
  await input.press('Tab');
  await expect(input).toHaveValue('whoami');
});

test('tmux windows run their command and take the active mark', async ({ page }) => {
  await bootedTerminal(page);
  await page.locator('.tm-win', { hasText: '2:projects' }).click();
  await expect(page.locator('.screen')).toContainText('selected work');
  await expect(page.locator('.tm-win.active')).toHaveText('2:projects*');
});

test('unknown commands fail politely', async ({ page }) => {
  const input = await bootedTerminal(page);
  await input.pressSequentially('vim');
  await input.press('Enter');
  await expect(page.locator('.screen')).toContainText('command not found: vim');
});

test('exit logs out: collapses the dock, clears, and re-boots on reopen', async ({ page }) => {
  await page.goto('/');
  await page.locator('#dockhandle').click();
  const input = page.locator('#cmdline');
  await expect(input).toBeVisible({ timeout: 15000 });

  await input.pressSequentially('exit');
  await input.press('Enter');
  await expect(page.locator('.screen')).toContainText('Connection to dnix.io closed.');

  // Dock collapses and the screen wipes.
  await expect(page.locator('body')).toHaveClass(/dock-collapsed/);
  await expect(page.locator('.screen')).not.toContainText('Connection to dnix.io closed.');

  // Reopening replays the login on a clean screen.
  await page.locator('#dockhandle').click();
  await expect(page.locator('.screen')).toContainText('ssh guest@dnix.io');
});

test('opens the terminal dock and remembers the choice', async ({ page }) => {
  await page.goto('/');
  // Default: the page is up, the dock is a collapsed strip.
  await expect(page.locator('.site-tagline')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/dock-collapsed/);

  // Clicking the handle expands the dock over the still-visible page.
  await page.locator('#dockhandle').click();
  await expect(page.locator('body')).toHaveClass(/dock-open/);
  await expect(page.locator('.site-tagline')).toBeVisible();

  // The open state persists across a plain visit.
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/dock-open/);

  // But a direct terminal link still takes over the screen (full).
  await page.goto('/?view=term');
  await expect(page.locator('body')).toHaveClass(/dock-full/);
});

// The page is the only crawlable text, so it's always in the DOM. Even in the
// full-screen terminal it's present (visually hidden). Guards the SEO/GEO surface.
test('renders the page content even under the full terminal', async ({ page }) => {
  await page.goto('/?view=term');
  await expect(page.locator('#site .site-lede').first()).toContainText('Denis Santos');
  await expect(page.locator('body')).toHaveClass(/dock-full/);
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
  await page.goto('/?view=term');
  const projectNames = await page.locator('#site .card-name').allTextContents();
  const html = await page.content();
  const llms = await (await request.get('/llms.txt')).text();

  // Both live products must be named identically across page, llms.txt, JSON-LD.
  for (const name of ['Guardian Gamers', 'Precision Coat']) {
    expect(projectNames, 'rendered page').toContain(name);
    expect(llms, 'llms.txt').toContain(name);
  }
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
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
