---
name: dry-principle
description: Enforce DRY (Don't Repeat Yourself) in TypeScript/JavaScript. Use when writing, reviewing, or refactoring code to eliminate redundant logic and centralize knowledge.
---

# DRY Principle

Every piece of **business logic or domain knowledge** should have a single, authoritative representation. If the same logic exists in more than one place, a change to requirements forces multiple edits — increasing bugs and inconsistency.

## When to Apply

- Same condition/check in multiple functions
- String, number, or config value hardcoded in multiple places
- Two or more services with nearly identical CRUD operations
- Validation duplicated between client and server
- Same business rule expressed in multiple functions

## When NOT to Apply

- Code looks similar now but will **evolve differently** (accidental duplication)
- Abstraction adds **more complexity** than the duplication
- Code is **small or experimental** — simplicity matters more than reuse

> **Key distinction:** *Syntax duplication* (same `for` loop in unrelated functions) is acceptable. *Knowledge duplication* (same business rule in multiple places) must be eliminated.

## Decision Checklist

Before writing or submitting code, ask:

1. **Am I repeating a check or condition?** → Extract a helper function
2. **Am I hardcoding a value in more than one place?** → Declare a named constant
3. **Do two services do nearly the same thing?** → Create a generic base class
4. **Is this validation on both client and server?** → Move it to a shared module
5. **Do functions share long parameter lists?** → Use an options object (TypeScript interface)
6. **Is this a business rule or just common syntax?** → Only business rules must be centralized
7. **Will these two pieces of code evolve differently?** → Keep them separate (WET is correct)

## Common Violations

- Copy-pasted logic across methods/classes → multiple change points when requirements evolve
- Repeated business rules across layers (controller → service → DAO) → inconsistency and tight coupling
- Hardcoded values scattered across files → error-prone updates
- Duplicated validation between client and server → guaranteed divergence

See [REFERENCE.md](REFERENCE.md) for detailed before/after code examples.