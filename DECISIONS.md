# Architectural decisions

Focus: choices that keep this framework small, evidence-based, and easy for an AI coding agent to extend.

---

## Decision 1 — Assert practice APIs via JSON `responseCode`

## Decision
API clients parse JSON and tests assert `responseCode` / `message` (and payload fields). HTTP transport success is checked, but business outcomes are not inferred from HTTP status alone.

## Alternatives Considered
- Treat HTTP status codes as the source of truth (as in many REST style guides).
- Dual-assert HTTP status and body without documenting the quirk.

## Why
Exploration showed these endpoints frequently return HTTP `200` with logical outcomes such as `400`, `404`, or `405` inside JSON. Asserting only HTTP status would create false greens and teach agents the wrong contract. Encoding the quirk in `ApiClient` makes every new API test inherit the correct model.

## Reversal Trigger
Change if the application starts returning accurate HTTP statuses for practice APIs and documents that as the contract — then prefer standard HTTP assertions and simplify the client.

---

## Decision 2 — API create/delete + per-test UI login (no default `storageState`)

## Decision
Provision users with `AccountApi.createAccount`, authenticate with `loginViaUi`, and delete with `AccountApi.deleteAccount` (fixtures: `apiUser`, `authenticatedUser`). Do not commit or default to shared Playwright `storageState` files.

## Alternatives Considered
- Global setup that writes `.auth/user.json` and reuses `storageState` across UI tests.
- Fully UI signup for every test (slower, more brittle form coverage duplication).
- Manually curated shared demo accounts.

## Why
The app’s real session is a Django `sessionid` cookie. Per-test provisioning keeps dependencies explicit (agent-readable: create → login → act → delete), avoids stale shared auth files, and prevents collisions on a public demo site. UI signup remains available via page objects when signup UX itself is under test; API setup is used when session behavior or checkout is the focus.

## Reversal Trigger
Adopt `storageState` (generated from `loginViaUi`) if suite runtime or demo-site rate limits make per-test login a measured bottleneck — without changing page objects.

---

## Decision 3 — Separate `tests/api` vs `tests/ui` with matching Playwright projects

## Decision
Place direct API specs under `tests/api` and UI/hybrid specs under `tests/ui`, wired to `chromium-api` and `chromium-ui` projects. Document that API-for-setup is not API coverage.

## Alternatives Considered
- Single flat `tests/` directory mixed by feature only.
- Tag-only separation (`@api` / `@ui`) without folder boundaries.

## Why
Folder + project boundaries make ownership obvious to agents (“where does a new API assertion go?”) and keep `npm run test:api` / `test:ui` trivial. The assignment requires at least one direct API test; the boundary prevents setup calls from being mistaken for coverage.

## Reversal Trigger
Merge folders only if the suite grows large enough that feature-sliced packages (e.g. `tests/checkout/{ui,api}`) become clearer than layer-sliced packages — and update `AGENTS.md` in the same change.

---

## Decision 4 — Thin page objects + fixture entrypoint (no deep base hierarchy)

## Decision
Use small page objects for locators/actions, factories in `src/data`, and a single fixture module as the test entrypoint. Avoid BasePage hierarchies, DI containers, and custom world/context frameworks.

## Alternatives Considered
- Classic BasePage + inheritance tree for every screen.
- Screenplay/actor pattern.
- Path aliases (`@pages/*`) requiring extra resolver config.

## Why
For a take-home-sized suite, deep abstractions hide state and force agents to read more files before making a safe change. Relative imports and one fixture file maximize discoverability. Comments record non-obvious *why* (e.g. month select values, `responseCode` behavior) instead of restating code.

## Reversal Trigger
Introduce a shared `BasePage` (or aliases) only after three or more pages share non-trivial navigation/wait helpers that would otherwise be copy-pasted — measured duplication, not anticipation.

---

## Decision 5 — Chromium-only local runner; CI/CD deferred

## Decision
Configure Playwright for Chromium only, optimized for local execution with list + HTML reporters and failure artifacts. Do **not** add CI workflows in this repository (assignment out of scope).

## Alternatives Considered
- Multi-browser matrix (Firefox/WebKit) in-repo now.
- Shipping GitHub Actions / Azure Pipelines as part of the take-home.

## Why
Assignment scope is Chromium and local execution. Extra browsers and CI YAML increase surface area without proving framework judgment. Keeping CI out of tree avoids pretending production pipeline maturity that was not validated.

### Future CI/CD (not implemented)

A later addition could:

1. Run `npm ci`, `npx playwright install chromium`, `npm run typecheck`, `npm test` on PRs.
2. Upload `playwright-report/` and `test-results/` artifacts on failure.
3. Set `CI=1` so Playwright’s `forbidOnly` applies.
4. Optionally gate `test:api` and `test:ui` as separate jobs.

## Reversal Trigger
Add CI when the project is adopted beyond the take-home (shared remote, PR review gate, or scheduled runs against the demo site) — start with a single Chromium job mirroring the local commands above.
