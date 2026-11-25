import type { BlogPost, DocPage } from '@buildbase/sdk/server';
import Link from 'next/link';
import { ArticleHtml } from '@/components/article-html';
import { JsonLd } from '@/components/json-ld';
import { formatDate } from '@/components/content/entry-list';
import { renderMarkdown } from '@/lib/markdown';
import { absoluteUrl, site } from '@/lib/site';

/** One blog post or doc page: title, date, cover and the Markdown body. */
export function EntryPage({
  item,
  path,
  base,
  backLabel,
}: {
  item: BlogPost | DocPage;
  path: string;
  base: '/blog' | '/docs';
  backLabel: string;
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
    <article className="mx-auto flex max-w-[820px] flex-col gap-5 px-[clamp(16px,3vw,32px)] pt-7 pb-16">
      <JsonLd data={jsonLd} />
      <Link href={base} className="text-lv-link text-sm font-semibold">
        ← {backLabel}
      </Link>
      <h1 className="m-0 text-[clamp(34px,4.5vw,46px)] leading-[1.08] font-bold tracking-[-1.2px]">
        {item.title}
      </h1>
      {date ? <p className="text-lv-text-3 m-0 text-sm">{date}</p> : null}
      {item.description ? (
        <p className="text-lv-text-2 m-0 text-lg leading-relaxed">
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
