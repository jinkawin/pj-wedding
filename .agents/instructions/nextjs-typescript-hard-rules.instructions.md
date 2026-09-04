---
description: "Use when implementing or refactoring Next.js React TypeScript code in this repo. Enforces hard rules for typing, component boundaries, imports, and predictable structure."
name: "Next.js TypeScript Hard Rules"
applyTo: "src/**/*.{ts,tsx}"
---
# Next.js TypeScript Hard Rules

- Treat these as hard rules for new and modified code.
- Keep TypeScript strict. Avoid `any`; only use it with an explicit justification comment and a follow-up TODO.
- Use `@/` imports for internal modules under `src` instead of long relative paths.
- Default to Server Components in `src/app`. Add `use client` only when using browser APIs, event handlers, or React client hooks.
- Keep route files focused on composition. Move business logic to `usecase.ts`, hooks, or libs.
- Prefer early returns and clear guard clauses over deep nesting.
- Preserve existing naming conventions:
  - camelCase for variables and functions
  - PascalCase for React components and component file names
- Use `yarn` exclusively for all package management, script execution, building, and development operations (never `npm` or `npx`).

