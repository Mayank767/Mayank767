import React, { useState, useEffect } from 'react';

// Block font - each char is 5 rows of 5 chars
const BLOCK_FONT = {
  A: ['█████','█   █','█████','█   █','█   █'],
  B: ['████ ','█   █','████ ','█   █','████ '],
  C: [' ████','█    ','█    ','█    ',' ████'],
  D: ['████ ','█   █','█   █','█   █','████ '],
  E: ['█████','█    ','████ ','█    ','█████'],
  F: ['█████','█    ','████ ','█    ','█    '],
  G: [' ████','█    ','█  ██','█   █',' ████'],
  H: ['█   █','█   █','█████','█   █','█   █'],
  I: ['█████','  █  ','  █  ','  █  ','█████'],
  J: ['█████','   █ ','   █ ','█  █ ',' ██  '],
  K: ['█   █','█  █ ','███  ','█  █ ','█   █'],
  L: ['█    ','█    ','█    ','█    ','█████'],
  M: ['█   █','██ ██','█ █ █','█   █','█   █'],
  N: ['█   █','██  █','█ █ █','█  ██','█   █'],
  O: [' ███ ','█   █','█   █','█   █',' ███ '],
  P: ['████ ','█   █','████ ','█    ','█    '],
  Q: [' ███ ','█   █','█ █ █','█  ██',' ████'],
  R: ['████ ','█   █','████ ','█  █ ','█   █'],
  S: [' ████','█    ',' ███ ','    █','████ '],
  T: ['█████','  █  ','  █  ','  █  ','  █  '],
  U: ['█   █','█   █','█   █','█   █',' ███ '],
  V: ['█   █','█   █','█   █',' █ █ ','  █  '],
  W: ['█   █','█   █','█ █ █','██ ██','█   █'],
  X: ['█   █',' █ █ ','  █  ',' █ █ ','█   █'],
  Y: ['█   █',' █ █ ','  █  ','  █  ','  █  '],
  Z: ['█████','   █ ','  █  ',' █   ','█████'],
  ' ': ['     ','     ','     ','     ','     '],
  '0': [' ███ ','█  ██','█ █ █','██  █',' ███ '],
  '1': [' ██  ','  █  ','  █  ','  █  ','█████'],
  '2': [' ███ ','█   █','  ██ ',' █   ','█████'],
  '3': ['████ ','    █','  ██ ','    █','████ '],
  '4': ['█   █','█   █','█████','    █','    █'],
  '5': ['█████','█    ','████ ','    █','████ '],
  '6': [' ███ ','█    ','████ ','█   █',' ███ '],
  '7': ['█████','    █','   █ ','  █  ','  █  '],
  '8': [' ███ ','█   █',' ███ ','█   █',' ███ '],
  '9': [' ███ ','█   █',' ████','    █',' ███ '],
  '!': ['  █  ','  █  ','  █  ','     ','  █  '],
  '?': [' ███ ','█   █','  ██ ','     ','  █  '],
};

function textToAscii(text, scale = 1) {
  const chars = text.toUpperCase().split('');
  const rows = ['', '', '', '', ''];
  chars.forEach(ch => {
    const font = BLOCK_FONT[ch] || BLOCK_FONT['?'];
    font.forEach((row, i) => {
      rows[i] += row.split('').map(c => c === '█' ? '█'.repeat(scale) : ' '.repeat(scale)).join('') + '  ';
    });
  });
  return rows.join('\n');
}

export default function AsciiArt({ copyToClipboard, showToast, sampleData }) {
  const [text, setText] = useState('WEB');
  const [scale, setScale] = useState(1);

  // Try Example via sampleData prop
  useEffect(() => { if (sampleData) setText(sampleData.slice(0, 12)); }, [sampleData]);

  useEffect(() => {
    const handler = (e) => setText(e.detail.slice(0, 12));
    document.addEventListener('load-sample', handler);
    return () => document.removeEventListener('load-sample', handler);
  }, []);

  const output = text ? textToAscii(text.slice(0, 14), scale) : '';
  const charCount = [...text].filter(c => BLOCK_FONT[c.toUpperCase()]).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Input Text (max 14 chars)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="slider-group" style={{ width: 160 }}>
              <div className="slider-label">
                <span className="slider-label-text">Scale</span>
                <span className="slider-value">{scale}×</span>
              </div>
              <input type="range" className="slider" min={1} max={3} value={scale} onChange={e => setScale(+e.target.value)} />
            </div>
          </div>
        </div>
        <div className="pane-body">
          <input
            className="input-field"
            value={text}
            onChange={e => setText(e.target.value.slice(0, 14))}
            placeholder="Type text here..."
            style={{ fontFamily: 'var(--font-mono)', fontSize: 18, letterSpacing: 2 }}
            maxLength={14}
          />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            {charCount}/{14} supported characters
          </div>
        </div>
      </div>

      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">ASCII Art Output</span>
          <button className="btn btn-primary btn-sm" disabled={!output} onClick={() => { copyToClipboard(output); showToast('ASCII art copied!'); }}>📋 Copy</button>
        </div>
        <div className="pane-body">
          <pre style={{
            fontFamily: 'var(--font-mono)',
            fontSize: Math.max(6, 10 - scale * 1.5),
            lineHeight: 1.2,
            color: 'var(--accent-purple)',
            background: 'var(--bg-primary)',
            padding: 16,
            borderRadius: 8,
            overflowX: 'auto',
            whiteSpace: 'pre',
            letterSpacing: '0.05em',
          }}>
            {output || 'Start typing above...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
