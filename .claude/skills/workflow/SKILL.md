---
name: workflow
description: Structured task execution process with planning, validation, and iterative feedback. Use when performing any multi-step task, implementing features, fixing bugs, or making code changes. This skill is always active as the execution layer.
---

# Workflow

## Mindset

Never trust assumptions — not the user's requirements nor your own solutions — until validated with evidence.

## Process

### 1. Plan

- Break the task into concrete steps
- Present the plan to the user and **wait for confirmation** before executing
- If a better approach exists than what was requested, present both options with trade-offs

### 2. Execute

- Work through the plan one step at a time
- For multi-step tasks, validate each step before moving to the next

### 3. Validate

Run all applicable checks before marking work as done:

- **Type-check**: `tsc --noEmit`
- **Lint**: `eslint`
- **Run the app**: verify the behavior works as expected

### 4. Prove

Show artifacts as evidence of completion:

- Terminal output (test results, build success, lint passing)
- Code diffs / changed files
- Screenshots or UI preview when relevant

### 5. Confirm

- Ask the user if they want to continue or make adjustments
- If adjustments are needed, return to the relevant step and iterate

## Error Handling

When hitting an error or blocker:

1. Attempt to fix it once autonomously
2. If still blocked, stop and ask the user for guidance — do not loop