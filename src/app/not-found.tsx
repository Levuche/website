import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';

export default function NotFound() {
  return (
    <SiteShell>
      <div className="max-w-article px-gutter mx-auto flex flex-col gap-4 py-16">
        <h1 className="text-h1 m-0">Page not found</h1>
        <p className="text-lv-text-2 m-0 text-base">
          That page isn’t here. It may have moved.
        </p>
        <p className="m-0">
          <Link href="/" className="text-lv-link font-semibold">
            Go to the home page
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
