You are helping me complete a QA Staff Engineer take-home assignment for Keychain.

The assignment is to build an "agentic-first" Playwright + TypeScript test framework for:

https://automationexercise.com/

The framework will be reviewed not only for whether tests pass, but for the quality of the engineering decisions and how easily another engineer or AI coding agent could extend it.

IMPORTANT:
Do not treat this as an enterprise framework implementation. Keep the solution appropriately scoped for a take-home assignment while demonstrating Staff-level engineering judgment.

The assignment explicitly leaves "agentic-first" open-ended. Do not blindly follow a predefined architecture. First inspect the application and then make pragmatic architectural decisions that you can explain and defend.

==================================================
OPERATING PRINCIPLES
==================================================

1. Work in phases.
2. Complete and validate one phase before moving to the next.
3. At the end of each phase:
   - summarize what you discovered/built
   - list important decisions
   - list validation performed
   - list risks/open questions
   Then stop and wait for my instruction to continue.
4. Do not fabricate application behavior, API endpoints, selectors, routes, or test results.
5. Prefer evidence from the application, DOM, network traffic, and executed tests over assumptions.
6. Do not ask me to make normal architectural decisions that are clearly within your responsibility. Make the decision yourself and document the reasoning.
7. Avoid unnecessary dependencies and abstractions.
8. Do not modify the application under test.
9. Do not use arbitrary waits such as page.waitForTimeout().
10. Do not use retries to hide flaky tests.
11. Prefer stable, semantic Playwright locators.
12. Do not create abstractions merely to reduce a few lines of code.
13. Keep the resulting framework easy for BOTH a human engineer and an AI coding agent to navigate.

==================================================
PHASE 1 - APPLICATION EXPLORATION
==================================================

Explore:

https://automationexercise.com/

Use Playwright/browser tooling and network inspection where available.

Understand these critical flows:

1. Signup / Authentication
   - signup
   - account creation
   - login
   - logout
   - validation/error behavior

2. Product Discovery
   - catalogue
   - search
   - categories
   - brands
   - product details
   - adding products to cart where relevant

3. Checkout
   - add to cart
   - cart
   - checkout
   - address/order information
   - payment/order placement
   - confirmation

For each flow, investigate:

UI:
- routes
- important elements
- reliable locators
- important states
- business-level assertions
- redirects
- validation behavior

API/network:
- network calls triggered by important actions
- HTTP methods
- endpoints
- request/response structure
- useful response data
- APIs that could reasonably be covered by direct API tests
- APIs that could reasonably be used for setup or data management

Do not assume that an endpoint exists simply because the UI performs an action.

At the end of Phase 1, create a concise test strategy proposal containing:

- candidate test scenarios
- UI vs API vs hybrid classification
- test-data requirements
- authentication/state requirements
- cleanup requirements
- important application limitations discovered

Select the 3-5 highest-value tests rather than maximizing test count.

STOP AND WAIT.

==================================================
PHASE 2 - ARCHITECTURE
==================================================

Using the evidence from Phase 1, design the smallest architecture that satisfies the assignment well.

The framework MUST support:

- Playwright + TypeScript
- Chromium only
- UI testing
- API testing
- shared authentication/state management
- reusable test data management
- local execution
- useful failure diagnostics

The framework SHOULD make it obvious to a future AI coding agent:

- where tests belong
- where page objects belong
- where API clients belong
- where test data/factories belong
- how authentication is managed
- how test state is created
- how cleanup works
- how to add another test
- how to extend an existing flow

Think explicitly about "agent-native" design.

Examples of useful agentic properties include, but are not limited to:
- predictable naming
- consistent file structure
- clear ownership boundaries
- small discoverable abstractions
- deterministic factories
- explicit dependencies
- minimal hidden state
- reusable API/client patterns
- clear test conventions
- local documentation where the reasoning is not obvious

Do NOT implement every example above automatically.
Choose only the patterns that provide real value for this assignment.

Before coding, document your proposed architecture internally and then implement it.

Authentication:
Choose an appropriate Playwright authentication/state strategy based on the actual application behavior.

Test data:
Choose a pragmatic strategy for deterministic test data.
Do not rely on manually created users unless there is a strong reason.

API:
Create a clear boundary between direct API tests and API usage for setup/data management.

IMPORTANT:
Using an API only to create test data does NOT by itself count as API test coverage.
At least one test must directly exercise and assert an application API.

Comments/TSDoc:
Use comments to explain WHY a non-obvious decision exists or to provide useful context for future AI agents.
Do not fill the codebase with comments that merely restate the implementation.

Validation:
At minimum validate:
- project installation
- TypeScript/type checking
- Playwright configuration
- representative test execution

Also inspect the implementation for:
- duplicated logic
- hard-coded data
- hidden state
- brittle selectors
- unnecessary abstractions
- arbitrary waits
- unnecessary dependencies

STOP AND WAIT.

==================================================
PHASE 3 - TEST IMPLEMENTATION
==================================================

Implement 3-5 deep, high-value tests.

Required business areas:

- Signup / Authentication
- Product Discovery
- Checkout

Required coverage:

- UI coverage
- Direct API coverage

Prioritize depth over breadth.

Each test should have:
- deterministic setup
- meaningful assertions
- clear business intent
- appropriate cleanup
- minimal duplication

Use UI where UI behavior itself is what needs validation.

Use API where API behavior is the correct thing to validate.

Use APIs for test setup/cleanup where this improves reliability and is supported by the application.

Do not turn every test into a UI-only end-to-end flow if part of the behavior can be validated more reliably at the API layer.

For API tests:
- validate status codes
- validate meaningful response data
- validate useful negative/error behavior when appropriate
- avoid assertions on irrelevant implementation details

For UI tests:
- use stable locators
- use Playwright web-first assertions
- avoid sleeps
- assert meaningful user-visible/business outcomes

Run the full suite.

If anything is flaky:
- identify the real synchronization/state problem
- fix the underlying issue
- do not simply add retries or increase timeouts

STOP AND WAIT.

==================================================
PHASE 4 - DOCUMENTATION
==================================================

Create these files at the repository root.

README.md

It must allow a new engineer to:

1. clone the repository
2. install dependencies
3. configure anything required
4. run the tests
5. run a specific test
6. run in headed/debug mode
7. access the report

Also explain:
- project structure
- architecture
- authentication strategy
- test-data strategy
- UI/API testing strategy
- known limitations

DECISIONS.md

Document 3-5 genuinely important architectural decisions.

For each decision use exactly:

## Decision
What was chosen.

## Alternatives Considered
What was rejected.

## Why
Why the chosen approach was better for this framework.

## Reversal Trigger
What specific future constraint would cause us to change the decision.

Focus on decisions that demonstrate why the framework is genuinely agent-native.

Mention how CI/CD could be added in the future, but do NOT implement CI/CD because it is explicitly out of scope.

AI_USAGE.md

Create a structured document with sections for:

- AI tools used
- prompts used
- important AI responses
- engineer corrections
- validation performed
- architectural decisions made by the engineer
- mistakes caught in AI-generated output

Do NOT invent history.

Leave placeholders where I need to record the actual interaction.

Include a section specifically for:

"Example of an AI mistake that I caught and corrected"

==================================================
FINAL REVIEW
==================================================

Before declaring the assignment complete, review the repository from the perspective of a Keychain Staff QA Engineer.

Evaluate:

ARCHITECTURE
- Is this appropriately small for the assignment?
- Are responsibilities clearly separated?
- Is it easy for an AI agent to discover where new code belongs?
- Are abstractions justified?

TEST QUALITY
- Are the tests deep rather than broad?
- Are assertions meaningful?
- Is the UI/API split intentional?
- Is test data deterministic?
- Is authentication handled cleanly?
- Are tests likely to survive application changes?

AGENTIC QUALITY
- Could an AI agent add a new test without reading the entire repository?
- Could an AI agent discover existing factories/page objects/API clients?
- Are naming conventions predictable?
- Is hidden state minimized?
- Are the patterns consistent enough for an AI agent to follow?

INTERVIEW EXTENSIBILITY
Because Part 2 of the assignment is a live extension exercise, verify that the framework is easy to modify during an interview.

Identify at least 2-3 realistic extensions that could be demonstrated quickly, for example:
- adding another product-discovery test
- adding another API test
- adding a new test-data factory
- extending an existing page object

Do not implement these unless necessary. The framework should simply make them straightforward.

Finally run the complete suite again.

Report:
1. final architecture
2. final test inventory
3. UI/API coverage
4. validation performed
5. important trade-offs
6. known limitations
7. likely live-extension scenarios

Do not claim anything passed unless you actually executed it.