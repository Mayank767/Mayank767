import React, { useState } from 'react';

function toSlug(text, sep, lower, removeNums) {
  let s = lower ? text.toLowerCase() : text;
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (removeNums) s = s.replace(/[0-9]/g, '');
  s = s.replace(/[^a-zA-Z0-9\s-]/g, '');
  s = s.trim().replace(/[\s-]+/g, sep);
  return s;
}

export default function SlugGenerator({ copyToClipboard, showToast }) {
  const [input, setInput] = useState('');
  const [sep, setSep] = useState('-');
  const [lower, setLower] = useState(true);
  const [removeNums, setRemoveNums] = useState(false);

  const slug = input ? toSlug(input, sep, lower, removeNums) : '';

  const examples = [
    'My Awesome Blog Post!',
    'How to use React Hooks in 2024?',
    '5 Tips for Better CSS Design',
    'Hello, World! — Getting Started',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="pane">
        <div className="pane-header"><span className="pane-title">Input Text</span></div>
        <div className="pane-body" style={{ gap: 12 }}>
          <input className="input-field" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter title or text to slugify..." style={{ fontSize: 16 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {examples.map(ex => (
              <button key={ex} className="btn btn-ghost btn-sm" onClick={() => setInput(ex)}
                style={{ fontSize: 11 }}>{ex.slice(0, 30)}...</button>
            ))}
          </div>
        </div>
      </div>

      <div className="controls-panel">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label className="label">Separator</label>
            <div className="tab-group">
              <button className={`tab-btn ${sep === '-' ? 'active' : ''}`} onClick={() => setSep('-')}>Hyphen (-)</button>
              <button className={`tab-btn ${sep === '_' ? 'active' : ''}`} onClick={() => setSep('_')}>Underscore (_)</button>
            </div>
          </div>
          <div className="checkbox-group" style={{ marginTop: 20 }}>
            <label className="checkbox-label">
              <input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} />
              Lowercase
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={removeNums} onChange={e => setRemoveNums(e.target.checked)} />
              Remove numbers
            </label>
          </div>
        </div>
      </div>

      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Generated Slug</span>
          <button className="btn btn-primary btn-sm" onClick={() => { copyToClipboard(slug); showToast('Slug copied!'); }} disabled={!slug}>Copy</button>
        </div>
        <div className="pane-body">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--accent-cyan-light)', padding: '12px 0', wordBreak: 'break-all' }}>
            {slug || <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 15 }}>Slug will appear here...</span>}
          </div>
          {slug && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
              URL: <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>https://example.com/{slug}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
