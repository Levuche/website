# Deploying to Cloudflare

levuche.com runs on Cloudflare Workers, built with OpenNext and deployed by
GitHub Actions. The repository is public, so Actions minutes are free.

- `.github/workflows/ci.yml` checks and builds every push and pull request.
- `.github/workflows/deploy.yml` deploys `dev` to the dev site
  (`dev.levuche.com`) and `main` to production (`levuche.com`), each time
  something is merged into that branch. Pull requests deploy nothing.

Work goes feature branch > `dev` > `main` (`docs/BRANCHES.md`).

Nothing secret goes in the repo. The Cloudflare token is a GitHub secret, the
Buildbase secrets live on each Worker, and the public Buildbase ids are GitHub
variables.

Don't also connect the repo to Cloudflare's own Git builds (Workers Builds),
or every push would deploy twice. If it is connected, disconnect it: the
Worker > **Settings** > **Build** > **Git repository** > **Disconnect**. The
Worker itself can stay: GitHub Actions deploys to the same name, `levuche-com`.

## Domain plan

| Address                       | Serves                                           | Set up                                        |
| ----------------------------- | ------------------------------------------------ | --------------------------------------------- |
| `levuche.com`                 | This site (Worker `levuche-com`)                 | Custom domain, from `wrangler.jsonc`          |
| `www.levuche.com`             | 301 to `levuche.com`                             | Redirect rule (step 6)                        |
| `dev.levuche.com`             | The dev site (Worker `levuche-com-dev`), noindex | Custom domain, from `wrangler.jsonc`          |
| `app.levuche.com` (suggested) | The Levuche app, once it exists                  | Its own Worker with a custom domain (step 9)  |
| `<name>.levuche.page`         | Creator storefronts, once they exist             | Wildcard DNS and a Worker route (step 9)      |
| A creator's own domain        | Their storefront                                 | Cloudflare for SaaS custom hostnames (step 9) |

Only `levuche.com` is indexed. The dev site sends `noindex` and its canonical
links point at `dev.levuche.com`. The dev site always shows the `dev`
branch.

## 1. Put both domains on Cloudflare

1. In the Cloudflare dashboard, add `levuche.com` and `levuche.page` as
   domains (zones) on the account that will own the site.
2. Before you change nameservers, check that Cloudflare copied every existing
   DNS record, above all the mail records (MX, SPF, DKIM, DMARC) for
   `hello@levuche.com`. Mail records stay DNS-only (grey cloud).
3. At the registrar, switch each domain to the two nameservers Cloudflare
   shows. Wait until the zone reads **Active**.

Both Workers attach their domain on every deploy, so the `levuche.com` zone
has to be active before the first deploy works.

## 2. Cloudflare API token

In Cloudflare, **My Profile** > **API Tokens** > **Create Token** >
**Create Custom Token**, with:

| Scope               | Permission             |
| ------------------- | ---------------------- |
| Account (Levuche's) | Workers Scripts: Edit  |
| Account (Levuche's) | Account Settings: Read |
| Zone: `levuche.com` | Workers Routes: Edit   |
| Zone: `levuche.com` | DNS: Edit              |
| Zone: `levuche.com` | Zone: Read             |

Limit it to the Levuche account and the `levuche.com` zone. Copy the token
once; Cloudflare doesn't show it again.

The account id is on the account's **Workers & Pages** overview page (it isn't
secret).

## 3. GitHub settings

In GitHub, `Levuche/website` > **Settings**:

1. **Secrets and variables** > **Actions**:
   - New repository secret `CLOUDFLARE_API_TOKEN`: the token from step 2.
   - New repository variable `CLOUDFLARE_ACCOUNT_ID`: the account id.
2. **Environments**: create `development` and `production`. In each, add
   these variables (public values, not secrets). Leave any you don't have yet;
   the matching feature stays off until it's set.

   | Variable                | `development`                     | `production`                         |
   | ----------------------- | --------------------------------- | ------------------------------------ |
   | `BUILDBASE_ORG_ID`      | Levuche org id                    | Levuche org id                       |
   | `BUILDBASE_ENVIRONMENT` | the development environment's key | not used (production is the default) |
   | `BUILDBASE_CLIENT_ID`   | development sign-in client id     | production sign-in client id         |
   | `BUILDBASE_ANALYTICS`   | `on` when wanted                  | `on` when wanted                     |

   The site address and sign-in redirect are fixed in the workflow
   (`https://dev.levuche.com` and `https://levuche.com`), so the dev site can
   never present itself as levuche.com.

3. Optional: under **Environments** > `production`, add yourself as a
   required reviewer so production waits for your click.

## 4. Runtime secrets on each Worker

These four are read on each request and must never be in the repo. The first
deploy creates both Workers; after that, set each secret from your computer in
the repo folder (Wrangler asks for the value, so it stays out of your shell
history):

```sh
npx wrangler login
npx wrangler secret put BUILDBASE_API_TOKEN --env dev
npx wrangler secret put BUILDBASE_API_TOKEN
```

The first line of each pair is the dev site (Buildbase development values),
the second is production. Or add them in the dashboard: the Worker >
**Settings** > **Variables and Secrets** > **Add** > type **Secret**.

| Secret                      | What it is                                       |
| --------------------------- | ------------------------------------------------ |
| `BUILDBASE_API_TOKEN`       | Content-reader org API token, `<orgId>:<secret>` |
| `BUILDBASE_CLIENT_SECRET`   | The sign-in client's secret                      |
| `BUILDBASE_WEBHOOK_SECRET`  | The content webhook's signing secret             |
| `BUILDBASE_CONTACT_FORM_ID` | The Contact form's public id                     |

Until a value is set, the matching part of the site switches itself off: no
sign-in, sample content from `content/buildbase` on the home and pricing
pages, and a contact form that says it isn't open yet.

## 5. Deploying

Merge a pull request into `dev` and the push deploys `https://dev.levuche.com`.
Check it there, then open a pull request from `dev` into `main`; merging it
deploys `https://levuche.com`. To deploy a branch again without a change, open
**Actions** > **Deploy to Cloudflare** > **Run workflow** and pick `dev` or
`main`.

## 6. levuche.com and www

1. The production deploy attaches `levuche.com` from `wrangler.jsonc` and
   creates its DNS record. If its log says it couldn't, add it by hand: the
   Worker > **Settings** > **Domains & Routes** > **Add** > **Custom Domain**.
2. For `www`, add a DNS record in the `levuche.com` zone: type `AAAA`, name
   `www`, content `100::`, proxied (orange cloud).
3. **Rules** > **Redirect Rules** > create from the template **Redirect from
   WWW to root**, status `301`, keeping the path and query string.
4. Check `https://levuche.com/robots.txt` and
   `https://levuche.com/sitemap.xml`, then add the site in Google Search
   Console and Bing Webmaster Tools (rollout checklist).

## 7. Buildbase addresses

| Setting in Buildbase        | production                                 | development                                           |
| --------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| Sign-in client redirect URL | `https://levuche.com`                      | `http://localhost:3000` and `https://dev.levuche.com` |
| Content webhook URL         | `https://levuche.com/api/webhooks/content` | `https://dev.levuche.com/api/webhooks/content`        |

## 8. Deploying by hand (optional)

From your own computer, with `.env.local` filled in for the target:

```sh
npx wrangler login
npm run cf:deploy:dev   # dev.levuche.com
npm run cf:deploy       # levuche.com
```

The workflow is the better route: a local build picks up `.env.local`, which
may not match what the workflow builds.

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
  their domain as a custom hostname so Cloudflare issues its certificate. The
  first 100 custom hostnames are included, then $0.10 each a month (November
  2026).

## Sources

Cloudflare docs, read November 2026:

- [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) and [Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- [Wildcard DNS records](https://developers.cloudflare.com/dns/manage-dns-records/reference/wildcard-dns-records/)
- [Workers as the Cloudflare for SaaS fallback origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/) and [Cloudflare for SaaS plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/)
- [OpenNext on Cloudflare: deploying](https://opennext.js.org/cloudflare/howtos/dev-deploy)
