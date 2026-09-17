#!/usr/bin/env bash
# Hook: PostToolUse — run yarn lint after any file edit.
# Stdin receives JSON with tool info; we only lint after edit tools.

set -euo pipefail

INPUT=$(cat)

# Detect if the tool was a file-editing operation
TOOL_NAME=$(echo "$INPUT" | grep -oP '"toolName"\s*:\s*"\K[^"]+' 2>/dev/null || true)

EDIT_TOOLS="replace_string_in_file|multi_replace_string_in_file|create_file|edit_notebook_file"

if [[ "$TOOL_NAME" =~ ^($EDIT_TOOLS)$ ]]; then
  yarn lint --quiet 2>&1 | tail -20
  EXIT_CODE=${PIPESTATUS[0]}

  if [ "$EXIT_CODE" -ne 0 ]; then
    echo '{"systemMessage": "⚠️ yarn lint found issues. Please review and fix lint errors before continuing."}'
    exit 0
  fi
fi

# No output = continue normally
exit 0
