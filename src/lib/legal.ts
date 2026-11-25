/**
 * The legal and trust pages from the MarketingPages board. Their text is
 * the Buildbase rich content entry `legal-<slug>` (see docs/BUILDBASE.md);
 * a page without one says its text is still being written. The text must be
 * reviewed before launch; nothing in this repository is legal advice.
 */
export type LegalGroup = 'Legal' | 'Trust';

export interface LegalPage {
  slug: string;
  title: string;
  /** Shorter name for the footer and breadcrumbs. */
  group: LegalGroup;
  description: string;
}

export const legalPages: LegalPage[] = [
  {
    slug: 'terms',
    title: 'Terms of service',
    group: 'Legal',
    description: 'The terms for using Levuche, operated by Jagodana LLC.',
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    group: 'Legal',
    description:
      'How Levuche, operated by Jagodana LLC, collects and uses personal data.',
  },
  {
    slug: 'cookies',
    title: 'Cookie policy',
    group: 'Legal',
    description: 'The cookies levuche.com and Levuche sites use.',
  },
  {
    slug: 'pack-terms',
    title: 'Pack terms for buyers',
    group: 'Legal',
    description: 'The terms for people who buy packs on Levuche sites.',
  },
  {
    slug: 'creator-rules',
    title: 'Creator rules',
    group: 'Legal',
    description: 'What creators may and may not sell or publish on Levuche.',
  },
  {
    slug: 'copyright',
    title: 'Copyright and takedowns',
    group: 'Legal',
    description: 'How to report content that infringes your copyright.',
  },
  {
    slug: 'security',
    title: 'Security',
    group: 'Trust',
    description:
      'How Levuche protects accounts and data, and how to report a security issue.',
  },
  {
    slug: 'subprocessors',
    title: 'Subprocessors',
    group: 'Trust',
    description: 'The third-party services that process data for Levuche.',
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}
