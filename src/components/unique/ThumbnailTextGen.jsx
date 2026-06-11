import React, { useState, useMemo, useCallback } from 'react';

const STYLES = [
  { id: 'shocking', label: '😱 Shocking', icon: '😱' },
  { id: 'educational', label: '📚 Educational', icon: '📚' },
  { id: 'funny', label: '😂 Funny', icon: '😂' },
  { id: 'dramatic', label: '🎭 Dramatic', icon: '🎭' },
  { id: 'minimal', label: '✨ Minimal', icon: '✨' },
];

const TEXT_TEMPLATES = {
  shocking: [
    (t) => `${t} IS DEAD`,
    (t) => `EXPOSED: ${t}`,
    (t) => `${t} GONE WRONG`,
    (t) => `NEVER DO THIS`,
    (t) => `I WAS WRONG`,
    (t) => `${t} RUINED ME`,
    (t) => `SHOCKING ${t} TRUTH`,
    (t) => `IT'S OVER`,
    (t) => `${t}?! NO WAY`,
    (t) => `THIS IS INSANE`,
    (t) => `${t} NIGHTMARE`,
    (t) => `CAUGHT IN 4K`,
    (t) => `THE END OF ${t}`,
    (t) => `NOT CLICKBAIT`,
    (t) => `${t} DESTROYED`,
  ],
  educational: [
    (t) => `HOW ${t} WORKS`,
    (t) => `${t} EXPLAINED`,
    (t) => `LEARN ${t} NOW`,
    (t) => `${t} 101`,
    (t) => `${t} BASICS`,
    (t) => `MASTER ${t}`,
    (t) => `${t} GUIDE`,
    (t) => `WHY ${t}?`,
    (t) => `${t} TIPS`,
    (t) => `UNDERSTAND ${t}`,
    (t) => `${t} DEEP DIVE`,
    (t) => `${t} STEP BY STEP`,
    (t) => `KEY ${t} CONCEPTS`,
    (t) => `${t} FOR BEGINNERS`,
    (t) => `THE SCIENCE OF ${t}`,
  ],
  funny: [
    (t) => `${t} BUT WHY`,
    (t) => `POV: YOU TRY ${t}`,
    (t) => `${t} GONE WRONG 😅`,
    (t) => `HELP ME`,
    (t) => `${t} FAIL COMP`,
    (t) => `SEND HELP`,
    (t) => `${t} EXPECTATION VS REALITY`,
    (t) => `NAH BRO 💀`,
    (t) => `${t} AT 3AM`,
    (t) => `BRO WHAT`,
    (t) => `${t} SPEEDRUN`,
    (t) => `OH NO`,
    (t) => `${t} CHALLENGE`,
    (t) => `I REGRET THIS`,
    (t) => `IT GETS WORSE`,
  ],
  dramatic: [
    (t) => `THE FINAL ${t}`,
    (t) => `${t}: NO RETURN`,
    (t) => `MY LAST ${t}`,
    (t) => `${t} CHANGED ME`,
    (t) => `THE ${t} JOURNEY`,
    (t) => `RISE & FALL`,
    (t) => `${t} REDEMPTION`,
    (t) => `AGAINST ALL ODDS`,
    (t) => `${t} STORY`,
    (t) => `THE COMEBACK`,
    (t) => `${t}: DAY ONE`,
    (t) => `BREAKING POINT`,
    (t) => `${t} SACRIFICE`,
    (t) => `NO TURNING BACK`,
    (t) => `THE TRUTH ABOUT ${t}`,
  ],
  minimal: [
    (t) => `${t}.`,
    (t) => `just ${t}`,
    (t) => `${t} ↗`,
    (t) => `try ${t}`,
    (t) => `${t} ✓`,
    (t) => `why ${t}`,
    (t) => `this.`,
    (t) => `${t} →`,
    (t) => `simple ${t}`,
    (t) => `${t} tips`,
    (t) => `less is more`,
    (t) => `${t} essentials`,
    (t) => `clean ${t}`,
    (t) => `pure ${t}`,
    (t) => `${t} only`,
  ],
};

const FONT_SUGGESTIONS = {
  shocking: {
    primary: 'Impact / Bebas Neue',
    style: 'ALL CAPS, Extra Bold',
    weight: '900',
    effect: 'Red outline, drop shadow',
    tips: ['Use thick outlines for readability', 'Add a glow or 3D effect', 'Red/Yellow text on dark background'],
  },
  educational: {
    primary: 'Montserrat / Poppins',
    style: 'Title Case, Bold',
    weight: '700',
    effect: 'Clean with subtle shadow',
    tips: ['Use clean sans-serif fonts', 'Add text background boxes', 'Keep it professional and readable'],
  },
  funny: {
    primary: 'Bangers / Comic Neue',
    style: 'Mixed Case, Bold',
    weight: '800',
    effect: 'Colorful outline, rotated',
    tips: ['Slightly rotate text for energy', 'Use bright, contrasting colors', 'Add emoji overlays'],
  },
  dramatic: {
    primary: 'Oswald / Anton',
    style: 'ALL CAPS, Semi-Bold',
    weight: '700',
    effect: 'Cinematic gradient, letterbox',
    tips: ['Use white text on dark', 'Add film grain or vignette', 'Cinematic widescreen bars help'],
  },
  minimal: {
    primary: 'Inter / Helvetica Neue',
    style: 'Lowercase, Light/Regular',
    weight: '400',
    effect: 'Clean, no effects',
    tips: ['Lots of white space', 'Use very few words', 'Muted, sophisticated colors'],
  },
};

const COLOR_PALETTES = {
  shocking: [
    { name: 'Fire Alert', colors: ['#FF0000', '#FFD700', '#FFFFFF', '#000000'], desc: 'Red + Yellow on Black' },
    { name: 'Neon Danger', colors: ['#FF3366', '#FF6600', '#FFFF00', '#1A1A1A'], desc: 'Hot pink + Orange' },
    { name: 'Electric', colors: ['#00FF88', '#FF0055', '#FFFFFF', '#0D0D0D'], desc: 'Neon green + Red' },
    { name: 'Warning', colors: ['#FF4444', '#FFFFFF', '#000000', '#FFB800'], desc: 'Classic warning colors' },
  ],
  educational: [
    { name: 'Clean Pro', colors: ['#2563EB', '#FFFFFF', '#1E293B', '#60A5FA'], desc: 'Blue + White' },
    { name: 'Nature Learn', colors: ['#059669', '#FFFFFF', '#064E3B', '#A7F3D0'], desc: 'Green + White' },
    { name: 'Warm Trust', colors: ['#D97706', '#FFFBEB', '#78350F', '#FCD34D'], desc: 'Amber + Cream' },
    { name: 'Slate Modern', colors: ['#475569', '#F8FAFC', '#0F172A', '#94A3B8'], desc: 'Slate + Light' },
  ],
  funny: [
    { name: 'Party Pop', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF6600'], desc: 'Bright & wild' },
    { name: 'Candy Crush', colors: ['#FF69B4', '#00CED1', '#FF4500', '#FFFFFF'], desc: 'Playful pinks' },
    { name: 'Retro Fun', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2C3E50'], desc: 'Retro vibes' },
    { name: 'Comic Pop', colors: ['#FFD93D', '#FF6B6B', '#6BCB77', '#4D96FF'], desc: 'Comic book style' },
  ],
  dramatic: [
    { name: 'Cinematic', colors: ['#FFFFFF', '#C0C0C0', '#1A1A1A', '#333333'], desc: 'Black & White' },
    { name: 'Gold Drama', colors: ['#FFD700', '#FFFFFF', '#0A0A0A', '#8B7500'], desc: 'Gold on Black' },
    { name: 'Dark Moody', colors: ['#E2E8F0', '#64748B', '#0F172A', '#1E293B'], desc: 'Dark blue tones' },
    { name: 'Blood Moon', colors: ['#DC2626', '#FCA5A5', '#18181B', '#450A0A'], desc: 'Deep reds' },
  ],
  minimal: [
    { name: 'Paper Clean', colors: ['#1A1A1A', '#F5F5F5', '#D4D4D4', '#737373'], desc: 'Black on white' },
    { name: 'Soft Cream', colors: ['#44403C', '#FAF5F0', '#D6CFC7', '#A8A29E'], desc: 'Warm neutrals' },
    { name: 'Cool Gray', colors: ['#334155', '#F1F5F9', '#CBD5E1', '#94A3B8'], desc: 'Cool tones' },
    { name: 'Sage', colors: ['#365314', '#F7FEE7', '#BEF264', '#84CC16'], desc: 'Natural greens' },
  ],
};

const WORD_LIMIT = 5;

export default function ThumbnailTextGen({ copyToClipboard, showToast }) {
  const [topic, setTopic] = useState('');
  const [activeStyle, setActiveStyle] = useState('shocking');
  const [selectedPalette, setSelectedPalette] = useState(0);

  const topicWord = useMemo(() => {
    const t = topic.trim();
    if (!t) return 'TOPIC';
    // Take first 2 words max for short thumbnail text
    return t.split(/\s+/).slice(0, 2).join(' ').toUpperCase();
  }, [topic]);

  const generatedTexts = useMemo(() => {
    const templates = TEXT_TEMPLATES[activeStyle] || [];
    return templates.map(fn => {
      const text = fn(topicWord);
      const words = text.split(/\s+/).length;
      return { text, words };
    });
  }, [topicWord, activeStyle]);

  const fontSuggestion = useMemo(() => FONT_SUGGESTIONS[activeStyle], [activeStyle]);
  const palettes = useMemo(() => COLOR_PALETTES[activeStyle], [activeStyle]);
  const currentPalette = useMemo(() => palettes[selectedPalette] || palettes[0], [palettes, selectedPalette]);

  const handleCopy = useCallback((text) => {
    copyToClipboard(text);
    showToast('Thumbnail text copied!');
  }, [copyToClipboard, showToast]);

  const handleCopyAll = useCallback(() => {
    const all = generatedTexts.map(t => t.text).join('\n');
    copyToClipboard(all);
    showToast('All texts copied!');
  }, [generatedTexts, copyToClipboard, showToast]);

  const getWordCountColor = useCallback((words) => {
    if (words <= 3) return '#22c55e';
    if (words <= 5) return '#f0ad4e';
    return 'var(--accent-rose)';
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Input */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">🖼️ Thumbnail Text Generator</span>
        </div>
        <div className="pane-body">
          <div className="input-field">
            <label className="input-label">Video Topic</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., React, Cooking, Photography..."
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-heading)',
                fontSize: '15px',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {STYLES.map(s => (
              <button
                key={s.id}
                className={activeStyle === s.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                onClick={() => setActiveStyle(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{generatedTexts.length}</div>
          <div className="stat-label">Suggestions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3-5</div>
          <div className="stat-label">Ideal Words</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{palettes.length}</div>
          <div className="stat-label">Color Palettes</div>
        </div>
      </div>

      <div className="split-pane">
        {/* Text Suggestions */}
        <div className="pane" style={{ flex: 2 }}>
          <div className="pane-header">
            <span className="pane-title">Text Overlays — {STYLES.find(s => s.id === activeStyle)?.icon}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleCopyAll}>📋 Copy All</button>
          </div>
          <div className="pane-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {generatedTexts.map((item, i) => (
              <div
                key={i}
                onClick={() => handleCopy(item.text)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  marginBottom: '6px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: 'var(--text-heading)',
                    letterSpacing: activeStyle === 'minimal' ? '0.5px' : '1px',
                    textTransform: activeStyle === 'minimal' ? 'none' : 'uppercase',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {item.text}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      color: getWordCountColor(item.words),
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {item.words} word{item.words !== 1 ? 's' : ''}
                    </span>
                    {item.words > WORD_LIMIT && (
                      <span style={{ fontSize: '11px', color: 'var(--accent-rose)' }}>⚠️ Consider shortening</span>
                    )}
                    {item.words <= 3 && (
                      <span style={{ fontSize: '11px', color: '#22c55e' }}>✅ Perfect length</span>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => { e.stopPropagation(); handleCopy(item.text); }}
                >
                  📋
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Font, Colors, Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {/* Font Suggestions */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">🔤 Font Suggestions</span>
            </div>
            <div className="pane-body">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Font</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-heading)', fontWeight: 600 }}>{fontSuggestion.primary}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Style</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-heading)', fontWeight: 600 }}>{fontSuggestion.style}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weight</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-heading)', fontWeight: 600 }}>{fontSuggestion.weight}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Effect</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-heading)', fontWeight: 600 }}>{fontSuggestion.effect}</span>
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Tips:</span>
                <ul style={{ margin: '4px 0 0', paddingLeft: '16px' }}>
                  {fontSuggestion.tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '3px' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">🎨 Color Palettes</span>
            </div>
            <div className="pane-body">
              {palettes.map((palette, pi) => (
                <div
                  key={pi}
                  onClick={() => setSelectedPalette(pi)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    marginBottom: '6px',
                    background: selectedPalette === pi ? 'var(--accent-purple-light)' : 'var(--bg-primary)',
                    border: `1px solid ${selectedPalette === pi ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {palette.colors.map((color, ci) => (
                      <div
                        key={ci}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(color);
                          showToast(`Color ${color} copied!`);
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: color,
                          border: '2px solid var(--border-secondary)',
                          cursor: 'pointer',
                          transition: 'transform 0.1s',
                        }}
                        title={`${color} — Click to copy`}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>{palette.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{palette.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Preview */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">👁️ Preview</span>
            </div>
            <div className="pane-body" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '16/9',
                borderRadius: 'var(--radius-md)',
                background: currentPalette.colors[3] || '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid var(--border-primary)',
              }}>
                {/* Decorative background pattern */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.08,
                  background: `radial-gradient(circle at 30% 50%, ${currentPalette.colors[0]}, transparent 50%), radial-gradient(circle at 70% 50%, ${currentPalette.colors[1]}, transparent 50%)`,
                }} />
                <div style={{
                  position: 'relative',
                  textAlign: 'center',
                  padding: '12px 16px',
                }}>
                  <div style={{
                    fontSize: generatedTexts[0]?.text?.length > 15 ? '18px' : '24px',
                    fontWeight: parseInt(fontSuggestion.weight) || 800,
                    color: currentPalette.colors[0],
                    textTransform: activeStyle === 'minimal' ? 'none' : 'uppercase',
                    letterSpacing: activeStyle === 'minimal' ? '0.5px' : '2px',
                    textShadow: activeStyle !== 'minimal' ? `2px 2px 4px ${currentPalette.colors[3]}88` : 'none',
                    lineHeight: 1.2,
                    fontFamily: 'var(--font-mono)',
                    wordBreak: 'break-word',
                  }}>
                    {generatedTexts[0]?.text || 'YOUR TEXT HERE'}
                  </div>
                </div>
                {/* Play button overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                }}>
                  ▶
                </div>
                {/* Duration badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  12:34
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
