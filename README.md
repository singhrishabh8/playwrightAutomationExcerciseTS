# Automation Exercise — Playwright + TypeScript

Agentic-first Playwright test framework for [automationexercise.com](https://automationexercise.com/). Scoped for a take-home assignment: Chromium only, deep UI + API coverage, predictable layout for humans and coding agents.

## Prerequisites

Only **Node.js 20+** (includes npm). No secrets, env files, or manual browser installs.

`npm install` also downloads Playwright’s Chromium via a `postinstall` script.

## Setup

```bash
git clone https://github.com/singhrishabh8/playwrightAutomationExcerciseTS.git
cd playwrightAutomationExcerciseTS
npm install
npm test
```

That’s the full local path for a new engineer: clone → install → run.

### Configuration (optional)

No secrets are required. Optional override:

| Variable   | Default                           | Purpose        |
|-----------|------------------------------------|----------------|
| `BASE_URL` | `https://automationexercise.com` | Application host |

Example (PowerShell):

```powershell
$env:BASE_URL = "https://automationexercise.com"
```

## Running tests

```bash
# Full suite
npm test

# UI project only / API project only
npm run test:ui
npm run test:api

# Headed / debug
npm run test:headed
npm run test:debug

# Typecheck
npm run typecheck
```

### Run a specific test

```bash
npx playwright test tests/ui/checkoutPurchase.spec.ts
npx playwright test -g "logs in, logs out"
```

### Reports

**Playwright HTML** (no extra runtime beyond Node):

```bash
npm run report
```

Written to `playwright-report/`. Failures also retain trace, screenshot, and video under `test-results/` (`trace: retain-on-failure`).

**Allure** (needs a local **Java 17+** JRE/JDK to generate/open the dashboard):

```bash
# After npm test — generate + open
npm run allure:report

# Or serve results directly (temp server)
npm run allure:serve
```

Raw results land in `allure-results/`; the generated site is `allure-report/`.  
If you only need a report and don’t have Java installed, use `npm run report` (Playwright HTML).

API calls (via `ApiClient`) attach to each Allure step:
- `request.curl` — pasteable curl (passwords redacted)
- `response.json` — parsed JSON body
- `response.meta.txt` — HTTP status + final URL

## Project structure

```
src/
  api/          Practice API clients (AccountApi, ProductsApi) + response parsing
  auth/         UI login helper
  config/       BASE_URL
  data/         User factory, known products, dummy payment card
  pages/        Page objects (data-qa / role-first locators)
tests/
  api/          Direct API specs (assert JSON responseCode)
  ui/           UI / hybrid specs
  support/      Playwright fixtures (clients, apiUser, authenticatedUser)
AGENTS.md       Where-to-put-what for coding agents
DECISIONS.md    Important architectural decisions
AI_USAGE.md     AI collaboration log (fill in engineer sections)
```

## Architecture

- **Playwright Test + TypeScript**, Chromium only (`chromium-ui` / `chromium-api` projects).
- **Thin page objects** own locators and user actions; specs own business assertions.
- **API clients** wrap `/api/*` practice endpoints. Outcomes are asserted via JSON `responseCode` because HTTP status is often `200` even for logical errors.
- **Fixtures** (`tests/support/fixtures.ts`) expose `accountApi`, `productsApi`, `apiUser`, and `authenticatedUser` so tests import one `test`/`expect` entrypoint.
- **Agent-native defaults**: predictable folders, no path-alias toolchain, comments explain non-obvious *why*, `AGENTS.md` for extension guidance.

## Authentication strategy

The app uses a Django `sessionid` cookie (plus CSRF on form posts).

Default flow:

1. Create a unique user with `POST /api/createAccount`
2. Log in through the UI (`src/auth/uiLogin.ts`)
3. Delete the user with `DELETE /api/deleteAccount` in fixture teardown

Per-test login keeps session state explicit. Shared `storageState` was deferred; it can be added later using the same UI login helper without rewriting page objects.

## Test-data strategy

- **Users**: `buildTestUser()` generates unique emails (`qa.agent.<stamp>@example.com`). No hand-maintained shared accounts.
- **Products**: `KNOWN_PRODUCTS` anchors stable catalogue ids (e.g. Blue Top `id=1`) discovered during exploration.
- **Payment**: `DUMMY_CARD` — practice checkout accepts dummy card data; no real processor.

## UI / API testing strategy

| Layer | Use for |
|-------|---------|
| **Direct API tests** (`tests/api`) | Contract of practice APIs: create/verify/delete account, catalogue, search, negatives |
| **API as setup/cleanup** | Fast, deterministic users for UI flows (does **not** count as API coverage alone) |
| **UI tests** (`tests/ui`) | Session UX, search results, cart line math, checkout addresses, order confirmation |
| **Hybrid** | API user + UI purchase; UI search cross-checked against `/api/searchProduct` |

Cart/checkout/payment have **no** documented JSON APIs — those paths stay UI.

## Test inventory

| Spec | Intent |
|------|--------|
| `tests/api/account.api.spec.ts` | Account lifecycle + negative verifyLogin |
| `tests/api/products.api.spec.ts` | Catalogue, search, negative contracts |
| `tests/ui/auth.spec.ts` | Login, logout, invalid credentials |
| `tests/ui/productSearch.spec.ts` | UI search aligns with API search |
| `tests/ui/checkoutPurchase.spec.ts` | Authenticated cart → checkout → payment → ORDER PLACED |
| `tests/ui/home.smoke.spec.ts` | Primary nav smoke |

## Known limitations

- Shared public demo site: ads, third-party scripts, email collisions, and intermittent **"under heavy load (queue full)"** responses.
- Suite defaults to `workers: 1` and aborts common ad hosts to reduce self-induced overload and vignette click-intercepts.
- Practice APIs often return HTTP 200 with the real outcome in `responseCode`.
- `/api/brandsList` is not a unique brand master (duplicate brand names / product-linked rows).
- Search for `top` is broader than name substring matching.
- Grand total appears on **checkout** review, not on `/view_cart`.
- Checkout order comment is not relied on (Place Order is a navigation link).
- Payment and invoice ids are practice-only (`/payment_done/{totalAmount}`).
- CI/CD is intentionally out of scope (see `DECISIONS.md` for a future outline).

## Extending the suite

See `AGENTS.md` for conventions. Short path:

1. Put the spec in `tests/ui` or `tests/api`
2. Import `test` / `expect` from `tests/support/fixtures`
3. Reuse or extend `src/pages/*` and `src/api/*`
4. Prefer `data-qa` locators; avoid `waitForTimeout` and retries-as-flake-hiding
