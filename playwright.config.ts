import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests (e2e/). Two ways to run them:
 *
 * - Against a local production build: `npm run build`, then `npm run e2e`.
 *   Playwright starts `next start` on port 3100 itself.
 * - Against a deployed site, such as a pull request's preview link:
 *   `E2E_BASE_URL=https://pr-12-levuche-com-dev.levuche-com.workers.dev npm run e2e`.
 *   Nothing is started locally then.
 *
 * Tests never send real messages or sign-ups: form posts are intercepted.
 */
const baseURL = process.env.E2E_BASE_URL?.replace(/\/+$/, '');
const port = 3100;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 30_000,
  use: {
    baseURL: baseURL ?? `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: baseURL
    ? undefined
    : {
        command: `npx next start -p ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
