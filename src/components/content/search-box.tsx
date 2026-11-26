import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MAX_QUERY } from '@/lib/search';

/**
 * The blog's or the docs' search box: a plain GET form to /blog/search or
 * /docs/search, so it works before any script loads. On a folder's page it
 * searches that folder (the `in` field).
 */
export function SearchBox({
  base,
  query = '',
  folder,
  className,
}: {
  base: '/blog' | '/docs';
  query?: string;
  /** A folder's path, to search only that folder. */
  folder?: { path: string; name: string };
  className?: string;
}) {
  const label = folder
    ? `Search ${folder.name}`
    : base === '/blog'
      ? 'Search the blog'
      : 'Search the docs';
  const id = `search-${base.slice(1)}${folder ? '-folder' : ''}`;
  return (
    <form
      role="search"
      action={`${base}/search`}
      method="get"
      className={className}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex w-full max-w-xl items-center gap-2">
        <Input
          id={id}
          name="q"
          type="search"
          defaultValue={query}
          placeholder={label}
          maxLength={MAX_QUERY}
          autoComplete="off"
          enterKeyHint="search"
        />
        {folder ? <input type="hidden" name="in" value={folder.path} /> : null}
        <Button type="submit" size="icon" aria-label="Search">
          <SearchIcon aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
