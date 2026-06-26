import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { TOOLS } from '../data/toolsList';

export default function Navbar({ currentTool, onGoHome, onSelectTool }) {
  const { darkMode, setDarkMode, favorites } = useApp();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filtered = search.trim()
    ? TOOLS.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSearchOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        const input = document.getElementById('mobile-search-input');
        input?.focus();
      }, 50);
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowResults(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setActiveIndex(-1); }, [search]);

  const selectTool = (toolId) => {
    onSelectTool(toolId);
    setSearch('');
    setShowResults(false);
    setActiveIndex(-1);
    setMobileSearchOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!showResults || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const t = activeIndex >= 0 ? filtered[activeIndex] : filtered[0];
      if (t) selectTool(t.id);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSearch('');
      setMobileSearchOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <nav className="navbar">
      
      {/* ── Hamburger Menu Toggle (Mobile/Tablet Only) ── */}
      <button 
        className="navbar-hamburger" 
        onClick={() => setSidebarOpen(true)}
        aria-label="Open Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* ── Slide-in Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar-content" onClick={e => e.stopPropagation()}>
            <div className="sidebar-header">
              <div className="navbar-logo" style={{ marginRight: '12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <div className="navbar-title" style={{ fontSize: '18px' }}>
                <span style={{ color: 'var(--text-1)' }}>ZeroApi</span>
                <span style={{ color: 'var(--accent)', textShadow: '0 0 16px rgba(0,232,122,0.4)' }}>Tools</span>
              </div>
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="sidebar-nav">
              <button onClick={() => { onSelectTool('about'); setSidebarOpen(false); }}>About Us</button>
              <button onClick={() => { onSelectTool('privacy'); setSidebarOpen(false); }}>Privacy Policy</button>
              <button onClick={() => { onSelectTool('terms'); setSidebarOpen(false); }}>Terms of Service</button>
              <button onClick={() => { onSelectTool('blog'); setSidebarOpen(false); }} className="sidebar-blog-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                Blog
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="navbar-brand" onClick={onGoHome}>
        <div className="navbar-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div className="navbar-title-wrap">
          <div className="navbar-title">
            <span style={{ color: 'var(--text-1)' }}>ZeroApi</span>
            <span style={{ color: 'var(--accent)', textShadow: '0 0 16px rgba(0,232,122,0.4)' }}>Tools</span>
          </div>
        </div>
      </div>

      <div className="navbar-actions">
        {!isMobile && (
          <div className="navbar-legal-links">
            <button onClick={() => onSelectTool('about')}>About Us</button>
            <button onClick={() => onSelectTool('privacy')}>Privacy Policy</button>
            <button onClick={() => onSelectTool('terms')}>Terms of Service</button>
          </div>
        )}

        {currentTool && (
          <button className="navbar-back" onClick={onGoHome}>← All Tools</button>
        )}

        <button 
          className="navbar-back"
          onClick={() => { onSelectTool('blog'); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          <span className="blog-text">Blog</span>
        </button>

        {/* Search */}
        {!isMobile ? (
          <div className="navbar-search">
            <span className="navbar-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input
              id="global-search-input"
              name="search"
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showResults}
              aria-controls="search-dropdown-list"
            />
            {showResults && search.trim() && (
              <div ref={dropdownRef} className="navbar-dropdown" id="search-dropdown-list" role="listbox">
                {filtered.length > 0 ? (
                  <>
                    <div className="navbar-dropdown-header">
                      {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
                    </div>
                    {filtered.map((tool, i) => (
                      <div
                        key={tool.id}
                        className={`navbar-dropdown-item ${i === activeIndex ? 'active' : ''}`}
                        onMouseDown={() => selectTool(tool.id)}
                        onMouseEnter={() => setActiveIndex(i)}
                        role="option"
                        aria-selected={i === activeIndex}
                      >
                        <span className="navbar-dropdown-icon">{tool.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div className="navbar-dropdown-name">
                            {tool.name}
                            {tool.category === 'unique' && <span className="dropdown-unique-tag">✨</span>}
                          </div>
                          <div className="navbar-dropdown-desc">{tool.desc}</div>
                        </div>
                        {favorites.includes(tool.id) && <span style={{ fontSize: 12 }}>⭐</span>}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="navbar-dropdown-empty">
                    <span>🔍</span>
                    <span>No tools found for "<strong>{search}</strong>"</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            className="navbar-search-toggle-btn"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '18px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        )}

        {/* Dark/Light toggle */}
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {isMobile && mobileSearchOpen && (
        <div className="mobile-search-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur))',
          WebkitBackdropFilter: 'blur(var(--glass-blur))',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearch('');
                setShowResults(false);
              }}
              aria-label="Close search"
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '18px',
                cursor: 'pointer',
                color: 'var(--text-1)'
              }}
            >
              ←
            </button>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '12px', zIndex: 1 }}>🔍</span>
              <input
                id="mobile-search-input"
                name="mobile-search"
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showResults}
                aria-controls="mobile-search-dropdown-list"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '8px 12px 8px 36px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-1)',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {showResults && search.trim() && (
            <div
              className="navbar-dropdown mobile-dropdown"
              id="mobile-search-dropdown-list"
              role="listbox"
              style={{
                position: 'static',
                width: '100%',
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto',
                boxShadow: 'none',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {filtered.length > 0 ? (
                <>
                  <div className="navbar-dropdown-header">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
                  </div>
                  {filtered.map((tool, i) => (
                    <div
                      key={tool.id}
                      className={`navbar-dropdown-item ${i === activeIndex ? 'active' : ''}`}
                      onMouseDown={() => selectTool(tool.id)}
                      onMouseEnter={() => setActiveIndex(i)}
                      role="option"
                      aria-selected={i === activeIndex}
                    >
                      <span className="navbar-dropdown-icon">{tool.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div className="navbar-dropdown-name">
                          {tool.name}
                          {tool.category === 'unique' && <span className="dropdown-unique-tag">✨</span>}
                        </div>
                        <div className="navbar-dropdown-desc">{tool.desc}</div>
                      </div>
                      {favorites.includes(tool.id) && <span style={{ fontSize: 12 }}>⭐</span>}
                    </div>
                  ))}
                </>
              ) : (
                <div className="navbar-dropdown-empty">
                  <span>🔍</span>
                  <span>No tools found for "<strong>{search}</strong>"</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
