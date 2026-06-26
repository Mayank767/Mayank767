## 2026-06-22T13:39:17Z
You are the Global Theme & Component Implementer.
Your working directory is: c:\Users\mayni\OneDrive\Desktop\New folder (7)\.agents\worker_m6
You are tasked with implementing Milestone M6: Global Theme & Components.

Specific instructions:
1. CSS Variables for Glassmorphism & Accessibility (apply to :root and [data-theme="light"] in `src/index.css`):
   - Centralize glassmorphism CSS variables in `src/index.css`: `--glass-bg`, `--glass-border`, `--glass-blur`, `--pane-gradient`.
     - In dark mode (:root):
       `--glass-bg: rgba(6, 6, 8, 0.7);`
       `--glass-border: rgba(255, 255, 255, 0.06);`
       `--glass-blur: 20px;`
       `--pane-gradient: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.3) 100%);`
     - In light mode ([data-theme="light"]):
       `--glass-bg: rgba(255, 255, 255, 0.7);`
       `--glass-border: rgba(0, 0, 0, 0.08);`
       `--glass-blur: 20px;`
       `--pane-gradient: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(243, 244, 246, 0.6) 100%);`
   - Adjust Light Mode text contrast ratios to meet WCAG AA (>= 4.5:1):
     - Change `--text-muted` to `#595959` (4.8:1 on #ffffff; 3.6:1 on #e5e7eb) in light mode.
     - Change `--text-3` to `#4d4d4d` in light mode.
     - Define `--text-4: #64748b` in `:root` and `--text-4: #4b5563` in light mode.
   - Refactor `.navbar` and `.footer-new` to use the CSS variables:
     - `.navbar` background should be `var(--glass-bg)`, border-bottom should be `1px solid var(--glass-border)`, and backdrop-filter should be `blur(var(--glass-blur)) saturate(180%)`.
     - `.footer-new` background should be `var(--glass-bg)`, border-top should be `1px solid var(--glass-border)`, and backdrop-filter should be `blur(var(--glass-blur))`.
     - `.pane` background should be `var(--pane-gradient)`.
   - Add focus ring style using `:focus-visible` to target `button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible`:
     `outline: 2px solid var(--accent); outline-offset: 2px;`

2. Navbar Accessibility and Responsiveness:
   - Edit `src/components/Navbar.jsx`.
   - Expand the theme toggle button's width and height to 44px (tap target size), or ensure it has a 44px tap target using CSS / class.
   - Ensure the search dropdown container in `Navbar.jsx` is accessible:
     - Input role="combobox", aria-autocomplete="list", aria-expanded={showResults}, aria-controls="search-dropdown-list".
     - List container: id="search-dropdown-list", role="listbox".
     - Dropdown items: role="option", aria-selected={i === activeIndex}.
     - Handle keyboard navigation (ArrowUp, ArrowDown, Enter) in the search dropdown to move active index and select a tool.
     - Support mobile responsiveness: when viewport is < 640px, hide the text search input and show an expandable search button which opens a full-width overlay when clicked.
     - Convert the "Blog" navigation button to icon-only "📝" or hide text on small screens (< 640px) to prevent layout wrapping or overflow.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Please run the build command (`npm run build`) and ESLint checks (`npm run lint`) inside your worker execution to verify no breakage.
When complete, write a detailed handoff to `c:\Users\mayni\OneDrive\Desktop\New folder (7)\.agents\worker_m6\handoff.md` and send a message back to me.
