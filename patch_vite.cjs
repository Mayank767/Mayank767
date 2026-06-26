const fs = require('fs');

let code = fs.readFileSync('vite.config.js', 'utf-8');

const targetStr = "console.log(`\\n✅ [prerender] Generated ${created} static HTML pages with H1 + JSON-LD + HowTo schema + full SEO content.\\n`)";

const newCode = `
        // ── Prerender Blog Pages ──
        const blogsCode = fs.readFileSync(path.resolve(__dirname, 'src/data/blogs.js'), 'utf-8');
        const blogRegex = /slug:\\s*'([^']+)',[\\s\\S]*?title:\\s*'([^']+)',[\\s\\S]*?excerpt:\\s*'([^']+)',[\\s\\S]*?coverImage:\\s*'([^']+)'/g;
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
          const url = \`https://zeroapitools.vercel.app/blog-post/\${blog.slug}\`;
          const title = \`\${blog.title} - ZeroApiTools Blog\`;
          
          let html = baseHtml
            .replace(/<title>[^<]*<\\/title>/, \`<title>\${title}</title>\`)
            .replace(/<meta\\s+name="description"\\s+content="[^"]*"\\s*\\/?>/, \`<meta name="description" content="\${blog.excerpt}" />\`)
            .replace(/<link\\s+rel="canonical"\\s+href="[^"]*"\\s*\\/?>/, \`<link rel="canonical" href="\${url}" />\`)
            .replace(/<meta\\s+property="og:title"\\s+content="[^"]*"\\s*\\/?>/, \`<meta property="og:title" content="\${title}" />\`)
            .replace(/<meta\\s+property="og:description"\\s+content="[^"]*"\\s*\\/?>/, \`<meta property="og:description" content="\${blog.excerpt}" />\`)
            .replace(/<meta\\s+property="og:url"\\s+content="[^"]*"\\s*\\/?>/, \`<meta property="og:url" content="\${url}" />\`)
            .replace(/<meta\\s+property="og:image"\\s+content="[^"]*"\\s*\\/?>/, \`<meta property="og:image" content="https://zeroapitools.vercel.app\${blog.coverImage}" />\`)
            .replace(/<meta\\s+name="twitter:title"\\s+content="[^"]*"\\s*\\/?>/, \`<meta name="twitter:title" content="\${title}" />\`)
            .replace(/<meta\\s+name="twitter:description"\\s+content="[^"]*"\\s*\\/?>/, \`<meta name="twitter:description" content="\${blog.excerpt}" />\`)
            .replace(/<meta\\s+name="twitter:image"\\s+content="[^"]*"\\s*\\/?>/, \`<meta name="twitter:image" content="https://zeroapitools.vercel.app\${blog.coverImage}" />\`)
            .replace(/<h1>[^<]*<\\/h1>/, \`<h1>\${blog.title}</h1>\`)
            .replace(/<p>\\s*ZeroApiTools provides 65\\+[\\s\\S]*?<\\/p>/, \`<p>\${blog.excerpt}</p>\`);

          const jsonLd = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "image": \`https://zeroapitools.vercel.app\${blog.coverImage}\`,
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
          html = html.replace(/<script type="application\\/ld\\+json" id="geo-schema">[\\s\\S]*?<\\/script>/, \`<script type="application/ld+json" id="geo-schema">\${jsonLd}</script>\`);

          fs.writeFileSync(path.join(blogPostDir, \`\${blog.slug}.html\`), html, 'utf-8');
          created++;
        }

        // Also pre-render /blog index
        let blogIndexHtml = baseHtml
          .replace(/<title>[^<]*<\\/title>/, \`<title>Developer Blog - ZeroApiTools | Free Developer Tools</title>\`)
          .replace(/<meta\\s+name="description"\\s+content="[^"]*"\\s*\\/?>/, \`<meta name="description" content="Insights, guides, and tutorials generated for developers." />\`)
          .replace(/<link\\s+rel="canonical"\\s+href="[^"]*"\\s*\\/?>/, \`<link rel="canonical" href="https://zeroapitools.vercel.app/blog" />\`)
          .replace(/<h1>[^<]*<\\/h1>/, \`<h1>Developer Blog</h1>\`)
          .replace(/<p>\\s*ZeroApiTools provides 65\\+[\\s\\S]*?<\\/p>/, \`<p>Insights, guides, and tutorials generated for developers.</p>\`);
        fs.writeFileSync(path.join(distDir, 'blog.html'), blogIndexHtml, 'utf-8');
        created++;

        console.log(\`\\n✅ [prerender] Generated \${created} static HTML pages including \${blogs.length} blog posts.\\n\`)`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newCode);
  fs.writeFileSync('vite.config.js', code, 'utf-8');
  console.log('Successfully patched vite.config.js');
} else {
  console.log('Could not find target string in vite.config.js');
}
