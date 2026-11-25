import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-[720px] flex-col gap-4 px-[clamp(16px,3vw,32px)] py-24">
        <h1 className="m-0 text-[clamp(34px,5vw,48px)] font-bold tracking-[-1.2px]">
          Page not found
        </h1>
        <p className="text-lv-text-2 m-0 text-lg">
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
