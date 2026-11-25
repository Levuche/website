import {
  createServerClient,
  type BlogPost,
  type DocPage,
  type Faq,
  type RichContent,
  type Testimonial,
} from '@buildbase/sdk/server';
import { buildbase } from '@/lib/buildbase-config';

/**
 * Every piece of editable copy on levuche.com comes from Buildbase:
 *
 * - Blog posts and docs pages: Content, Blogs and Docs.
 * - FAQs: Content, FAQs, one collection per page.
 * - Testimonials: Content, Testimonials.
 * - Legal and trust pages: Content, Rich content, one entry per page.
 * - Lists the CMS has no type for (home steps and features, pricing plans
 *   and the compare table): Content, Collections.
 *
 * The slugs below are the contract with the console; docs/BUILDBASE.md
 * lists every one with its fields. Reads use the org API token on the
 * server only (BUILDBASE_API_TOKEN, content-reader role). Without a token,
 * or when an entry is missing, a reader returns null or an empty list and
 * the page leaves that part out instead of failing.
 */
export const CONTENT = {
  faqs: { home: 'home-faq', pricing: 'pricing-faq' },
  collections: {
    homeSteps: 'home-steps',
    homeFeatures: 'home-features',
    pricingPlans: 'pricing-plans',
    pricingCompare: 'pricing-compare',
  },
  rich: { homePricing: 'home-pricing', pricingIntro: 'pricing-intro' },
  /** Rich content slug for a legal or trust page: `legal-<page slug>`. */
  legal: (slug: string) => `legal-${slug}`,
} as const;

const apiToken = process.env.BUILDBASE_API_TOKEN?.trim() ?? '';

// Built once per server instance, so its in-memory cache is shared by every
// request that instance serves. The content webhook (/api/webhooks/content)
// drops entries when something is edited in the console.
const client = apiToken.includes(':')
  ? createServerClient({
      serverUrl: buildbase.serverUrl,
      apiToken,
      source: 'levuche-website',
    })
  : null;

export const contentClient = client;

async function read<T>(
  what: string,
  fn: (c: NonNullable<typeof client>) => Promise<T>
) {
  if (!client) return null;
  try {
    return await fn(client);
  } catch (error) {
    console.warn(
      `Buildbase content: ${what} unavailable:`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export async function getRichContent(
  slug: string
): Promise<RichContent | null> {
  const entry = await read(`rich content ${slug}`, (c) =>
    c.richContent.get(slug)
  );
  return entry && !entry.archived ? entry : null;
}

export async function getFaqs(collection: string): Promise<Faq[]> {
  const faqs = await read(`faqs ${collection}`, (c) =>
    c.faqs.questions(collection)
  );
  return (faqs ?? []).filter((f) => !f.archived);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const page = await read('testimonials', (c) =>
    c.testimonials.list({ limit: 50 })
  );
  return (page?.docs ?? []).filter((t) => t.published !== false && !t.archived);
}

/** A collection's live records, archived ones dropped, sorted by `order`. */
export async function getCollection<T extends Record<string, unknown>>(
  slug: string
): Promise<T[]> {
  const records = await read(`collection ${slug}`, (c) =>
    c.collections.data<T>(slug)
  );
  return (records ?? [])
    .filter((r) => !r.archived)
    .map((r) => r.data)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const page = await read('blog posts', (c) =>
    c.blogs.list({ limit: 100, sort: { publishedAt: -1 } })
  );
  return page?.docs ?? [];
}

export async function getDocPages(): Promise<DocPage[]> {
  const page = await read('docs', (c) =>
    c.docs.list({ limit: 100, sort: { title: 1 } })
  );
  return page?.docs ?? [];
}

/** A blog post's or doc's path under /blog or /docs: its folder, then its slug. */
export function contentPath(item: BlogPost | DocPage): string {
  const folder =
    item.folder && typeof item.folder === 'object'
      ? item.folder.path || item.folder.slug
      : '';
  return [folder, item.slug]
    .filter(Boolean)
    .join('/')
    .replace(/^\/+|\/+$/g, '');
}

/**
 * One published blog post or doc by its path on this site. Tries Buildbase's
 * own path lookup first, then the slug alone (for a post filed in a folder
 * whose path the list didn't expand).
 */
export async function getEntry(
  kind: 'blogs' | 'docs',
  path: string
): Promise<BlogPost | DocPage | null> {
  const found = await read(`${kind} ${path}`, (c) => c[kind].byPath(path));
  if (found?.published) return found;
  const slug = path.split('/').pop();
  const all = kind === 'blogs' ? await getBlogPosts() : await getDocPages();
  return all.find((item) => item.slug === slug && item.published) ?? null;
}

export interface DocGroup {
  /** The folder's name, or null for pages not in a folder. */
  name: string | null;
  pages: { title: string; path: string }[];
}

/**
 * Docs grouped by folder, for the docs index and side navigation. Pages
 * outside a folder come first; folders follow in name order, and pages in
 * each keep the list's title order.
 */
export function groupDocs(docs: DocPage[]): DocGroup[] {
  const groups = new Map<string, DocGroup>();
  for (const doc of docs) {
    const folder =
      doc.folder && typeof doc.folder === 'object' ? doc.folder : null;
    const name = folder?.name?.trim() || null;
    const key = name ?? '';
    const group = groups.get(key) ?? { name, pages: [] };
    group.pages.push({ title: doc.title, path: contentPath(doc) });
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) =>
    a.name === null ? -1 : b.name === null ? 1 : a.name.localeCompare(b.name)
  );
}
