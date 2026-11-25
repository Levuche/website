import type { Metadata } from 'next';
import { EntryList } from '@/components/content/entry-list';
import { SiteShell } from '@/components/site-shell';
import { getBlogPosts } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

// Read from Buildbase on each request (cached by the SDK client).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  path: '/blog',
  title: 'Blog',
  description: 'News, guides and stories from Levuche.',
});

export default async function BlogIndex() {
  const items = await getBlogPosts();
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-[1184px] flex-col gap-8 px-[clamp(16px,3vw,32px)] pt-7 pb-16">
        <div className="flex flex-col gap-2.5">
          <h1 className="m-0 text-[clamp(36px,5vw,48px)] leading-[1.05] font-bold tracking-[-1.4px]">
            Blog
          </h1>
          <p className="text-lv-text-2 m-0 text-[17px] leading-relaxed">
            News, guides and stories from Levuche.
          </p>
        </div>
        {items.length > 0 ? (
          <EntryList items={items} base="/blog" showDate={true} />
        ) : (
          <p className="text-lv-text-2 m-0">No posts yet. Check back soon.</p>
        )}
      </div>
    </SiteShell>
  );
}
