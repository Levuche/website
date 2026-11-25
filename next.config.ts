import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** Only the production host is indexed; previews and staging send noindex. */
const isIndexable =
  (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://levuche.com').replace(
    /\/+$/,
    ''
  ) === 'https://levuche.com';

/** The Buildbase API, which the browser calls for sign-in, buying and analytics. */
const buildbaseApi = new URL(
  process.env.NEXT_PUBLIC_BUILDBASE_SERVER_URL?.trim() ||
    'https://api.console.buildbase.app'
).origin;

/**
 * The Content-Security-Policy: only the hosts the site needs. Next.js and
 * next-themes put small scripts and styles inline, so those stay allowed.
 * Blog and docs images come from Buildbase Content, so any https image is
 * allowed. Sign-in and Stripe Checkout are full-page redirects and need no
 * entry. Adding a tracking tag (Settings > Tracking & tags) means adding its
 * hosts here too: Buildbase's "Providers" doc lists them.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${buildbaseApi}`,
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

/**
 * Sent on every response. The dev site, previews and `next dev` send the
 * policy as report-only, so a host it misses shows in the browser console
 * instead of breaking the page; a levuche.com build enforces it.
 */
const enforceCsp = isIndexable && process.env.NODE_ENV === 'production';
const securityHeaders = [
  {
    key: enforceCsp
      ? 'Content-Security-Policy'
      : 'Content-Security-Policy-Report-Only',
    value: contentSecurityPolicy,
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  // No `x-powered-by: Next.js` header.
  poweredByHeader: false,
  // Both packages ship TypeScript source (github.com/Levuche/ui and
  // github.com/Levuche/kit).
  transpilePackages: ['@levuche/ui', '@levuche/kit'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: isIndexable
          ? securityHeaders
          : [
              ...securityHeaders,
              { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
            ],
      },
    ];
  },
};

export default nextConfig;

// Gives `next dev` the Cloudflare bindings from wrangler.jsonc.
initOpenNextCloudflareForDev();
