import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { TOOL_FAQS, GENERIC_FAQS } from './src/data/faqs.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

        // ── Load toolHowTo.json for rich content injection ──
        const toolHowToPath = path.resolve(__dirname, 'src/data/toolHowTo.json')
        let toolHowToData = {}
        if (fs.existsSync(toolHowToPath)) {
          toolHowToData = JSON.parse(fs.readFileSync(toolHowToPath, 'utf-8'))
        }

        const currentYear = new Date().getFullYear()
        const baseHtml = fs.readFileSync(indexPath, 'utf-8')
        let created = 0

        for (const tool of tools) {
          const title = `${tool.name} — Free Online Tool (${currentYear}) | ZeroApiTools`
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

          // ── Extract HowTo steps from toolHowTo markdown ──
          let howToLd = ''
          const howToMarkdown = toolHowToData[tool.id] || ''
          if (howToMarkdown) {
            // Parse numbered steps like "1. Do something" from the "How to Use" section
            const stepsMatch = howToMarkdown.match(/## How to Use[^\n]*\n[\s\S]*?(?=\n##|\n###|$)/)
            if (stepsMatch) {
              const stepLines = stepsMatch[0].match(/^\d+\.\s+(.+)$/gm)
              if (stepLines && stepLines.length > 0) {
                const steps = stepLines.map((line, i) => ({
                  "@type": "HowToStep",
                  "position": i + 1,
                  "name": line.replace(/^\d+\.\s+/, '').trim(),
                  "text": line.replace(/^\d+\.\s+/, '').trim(),
                  "url": `${url}#step-${i + 1}`
                }))
                howToLd = JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "HowTo",
                  "name": `How to use ${tool.name} online`,
                  "description": `Step-by-step guide to use the free ${tool.name} tool on ZeroApiTools.`,
                  "totalTime": "PT1M",
                  "tool": { "@type": "HowToTool", "name": "Web Browser" },
                  "step": steps
                })
              }
            }
          }

          // ── Convert toolHowTo markdown to simple HTML for static shell ──
          let howToHtml = ''
          if (howToMarkdown) {
            howToHtml = howToMarkdown
              // H1
              .replace(/^# (.+)$/gm, '')  // Skip H1, we already have it
              // H2
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              // H3
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              // Numbered list items
              .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
              // Bold
              .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              // Paragraphs (lines that aren't tags)
              .replace(/^(?!<[hlo]|$)(.+)$/gm, '<p>$1</p>')
              // Wrap consecutive <li> in <ol>
              .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, '<ol>$&</ol>')
              // Clean up empty lines
              .replace(/\n{2,}/g, '\n')
              .trim()
          }

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
            // ── Replace generic JSON-LD with tool-specific schemas + HowTo ──
            .replace(
              /<script type="application\/ld\+json" id="geo-schema">[\s\S]*?<\/script>/,
              `<script type="application/ld+json" id="geo-schema">${jsonLd}</script>\n    <script type="application/ld+json">${breadcrumbLd}</script>${howToLd ? `\n    <script type="application/ld+json">${howToLd}</script>` : ''}`
            )
            // ── Replace Meta Keywords ──
            .replace(
              /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/,
              `<meta name="keywords" content="${tool.name.toLowerCase()}, free ${tool.name.toLowerCase()} online, ${keywords}, zeroapitools" />`
            )
            // ── Replace FAQ Schema ──
            .replace(
              /<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"FAQPage"[\s\S]*?<\/script>/,
              `<script type="application/ld+json">\n${JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": (TOOL_FAQS[tool.id] || GENERIC_FAQS).map(f => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": { "@type": "Answer", "text": f.a }
                }))
              })}\n    </script>`
            )
            // ── Replace H1 tag ──
            .replace(
              /<h1>[^<]*<\/h1>/,
              `<h1>${h1Text}</h1>`
            )
            // ── Replace shell paragraph with keyword-rich content + toolHowTo HTML ──
            .replace(
              /<p>\s*ZeroApiTools provides 65\+[\s\S]*?<\/p>/,
              `<p>${shellParagraph}</p>${howToHtml ? `\n<article class="seo-content" style="text-align:left;max-width:800px;margin:0 auto;padding:20px;color:#94a3b8;font-size:0.95rem;line-height:1.7;">${howToHtml}</article>` : ''}`
            )

          // Write to dist/<tool-id>.html
          const toolPath = path.join(distDir, `${tool.id}.html`)
          fs.writeFileSync(toolPath, html, 'utf-8')
          created++
        }

        
        // ── Prerender Blog Pages ──
        const blogsCode = fs.readFileSync(path.resolve(__dirname, 'src/data/blogs.js'), 'utf-8');
        const blogRegex = /slug:\s*'([^']+)',[\s\S]*?title:\s*'([^']+)',[\s\S]*?excerpt:\s*'([^']+)',[\s\S]*?coverImage:\s*'([^']+)'/g;
        const blogs = [];
        let bm;
        while ((bm = blogRegex.exec(blogsCode)) !== null) {
          blogs.push({ slug: bm[1], title: bm[2], excerpt: bm[3], coverImage: bm[4] });
        }

        const blogPostDir = path.join(distDir, 'blog-post');
        if (!fs.existsSync(blogPostDir)) {
          fs.mkdirSync(blogPostDir, { recursive: true });
        }

        for (const blog of blogs) {
          const url = `https://zeroapitools.vercel.app/blog-post/${blog.slug}`;
          const title = `${blog.title} - ZeroApiTools Blog`;
          
          let html = baseHtml
            .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
            .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${blog.excerpt}" />`)
            .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
            .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`)
            .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${blog.excerpt}" />`)
            .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`)
            .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/, `<meta property="og:image" content="https://zeroapitools.vercel.app${blog.coverImage}" />`)
            .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`)
            .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${blog.excerpt}" />`)
            .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="https://zeroapitools.vercel.app${blog.coverImage}" />`)
            .replace(/<h1>[^<]*<\/h1>/, `<h1>${blog.title}</h1>`)
            .replace(/<p>\s*ZeroApiTools provides 65\+[\s\S]*?<\/p>/, `<p>${blog.excerpt}</p>`);

          const jsonLd = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "image": `https://zeroapitools.vercel.app${blog.coverImage}`,
            "description": blog.excerpt,
            "url": url,
            "publisher": {
              "@type": "Organization",
              "name": "ZeroApiTools",
              "logo": {
                "@type": "ImageObject",
                "url": "https://zeroapitools.vercel.app/og-image.png"
              }
            }
          });
          html = html.replace(/<script type="application\/ld\+json" id="geo-schema">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="geo-schema">${jsonLd}</script>`);

          fs.writeFileSync(path.join(blogPostDir, `${blog.slug}.html`), html, 'utf-8');
          created++;
        }

        // Also pre-render /blog index
        let blogIndexHtml = baseHtml
          .replace(/<title>[^<]*<\/title>/, `<title>Developer Blog - ZeroApiTools | Free Developer Tools</title>`)
          .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="Insights, guides, and tutorials generated for developers." />`)
          .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="https://zeroapitools.vercel.app/blog" />`)
          .replace(/<h1>[^<]*<\/h1>/, `<h1>Developer Blog</h1>`)
          .replace(/<p>\s*ZeroApiTools provides 65\+[\s\S]*?<\/p>/, `<p>Insights, guides, and tutorials generated for developers.</p>`);
        fs.writeFileSync(path.join(distDir, 'blog.html'), blogIndexHtml, 'utf-8');
        created++;

        console.log(`\n✅ [prerender] Generated ${created} static HTML pages including ${blogs.length} blog posts.\n`)
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
