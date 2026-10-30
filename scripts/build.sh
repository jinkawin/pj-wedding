#!/usr/bin/env bash
# Production build, optionally followed by a smoke test of the built app.
# Usage: scripts/build.sh [--smoke] [--force]
#   --smoke  start the built app on :3101 and request every route, expecting HTTP 200
#   --force  build even though a dev server is running on :3000 (it shares .next and may break)
set -euo pipefail
source "$(dirname "$0")/lib.sh"

SMOKE=0
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --smoke) SMOKE=1 ;;
    --force) FORCE=1 ;;
    *) die "Unknown option '$arg'" ;;
  esac
done

if port_in_use "$DEV_PORT" && [[ "$FORCE" -ne 1 ]]; then
  die "A dev server is on :$DEV_PORT and shares .next with the build. Stop it or pass --force."
fi

info "Building"
yarn build
ok "Build succeeded"

[[ "$SMOKE" -eq 1 ]] || exit 0

port_in_use "$SMOKE_PORT" && die "Port $SMOKE_PORT is busy."

ROUTES=(/ /overview /agenda /seating /gallery /location /about /register /photo-booth)
LOG="$(mktemp)"

stop_server() {
  # yarn spawns node, so stop the children before the wrapper.
  pkill -P "$SERVER_PID" 2>/dev/null || true
  kill "$SERVER_PID" 2>/dev/null || true
  wait "$SERVER_PID" 2>/dev/null || true
  rm -f "$LOG"
}

info "Starting built app on :$SMOKE_PORT"
yarn next start --port "$SMOKE_PORT" >"$LOG" 2>&1 &
SERVER_PID=$!
trap stop_server EXIT

for _ in $(seq 1 30); do
  curl -fs -o /dev/null "http://localhost:$SMOKE_PORT/" && break
  sleep 1
done

FAILED=0
for route in "${ROUTES[@]}"; do
  CODE="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$SMOKE_PORT$route")"
  if [[ "$CODE" == "200" ]]; then ok "$route $CODE"; else warn "$route $CODE"; FAILED=1; fi
done

[[ "$FAILED" -eq 0 ]] || { cat "$LOG" >&2; die "Smoke test failed."; }
ok "Smoke test passed"
