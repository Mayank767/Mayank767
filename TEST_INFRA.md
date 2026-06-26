# ZeroApiTools E2E Test Infrastructure

This document details the static and structural parsing philosophy, layout, features, and run commands of the ZeroApiTools E2E Test Suite.

## Testing Philosophy: Static & Structural Parsing
Rather than using a heavy, browser-driven testing framework (like Puppeteer or Playwright) which requires external engine downloads, network configuration, and runs slowly, this test infrastructure employs a **Static/Structural E2E Verification** methodology.

We treat the source files (`src/index.css`, `src/App.jsx`, `src/components/*`) as structural contracts. The test runner programmatically:
1. **Reads files statically** using Node's standard `fs` APIs.
2. **Parses and resolves structural declarations**:
   - CSS variables: extracts, inheritance chains, and scopes (e.g. `:root` vs `[data-theme="light"]`).
   - Color Contrast: mathematically parses colors (HEX, RGB, RGBA), computes relative luminance, and calculates WCAG contrast ratios.
   - Layout patterns: detects media queries, flex layouts, wrapping styles, and viewport tags.
   - Keyboard & interaction hooks: scans for listeners (like `onKeyDown`, keys checked, and active classes), `tabIndex`, and focus styling rules.
   - Framer motion: checks imports, motion attributes (`whileHover`, `whileTap`), and animation easing constants.
3. **Asserts specific contracts** matching user experience capabilities.

This ensures:
- **Offline Reliability (CODE_ONLY)**: No network calls or NPM package downloads needed during test execution.
- **Microsecond Execution**: The entire 60-test-case suite completes in milliseconds, providing instant feedback.
- **Deterministic Auditing**: Verifies exact color contrast ratios and layout styles mathematically and syntactically.

## Project File Layout
```
c:\Users\mayni\OneDrive\Desktop\New folder (7)\
├── TEST_INFRA.md             # Test infrastructure documentation (this file)
├── TEST_READY.md             # Verification signal detailing coverage and results
├── package.json              # Contains script for test execution
└── scripts/
    └── run_e2e_tests.mjs     # Standardized Node.js E2E test runner
```

## Features Checked
1. **Premium Glassmorphism**: Backing blurs, transparent borders (alpha <= 0.15), shadows, theme variables, and custom scrollbars.
2. **Smooth Micro-interactions**: Hover states, Framer Motion attributes, reduced motion overrides (`prefers-reduced-motion` resetting transitions), button scaling.
3. **Mobile Responsiveness**: Viewport configurations, flex direction wrapping under media queries, anti-overflow styles (`overflow-x: hidden`), tap target size guidelines (height/padding yielding >= 44px).
4. **Accessibility Keyboard Navigation**: Focus ring overrides, interactive element accessibility, dropdown key listeners (`ArrowUp`/`ArrowDown`/`Enter`/`Escape`).
5. **Accessibility Color Contrast**: Resolves dark/light mode background and text variables, computing WCAG contrast ratios to verify compliance.

## Run Commands
To run the full E2E test suite, execute:
```bash
npm run test
```
Alternatively, execute it directly with Node.js:
```bash
node scripts/run_e2e_tests.mjs
```
