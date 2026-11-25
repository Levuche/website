import { expect, test } from './fixtures';

/*
 * The contact form. /api/contact is intercepted in every test, so nothing
 * reaches Buildbase or anyone's inbox.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/contact');
});

test('needs a name, an email and a message', async ({ page }) => {
  let posted = false;
  await page.route('**/api/contact', (route) => {
    posted = true;
    return route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.getByRole('button', { name: 'Send message' }).click();
  // The browser's own validation stops the form; nothing is posted.
  await expect(page.getByLabel('Name')).toHaveJSProperty(
    'validity.valid',
    false
  );
  expect(posted).toBe(false);
});

test('sends and thanks the visitor', async ({ page }) => {
  let body: Record<string, string> | null = null;
  await page.route('**/api/contact', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.getByLabel('Name').fill('Test Person');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('Hello from the end-to-end tests.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('on its way');
  expect(body).toMatchObject({
    name: 'Test Person',
    email: 'test@example.com',
    message: 'Hello from the end-to-end tests.',
    company: '',
  });
});

test('shows the reason when sending fails', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 429, json: { error: 'rate_limited' } })
  );
  await page.getByLabel('Name').fill('Test Person');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('Hello again.');
  await page.getByRole('button', { name: 'Send message' }).click();
  // Next.js has its own empty role="alert" route announcer, so look for ours.
  await expect(
    page.getByRole('alert').filter({ hasText: 'Too many messages' })
  ).toBeVisible();
  // The message stays in the form so the visitor can try again.
  await expect(page.getByLabel('Message')).toHaveValue('Hello again.');
});
