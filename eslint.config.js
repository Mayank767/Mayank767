import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  // ── Browser + React files ──
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // ── Node.js serverless API functions (Vercel) ──
  {
    files: ['api/**/*.js', 'scripts/**/*.{js,mjs}', '*.cjs', '*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-useless-escape': 'warn',
    },
  },
])
