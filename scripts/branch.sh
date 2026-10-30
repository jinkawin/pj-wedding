#!/usr/bin/env bash
# Create a branch from a base branch and switch to it.
# Usage: scripts/branch.sh <new-branch> [base=main]
# Uncommitted changes travel with you to the new branch.
set -euo pipefail
source "$(dirname "$0")/lib.sh"

NAME="${1:-}"
BASE="${2:-$DEFAULT_BASE}"

[[ -n "$NAME" ]] || die "Usage: scripts/branch.sh <new-branch> [base=$DEFAULT_BASE]"
git check-ref-format --branch "$NAME" >/dev/null 2>&1 || die "Invalid branch name: $NAME"
branch_exists "$NAME" && die "Branch '$NAME' already exists."
branch_exists "$BASE" || die "Base branch '$BASE' does not exist."

info "Creating '$NAME' from '$BASE'"
git switch -c "$NAME" "$BASE"
ok "On branch $(current_branch)"
