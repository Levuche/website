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

| Command              | What it does                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm run dev`        | Local development server                                                                                      |
| `npm run build`      | Production build                                                                                              |
| `npm run check`      | Lint, formatting and type check                                                                               |
| `npm run cf:preview` | Build for Cloudflare Workers and preview locally                                                              |
| `npm run cf:deploy`  | Build and deploy to Cloudflare Workers (add `account_id` and the levuche.com route to `wrangler.jsonc` first) |

## Environment

Only public values, all listed in `.env.example`. Never commit real keys or a filled-in `.env` file; `.gitignore` keeps every `.env*` file except the example out of git.

## License and ownership

Everything in this repository belongs to Jagodana LLC. It's public so you can see it, not so you can reuse it. You may not copy, modify, redistribute, use commercially or use as AI training data any part of it without written permission. See [LICENSE](LICENSE).

Levuche™ and the Levuche logo are trademarks of Jagodana LLC. See [TRADEMARKS.md](TRADEMARKS.md).

Third-party material keeps its own licence: the Sora font files in `src/fonts/` (SIL Open Font License 1.1), the MIT-licensed starter code this project's setup is adapted from, and the npm packages it installs. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

For permission, contact Jagodana LLC through [jagodana.com](https://jagodana.com).

© 2026 Jagodana LLC. All rights reserved.
