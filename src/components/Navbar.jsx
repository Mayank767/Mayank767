import React, { useState, useRef, useEffect } from 'react';
import { TOOLS, useApp } from '../App';

export default function Navbar({ currentTool, onGoHome, onSelectTool }) {
  const { darkMode, setDarkMode, favorites } = useApp();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
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
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!showResults || filtered.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); const t = activeIndex >= 0 ? filtered[activeIndex] : filtered[0]; if (t) selectTool(t.id); }
    else if (e.key === 'Escape') { setShowResults(false); setSearch(''); inputRef.current?.blur(); }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={onGoHome}>
        <div className="navbar-logo">ZA</div>
        <div>
          <div className="navbar-title">ZeroApiTools</div>
          <div className="navbar-subtitle">{TOOLS.length}+ Free Browser Tools</div>
        </div>
      </div>

      <div className="navbar-actions">
        {currentTool && (
          <button className="navbar-back" onClick={onGoHome}>← All Tools</button>
        )}

        <button 
          className="navbar-back"
          onClick={() => { onSelectTool('blog'); }}
        >
          📝 Blog
        </button>

        {/* Search */}
        <div className="navbar-search">
          <span className="navbar-search-icon">🔍</span>
          <input
            id="global-search-input"
            name="search"
            ref={inputRef}
            type="text"
            placeholder="Search tools... (↑↓ Enter)"
            value={search}
            onChange={e => { setSearch(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onKeyDown={handleKeyDown}
          />
          {showResults && search.trim() && (
            <div ref={dropdownRef} className="navbar-dropdown">
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


        {/* Dark/Light toggle */}
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
