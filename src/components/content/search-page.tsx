import Link from 'next/link';
import { Breadcrumbs } from '@/components/content/entry-page';
import { FolderList, formatDate } from '@/components/content/entry-list';
import { SearchBox } from '@/components/content/search-box';
import { TagList } from '@/components/content/tag-list';
import type { SearchResult } from '@/lib/search';

/** The results of a blog or docs search, or of picking a tag. */
export function SearchPage({
  result,
  base,
}: {
  result: SearchResult;
  base: '/blog' | '/docs';
}) {
  const isBlog = base === '/blog';
  const index = isBlog ? 'Blog' : 'Docs';
  const noun = isBlog
    ? { one: 'post', many: 'posts' }
    : { one: 'page', many: 'pages' };
  const { query, tag, folder, entries, folders, tags } = result;
  const heading = tag
    ? `${isBlog ? 'Posts' : 'Pages'} tagged ${tag.title}`
    : query
      ? `Results for “${query}”`
      : `Search the ${index.toLowerCase()}`;
  const total = entries.length + folders.length + tags.length;

  return (
    <div className="max-w-layout px-gutter mx-auto flex w-full min-w-0 flex-col gap-8 pt-7 pb-16">
      <div className="flex flex-col gap-4">
        <Breadcrumbs
          crumbs={[
            { label: index, href: base },
            ...(folder
              ? [{ label: folder.name, href: `${base}/${folder.path}` }]
              : []),
          ]}
        />
        <h1 className="text-h1 m-0">{heading}</h1>
        {folder ? (
          <p className="text-lv-text-2 m-0">In {folder.name}.</p>
        ) : null}
        <SearchBox base={base} query={query} folder={folder ?? undefined} />
      </div>

      {query || tag ? (
        <p role="status" className="text-lv-text-2 m-0">
          {total === 0
            ? `Nothing matched. Try other words${folder ? ', or search all of the ' + index.toLowerCase() : ''}.`
            : `${entries.length} ${entries.length === 1 ? noun.one : noun.many} found.`}
        </p>
      ) : null}

      {folders.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 m-0">Folders</h2>
          <FolderList folders={folders} base={base} noun={noun} />
        </section>
      ) : null}

      {tags.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 m-0">Tags</h2>
          <TagList tags={tags} base={base} label="Matching tags" />
        </section>
      ) : null}

      {entries.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {entries.map((entry) => {
            const date = isBlog ? formatDate(entry.publishedAt) : null;
            return (
              <li key={entry.id} className="m-0">
                <Link
                  href={`${base}/${entry.path}`}
                  className="bg-lv-card border-lv-border text-lv-text hover:border-lv-brand rounded-card flex flex-col gap-1.5 border p-5 no-underline"
                >
                  <span className="text-lg font-bold">{entry.title}</span>
                  {date ? (
                    <span className="text-lv-text-3 text-sm">{date}</span>
                  ) : null}
                  {entry.snippet ? (
                    <span className="text-lv-text-2 text-base leading-relaxed">
                      {entry.snippet}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      {folder && total === 0 && query ? (
        <Link
          href={`${base}/search?q=${encodeURIComponent(query)}`}
          className="text-lv-link font-semibold"
        >
          Search all of the {index.toLowerCase()}
        </Link>
      ) : null}
    </div>
  );
}
