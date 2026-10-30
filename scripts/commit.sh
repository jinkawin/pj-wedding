#!/usr/bin/env bash
# Stage and commit. The husky pre-commit hook runs lint, typecheck and unit tests.
# Usage: scripts/commit.sh "<message>" [path ...]
#   With no paths, stages every change except files in EXCLUDED_FROM_COMMIT (see lib.sh).
#   With paths, stages only those.
# Refuses to commit on main unless ALLOW_MAIN=1.
set -euo pipefail
source "$(dirname "$0")/lib.sh"

MESSAGE="${1:-}"
[[ -n "$MESSAGE" ]] || die "Usage: scripts/commit.sh \"<message>\" [path ...]"
shift

if [[ "$(current_branch)" == "$DEFAULT_BASE" && "${ALLOW_MAIN:-0}" != "1" ]]; then
  die "On '$DEFAULT_BASE'. Create a branch first (scripts/branch.sh) or set ALLOW_MAIN=1."
fi

if [[ $# -gt 0 ]]; then
  git add -- "$@"
else
  EXCLUDES=()
  for f in "${EXCLUDED_FROM_COMMIT[@]}"; do EXCLUDES+=(":(exclude)$f"); done
  git add -A -- . "${EXCLUDES[@]}"
fi

git diff --cached --quiet && die "Nothing staged to commit."

info "Staged:"
git diff --cached --stat
git commit -m "$MESSAGE"
ok "Committed $(git rev-parse --short HEAD) on $(current_branch)"
