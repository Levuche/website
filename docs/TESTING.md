# Components and tests

## Where components live

**The website's own components** are in `src/components/ui/`: buttons, form
fields, alerts, tabs, the accordion, badges, the marketing sections and the
phone frame. They use the `--lv-*` tokens in `src/app/globals.css`. Sign-up,
the dashboard and anything else that belongs to Levuche's own website and
app is built from these and stays in this repo. The page at `/ui` (not
linked, not in the sitemap, not indexed) shows them all in light and dark,
and `e2e/components.spec.ts` tests them there.

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

| File                 | What it checks                                                                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.spec.ts`       | Home page structure, one h1, skip link, header and footer links, legal page, 404, robots and sitemap, accessibility in light and dark                                                   |
| `components.spec.ts` | The website's components at `/ui`, light and dark: button states and tap size, field hint and error, email validation, tabs and accordion from the keyboard, alert roles, accessibility |
| `contact.spec.ts`    | Contact form: required fields, a successful send, and the error message (the API is intercepted)                                                                                        |
| `a11y.ts`            | axe check, WCAG 2.2 AA, fails on serious or critical problems                                                                                                                           |

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
