---
name: security
description: Enforce web security best practices for Next.js, React, and Docker projects. Use when writing API routes, handling cookies, configuring HTTP headers, validating user input, building Docker images, or reviewing code for security vulnerabilities.
---

# Security

## Authentication & Authorization

- Use secure session management; prefer server-side sessions or signed JWTs with short expiry
- Encrypt sensitive data at rest and in transit using AES-256 minimum — use the internal `@kx2024/cryptography` library (see Encryption section below)
- Never expose secrets in client-side code or React components; use server-only environment variables (`NEXT_PUBLIC_` prefix leaks to client)

## Input Validation

- Validate all input server-side (API routes, Server Actions) regardless of client-side validation
- Sanitize user input before rendering to prevent XSS — use React's built-in escaping; avoid `dangerouslySetInnerHTML`
- Validate request bodies with a schema library (e.g., zod) in Next.js API routes and Server Actions

## Cookies

Set all security attributes on cookies:

- `HttpOnly` — prevents client-side script access (mitigates XSS theft)
- `Secure` — transmit only over HTTPS
- `SameSite=Strict` or `Lax` — prevents CSRF by restricting cross-site sending

```ts
// Next.js API route example
import { cookies } from 'next/headers';

cookies().set('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24,
});
```

## HTTP Security Headers

Configure in `next.config.js` under `headers()`:

| Header | Purpose |
|--------|---------|
| `Strict-Transport-Security` | Force HTTPS connections |
| `X-Content-Type-Options: nosniff` | Prevent MIME-sniffing attacks |
| `Content-Security-Policy` | Restrict executable content sources |
| `Cache-Control` | Control caching of sensitive responses |
| `X-Frame-Options: DENY` | Prevent clickjacking |

```js
// next.config.js
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ],
  }];
}
```

## React & Hooks

- Never store tokens or secrets in React state or localStorage; use httpOnly cookies
- Avoid leaking sensitive data through custom hooks that expose internal state publicly
- Use `useEffect` cleanup to abort pending authenticated requests on unmount

## Docker

- Use multi-stage builds to exclude dev dependencies and source from production images
- Run containers as non-root user (`USER node`)
- Never bake secrets into images; use runtime environment variables or secret mounts
- Pin base image versions (avoid `latest` tag) and scan images for vulnerabilities
- Add `.dockerignore` to exclude `.env`, `node_modules`, `.git`

## Dependency Management (Yarn)

- Audit dependencies regularly with `yarn audit`
- Use `yarn.lock` to pin exact versions; review lockfile changes in PRs
- Avoid installing packages with known vulnerabilities; check before adding

## Encryption

Use the internal `@kx2024/cryptography` library for all encryption needs (AES-256-GCM, ECDH Curve25519).

- Never expose encryption keys to the client
- Store keys in server-only env vars (no `NEXT_PUBLIC_` prefix)
- Generate keys with `cryptoLib.AES.generateAES256Key()`

See [REFERENCE.md](REFERENCE.md) for full API reference and implementation examples.

> **Important**: Never expose `AES_ENCRYPTION_KEY` to the client. Keep it in server-only env vars (no `NEXT_PUBLIC_` prefix). Generate keys using `cryptoLib.AES.generateAES256Key()` and store securely.