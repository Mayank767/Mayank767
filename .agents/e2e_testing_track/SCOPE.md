# Scope: E2E Testing Track

## Architecture
- Node.js script `scripts/run_e2e_tests.mjs` verifying codebase assets (`src/index.css`, `src/App.jsx`, `src/components/Landing.jsx`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/components/blog/`, etc.).
- The tests check requirements statically and structurally: CSS glassmorphic blurs, transparent borders, Framer Motion properties, responsiveness utilities, keyboard event handlers, visible focus rings/outlines, and color contrast calculations on text/bg style variables.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Test Infra & Strategy | Draft TEST_INFRA.md, design tests for each of the 5 features. | None | PLANNED |
| M2 | Test Runner & Harness | Implement runner scripts/run_e2e_tests.mjs and parsing utility. | M1 | PLANNED |
| M3 | Tier 1 (Feature Coverage) | Implement >= 25 test cases (5 per feature). | M2 | PLANNED |
| M4 | Tier 2 (Boundary & Corners) | Implement >= 25 test cases (5 per feature). | M2 | PLANNED |
| M5 | Tier 3 & 4 (Interactions & Scenarios) | Implement >= 5 Tier 3 (Cross-feature) and >= 5 Tier 4 (Real-world scenarios). | M2 | PLANNED |
| M6 | Execution, Verification & Publish | Verify all tests pass, verify package.json npm run test integration, publish TEST_READY.md. | M3, M4, M5 | PLANNED |

## Interface Contracts
- E2E Test Suite runs via `npm run test` or `node scripts/run_e2e_tests.mjs`.
- Exit code is 0 when all tests pass, non-zero when any test fails.
- Reports test count, passes, and failures clearly in console.
