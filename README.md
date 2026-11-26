# levuche.com

The marketing website for Levuche, a site builder for creators. A creator claims `handle.levuche.page`, builds a small site in their own brand, and sells or showcases packs from their social accounts.

Levuche is a product managed by Jagodana LLC ([jagodana.com](https://jagodana.com)), founded by Dharmendra Jagodana.

Designs, tokens and the brand kit come from [Levuche/design](https://github.com/Levuche/design).

## Start here

New to this repository, as a developer or an AI agent? Read these in order:

1. **[Launch checklist #83](https://github.com/Levuche/website/issues/83).** Every piece of work still open before launch, by priority, with where to begin. Each linked issue holds the context it needs.
2. **This README** for setup, settings, branches and deploys.
3. **The docs** when a task touches them: [docs/BUILDBASE.md](docs/BUILDBASE.md) (Buildbase setup, content model, every slug), [docs/DEPLOY.md](docs/DEPLOY.md) (Cloudflare, domains, secrets), [docs/BRANCHES.md](docs/BRANCHES.md) (branches and GitHub rules), [docs/TESTING.md](docs/TESTING.md) (components and tests).

Ground rules that apply to every change:

- Levuche ships in small releases, tracked as milestones (R1 Launch, R2 Polish, and so on; plan in [Levuche/app#45](https://github.com/Levuche/app/issues/45)). Work only on issues in the current milestone, check an issue's milestone before you start it, and add no new features to a release that's under way.
- Never commit a key, token or secret, or a filled-in `.env` file. Only names go in the repo; values live where the table under [Settings and secrets](#settings-and-secrets) says.
- Work on a `type/short-name` branch from `dev` and open the pull request into `dev`. Nothing goes into `main` except a release from `dev`.
- Don't push to `dev` or `main` directly, and don't skip or disable a test to get a check green.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, Node 22. Light and dark follow the visitor's system setting through `next-themes`, which sets `data-lv` on `<html>` so the Levuche design tokens apply. Deploys to Cloudflare Workers with OpenNext, or to any Node host with `npm run build && npm start`.

Shared code comes from two Levuche packages installed from GitHub tags (see `package.json`): `@levuche/ui` (components and design tokens) and `@levuche/kit` (shared sign-in, affiliate, tracking and form helpers, also used by the app). To change them, change those repositories, tag a new version and bump the tag here.

| Folder              | What's in it                                                               |
| ------------------- | -------------------------------------------------------------------------- |
| `src/`              | The site: pages under `src/app`, components, Buildbase calls, fonts        |
| `content/buildbase` | Seed text for Buildbase, and the sample content shown when it's not set up |
| `e2e/`              | Playwright end-to-end and accessibility tests                              |
| `scripts/`          | Build helpers: asset headers, the indexing check, share images, Lighthouse |
| `docs/`             | Setup and process guides                                                   |
| `.github/`          | CI, deploys, previews, Dependabot, issue and pull request templates        |

## Run it

```bash
nvm use                      # Node 22, from .nvmrc
npm ci
cp .env.example .env.local   # optional: the site runs without any values
npm run dev                  # http://localhost:3000
```

With `.env.local` copied as is, every Buildbase feature switches itself off: no sign-in, sample content on the home and pricing pages, and a contact form that says it isn't open yet. That's enough for most layout and copy work.

| Command                  | What it does                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `npm run dev`            | Local development server                                                                   |
| `npm run build`          | Production build                                                                           |
| `npm run check`          | Lint, formatting and type check                                                            |
| `npm run format`         | Fix formatting with Prettier                                                               |
| `npm run e2e`            | End-to-end tests in Chromium (after `npm run build`; `docs/TESTING.md`)                    |
| `npm run check:indexing` | Checks that only levuche.com can be indexed by search engines                              |
| `npm run cf:preview`     | Build for Cloudflare Workers and preview locally                                           |
| `npm run cf:deploy`      | Build and deploy levuche.com by hand (GitHub Actions normally does this; `docs/DEPLOY.md`) |
| `npm run cf:deploy:dev`  | Build and deploy the dev site, dev.levuche.com, by hand                                    |

Before you push:

```bash
npm run check
npm run build && npx playwright install chromium && npm run e2e
```

## Settings and secrets

Every setting is listed, with what it does, in `.env.example`. Copy it to `.env.local` for local work; `.gitignore` keeps every `.env*` file except the example out of git. The table says where each value lives for the deployed sites. Ask a Levuche admin for access; never paste a value into an issue, a pull request or a commit.

| Name                                                                                      | Kind      | Where it lives                                                                                                      |
| ----------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`                                                                    | Secret    | GitHub, repository secret (deploys)                                                                                 |
| `CLOUDFLARE_ACCOUNT_ID`                                                                   | Public    | GitHub, repository variable                                                                                         |
| `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`                                          | Secret    | GitHub, repository secrets (tests against the dev site and previews, which are behind team login)                   |
| `BUILDBASE_ORG_ID`, `BUILDBASE_ENVIRONMENT`, `BUILDBASE_CLIENT_ID`, `BUILDBASE_ANALYTICS` | Public    | GitHub, `development`, `preview` and `production` environments; the build turns them into `NEXT_PUBLIC_BUILDBASE_*` |
| `BUILDBASE_API_TOKEN`, `BUILDBASE_CLIENT_SECRET`, `BUILDBASE_WEBHOOK_SECRET`              | Secret    | On each Cloudflare Worker (`wrangler secret put NAME`, add `--env dev` for the dev site)                            |
| `BUILDBASE_CONTACT_FORM_ID`                                                               | Public id | On each Cloudflare Worker, next to the secrets                                                                      |

`wrangler.jsonc` holds no secrets and must never get any. Full setup: [docs/DEPLOY.md](docs/DEPLOY.md) sections 3 and 4.

## Buildbase

Sign-in, buying the add-on, the contact form, analytics and all editable copy (blog, docs, FAQs, testimonials, legal pages, and the home and pricing lists) come from [Buildbase](https://buildbase.app) through `@buildbase/sdk`. The Buildbase organization is **Levu Che**, in the Buildbase console.

| Buildbase environment | Used by                                            | Environment key                                       |
| --------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| development           | `npm run dev`, preview links and `dev.levuche.com` | Set `NEXT_PUBLIC_BUILDBASE_ENVIRONMENT` to its key    |
| production            | `levuche.com`                                      | None: leave `NEXT_PUBLIC_BUILDBASE_ENVIRONMENT` empty |

Each environment has its own users, sign-in client, content and forms, so set things up in development first, check them on the dev site, then repeat them in production. The org id and the development environment's key are in the console's settings and in the GitHub environment variables above. Setup, the content model and every slug: [docs/BUILDBASE.md](docs/BUILDBASE.md). Seed text: `content/buildbase/`. What's still to do in production: issue #34.

## Branches, pull requests and deploys

| Branch            | Deploys to                                   |
| ----------------- | -------------------------------------------- |
| `type/short-name` | A preview link, posted on its pull request   |
| `dev`             | `dev.levuche.com` (Worker `levuche-com-dev`) |
| `main`            | `levuche.com` (Worker `levuche-com`)         |

1. Branch from `dev` with a name like `feature/beta-signup`. Types: `feature`, `fix`, `hotfix`, `chore`, `docs`, `ci`.
2. Open a pull request into `dev`, fill in `.github/pull_request_template.md` and write `Closes #N` for the issue it finishes.
3. Wait for every check to pass, then **squash and merge**. The push deploys `dev.levuche.com`.
4. To release, open a pull request from `dev` into `main` and merge it with a **merge commit**, not squash, so the two branches stay in step. The push deploys `levuche.com` (issue #80).

Checks on each pull request into `dev`: **Branch rules** (branch name and target), **Check and build**, **End-to-end tests**, **Search indexing**, **dependency-review**, **Preview link** and **Lighthouse**. Both Workers are in the `levuche.com` Cloudflare account, and GitHub Actions deploys them; don't also connect Cloudflare's own Git builds. Details: [docs/BRANCHES.md](docs/BRANCHES.md) and [docs/DEPLOY.md](docs/DEPLOY.md).

## Things that trip people up

- **The dev site and preview links ask for a team login** (Cloudflare Access), so a plain `curl` or test run against them gets a login page. Use the Access service token in `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` (`docs/TESTING.md`).
- **Dependabot pull requests can fail `npm ci`** with "Missing: ... from lock file". Merge `dev` into the branch, run `npm install` to regenerate `package-lock.json`, commit it and push.
- **eslint 10, TypeScript 7 and `@types/node` 23 and newer are held back** in `.github/dependabot.yml` because the site's tools don't support them yet (issue #82).
- **Content edits don't need a code change or a deploy.** Copy lives in Buildbase and the content webhook refreshes the site (`docs/BUILDBASE.md`).
- **Only `https://levuche.com` may be indexed.** Any other `NEXT_PUBLIC_SITE_URL` makes the build send `noindex`, which `npm run check:indexing` and CI check.

## Help and feedback

- Questions and ideas: [Discussions](https://github.com/Levuche/website/discussions)
- Bugs and requests: [Issues](https://github.com/Levuche/website/issues/new/choose)
- Security problems: privately, see [SECURITY.md](SECURITY.md)
- Your own account, an order or a payout: [levuche.com/contact](https://levuche.com/contact)

How issues are handled and how the team works: [CONTRIBUTING.md](CONTRIBUTING.md).

## License and ownership

Everything in this repository belongs to Jagodana LLC. It's public so you can see it, not so you can reuse it. You may not copy, modify, redistribute, use commercially or use as AI training data any part of it without written permission. See [LICENSE](LICENSE).

Levuche™ and the Levuche logo are trademarks of Jagodana LLC. See [TRADEMARKS.md](TRADEMARKS.md).

Third-party material keeps its own licence: the Sora font files in `src/fonts/` (SIL Open Font License 1.1), the MIT-licensed starter code this project's setup is adapted from, and the npm packages it installs. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

For permission, contact Jagodana LLC through [jagodana.com](https://jagodana.com).

© 2026 Jagodana LLC. All rights reserved.
