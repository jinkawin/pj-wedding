---
description: 'Capture reusable learnings and save them to the session memory for future chats.'
argument-hint: ""
tools: []
---

# Learn and remember

Use the current task as the source of truth and save a concise, reusable note to the session memory so it survives future chat sessions.

Requirements:
- Identify the actual problem, root cause, and the final working pattern.
- Keep the note short and actionable, not a long narrative.
- Record the exact reusable pattern, snippet, or convention that should be reused later.
- Prefer updating the existing relevant memory note instead of creating unrelated notes.
- Include the key files involved and the reason they matter.
- If the task is about docs or markdown rendering, include the final field-label / link pattern and the styling rule that made it work.
- If the task is technical, include the root cause and the fix path.
- Do not add fluff or generic process notes.
- Write the result in a form the next new chat session can understand without re-deriving context.

Output format:

## Problem
[What was wrong or missing]

## Root cause
[Why it happened]

## Reusable pattern
[The exact rule, code snippet, or convention to reuse]

## Files / context
[Relevant file names or module names]

## When to reuse
[When this should be applied again]
