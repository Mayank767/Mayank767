import React, { useState, useEffect } from 'react';

function calcSpecificity(selector) {
  let a = 0, b = 0, c = 0;
  let s = selector.trim()
    .replace(/:not\(([^)]*)\)/g, (_, inner) => { const r = calcSpecificity(inner); a+=r.a;b+=r.b;c+=r.c; return ''; })
    .replace(/::?[\w-]+(?:\([^)]*\))?/g, () => { b++; return ''; }) // pseudo-classes/elements
    .replace(/#[\w-]+/g, () => { a++; return ''; })           // IDs
    .replace(/\[.*?\]/g, () => { b++; return ''; })            // attributes
    .replace(/\.[\w-]+/g, () => { b++; return ''; });          // classes
  const tags = s.match(/\b[a-z][\w-]*/g) || [];
  tags.forEach(t => { if (t !== 'html' && t !== 'body') c++; });
  return { a, b, c, score: a * 100 + b * 10 + c };
}

const SAMPLE = `#main .container > p:hover
.nav > a.active
div p
#header
.btn.btn-primary:focus`;

export default function CssSpecificity({ copyToClipboard, showToast, sampleData }) {
  const [input, setInput] = useState('#main .container > p:hover\n.nav > a.active\ndiv p');

  // Try Example via sampleData prop
  useEffect(() => { if (sampleData) setInput(sampleData); }, [sampleData]);

  useEffect(() => {
    const handler = (e) => setInput(e.detail);
    document.addEventListener('load-sample', handler);
    return () => document.removeEventListener('load-sample', handler);
  }, []);

  const selectors = input.split('\n').map(s => s.trim()).filter(Boolean);
  const results = selectors.map(sel => ({ sel, ...calcSpecificity(sel) }));
  const maxScore = Math.max(...results.map(r => r.score), 1);
  const winner = results.reduce((best, r) => r.score > best.score ? r : best, results[0]);

  return (
    <div className="split-pane" style={{ flexDirection: 'column', gap: 16 }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">CSS Selectors (one per line)</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setInput(SAMPLE)}>💡 Example</button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="#main .container > p&#10;.nav a.active&#10;div p"
            rows={6}
            spellCheck={false}
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Specificity Results</span></div>
          <div className="pane-body" style={{ gap: 12 }}>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 4 }}>
              <span><span style={{ color: '#f59e0b', fontWeight: 700 }}>A</span> = IDs</span>
              <span><span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>B</span> = Classes/Attrs/Pseudo</span>
              <span><span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>C</span> = Elements</span>
            </div>
            {results.map((r, i) => (
              <div key={i} style={{
                background: r.sel === winner?.sel ? 'var(--accent-purple-dim)' : 'var(--bg-primary)',
                border: `1px solid ${r.sel === winner?.sel ? 'var(--border-glow-purple)' : 'var(--border-primary)'}`,
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>{r.sel}</code>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ background: '#f59e0b22', color: '#f59e0b', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.a}</span>
                    <span style={{ background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.b}</span>
                    <span style={{ background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.c}</span>
                    {r.sel === winner?.sel && <span style={{ fontSize: 11, color: 'var(--accent-purple)', fontWeight: 700 }}>👑 WINS</span>}
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${(r.score / maxScore) * 100}%`,
                    background: r.sel === winner?.sel ? 'var(--gradient-purple-cyan)' : 'var(--bg-hover)',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Score: {r.score} &nbsp;·&nbsp; ({r.a},{r.b},{r.c})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
