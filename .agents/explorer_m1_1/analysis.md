# E2E Static/Structural Test Suite Strategy for UI/UX Overhaul

## 1. Executive Summary & Strategy Overview

Due to the **CODE_ONLY network mode** and offline environment constraints of the execution context, typical heavy browser automation engines (such as Cypress, Playwright, or Puppeteer) are unavailable. Furthermore, testing utilities like JSDOM or CSSOM are not installed in the workspace dependencies. 

To address these constraints and maintain a high standard of visual and behavioral verification, we propose a **Static and Structural E2E Verification Suite**. Instead of relying on a running browser, the test suite programmatically inspects and asserts rules directly on the design tokens and layout templates (`src/index.css`, `src/App.jsx`, `src/components/*`). This strategy guarantees:
- **Offline Reliability**: Zero external package downloads or headless browser installations required.
- **Fast Execution**: Millisecond-level test runs enabling instant feedback during developer builds.
- **Definitive Verification**: Accurate parsing and validation of CSS styles, color contrast ratios, media query breakpoints, and React component structures.
- **Strict Accessibility Auditing**: Static scanning of keyboard handlers, semantic structures, target size styles, and color contrasts.

---

## 2. Dependency & Codebase Discovery Findings

A deep scan of the project workspace revealed the following details about the ZeroApiTools environment:

### Package Dependencies (`package.json` & `node_modules`):
- **React & React DOM (19.2.6)**: The project uses React 19, meaning components utilize standard JSX and React 19 lifecycle elements.
- **Framer Motion (12.40.0)**: Installed as a core dependency, providing capabilities for micro-interactions and layout transitions.
- **DOMPurify (3.4.11) & Marked (18.0.4)**: Used for blog rendering and text processing.
- **Linting & Tooling**: ESLint flat config (`eslint.config.js`) and Vite (`vite.config.js`) are used.
- **Testing Packages**: No Jest, Vitest, Cypress, Playwright, or Puppeteer exist in `node_modules`.
- **Parsing Utilities in `node_modules`**:
  - `@babel/parser` and `@babel/traverse` are **available** in `node_modules` as dev dependencies, meaning we can perform full Abstract Syntax Tree (AST) parsing of the JSX components.
  - `postcss` and `lightningcss` are present, enabling parsing/processing of CSS.
  - `inline-style-parser` is present.

### Codebase Structure:
- **Routing**: Client-side pathname routing resides in `src/App.jsx`. It detects pathnames statically and loads tools via `React.lazy` dynamically.
- **Styles**: Custom Utility CSS styling resides entirely in a massive file `src/index.css`. Theme overrides for Light Mode reside under the `[data-theme="light"]` selector.

---

## 3. Test Runner & Harness Architecture

We propose introducing a custom Node.js runner at `scripts/run_e2e_tests.mjs`. It will load CSS and JSX files and evaluate them against 60+ specific test cases.

```
scripts/
└── run_e2e_tests.mjs       # Custom E2E test runner and static assertion engine
c:\Users\mayni\OneDrive\Desktop\New folder (7)\
├── TEST_INFRA.md           # Root documentation detailing the test setup
└── TEST_READY.md           # Verification marker indicating passing status
```

### execution Command
The test suite will be integrated into the workflow using standard Node.js module execution:
```bash
node scripts/run_e2e_tests.mjs
```
It will return exit code `0` on success and `1` on failure, allowing it to act as a gating script in standard builds or package scripts (mapped under `"test"` in `package.json`).

---

## 4. Core Feature Static Testing Strategies

### Feature 1: Premium Glassmorphism
Premium glassmorphism utilizes backing blurs, semi-transparent border rings, and low-opacity gradients to achieve visual layering.
- **Border and Background Opacity Check**: The runner parses `index.css` to verify that border and background variables (e.g. `--border-primary`, `--bg-surface`) under `:root` (Dark Mode) and `[data-theme="light"]` (Light Mode) utilize `rgba` syntax with transparent alphas (e.g. alpha $\le 0.15$ for dark mode, alpha $\le 0.20$ for light mode).
- **Backdrop Blur Inspection**: Search stylesheet rule ASTs or raw strings to confirm that `.navbar`, `.footer-new`, and `.pane` containers implement `backdrop-filter: blur(...)` and `-webkit-backdrop-filter: blur(...)` with a blur radius $\ge 8\text{px}$.

### Feature 2: Smooth Micro-interactions
Interactive states must feel responsive, organic, and respect accessibility limits.
- **Reduced Motion Support**: Assert that `@media (prefers-reduced-motion: reduce)` exists in `index.css` and overrides transitions and animation durations to `0.01ms !important` or `0s !important`.
- **Framer Motion Props Checking**: Using `@babel/parser`, the runner parses `Landing.jsx` and individual tool wrappers to assert that interactive components (cards, tab buttons) declare motion attributes:
  - `whileHover={{ scale: ... }}` (ensuring subtle scale up to $\le 1.05$).
  - `whileTap={{ scale: ... }}` (ensuring click feedback down to $\ge 0.90$).
  - Transitions like `type: "spring"` with reasonable stiffness/damping settings.
  - Presence of `<motion.div layout>` or `layoutId` on tabs to verify smooth slide animations.
- **Transition Easings**: Verify that CSS transition rules utilize spring-like cubic-bezier curves (e.g., matching `var(--ease-spring)` or `cubic-bezier(0.16, 1, 0.3, 1)`).

### Feature 3: Mobile Responsiveness
Responsiveness is checked by scanning layout wrappers and tap target styles:
- **Anti-Overflow Inspections**: Programmatically scan JSX files and CSS styles to flag hardcoded absolute widths (e.g. `width: "800px"` or `min-width: 600px` without responsive wrappers) that would break on a standard $360\text{px}$ or $320\text{px}$ mobile screen.
- **Viewport Config Check**: Verify `index.html` contains `<meta name="viewport" content="width=device-width, initial-scale=1.0..." />`.
- **Responsive Layout Folding**: Verify that grid and flex containers (like `.tools-grid`, `.split-pane`, `.blog-grid`) have responsive breakpoints (e.g., `@media (max-width: 768px)` or tailwind-like `@media (max-width: 640px)`) that collapse columns to `1fr` or toggle `flex-direction: column`.
- **Tap Targets Verification**: Scan interactive classes (`.btn`, `.category-tab`, `.tool-fav-btn`, `.theme-toggle`) to assert that they have height, padding, or pseudo-elements (`::after`) yielding a touch target of at least $44\text{px} \times 44\text{px}$.

### Feature 4: Accessibility Keyboard Navigation
Interactive flow capability is audited by scanning key listeners and focus indicators.
- **Focus Indicator Suppression Check**: Verify that `index.css` does not contain any global suppression of focus rings (e.g. `:focus { outline: none; }` or `:focus-visible { outline: 0; }`) unless a custom border/shadow outline style (like `--accent-glow` or custom box-shadow) is explicitly provided on the same selector.
- **Reachability Verification**: Verify that no standard interactive element (like `input`, `button`, `a`) has hardcoded `tabIndex="-1"` or `tabIndex={-1}` unless it is explicitly inside a closed/hidden modal or menu state.
- **Nesting Semantic Audit**: Parse JSX files to ensure interactive elements are not nested inside other interactive elements (e.g., verifying a favorite `<button>` is not nested inside an anchor link `<a>`, which confuses screen readers and breaks keyboard tab ordering).
- **Keyboard Event Handling**: Search for `onKeyDown` or `onKeyPress` event handlers on components with custom dropdowns (like search in `Navbar.jsx`) to confirm they capture key events (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) to allow full keyboard operations.

### Feature 5: Color Contrast (WCAG AA Compliance)
 प्रोग्राम Contrast verification:
1. **Variable Extraction**: Read `index.css` and parse the color variables block under `:root` and `[data-theme="light"]`.
2. **RGBA/HEX Resolution**: Convert hex codes and RGBA values to RGB format. For semi-transparent colors (RGBA), mathematically blend them over the corresponding background color (e.g., blending a semi-transparent surface background over the deep page background).
3. **Contrast Calculation**: Apply the standard WCAG relative luminance formula to calculate the contrast ratio between the text and background variables.
4. **Assert Threshold**: Verify that primary text vs primary background contrast ratio is $\ge 4.5:1$ (WCAG AA standard) for both dark and light modes. Verify that large headings/accent elements achieve at least $3.0:1$.

---

## 5. Comprehensive Proposal of 60 Test Cases (Tiers 1-4)

### Tier 1: Feature Coverage (25 Test Cases)
*Verifies basic implementation constraints and definitions for each of the 5 core features.*

#### Feature 1: Premium Glassmorphism
1. **TC_T1_G1**: Verify `:root` contains base dark background `--bg-primary` defined as a dark hex color.
2. **TC_T1_G2**: Verify `:root` contains `--border-primary` using transparent `rgba()` syntax with alpha $\le 0.15$.
3. **TC_T1_G3**: Verify `[data-theme="light"]` contains `--border-primary` using transparent `rgba()` syntax with alpha $\le 0.20$.
4. **TC_T1_G4**: Verify `.navbar` selector in `index.css` contains `backdrop-filter: blur(...)` or `-webkit-backdrop-filter`.
5. **TC_T1_G5**: Verify `Landing.jsx` contains references to background visual elements (e.g., Canvas particle structures or floating ambient orbs).

#### Feature 2: Smooth Micro-interactions
6. **TC_T1_M1**: Verify easing curves `--ease-spring` and `--ease-smooth` are defined with cubic-bezier values.
7. **TC_T1_M2**: Verify `framer-motion` package is imported in `Landing.jsx`.
8. **TC_T1_M3**: Verify `.tool-card` or interactive grid buttons use motion elements with `whileHover` or `whileTap` scaling attributes.
9. **TC_T1_M4**: Verify CSS transition duration variable `--transition-fast` is configured with a duration $\le 200\text{ms}$.
10. **TC_T1_M5**: Verify the stylesheet defines keyframe entries (e.g., `@keyframes slideUpFade`) for smooth component mounts.

#### Feature 3: Mobile Responsiveness
11. **TC_T1_R1**: Verify `index.html` contains the viewport metadata tag config.
12. **TC_T1_R2**: Verify `@media (max-width: 768px)` or similar breakpoint exists in `index.css`.
13. **TC_T1_R3**: Verify grid/flex containers fold columns to single columns on small viewports (e.g., `.tools-grid` or `.split-pane` collapsing columns).
14. **TC_T1_R4**: Verify no hardcoded component widths $\ge 480\text{px}$ exist in `index.css` without responsive overrides.
15. **TC_T1_R5**: Verify mobile touch classes (`.btn`, `.theme-toggle`, `.tool-fav-btn`) possess vertical height or padding ensuring $\ge 44\text{px}$ clickable depth.

#### Feature 4: Accessibility Keyboard Navigation
16. **TC_T1_K1**: Verify focus rings `:focus` or `:focus-visible` are defined in `index.css`.
17. **TC_T1_K2**: Verify inputs in JSX do not have hardcoded `tabIndex="-1"` which skips them.
18. **TC_T1_K3**: Verify custom focus indicators utilize high contrast outline styles.
19. **TC_T1_K4**: Verify Navbar search dropdown contains an `onKeyDown` handler to capture navigation keys.
20. **TC_T1_K5**: Verify closed modal states or hidden components dynamically toggle element tab accessibility.

#### Feature 5: Color Contrast
21. **TC_T1_C1**: Verify Dark Mode `--text-primary` vs `--bg-primary` contrast ratio is $\ge 4.5:1$.
22. **TC_T1_C2**: Verify Dark Mode `--text-secondary` vs `--bg-primary` contrast ratio is $\ge 4.5:1$.
23. **TC_T1_C3**: Verify Light Mode `--text-primary` vs `--bg-primary` contrast ratio is $\ge 4.5:1$.
24. **TC_T1_C4**: Verify Light Mode `--text-secondary` vs `--bg-primary` contrast ratio is $\ge 4.5:1$.
25. **TC_T1_C5**: Verify Accent colors (`--accent` / Electric Green) vs background variables achieve at least $3.0:1$ for large text/headings.

---

### Tier 2: Boundary & Corner Cases (25 Test Cases)
*Validates extreme conditions, transitions, fallback states, and edge inputs.*

#### Feature 1: Premium Glassmorphism
26. **TC_T2_G1**: Verify light mode background variables (e.g., `--glass-bg`) do not use transparent opacity below 0.80 to ensure readability against background orbs.
27. **TC_T2_G2**: Verify backdrop blur amount is $\ge 8\text{px}$ to prevent visual overlap.
28. **TC_T2_G3**: Verify border opacity value for `--border-primary` in Light Mode is increased (alpha $\ge 0.08$) compared to Dark Mode (alpha $\ge 0.04$) to ensure boundary lines are visible.
29. **TC_T2_G4**: Verify custom scrollbar track/thumb styling overrides the default browser color scheme to fit the premium theme.
30. **TC_T2_G5**: Verify hover shadows on card elements (`--shadow-card-hover`) define a glowing shadow radius of $\ge 20\text{px}$.

#### Feature 2: Smooth Micro-interactions
31. **TC_T2_M1**: Verify `@media (prefers-reduced-motion: reduce)` overrides `@keyframes` animations.
32. **TC_T2_M2**: Verify hover speed constants in CSS transitions do not exceed 600ms to avoid laggy UX perception.
33. **TC_T2_M3**: Verify active dropdown items utilize layout transition animations without jumpy layout shifts.
34. **TC_T2_M4**: Verify Framer Motion components do not declare infinite spring stiffness.
35. **TC_T2_M5**: Verify interactive button scale does not shrink below `0.9` during tap to prevent touch targets from collapsing.

#### Feature 3: Mobile Responsiveness
36. **TC_T2_R1**: Verify body element disables horizontal scroll (`overflow-x: hidden`).
37. **TC_T2_R2**: Verify text size clamps (`clamp(...)` or mobile sizes) exist to prevent text clipping on 320px width viewports.
38. **TC_T2_R3**: Verify layout container margins wrap cleanly under 360px width.
39. **TC_T2_R4**: Verify mobile layout grid cells (`.tools-grid`, `.features-grid`) fold to 1 column below 600px width.
40. **TC_T2_R5**: Verify inline SVG elements scale responsively with `max-width: 100%` and `height: auto` or `preserveAspectRatio`.

#### Feature 4: Accessibility Keyboard Navigation
41. **TC_T2_K1**: Verify custom keyboard event handlers prevent default scroll for `ArrowUp`/`ArrowDown`.
42. **TC_T2_K2**: Verify dropdown search list uses active visual classes (`.active` or `.hover`) mapped to keyboard navigation states.
43. **TC_T2_K3**: Verify closed dropdown overlays set elements to `tabIndex={-1}` dynamically to prevent off-screen tabbing.
44. **TC_T2_K4**: Verify that outline styles are not removed on focus using `outline: 0` without fallback borders.
45. **TC_T2_K5**: Verify that navigation elements (`a`, `button`) have proper semantic tag names for native screen reader keyboard behavior.

#### Feature 5: Color Contrast
46. **TC_T2_C1**: Verify Light Mode `--text-muted` vs `--bg-primary` meets contrast threshold >= 3.0:1 for secondary labels.
47. **TC_T2_C2**: Verify hovered background variables (`--bg-hover`) do not drop contrast ratio below 4.5:1 for overlaying text.
48. **TC_T2_C3**: Verify danger variables (`--accent-rose`) vs background yields readable contrast ratios.
49. **TC_T2_C4**: Verify warning variables (`--accent-amber`) vs background yields readable contrast ratios.
50. **TC_T2_C5**: Verify light mode link variables vs light background yields contrast >= 4.5:1.

---

### Tier 3: Cross-Feature Combinations (5 Test Cases)
*Checks interacting requirements where one feature constraint affects another.*

51. **TC_T3_COMBO_1 (Glassmorphism + Contrast)**: Verify that the transparent border variables (`--border-primary` / `--border-mid`) and base backgrounds maintain separation contrast in both Dark and Light modes.
52. **TC_T3_COMBO_2 (Micro-interactions + Accessibility)**: Verify that scaling transitions on hover do not clip focus outline rings.
53. **TC_T3_COMBO_3 (Mobile Responsiveness + Keyboard Navigation)**: Verify that on mobile viewport wrapping, interactive buttons preserve correct tab order mapping.
54. **TC_T3_COMBO_4 (Mobile + Color Contrast)**: Verify that mobile-only overlay menus and buttons utilize WCAG compliant text color properties.
55. **TC_T3_COMBO_5 (Accessibility + Micro-interactions)**: Verify that keyboard navigation focus invokes focus outlines styling mimicking hover micro-interaction states.

---

### Tier 4: Real-World Application Scenarios (5 Test Cases)
*Verifies end-to-end structural flow sequences mapping to user actions.*

56. **TC_T4_SCENARIO_1 (Navbar Search Walkthrough)**: Simulate structural flow of Navbar search: focus input field -> type query -> filter list -> keydown ArrowDown -> keydown Enter to select tool.
57. **TC_T4_SCENARIO_2 (Theme Toggling Cycle)**: Simulate state transition of dark mode toggle: click toggle button -> change `data-theme` attribute -> verify all color variables change value -> verify contrast remains compliant.
58. **TC_T4_SCENARIO_3 (Interactive Tool Page Layout)**: Validate the base component layout contract of a tool (e.g. `Base64Tool`): verify presence of Input TextArea, Copy-to-Clipboard button with micro-interactions, and keyboard accessible controls.
59. **TC_T4_SCENARIO_4 (System Reduced Motion Application)**: Simulate reduced motion flag toggle: verify framer-motion elements fallback to static layout and CSS transitions disable instantly.
60. **TC_T4_SCENARIO_5 (Mobile Viewport Wrapping Flow)**: Simulate mobile layout wrap: verify categories filters row wraps horizontally and grid boxes flow into a single-column layout.

---

## 6. Concrete Code Blueprint for `scripts/run_e2e_tests.mjs`

Below is the proposed implementation pattern for the custom E2E static runner script.

```javascript
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import parser from '@babel/parser';
import traverse from '@babel/traverse';

const WORKSPACE = process.cwd();

// Load target files helper
function loadFile(relPath) {
  return fs.readFileSync(path.join(WORKSPACE, relPath), 'utf-8');
}

// AST helper to parse React JSX components
function parseJSX(content) {
  return parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx']
  });
}

// Color parsing utility for relative luminance & contrast calculations
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function parseRgba(rgbaStr) {
  const match = rgbaStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(0?\.\d+|1|0))?\)/);
  if (!match) return null;
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1
  };
}

function blendRgba(fgRgba, bgRgb) {
  const a = fgRgba.a;
  return {
    r: Math.round((1 - a) * bgRgb.r + a * fgRgba.r),
    g: Math.round((1 - a) * bgRgb.g + a * fgRgba.g),
    b: Math.round((1 - a) * bgRgb.b + a * fgRgba.b)
  };
}

function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(rgb1, rgb2) {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Extract variables from stylesheet content
function extractCssVariables(css, themeSelector = ':root') {
  const variables = {};
  // Standard naive regex to pull variable blocks
  let blockRegex;
  if (themeSelector === ':root') {
    blockRegex = /:root\s*\{([^}]*)\}/i;
  } else {
    blockRegex = /\[data-theme=["']?light["']?\]\s*\{([^}]*)\}/i;
  }
  const match = css.match(blockRegex);
  if (!match) return variables;
  
  const rules = match[1].split(';');
  rules.forEach(rule => {
    const parts = rule.split(':');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      if (name.startsWith('--')) {
        variables[name] = val;
      }
    }
  });
  return variables;
}

// Global test reporting state
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

function runTest(id, name, testFn) {
  results.total++;
  try {
    testFn();
    results.passed++;
    console.log(`[PASS] ${id}: ${name}`);
  } catch (err) {
    results.failed++;
    results.errors.push({ id, name, error: err.message });
    console.error(`[FAIL] ${id}: ${name} -> ${err.message}`);
  }
}

// Start Runner Function
export function runAllTests() {
  console.log('🚀 Executing E2E Static/Structural Test Runner...\n');

  const css = loadFile('src/index.css');
  const appJsf = loadFile('src/App.jsx');
  const landingJsf = loadFile('src/components/Landing.jsx');

  // Example: TC_T1_G1 - Base Dark Background
  runTest('TC_T1_G1', 'Verify dark mode base background variable exists', () => {
    const vars = extractCssVariables(css, ':root');
    assert.ok(vars['--bg-primary'], 'CSS must define --bg-primary under :root');
    assert.match(vars['--bg-primary'], /^#[0-9a-fA-F]{3,6}$/, '--bg-primary must be a hex color');
  });

  // Example: TC_T1_C1 - Contrast Ratio Programmatic Checking
  runTest('TC_T1_C1', 'Verify dark mode primary text vs primary background contrast ratio >= 4.5:1', () => {
    const vars = extractCssVariables(css, ':root');
    const bgRgb = hexToRgb(vars['--bg-primary']);
    const fgRgb = hexToRgb(vars['--text-primary']);
    const ratio = getContrast(fgRgb, bgRgb);
    assert.ok(ratio >= 4.5, `Contrast ratio must be >= 4.5 (computed ${ratio.toFixed(2)}:1)`);
  });

  // Example: TC_T1_R4 - Prevent hardcoded layout container widths
  runTest('TC_T1_R4', 'Verify no hardcoded desktop widths on layout elements in Landing.jsx', () => {
    const ast = parseJSX(landingJsf);
    traverse.default(ast, {
      JSXOpeningElement(pathNode) {
        // Assert that width attributes aren't static px above 480
        const styleAttr = pathNode.node.attributes.find(attr => attr.name && attr.name.name === 'style');
        if (styleAttr && styleAttr.value && styleAttr.value.expression) {
          const properties = styleAttr.value.expression.properties || [];
          properties.forEach(prop => {
            if (prop.key && prop.key.name === 'width') {
              if (prop.value.type === 'StringLiteral' && prop.value.value.includes('px')) {
                const val = parseInt(prop.value.value);
                assert.ok(val < 480, `Found desktop-only width value: ${val}px`);
              }
            }
          });
        }
      }
    });
  });

  // Example: TC_T1_K4 - Interactive Element Nesting Check
  runTest('TC_T1_K4', 'Verify favorite button is not nested inside anchor link in Landing.jsx', () => {
    const ast = parseJSX(landingJsf);
    let badNesting = false;
    traverse.default(ast, {
      JSXElement(pathNode) {
        const opening = pathNode.node.openingElement;
        if (opening.name.name === 'a') {
          // Check children for button tags
          pathNode.node.children.forEach(child => {
            if (child.type === 'JSXElement' && child.openingElement.name.name === 'button') {
              badNesting = true;
            }
          });
        }
      }
    });
    assert.strictEqual(badNesting, false, 'Do not nest <button> elements inside interactive <a> tags');
  });

  // Print results
  console.log('\n======================================');
  console.log(`📊 TEST SUITE SUMMARY:`);
  console.log(`   Total Run: ${results.total}`);
  console.log(`   Passed:    ${results.passed}`);
  console.log(`   Failed:    ${results.failed}`);
  console.log('======================================\n');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
```

---

## 7. Verification & Integration Plan

To verify this test strategy and validate the implementation:
1. **Runner Integration**: Create `scripts/run_e2e_tests.mjs` and hook it into `package.json` under `"test"`.
2. **Execute Locally**: Execute `npm run test` or `node scripts/run_e2e_tests.mjs` to ensure the program exits with code `0`.
3. **Invalidation Tests**: Test that the suite catches real bugs by temporarily:
   - Changing `--text-primary` in light mode to `#cccccc` (forces contrast to fail, ensuring contrast ratio checks fail with code `1`).
   - Adding a `<button>` inside an `<a>` tag in `Landing.jsx` (ensures the structural nesting test fails with code `1`).
   - Removing the `@media (prefers-reduced-motion: reduce)` block (ensures the reduced motion test fails with code `1`).
4. **Publish Marker**: Once the E2E verification setup completes and all tests return successfully, write `TEST_READY.md` to the workspace root directory.
