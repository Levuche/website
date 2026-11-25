import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleHtml } from '@/components/article-html';
import { contact } from '@/lib/contact';
import { getLegalDoc } from '@/lib/content';
import { getLegalPage } from '@/lib/legal';
import { renderMarkdown } from '@/lib/markdown';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

// The text comes from Buildbase on each request (cached by the SDK client
// and cleared by the content webhook), so a build never calls Buildbase.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getLegalPage((await params).slug);
  if (!page) return {};
  return pageMetadata({
    path: `/${page.slug}`,
    title: page.title,
    description: page.description,
  });
}

function formatDate(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      });
}

/**
 * One legal or trust page. Its text is the published Buildbase doc
 * `legal/<slug>` (Content, Docs, Markdown). Until that doc is published the
 * page says the text is being written and gives the contact address.
 */
export default async function LegalPage({ params }: Props) {
  const page = getLegalPage((await params).slug);
  if (!page) notFound();

  const entry = await getLegalDoc(page.slug);
  const body = entry ? renderMarkdown(entry.content) : null;
  const updated = formatDate(entry?.updatedAt);

  const address =
    page.slug === 'privacy'
      ? contact.privacy
      : page.slug === 'security'
        ? contact.security
        : contact.general;

  return (
    <article className="max-w-measure flex flex-col gap-[18px]">
      <p className="text-lv-text-3 m-0 text-sm">
        {page.group} / {page.title}
      </p>
      <h1 className="m-0 text-[clamp(28px,3.5vw,38px)] leading-[1.12] font-bold tracking-[-0.8px]">
        {entry?.title || page.title}
      </h1>
      {updated ? (
        <p className="text-lv-text-2 m-0 text-sm">Last updated {updated}</p>
      ) : null}
      <p className="text-lv-text-2 m-0 text-base leading-[1.7]">
        Levuche is operated by{' '}
        <a href={site.owner.url} className="text-lv-link">
          {site.owner.name}
        </a>
        .
      </p>

      {body?.html ? (
        <ArticleHtml html={body.html} />
      ) : (
        <p
          role="note"
          className="bg-lv-accent-soft text-lv-on-accent-soft m-0 rounded-xl px-4 py-3 text-sm font-semibold"
        >
          This page is still being written. Until it is published, write to{' '}
          <a href={`mailto:${address}`} className="underline">
            {address}
          </a>{' '}
          with any question about it.
        </p>
      )}

      <h2
        id="contact"
        className="mt-2.5 mb-0 scroll-mt-4 text-xl font-bold tracking-[-0.3px]"
      >
        Contact
      </h2>
      <p className="text-lv-text-2 m-0 text-base leading-[1.7]">
        <a href={`mailto:${address}`} className="text-lv-link">
          {address}
        </a>
        . {site.owner.name}, {site.owner.address}.
      </p>
    </article>
  );
}
