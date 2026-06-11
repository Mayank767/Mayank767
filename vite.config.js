import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// ─────────────────────────────────────────────────────────
// Extract tool data from App.jsx at config-load time
// ─────────────────────────────────────────────────────────
const appCode = fs.readFileSync(path.resolve(__dirname, 'src/App.jsx'), 'utf-8')

// Match: { id: 'xxx', name: 'Yyy', desc: 'Zzz', icon: '...', category: 'cat' ...}
const toolRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*desc:\s*'([^']+)',(?:[^}]*?)icon:\s*'([^']*)',\s*category:\s*'([^']+)'/g
const tools = []
let m
while ((m = toolRegex.exec(appCode)) !== null) {
  tools.push({ id: m[1], name: m[2], desc: m[3], icon: m[4], category: m[5] })
}

// ─────────────────────────────────────────────────────────
// Category → keyword mapping for SEO-rich descriptions
// ─────────────────────────────────────────────────────────
const categoryKeywords = {
  text:       'free online text tool, string manipulation, developer utility, browser-based',
  code:       'free code formatter, code beautifier, code minifier, developer tool online',
  converter:  'free online converter, data format conversion, developer tool, instant conversion',
  css:        'free CSS generator, CSS code generator, visual CSS tool, frontend developer tool',
  image:      'free online image tool, image editor, browser-based image processing, no upload required',
  security:   'free security tool, online encryption, password tool, privacy-first, client-side',
  seo:        'free SEO tool, search engine optimization, meta tags, web marketing tool',
  unique:     'free developer utility, productivity tool, browser-based, instant results',
  calculator: 'free online calculator, financial calculator, instant calculation, no signup',
  pdf:        'free online PDF tool, PDF editor, browser-based PDF processing, no upload, private',
}

// ─────────────────────────────────────────────────────────
// Custom Vite plugin: generate /tool-id/index.html for SEO
// H1 tag + JSON-LD structured data + keyword-rich meta
// ─────────────────────────────────────────────────────────
function prerenderRoutes() {
  return {
    name: 'prerender-routes',
    closeBundle: {
      sequential: true,
      async handler() {
        const distDir = path.resolve(__dirname, 'dist')
        const indexPath = path.join(distDir, 'index.html')

        if (!fs.existsSync(indexPath)) {
          console.warn('[prerender] dist/index.html not found, skipping.')
          return
        }

        const baseHtml = fs.readFileSync(indexPath, 'utf-8')
        let created = 0

        for (const tool of tools) {
          const title = `${tool.name} — Free Online Tool | ZeroApiTools`
          const desc = tool.desc.replace(/\.+$/, '')
          const keywords = categoryKeywords[tool.category] || ''
          const description = `${desc}. ${keywords}. 100% free, works offline in your browser. No signup, no API, no data uploaded. ZeroApiTools.`
          const url = `https://zeroapitools.vercel.app/${tool.id}`

          // ── Tool-specific JSON-LD (SoftwareApplication schema) ──
          const jsonLd = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "url": url,
            "description": desc,
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any (Browser-based)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              tool.name,
              "100% Client-Side",
              "No Signup Required",
              "Free Forever",
              "Works Offline"
            ],
            "creator": {
              "@type": "Organization",
              "name": "ZeroApiTools",
              "url": "https://zeroapitools.vercel.app"
            }
          })

          // ── Tool-specific BreadcrumbList schema ──
          const breadcrumbLd = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://zeroapitools.vercel.app/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": tool.name,
                "item": url
              }
            ]
          })

          // ── SEO-rich H1 + paragraph for the loading shell ──
          const h1Text = `${tool.name} — Free Online ${tool.category === 'calculator' ? 'Calculator' : tool.category === 'pdf' ? 'PDF Tool' : 'Tool'}`
          const shellParagraph = `Use ${tool.name} for free — ${desc.toLowerCase()}. ` +
            `This tool runs 100% in your browser with zero server uploads. ` +
            `Part of ZeroApiTools, a collection of 65+ free developer tools. ` +
            `No signup, no API keys, no data collection. Works offline.`

          let html = baseHtml
            // <title>
            .replace(
              /<title>[^<]*<\/title>/,
              `<title>${title}</title>`
            )
            // meta description
            .replace(
              /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
              `<meta name="description" content="${description}" />`
            )
            // canonical
            .replace(
              /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
              `<link rel="canonical" href="${url}" />`
            )
            // OG tags
            .replace(
              /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:title" content="${title}" />`
            )
            .replace(
              /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:description" content="${description}" />`
            )
            .replace(
              /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
              `<meta property="og:url" content="${url}" />`
            )
            // Twitter tags
            .replace(
              /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
              `<meta name="twitter:title" content="${title}" />`
            )
            .replace(
              /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
              `<meta name="twitter:description" content="${description}" />`
            )
            .replace(
              /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/,
              `<meta name="twitter:url" content="${url}" />`
            )
            // ── Replace generic JSON-LD with tool-specific schemas ──
            .replace(
              /<script type="application\/ld\+json" id="geo-schema">[\s\S]*?<\/script>/,
              `<script type="application/ld+json" id="geo-schema">${jsonLd}</script>\n    <script type="application/ld+json">${breadcrumbLd}</script>`
            )
            // ── Replace H1 tag ──
            .replace(
              /<h1>[^<]*<\/h1>/,
              `<h1>${h1Text}</h1>`
            )
            // ── Replace shell paragraph with keyword-rich content ──
            .replace(
              /<p>\s*ZeroApiTools provides 65\+[\s\S]*?<\/p>/,
              `<p>${shellParagraph}</p>`
            )

          // Write to dist/<tool-id>/index.html
          const toolDir = path.join(distDir, tool.id)
          fs.mkdirSync(toolDir, { recursive: true })
          fs.writeFileSync(path.join(toolDir, 'index.html'), html, 'utf-8')
          created++
        }

        console.log(`\n✅ [prerender] Generated ${created} static HTML pages with H1 + JSON-LD + keyword-rich descriptions.\n`)
      }
    }
  }
}

// ─────────────────────────────────────────────────────────
// Vite config
// ─────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [
    react(),
    prerenderRoutes(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('marked') || id.includes('dompurify') || id.includes('js-beautify')) {
              return 'utils';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
