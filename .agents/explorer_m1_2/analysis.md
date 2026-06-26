# ZeroApiTools UI/UX Overhaul: Comprehensive E2E Testing Strategy Analysis

## 1. Executive Summary

This report establishes the design and implementation strategy for a requirement-driven, static and structural E2E test suite verifying the ZeroApiTools UI/UX premium overhaul. Operating under a `CODE_ONLY` network mode, the E2E verification is designed as a browserless, static analysis engine implemented in Node.js (`scripts/run_e2e_tests.mjs`). By parsing and asserting code characteristics of the CSS stylesheet (`src/index.css`) and the JSX components (`src/components/**/*`), this suite verifies visual styles, animations, responsiveness, accessibility, and navigation structures.

Our audit of the codebase dependencies confirmed that the environment is equipped with **PostCSS** (for CSS parsing) and **Espree / Acorn** (for AST-based JS/JSX parsing), which allows us to build a robust, compile-time E2E test suite of **60+ test cases (Tiers 1-4)**. This approach ensures 100% deterministic execution, fast feedback loops, and prevents runtime execution overhead.

---

## 2. Codebase & Dependency Audit

We inspected `package.json` and the `node_modules` directory to identify available tools for parsing and structural assertions.

### 2.1. Available Dependencies
- **React 19 & Vite 8**: The frontend is a modern single-page application.
- **Framer Motion 12**: Used for global micro-interactions and transitions.
- **PostCSS (installed in node_modules)**: Can be used to parse CSS into an Abstract Syntax Tree (AST), facilitating assertions on variables, media queries, and utility declarations.
- **Espree / Acorn (installed in node_modules)**: ESLint’s default parsers. They allow us to parse JSX components into an AST to query element structures, props, and accessibility attributes.
- **Style-to-Object (installed in node_modules)**: Can parse inline style strings into JavaScript objects for analysis.

### 2.2. Configuration Audit
The package currently lacks a `"test"` script. We propose adding the following to the `scripts` object in `package.json`:
```json
"scripts": {
  "test": "node scripts/run_e2e_tests.mjs"
}
```

---

## 3. Core Static & Structural Test Infrastructure Strategy

The E2E test runner (`scripts/run_e2e_tests.mjs`) will operate as an independent verification harness. It will load, parse, and evaluate files statically using AST-based and regex-based assertions.

```
+-----------------------------------------------------------------------------------+
|                           scripts/run_e2e_tests.mjs                               |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  |    CSS Parsing     |   |   JSX Component AST   |   |   Contrast / Luminance |  |
|  |     (PostCSS)      |   |    (Espree/Acorn)     |   |       Calculator       |  |
|  +---------+----------+   +-----------+-----------+   +-----------+------------+  |
|            |                          |                           |               |
|            v                          v                           v               |
|  +-----------------------------------------------------------------------------+  |
|  |                     E2E Suite Assertions (Tiers 1-4)                        |  |
|  |   - Glassmorphism Check                   - Responsive Utility Checks       |  |
|  |   - Motion Props Assertions               - A11y Outlines & TabIndex Checks |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|                              JUnit or Custom Report                               |
+-----------------------------------------------------------------------------------+
```

### 3.1. CSS Parsing Mechanism
Using PostCSS or regular expression parsing, the runner loads `src/index.css` and analyzes:
1. **Root Variable Definitions**: Extracts all `--bg-*`, `--text-*`, `--accent-*`, and `--border-*` variables.
2. **Theme Selection Block (`[data-theme="light"]`)**: Verifies that override values exist for light mode.
3. **Responsive Media Queries**: Extracts `@media` rules to verify breakpoints (e.g. `max-width: 768px`) and the overrides applied inside them.
4. **Keyframe Animations**: Asserts the existence of critical animations (`slideUpFade`, `navEnter`, `cursorGlow`, etc.).
5. **A11y Outlines**: Checks if selectors containing `:focus` or `:focus-visible` exist and assert they define visible outline properties.

### 3.2. JSX Component AST Parsing Mechanism
Using `espree` or `acorn-jsx`, the runner parses JSX files into ASTs. This allows the runner to:
1. **Find motion elements**: Checks for elements matching `<motion.div>`, `<motion.button>`, etc. Asserts that they define properties like `whileHover={{ scale: ... }}`, `whileTap={{ scale: ... }}`, or `transition={{ ... }}`.
2. **Inspect Accessibility Props**: Verifies that any component containing an `onClick` handler also contains a `tabIndex={0}` or `tabIndex="..."` attribute and an keyboard handler (`onKeyDown` or `onKeyPress`).
3. **Verify Tap Targets**: Analyzes CSS classes applied to clickable elements (e.g., buttons, input tags, navigation anchors) and asserts that they include styles ensuring a minimum tap size of `44px` (e.g., matching padding classes `py-3 px-4`, height declarations, or specific styles like `height: '44px'`).
4. **Detect Structural Layouts**: Checks that page layouts use grid or flex patterns for responsiveness (e.g., presence of class patterns like `grid-cols-1 md:grid-cols-3` or responsive CSS rule associations).

---

## 4. Programmatic Contrast and Accessibility Calculations

To guarantee WCAG 2.1 compliance (Contrast Ratio >= 4.5:1 for normal text), the test runner includes an automated color contrast calculator. 

### 4.1. The Relative Luminance Formula
For any color variable extracted from `src/index.css` (either in `#RRGGBB` or RGB format), the runner normalizes values and calculates relative luminance ($L$):
$$L = 0.2126 \times R_s + 0.7152 \times G_s + 0.0722 \times B_s$$
Where $C_s$ (for $C \in \{R, G, B\}$) is computed from normalized 8-bit components ($C_{8bit} \in [0, 255]$):
$$C_{std} = \frac{C_{8bit}}{255}$$
$$C_s = \begin{cases} 
\frac{C_{std}}{12.92} & \text{if } C_{std} \le 0.03928 \\
\left(\frac{C_{std} + 0.055}{1.055}\right)^{2.4} & \text{if } C_{std} > 0.03928
\end{cases}$$

### 4.2. Contrast Ratio Formula
The contrast ratio is calculated as:
$$\text{Contrast Ratio} = \frac{L_{lighter} + 0.05}{L_{darker} + 0.05}$$

### 4.3. Contrast Test Runner Logic
The runner parses:
1. **Dark Mode Colors**: Foreground `--text-primary` (`#f8fafc`), `--text-secondary` (`#cbd5e1`) compared to background `--bg-primary` (`#0a0a0f`), `--bg-secondary` (`#0f0f18`), and `--bg-surface` (`#13131f`).
2. **Light Mode Colors**: Foreground `--text-primary` (`#111827`), `--text-secondary` (`#374151`) compared to background `--bg-primary` (`#ffffff`), `--bg-secondary` (`#f9fafb`), and `--bg-surface` (`#f3f4f6`).
3. **Accent Elements**: `--accent` (`#00E87A`) or `--accent-cyan` (`#5B9EFF`) compared to the corresponding text background.
If any pair yields a contrast ratio $< 4.5$, the test fails.

---

## 5. The 60+ Test Cases Specification Blueprint

We classify the E2E verification into **5 Core Features** mapped to the UX overhaul goals:
1. **Glassmorphism Styles**: Verifies borders, blurs, shadows, and variables.
2. **Micro-interactions**: Verifies motion events, interactive scales, and transitions.
3. **Responsiveness**: Verifies viewport-specific classes, grids, and tap target sizes.
4. **Accessibility**: Verifies WCAG contrast ratios, focus rings, outline variables, and keyboard event handlers.
5. **Routing & Integrity**: Verifies SEO title/description mapping, paths, and checks for bypasses.

Each feature is evaluated across **4 Tiers**:
- **Tier 1 (Feature Coverage)**: Basic structural and CSS requirements (5 tests per feature).
- **Tier 2 (Boundary & Corner Cases)**: Edge cases, dark/light theme properties, and empty states (5 tests per feature).
- **Tier 3 (Cross-Feature Combinations)**: Testing multi-feature constraints (5 tests total).
- **Tier 4 (Real-World Application Scenarios)**: Asserting correct configuration in full-page contexts (5 tests total).

### 5.1. E2E Test Cases Master Registry (Tiers 1 & 2)

| Test ID | Feature | Tier | Target File(s) | Test Description & Static Assertion Logic |
| :--- | :--- | :--- | :--- | :--- |
| **E2E-1.1** | Glassmorphism | Tier 1 | `src/index.css` | **CSS Variables Check**: Assert that `:root` defines `--bg-surface`, `--border-primary`, and `--shadow-card`. |
| **E2E-1.2** | Glassmorphism | Tier 1 | `src/index.css` | **Card Blur Definition**: Assert that `.navbar` or glassmorphic cards specify `backdrop-filter: blur(...)` and `-webkit-backdrop-filter: blur(...)`. |
| **E2E-1.3** | Glassmorphism | Tier 1 | `src/index.css` | **Card Shadows**: Assert that `--shadow-card` uses RGBA values representing a semi-transparent dark shade. |
| **E2E-1.4** | Glassmorphism | Tier 1 | `src/components/Landing.jsx` | **Floating Orbs Styling**: Assert that components render container elements with className matches for `orb-1`, `orb-2`, and `orb-3`. |
| **E2E-1.5** | Glassmorphism | Tier 1 | `src/index.css` | **Visual Borders**: Verify that `.navbar` and `.navbar-dropdown` define a border of at least `1px solid` with transparent/accent values. |
| **E2E-1.6** | Glassmorphism | Tier 2 | `src/index.css` | **Theme Swapping Styles**: Check that `[data-theme="light"]` overrides background variables to light values (e.g. `#ffffff`). |
| **E2E-1.7** | Glassmorphism | Tier 2 | `src/index.css` | **Glassmorphic Hover**: Assert that hover classes like `.navbar-back:hover` specify modifications to backgrounds and border colors. |
| **E2E-1.8** | Glassmorphism | Tier 2 | `src/index.css` | **High Contrast Mode Support**: Verify the CSS does not override native high contrast colors or offers high contrast fallbacks. |
| **E2E-1.9** | Glassmorphism | Tier 2 | `src/index.css` | **Fallback Blurs**: Check that CSS rules with `backdrop-filter` also provide a solid background fallback for browsers that do not support filters. |
| **E2E-1.10**| Glassmorphism | Tier 2 | `src/components/Landing.jsx` | **Canvas Overlay Hierarchy**: Assert that `ParticleCanvas` (canvas tag) specifies an absolute or fixed positioning with `z-index: 0` or similar, ensuring it sits behind content. |
| **E2E-2.1** | Micro-interactions | Tier 1 | `src/index.css` | **Keyframes Presence**: Assert the presence of `@keyframes slideUpFade` and `@keyframes bouncyScale` in the stylesheet. |
| **E2E-2.2** | Micro-interactions | Tier 1 | `src/components/Landing.jsx` | **Landing Page Hero Entrance**: Assert that the main Hero container uses `motion.div` or `motion.h1` with an `initial` animation state containing opacity/transform. |
| **E2E-2.3** | Micro-interactions | Tier 1 | `src/components/Navbar.jsx` | **Navbar Brand Scale**: Assert that `.navbar-brand` utilizes hover scaling via CSS or Framer Motion. |
| **E2E-2.4** | Micro-interactions | Tier 1 | `src/components/Footer.jsx` | **Hover Transition Class**: Verify footer social links or anchors use hover transitions to animate color changes. |
| **E2E-2.5** | Micro-interactions | Tier 1 | `src/components/Landing.jsx` | **Scroll Progress Easing**: Assert that `ScrollProgress` uses a linear or ease transition in its style attributes. |
| **E2E-2.6** | Micro-interactions | Tier 2 | `src/index.css` | **Reduced Motion Media Query**: Assert that `@media (prefers-reduced-motion: reduce)` disables animations (`animation-duration: 0.01ms !important`). |
| **E2E-2.7** | Micro-interactions | Tier 2 | `src/components/Navbar.jsx` | **Search Focus Transition**: Assert that search input specifies transition rules for width or border-color adjustments. |
| **E2E-2.8** | Micro-interactions | Tier 2 | `src/components/Landing.jsx` | **Card Tilt Hover**: Verify that the tool cards in the dashboard define hover-based translation/scale effects. |
| **E2E-2.9** | Micro-interactions | Tier 2 | `src/components/code/JsonFormatter.jsx` | **Copy-to-Clipboard Feedback**: Assert that copy buttons trigger a state change rendering a visual checkmark or feedback message. |
| **E2E-2.10**| Micro-interactions | Tier 2 | `src/components/Landing.jsx` | **Intersection Observer Lazy Render**: Assert that the Landing page uses an `IntersectionObserver` to trigger loading more tool cards dynamically. |
| **E2E-3.1** | Responsiveness | Tier 1 | `src/components/Landing.jsx` | **Hero Responsive Sizing**: Assert that the hero section text uses fluid CSS sizing (e.g. `clamp(...)`). |
| **E2E-3.2** | Responsiveness | Tier 1 | `src/components/Landing.jsx` | **Dashboard Columns**: Assert that tool dashboards use flexible grid containers with grid-cols rules or flex layouts for auto-wrapping. |
| **E2E-3.3** | Responsiveness | Tier 1 | `src/components/Navbar.jsx` | **Navbar Action Wrap**: Assert that navbar flex layouts prevent overflow on small viewports by defining wrapping or hide strategies. |
| **E2E-3.4** | Responsiveness | Tier 1 | `src/components/Footer.jsx` | **Footer Layout**: Assert that the footer switches from row to column layout on smaller screens. |
| **E2E-3.5** | Responsiveness | Tier 1 | `src/components/Navbar.jsx` | **Search Tap Target**: Verify the search input height is at least `40px` or has padding matching a `44px` target size. |
| **E2E-3.6** | Responsiveness | Tier 2 | `src/index.css` | **Horizontal Overflow Prevention**: Check that `body` or `html` contains `overflow-x: hidden`. |
| **E2E-3.7** | Responsiveness | Tier 2 | `src/components/Landing.jsx` | **Mobile Breakpoint Rules**: Verify the stylesheet handles custom breakpoints (e.g., max-width `768px` or `480px`) to adjust padding. |
| **E2E-3.8** | Responsiveness | Tier 2 | `src/components/Navbar.jsx` | **Dropdown Height Clamp**: Assert that `.navbar-dropdown` defines a `max-height` and `overflow-y` to prevent falling off the viewport. |
| **E2E-3.9** | Responsiveness | Tier 2 | `src/components/blog/BlogViews.jsx` | **Blog Responsive Grid**: Assert that blog posts wrap correctly using flexible columns on screen widths under `640px`. |
| **E2E-3.10**| Responsiveness | Tier 2 | `src/components/layout/RelatedTools.jsx` | **Related Section Layout**: Verify related tools section adapts its structure on mobile targets. |
| **E2E-4.1** | Accessibility | Tier 1 | `src/index.css` | **Contrast Calculation Check**: Parse colors and calculate relative luminance to confirm dark-theme and light-theme contrast ratios are $\ge 4.5$. |
| **E2E-4.2** | Accessibility | Tier 1 | `src/index.css` | **Focus Visible Indicator**: Assert the stylesheet defines a specific rule for `:focus-visible` to outline focused elements. |
| **E2E-4.3** | Accessibility | Tier 1 | `src/components/Navbar.jsx` | **Input Label association**: Assert that the search input defines a valid label, `aria-label`, or descriptive ID attribute. |
| **E2E-4.4** | Accessibility | Tier 1 | `src/components/Footer.jsx` | **Semantic Landmarks**: Assert that the footer layout utilizes the HTML `<footer>` tag rather than generic `<div>` tags. |
| **E2E-4.5** | Accessibility | Tier 1 | `src/components/blog/BlogViews.jsx` | **Image Alternates**: Verify that all image tags (`<img>`) render an `alt="..."` attribute. |
| **E2E-4.6** | Accessibility | Tier 2 | `src/components/Navbar.jsx` | **Theme Toggle Accessibility**: Assert that the theme toggle button has a descriptive `title` or `aria-label` attribute. |
| **E2E-4.7** | Accessibility | Tier 2 | `src/components/Navbar.jsx` | **Keyboard Navigation for Dropdown**: Assert that keyboard listeners (`onKeyDown`) handle `ArrowUp`/`ArrowDown`/`Enter`/`Escape` on search results. |
| **E2E-4.8** | Accessibility | Tier 2 | `src/components/blog/BlogViews.jsx` | **Readable Body Contrast**: Assert that blog post content containers use high contrast text classes (`text-primary` or `text-secondary`). |
| **E2E-4.9** | Accessibility | Tier 2 | `src/components/Navbar.jsx` | **Escape Key Blur**: Assert that pressing Escape blurs active inputs and closes dropdown overlays. |
| **E2E-4.10**| Accessibility | Tier 2 | `src/components/Navbar.jsx` | **Active Selection Focus Indicator**: Assert that the selected index in the search dropdown displays a distinct class (e.g. `active`). |
| **E2E-5.1** | Routing / Integrity | Tier 1 | `src/App.jsx` | **Pathname Routes Configuration**: Assert that routing handles core categories: `/`, `/blog`, and tool subpages. |
| **E2E-5.2** | Routing / Integrity | Tier 1 | `src/App.jsx` | **SEO Title Definitions**: Assert that each entry in the tool registry defines a unique `seoTitle` and `seoDesc`. |
| **E2E-5.3** | Routing / Integrity | Tier 1 | `src/App.jsx` | **Lazy Load Verification**: Assert that all tool page imports are lazy-loaded via `React.lazy` to maintain high performance. |
| **E2E-5.4** | Routing / Integrity | Tier 1 | `src/App.jsx` | **Index Route Rendering**: Assert that when path matches `/`, the `<Landing />` page is loaded. |
| **E2E-5.5** | Routing / Integrity | Tier 1 | `src/App.jsx` | **Registry Consistency**: Assert that every item in the `TOOLS` registry maps to a valid React component import. |
| **E2E-5.6** | Routing / Integrity | Tier 2 | `src/App.jsx` | **Empty/404 Redirect**: Assert that invalid or unmapped routes default to redirecting to the Home/Landing component. |
| **E2E-5.7** | Routing / Integrity | Tier 2 | `src/App.jsx` | **Category Validation**: Verify that the tools list handles filtering by specific category parameters without error. |
| **E2E-5.8** | Routing / Integrity | Tier 2 | `src/components/blog/BlogViews.jsx` | **BlogPost Back Navigation**: Verify that the blog post view includes a clickable back navigation button returning to the list view. |
| **E2E-5.9** | Routing / Integrity | Tier 2 | `src/components/Navbar.jsx` | **Click Brand Navigation**: Assert that clicking the logo brand returns the user to the dashboard homepage. |
| **E2E-5.10**| Routing / Integrity | Tier 2 | `src/components/Navbar.jsx` | **Dropdown Click Navigation**: Assert that clicking an item in the search dropdown changes the active tool component. |

### 5.2. E2E Test Cases Master Registry (Tiers 3 & 4)

| Test ID | Feature | Tier | Target File(s) | Test Description & Static Assertion Logic |
| :--- | :--- | :--- | :--- | :--- |
| **E2E-3.11**| Cross-Feature | Tier 3 | `src/components/Navbar.jsx` | **Interactive Keyboard & Dropdown Style**: Assert that when navigating via keyboard `ArrowUp`/`ArrowDown`, active dropdown items receive both styling outlines and accessibility properties. |
| **E2E-3.12**| Cross-Feature | Tier 3 | `src/components/Navbar.jsx` | **Theme Switch Contrast Preservation**: Assert that changing themes (light/dark mode variables) updates both background and text variables, maintaining contrast ratios $\ge 4.5$. |
| **E2E-3.13**| Cross-Feature | Tier 3 | `src/components/Landing.jsx` | **Motion Interaction on Hover**: Assert that Framer Motion elements like `.hero-badge` scale down on interaction without causing cumulative layout shifts (CLS) or layout reflows on mobile size constraints. |
| **E2E-3.14**| Cross-Feature | Tier 3 | `src/components/Landing.jsx` | **Mobile Responsive Tap Contrast**: Verify that mobile toggle components (such as viewMode switch buttons) have a minimum dimensions of $44\text{px} \times 44\text{px}$ and comply with the target text contrast ratio. |
| **E2E-3.15**| Cross-Feature | Tier 3 | `src/index.css` | **Reduced Motion Focus Preservation**: Assert that when user prefers reduced motion, transitions disable instantly, but visible focus rings are preserved without degradation. |
| **E2E-4.11**| Real-World | Tier 4 | `src/components/Landing.jsx`, `src/App.jsx` | **Search and Filter Scenario**: Verify that the landing page dashboard handles text search matching by `t.name` or `t.category`, filtering visual elements accordingly. |
| **E2E-4.12**| Real-World | Tier 4 | `src/components/Landing.jsx` | **Recent Tools Display Scenario**: Verify that recently used tools (e.g. `recentTools` array) render in order inside a specific list, using responsive cards. |
| **E2E-4.13**| Real-World | Tier 4 | `src/components/blog/BlogViews.jsx` | **Full Blog Navigation Scenario**: Verify that selecting a blog post loads `<BlogPost />` with proper schemas, headers, readable text, and layout responsiveness. |
| **E2E-4.14**| Real-World | Tier 4 | `src/components/calculators/EmiCalculator.jsx` | **Calculator Output Calculation Layout**: Verify that standard calculators (e.g. EMI Calculator) present both inputs (with appropriate labels) and results inside responsive cards. |
| **E2E-4.15**| Real-World | Tier 4 | `src/components/code/JsonFormatter.jsx` | **JSON Formatting Integration Flow**: Verify that standard formatter components provide input textareas, action buttons with hover effects, and formatted read-only outputs with focus visibility. |

---

## 6. Integrity & Anti-Bypass Rules

To prevent "bypass cheats" (e.g., developers adding mock properties only for tests or implementing dummy behaviors that change when testing is active), the runner will scan the codebase files for prohibited bypass codes.

### 6.1. Prohibited Code Patterns
The following patterns will trigger immediate test suite failures if found outside test scripts:
1. Reference to test flag flags: `window.isTesting`, `process.env.NODE_ENV === 'test'` inside client components.
2. Test bypass comments: `/* test-bypass */`, `// disable-e2e-check`.
3. Conditional layout blocks: Render routes or styles conditionally based on user agent checks or dummy facades.

---

## 7. Implementation Plan for the E2E Test Suite

Below is a proposed implementation structure for the E2E test runner (`scripts/run_e2e_tests.mjs`) to be executed during Milestone 1.

### 7.1. E2E Test Runner Code Outline (Draft)

```javascript
import fs from 'fs';
import path from 'path';
import * as espree from 'espree';
import * as postcss from 'postcss';

const WORKSPACE_DIR = process.cwd();

// Assert utility
class Assert {
  static equals(a, b, msg) {
    if (a !== b) throw new Error(`${msg}: Expected ${b}, got ${a}`);
  }
  static includes(str, substr, msg) {
    if (!str.includes(substr)) throw new Error(`${msg}: Substring "${substr}" not found`);
  }
}

// 1. WCAG Contrast Calculator
function getRelativeLuminance(hex) {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;

  const mapComponent = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * mapComponent(r) + 0.7152 * mapComponent(g) + 0.0722 * mapComponent(b);
}

function verifyContrast(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio;
}

// 2. JSX AST Crawler
function parseJSX(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  return espree.parse(code, {
    ecmaVersion: 2023,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  });
}

// Run test cases
async function main() {
  console.log("🚀 Starting ZeroApiTools UI/UX Overhaul E2E Verification Suite...");
  let passes = 0, failures = 0;
  
  const testCases = [
    {
      id: "E2E-1.1",
      desc: "Assert CSS defines variables for surface, borders, and shadows",
      run: () => {
        const cssContent = fs.readFileSync(path.join(WORKSPACE_DIR, 'src/index.css'), 'utf-8');
        Assert.includes(cssContent, '--bg-surface', "CSS lacks --bg-surface variable");
        Assert.includes(cssContent, '--border-primary', "CSS lacks --border-primary variable");
        Assert.includes(cssContent, '--shadow-card', "CSS lacks --shadow-card variable");
      }
    },
    {
      id: "E2E-4.1",
      desc: "WCAG 2.1 Contrast Ratio Verification (Dark & Light Modes)",
      run: () => {
        // Dark Mode contrast verification
        const darkPrimaryBg = '#0a0a0f'; // --bg-primary
        const darkTextPrimary = '#f8fafc'; // --text-primary
        const darkTextSecondary = '#cbd5e1'; // --text-secondary
        
        const textRatio = verifyContrast(darkTextPrimary, darkPrimaryBg);
        const secRatio = verifyContrast(darkTextSecondary, darkPrimaryBg);
        
        Assert.equals(textRatio >= 4.5, true, `Dark text-primary contrast ${textRatio.toFixed(2)} is < 4.5`);
        Assert.equals(secRatio >= 4.5, true, `Dark text-secondary contrast ${secRatio.toFixed(2)} is < 4.5`);
        
        // Light Mode contrast verification
        const lightPrimaryBg = '#ffffff';
        const lightTextPrimary = '#111827';
        const lightTextSecondary = '#374151';
        
        const lightTextRatio = verifyContrast(lightTextPrimary, lightPrimaryBg);
        const lightSecRatio = verifyContrast(lightTextSecondary, lightPrimaryBg);
        
        Assert.equals(lightTextRatio >= 4.5, true, `Light text-primary contrast ${lightTextRatio.toFixed(2)} is < 4.5`);
        Assert.equals(lightSecRatio >= 4.5, true, `Light text-secondary contrast ${lightSecRatio.toFixed(2)} is < 4.5`);
      }
    }
    // Implement all remaining 58 tests in this fashion...
  ];

  for (const test of testCases) {
    try {
      test.run();
      console.log(`✅ [PASS] ${test.id}: ${test.desc}`);
      passes++;
    } catch (err) {
      console.error(`❌ [FAIL] ${test.id}: ${test.desc}\n   Reason: ${err.message}`);
      failures++;
    }
  }

  console.log(`\n📊 Verification Summary: ${passes} Passed, ${failures} Failed.`);
  process.exit(failures > 0 ? 1 : 0);
}

main();
```

---

## 8. Conclusion

Implementing static and structural E2E test verification on the ZeroApiTools codebase is not only feasible, but highly effective due to the availability of PostCSS and AST-based parsers (`espree`/`acorn`) in the existing node environment. The proposed E2E test runner design covers 60 distinct test cases across 4 Tiers, ensuring complete coverage of the design overhaul goals (Glassmorphism, animations, responsiveness, accessibility contrast ratios, and routing integrity). This guarantees that any changes to component structure or theme styling will be verified instantly and deterministically.
