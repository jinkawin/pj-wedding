#!/usr/bin/env bash
# Run tests.
# Usage: scripts/test.sh [unit|e2e|all] [extra args passed to the runner]
#   unit  Vitest (default)
#   e2e   Playwright, against http://localhost:3000. Starts `yarn dev` if nothing listens there.
#   all   unit, then e2e
set -euo pipefail
source "$(dirname "$0")/lib.sh"

SUITE="${1:-unit}"
[[ $# -gt 0 ]] && shift

run_unit() {
  info "Unit tests (Vitest)"
  yarn vitest run --dir src "$@"
}

run_e2e() {
  info "E2E tests (Playwright)"
  if ! port_in_use "$DEV_PORT"; then
    info "Nothing on :$DEV_PORT, Playwright will start the dev server"
  fi
  yarn playwright test "$@"
}

case "$SUITE" in
  unit) run_unit "$@" ;;
  e2e)  run_e2e "$@" ;;
  all)  run_unit; run_e2e ;;
  *)    die "Unknown suite '$SUITE'. Use unit, e2e or all." ;;
esac
ok "Tests passed"
