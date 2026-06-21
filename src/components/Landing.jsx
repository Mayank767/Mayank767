import React, { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { motion, useInView } from 'framer-motion';
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

        {/* ── Floating SVG Background Decorations ── */}
        <svg
          className="hero-bg-svg"
          viewBox="0 0 900 380"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hgA" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#00ffe0" stopOpacity="0.06"/>
              <stop offset="100%" stopColor="#00ffe0" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="hgB" cx="20%" cy="70%" r="45%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="hgC" cx="80%" cy="60%" r="40%">
              <stop offset="0%" stopColor="#00ffe0" stopOpacity="0.03"/>
              <stop offset="100%" stopColor="#00ffe0" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="900" height="380" fill="url(#hgA)"/>
          <rect width="900" height="380" fill="url(#hgB)"/>
          <rect width="900" height="380" fill="url(#hgC)"/>

          {/* Floating tool cards */}
          <g className="svg-float-a">
            <rect x="42" y="48" width="80" height="50" rx="11" fill="none" stroke="rgba(0,255,224,0.18)" strokeWidth="0.6"/>
            <text x="82" y="68" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(0,255,224,0.55)" fontWeight="700">{'{ }'}</text>
            <text x="82" y="85" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fill="rgba(255,255,255,0.28)">JSON</text>
          </g>
          <g className="svg-float-b">
            <rect x="776" y="55" width="80" height="50" rx="11" fill="none" stroke="rgba(99,102,241,0.18)" strokeWidth="0.6"/>
            <text x="816" y="76" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(99,102,241,0.55)" fontWeight="700">JWT</text>
            <text x="816" y="92" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fill="rgba(255,255,255,0.28)">Decoder</text>
          </g>
          <g className="svg-float-c">
            <rect x="28" y="230" width="84" height="50" rx="11" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="0.6"/>
            <text x="70" y="251" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fill="rgba(245,158,11,0.5)" fontWeight="700">Base64</text>
            <text x="70" y="267" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fill="rgba(255,255,255,0.28)">Encode</text>
          </g>
          <g className="svg-float-a" style={{animationDelay:'0.8s'}}>
            <rect x="784" y="210" width="80" height="50" rx="11" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="0.6"/>
            <text x="824" y="231" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fill="rgba(96,165,250,0.5)" fontWeight="700">cURL</text>
            <text x="824" y="248" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fill="rgba(255,255,255,0.28)">→ fetch</text>
          </g>

          {/* Pulsing dots */}
          <circle cx="180" cy="88" r="3.5" fill="#00ffe0" opacity="0.22" className="svg-pulse"/>
          <circle cx="720" cy="108" r="3" fill="#6366f1" opacity="0.22" className="svg-pulse" style={{animationDelay:'0.5s'}}/>
          <circle cx="100" cy="185" r="2.5" fill="#00ffe0" opacity="0.18" className="svg-pulse" style={{animationDelay:'1s'}}/>
          <circle cx="800" cy="165" r="2.5" fill="#f59e0b" opacity="0.18" className="svg-pulse" style={{animationDelay:'0.3s'}}/>
          <circle cx="450" cy="18" r="2" fill="#00ffe0" opacity="0.28" className="svg-pulse" style={{animationDelay:'0.8s'}}/>
          <circle cx="340" cy="340" r="2" fill="#6366f1" opacity="0.18" className="svg-pulse" style={{animationDelay:'1.2s'}}/>

          {/* Spinning orbit rings */}
          <g className="svg-spin-cw" style={{transformOrigin:'90px 295px'}}>
            <circle cx="90" cy="295" r="22" fill="none" stroke="rgba(0,255,224,0.09)" strokeWidth="0.6" strokeDasharray="4 4"/>
            <circle cx="90" cy="273" r="3" fill="rgba(0,255,224,0.32)"/>
          </g>
          <g className="svg-spin-ccw" style={{transformOrigin:'810px 280px'}}>
            <circle cx="810" cy="280" r="26" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="0.6" strokeDasharray="3 5"/>
            <circle cx="810" cy="254" r="2.5" fill="rgba(99,102,241,0.32)"/>
          </g>

          {/* Connector lines */}
          <line x1="185" y1="93" x2="230" y2="145" stroke="rgba(0,255,224,0.07)" strokeWidth="0.6" strokeDasharray="3 4"/>
          <line x1="715" y1="110" x2="670" y2="148" stroke="rgba(99,102,241,0.07)" strokeWidth="0.6" strokeDasharray="3 4"/>

          {/* Top badge chip */}
          <rect x="412" y="8" width="76" height="24" rx="6" fill="rgba(0,255,224,0.06)" stroke="rgba(0,255,224,0.14)" strokeWidth="0.6"/>
          <text x="450" y="24" textAnchor="middle" fontFamily="Inter,monospace" fontSize="8.5" fill="rgba(0,255,224,0.52)">{TOOLS.length}+ tools</text>
        </svg>

        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🚀 ZeroApiTools — 100% Free &amp; Open Source
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {TOOLS.length}+ <span className="gradient-text">Free Developer Tools</span>
          <br />
          That Run In Your Browser
        </motion.h1>

        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          The ultimate collection of fast, private utilities for developers.
          <br />
          <strong>No server uploads, no APIs, no signups. Everything executes 100% locally.</strong>
        </motion.p>

        <motion.div 
          className="hero-features"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
          }}
        >
          {['🔒 100% Private', '⚡ Instant Results', '🚫 No Signup', '🌐 Open Source'].map(f => (
            <motion.span
              key={f}
              className="hero-feature"
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300 } }
              }}
            >
              {f}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* ── Main Content Area ── */}
      {search || viewMode === 'tools' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 40px' }}>
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
          <div className="section-header" style={{ marginTop: '20px', padding: '0 40px' }}>
            <h2 className="section-title">📂 Browse by Category</h2>
          </div>
          <div className="category-grid">
            {favoriteTools.length > 0 && (
              <AnimatedCategoryCard index={0}>
                <div 
                  className="category-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setActiveCategory('favorites'); setViewMode('tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  <div className="category-icon-wrapper cat-bg-amber">⭐</div>
                  <h3 className="category-title">Favorites</h3>
                  <p className="category-count">{favoriteTools.length} tools</p>
                </div>
              </AnimatedCategoryCard>
            )}
            {recentTools.length > 0 && (
              <AnimatedCategoryCard index={1}>
                <div 
                  className="category-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setActiveCategory('recents'); setViewMode('tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  <div className="category-icon-wrapper cat-bg-purple">🕐</div>
                  <h3 className="category-title">Recently Used</h3>
                  <p className="category-count">{recentTools.length} tools</p>
                </div>
              </AnimatedCategoryCard>
            )}
            {CATEGORIES.filter(c => c.id !== 'all').map((cat, i) => {
              const count = TOOLS.filter(t => t.category === cat.id).length;
              if (count === 0) return null;
              return (
                <AnimatedCategoryCard key={cat.id} index={i + 2}>
                  <div 
                    className="category-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setActiveCategory(cat.id); setViewMode('tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <div className={`category-icon-wrapper cat-bg-${getCategoryColor(cat.id)}`}>{cat.icon}</div>
                    <h3 className="category-title">{cat.name}</h3>
                    <p className="category-count">{count} tools</p>
                  </div>
                </AnimatedCategoryCard>
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
      <section className="seo-content" style={{ padding: '60px 40px 40px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <h2 style={{ color: 'var(--text-heading)', marginBottom: '20px', fontSize: '2rem' }}>Your All-In-One Developer Utility Belt</h2>
            <p style={{ marginBottom: '16px' }}>
              Welcome to ZeroApiTools, the ultimate collection of <strong>free developer tools</strong> designed to run 100% locally in your browser. Whether you need a <strong>JSON formatter</strong>, a <strong>Base64 encoder</strong>, or a quick way to convert <strong>cURL to Fetch</strong>, we have you covered. Our platform ensures that your sensitive data never leaves your machine, providing unparalleled privacy and speed.
            </p>
            <h3 style={{ color: 'var(--text-heading)', marginTop: '30px', marginBottom: '15px', fontSize: '1.5rem' }}>Why Use Client-Side Developer Tools?</h3>
            <p style={{ marginBottom: '16px' }}>
              Traditional online tools often send your data to remote servers for processing. This means your proprietary code, private API keys, and sensitive JWT tokens could be logged, stored, or intercepted. ZeroApiTools changes the game by leveraging your browser’s native capabilities. 
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}><strong>Instant Execution:</strong> No waiting for server requests. Format massive JSON files instantly.</li>
              <li style={{ marginBottom: '8px' }}><strong>100% Privacy:</strong> Since everything is client-side, your data remains yours.</li>
              <li style={{ marginBottom: '8px' }}><strong>Offline Access:</strong> Once loaded, our tools work even without an internet connection.</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '15px', fontSize: '1.5rem' }}>Popular Tools & Examples</h3>
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
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="seo-content" id="faq" aria-labelledby="faq-heading" style={{ padding: '0 40px 60px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <h2 id="faq-heading" style={{ color: 'var(--text-heading)', marginBottom: '30px', fontSize: '2rem' }}>Frequently Asked Questions</h2>


        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>How do I format or beautify JSON online for free?</h3>
            <p>Paste your raw or minified JSON into ZeroApiTools' free <a href="/json-formatter" onClick={(e) => { e.preventDefault(); selectTool('json-formatter'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>JSON Formatter & Beautifier</a>. It instantly indents, validates, and highlights your JSON — no signup, no server upload. Everything runs locally in your browser.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>How do I encode or decode Base64 online?</h3>
            <p>Use the free <a href="/base64" onClick={(e) => { e.preventDefault(); selectTool('base64'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>Base64 Encoder/Decoder</a> on ZeroApiTools. Just paste your text to get the Base64 string instantly — or paste a Base64 string to decode it back. No data is ever sent to a server.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>How do I decode a JWT token online? (JWT token kaise decode kare?)</h3>
            <p>Open the <a href="/jwt-decoder" onClick={(e) => { e.preventDefault(); selectTool('jwt-decoder'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>JWT Decoder</a> on ZeroApiTools, paste your token, and instantly see the header, payload, and expiry. Since decoding happens 100% in your browser, your production tokens remain completely private.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>What is the best free regex tester online for beginners?</h3>
            <p>ZeroApiTools' <a href="/regex-tester" onClick={(e) => { e.preventDefault(); selectTool('regex-tester'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>Regex Tester</a> shows live match highlighting as you type your pattern, making it ideal for beginners and pros alike. It supports all standard JS regex flags and runs entirely client-side.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>How do I compress an image online for free without uploading it to a server?</h3>
            <p>ZeroApiTools' <a href="/image-compress" onClick={(e) => { e.preventDefault(); selectTool('image-compress'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>Image Compressor</a> reduces image file sizes using your browser's native APIs — your photos never leave your device. Supports JPEG, PNG, and WebP output with no quality compromise.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>Is there a free CSS generator and box shadow generator online?</h3>
            <p>Yes — ZeroApiTools has a full suite of free CSS generators including a <a href="/gradient" onClick={(e) => { e.preventDefault(); selectTool('gradient'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>CSS Gradient Generator</a>, <a href="/box-shadow" onClick={(e) => { e.preventDefault(); selectTool('box-shadow'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>Box Shadow Generator</a>, Glassmorphism Generator, and Border Radius tool. All free, all visual, all copy-paste ready.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>How do I convert a cURL command to JavaScript fetch or Axios online?</h3>
            <p>Use ZeroApiTools' free <a href="/curl-to-fetch" onClick={(e) => { e.preventDefault(); selectTool('curl-to-fetch'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>cURL to Fetch Converter</a>. Paste your cURL command and get the equivalent JavaScript fetch() or Axios code instantly — perfect for API testing and frontend development.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>How do I calculate Linux file permissions (chmod) online?</h3>
            <p>ZeroApiTools' <a href="/chmod-calc" onClick={(e) => { e.preventDefault(); selectTool('chmod-calc'); window.scrollTo(0,0); }} style={{ color: '#00ffe0' }}>Chmod Calculator</a> lets you toggle read/write/execute permissions visually for Owner, Group, and Others — and instantly shows the numeric chmod value (like 755 or 644). No Linux knowledge required.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>Is ZeroApiTools safe? Does it store or upload my data?</h3>
            <p>ZeroApiTools is 100% client-side — every single tool runs in your browser using JavaScript. No data is ever uploaded to a server, stored, or logged anywhere. It's the safest way to use developer tools online, especially for sensitive payloads like JWTs, API keys, and database dumps.</p>
          </div>

          <div className="faq-item" style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-heading)', marginBottom: '10px', fontSize: '1.1rem' }}>How does ZeroApiTools compare to paid developer tools?</h3>
            <p>ZeroApiTools offers {TOOLS.length}+ tools completely free with no account, no rate limits, and no data upload — features that many paid tools charge for. The key advantage is that everything processes locally in your browser rather than on a remote cloud server, giving you both speed and privacy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────
// Animated Category Card — scroll-triggered
// ─────────────────────────────────────────
function AnimatedCategoryCard({ children, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
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
