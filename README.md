# levuche.com

The marketing website for Levuche, a site builder for creators. A creator claims `handle.levuche.page`, builds a small site in their own brand, and sells or showcases packs from their social accounts.

Levuche is a product managed by Jagodana LLC ([jagodana.com](https://jagodana.com)), founded by Dharmendra Jagodana.

Designs, tokens and the brand kit come from [Levuche/design](https://github.com/Levuche/design).

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript. Light and dark follow the visitor's system setting through `next-themes`, which sets `data-lv` on `<html>` so the Levuche design tokens apply. Deploys to Cloudflare Workers with OpenNext, or to any Node host with `npm run build && npm start`.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site runs on http://localhost:3000.

| Command                 | What it does                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `npm run dev`           | Local development server                                                                   |
| `npm run build`         | Production build                                                                           |
| `npm run check`         | Lint, formatting and type check                                                            |
| `npm run e2e`           | End-to-end tests in Chromium (after `npm run build`; `docs/TESTING.md`)                    |
| `npm run cf:preview`    | Build for Cloudflare Workers and preview locally                                           |
| `npm run cf:deploy`     | Build and deploy levuche.com by hand (GitHub Actions normally does this; `docs/DEPLOY.md`) |
| `npm run cf:deploy:dev` | Build and deploy the dev site, dev.levuche.com, by hand                                    |

## Environment

Every setting is listed in `.env.example`. Copy it to `.env.local` and fill in what you need; the site builds and runs with it copied as is. Never commit real keys or a filled-in `.env` file; `.gitignore` keeps every `.env*` file except the example out of git. Server secrets for Cloudflare go in `wrangler secret put NAME`, never in `wrangler.jsonc`. Cloudflare setup and domains: `docs/DEPLOY.md`. Branches (feature > `dev` > `main`) and GitHub rules: `docs/BRANCHES.md`. Components and tests: `docs/TESTING.md`.

## Buildbase

Sign-in, the beta list, the contact form and all editable copy (blog, docs, FAQs, testimonials, legal pages, and the home and pricing lists) come from [Buildbase](https://buildbase.app) through `@buildbase/sdk`. Use a development environment for local work and previews and production for levuche.com. Setup, the content model and every slug: [docs/BUILDBASE.md](docs/BUILDBASE.md). Seed text: `content/buildbase/`.

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
