# scripts

Repeatable dev tasks. Run from anywhere, each script moves to the repo root itself. All need bash and yarn. Nothing here pushes.

| Script | What it does |
| --- | --- |
| `branch.sh <name> [base=main]` | Create a branch from `base` and switch to it. Uncommitted changes come along. |
| `commit.sh "<msg>" [paths...]` | Stage and commit. No paths stages everything except `next-env.d.ts` and `tsconfig.tsbuildinfo`. Refuses on `main` unless `ALLOW_MAIN=1`. Runs the pre-commit hook. |
| `merge.sh <source> [target=main] [--verify]` | Merge with a merge commit. Needs a clean tree. Aborts cleanly on conflicts. `--verify` runs `check.sh` and resets the target if it fails. |
| `test.sh [unit\|e2e\|all] [args]` | Vitest (`unit`, default) or Playwright (`e2e`). Extra args go to the runner, e.g. `scripts/test.sh e2e --project=chromium-desktop e2e/landing.spec.ts`. |
| `build.sh [--smoke] [--force]` | `yarn build`. `--smoke` starts the build on :3101 and expects 200 from every route. Refuses while a dev server is on :3000 unless `--force`. |
| `check.sh [--e2e] [--skip-build]` | Lint, typecheck, unit tests, then build with smoke test. `yarn check` is an alias. |
| `pre-commit.sh` | The git hook body: eslint on staged files, typecheck, unit tests. |

## Husky

`.husky/pre-commit` calls `scripts/pre-commit.sh`. `yarn install` runs `husky` through the `prepare` script and points `core.hooksPath` at `.husky/_`. Skip once with `git commit --no-verify`.

## Typical flow

```bash
scripts/branch.sh feat/my-change
# edit
scripts/commit.sh "Describe the change"
scripts/merge.sh feat/my-change main --verify
```

Edit `scripts/lib.sh` to change the base branch, ports, or the files kept out of commits.
