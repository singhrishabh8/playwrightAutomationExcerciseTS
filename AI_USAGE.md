# AI_USAGE.md

How AI was used while building this take-home framework for [automationexercise.com](https://automationexercise.com/).

This log is based on the actual Cursor Agent session used for the assignment. I did not use a separate ChatGPT / Copilot session for implementation.

---

## AI tools used

| Tool | How it was used |
|------|-----------------|
| **Claude** | Drafted the phased operating brief (`SPEC.md`) before implementation — exploration → architecture → tests → docs → final review |
| **Cursor Agent** | Primary collaborator for exploration, architecture, tests, and docs, executing against `SPEC.md` |
| **Playwright MCP / browser tooling** (inside Cursor) | Live UI exploration, DOM snapshots, network inspection, and practice-API `fetch` checks against the real site |
| **Local terminal via the agent** | `npm install`, Playwright Chromium install, `tsc --noEmit`, full suite runs |

Claude was used for planning/`SPEC.md` authoring. Implementation work in this repository was done with Cursor Agent under that spec.

---

## How I directed the AI (working method)

I treated coding agents like junior staff engineers under review, not as unsupervised code generators.

1. I used **Claude** to help author an operating brief (`SPEC.md`) that forced **phased work**: explore → architecture → tests → docs → final review. I reviewed and owned that brief before any framework code was written.
2. I executed the brief with **Cursor Agent**, advancing phases only with `CONTINUE`.
3. Each phase required a summary, decisions, validation, and risks — then an explicit stop.
4. I required evidence from the live app (no invented endpoints or selectors).
5. I required real command execution before claiming tests passed.

That process mattered more than any single prompt: it kept scope tight and made AI mistakes visible through failing runs instead of silent wrong assumptions.

---

## Prompts used

### Planning with Claude (`SPEC.md`)

Exact prompt I used with Claude (after attaching / pasting the Keychain take-home PDF):

```text
You are helping me, a QA Staff Engineer candidate, plan a take-home assignment.

Context:
- Assignment: build an agentic-first Playwright + TypeScript test framework
- App under test: https://automationexercise.com/
- Submission needs: working tests (3–5 deep ones covering Signup/Auth, Product Discovery, Checkout), UI + API coverage, README, DECISIONS.md, AI_USAGE.md
- Out of scope: CI/CD implementation, full coverage, performance/load, multi-browser, modifying the app
- Reviewers care about engineering judgment and how easily another human or AI agent can extend the framework

Your task:
Write a single operating document (SPEC.md) that I will give to a coding agent (Cursor) to execute the work.

Requirements for SPEC.md:
1. Force phased delivery. Suggested phases:
   - Phase 1: explore the live app (UI + network/API evidence only) and propose a small test matrix
   - Phase 2: architecture + minimal framework scaffolding, validate install/typecheck/smoke
   - Phase 3: implement 3–5 deep tests (not many shallow ones)
   - Phase 4: README, DECISIONS.md, AI_USAGE.md
   - Final review checklist
2. At the end of every phase the agent must summarize discoveries/decisions/validation/risks, then STOP and wait for my explicit CONTINUE.
3. Hard rules:
   - Do not invent endpoints, selectors, routes, or test results
   - Prefer evidence from DOM/network/executed tests over assumptions
   - No page.waitForTimeout()
   - No retries used to hide flaky tests
   - Prefer stable semantic locators (e.g. data-qa / roles)
   - Avoid unnecessary abstractions and dependencies
   - Keep scope take-home-sized, not enterprise over-engineering
4. “Agentic-first” is intentionally open-ended — do not prescribe a bloated architecture. Tell the agent to inspect the app first, then choose pragmatic patterns and defend them.
5. Require both UI tests and at least one direct API test. Using API only for setup does not count as API coverage.
6. Auth and test-data strategies must be chosen from observed app behavior.
7. DECISIONS.md format must include: Decision, Alternatives Considered, Why, Reversal Trigger.
8. AI_USAGE.md must include real prompts/responses/corrections and at least one AI mistake I caught.

Output:
- Produce SPEC.md only
- Be directive and enforceable (rules the agent cannot casually ignore)
- Do not implement the framework in this step
```

Why this prompt is deliberate:
- Gives context, constraints, and out-of-scope up front
- Asks for a **plan/contract**, not code
- Encodes review criteria (depth, API vs setup, agent-native design)
- Creates phase gates so I stay in control of scope

I treated Claude’s output as a draft — I kept the structure, then used it as the contract for the Cursor session.

### Primary operating prompt (compressed from `SPEC.md`)

Key constraints then given to Cursor Agent:

```text
Build an agentic-first Playwright + TypeScript framework for https://automationexercise.com/.

Work in phases. Complete and validate one phase before the next.
At the end of each phase: summarize, list decisions, validation, risks — then STOP and wait.

Do not fabricate application behavior, API endpoints, selectors, routes, or test results.
Prefer evidence from the app, DOM, network, and executed tests.
Make architectural decisions yourself and document reasoning.
Avoid unnecessary abstractions, arbitrary waits, and retries that hide flakes.
Keep the framework easy for both a human and an AI coding agent to extend.
```

### Phase entry prompts (actual sequence)

| Phase | Prompt I used |
|-------|----------------|
| 1 | Read `SPEC.md`. Execute **Phase 1 only**: explore the site with Playwright tooling; inspect UI and network/API; produce the exploration report and test matrix; do not build the framework. |
| 2 | `CONTINUE` — design and implement architecture; validate install, typecheck, config, and a representative run. Stop before deep business tests. |
| 3 | `CONTINUE` — implement 3–5 deep tests covering auth, product discovery, and checkout (UI + direct API). Run the suite; fix root causes of flakes (no retry masking). |
| 4 | `CONTINUE` — write `README.md`, `DECISIONS.md`, `AI_USAGE.md`. |
| Final | `CONTINUE` — Staff-level review checklist; run the full suite again; report architecture, inventory, coverage, trade-offs, limitations, extension scenarios. |

### Follow-up prompts after implementation

| Prompt | Purpose |
|--------|---------|
| Compare local work to the Keychain PDF assignment | Submission gap analysis |
| Help make `AI_USAGE.md` interviewer-ready | This document |

---

## Important AI responses (what it produced well)

| Response | Why it was useful |
|----------|-------------------|
| **Phase 1 exploration report** | Mapped real routes (`/login`, `/products`, `/view_cart`, `/checkout`, `/payment`), `data-qa` locators, Django `sessionid` auth, and the practice `/api/*` surface from `/api_list` |
| **API quirk finding** | Practice APIs often return HTTP `200` with the real outcome in JSON `responseCode` — this became a core design constraint |
| **Proposed 3–5 high-value tests** | Depth over breadth: API account lifecycle, product search hybrid, cart/checkout purchase, auth UI — instead of dozens of shallow cases |
| **Architecture choice** | Thin page objects + API clients + fixtures; separate `tests/ui` and `tests/api`; API for user setup/cleanup; UI for session/cart/checkout |
| **Agent-native extras** | `AGENTS.md`, predictable folders, comments that explain *why* (not restating code) |

I accepted these because they matched live evidence and kept the take-home appropriately small.

---

## Engineer corrections / overrides

Even when the AI typed the code, I owned these judgment calls:

| # | AI tendency / proposal | What I required instead | Why |
|---|------------------------|-------------------------|-----|
| 1 | Jump straight into framework scaffolding | Forced Phase 1 exploration first | Prevent invented selectors/APIs |
| 2 | Might over-build enterprise layers | Kept thin POs/fixtures; rejected BasePage/DI | Take-home scope + agent discoverability |
| 3 | Easy to treat HTTP status as API truth | Assert JSON `responseCode` in `ApiClient` | Matches observed API behavior |
| 4 | Easy to use `storageState` by default | Per-test API create → UI login → API delete | Explicit state; fewer stale auth files |
| 5 | Easy to add Playwright `retries` when UI failed | No retries; fix root cause (overload, ads, wrong assertions) | Assignment rule + honest signal |
| 6 | Parallel workers for speed | `workers: 1` against the shared demo site | Parallel browsers triggered "queue full" pages |

---

## Validation performed

| Check | Result |
|-------|--------|
| Live exploration via Playwright browser tools | Auth, catalogue/search, cart/checkout, practice APIs verified |
| `npm install` + `npx playwright install chromium` | Success |
| `npm run typecheck` | Success |
| `npx playwright test` after Phase 3 fixes | 6 passed |
| Full suite again after Final Review stability fixes | 6 passed (repeated) |

I treat “green on my machine after real runs” as the bar — not AI claims alone.

---

## Architectural decisions I own

Documented fully in `DECISIONS.md`. Short list:

1. Assert practice APIs via JSON `responseCode`, not HTTP status alone.
2. API user provisioning + per-test UI login (no default `storageState`).
3. Separate `tests/api` vs `tests/ui` (and matching Playwright projects).
4. Thin page objects + fixture entrypoint (no deep hierarchy).
5. Chromium-only local runner; CI/CD mentioned as future, not implemented.

---

## Mistakes caught in AI-generated output

| # | Mistake | How it was caught | Fix |
|---|---------|-------------------|-----|
| 1 | Assumed every search result for `"top"` contains `"top"` in the product name | Failing API + UI search tests | Assert known hit + UI/API result-set parity; don’t overfit undocumented search ranking |
| 2 | Assumed cart **grand total** exists on `/view_cart` | Failing checkout test; DOM/a11y showed total only on checkout review | Assert total via checkout `getByRole('row', { name: /Total Amount/ })` |
| 3 | Initial UI smoke used broad `getByRole('link', { name: /Products/i })` | Strict-mode failure (nav + third-party “products” link) | Scope assertions to `.navbar-nav` |
| 4 | Underestimated demo-site ads/overload under parallel workers | Final Review run: heavy-load page, `#google_vignette` blocking Place Order | `workers: 1`, abort ad routes, `gotoApp` overload recovery, vignette dismiss before payment |

---

## Example of an AI mistake that I caught and corrected

### The mistake

The agent wrote search assertions equivalent to:

> For every product returned by `POST /api/searchProduct` with `search_product=top`, `product.name` must include `"top"`.

It applied the same assumption to the UI search results.

### Why it was wrong

The live practice API returns a **broader related set** (for example shirt-like products) that do not all contain the substring `"top"` in the name. The assertion encoded an invented business rule.

### How I caught it

The first full Phase 3 suite run failed in:

- `tests/api/products.api.spec.ts`
- `tests/ui/productSearch.spec.ts`

Failure output showed products such as names containing `"shirt"` without `"top"`.

### Correction

- Keep a **known stable hit** (`Blue Top`, id `1`).
- Require that **at least one** result name includes the term.
- For the hybrid UI test, treat **UI result set == API result set** as the primary contract.
- Do not pretend the undocumented ranking algorithm is “substring match on name.”

### Why this example matters

It shows the review loop I want in an agentic workflow: AI drafts → execute against the real system → correct the model of the app → keep the test meaningful. That is more valuable than a suite that only passes because assertions were softened blindly or wrapped in retries.
