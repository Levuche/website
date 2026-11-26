import type { Metadata } from 'next';
import { RssIcon } from 'lucide-react';
import { EntryList, FolderList } from '@/components/content/entry-list';
import { SiteShell } from '@/components/site-shell';
import { getContentTree } from '@/lib/content';
import { BLOG_FEED, pageMetadata } from '@/lib/metadata';

// Read from Buildbase on each request (cached by the SDK client).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  path: '/blog',
  title: 'Blog',
  image: '/og/blog.png',
  description: 'News, guides and stories from Levuche.',
});

export default async function BlogIndex() {
  // Every published post, newest first, with the blog's folders above them.
  const tree = await getContentTree('blogs');
  const items = tree.all;
  return (
    <SiteShell>
      <div className="max-w-layout px-gutter mx-auto flex flex-col gap-8 pt-7 pb-16">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-h1 m-0">Blog</h1>
          <p className="text-lv-text-2 m-0 text-base leading-relaxed">
            News, guides and stories from Levuche.
          </p>
          {/* A file, not a page: a plain link, so the browser downloads or
              hands it to a feed reader. */}
          <a
            href={BLOG_FEED.url}
            className="text-lv-link text-ui inline-flex w-fit items-center gap-1.5 font-semibold"
          >
            <RssIcon aria-hidden="true" className="size-4" />
            RSS feed
          </a>
        </div>
        {tree.folders.length > 0 ? (
          <FolderList
            folders={tree.folders}
            base="/blog"
            noun={{ one: 'post', many: 'posts' }}
          />
        ) : null}
        {items.length > 0 ? (
          <EntryList items={items} base="/blog" showDate={true} />
        ) : (
          <p className="text-lv-text-2 m-0">No posts yet. Check back soon.</p>
        )}
      </div>
    </SiteShell>
  );
}
