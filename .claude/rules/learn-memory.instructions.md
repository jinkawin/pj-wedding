---
description: "Persistent reusable learnings for future chats. Use when a session uncovers a recurring docs rendering pattern, schema contract, or workflow detail that should survive across agents."
applyTo: "**"
---

# Learn Memory (persistent)

Use this guidance whenever a task produces a reusable pattern that should survive future chats or new agent sessions.

## Core rule

When a user asks to remember something, or when the /learn prompt is used, capture the knowledge in a concise, reusable form and keep it in session memory.

## Required structure

Each saved note should include:

- Problem: what was wrong or missing
- Root cause: why it happened
- Reusable pattern: exact snippet, convention, or rule to reuse
- Files / context: relevant file names or modules
- When to reuse: the scenario where this should be applied again

## Documentation-specific pattern

If the task involves markdown docs, API references, or rendered tables:

- Use field labels with type metadata such as `<p type="string">transactionId</p>`
- Keep the first-column label visually aligned with the same pattern used by the canonical Liveness docs
- Use linked field labels when the field maps to a shared external spec, for example:
  - `<p type="string"><a href="/developer/documentation/face-recognition-api/api-specification/common-specification/error-code-table">errorCode</a></p>`
- Prefer the canonical schema as the source of truth for field names and types
- Do not treat docs styling or link placement as cosmetic-only changes; these are part of the documentation contract

## Memory behavior

- Prefer updating the relevant memory note instead of creating unrelated notes
- Keep the note short and actionable
- Save the exact reusable snippet so the next session does not need to rediscover it
- If a learning is broadly reusable, mirror a short version to the Copilot instruction folder so future agents read it automatically

## Examples of reusable learnings

- Shared markdown renderer fix for first-column width and wrapping
- Type verification against canonical docs rather than guessing from screenshots or UI-only output
- Linked field labels inside docs tables for external error-code reference pages
- Keep a stable docs contract across SDK and liveness references
