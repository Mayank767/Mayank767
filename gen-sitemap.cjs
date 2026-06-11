const fs = require('fs');
const path = require('path');

const appFile = fs.readFileSync(path.join(__dirname, 'src', 'App.jsx'), 'utf-8');
const regex = /\{ id:\s*'([^']+)'/g;
let match;
const toolIds = [];

while ((match = regex.exec(appFile)) !== null) {
  if (match[1] !== 'all') { // Exclude 'all' if it accidentally matches something
    toolIds.push(match[1]);
  }
}

// Ensure unique IDs
const uniqueIds = [...new Set(toolIds)].filter(id => id !== 'privacy-policy'); // We will add privacy policy, wait why not? Yes include it!

const currentDate = new Date().toISOString();

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://zeroapitools.vercel.app/</loc>
    <lastmod>\${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://zeroapitools.vercel.app/" />
  </url>
`;

uniqueIds.forEach(id => {
  sitemap += `  <url>
    <loc>https://zeroapitools.vercel.app/\${id}</loc>
    <lastmod>\${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://zeroapitools.vercel.app/\${id}" />
  </url>\n`;
});

sitemap += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
console.log(`Generated sitemap with root + ${uniqueIds.length} tools.`);
