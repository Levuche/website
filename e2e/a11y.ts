import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/**
 * Runs axe (WCAG 2.2 A and AA rules) on the page, or on part of it, and
 * fails on serious or critical problems, such as text that is too faint to
 * read or a control with no name.
 */
export async function expectNoA11yViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
  ]);
  // The Buildbase sign-up widget is a third-party component; it is checked
  // on its own, not as part of our pages.
  builder = builder.exclude('.saas-os-ui');
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  const serious = violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({
      rule: v.id,
      help: v.help,
      nodes: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
    }));
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}
