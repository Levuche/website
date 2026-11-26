import { expect, test } from './fixtures';

/*
 * The cookie banner shows while something needs consent: Buildbase web
 * analytics (NEXT_PUBLIC_BUILDBASE_ANALYTICS=on) or a tag attached in the
 * Buildbase console, with sign-in set up. These tests cover web analytics,
 * as on the dev site once it is turned on there; elsewhere they are skipped.
 */
const analyticsOn = process.env.NEXT_PUBLIC_BUILDBASE_ANALYTICS === 'on';
// The banner lives inside the Buildbase provider, which mounts only once the
// org and its sign-in client are set (isAuthConfigured in buildbase-config).
const signInSetUp = Boolean(
  /^[0-9a-f]{24}$/i.test(
    process.env.NEXT_PUBLIC_BUILDBASE_ORG_ID?.trim() ?? ''
  ) && process.env.NEXT_PUBLIC_BUILDBASE_CLIENT_ID?.trim()
);

test.describe('cookie banner', () => {
  test.skip(!analyticsOn, 'Web analytics is off for this build.');
  test.skip(!signInSetUp, 'Buildbase sign-in is not set for this build.');

  test('asks once, remembers the answer and opens again from the footer', async ({
    page,
    context,
  }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Cookie consent' });
    await expect(banner).toBeVisible();
    await expect(
      banner.getByRole('link', { name: /privacy/i })
    ).toHaveAttribute('href', '/privacy');

    await banner.getByRole('button', { name: 'Reject all' }).click();
    await expect(banner).toBeHidden();
    const cookies = await context.cookies();
    expect(cookies.some((c) => c.name === 'bb_consent')).toBe(true);
    expect(cookies.some((c) => c.name === 'bb_vid')).toBe(false);

    // The answer is kept: no banner on the next page.
    await page.goto('/pricing');
    await expect(
      page.getByRole('region', { name: 'Cookie consent' })
    ).toBeHidden();

    // "Cookie settings" in the footer asks again.
    await page
      .getByRole('navigation', { name: 'Footer' })
      .getByRole('button', { name: 'Cookie settings' })
      .click();
    await expect(
      page.getByRole('region', { name: 'Cookie consent' })
    ).toBeVisible();
  });
});

test('no cookie banner while web analytics is off', async ({ page }) => {
  test.skip(analyticsOn && signInSetUp, 'Web analytics is on for this build.');
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Accept all' })).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Cookie settings' })
  ).toHaveCount(0);
});
