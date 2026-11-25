import { expect, test, type Locator } from '@playwright/test';
import { expectNoA11yViolations } from './a11y';

/*
 * The website's own components (shadcn/ui, in src/components/ui), through the
 * gallery at /ui. Each test runs in the light and the dark panel. The creator
 * page blocks are tested in Levuche/ui.
 */

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/ui');
  expect(response?.status(), 'the gallery should load').toBe(200);
});

for (const mode of ['light', 'dark'] as const) {
  test.describe(`${mode} panel`, () => {
    let panel: Locator;
    test.beforeEach(async ({ page }) => {
      panel = page.getByTestId(`gallery-${mode}`);
      await expect(panel).toHaveAttribute('data-lv', mode);
    });

    test('uses the tokens for its mode', async () => {
      const bg = await panel.evaluate(
        (el) => getComputedStyle(el).backgroundColor
      );
      expect(bg).toBe(
        mode === 'light' ? 'rgb(255, 255, 255)' : 'rgb(13, 14, 38)'
      );
      const primary = panel.getByRole('button', {
        name: 'Primary',
        exact: true,
      });
      const primaryBg = await primary.evaluate(
        (el) => getComputedStyle(el).backgroundColor
      );
      // Navy on light, amber on dark (tokens v1.1).
      expect(primaryBg).toBe(
        mode === 'light' ? 'rgb(36, 37, 122)' : 'rgb(255, 182, 39)'
      );
    });

    test('buttons: disabled, loading and tap size', async () => {
      const buttons = panel.getByTestId('buttons');
      await expect(
        buttons.getByRole('button', { name: 'Disabled' })
      ).toBeDisabled();
      const publish = buttons.getByRole('button', { name: 'Publish' });
      await publish.click();
      const busy = buttons.getByRole('button', { name: 'Publishing' });
      await expect(busy).toHaveAttribute('aria-busy', 'true');
      await expect(busy).toBeDisabled();
      await buttons.getByRole('button', { name: 'Reset' }).click();
      await expect(publish).toBeEnabled();
      // 44 px minimum touch target (Atoms board, WCAG 2.5.8).
      for (const name of ['Primary', 'Secondary', 'Undo']) {
        const box = await buttons
          .getByRole('button', { name, exact: true })
          .boundingBox();
        expect(box?.height ?? 0, name).toBeGreaterThanOrEqual(44);
      }
    });

    test('form field shows its hint, then its error', async () => {
      const handle = panel.getByLabel('Handle');
      const hintId = await handle.getAttribute('aria-describedby');
      expect(hintId).toBeTruthy();
      await expect(handle).not.toHaveAttribute('aria-invalid', 'true');
      await expect(panel.locator(`[id="${hintId}"]`)).toHaveText(
        'Your site: desiorigins.levuche.page'
      );
      await handle.fill('desi origins');
      await expect(handle).toHaveAttribute('aria-invalid', 'true');
      await expect(handle).toHaveAccessibleDescription(
        'Spaces aren’t allowed. Try desi-origins.'
      );
    });

    test('email signup checks the address before sending', async () => {
      const forms = panel.getByTestId('forms');
      const email = forms.getByRole('textbox', { name: 'Email' });
      await email.fill('not-an-email');
      await forms.getByRole('button', { name: 'Join the beta' }).click();
      await expect(email).toHaveJSProperty('validity.valid', false);
      await email.fill('creator@example.com');
      await forms.getByRole('button', { name: 'Join the beta' }).click();
      await expect(forms.getByRole('status')).toHaveText(
        'Signed up creator@example.com'
      );
    });

    test('tabs work with the arrow keys', async () => {
      const tabs = panel.getByRole('tablist', { name: 'Inbox' });
      const contact = tabs.getByRole('tab', { name: /Contact/ });
      const newsletter = tabs.getByRole('tab', { name: /Newsletter/ });
      const waitlist = tabs.getByRole('tab', { name: /Waitlist/ });
      await expect(contact).toHaveAttribute('aria-selected', 'true');
      await expect(panel.getByRole('tabpanel')).toHaveText('Contact messages');

      await contact.focus();
      await contact.press('ArrowRight');
      await expect(newsletter).toBeFocused();
      await expect(newsletter).toHaveAttribute('aria-selected', 'true');
      await expect(panel.getByRole('tabpanel')).toHaveText(
        'Newsletter subscribers'
      );
      await newsletter.press('End');
      await expect(waitlist).toHaveAttribute('aria-selected', 'true');
      await waitlist.press('ArrowRight');
      await expect(contact).toBeFocused();
      // Only the selected tab is in the tab order.
      await expect(newsletter).toHaveAttribute('tabindex', '-1');
    });

    test('segmented control picks one option at a time', async () => {
      const group = panel.getByRole('radiogroup', { name: 'Preview size' });
      const tablet = group.getByRole('radio', { name: 'Tablet' });
      await tablet.click();
      await expect(tablet).toBeChecked();
      await expect(
        group.getByRole('radio', { name: 'Phone' })
      ).not.toBeChecked();
      await expect(panel.getByText('Showing: tablet')).toBeVisible();
      // Pressing the chosen option again keeps it chosen.
      await tablet.click();
      await expect(tablet).toBeChecked();
    });

    test('checkboxes tick from their label', async () => {
      const reels = panel.getByRole('checkbox', { name: 'Show reels' });
      await expect(reels).not.toBeChecked();
      await panel.getByText('Show reels').click();
      await expect(reels).toBeChecked();
      await expect(
        panel.getByRole('checkbox', { name: 'Show prices' })
      ).toBeChecked();
    });

    test('accordion opens and closes from the keyboard', async () => {
      const faq = panel.getByTestId('faq');
      const second = faq.getByText('Can I use my own domain?');
      const answer = faq.getByText('Yes, as an add-on.');
      await expect(faq.getByText('No. $9 once per page.')).toBeVisible();
      await expect(answer).toBeHidden();
      await second.focus();
      await second.press('Enter');
      await expect(answer).toBeVisible();
      await second.press('Enter');
      await expect(answer).toBeHidden();
    });

    test('alerts announce themselves the right way', async () => {
      const alerts = panel.getByTestId('alerts');
      await expect(alerts.getByRole('status')).toHaveCount(2);
      await expect(alerts.getByRole('alert')).toContainText(
        'refund policy is empty'
      );
    });

    test('has no serious accessibility problems', async ({ page }) => {
      await expectNoA11yViolations(page, `[data-testid="gallery-${mode}"]`);
    });
  });
}

test('the page does not scroll sideways on any screen', async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
