# Agent guide — automationexercise.com test framework

## Where things go

| Concern | Location |
|---|---|
| UI specs | `tests/ui/*.spec.ts` |
| Direct API specs | `tests/api/*.spec.ts` |
| Shared fixtures (API clients, user lifecycle, login) | `tests/support/fixtures.ts` |
| Page objects | `src/pages/` |
| API clients | `src/api/` |
| Test data factories / known catalogue anchors | `src/data/` |
| Auth helpers | `src/auth/` |
| Base URL / env | `src/config/env.ts` |

## Conventions

1. Import `test` / `expect` from `tests/support/fixtures` (not `@playwright/test`) so API + user fixtures are available.
2. Prefer `[data-qa=...]` locators; fall back to roles / stable ids (`#search_product`, `data-product-id`).
3. Assert practice-API outcomes via JSON `responseCode`, not HTTP status alone.
4. Create users with `buildTestUser()` + `AccountApi` (or the `apiUser` / `authenticatedUser` fixtures). Do not rely on hand-made shared accounts.
5. Clean up users with `AccountApi.deleteAccount` (fixtures already do this).
6. No `page.waitForTimeout()`. No Playwright `retries` to mask flakes.
7. Chromium only (`playwright.config.ts` projects).
8. Use `gotoApp()` from `src/support/demoSite.ts` for navigations (handles demo-site overload page once).
9. Keep concurrency low against the shared demo site (`workers: 1` by default).

## Local setup for a fresh clone

```bash
npm install   # installs deps + Chromium (postinstall)
npm test
```

Do not require a separate `npx playwright install` step for normal use.

Reports: Playwright HTML via `npm run report`. Allure via `npm run allure:report` / `allure:serve` (Java 17+ required only for Allure UI).

## How to add a test

1. Choose `tests/ui` or `tests/api`.
2. Reuse fixtures (`productsApi`, `accountApi`, `apiUser`, `authenticatedUser`).
3. Reuse or extend a page object / API client instead of inlining selectors or URLs in the spec.
4. Keep business intent obvious in the `test(...)` title.

## Auth model (why)

The site uses a Django `sessionid` cookie. Default strategy is **API create user → UI login per test → API delete user**. This keeps state explicit. `storageState` can be introduced later using `src/auth/uiLogin.ts` without rewriting pages.
