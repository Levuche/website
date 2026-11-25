# Deploying to Cloudflare

levuche.com runs on Cloudflare Workers, built with OpenNext. Cloudflare's
Git integration (Workers Builds) builds every push. `main` deploys to
production and every other branch gets its own preview URL. This page covers
the one-time setup, the domains, the previews and the secrets.

Nothing secret goes in the repo. Build variables and secrets live in the
Cloudflare dashboard (or are set with Wrangler from your own computer).

## Domain plan

| Address                                          | Serves                               | Set up                                        |
| ------------------------------------------------ | ------------------------------------ | --------------------------------------------- |
| `levuche.com`                                    | This site (Worker `levuche-website`) | Custom domain, from `wrangler.jsonc`          |
| `www.levuche.com`                                | 301 to `levuche.com`                 | Redirect rule (step 6)                        |
| `<branch>-levuche-website.<account>.workers.dev` | Branch previews of this site         | Automatic once preview builds are on          |
| `app.levuche.com` (suggested)                    | The Levuche app, once it exists      | Its own Worker with a custom domain (step 9)  |
| `<name>.levuche.page`                            | Creator storefronts, once they exist | Wildcard DNS and a Worker route (step 9)      |
| A creator's own domain                           | Their storefront                     | Cloudflare for SaaS custom hostnames (step 9) |

Only `levuche.com` is indexed. Every preview build sends `noindex`, and
workers.dev previews also get `X-Robots-Tag: noindex` from Cloudflare.

## 1. Put both domains on Cloudflare

1. In the Cloudflare dashboard, add `levuche.com` and `levuche.page` as
   domains (zones) on the account that will own the site.
2. Before you change nameservers, check that Cloudflare copied every existing
   DNS record, above all the mail records (MX, SPF, DKIM, DMARC) for
   `hello@levuche.com`. Mail records stay DNS-only (grey cloud).
3. At the registrar, switch each domain to the two nameservers Cloudflare
   shows. Wait until the zone reads **Active**.

`wrangler.jsonc` attaches `levuche.com` to the Worker on every production
deploy, so the `levuche.com` zone has to be active on the same account before
the site branch is merged into `main`.

## 2. Connect the repository

1. Go to **Workers & Pages** > **Create** > **Import a repository**, and pick
   GitHub `Levuche/website`. Allow the Cloudflare GitHub app on that repo when
   asked.
2. Fill in:

   | Setting           | Value                                                     |
   | ----------------- | --------------------------------------------------------- |
   | Project name      | `levuche-website` (must match `name` in `wrangler.jsonc`) |
   | Production branch | `main`                                                    |
   | Build command     | `npm run cf:build`                                        |
   | Deploy command    | `npx opennextjs-cloudflare deploy`                        |
   | Root directory    | leave empty                                               |

3. Save and deploy. The first production build is `main`, which still holds
   only the scaffold until the site branch is merged. It goes live on the
   Worker's workers.dev address only, not on `levuche.com` yet.

## 3. Turn on preview builds

1. Open the Worker > **Settings** > **Build** > **Branch control**, and tick
   **Enable Preview Builds**.
2. Leave **Preview command** as `npx wrangler preview`.
3. Each push to a branch other than `main` now builds a preview. Cloudflare
   posts the preview URL on the pull request. For the `site-pages` branch it
   looks like `site-pages-levuche-website.<account>.workers.dev`, and it stays
   the same across pushes.

A branch gets its first preview on its next push after this is turned on.

## 4. Build variables

`NEXT_PUBLIC_*` values are baked into the build, and Workers Builds gives
every branch the same build variables. So `scripts/cf-build.mjs` does this:
on any branch other than `main`, a variable named `PREVIEW_<NAME>` replaces
`<NAME>`, and the build is marked as a preview (noindex).

Set these under **Settings** > **Build** > **Variables and secrets**. None of
them is secret.

| Variable                             | Production value             | Preview variable and value                                                      |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | `https://levuche.com`        | `PREVIEW_NEXT_PUBLIC_SITE_URL` = the preview URL from step 3                    |
| `NEXT_PUBLIC_BUILDBASE_ORG_ID`       | Levuche org id               | not needed (same org)                                                           |
| `NEXT_PUBLIC_BUILDBASE_ENVIRONMENT`  | leave unset                  | `PREVIEW_NEXT_PUBLIC_BUILDBASE_ENVIRONMENT` = the development environment's key |
| `NEXT_PUBLIC_BUILDBASE_CLIENT_ID`    | production sign-in client id | `PREVIEW_NEXT_PUBLIC_BUILDBASE_CLIENT_ID` = development sign-in client id       |
| `NEXT_PUBLIC_BUILDBASE_REDIRECT_URL` | `https://levuche.com`        | `PREVIEW_NEXT_PUBLIC_BUILDBASE_REDIRECT_URL` = the preview URL                  |
| `NEXT_PUBLIC_BUILDBASE_ANALYTICS`    | `on` when wanted             | optional                                                                        |

Contact addresses (`NEXT_PUBLIC_CONTACT_EMAIL` and the others) default to
`hello@levuche.com` and need no variable.

## 5. Runtime secrets

These four are read on each request and must never be in the repo. Add each as
type **Secret**.

| Secret                      | What it is                                       |
| --------------------------- | ------------------------------------------------ |
| `BUILDBASE_API_TOKEN`       | Content-reader org API token, `<orgId>:<secret>` |
| `BUILDBASE_CLIENT_SECRET`   | The sign-in client's secret                      |
| `BUILDBASE_WEBHOOK_SECRET`  | The content webhook's signing secret             |
| `BUILDBASE_CONTACT_FORM_ID` | The Contact form's public id                     |

**Production:** the Worker > **Settings** > **Variables and Secrets** > **Add**,
or from your computer in the repo folder:

```sh
npx wrangler secret put BUILDBASE_API_TOKEN
```

**Previews** use the Buildbase development environment's values, set with
Wrangler. Base secrets reach new previews only, so for a preview that already
exists, also set it on that preview by name:

```sh
npx wrangler preview base-config secret put BUILDBASE_API_TOKEN
npx wrangler preview secret put BUILDBASE_API_TOKEN --name site-pages
```

Repeat for each of the four. Wrangler asks for the value, so it never lands in
your shell history. Run `npx wrangler login` once first.

Until a value is set, the matching part of the site switches itself off: no
sign-in, no content from Buildbase (previews show the sample content in
`content/buildbase`), and the contact form says it isn't open yet.

## 6. levuche.com and www

1. Merge the site branch into `main`. The production deploy attaches
   `levuche.com` as a custom domain from `wrangler.jsonc` and creates its DNS
   record. If the build log says it couldn't, add it by hand: the Worker >
   **Settings** > **Domains & Routes** > **Add** > **Custom Domain** >
   `levuche.com`.
2. For `www`, add a DNS record in the `levuche.com` zone: type `AAAA`, name
   `www`, content `100::`, proxied (orange cloud).
3. **Rules** > **Redirect Rules** > create from the template **Redirect from
   WWW to root**, status `301`, keeping the path and query string.
4. Check `https://levuche.com/robots.txt` and
   `https://levuche.com/sitemap.xml`, then add the site in Google Search
   Console and Bing Webmaster Tools (rollout checklist).

## 7. Buildbase addresses

Each Buildbase environment needs the site's addresses:

| Setting in Buildbase        | production                                 | development                                 |
| --------------------------- | ------------------------------------------ | ------------------------------------------- |
| Sign-in client redirect URL | `https://levuche.com`                      | `http://localhost:3000` and the preview URL |
| Content webhook URL         | `https://levuche.com/api/webhooks/content` | `<preview URL>/api/webhooks/content`        |

## 8. Deploying by hand (optional)

From your own computer, with `.env.local` filled in for the target:

```sh
npx wrangler login
npm run cf:deploy
```

Workers Builds is the better route: a local build picks up `.env.local`, which
may not match production.

## 9. Later: the app and creator storefronts

These are for when the app and storefronts exist. This repo doesn't serve
them.

- **The app:** give it its own Worker and attach `app.levuche.com` as a custom
  domain, as in step 6. Add `https://app.levuche.com` to the production
  sign-in client's redirect URLs.
- **`<name>.levuche.page`:** in the `levuche.page` zone, add a proxied
  wildcard DNS record (`AAAA`, name `*`, content `100::`), then a Worker route
  `*.levuche.page/*` on the storefront Worker. Custom domains can't take
  wildcards, so this has to be a route. The Worker finds the creator from the
  request's host name, and each storefront's canonical link is its own
  `levuche.page` address (rollout checklist).
- **A creator's own domain:** turn on Cloudflare for SaaS on the
  `levuche.page` zone. Add a fallback origin such as `customers.levuche.page`
  (`AAAA 100::`, proxied), and a Worker route `*/*` on the storefront Worker.
  Each creator points a CNAME at `customers.levuche.page`, and the app adds
  their domain as a custom hostname so Cloudflare issues its certificate.
  Check Cloudflare for SaaS pricing before turning it on.

## Sources

Cloudflare docs, read November 2026:

- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Build branches and preview builds](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Worker Previews](https://developers.cloudflare.com/workers/previews/) and [Previews configuration](https://developers.cloudflare.com/workers/previews/configuration/)
- [Workers Builds default variables](https://developers.cloudflare.com/changelog/post/2025-06-10-default-env-vars/)
- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) and [Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- [Wildcard DNS records](https://developers.cloudflare.com/dns/manage-dns-records/reference/wildcard-dns-records/)
- [Workers as the Cloudflare for SaaS fallback origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/)
- [OpenNext on Cloudflare: deploying](https://opennext.js.org/cloudflare/howtos/dev-deploy)
