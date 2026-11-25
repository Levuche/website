# Branches and GitHub rules

## How work moves

| Branch            | What it is           | Gets changes from                         | Deploys to        |
| ----------------- | -------------------- | ----------------------------------------- | ----------------- |
| `main`            | Production           | Pull requests from `dev` only             | `levuche.com`     |
| `dev`             | Staging, for testing | Approved pull requests from work branches | `dev.levuche.com` |
| `type/short-name` | One feature or fix   | Commits, from a person or a task          | Nothing           |

1. **Start a branch** from `dev`, named `type/short-name` in lower case:
   `feature/`, `fix/`, `hotfix/`, `chore/`, `docs/` or `ci/`, for example
   `feature/beta-signup` or `fix/contact-form`.
   (`git switch -c feature/beta-signup origin/dev`)
2. **Open a pull request into `dev`.** CI runs on it.
3. **A developer or tester reviews and approves it.** GitHub never lets the
   author approve their own pull request, so the approval comes from someone
   else. Pull requests opened by tasks are authored by the account the task
   pushes with, so approve those from a different account.
4. **Squash and merge** once it's approved and CI is green. The push to `dev`
   deploys `dev.levuche.com` for testing.
5. **Release:** open a pull request from `dev` into `main`. When CI is green,
   **merge** it (a merge commit, not squash, so `dev` and `main` stay in
   step). The push to `main` deploys `levuche.com`.

The required check **Branch rules** fails a pull request into `dev` from a
branch not named `type/short-name`, and a pull request into `main` from any
branch other than `dev`.

## GitHub rules

Two rulesets, under **Settings** > **Rules** > **Rulesets**:

| Rule                         | `dev`                                            | `main`                                           |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| Changes only by pull request | Yes                                              | Yes                                              |
| Required approvals           | 1                                                | 0 (the changes were approved into `dev`)         |
| Dismiss approvals on push    | Yes                                              | Yes                                              |
| Merge method                 | Squash                                           | Merge commit                                     |
| Required checks              | Check and build, dependency-review, Branch rules | Check and build, dependency-review, Branch rules |
| Linear history               | Yes                                              | No (merge commits from `dev`)                    |
| Signed commits               | Yes (GitHub signs squash merges)                 | Yes (GitHub signs merge commits)                 |
| Block force pushes, deletion | Yes                                              | Yes                                              |
| Who can bypass               | Org admins, through a pull request only          | Org admins, through a pull request only          |

## Settings that can't be set from the repo files

- **Default branch:** `dev` (**Settings** > **General**), so new pull
  requests target it.
- **Environments:** in **Settings** > **Environments**, set `development` to
  deploy only from `dev` and `production` only from `main` (**Deployment
  branches and tags** > **Selected branches and tags**).
