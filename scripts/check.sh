#!/usr/bin/env bash
# Everything that should be green before merging: lint, typecheck, unit tests, build.
# Usage: scripts/check.sh [--e2e] [--skip-build]
#   --e2e         also run the Playwright suite
#   --skip-build  skip the production build (and its smoke test)
set -euo pipefail
source "$(dirname "$0")/lib.sh"

E2E=0
SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --e2e) E2E=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    *) die "Unknown option '$arg'" ;;
  esac
done

info "Lint";       yarn lint --quiet
info "Typecheck";  yarn tsc --noEmit
"$REPO_ROOT/scripts/test.sh" unit
[[ "$E2E" -eq 1 ]] && "$REPO_ROOT/scripts/test.sh" e2e
[[ "$SKIP_BUILD" -eq 1 ]] || "$REPO_ROOT/scripts/build.sh" --smoke
ok "All checks passed"
