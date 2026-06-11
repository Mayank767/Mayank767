import React, { useState } from 'react';

const MODES = [
  { id: 'percent-of', label: '% of Number', desc: 'What is X% of Y?' },
  { id: 'what-percent', label: 'What Percent', desc: 'X is what % of Y?' },
  { id: 'percent-change', label: '% Change', desc: '% change from X to Y' },
  { id: 'increase-decrease', label: 'Increase / Decrease', desc: 'Increase/decrease X by Y%' },
];

export default function PercentageCalculator({ showToast, copyToClipboard }) {
  const [mode, setMode] = useState('percent-of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const result = (() => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return null;
    switch (mode) {
      case 'percent-of': return { value: (x / 100) * y, label: `${x}% of ${y}`, unit: '' };
      case 'what-percent': return y === 0 ? null : { value: (x / y) * 100, label: `${x} is`, unit: '% of ' + y };
      case 'percent-change': return x === 0 ? null : { value: ((y - x) / Math.abs(x)) * 100, label: y >= x ? 'Increase' : 'Decrease', unit: '%', isChange: true };
      case 'increase-decrease': return [
        { value: x + (x * y / 100), label: `After ${y}% increase`, unit: '' },
        { value: x - (x * y / 100), label: `After ${y}% decrease`, unit: '' },
        { value: (x * y / 100), label: `${y}% of ${x}`, unit: '' },
      ];
      default: return null;
    }
  })();

  const CONFIG = {
    'percent-of': { aLabel: 'Percentage (%)', bLabel: 'Number', aPlaceholder: '25', bPlaceholder: '200' },
    'what-percent': { aLabel: 'Value', bLabel: 'Total', aPlaceholder: '50', bPlaceholder: '200' },
    'percent-change': { aLabel: 'Original Value', bLabel: 'New Value', aPlaceholder: '100', bPlaceholder: '150' },
    'increase-decrease': { aLabel: 'Original Value', bLabel: 'Percentage (%)', aPlaceholder: '1000', bPlaceholder: '20' },
  };
  const cfg = CONFIG[mode];

  const fmt = (n) => {
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    return parseFloat(n.toFixed(4)).toLocaleString('en-IN');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Mode Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setA(''); setB(''); }}
            style={{
              padding: '12px 14px', border: `1px solid ${mode === m.id ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
              borderRadius: 10, background: mode === m.id ? 'var(--accent-purple-dim)' : 'var(--bg-surface)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
            }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: mode === m.id ? 'var(--accent-purple-light)' : 'var(--text-heading)', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="pane">
        <div className="pane-body" style={{ gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="input-label">{cfg.aLabel}</label>
              <input className="input-field" type="number" value={a} onChange={e => setA(e.target.value)} placeholder={cfg.aPlaceholder} />
            </div>
            <div>
              <label className="input-label">{cfg.bLabel}</label>
              <input className="input-field" type="number" value={b} onChange={e => setB(e.target.value)} placeholder={cfg.bPlaceholder} />
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        Array.isArray(result) ? (
          <div className="stats-row">
            {result.map((r, i) => (
              <div key={i} className="stat-card" style={{ flex: '1 1 140px', cursor: 'pointer' }} onClick={() => { copyToClipboard(String(r.value.toFixed(2))); showToast('Copied!'); }}>
                <div className="stat-label">{r.label}</div>
                <div className="stat-value" style={{ color: i === 0 ? 'var(--accent-cyan)' : i === 1 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>{fmt(r.value)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pane" style={{ background: 'var(--accent-purple-dim)', borderColor: 'var(--accent-purple)', cursor: 'pointer' }}
            onClick={() => { copyToClipboard(String(result.value.toFixed(4))); showToast('Result copied!'); }}>
            <div className="pane-body" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{result.label}</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: result.isChange ? (result.value >= 0 ? 'var(--accent-cyan)' : 'var(--accent-rose)') : 'var(--accent-purple-light)', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                {result.isChange && result.value >= 0 ? '+' : ''}{fmt(result.value)}{result.unit}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>Click to copy result</div>
            </div>
          </div>
        )
      )}

      {/* Quick Examples */}
      <div className="pane">
        <div className="pane-header"><span className="pane-title">Quick Examples</span></div>
        <div className="pane-body" style={{ gap: 8 }}>
          {[
            { label: '18% GST on ₹1000', a: '18', b: '1000', mode: 'percent-of' },
            { label: 'Discount: 200 off 800?', a: '200', b: '800', mode: 'what-percent' },
            { label: '₹50 → ₹75 change', a: '50', b: '75', mode: 'percent-change' },
            { label: '₹5000 + 10% raise', a: '5000', b: '10', mode: 'increase-decrease' },
          ].map(ex => (
            <button key={ex.label} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}
              onClick={() => { setMode(ex.mode); setA(ex.a); setB(ex.b); }}>
              💡 {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
