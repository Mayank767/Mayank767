import React, { useState, useEffect } from 'react';
import { useApp } from '../../App';
import ReactMarkdown from 'react-markdown';

// Mock data while we wait for Notion API integration
import { MOCK_BLOGS } from '../../data/blogs.js';


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
    <div className="landing" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 7rem)', lineHeight: '1', margin: '0 0 20px 0', letterSpacing: '2px' }}>
          DEVELOPER <span style={{ color: 'var(--accent)', textShadow: '0 0 40px rgba(0, 232, 122, 0.4)' }}>BLOG</span>
        </h1>
        <div style={{ display: 'inline-block', background: 'rgba(0, 232, 122, 0.03)', border: '1px solid rgba(0, 232, 122, 0.15)', borderRadius: '30px', padding: '10px 24px', marginTop: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', margin: '0', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Insights <span style={{color:'var(--accent)', margin: '0 8px', opacity: 0.6}}>//</span> Guides <span style={{color:'var(--accent)', margin: '0 8px', opacity: 0.6}}>//</span> Tutorials
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px', fontFamily: 'var(--font-mono)' }}>LOADING ARTICLES...</p>
        </div>
      ) : (
        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
          {blogs.map(blog => (
            <div
              key={blog.id}
              className="blog-card-premium"
              style={{
                background: 'rgba(0, 232, 122, 0.02)',
                border: '1px solid rgba(0, 232, 122, 0.08)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onClick={() => onNavigate('blog-post', blog.slug)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.4), 0 0 40px rgba(0, 232, 122, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 232, 122, 0.3)';
                const img = e.currentTarget.querySelector('.blog-card-img');
                if (img) img.style.transform = 'scale(1.08)';
                const rm = e.currentTarget.querySelector('.read-more');
                if (rm) { rm.style.opacity = '1'; rm.style.transform = 'translateX(0)'; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0, 232, 122, 0.08)';
                const img = e.currentTarget.querySelector('.blog-card-img');
                if (img) img.style.transform = 'scale(1)';
                const rm = e.currentTarget.querySelector('.read-more');
                if (rm) { rm.style.opacity = '0'; rm.style.transform = 'translateX(-10px)'; }
              }}
            >
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img
                  className="blog-card-img"
                  src={blog.coverImage}
                  alt={blog.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)' }}></div>
              </div>
              
              <div style={{ padding: '0 30px 30px 30px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, marginTop: '-40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{blog.date}</span>
                  {(blog.contentHindi || blog.contentEnglish) && (
                    <span style={{
                      background: 'rgba(0, 232, 122, 0.1)',
                      border: '1px solid rgba(0, 232, 122, 0.2)',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      color: 'var(--accent)',
                      fontWeight: '700',
                      fontSize: '11px',
                      letterSpacing: '1px'
                    }}>🌐 HINDI / EN</span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '1.5px', marginBottom: '20px', color: 'var(--text-1)', lineHeight: '1.3' }}>{blog.title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.7', margin: '0 0 30px 0', flex: 1 }}>{blog.excerpt}</p>
                
                <div className="read-more" style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', 
                  fontWeight: '600', fontSize: '15px', transition: 'all 0.3s ease',
                  opacity: 0, transform: 'translateX(-10px)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase'
                }}>
                  Read Article <span style={{ fontSize: '18px' }}>→</span>
                </div>
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
  const [lang, setLang] = useState('hindi');

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

  const isBilingual = !!(blog.contentHindi && blog.contentEnglish);
  const displayTitle = isBilingual
    ? (lang === 'hindi' ? (blog.titleHi || blog.title) : (blog.titleEn || blog.title))
    : blog.title;
  const displayContent = isBilingual
    ? (lang === 'hindi' ? blog.contentHindi : blog.contentEnglish)
    : blog.content;

  return (
    <div className="landing" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Top bar: Back button + Language Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn btn-ghost"
          onClick={() => onNavigate('blog', null)}
        >
          ← Back to Blog
        </button>

        {isBilingual && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-secondary, #1a1a2e)',
            borderRadius: '50px',
            padding: '4px',
            border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <button
              id="lang-toggle-hindi"
              onClick={() => setLang('hindi')}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.25s ease',
                background: lang === 'hindi' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: lang === 'hindi' ? '#fff' : 'var(--text-muted, #888)',
                boxShadow: lang === 'hindi' ? '0 2px 12px rgba(102,126,234,0.5)' : 'none',
              }}
            >
              🇮🇳 हिंदी
            </button>
            <button
              id="lang-toggle-english"
              onClick={() => setLang('english')}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.25s ease',
                background: lang === 'english' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: lang === 'english' ? '#fff' : 'var(--text-muted, #888)',
                boxShadow: lang === 'english' ? '0 2px 12px rgba(102,126,234,0.5)' : 'none',
              }}
            >
              🇺🇸 English
            </button>
          </div>
        )}
      </div>

      <img
        src={blog.coverImage}
        alt={displayTitle}
        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '30px' }}
      />

      <h1 style={{ fontSize: '36px', color: 'var(--text-heading)', marginBottom: '16px', lineHeight: '1.3' }}>
        {displayTitle}
      </h1>

      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span>📅 {blog.date}</span>
        <span>✍️ {blog.author}</span>
        {isBilingual && (
          <span style={{
            background: 'linear-gradient(135deg, #667eea22, #764ba222)',
            border: '1px solid #667eea44',
            borderRadius: '20px',
            padding: '2px 10px',
            color: '#667eea',
            fontWeight: '600'
          }}>🌐 Bilingual Article</span>
        )}
      </div>

      <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        {blog.isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: displayContent }} />
        ) : (
          <ReactMarkdown>{displayContent}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}
