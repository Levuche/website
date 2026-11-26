import { expect, test } from './fixtures';
import { expectNoA11yViolations } from './a11y';
import { legalPages } from '../src/lib/legal';

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
    // Every "Get started" opens sign-up and lands in the dashboard; the old
    // beta form is gone.
    const getStarted = page.getByRole('link', { name: 'Get started' });
    await expect(getStarted.first()).toBeVisible();
    for (const link of await getStarted.all()) {
      await expect(link).toHaveAttribute('href', '/dashboard');
    }
    await expect(page.getByRole('link', { name: /beta/i })).toHaveCount(0);
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

test('/dashboard sends people on to the Levuche app', async ({ request }) => {
  const response = await request.get('/dashboard', { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers()['location']).toMatch(
    /^https:\/\/app(-dev)?\.levuche\.com\/?$/
  );
});

test('/dashboard passes an affiliate code on to the app', async ({
  request,
}) => {
  const kept = await request.get('/dashboard?ref=MAYA_1', { maxRedirects: 0 });
  expect(kept.status()).toBe(307);
  const target = new URL(kept.headers()['location']);
  expect(target.hostname).toMatch(/^app(-dev)?\.levuche\.com$/);
  expect(target.searchParams.get('ref')).toBe('MAYA_1');

  // Anything that is not an affiliate code is dropped.
  const dropped = await request.get('/dashboard?ref=%3Cx%3E', {
    maxRedirects: 0,
  });
  expect(dropped.headers()['location']).toMatch(
    /^https:\/\/app(-dev)?\.levuche\.com\/?$/
  );
});

test('signing out clears a cookie for this host only off levuche.com', async ({
  request,
  baseURL,
}) => {
  const response = await request.post('/api/auth/signout', {
    headers: {
      'Content-Type': 'application/json',
      Origin: new URL(baseURL!).origin,
    },
    data: {},
  });
  expect(response.status()).toBe(200);
  const cookies = response
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => h.value);
  expect(cookies.some((c) => /^bb-session-id[^=]*=;/.test(c))).toBe(true);
  for (const cookie of cookies) {
    expect(cookie).toMatch(/Max-Age=0/i);
    // levuche.com hosts share it; a test host keeps its own.
    const host = new URL(baseURL!).hostname;
    if (host !== 'levuche.com' && !host.endsWith('.levuche.com')) {
      expect(cookie).not.toMatch(/Domain=/i);
    }
  }
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

test('pages send the security headers', async ({ request }) => {
  for (const path of ['/', '/pricing', '/contact']) {
    const headers = (await request.get(path)).headers();
    // Enforced on levuche.com, report-only on the dev site and previews.
    const csp =
      headers['content-security-policy'] ??
      headers['content-security-policy-report-only'];
    expect(csp, path).toContain("default-src 'self'");
    expect(csp, path).toContain("frame-ancestors 'none'");
    expect(csp, path).toContain("object-src 'none'");
    // The hosts of the tags attached in the Buildbase console.
    expect(csp, path).toContain('https://www.googletagmanager.com');
    expect(csp, path).toContain('https://connect.facebook.net');
    expect(headers['strict-transport-security'], path).toContain('max-age=');
    expect(headers['x-content-type-options'], path).toBe('nosniff');
    expect(headers['x-frame-options'], path).toBe('DENY');
    expect(headers['referrer-policy'], path).toBe(
      'strict-origin-when-cross-origin'
    );
    expect(headers['permissions-policy'], path).toContain('camera=()');
  }
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

test('each page has its own share image', async ({ page, request }) => {
  const pages = {
    '/': '/og.png',
    '/pricing': '/og/pricing.png',
    '/blog': '/og/blog.png',
    '/docs': '/og/docs.png',
    '/contact': '/og/contact.png',
    '/terms': '/og/terms.png',
  };
  for (const [path, image] of Object.entries(pages)) {
    await page.goto(path);
    const og = page.locator('meta[property="og:image"]').first();
    await expect(og, path).toHaveAttribute('content', new RegExp(`${image}$`));
    const twitter = page.locator('meta[name="twitter:image"]').first();
    await expect(twitter, path).toHaveAttribute(
      'content',
      new RegExp(`${image}$`)
    );
    const file = await request.get(image);
    expect(file.status(), image).toBe(200);
    expect(file.headers()['content-type'], image).toBe('image/png');
  }
});

test('every legal and trust page has a share image', async ({ request }) => {
  for (const { slug } of legalPages) {
    const file = await request.get(`/og/${slug}.png`);
    expect(file.status(), slug).toBe(200);
  }
});

test('the blog has an RSS feed, linked from every page', async ({
  page,
  request,
}) => {
  const feed = await request.get('/blog/rss.xml');
  expect(feed.status()).toBe(200);
  expect(feed.headers()['content-type']).toContain('application/rss+xml');
  const xml = await feed.text();
  expect(xml).toContain('<rss version="2.0"');
  expect(xml).toContain('<channel>');
  expect(xml).toMatch(/<link>[^<]*\/blog<\/link>/);

  for (const path of ['/', '/blog']) {
    await page.goto(path);
    await expect(
      page.locator('link[rel="alternate"][type="application/rss+xml"]'),
      path
    ).toHaveAttribute('href', /\/blog\/rss\.xml$/);
  }
  await page.goto('/blog');
  await expect(page.getByRole('link', { name: 'RSS feed' })).toHaveAttribute(
    'href',
    '/blog/rss.xml'
  );
});
