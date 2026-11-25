# Branches and GitHub rules

## How work moves

| Branch      | What it is          | Gets changes from                   | Deploys to        |
| ----------- | ------------------- | ----------------------------------- | ----------------- |
| `feature/*` | One change          | Your commits                        | Nothing           |
| `dev`       | What's being tested | Pull requests from feature branches | `dev.levuche.com` |
| `main`      | What's live         | Pull requests from `dev` only       | `levuche.com`     |

1. Branch off `dev` (`git switch -c feature/short-name origin/dev`), push, and
   open a pull request into `dev`.
2. When the checks pass, **squash and merge**. The push to `dev` deploys
   `dev.levuche.com`.
3. Check the dev site. Then open a pull request from `dev` into `main` and
   **merge** it (a merge commit, not squash, so `dev` and `main` stay in step).
   The push to `main` deploys `levuche.com`.

`dev` is the default branch, so new pull requests target it unless you pick
`main`. The check **Into main only from dev** fails any pull request into
`main` from another branch.

## GitHub rules

Two rulesets, under **Settings** > **Rules** > **Rulesets**:

| Rule                         | `dev`                                   | `main`                                                      |
| ---------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Changes only by pull request | Yes                                     | Yes                                                         |
| Approvals                    | 0                                       | 1                                                           |
| Merge method                 | Squash                                  | Merge commit                                                |
| Required checks              | Check and build, dependency-review      | Check and build, dependency-review, Into main only from dev |
| Linear history               | Yes                                     | No (merge commits from `dev`)                               |
| Signed commits               | Yes (GitHub signs squash merges)        | Yes (GitHub signs merge commits)                            |
| Block force pushes, deletion | Yes                                     | Yes                                                         |
| Who can bypass               | Org admins, through a pull request only | Org admins, through a pull request only                     |

GitHub doesn't let anyone approve their own pull request. While only one
person works on the site, merging `dev` into `main` means ticking the admin
bypass on the pull request. Once a second person reviews, they approve
instead.

## Settings that can't be set from the repo files

- **Environments:** in **Settings** > **Environments**, set `development` to
  deploy only from `dev` and `production` only from `main` (**Deployment
  branches and tags** > **Selected branches and tags**). Optionally add a
  required reviewer to `production`.
- **Default branch:** `dev` (**Settings** > **General**).
