# Playwright MCP Test Plan

Scope: end-to-end and exploratory testing of the wedding site (Next.js 16, client-side i18n, MediaPipe photo booth) using Playwright, driven interactively through the Playwright MCP server and then frozen into `@playwright/test` specs.

## 1. Approach

Two layers, one source of truth.

| Layer | Tool | Purpose | Output |
| --- | --- | --- | --- |
| Explore | Playwright MCP (agent-driven, accessibility snapshots) | Discover flows, verify a change works, find selectors | Notes and candidate steps |
| Regress | `@playwright/test` specs in `e2e/` | Deterministic CI runs | Committed specs |

Rule: a flow is only "covered" once an MCP exploration has been converted into a spec that passes headless. The MCP session is the authoring lever. The spec is the artifact a reviewer reruns.

Existing Vitest tests (`sunglassesStrategies.test.ts`) stay for pure logic. Playwright covers only what needs a browser.

## 2. Setup

1. Add dev dependency: `yarn add -D @playwright/test` then `yarn playwright install chromium webkit`.
2. Register the MCP server (project-scoped, `.mcp.json`):
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "yarn",
         "args": ["dlx", "@playwright/mcp@latest", "--caps=vision", "--viewport-size=390x844", "--isolated"]
       }
     }
   }
   ```
   Use `--isolated` so each session starts with empty `localStorage` (the locale key `pj_wedding_locale` persists otherwise).
3. `playwright.config.ts`: `webServer: { command: 'yarn build && yarn start', url: 'http://localhost:3000', reuseExistingServer: true }`, `baseURL`, projects `chromium-desktop` (1280x800), `mobile-chromium` (Pixel 7), `mobile-webkit` (iPhone 14). `trace: 'on-first-retry'`.
4. Add scripts: `e2e`, `e2e:ui`. Use yarn only.
5. Add `.gitignore` entries: `test-results/`, `playwright-report/`.

## 3. Test data and determinism

- Wedding date is `2027-02-27T10:00:00+07:00` (`src/configs/app.ts`). Freeze time with `page.clock.install({ time })` for the countdown. Cover: far future, 1 day before, wedding day, after the event.
- Seating, agenda and gallery come from `src/data/*`. Import these in specs instead of hardcoding guest names.
- Locale: set `localStorage.pj_wedding_locale` via `addInitScript` for per-language runs.
- Animations: landing envelope and petals are CSS-driven. Use `reducedMotion: 'reduce'` in config for stable screenshots, and one dedicated spec without it for the envelope sequence.
- Selectors: prefer role and label (`getByRole`, `getByLabel`). Existing aria-labels: "Open the wedding invitation", "Toggle Navigation Menu", "Search guest or table", gallery close, prev and next. Add `data-testid` only where role queries are ambiguous (seating tables, photo-booth shutter).

## 4. Test matrix

Priority: P0 blocks release, P1 should pass, P2 nice to have.

### 4.1 Landing and invitation (`/`) P0
- Navbar is hidden at `/` and visible elsewhere.
- Click "Open the wedding invitation" opens the envelope, card appears, countdown has `aria-live`.
- "Enter website" control navigates to `/overview`.
- Countdown values at frozen times (see section 3), no negative values after the date.

### 4.2 Navigation P0
- All 8 nav links resolve with no console errors and no 404: overview, agenda, seating, gallery, location, about, register, photo-booth.
- Active link styling follows the route.
- Mobile (<1024px): hamburger toggles the menu, link click closes it.
- Unknown route shows not-found.

### 4.3 i18n P0
- Switch en, th, cn, jp. Heading text changes on overview and nav.
- Choice persists across reload and route change (`pj_wedding_locale`).
- Key parity: every key in `en/translations.json` exists in th, cn, jp. Implement as a Vitest test, not Playwright.
- No raw key strings (pattern like `nav.overview`) visible on any page in any locale. Sweep all routes x 4 locales.

### 4.4 Agenda P1
- Event cards render from `agendaData`, in time order, with time pills.
- Add-to-calendar: ICS download fires with filename `wedding-parima-jinkawin.ics` and contains `DTSTART` matching the config date. Google link opens with correct params.

### 4.5 Seating P0
- Search by guest name highlights the table and opens the details card with the guest highlighted.
- Search by table name or number.
- No-result state, clear button resets.
- Category filter chips narrow tables.
- List view vs map view toggle if present.
- Keyboard: search is reachable, Enter and Escape behave.

### 4.6 Gallery P1
- Grid renders all `galleryData` items.
- Open lightbox, next and prev wrap, close button and Escape close, focus returns to the thumbnail.
- No broken images (`naturalWidth > 0`) after scroll.

### 4.7 Location P1
- Venue name and date text from config.
- Maps iframe `src` equals `mapsEmbedUrl`. Stub the iframe network call in CI.
- Direct maps link has `target="_blank"` and `rel` containing `noopener`.

### 4.8 Register (RSVP) P0
- Required name validation blocks submit.
- Submit with attending and with declined shows the thank-you state using nickname, then name, then "Guest" as fallback.
- Followers count bounds (min 1, non-numeric, large value).
- Party groom or bride selection retained.
- "Edit response" returns to the form. Check whether the form keeps its values.
- Assert no network request is made on submit (current spec: client-only).

### 4.9 Photo booth (`/photo-booth`) P0 and P1
Hardest area: camera, WASM and model downloads from `cdn.jsdelivr.net` and `storage.googleapis.com`.

Environment for CI:
- Chromium flags `--use-fake-ui-for-media-stream --use-fake-device-for-media-stream` with `--use-file-for-fake-video-capture=e2e/fixtures/face.y4m` (a face fixture). Grant `camera` permission in context.
- Route-intercept the CDN WASM and `.task` model files to local fixtures (`page.route`) so runs are offline and fast. One nightly job hits the real CDN.

Cases:
- P0 permission granted: camera view renders video with non-zero dimensions, loading state clears when the landmarker is ready.
- P0 permission denied: friendly error, no crash, retry works.
- P0 model download failure (route abort): error state, page still usable.
- P0 capture: shutter produces an image in the captured gallery, with a canvas of expected size.
- P1 frame selector, polaroid style selector, and each sunglasses/hat option switch the active style (assert state through UI, not internals).
- P1 captured gallery: download or delete, and ordering.
- P1 hand gesture: heart, high-five, OK, victory. Cannot be driven by a static face fixture. Cover strategy math in Vitest and keep a manual checklist for real-camera gestures.
- P2 performance: detector keeps the page responsive (no long tasks over 200 ms during idle in a 10 s trace).

### 4.10 Cross-cutting P1
- Accessibility: `@axe-core/playwright` scan on every route in en and th. Zero serious or critical violations.
- Console and page errors: fail any spec on `pageerror` or `console.error` (fixture-level).
- Responsive: 360, 390, 768, 1280 widths, no horizontal scroll (`scrollWidth <= clientWidth`) on every route.
- Visual: screenshot snapshots for overview, agenda, seating, register at mobile and desktop, `maxDiffPixelRatio: 0.01`, reduced motion. Linux CI baselines only.
- SEO and meta: `<title>`, `lang` attribute matches the selected locale (known risk: `layout.tsx` may hardcode `lang`).
- Security headers and `target="_blank"` links.

## 5. Playwright MCP workflow

Per feature or bug:
1. `yarn dev`, then start a Playwright MCP session (`--isolated`).
2. `browser_navigate` to the route, `browser_snapshot` to read the accessibility tree. Prefer snapshots over screenshots for assertions.
3. Walk the flow with `browser_click`, `browser_type`, `browser_fill_form`, `browser_press_key`. Record each role and name used.
4. Check `browser_console_messages` and `browser_network_requests` after the flow. Any error or unexpected request is a finding.
5. Resize with `browser_resize` to 390x844 and repeat for mobile.
6. For bugs: reproduce in MCP first, capture the failing snapshot, fix, rerun the same steps.
7. Convert the exploration into a spec in `e2e/<area>.spec.ts` using the recorded roles and names. Run `yarn e2e` headless. The spec must fail before the fix and pass after for bug work.

Prompt template for the agent:
> Using Playwright MCP against http://localhost:3000, test the <area> flow: <steps>. Report snapshot evidence, console errors and network failures. Do not edit code. Then propose the equivalent `@playwright/test` spec.

Limits to know:
- MCP uses accessibility snapshots, so canvas content (photo booth overlays, sunglasses rendering) is invisible to it. Use `--caps=vision` screenshots or pixel assertions in specs.
- The fake camera is Chromium only. WebKit and Firefox photo-booth runs are limited to permission-denied and unsupported-browser paths.

## 6. Layout

```
e2e/
  fixtures/        face.y4m, mediapipe model stubs, test.ts (console-error guard, locale helper)
  landing.spec.ts
  navigation.spec.ts
  i18n.spec.ts
  agenda.spec.ts
  seating.spec.ts
  gallery.spec.ts
  location.spec.ts
  register.spec.ts
  photo-booth.spec.ts
  a11y.spec.ts
  visual.spec.ts
playwright.config.ts
```

## 7. CI

- PR job: `yarn lint`, `yarn test`, `yarn build`, `yarn e2e --project=chromium-desktop --project=mobile-chromium` (P0 and P1, CDN stubbed). Upload `playwright-report/` and traces on failure.
- Nightly job: all projects incl. webkit, real CDN photo-booth smoke, visual diffs.
- Flake policy: retries 2 in CI, a spec that needed a retry is reported, quarantine after 3 flaky runs in a week.

## 8. Rollout order

1. Config, MCP registration, console-error fixture, navigation and landing specs.
2. Register, seating, i18n sweep (the pure-logic P0s).
3. Photo booth with fake camera and model stubs.
4. Agenda, gallery, location, a11y, responsive.
5. Visual baselines and nightly job.

## 9. Exit criteria

- All P0 cases pass on chromium-desktop and mobile-chromium in CI, three consecutive runs.
- Zero serious axe violations, zero console errors across the route sweep.
- Photo booth P0 passes offline against stubs.
- Each fixed bug has a spec that fails on the pre-fix commit.

## 10. Open questions

- Is `lang` on `<html>` updated on locale change? Decide whether to assert it.
- Should RSVP eventually post to a backend? Specs currently assert no request.
- Which device matrix matters most for guests (iOS Safari camera behaves differently from Chromium)? Real-device manual pass before the event is recommended.
