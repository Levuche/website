# Components and tests

## Where components live

**The website's own components** are [shadcn/ui](https://ui.shadcn.com)
components in `src/components/ui/` (button, card, badge, input, textarea,
native select, checkbox, field, alert, tabs, toggle group, accordion, avatar,
skeleton, empty, item, spinner). Sign-up, the dashboard and anything else
that belongs to Levuche's own website and app is built from these and stays
in this repo. The marketing sections and the phone frame, which are layout
rather than components, are in `src/components/`.

- Add a component with `npx shadcn@latest add <name>` (`components.json` is
  set up). shadcn's colour names (`--background`, `--primary`, `--muted`...)
  are mapped onto the Levuche `--lv-*` tokens in `src/app/globals.css`, so a
  new component comes out in Levuche's colours in light and dark. Then give
  it Levuche's shapes: pill buttons, 12 px fields, and `min-h-control` (40 px
  with a mouse, 44 px on touch screens).
- Size things with the presets in `src/app/globals.css`, not pixel values:
  `text-display`, `text-h1` to `text-h4`, `text-lead`, `text-body`,
  `text-ui`, `text-caption`; `px-gutter`, `py-section`, `p-card`,
  `gap-split`; `max-w-page`, `max-w-content`, `max-w-article`, `max-w-form`,
  `max-w-narrow`; `rounded-tile`, `rounded-card`, `rounded-panel`. Each text
  preset sets its line height, letter spacing and weight too. Tailwind's own
  steps (`text-sm`, `gap-3`, `p-6`) are presets as well and are fine.
- Reach for an existing component before writing markup with its own
  styles, so the site stays consistent.

The page at `/ui` (not linked, not in the sitemap, not indexed) shows them
all in light and dark, and `e2e/components.spec.ts` tests them there.

## Data from the browser: TanStack Query

Pages load their content on the server (Buildbase, through `src/lib`).
Anything the browser fetches or sends after the page is open goes through
[TanStack Query](https://tanstack.com/query), so it is cached, deduplicated
and shows its loading and error states the same way everywhere:

- The client is set up in `src/lib/query-client.ts` (answers reused for a
  minute; forms and checkout are never retried by themselves) and provided
  in the root layout by `src/components/query-provider.tsx`.
- Each call is a hook in `src/hooks/`, such as `useSendContactMessage`, with
  `useQuery` for reading and `useMutation` for sending. Calls to the site's
  own API routes use `postJson` in `src/lib/api.ts`, which throws an
  `ApiError` with the route's error code.
- The React Query devtools show in `npm run dev` only.

**Creator page blocks** come from
[`@levuche/ui`](https://github.com/Levuche/ui): what a creator's levuche.page
site is made of (profile, links and buttons, packs and checkout, video,
reels, newsletter, footer), each following the creator's own theme. The
creator site app and the page editor use the same package. Here they are
only used for the phone preview on the home page.

- It is installed from GitHub at a release tag
  (`"@levuche/ui": "github:Levuche/ui#v0.1.0"` in `package.json`), so the
  site only changes version in a pull request here.
- `next.config.ts` lists it in `transpilePackages` (it ships TypeScript).
- `src/app/globals.css` imports its `--site-*` tokens
  (`@levuche/ui/tokens.css`) and points Tailwind at its source with
  `@source`.
- To change a block: change it in Levuche/ui (its own pull request, gallery
  and tests), release a new tag there, then move this site to it in a pull
  request here: `npm install github:Levuche/ui#v0.2.0`.

## End-to-end tests

Playwright tests in `e2e/`, run in Chromium at desktop and phone sizes:

| File                 | What it checks                                                                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.spec.ts`       | Home page structure, one h1, skip link, header and footer links, legal page, 404, robots and sitemap (none off levuche.com), accessibility in light and dark                                                                  |
| `components.spec.ts` | The website's shadcn components at `/ui`, light and dark: button states and tap size, field hint and error, email validation, tabs, segmented control, checkboxes and accordion from the keyboard, alert roles, accessibility |
| `contact.spec.ts`    | Contact form: required fields, a successful send, and the error message (the API is intercepted)                                                                                                                              |
| `a11y.ts`            | axe check, WCAG 2.2 AA, fails on serious or critical problems                                                                                                                                                                 |

They check structure and behaviour, not copy, because the copy comes from
Buildbase and editors change it. No test sends a real message or sign-up.

### Where they run

- **CI, on every pull request and push** (`End-to-end tests` in `ci.yml`):
  a plain production build with no Buildbase values, served by `next start`.
- **On each pull request's preview link** (`preview.yml`): after the link
  is posted, the same tests run against the deployed preview, which is the
  real Worker reading the Buildbase development content.

To make the CI job required, add **End-to-end tests** to the required
checks of the `dev` and `main` rulesets (docs/BRANCHES.md).

### Run them yourself

```bash
npm ci
npx playwright install chromium
npm run build
npm run e2e                                  # starts next start on port 3100
E2E_BASE_URL=https://dev.levuche.com npm run e2e   # or test a deployed site
```

The dev site and preview links are behind Cloudflare Access (team sign-in,
`docs/DEPLOY.md` section 10). To test them, also set `CF_ACCESS_CLIENT_ID`
and `CF_ACCESS_CLIENT_SECRET` to an Access service token. `e2e/fixtures.ts`
sends it only to the site under test. The preview workflow reads them from
the repository secrets of the same names.
