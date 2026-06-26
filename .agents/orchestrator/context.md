# Context — ZeroApiTools UI/UX Overhaul

## Project Context
- **Product**: ZeroApiTools (Free in-browser developer utility platform).
- **Core Technologies**: React 19, Vite, Tailwind-like custom styles (`src/index.css`), Framer Motion.
- **Key Files**:
  - `src/App.jsx` (routing & lazy import definitions)
  - `src/components/Landing.jsx` (main landing page UI dashboard)
  - `src/components/Navbar.jsx` & `src/components/Footer.jsx`
  - `src/components/blog/` (blog list & post views)
  - `src/index.css` (custom CSS design system)

## Goals
1. **Premium Glassmorphism**: Vibrant gradients, frosted-glass background blurs, fine borders, soft glows, responsive shadow system.
2. **Micro-interactions**: Hover transitions, card tilt/fade animations, button press feedbacks, lazy-loading placeholders.
3. **Responsiveness**: Complete mobile viewport optimization. Zero horizontal scroll. Tap targets sized for fingers (>=44px).
4. **Accessibility**: Web Content Accessibility Guidelines (WCAG) compliance. Contrast ratio >= 4.5:1. Active keyboard navigation (`tabindex`, `outline` styles, clear focus rings).
5. **E2E Testing & Forensics**: Independent opaque-box test track confirming correct visual elements, responsive viewports, and keyboard focus. Forensic Auditor verifying code integrity (no hardcoded test bypasses).
