import React, { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { TOOLS, CATEGORIES, useApp } from '../App';

// Removed useCountUp to avoid layout thrashing

function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (!barRef.current) return;
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      const progress = total > 0 ? (scrolled / total) * 100 : 0;
      barRef.current.style.width = `${progress}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: `0%`, height: 3,
        background: 'var(--gradient-purple-cyan)', zIndex: 9999,
        transition: 'width 80ms linear', borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 8px rgba(16,185,129,0.6)',
      }}
    />
  );
}

export default function Landing() {
  const { selectTool, favorites, toggleFavorite, recents, usageCount } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('categories');
  const [displayedCount, setDisplayedCount] = useState(12);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (search || activeCategory !== 'all') return;
    
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setDisplayedCount(prev => Math.min(prev + 12, TOOLS.length));
      }
    }, { rootMargin: '400px' });
    
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [search, activeCategory]);

  const favoriteTools = useMemo(() => TOOLS.filter(t => favorites.includes(t.id)), [favorites]);
  const recentTools = useMemo(() => recents.slice(0, 6).map(id => TOOLS.find(t => t.id === id)).filter(Boolean), [recents]);

  const filtered = useMemo(() => {
    let results = TOOLS;
    if (activeCategory === 'favorites' && viewMode === 'tools') {
      return favoriteTools;
    }
    if (activeCategory === 'recents' && viewMode === 'tools') {
      return recentTools;
    }
    if (activeCategory !== 'all' && viewMode === 'tools') {
      results = results.filter(t => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
      return results;
    }
    return results.slice(0, displayedCount);
  }, [search, activeCategory, viewMode, displayedCount, favoriteTools, recentTools]);

  return (
    <div className="landing">
      <ScrollProgress />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">🚀 ZeroApiTools — 100% Free &amp; Open Source</div>
        <h1 className="hero-title">
          <span className="gradient-text">Developer Tools</span>
          <br />
          That Run In Your Browser
        </h1>
        <p className="hero-subtitle">
          {TOOLS.length}+ essential tools for developers — no API calls, no uploads, no cost.
          <br />
          <strong>Everything runs privately in your browser. Your data never leaves your device.</strong>
        </p>



        <div className="hero-features">
          <span className="hero-feature">🔒 100% Private</span>
          <span className="hero-feature">⚡ Instant Results</span>
          <span className="hero-feature">🚫 No Signup</span>
          <span className="hero-feature">🌐 Open Source</span>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      {search || viewMode === 'tools' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button 
              className="btn btn-ghost" 
              onClick={() => { setViewMode('categories'); setSearch(''); setActiveCategory('all'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              ← Back to Categories
            </button>
            <div className="result-count" aria-live="polite" style={{ margin: 0 }}>
              {search ? (
                <><strong>{filtered.length}</strong> results for "<em>{search}</em>"</>
              ) : activeCategory === 'favorites' ? (
                <><span style={{fontSize: 20}}>⭐</span> <strong>Favorites</strong> — {filtered.length} tools</>
              ) : activeCategory === 'recents' ? (
                <><span style={{fontSize: 20}}>🕐</span> <strong>Recently Used</strong> — {filtered.length} tools</>
              ) : (
                <><span style={{fontSize: 20}}>{CATEGORIES.find(c => c.id === activeCategory)?.icon}</span> <strong>{CATEGORIES.find(c => c.id === activeCategory)?.name}</strong> — {filtered.length} tools</>
              )}
            </div>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="tools-grid">
                {filtered.map((tool, i) => (
                  <ToolCard
                    key={tool.id} tool={tool} onSelect={selectTool}
                    isFavorite={favorites.includes(tool.id)} onToggleFavorite={toggleFavorite}
                    usageCount={usageCount[tool.id] || 0} visible={true} index={i}
                  />
                ))}
              </div>
              {!search && displayedCount < TOOLS.filter(t => t.category === activeCategory).length && (
                <div ref={loadMoreRef} style={{ height: 20 }} aria-hidden="true" />
              )}
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">No tools found for "{search}"</div>
              <div className="no-results-hint">Try: json, base64, curl, chmod, cron...</div>
              <button className="btn btn-secondary" onClick={() => setSearch('')}>Clear Search</button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="section-header" style={{ marginTop: '20px' }}>
            <h2 className="section-title">📂 Browse by Category</h2>
          </div>
          <div className="tools-grid">
            {favoriteTools.length > 0 && (
              <div 
                className="category-card"
                style={{ cursor: 'pointer', animationDelay: '0ms' }}
                onClick={() => { setActiveCategory('favorites'); setViewMode('tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <div className="category-icon-wrapper cat-bg-amber">⭐</div>
                <h3 className="category-title">Favorites</h3>
                <p className="category-count">{favoriteTools.length} tools</p>
              </div>
            )}
            {recentTools.length > 0 && (
              <div 
                className="category-card"
                style={{ cursor: 'pointer', animationDelay: '30ms' }}
                onClick={() => { setActiveCategory('recents'); setViewMode('tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <div className="category-icon-wrapper cat-bg-purple">🕐</div>
                <h3 className="category-title">Recently Used</h3>
                <p className="category-count">{recentTools.length} tools</p>
              </div>
            )}
            {CATEGORIES.filter(c => c.id !== 'all').map((cat, i) => {
              const count = TOOLS.filter(t => t.category === cat.id).length;
              if (count === 0) return null;
              
              return (
                <div 
                  key={cat.id} 
                  className="category-card"
                  style={{ cursor: 'pointer', animationDelay: `${Math.min(i * 30, 300)}ms` }}
                  onClick={() => { setActiveCategory(cat.id); setViewMode('tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  <div className={`category-icon-wrapper cat-bg-${getCategoryColor(cat.id)}`}>{cat.icon}</div>
                  <h3 className="category-title">{cat.name}</h3>
                  <p className="category-count">{count} tools</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Trust Bar ── */}
      <section className="trust-bar">
        <div className="trust-item">🔐 <strong>Zero Data Upload</strong> — Everything runs locally</div>
        <div className="trust-item">🚫 <strong>No Account</strong> — Start using instantly</div>
        <div className="trust-item">📡 <strong>No Tracking</strong> — No analytics on your input</div>
        <div className="trust-item">⚡ <strong>No Rate Limits</strong> — Use as much as you want</div>
      </section>

      {/* ── SEO Content Section ── */}
      <section className="seo-content" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '20px', fontSize: '2rem' }}>Your All-In-One Developer Utility Belt</h2>
        <p style={{ marginBottom: '16px' }}>
          Welcome to ZeroApiTools, the ultimate collection of <strong>free developer tools</strong> designed to run 100% locally in your browser. Whether you need a <strong>JSON formatter</strong>, a <strong>Base64 encoder</strong>, or a quick way to convert <strong>cURL to Fetch</strong>, we have you covered. Our platform ensures that your sensitive data never leaves your machine, providing unparalleled privacy and speed.
        </p>
        <h3 style={{ color: 'var(--text-heading)', marginTop: '30px', marginBottom: '15px', fontSize: '1.5rem' }}>Why Use Client-Side Developer Tools?</h3>
        <p style={{ marginBottom: '16px' }}>
          Traditional online tools often send your data to remote servers for processing. This means your proprietary code, private API keys, and sensitive JWT tokens could be logged, stored, or intercepted. ZeroApiTools changes the game by leveraging your browser's native capabilities. 
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}><strong>Instant Execution:</strong> No waiting for server requests. Format massive JSON files instantly.</li>
          <li style={{ marginBottom: '8px' }}><strong>100% Privacy:</strong> Since everything is client-side, your data remains yours.</li>
          <li style={{ marginBottom: '8px' }}><strong>Offline Access:</strong> Once loaded, our tools work even without an internet connection.</li>
        </ul>
        <h3 style={{ color: 'var(--text-heading)', marginTop: '30px', marginBottom: '15px', fontSize: '1.5rem' }}>Popular Tools & Examples</h3>
        <p style={{ marginBottom: '16px' }}>
          Developers rely on our platform daily for a variety of tasks. Here are some of our most popular utilities:
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}><strong>JSON Formatter & Validator:</strong> Paste minified JSON and instantly beautify it. Perfect for debugging API responses.</li>
          <li style={{ marginBottom: '8px' }}><strong>Base64 Encode/Decode:</strong> Easily convert text or files to Base64 strings, essential for web development and data embedding.</li>
          <li style={{ marginBottom: '8px' }}><strong>CSS Generators:</strong> Create stunning gradients, glassmorphism effects, and box shadows with our visual editors, then copy the CSS directly.</li>
          <li style={{ marginBottom: '8px' }}><strong>JWT Decoder:</strong> Paste your JSON Web Tokens to safely read their payload and verify their expiration locally.</li>
        </ul>
        <p style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 255, 224, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 255, 224, 0.2)' }}>
          📚 <strong>Want to learn more?</strong> <a href="/blog-post/complete-guide-json-formatting" onClick={(e) => { e.preventDefault(); selectTool('blog-post/complete-guide-json-formatting'); window.scrollTo(0,0); }} style={{ color: '#00ffe0', textDecoration: 'none', fontWeight: 'bold' }}>Check out our Complete Guide to JSON Formatting and Validation</a> to see how our tools can save you hours of debugging time.
        </p>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────
// Tool Card Component — with 3D tilt
// ─────────────────────────────────────────
export const ToolCard = memo(function ToolCard({ tool, onSelect, isFavorite, onToggleFavorite, usageCount, visible, index = 0 }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      cardRef.current.style.transform =
        `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px) scale(1.02)`;
      if (glareRef.current) {
        glareRef.current.style.background =
          `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }, []);

  return (
    <a
      href={`/${tool.id}`}
      ref={cardRef}
      className={`tool-card tool-card-3d ${visible ? 'visible' : ''} ${tool.category === 'unique' ? 'tool-card-unique' : ''}`}
      data-id={tool.id}
      onClick={(e) => { e.preventDefault(); onSelect(tool.id); }}
      id={`tool-${tool.id}`}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`${tool.name} — ${tool.desc}`}
    >
      <div ref={glareRef} className="card-glare" />
      {tool.category === 'unique' && <div className="unique-badge">✨ Unique</div>}

      <div className="tool-card-top">
        <div className={`tool-card-icon ${getCategoryColor(tool.category)}`}>{tool.icon}</div>
        <button
          className={`tool-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(tool.id); }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      <h3 className="tool-card-title">{tool.name}</h3>
      <p className="tool-card-desc">{tool.desc}</p>

      <div className="tool-card-footer">
        <span className={`tool-card-tag ${tool.category}`}>{getCategoryLabel(tool.category)}</span>
        {usageCount > 0 && <span className="tool-usage-count">{usageCount}× used</span>}
      </div>
    </a>
  );
});

export function getCategoryColor(cat) {
  const map = { text: 'emerald', code: 'cyan', converter: 'emerald', css: 'cyan', image: 'emerald', security: 'cyan', seo: 'emerald', unique: 'unique', calculator: 'amber', pdf: 'cyan' };
  return map[cat] || 'emerald';
}

export function getCategoryLabel(cat) {
  const map = { text: 'Text & String', code: 'Code', converter: 'Converter', css: 'CSS', image: 'Image', security: 'Security', seo: 'SEO', unique: '✨ Unique', calculator: 'Calculators', pdf: 'PDF Tools' };
  return map[cat] || cat;
}
