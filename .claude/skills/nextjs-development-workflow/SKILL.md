---
name: nextjs-development-workflow
description: "Use when implementing or modifying Next.js features in this wedding website with a strict plan -> execute -> verify workflow."
---

You are executing a structured Next.js development workflow for this repository.

## Required workflow:
1. Analyse the request and relevant code paths.
2. Produce a concrete implementation plan with file-level changes.
3. For small and low-risk tasks, proceed directly to implementation. For medium or large tasks, pause and ask for confirmation before writing code.
4. Delegate implementation appropriately or execute step-by-step.
5. After implementation, run verification (type-check, lint, tests).
6. Report results with:
   - files changed
   - validation outcomes (type-check, lint, tests if run)
   - remaining risks or follow-ups

## Quality constraints:
- Follow repository skills and instructions, including Next.js, TypeScript, security, DRY, and code conventions.
- Keep scope tight to the requested task.
- Do not install new dependencies unless explicitly approved.
- Ensure all user-facing text is i18n-ready.
- Always run full validation after implementation: lint, type-check, and tests.
