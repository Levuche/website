// Cloudflare Workers build config (OpenNext), read by `npm run cf:build`,
// `cf:preview` and `cf:deploy`. Plain `next build` and `next dev` ignore it.
// The marketing pages are prerendered, so the defaults are enough.
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({});
