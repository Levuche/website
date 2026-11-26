# Buildbase

levuche.com runs on Buildbase (`@buildbase/sdk`) for sign-in, buying the
add-on, the contact form and every piece of editable copy. The site builds
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
| `NEXT_PUBLIC_APP_URL`                | The dashboard: `https://app-dev.levuche.com` for dev, `https://app.levuche.com` (the default) in production    |
| `BUILDBASE_CLIENT_SECRET` (secret)   | The sign-in client's secret                                                                                    |
| `BUILDBASE_API_TOKEN` (secret)       | Settings, API tokens: an app-server token with a content-reader role, `<orgId>:<secret>`                       |
| `BUILDBASE_WEBHOOK_SECRET` (secret)  | The signing secret of the content webhook below                                                                |
| `BUILDBASE_CONTACT_FORM_ID`          | The Contact form's public id                                                                                   |

Secrets go in `.env.local` (git ignores it) and, for Cloudflare, in
`wrangler secret put NAME`. Never in `wrangler.jsonc`, `.env.example` or a
commit.

## What each feature needs

- **Sign in and Get started** (header and home): org id, client id,
  redirect URL and client secret. The routes are `/api/auth/token`,
  `/api/auth/session` and `/api/auth/signout`; the session lives in an
  httpOnly cookie. Both open Buildbase's hosted page, where new creators
  sign up, and come back to `/dashboard`, which sends them on to the app at
  `NEXT_PUBLIC_APP_URL`. Signed in, the header shows **Dashboard**.
  The sign-in is shared with the app: see
  [Shared sign-in with the app](#shared-sign-in-with-the-app).
- **Affiliate links** (`?ref=`): org id. See
  [Affiliate links](#affiliate-links).
- **Contact form** (`/contact`): org id and `BUILDBASE_CONTACT_FORM_ID`. Make
  a public form named Contact with the fields in
  `content/buildbase/forms/contact.json` (`name`, `email`, `message`).
  Spam protection: in **Forms > Spam protection** choose the **Built-in
  check** (a short calculation in the visitor's browser, no third-party
  script or cookie; the Managed and provider widgets don't render on
  levuche.com). Then on the form's **Protect** dialog turn on **Require a
  captcha**, set a link limit (3 is plenty for a contact message), turn on
  **Block throwaway email addresses**, and keep **Hold for review**. The site
  solves the check through `/api/contact/challenge` and sends the answer with
  the message. Turn the captcha on only once this code is deployed in that
  environment, or the form refuses every message.
- **Content**: `BUILDBASE_API_TOKEN`. Edits show within about a minute;
  with the webhook they show on the next request.
- **Content webhook**: register `https://levuche.com/api/webhooks/content`
  under Settings, Webhooks, subscribed to the content events, and set
  `BUILDBASE_WEBHOOK_SECRET`. On Cloudflare each worker instance keeps its
  own cache, so an edit can take up to a minute to reach every visitor.

## Shared sign-in with the app

The website and the Levuche app share one sign-in. `/api/auth/token` sets
the session cookie with `Domain=levuche.com` (`src/lib/session-cookie.ts`),
so it reaches levuche.com, app.levuche.com and every other host under it:
sign in on either and the other shows you signed in; sign out on either and
both sign out. On any other host (localhost, a preview link) the cookie
stays on that host, as before. Creators' storefronts are on levuche.page
and their own domains, so they never receive it.

For the app to read the same sign-in it must:

- read and write the same cookie, with the helpers from `@levuche/kit/server`
  (v0.2.0 or later) that the website uses: `sessionCookieName()`,
  `sessionCookieOptions()` and `expireHostOnlySessionCookie()`. That gives
  `bb-session-id` in production, `bb-session-id-<environment key>` in
  development, httpOnly, `Path=/`, `SameSite=Lax`, `Domain=levuche.com`;
- use the same Buildbase org and environment as the website (production
  with production, development with development);
- have its own sign-in client with its own redirect URLs
  (`https://app.levuche.com`, `https://app-dev.levuche.com`). Buildbase's
  docs don't say whether a session started through one client is accepted
  by another in the same environment, so check it once both are live: sign
  in on the website, open the app, and it should show you signed in.

## Affiliate links

A link with `?ref=<code>` (any page) is turned into a signed referral by
Buildbase's `captureReferral()` (`src/lib/referral.ts`) and kept in this
browser for the program's window; the Buy button sends it with checkout.
Buildbase keeps it in local storage, which only the site that wrote it can
read, so the app cannot see the website's copy. Links into the app carry
the code along instead: **Dashboard**, **Get started** and **Sign in** add
`?ref=<code>`, and `/dashboard` passes it on to the app, which must call
`captureReferral()` on landing too. The parameter, the code check and the
environment id come from `@levuche/kit` (`withReferral()`,
`forwardReferral()`, `buildbaseEnvironmentId()`), which the app uses too.

Nothing is kept until affiliate programs are turned on in the console
(**Billing > Selling > Settings > Affiliates**): an unknown code keeps
nothing. A referral is marketing storage, so before turning programs on,
list `bb_referral:<org id>` on the **Cookies** page. The banner shows its
**Marketing** switch only once an ad pixel is attached (below), so check that
it asks about marketing before affiliates go live.

## Web analytics, goals and the cookie banner

Off until `NEXT_PUBLIC_BUILDBASE_ANALYTICS=on` (the GitHub variable
`BUILDBASE_ANALYTICS` for the deploy and preview workflows). It needs sign-in
set up too, since it runs inside the Buildbase provider. To turn it on:

1. Console, **Settings > Analytics**: under **Domains**, **Track**
   `levuche.com` and `app.levuche.com` in production, and `dev.levuche.com`
   and `app-dev.levuche.com` in development, then turn on **Only listed
   domains**. The visitor and consent cookies (`bb_vid`, `bb_sid`,
   `bb_consent`) are written for all of levuche.com, so someone who moves
   from the website to the app is one visitor with one cookie answer.
2. Update the **Cookies** and **Privacy** docs in the `legal` folder (below),
   in the same environment, so they don't say there is no analytics.
3. Set the variable to `on` and deploy. Check visits arrive as Buildbase's
   _Verify and troubleshoot_ page describes.

With it on, the site shows Buildbase's `CookieBanner` (analytics only, with a
link to `/privacy`) and a **Cookie settings** button in the footer that opens
it again. Visitors are counted with cookies only after they say yes. The
cookies to list on the Cookies page:

| Cookie       | What it does                       | How long            |
| ------------ | ---------------------------------- | ------------------- |
| `bb_vid`     | A random visitor ID, after a yes   | 395 days            |
| `bb_sid`     | A random visit ID, after a yes     | 30 minutes, renewed |
| `bb_consent` | The visitor's answer to the banner | 395 days            |

Goals (`src/lib/goals.ts`), sent only while analytics is on:

| Goal           | When                                   |
| -------------- | -------------------------------------- |
| `get_started`  | A Get started button is pressed        |
| `pricing_view` | The pricing page opens                 |
| `buy_add_on`   | A Buy button for the add-on is pressed |
| `contact_sent` | The contact form sends a message       |

Sign-up, login, checkout and payment are counted by Buildbase itself.

## Ad pixels and other tags

The site loads whatever tags are attached to its sign-in client in the
console, through the provider's `tracking` option. Nothing is set in code or
in environment variables. To add one, for example GA4, Google Ads or the
Meta pixel:

1. Console, **Settings > Tracking & tags**: add the tag with its ID. For
   Google Ads, fill in the conversion labels for sign-up and purchase.
2. **User management > Access > Authentication > Settings**, **Edit** on the
   website's client, **Tracking & tags**: attach it. While you are there, set
   the **Consent** default (denied in the EEA, the UK and Switzerland,
   granted elsewhere is Buildbase's suggestion; the choice is ours).
3. Attach the same Google tags to the app's client too, so a visitor who
   clicks an ad on levuche.com and signs up in the app is one conversion.
4. Update the **Cookies** and **Privacy** docs: name each vendor, and list
   `bb_attr` (ad click IDs and campaign tags, 90 days, kept only after a yes
   to marketing). **Settings > Tracking & tags** writes the vendor paragraph
   for the Privacy doc.
5. On dev.levuche.com, check the tag loads as Buildbase's _Verify and
   troubleshoot_ page describes, and that the browser console reports no
   refused host. The policy there is report-only, so a missing host shows
   without breaking the page; add it in `next.config.ts` before production,
   where the policy is enforced.

The cookie banner asks only about what is on the page: **Analytics** while
web analytics is on or an analytics tag is attached, and **Marketing** once an
ad pixel is. Google's tags load straight away with cookies off; every other
tag waits for a yes. With nothing attached and analytics off, there is no
banner and no **Cookie settings** link.

The Content-Security-Policy (`next.config.ts`) takes the tags' script hosts
from the SDK (`TAG_SCRIPT_ORIGINS`), plus the reporting hosts Buildbase lists
for Google, Meta and X.

## Content model

The slugs are the contract between the console and the code
(`src/lib/content.ts`). A part with nothing in Buildbase is left out of the
page. Seed text from the design boards is in `content/buildbase/`; the home
and pricing pages show it only while `BUILDBASE_API_TOKEN` is unset, so a
preview before setup still matches the boards.

| Where on the site                | Buildbase      | Slug or path                |
| -------------------------------- | -------------- | --------------------------- |
| `/blog`, `/blog/<folder>/<slug>` | Content, Blogs | each post's folder and slug |
| `/docs`, `/docs/<folder>/<slug>` | Content, Docs  | each page's folder and slug |
| Home, Live in three steps        | Collection     | `home-steps`                |
| Home, features                   | Collection     | `home-features`             |
| Home, What creators say          | Testimonials   | all published               |
| Home, Questions                  | FAQ collection | `home-faq`                  |
| Pricing, Questions               | FAQ collection | `pricing-faq`               |
| Legal and trust pages            | Content, Docs  | `legal/<page>`, below       |

The blog and docs follow their folder trees in Buildbase, at any depth. A
folder's address is its parents' slugs and its own (`/docs/guides/setup`),
and a post's is its folder's address and its slug
(`/docs/guides/setup/connect-instagram`). Each folder has its own page that
lists its sub-folders and posts, named as in the console. The docs side
navigation nests the same way. Add, rename or move folders and posts in the
console and the site follows on the next request; only published posts are
shown, and folders with nothing published are left out.

Search: Buildbase has no content search, so the site searches the
published posts itself, from the same cached list reads. The search box on
`/blog`, every docs page and each folder's page goes to `/blog/search` or
`/docs/search` (`?q=` words, `?tag=` a tag's slug, `?in=` a folder's path).
Every word has to appear in a post's title, tags, folder names, description
or text, and titles count most. Matching folders and tags are listed above
the posts. Tags come from Manage tags in Blogs or Docs; public, unarchived
tags show under each post and link to the others that carry them. Result
pages are not indexed by search engines. A folder with the slug `search` at
the top of the blog or docs would be hidden by the search page, so don't
use that slug.

Legal pages are docs in a Docs folder with the slug `legal`, one published
page each, with these slugs: `terms`, `privacy`, `cookies`, `pack-terms`,
`refunds`, `fees`, `creator-rules`, `copyright`, `security`,
`subprocessors`, `accessibility`. Each shows at `/<slug>` (for example `legal/fees` is
`/fees`), and the `legal` folder is left out of `/docs` and the sitemap's
docs. Until a page is published, its page says the text is still being
written and gives the contact address. The page shows the doc's last update
date.

Content blocks (rich content) are for copy the other types don't cover and
that changes often or is shaped per page, such as changelog entries. Use
Blogs, Docs, FAQs, Testimonials or Collections whenever one fits.

Prices are not content: the home pricing card and the pricing page come
from Buildbase Billing, below.

Collections: each record's fields are in `content/buildbase/collections/`.
Records show in their `order`; archived records are hidden. A collection
must have a **published version** before its records can be read.

Rich text, FAQ answers, posts and docs are Markdown, with raw HTML allowed.
The site sanitises it (`src/lib/markdown.ts`): scripts, iframes, styles and
event handlers are removed, and outside links open in a new tab.

## Billing (prices)

Every price on the site comes from Buildbase Billing (`src/lib/billing.ts`),
read from the public routes with only `NEXT_PUBLIC_BUILDBASE_ORG_ID` (and
`NEXT_PUBLIC_BUILDBASE_ENVIRONMENT` outside production). Buildbase caches
them for five minutes. The catalog is changed only by a person in the
console; development is tested against a Stripe sandbox, production uses
live keys.

| Where on the site          | Buildbase Billing                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Pricing cards, home card   | Add-ons on sale, in catalog order (the first on home)                                                                                 |
| Pricing cards, after those | Plans in the pricing group `levuche`, when it exists                                                                                  |
| Compare table              | The group's products (features, limits, quotas), shown with two or more plans                                                         |
| Buy button                 | Buys the add-on (Stripe Checkout), signing in first: for the person, or their current workspace when the add-on is sold to workspaces |

Each Levuche page is a workspace, and one person can run several pages, so
the add-on is sold to workspaces: every page buys its own. A signed-in
person with more than one page picks which page on the card. In Setup,
the workspace model has to let one person have several workspaces.

An add-on card shows its name, its USD price ("$9 once per page"), its badge, and
its description one point per line. The fee per sale and other selling
terms are not on a public route yet, so they go in that description.

Console setup, in order (development first, then production):

1. Billing, Credentials: the Stripe secret key (test key in development),
   then "Create the endpoint for me" for the webhook.
2. Settings, General: billing currency USD.
3. Billing, Product categories, then Products: what the offer grants
   (e.g. `site`, "Your site at yourname.levuche.page").
4. Billing, Add-ons: "Levuche" (slug `levuche`), shape lifetime, bought by
   a workspace, $9 USD one-time, granting `site`; publish it.
5. Only for plans that renew: Billing, Plans, then Pricing groups with
   slug `levuche`, published.

Plans and pricing groups move to production with Environments, Changes
(or `npx @buildbase/sdk env diff/push`); check add-ons there too. With no
org set, `content/buildbase/billing.json` is the sample the page shows.

## Rendering

Pages that show Buildbase content render on each request
(`dynamic = 'force-dynamic'`), so `npm run build` never calls Buildbase and
an edit never waits for a rebuild. The SDK client caches reads in memory.
