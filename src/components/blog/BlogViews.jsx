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
