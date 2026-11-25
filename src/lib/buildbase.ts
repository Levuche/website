// Server-side Buildbase client, as `npx @buildbase/sdk init` writes it.
// Import from here in route handlers and server components only.
import BuildBase from '@buildbase/sdk';
import { sessionCookieName } from '@levuche/kit/server';
import { cookies } from 'next/headers';
import { buildbase } from '@/lib/buildbase-config';

// The cookie that carries the signed-in visitor's session id, named by
// @levuche/kit as the Levuche app names it. A development environment has
// its own, so a development and a production build don't read each other's
// session.
export const SESSION_COOKIE_NAME = sessionCookieName(buildbase.environment);

export const { exchangeCode } = BuildBase({
  serverUrl: buildbase.serverUrl,
  // Empty until .env.local is filled in: `next build` still succeeds, and the
  // first call throws an error that names NEXT_PUBLIC_BUILDBASE_ORG_ID.
  orgId: buildbase.orgId,
  environment: buildbase.environment,
  getSessionId: async () => {
    const c = await cookies();
    return c.get(SESSION_COOKIE_NAME)?.value ?? null;
  },
});
