import { forwardForm, refuseCrossSitePost } from '@levuche/kit/server';
import { buildbase } from '@/lib/buildbase-config';
import { rateLimited } from '@/lib/rate-limit';

/**
 * The contact form, sent to a form built in the Buildbase console (Content,
 * Forms) through the form's public submit endpoint, so every message lands
 * in Buildbase. The form's public id is BUILDBASE_CONTACT_FORM_ID; its
 * fields must be named `name`, `email` and `message` (docs/BUILDBASE.md).
 *
 * The browser never talks to Buildbase directly. `forwardForm` from
 * @levuche/kit, which the Levuche app uses for its forms too, checks the
 * request comes from this site, drops bot submissions (the hidden `company`
 * field) and caps each field's length before forwarding. When the form has
 * Buildbase's built-in spam check on, the browser solves it first
 * (/api/contact/challenge) and the answer goes on as `_captcha`. Each
 * address can send a few messages a minute (src/lib/rate-limit.ts).
 */
export async function POST(request: Request) {
  // Before the rate limit, so a post from another site never uses up a
  // visitor's allowance. forwardForm checks again; it's cheap.
  const refused = refuseCrossSitePost(request);
  if (refused) return refused;
  const limited = await rateLimited(request, 'CONTACT_LIMITER', 'contact');
  if (limited) return limited;

  return forwardForm(request, {
    serverUrl: buildbase.serverUrl,
    orgId: buildbase.orgId,
    environment: buildbase.environment,
    formId: process.env.BUILDBASE_CONTACT_FORM_ID,
    fields: {
      name: { max: 200, required: true },
      email: { max: 320, required: true, email: true },
      message: { max: 5000, required: true },
    },
  });
}
