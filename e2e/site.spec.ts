import { expect, test } from './fixtures';
import { expectNoA11yViolations } from './a11y';

/*
 * The marketing pages. Content comes from Buildbase where it is set up, so
 * these check the page structure, not the copy that editors change.
 */

test.describe('home page', () => {
  test('shows the hero, the header and the closing call to action', async ({
    page,
  }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: /link in bio/i })
    ).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(
      page.getByRole('figure', { name: 'Example creator site on Levuche' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Get early access' })
    ).toHaveAttribute('href', '/#beta');
    // Only one h1: the creator name in the phone preview is not a heading.
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('has no serious accessibility problems, light and dark', async ({
    page,
  }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute(
        'data-lv',
        colorScheme
      );
      await expectNoA11yViolations(page);
    }
  });
});

test('header link opens the pricing page', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Same link on phones; covered on desktop.');
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Pricing' })
    .click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('footer links lead to real pages', async ({ page, request }) => {
  await page.goto('/');
  const footer = page.getByRole('navigation', { name: 'Footer' });
  const hrefs = await footer
    .getByRole('link')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
  expect(hrefs.length).toBeGreaterThan(3);
  for (const href of hrefs) {
    // Paths on this site go through `request`, which can pass the team
    // sign-in; other sites never get its token.
    const response = href.startsWith('/')
      ? await request.get(href)
      : await page.request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test('legal page renders with its own heading', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('unknown address shows the not-found page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Page not found' })
  ).toBeVisible();
});

test('robots.txt and the sitemap answer', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  // levuche.com has a sitemap; the dev site and preview links block every
  // crawler and have none.
  const isPrivate = /disallow:\s*\/\s*$/im.test(await robots.text());
  expect((await request.get('/sitemap.xml')).status()).toBe(
    isPrivate ? 404 : 200
  );
});

test.describe('every page fits phone, tablet and desktop screens', () => {
  const widths = [
    { name: 'phone', width: 390, height: 844 },
    { name: 'tablet', width: 820, height: 1180 },
    { name: 'desktop', width: 1440, height: 900 },
  ];
  const pages = ['/', '/pricing', '/blog', '/docs', '/contact', '/terms'];

  for (const { name, width, height } of widths) {
    test(`no page scrolls sideways at ${name} width`, async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, 'Widths are set here; one run is enough.');
      await page.setViewportSize({ width, height });
      for (const path of pages) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        );
        expect(
          overflow,
          `${path} is wider than the screen`
        ).toBeLessThanOrEqual(0);
      }
    });
  }
});
