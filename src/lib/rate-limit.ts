import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';

/**
 * Per-address limits on the routes that reach Buildbase, using the Workers
 * rate limiting bindings in wrangler.jsonc (CONTACT_LIMITER, AUTH_LIMITER).
 * Counts are kept per Cloudflare location and are approximate, so this
 * slows a burst from one address down; it is not an exact quota. The
 * dashboard rule in docs/DEPLOY.md stops a flood before the Worker runs.
 *
 * Off the Worker (`next start`, the end-to-end tests) there is no binding,
 * so every request is let through. Without a client address there is
 * nothing to count by, so the request is let through too.
 */
type Limiter = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

export type LimiterName = 'CONTACT_LIMITER' | 'AUTH_LIMITER';

function limiter(name: LimiterName): Limiter | null {
  try {
    const env = getCloudflareContext().env as unknown as Record<
      string,
      unknown
    >;
    const binding = env[name] as Limiter | undefined;
    return binding && typeof binding.limit === 'function' ? binding : null;
  } catch {
    return null;
  }
}

/**
 * A 429 answer when this address has gone over `name`'s limit for `scope`
 * (the route), or null to carry on. A failing binding never blocks a
 * visitor.
 */
export async function rateLimited(
  request: Request,
  name: LimiterName,
  scope: string
): Promise<NextResponse | null> {
  const ip = request.headers.get('cf-connecting-ip')?.trim();
  const binding = ip ? limiter(name) : null;
  if (!binding) return null;

  try {
    const { success } = await binding.limit({ key: `${scope}:${ip}` });
    if (success) return null;
  } catch {
    return null;
  }
  return NextResponse.json(
    { error: 'rate_limited' },
    {
      status: 429,
      headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' },
    }
  );
}
