import { test as base } from '@playwright/test';

/**
 * The dev site and preview links are behind Cloudflare Access (team sign-in,
 * docs/DEPLOY.md section 10). To test them, set CF_ACCESS_CLIENT_ID and
 * CF_ACCESS_CLIENT_SECRET to an Access service token. The token goes only to
 * the site under test, never to other hosts a page loads.
 */
const id = process.env.CF_ACCESS_CLIENT_ID;
const secret = process.env.CF_ACCESS_CLIENT_SECRET;
const accessHeaders =
  id && secret
    ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret }
    : undefined;

// Playwright calls the fixture callback `use`; it's named `provide` here so the
// React hooks lint rule doesn't mistake it for a hook.
export const test = base.extend({
  page: async ({ page, baseURL }, provide) => {
    if (accessHeaders && baseURL) {
      const origin = new URL(baseURL).origin;
      await page.route(
        (url) => url.origin === origin,
        (route) =>
          route.fallback({
            headers: { ...route.request().headers(), ...accessHeaders },
          })
      );
    }
    await provide(page);
  },
  // For paths on the site under test only.
  request: async ({ playwright, baseURL }, provide) => {
    const request = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: accessHeaders,
    });
    await provide(request);
    await request.dispose();
  },
});

export { expect } from '@playwright/test';
