import Link from 'next/link';
import type { TagLink } from '@/lib/content';

/** Tags as links to the posts that carry them (`<base>/search?tag=<slug>`). */
export function TagList({
  tags,
  base,
  label = 'Tags',
}: {
  tags: TagLink[];
  base: '/blog' | '/docs';
  label?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label={label} className="m-0 flex list-none flex-wrap gap-2 p-0">
      {tags.map((tag) => (
        <li key={tag.id} className="m-0">
          <Link
            href={`${base}/search?tag=${encodeURIComponent(tag.slug)}`}
            className="bg-lv-surface-2 text-lv-text-2 hover:text-lv-text inline-flex rounded-full px-3 py-1 text-sm font-semibold no-underline"
          >
            #{tag.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
