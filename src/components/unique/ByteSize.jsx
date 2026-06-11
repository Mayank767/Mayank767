import React, { useState, useEffect } from 'react';

function getByteSize(str, encoding) {
  if (!str) return 0;
  const encoder = new TextEncoder();
  switch (encoding) {
    case 'UTF-8': return encoder.encode(str).length;
    case 'UTF-16': return str.length * 2;
    case 'UTF-32': return [...str].length * 4;
    case 'ASCII': return [...str].every(c => c.charCodeAt(0) < 128) ? str.length : null;
    default: return 0;
  }
}

function fmt(n) {
  if (n === null) return 'N/A (non-ASCII)';
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(2)} KB`;
  return `${n} bytes`;
}

const ENCODINGS = ['UTF-8', 'UTF-16', 'UTF-32', 'ASCII'];

export default function ByteSize({ copyToClipboard, showToast, sampleData }) {
  const [text, setText] = useState('Hello, 世界! 🚀');

  // Try Example via sampleData prop
  useEffect(() => { if (sampleData) setText(sampleData); }, [sampleData]);

  useEffect(() => {
    const handler = (e) => setText(e.detail);
    document.addEventListener('load-sample', handler);
    return () => document.removeEventListener('load-sample', handler);
  }, []);

  const chars = [...text].length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  const hasNonAscii = [...text].some(c => c.charCodeAt(0) >= 128);
  const utf8Size = getByteSize(text, 'UTF-8');
  const maxSize = Math.max(utf8Size, getByteSize(text, 'UTF-16'), getByteSize(text, 'UTF-32'), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Input Text</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{chars} chars</span>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste text here..."
            rows={5}
          />
          {hasNonAscii && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--accent-amber-dim)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--accent-amber)' }}>
              ⚠ Non-ASCII characters detected (emoji, unicode). ASCII encoding is not applicable.
            </div>
          )}
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{chars.toLocaleString()}</div><div className="stat-label">Characters</div></div>
        <div className="stat-card"><div className="stat-value">{words.toLocaleString()}</div><div className="stat-label">Words</div></div>
        <div className="stat-card"><div className="stat-value">{lines}</div><div className="stat-label">Lines</div></div>
        <div className="stat-card"><div className="stat-value">{utf8Size}</div><div className="stat-label">UTF-8 Bytes</div></div>
      </div>

      <div className="pane">
        <div className="pane-header"><span className="pane-title">Encoding Comparison</span></div>
        <div className="pane-body" style={{ gap: 12 }}>
          {ENCODINGS.map(enc => {
            const size = getByteSize(text, enc);
            const pct = size === null ? 0 : (size / maxSize) * 100;
            const colors = { 'UTF-8': 'var(--accent-purple)', 'UTF-16': 'var(--accent-cyan)', 'UTF-32': 'var(--accent-emerald)', ASCII: 'var(--accent-amber)' };
            return (
              <div key={enc}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: colors[enc], fontSize: 13 }}>{enc}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: size === null ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {size === null ? 'N/A' : `${size} bytes (${fmt(size)})`}
                  </span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: colors[enc], borderRadius: 4, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
