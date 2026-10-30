#!/usr/bin/env bash
# Called by .husky/pre-commit. Fast gate on what is being committed:
#   1. eslint on staged JS/TS files (errors only)
#   2. typecheck of the project
#   3. unit tests
# Bypass in an emergency with: git commit --no-verify
set -euo pipefail
source "$(dirname "$0")/lib.sh"

STAGED=()
while IFS= read -r file; do
  [[ -n "$file" ]] && STAGED+=("$file")
done < <(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx|js|jsx|mjs|mts)$' || true)

if [[ ${#STAGED[@]} -eq 0 ]]; then
  ok "No JS/TS files staged, skipping checks"
  exit 0
fi

info "Lint ${#STAGED[@]} staged file(s)"
yarn eslint --quiet --no-warn-ignored "${STAGED[@]}"

info "Typecheck"
yarn tsc --noEmit

info "Unit tests"
yarn vitest run --dir src --reporter=dot

ok "Pre-commit checks passed"
