---
name: code-convention
description: Enforce code conventions for Next.js, React, and TypeScript projects. Use when writing components, naming files/variables, structuring folders, defining types, or reviewing code style.
---

# Code Convention

## Naming

| Convention | Example | Usage |
|------------|---------|-------|
| camelCase | `getUserData` | folders, files, functions, front-end variables |
| PascalCase | `UserProfile` | React components, component file names |
| UPPER_CASE | `ORDER_STATUS` | enums, constants |
| kebab-case | `user-avatar` | CSS classes, assets, branch names |
| snake_case | `user_name` | back-end variables (API/DB field names) |

Rules:
- Functions start with a verb: `get`, `set`, `handle`, `fetch`, `validate`
- Booleans start with `is`, `has`, `should`: `isLoading`, `hasPermission`
- Interfaces prefixed with `I`: `IUser`, `IField`
- Use meaningful names; no abbreviations except common ones (`URL`, `HTML`, `ID`)

## Components

- Functional components with arrow syntax by default
- Destructure props in parameters
- `.tsx` extension for all component files

```tsx
const UserCard = ({ name, email }: IUserCardProps) => {
  return <div>{name}</div>;
};
```

## State & Hooks

Type `useState` explicitly:

```tsx
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<IUser | null>(null);
```

## Conditional Rendering

- Ternary for simple: `{isAuth ? <App /> : <Login />}`
- Extract complex logic into named functions
- Avoid nested ternaries

## Control Flow

- Max 2 levels of nesting — refactor with early returns if deeper
- Prefer `if/else` over deeply nested ternaries

```tsx
// Good: early return
if (!data) return <Loading />;
if (error) return <Error />;
return <Content data={data} />;
```

## Types & Interfaces

- **Interfaces** for object shapes
- **Types** for unions, intersections, aliases

```ts
interface IUser {
  id: number;
  name: string;
}

type Status = 'Active' | 'Inactive';
```

## Project Structure

See [REFERENCE.md](REFERENCE.md) for the full Next.js folder structure convention.
