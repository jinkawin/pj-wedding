#!/usr/bin/env bash
# Hook: Stop — run yarn build only when ≥5 files were changed in this session.
# Uses git to count uncommitted changed files.

set -euo pipefail

THRESHOLD=5

# Count staged + unstaged changed files (tracked and untracked new files)
CHANGED_COUNT=$(git diff --name-only HEAD 2>/dev/null | wc -l | tr -d ' ')
UNTRACKED_COUNT=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')
TOTAL=$((CHANGED_COUNT + UNTRACKED_COUNT))

if [ "$TOTAL" -ge "$THRESHOLD" ]; then
  echo "ℹ️  $TOTAL files changed (≥$THRESHOLD). Running yarn build..."
  yarn build 2>&1 | tail -30
  EXIT_CODE=${PIPESTATUS[0]}

  if [ "$EXIT_CODE" -ne 0 ]; then
    echo '{"systemMessage": "❌ yarn build failed. Review build errors before pushing."}'
    exit 0
  fi

  echo '{"systemMessage": "✅ yarn build succeeded."}'
else
  echo "ℹ️  $TOTAL files changed (<$THRESHOLD). Skipping yarn build."
fi

exit 0
