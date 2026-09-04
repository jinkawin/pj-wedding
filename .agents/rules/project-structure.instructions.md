---
description: "Project structure map and application. Always loaded so agents can target files directly without re-exploring the codebase."
applyTo: "**"
---
# Project Structure & Application Flow

## Root

```
├── src/                    # All application source code
├── public/                 # Static assets served at /
│   ├── images/favicon/     # Favicon files
│   └── locales/            # i18n translation files
│       ├── en/translation.json
│       └── th/translation.json
├── k8s/                    # Kubernetes manifests (dev, sit, uat, prd)
├── certificates/           # TLS certificates
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind CSS config
├── vitest.config.mts       # Test runner config
├── tsconfig.json           # TypeScript config (strict, paths: @/ → ./src/*)
├── next-i18next.config.mjs # i18n config
└── docker-compose.yml      # Local Docker setup
```

## src/ Layout

```
src/
├── app/                    # Next.js App Router (single-page SPA with client-side routing)
├── assets/                 # Static assets (fonts, icons, images, styles)
├── components/             # Shared reusable UI components
├── configs/                # App configuration and feature flags
├── hooks/                  # Custom React hooks
├── libs/                   # Low-level utilities (Axios, i18n, encryption)
├── stores/                 # Jotai atoms (global state)
└── __tests__/              # Vitest test files
```

## src/app/ — Pages (Client-Side SPA)

This app uses a **single route** (`page.tsx`) with internal page state to switch views. Folders prefixed with `_` are "virtual pages" — React components rendered conditionally, **not** file-system routes.

```
src/app/
├── page.tsx                    # Main orchestrator — renders current page based on PageList enum
├── layout.tsx                  # Root layout (Jotai Provider, SWR, I18nextProvider)
├── definitions.ts              # Enums: PageList, Status, OcrReturnDataStatus, etc.
├── actions.ts                  # Server actions
├── response.ts                 # Response data formatter
├── utils.ts                    # Utility functions
├── globals.css                 # Global Tailwind styles
├── not-found.tsx               # 404 page
│
├── _pageA/page.tsx             # Page A
│   ├── ComponentA.ts           # Component A
│   └── usecase.ts              # Business logic
│   └── PageA.d.ts              # Type definitions for this page
├── _pageB/page.tsx             # Page B
│   ├── ComponentB.ts           # Component B
│   └── usecase.ts              # Business logic
│   └── PageB.d.ts              # Type definitions for this page
│
└── api/                        # Server-side API utilities
    ├── api.ts                  # All TypeScript interfaces + API call functions
    └── config/                 # API configuration
```

## src/configs/

```
configs/
├── config.ts           # Environment config (baseUrl, apiUrl, RSA keys, browser versions)
└── themeConfigs.ts     # Theme/branding configuration (IThemeConfigs)
```

## src/hooks/

```
hooks/
├── useSomething.ts         # Custom hook for some functionality
├── useLibraryA.ts          # Custom hook for Library A functionality
└── useLibraryB.tsx         # Custom hook for Library B functionality
```

## src/libs/

```
libs/
├── axios.ts                   # Axios instance with interceptors
└── utils.ts                   # General utility functions
```

## src/components/

```
components/
└── Button/index.tsx            # Shared button component
```

## src/assets/

```
assets/
├── fonts/                 # font family
├── icons/                 # SVG icon components (capture-button, Loading, FailIcon, etc.)
│   ├── iconA/             # Icons for A
│   └── iconB/             # Icons for B
├── images/                # Static images
└── styles/font.css        # @font-face declarations
```

---


## Key Patterns

| Pattern | Location | Purpose |
|---------|----------|---------|
| Business logic in `usecase.ts` | `_compare/`, `_confirmThaicardFront/`, `_dopa/` | Separates API calls from UI |
| Jotai atoms for shared state | `src/stores/atom.ts` | Avoids prop drilling across pages |
| Singleton handshake | `useWebServerHandshake` | One encrypted session per page load |
| postMessage bridge | `usePostMessageBridge` | SDK↔Server encrypted communication |
| i18n everywhere | `public/locales/{en,th}/` | All user-facing text is translated |
| Server actions | `src/app/actions.ts` | Server-side operations |
| Centralized API types | `src/app/api/api.ts` | All interfaces + API functions in one file |

---

## Environment Variables

Defined in `.env` / `.env.local`/ `.env.development` (not committed):
