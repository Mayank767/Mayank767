const fs = require('fs');
const path = require('path');

const appFile = fs.readFileSync(path.join(__dirname, 'src', 'App.jsx'), 'utf-8');
const regex = /\{ id:\s*'([^']+)'/g;
let match;
const toolIds = [];

while ((match = regex.exec(appFile)) !== null) {
  if (match[1] !== 'all') {
    toolIds.push(match[1]);
  }
}

// Ensure unique IDs
const rawIds = [...new Set(toolIds)];

// Remove CATEGORY-only pages that are not real content pages (non-canonical)
// These pages don't have unique content and were causing "non-canonical page in sitemap" errors
const CATEGORY_IDS = ['text', 'code', 'converter', 'calculator', 'css', 'image', 'pdf', 'api', 'security', 'seo', 'unique'];
const uniqueIds = rawIds.filter(id => !CATEGORY_IDS.includes(id));

const now = new Date();
const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

const blogFile = fs.readFileSync(path.join(__dirname, 'src', 'components', 'blog', 'BlogViews.jsx'), 'utf-8');
const blogRegex = /slug:\s*'([^']+)'/g;
const blogSlugs = [];
let blogMatch;
while ((blogMatch = blogRegex.exec(blogFile)) !== null) {
  blogSlugs.push(blogMatch[1]);
}

// Helper to generate hreflang tags with self-reference x-default annotation
function hreflangTags(url) {
  return `    <xhtml:link rel="alternate" hreflang="en" href="${url}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url}" />`;
}

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://zeroapitools.vercel.app/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
${hreflangTags('https://zeroapitools.vercel.app/')}
  </url>
`;

// High priority tool IDs (most searched tools get 0.9)
const HIGH_PRIORITY = ['base64', 'json-formatter', 'jwt-decoder', 'regex-tester', 'image-compress', 'curl-to-fetch', 'api-tester'];

uniqueIds.forEach(id => {
  const priority = HIGH_PRIORITY.includes(id) ? '0.9' : '0.8';
  const url = `https://zeroapitools.vercel.app/${id}`;
  sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${hreflangTags(url)}
  </url>\n`;
});

// Blog home
const blogHomeUrl = 'https://zeroapitools.vercel.app/blog';
sitemap += `  <url>
    <loc>${blogHomeUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
${hreflangTags(blogHomeUrl)}
  </url>\n`;

// Blog posts
blogSlugs.forEach(slug => {
  const url = `https://zeroapitools.vercel.app/blog-post/${slug}`;
  sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
${hreflangTags(url)}
  </url>\n`;
});

sitemap += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
console.log(`Generated sitemap with root + ${uniqueIds.length} tools (excluded ${CATEGORY_IDS.length} category pages) + 1 blog home + ${blogSlugs.length} blog posts.`);
