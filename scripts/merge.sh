#!/usr/bin/env bash
# Merge a branch into a target branch with a merge commit.
# Usage: scripts/merge.sh <source-branch> [target=main] [--verify]
#   --verify  run scripts/check.sh on the merged result and undo the merge if it fails
# Never pushes. Aborts and restores the target on conflicts.
set -euo pipefail
source "$(dirname "$0")/lib.sh"

VERIFY=0
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --verify) VERIFY=1 ;;
    *) ARGS+=("$arg") ;;
  esac
done

SOURCE="${ARGS[0]:-}"
TARGET="${ARGS[1]:-$DEFAULT_BASE}"

[[ -n "$SOURCE" ]] || die "Usage: scripts/merge.sh <source-branch> [target=$DEFAULT_BASE] [--verify]"
branch_exists "$SOURCE" || die "Source branch '$SOURCE' does not exist."
branch_exists "$TARGET" || die "Target branch '$TARGET' does not exist."
[[ "$SOURCE" != "$TARGET" ]] || die "Source and target are the same branch."
require_clean_tree

ORIGINAL="$(current_branch)"
git switch "$TARGET"
BEFORE="$(git rev-parse HEAD)"

info "Merging '$SOURCE' into '$TARGET'"
if ! git merge --no-ff "$SOURCE" -m "Merge branch '$SOURCE'"; then
  git merge --abort 2>/dev/null || true
  git switch "$ORIGINAL"
  die "Merge conflict. Merge aborted, back on '$ORIGINAL'. Resolve by merging '$TARGET' into '$SOURCE' first."
fi

if [[ "$VERIFY" -eq 1 ]]; then
  info "Verifying merged result"
  if ! "$REPO_ROOT/scripts/check.sh"; then
    git reset --hard "$BEFORE"
    git switch "$ORIGINAL"
    die "Checks failed on the merge. '$TARGET' reset to $BEFORE, back on '$ORIGINAL'."
  fi
fi

ok "Merged '$SOURCE' into '$TARGET' ($(git rev-parse --short HEAD)). Not pushed."
