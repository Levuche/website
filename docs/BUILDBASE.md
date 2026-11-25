# Buildbase

levuche.com runs on Buildbase (`@buildbase/sdk`) for sign-in, the beta
list, the contact form and every piece of editable copy. The site builds
and runs with none of it configured: each feature switches itself off
until its settings are in `.env.local` (or the host's secrets).

Use two environments: **development** for local work and previews, and
**production** (no environment key) for levuche.com. Each has its own
users, sign-in client and content, so set everything below up in
development first, check it on `npm run dev`, then repeat it in production.

## Settings

| Variable                             | Where it comes from                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BUILDBASE_ORG_ID`       | Console, Settings: the Levuche org id (24 hex characters)                                                      |
| `NEXT_PUBLIC_BUILDBASE_ENVIRONMENT`  | The development environment's key. Empty in production                                                         |
| `NEXT_PUBLIC_BUILDBASE_CLIENT_ID`    | The environment's sign-in client                                                                               |
| `NEXT_PUBLIC_BUILDBASE_REDIRECT_URL` | A redirect URL registered on that client: `http://localhost:3000` locally, `https://levuche.com` in production |
| `NEXT_PUBLIC_BUILDBASE_ANALYTICS`    | `on` to turn on Buildbase web analytics. Off by default                                                        |
| `BUILDBASE_CLIENT_SECRET` (secret)   | The sign-in client's secret                                                                                    |
| `BUILDBASE_API_TOKEN` (secret)       | Settings, API tokens: an app-server token with a content-reader role, `<orgId>:<secret>`                       |
| `BUILDBASE_WEBHOOK_SECRET` (secret)  | The signing secret of the content webhook below                                                                |
| `BUILDBASE_CONTACT_FORM_ID`          | The Contact form's public id                                                                                   |

Secrets go in `.env.local` (git ignores it) and, for Cloudflare, in
`wrangler secret put NAME`. Never in `wrangler.jsonc`, `.env.example` or a
commit.

## What each feature needs

- **Sign in** (header): org id, client id, redirect URL and client secret.
  The routes are `/api/auth/token`, `/api/auth/session` and
  `/api/auth/signout`; the session lives in an httpOnly cookie.
- **Beta sign-up** (home): the same settings. It is the SDK's beta form, so
  sign-ups land in the console's beta list.
- **Contact form** (`/contact`): org id and `BUILDBASE_CONTACT_FORM_ID`. Make
  a public form named Contact with the fields in
  `content/buildbase/forms/contact.json` (`name`, `email`, `message`).
- **Content**: `BUILDBASE_API_TOKEN`. Edits show within about a minute;
  with the webhook they show on the next request.
- **Content webhook**: register `https://levuche.com/api/webhooks/content`
  under Settings, Webhooks, subscribed to the content events, and set
  `BUILDBASE_WEBHOOK_SECRET`. On Cloudflare each worker instance keeps its
  own cache, so an edit can take up to a minute to reach every visitor.

## Content model

The slugs are the contract between the console and the code
(`src/lib/content.ts`). A part with nothing in Buildbase is left out of the
page. Seed text from the design boards is in `content/buildbase/`.

| Where on the site                | Buildbase      | Slug or path                |
| -------------------------------- | -------------- | --------------------------- |
| `/blog`, `/blog/<folder>/<slug>` | Content, Blogs | each post's folder and slug |
| `/docs`, `/docs/<folder>/<slug>` | Content, Docs  | each page's folder and slug |
| Home, Live in three steps        | Collection     | `home-steps`                |
| Home, features                   | Collection     | `home-features`             |
| Home, pricing card               | Rich content   | `home-pricing`              |
| Home, What creators say          | Testimonials   | all published               |
| Home, Questions                  | FAQ collection | `home-faq`                  |
| Pricing, intro line              | Rich content   | `pricing-intro`             |
| Pricing, plans                   | Collection     | `pricing-plans`             |
| Pricing, compare table           | Collection     | `pricing-compare`           |
| Pricing, Questions               | FAQ collection | `pricing-faq`               |
| Legal and trust pages            | Rich content   | `legal-<page>`, below       |

Legal pages: `legal-terms`, `legal-privacy`, `legal-cookies`,
`legal-pack-terms`, `legal-creator-rules`, `legal-copyright`,
`legal-security`, `legal-subprocessors`. Until an entry exists its page
says the text is still being written and gives the contact address. The
page shows the entry's last update date.

Collections: each record's fields are in `content/buildbase/collections/`.
Records show in their `order`; archived records are hidden. A collection
must have a **published version** before its records can be read.

Rich text, FAQ answers, posts and docs are Markdown, with raw HTML allowed.
The site sanitises it (`src/lib/markdown.ts`): scripts, iframes, styles and
event handlers are removed, and outside links open in a new tab.

## Rendering

Pages that show Buildbase content render on each request
(`dynamic = 'force-dynamic'`), so `npm run build` never calls Buildbase and
an edit never waits for a rebuild. The SDK client caches reads in memory.
