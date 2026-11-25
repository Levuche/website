import type { BlogPost, DocPage } from '@buildbase/sdk/server';
import Link from 'next/link';
import { ArticleHtml } from '@/components/article-html';
import { JsonLd } from '@/components/json-ld';
import { formatDate } from '@/components/content/entry-list';
import { renderMarkdown } from '@/lib/markdown';
import { absoluteUrl, site } from '@/lib/site';

export interface Crumb {
  label: string;
  href: string;
}

/** Links back up the folder tree: the index, then each folder above a page. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="m-0 flex items-center gap-1.5">
            {i > 0 ? (
              <span aria-hidden="true" className="text-lv-text-3">
                /
              </span>
            ) : null}
            <Link href={crumb.href} className="text-lv-link font-semibold">
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** One blog post or doc page: title, date, cover and the Markdown body. */
export function EntryPage({
  item,
  path,
  base,
  crumbs,
}: {
  item: BlogPost | DocPage;
  path: string;
  base: '/blog' | '/docs';
  /** The index and the folders above this page, outermost first. */
  crumbs: Crumb[];
}) {
  const body = renderMarkdown(item.content);
  const date = base === '/blog' ? formatDate(item.publishedAt) : null;
  const image = /^https:\/\//.test(item.image ?? '') ? item.image : null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': base === '/blog' ? 'BlogPosting' : 'TechArticle',
    headline: item.title,
    description: item.description || body.text.slice(0, 160),
    url: absoluteUrl(`${base}/${path}`),
    ...(item.publishedAt ? { datePublished: item.publishedAt } : {}),
    ...(typeof item.updatedAt === 'string'
      ? { dateModified: item.updatedAt }
      : {}),
    ...(image ? { image } : {}),
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: absoluteUrl('/'),
    },
  };

  return (
    <article className="mx-auto flex max-w-[820px] flex-col gap-5 px-[clamp(16px,3vw,32px)] pt-6 pb-14">
      <JsonLd data={jsonLd} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="m-0 text-[clamp(28px,3.5vw,38px)] leading-[1.12] font-bold tracking-[-0.8px]">
        {item.title}
      </h1>
      {date ? <p className="text-lv-text-3 m-0 text-sm">{date}</p> : null}
      {item.description ? (
        <p className="text-lv-text-2 m-0 text-base leading-relaxed">
          {item.description}
        </p>
      ) : null}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="w-full rounded-[20px]"
          loading="lazy"
        />
      ) : null}
      <ArticleHtml html={body.html} />
    </article>
  );
}

/** Crumbs for a page or folder: the index, then the given folders. */
export function folderCrumbs(
  base: '/blog' | '/docs',
  indexLabel: string,
  folders: { name: string; path: string }[]
): Crumb[] {
  return [
    { label: indexLabel, href: base },
    ...folders.map((folder) => ({
      label: folder.name,
      href: `${base}/${folder.path}`,
    })),
  ];
}
