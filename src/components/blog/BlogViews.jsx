import React, { useState, useEffect } from 'react';
import { useApp } from '../../App';
import ReactMarkdown from 'react-markdown';

// Mock data while we wait for Notion API integration
const MOCK_BLOGS = [
  {
    id: '1',
    slug: 'why-developer-tools-must-be-local',
    title: 'Why Developer Tools Must Run Locally for Ultimate Privacy',
    excerpt: 'The hidden dangers of uploading your JSON, JWTs, and code to remote servers, and why client-side processing is the future.',
    date: 'June 4, 2026',
    author: 'Mayank',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    content: '# The Privacy Problem\n\nEvery day, developers paste sensitive JSON payloads, JWT tokens, and proprietary code snippets into random online formatting tools. While convenient, this practice exposes companies to significant security risks. When you hit "Format," where does that data go?\n\n## Client-Side to the Rescue\n\nTools like **ZeroApiTools** process everything using your browser\'s Javascript engine. The data never leaves your device. This means you can format database dumps, decode private JWTs, and minify source code with absolute peace of mind.\n\n### Benefits of Local Tools:\n1. **Zero Latency:** No waiting for server responses.\n2. **100% Privacy:** Your data stays on your machine.\n3. **Offline Support:** Work from anywhere, even without Wi-Fi.\n\nSwitch to local tools today and protect your workflow!'
  },
  {
    id: '2',
    slug: 'mastering-regex-for-developers',
    title: 'Mastering Regular Expressions: A Practical Guide',
    excerpt: 'Stop copying and pasting Regex from StackOverflow. Learn how to build, test, and debug your own patterns with our visual tools.',
    date: 'June 6, 2026',
    author: 'Mayank',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    content: '# Stop Guessing Your Regex\n\nRegular Expressions (Regex) often feel like magic spells. You paste them from forums, and they miraculously work—until they don\'t. \n\n## Visualizing Patterns\n\nThe best way to learn Regex is through immediate visual feedback. Using the Regex Tester on ZeroApiTools, you can type your pattern and instantly see which parts of your text light up.\n\n### Common Patterns to Know:\n- `^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$` - Basic Email Validation\n- `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$` - Minimum 8 chars, 1 letter, 1 number\n\nStart experimenting today and master the art of text manipulation!'
  },
  {
    id: '3',
    slug: 'complete-guide-json-formatting',
    title: 'Complete Guide to Free JSON Formatting and Validation Tools in 2026',
    excerpt: 'Learn how to easily beautify, minify, and validate your JSON data. A deep dive into JSON structures and the best local tools.',
    date: 'June 13, 2026',
    author: 'ZeroApiTools Team',
    coverImage: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80',
    content: '# The Ultimate Guide to JSON Formatting\n\nJSON (JavaScript Object Notation) is the undisputed king of data exchange on the web. However, reading raw, minified JSON from an API response is a nightmare for any developer. \n\n## Why You Need a Good JSON Formatter\n\nA high-quality [JSON Formatter & Validator](/json-formatter) does more than just add spaces. It:\n- **Validates syntax** to catch trailing commas or missing quotes.\n- **Beautifies** data into readable, collapsible trees.\n- **Minifies** payloads for production deployments.\n\n## Local vs. Cloud Tools\n\nWhen working with user data, API keys, or proprietary database dumps, you should **never** paste your JSON into a random website that sends it to a backend server. Tools like ZeroApiTools run 100% in your browser. This guarantees your data stays on your machine.\n\n### Converting JSON to Other Formats\n\nSometimes JSON isn\'t the final format you need. You might need to import data into Excel or configuration files:\n- Need CSV? Try our [JSON to CSV Converter](/json-csv).\n- Working with Docker or Kubernetes? Use our [JSON to YAML Tool](/json-yaml).\n\nStop compromising on speed and security. Start using local developer tools today.'
  },
  {
    id: '4',
    slug: 'base64-encoding-explained',
    title: 'Base64 Encoding Explained: How and Why to Use It',
    excerpt: 'Demystifying Base64 encoding. Learn how to securely embed images, encode authentication headers, and manipulate text strings.',
    date: 'June 14, 2026',
    author: 'ZeroApiTools Team',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    content: '# Understanding Base64 Encoding\n\nBase64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It\'s used primarily to ensure data remains intact without modification during transport.\n\n## When Should You Use Base64?\n\n1. **Data URIs:** Embedding images directly into HTML/CSS files to reduce HTTP requests.\n2. **Authentication:** Basic Auth headers rely on Base64 encoded credentials.\n3. **Safe Storage:** Safely storing complex strings in databases or cookies.\n\n## Converting Data Safely\n\nYou can use our free [Base64 Encoder/Decoder](/base64) to safely encode text or decode existing Base64 strings. Because it runs 100% locally, it\'s safe to use with sensitive passwords and API keys.\n\nLooking for more ways to manage your data? Check out our [Complete Guide to JSON Formatting](/blog-post/complete-guide-json-formatting) for more tips on handling data efficiently.'
  },
  {
    id: '5',
    slug: 'top-data-converter-tools-2026',
    title: 'Top Data Converter Tools Comparison [2026]',
    excerpt: 'Compare the best free data converters for JSON, CSV, YAML, and XML. Discover which tools fit your workflow.',
    date: 'June 15, 2026',
    author: 'ZeroApiTools Team',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    content: '# The Best Data Converters of 2026\n\nModern developers jump between different data formats constantly. Moving from an API response (JSON) to a spreadsheet (CSV) or configuration file (YAML) shouldn\'t require writing a custom script every time.\n\n## Essential Converters\n\n1. **JSON to CSV:** Great for sharing database dumps with non-technical team members who prefer Excel. Use the [JSON to CSV Converter](/json-csv) for immediate, client-side conversions.\n2. **JSON to YAML:** Kubernetes, Docker, and CI/CD pipelines love YAML. Convert your structured JSON easily with the [JSON to YAML Tool](/json-yaml).\n\n## The Verdict\n\nWhen choosing a data converter, **privacy** and **speed** are paramount. Unlike cloud-based tools that might log your proprietary structures, ZeroApiTools offers instant, local conversions. \n\nFor a deeper dive into the most popular format, read our [Complete Guide to JSON Formatting](/blog-post/complete-guide-json-formatting).'
  }
];

export function BlogList({ onNavigate }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        } else {
          setBlogs(MOCK_BLOGS);
        }
      } catch (err) {
        setBlogs(MOCK_BLOGS);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="landing" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="hero-title">Developer <span className="gradient-text">Blog</span></h1>
        <p className="hero-subtitle" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Insights, guides, and tutorials generated for developers.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px' }}>Loading articles from Notion...</p>
        </div>
      ) : (
        <div className="tools-grid">
          {blogs.map(blog => (
            <div 
              key={blog.id} 
              className="category-card" 
              style={{ padding: '0', cursor: 'pointer', textAlign: 'left', alignItems: 'flex-start' }}
              onClick={() => onNavigate('blog-post', blog.slug)}
            >
              <img 
                src={blog.coverImage} 
                alt={blog.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }} 
              />
              <div style={{ padding: '24px' }}>
                <span className="tool-card-tag seo" style={{ marginBottom: '12px', display: 'inline-block' }}>{blog.date}</span>
                <h3 className="category-title" style={{ fontSize: '20px', marginBottom: '12px' }}>{blog.title}</h3>
                <p className="category-count" style={{ background: 'transparent', border: 'none', padding: '0', fontSize: '14px', lineHeight: '1.5' }}>{blog.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BlogPost({ slug, onNavigate }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    async function loadBlog() {
      try {
        const res = await fetch(`/api/blogs?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          const found = MOCK_BLOGS.find(b => b.slug === slug);
          setBlog(found);
        }
      } catch (err) {
        const found = MOCK_BLOGS.find(b => b.slug === slug);
        setBlog(found);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="loading-spinner"></div></div>;
  if (!blog) return <div style={{ textAlign: 'center', padding: '100px' }}>Article not found. <button onClick={() => onNavigate('blog', null)} className="btn btn-primary">Go Back</button></div>;

  return (
    <div className="landing" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        className="btn btn-ghost" 
        onClick={() => onNavigate('blog', null)}
        style={{ marginBottom: '30px' }}
      >
        ← Back to Blog
      </button>

      <img 
        src={blog.coverImage} 
        alt={blog.title} 
        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '30px' }} 
      />

      <h1 style={{ fontSize: '36px', color: 'var(--text-heading)', marginBottom: '16px', lineHeight: '1.3' }}>
        {blog.title}
      </h1>

      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '14px' }}>
        <span>📅 {blog.date}</span>
        <span>✍️ {blog.author}</span>
      </div>

      <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </div>
  );
}
