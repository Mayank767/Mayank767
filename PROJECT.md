# Project: ZeroApiTools UI/UX Premium Overhaul

## Architecture
- **Vite + React (19)** frontend app.
- **Tailwind-like Custom Utility CSS** in `src/index.css` defining colors, variables, shadows, layouts.
- **Framer Motion** for animations and smooth micro-interactions.
- **Dual Track Architecture**:
  - **Implementation Track**: Upgrades UI component layouts, global custom CSS styles, responsive targets, accessibility, contrast, and custom JS interactions.
  - **E2E Testing Track**: Builds requirement-driven, opaque-box E2E test cases validating UI glassmorphism detection (checking CSS classes/properties), mobile layout behavior, and accessibility keyboard navigation.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | E2E Test Suite Setup | E2E Testing Track: Implement Tier 1-4 tests, write test runner and infra | None | IN_PROGRESS |
| M2 | UI Exploration & Specs | Exploration of current pages & layout for detailed implementation specs | None | DONE |
| M3 | Landing Page Overhaul | Implement glassmorphism, micro-interactions, responsive grid on landing | M2 | IN_PROGRESS |
| M4 | Individual Tool Pages Overhaul | Apply glassmorphism card styles, micro-interactions, copy animations, responsive layout, key accessibility targets on tool pages | M3 | IN_PROGRESS |
| M5 | Blog Section Overhaul | Modern glassmorphism blog list and post layout, premium cards, responsiveness, and contrast validation | M3 | IN_PROGRESS |
| M6 | Global Components & Theme | Navbar, footer, overall theme, contrast accessibility, keyboard focus outline styles, print styles | M4, M5 | IN_PROGRESS |
| M7 | E2E Testing & Hardening | Run all E2E tests, resolve regressions, generate and execute Tier 5 adversarial tests for coverage hardening | M1, M6 | PLANNED |

## Interface Contracts & Layout
- Global variables in `src/index.css` (defining glassmorphic gradients, blurs, and contrast-safe text colors).
- Routing is pathname-based in `src/App.jsx` dynamically rendering `<Landing />`, `<BlogList />`, `<BlogPost />`, or active tool component.

## Code Layout
- `.agents/` — Agent coordination & status files
- `src/` — React application source code
  - `src/components/` — UI components
    - `Landing.jsx` — Landing page UI
    - `Navbar.jsx`, `Footer.jsx` — Common layout
    - `blog/` — Blog views
    - `text/`, `code/`, `converters/`, `css-generators/`, `image/`, `security/`, `seo/`, `unique/`, `calculators/`, `pdf/`, `api/` — Specific category tool components
  - `src/index.css` — Global stylesheets
