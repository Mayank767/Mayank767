import React, { useState, useMemo, useCallback, useRef, useEffect, memo, lazy, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { useApp } from '../App';
import TerminalSimulator from './TerminalSimulator';
import { TOOLS, CATEGORIES } from '../data/toolsList';

// Lazy-load Three.js scene for performance
const ThreeDAnimation = lazy(() => import('./ThreeDAnimation'));

class ThreeDErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("3D Animation failed to load:", error);
  }
  render() {
    if (this.state.hasError) {
      return null; // Gracefully degrade by hiding the 3D scene
    }
    return this.props.children;
  }
}



/* ═══════════════════════════════════════════
   PRO MAX: Floating Orbs — 3 layers
   ═══════════════════════════════════════════ */
function FloatingOrbs() {
  return (
    <>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </>
  );
}



/* ═══════════════════════════════════════════
   Scroll progress bar — green gradient
   ═══════════════════════════════════════════ */
function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      if (!barRef.current) return;
      const el = document.documentElement;
      const progress = el.scrollHeight - el.clientHeight > 0
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div ref={barRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: 2,
      background: 'linear-gradient(90deg, var(--accent), var(--blue))',
      zIndex: 9999, transition: 'transform 80ms ease-out',
      transformOrigin: 'left', transform: 'scaleX(0)',
      boxShadow: '0 0 10px var(--accent-glow)',
      pointerEvents: 'none',
    }} />
  );
}


export default function Landing() {
  const { selectTool, favorites, toggleFavorite, recents, usageCount } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('categories');
  const [displayedCount, setDisplayedCount] = useState(12);
  const loadMoreRef = useRef(null);
  // Check if device is mobile to disable heavy 3D animations
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      const isNarrow = window.innerWidth <= 768;
      const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isNarrow || isMobileAgent);
    };
    checkMobile();
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(checkMobile, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {/* ── 3D Background Animation Showcase ── */}
      {!isMobile && (
        <ThreeDErrorBoundary>
          <Suspense fallback={null}>
            <ThreeDAnimation />
          </Suspense>
        </ThreeDErrorBoundary>
      )}

      {/* ── Background Elements ── */}
      <FloatingOrbs />
      <ScrollProgress />

      {/* ── Hero ── */}
      <section className="hero">



        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.9, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(0, 232, 122, 0.08)', border: '1px solid rgba(0, 232, 122, 0.2)', 
            color: 'var(--accent)', padding: '6px 16px', borderRadius: '100px',
            fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '24px'
          }}
        >
          <span style={{ fontSize: '14px' }}>✸</span> {TOOLS.length}+ Free Utilities · Zero Signup
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, type: 'spring', bounce: 0.4 }}
        >
          The developer toolbox <br />
          that <span style={{ color: 'var(--accent)' }}>actually works</span>
        </motion.h1>

        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Format JSON, generate UUIDs, test regex, convert colors — <br />
          {TOOLS.length}+ instant tools. No login, no paywall, no BS. Just open and go.
        </motion.p>

      </section>

      {/* ── Tool Library Section ── */}
      <section style={{ padding: '64px 5vw', maxWidth: '1600px', margin: '0 auto', minHeight: '80vh' }} id="tools-section">
        {viewMode === 'categories' ? (
          <>
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px' }}>TOOL LIBRARY</div>
              <h2 style={{ fontSize: '48px', fontFamily: 'var(--font-display)', fontWeight: '400', color: 'var(--text-1)', letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>
                Pick a Category
              </h2>
            </div>
            
            <div className="tools-grid">
              {CATEGORIES.filter(cat => cat.id !== 'all').map((cat, i) => {
                const count = TOOLS.filter(t => t.category === cat.id).length;
                return (
                  <AnimatedCategoryCard key={cat.id} index={i}>
                    <div 
                      className="category-card"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setViewMode('tools');
                        setTimeout(() => {
                          document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }}
                    >
                      <div className="category-card-icon">{cat.icon}</div>
                      <h3 className="category-card-title">{cat.name}</h3>
                      <div className="category-card-count">{count} Tools inside</div>
                    </div>
                  </AnimatedCategoryCard>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button 
                onClick={() => {
                  setViewMode('categories');
                  setActiveCategory('all');
                }}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', borderRadius: '100px', background: 'var(--bg-surface)' }}
              >
                ← Back to Categories
              </button>
              <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: '400', color: 'var(--text-1)', letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>
                {CATEGORIES.find(c => c.id === activeCategory)?.name || 'Tools'}
              </h2>
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
                {!search && displayedCount < TOOLS.filter(t => t.category === activeCategory || activeCategory === 'all').length && (
                  <div ref={loadMoreRef} style={{ height: 20 }} aria-hidden="true" />
                )}
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <div className="no-results-text">No tools found</div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── PRO MAX Features Row ── */}
      <motion.section 
        className="features-grid" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '32px', padding: '64px 40px', borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)', background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        {[
          { icon: '⚡', color: '#f59e0b', title: 'Instant results', desc: 'Every tool runs client-side or edge. Results in under 100ms, no cold starts.' },
          { icon: '🔒', color: '#10b981', title: 'Private by default', desc: 'Your data never hits our servers. Processing happens in your browser.' },
          { icon: '🄓', color: '#3b82f6', title: 'Always free', desc: 'MIT licensed. No plans, no limits, no credit card. Open source forever.' },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            className="feature-item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
            style={i > 0 ? { borderLeft: '1px solid var(--border-subtle)', paddingLeft: '32px' } : {}}
            whileHover={{ scale: 1.03 }}
          >
            <div style={{ color: f.color, fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
            <h3 style={{ color: 'var(--text-1)', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Interactive Terminal Simulator ── */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        style={{ padding: '100px 5vw', maxWidth: '1400px', margin: '0 auto', overflow: 'hidden', position: 'relative', textAlign: 'center', zIndex: 1 }}
      >
        <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '12px' }}>POWERFUL & SECURE</div>
        <h2 style={{ fontSize: '40px', fontFamily: 'var(--font-display)', fontWeight: '400', color: 'var(--text-1)', letterSpacing: '1px', marginBottom: '24px', textTransform: 'uppercase' }}>
          Execute Locally. Process Instantly.
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 64px auto', lineHeight: '1.6' }}>
          ZeroApiTools runs entirely in your browser. No server uploads. No API delays. Just blazing fast execution right where you are.
        </p>

        <TerminalSimulator />
      </motion.section>

      {/* ── About Us Section ── */}
      <motion.section 
        className="about-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '100px 5vw', maxWidth: '1400px', margin: '0 auto' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center' }}>
          
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '12px' }}>THE MISSION</div>
            <h2 style={{ fontSize: '48px', fontFamily: 'var(--font-display)', fontWeight: '400', color: 'var(--text-1)', letterSpacing: '1px', marginBottom: '24px', textTransform: 'uppercase', lineHeight: '1.1' }}>
              Built for Developers. <br/> Respect for Privacy.
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              We were tired of searching for simple developer tools only to be hit with paywalls, intrusive ads, and the constant fear of our sensitive JSON, API keys, or JWT tokens being uploaded to unknown servers.
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: '18px', lineHeight: '1.8', marginBottom: '32px' }}>
              That's why we created <strong>ZeroApiTools</strong>. A beautifully crafted, lightning-fast suite of over 67+ tools that execute 100% locally in your browser. No data leaves your machine. Ever.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary" 
                onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ padding: '12px 24px', fontSize: '16px', borderRadius: '100px' }}
              >
                Explore Tools
              </motion.button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-4)', fontSize: '14px' }}>
                <span className="live-dot"></span> Live & Open Source
              </div>
            </div>
          </div>

          <motion.div 
            style={{ flex: '1 1 400px', position: 'relative' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle at 50% 50%, var(--accent-glow) 0%, transparent 70%)', zIndex: 0, filter: 'blur(30px)' }} />
            <img 
              src="/images/about-hero.png" 
              alt="ZeroApiTools Futuristic Developer Environment" 
              style={{ width: '100%', borderRadius: '24px', position: 'relative', zIndex: 1, border: '1px solid var(--border-primary)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} 
            />
          </motion.div>

        </div>
      </motion.section>

      {/* ── CTA Section ── */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', padding: '120px 20px', borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="cta-glass-container">
          <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>READY?</div>
          <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(50px, 8vw, 80px)', lineHeight: '0.95', fontWeight: '400', marginBottom: '24px', color: 'var(--text-1)', letterSpacing: '1px', textShadow: '0 4px 24px var(--shadow-glow)' }}>
            Bookmark it.<br/>Never search for a tool again.
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: '18px', marginBottom: '40px' }}>
            Free forever. Open source. No account. Just tools that work.
          </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Using — It's Free
          </motion.button>

        </div>
        </div>
      </motion.section>
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
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      cardRef.current.style.transform =
        `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
      // Mouse-tracked spotlight via CSS custom props
      cardRef.current.style.setProperty('--mouse-x', x + 'px');
      cardRef.current.style.setProperty('--mouse-y', y + 'px');
      if (glareRef.current) {
        glareRef.current.style.background =
          `radial-gradient(circle at ${(x/rect.width)*100}% ${(y/rect.height)*100}%, rgba(0,232,122,0.10) 0%, transparent 60%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }, []);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className={`tool-card ${visible ? 'visible' : ''}`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => onSelect(tool.id)}
      style={{ cursor: 'pointer' }}
    >
      {tool.category === 'unique' && <div className="unique-badge">✨ Unique</div>}

      <div className="tool-card-top">
        <div className={`tool-card-icon ${getCategoryColor(tool.category)}`}>{tool.icon}</div>
        <button
          className={`tool-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleFavorite(tool.id); }}
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
    </motion.div>
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
