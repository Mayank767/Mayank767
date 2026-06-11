import React, { useState } from 'react';

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function hashText(text, algo) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator({ copyToClipboard, showToast }) {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [hashes, setHashes] = useState({});
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('single');

  const generateSingle = async () => {
    if (!input.trim()) { showToast('Enter text to hash', 'error'); return; }
    setLoading(true);
    try {
      const h = await hashText(input, algo);
      setHashes({ [algo]: h });
    } catch (e) { showToast('Hash failed: ' + e.message, 'error'); }
    setLoading(false);
  };

  const generateAll = async () => {
    if (!input.trim()) { showToast('Enter text to hash', 'error'); return; }
    setLoading(true);
    const result = {};
    for (const a of ALGOS) {
      try { result[a] = await hashText(input, a); } catch (e) { result[a] = 'Error'; }
    }
    setHashes(result);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="pane">
        <div className="pane-header"><span className="pane-title">Input Text</span></div>
        <div className="pane-body">
          <textarea className="textarea-code" style={{ minHeight: 120 }} value={input} onChange={e => { setInput(e.target.value); setHashes({}); }}
            placeholder="Enter text to hash..." />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="tab-group">
          {ALGOS.map(a => (
            <button key={a} className={`tab-btn ${algo === a ? 'active' : ''}`} onClick={() => setAlgo(a)}>{a}</button>
          ))}
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={generateSingle} disabled={loading}>
            {loading ? '⏳' : '🛡️'} Generate {algo}
          </button>
          <button className="btn btn-secondary" onClick={generateAll} disabled={loading}>
            Generate All
          </button>
        </div>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(hashes).map(([a, h]) => (
            <div key={a} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--accent-purple-light)' }}>{a}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.length * 4} bits / {h.length / 2} bytes</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-cyan-light)', wordBreak: 'break-all', marginBottom: 10 }}>{h}</div>
              <button className="btn btn-secondary btn-sm" onClick={() => { copyToClipboard(h); showToast(`${a} hash copied!`); }}>Copy</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--accent-amber-dim)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--accent-amber)' }}>
        ℹ️ Uses the browser's built-in <strong>Web Crypto API</strong>. All hashing happens locally — no data is sent anywhere. MD5 is not available in Web Crypto API (it's insecure and deprecated).
      </div>
    </div>
  );
}
