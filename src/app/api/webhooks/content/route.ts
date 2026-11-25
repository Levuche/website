import { NextResponse } from 'next/server';
import { createContentWebhookHandler } from '@buildbase/sdk/server';
import { contentClient } from '@/lib/content';

/**
 * Content webhook: an edit in the Buildbase console (a post, doc, FAQ,
 * testimonial, rich content or collection record) arrives here signed, and
 * the handler drops what changed from the content client's cache so the
 * next request reads it fresh. Without the webhook an edit shows within
 * about a minute, when the cached copy goes stale.
 *
 * Register https://levuche.com/api/webhooks/content in the console under
 * Settings, Webhooks, subscribed to the content events, and put its signing
 * secret in BUILDBASE_WEBHOOK_SECRET. A bad signature answers 401; with no
 * secret or no API token the route answers 503.
 */
const secret = process.env.BUILDBASE_WEBHOOK_SECRET?.trim();

const handler =
  secret && contentClient
    ? createContentWebhookHandler({ secret, cache: contentClient.cache })
    : null;

export async function POST(request: Request) {
  if (!handler) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  return handler(request);
}
