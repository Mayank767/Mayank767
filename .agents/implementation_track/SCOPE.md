# Scope: Implementation Track

## Architecture
- React Frontend with Vite, Tailwind CSS, custom CSS variables in `src/index.css`
- Components: Navbar, Footer, Landing Page, Blog, Individual Tools, and Tool panels (`.pane`)
- Animations: Framer Motion and custom CSS transitions

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M6: Global Theme & Components | Introduce CSS glassmorphism variables, dark/light theme styling for Navbar and Footer, fix light mode text contrast ratios, add keyboard focus outline rings/styles, and adjust theme-toggle tap target. | none | IN_PROGRESS |
| 2 | M3: Landing Page Overhaul | Implement category transitions with Framer Motion, fix 3D tilt stutter, deneast favorite button from card link, ensure favorite button tap target >= 44px, and add focus outline. | M6 | PLANNED |
| 3 | M4: Individual Tool Pages Overhaul | Refactor `.pane` CSS class, fix split-pane collapsing on mobile via CSS grid columns, and verify page elements have proper contrast/focus. | M6 | PLANNED |
| 4 | M5: Blog Section Overhaul | Integrate glassmorphic footer, language toggle transitions, responsive blog cover images, and verify contrast/focus. | M6 | PLANNED |
| 5 | M7: E2E Testing & Hardening | Run E2E tests once `TEST_READY.md` is present, resolve all issues, and run Tier 5 Adversarial Coverage Hardening. | M3, M4, M5, M6 | PLANNED |

## Interface Contracts
### Theme-Aware Global CSS Variables (`src/index.css`)
- `--glass-bg`: Glassmorphic background color (semi-transparent)
- `--glass-border`: Glassmorphic border color (semi-transparent)
- `--glass-blur`: Glassmorphic backdrop blur size (e.g. 20px)
- `--pane-gradient`: Linear gradient for panels
- `--text-muted`, `--text-3`, `--text-4`: Theme-aware text colors with AA contrast ratio >= 4.5:1 on light/dark backgrounds.

### Interactive Components Behavior
- Focus outlines must use `focus-visible` to avoid showing for mouse users but clearly show for keyboard users.
- Favorite button is render-adjacent to the tool link container, not nested within it, maintaining independent tab indices and click handlers.
