import type { Metadata } from 'next';
import { DocsNav } from '@/components/content/docs-nav';
import { SiteShell } from '@/components/site-shell';
import { getContentTree } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

// Read from Buildbase on each request (cached by the SDK client).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  path: '/docs',
  title: 'Docs',
  description: 'How to set up and run your Levuche site.',
});

export default async function DocsIndex() {
  const tree = await getContentTree('docs');
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-[1184px] flex-col gap-8 px-[clamp(16px,3vw,32px)] pt-7 pb-16">
        <div className="flex flex-col gap-2.5">
          <h1 className="m-0 text-[clamp(30px,3.5vw,40px)] leading-[1.1] font-bold tracking-[-0.8px]">
            Docs
          </h1>
          <p className="text-lv-text-2 m-0 text-base leading-relaxed">
            How to set up and run your Levuche site.
          </p>
        </div>
        {tree.all.length > 0 ? (
          <div className="max-w-[480px]">
            <DocsNav tree={tree} current="" />
          </div>
        ) : (
          <p className="text-lv-text-2 m-0">
            The docs are being written. Check back soon.
          </p>
        )}
      </div>
    </SiteShell>
  );
}
