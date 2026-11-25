# Contributing to the Levuche website

Thanks for helping make Levuche better. This repository is levuche.com, the Levuche marketing website: the home, pricing, blog, docs, contact and legal pages.

It's public so that anyone can see how Levuche is built, and so that creators, buyers and developers can tell us what's broken and what's missing. The code and content are not open source ([LICENSE](LICENSE)), and that shapes how you can help.

> Issues, discussions and pull requests are public. Never post passwords, API keys, card or bank details, order numbers, or anyone's personal information, your own included.

## Ways to help

| You want to                                                   | Do this                                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Ask how something works, share an idea, or show what you made | Start a [discussion](https://github.com/Levuche/website/discussions)                                 |
| Report something broken                                       | Open a [bug report](https://github.com/Levuche/website/issues/new?template=bug_report.yml)           |
| Suggest an improvement                                        | Open a [feature request](https://github.com/Levuche/website/issues/new?template=feature_request.yml) |
| Report a security problem                                     | Report it privately, as [SECURITY.md](SECURITY.md) explains. Never in public.                        |
| Get help with your own Levuche account, an order or a payout  | Use [levuche.com/contact](https://levuche.com/contact), not GitHub                                   |

Before you open an issue, search the [open and closed issues](https://github.com/Levuche/website/issues?q=is%3Aissue) and the discussions, and add to an existing one if it's the same thing. One problem or idea per issue makes it easier to track.

### A good bug report

- says what you did, what you expected and what happened instead;
- gives the page or screen, your browser and your device;
- has the smallest set of steps that shows the problem;
- has a screenshot or recording if it's something you can see, with private details covered.

### A good feature request

Start with the problem, not the solution: who it's for (a creator, a buyer, the Levuche team), what they're trying to do and what gets in the way today. We read every request, label it and add it to the roadmap when it fits.

## Pull requests

Because the code here is not open source and there's no contributor agreement yet, we can only merge pull requests from the Levuche team. If you've found a fix, please describe it in an issue instead; we're glad to make the change and credit you in it. Pull requests from outside the team are closed with a pointer back to this section.

## What happens to your issue

1. The team reads new issues and discussions, usually within a few working days.
2. We add labels: a type (`bug`, `enhancement`), a priority (`P0: before launch`, `P1: soon after`, `P2: later`) and an area such as `auth`, `analytics` or `performance`.
3. Planned work goes on the Levuche project board and is closed by the pull request that fixes it.
4. If we decide not to do something, we close the issue and say why.

## For the Levuche team

### Branches

- Work goes on a branch named `type/short-name` (types: `feature`, `fix`, `hotfix`, `chore`, `docs`, `ci`), made from `dev`.
- Open the pull request into `dev`. The checks must pass and someone else reviews before it's merged.
- Releases go from `dev` into `main` by a merge commit. Nothing else goes into `main`.

### Pull requests

- Fill in the pull request template, and write `Closes #N` for the issue it finishes, so the project board moves the card itself.
- Keep one change per pull request. Say what someone using Levuche sees before and after.
- Never commit secrets: real keys and tokens live in `.env.local` or the host's secret store; `.env.example` holds placeholders only.

### Setup

```sh
nvm use            # Node 22, from .nvmrc
npm ci
cp .env.example .env.local   # optional: every Buildbase feature switches off without it
npm run dev        # http://localhost:3000
```

Before you push:

```sh
npm run check      # ESLint, Prettier and the type check
npm run build && npm run e2e   # the end-to-end and accessibility tests
```

Branches, deploys and testing are in [docs/BRANCHES.md](docs/BRANCHES.md), [docs/DEPLOY.md](docs/DEPLOY.md) and [docs/TESTING.md](docs/TESTING.md).
