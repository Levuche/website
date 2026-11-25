import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** Only the production host is indexed; previews and staging send noindex. */
const isIndexable =
  (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://levuche.com').replace(
    /\/+$/,
    ''
  ) === 'https://levuche.com' &&
  process.env.NEXT_PUBLIC_SITE_ENV?.trim() !== 'preview';

const nextConfig: NextConfig = {
  // No `x-powered-by: Next.js` header.
  poweredByHeader: false,
  async headers() {
    return isIndexable
      ? []
      : [
          {
            source: '/:path*',
            headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
          },
        ];
  },
};

export default nextConfig;

// Gives `next dev` the Cloudflare bindings from wrangler.jsonc.
initOpenNextCloudflareForDev();
