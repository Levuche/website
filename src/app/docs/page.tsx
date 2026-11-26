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
  image: '/og/docs.png',
  description: 'How to set up and run your Levuche site.',
});

export default async function DocsIndex() {
  const tree = await getContentTree('docs');
  return (
    <SiteShell>
      <div className="max-w-layout px-gutter mx-auto flex flex-col gap-8 pt-7 pb-16">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-h1 m-0">Docs</h1>
          <p className="text-lv-text-2 m-0 text-base leading-relaxed">
            How to set up and run your Levuche site.
          </p>
        </div>
        {tree.all.length > 0 ? (
          <div className="max-w-narrow">
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
