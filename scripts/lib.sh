#!/usr/bin/env bash
# Shared helpers. Source this file, do not run it.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

DEFAULT_BASE="main"
DEV_PORT=3000
SMOKE_PORT=3101

# Files that tooling rewrites on its own and that should not ride along in commits.
EXCLUDED_FROM_COMMIT=("next-env.d.ts" "tsconfig.tsbuildinfo")

info() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m ok\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarn\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31merr\033[0m  %s\n' "$*" >&2; exit 1; }

current_branch() { git rev-parse --abbrev-ref HEAD; }

branch_exists() { git show-ref --verify --quiet "refs/heads/$1"; }

# Ignores EXCLUDED_FROM_COMMIT, which tooling rewrites on its own.
require_clean_tree() {
  local dirty
  dirty="$(git status --porcelain --untracked-files=no | cut -c4-)"
  for f in "${EXCLUDED_FROM_COMMIT[@]}"; do
    dirty="$(printf '%s\n' "$dirty" | grep -vxF "$f" || true)"
  done
  [[ -z "${dirty//[$'\n ']/}" ]] \
    || die "Working tree has uncommitted changes. Commit or stash them first."
}

port_in_use() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
