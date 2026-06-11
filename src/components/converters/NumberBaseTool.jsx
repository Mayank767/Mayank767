import React, { useState } from 'react';

const BASES = [
  { id: 2, label: 'Binary', prefix: '0b' },
  { id: 8, label: 'Octal', prefix: '0o' },
  { id: 10, label: 'Decimal', prefix: '' },
  { id: 16, label: 'Hexadecimal', prefix: '0x' },
];

export default function NumberBaseTool({ copyToClipboard, showToast }) {
  const [inputVal, setInputVal] = useState('');
  const [inputBase, setInputBase] = useState(10);
  const [error, setError] = useState('');

  const decimal = (() => {
    if (!inputVal.trim()) return null;
    const n = parseInt(inputVal.trim(), inputBase);
    return isNaN(n) ? null : n;
  })();

  const convert = () => {
    if (!inputVal.trim()) return;
    const n = parseInt(inputVal.trim(), inputBase);
    if (isNaN(n)) { setError(`Invalid value for base ${inputBase}`); return; }
    setError('');
  };

  const handleInput = (v) => {
    setInputVal(v);
    if (v.trim()) {
      const n = parseInt(v.trim(), inputBase);
      setError(isNaN(n) ? `Invalid value for base ${inputBase}` : '');
    } else setError('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="controls-panel">
        <div className="controls-title">Input</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label className="label">Value</label>
            <input className="input-field" value={inputVal} onChange={e => handleInput(e.target.value)}
              placeholder={inputBase === 2 ? '1010' : inputBase === 16 ? 'FF' : '42'} style={{ fontFamily: 'var(--font-mono)', fontSize: 18, padding: '12px 16px' }} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label className="label">Input Base</label>
            <select className="select-field" value={inputBase} onChange={e => { setInputBase(Number(e.target.value)); setError(''); }}
              style={{ width: '100%', padding: '12px 14px' }}>
              {BASES.map(b => <option key={b.id} value={b.id}>{b.label} (Base {b.id})</option>)}
            </select>
          </div>
        </div>
        {error && <div style={{ color: 'var(--accent-rose)', fontSize: 13, marginTop: 8 }}>⚠️ {error}</div>}
      </div>

      {decimal !== null && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {BASES.map(b => {
            const val = b.id === 10 ? decimal.toString() : b.id === 2 ? decimal.toString(2) : b.id === 8 ? decimal.toString(8) : decimal.toString(16).toUpperCase();
            return (
              <div key={b.id} style={{
                background: 'var(--bg-surface)', border: `1px solid ${b.id === inputBase ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
                borderRadius: 'var(--radius-md)', padding: 16,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 6 }}>
                  {b.label} (Base {b.id})
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--accent-cyan-light)', wordBreak: 'break-all', marginBottom: 8 }}>
                  {b.prefix}{val}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => { copyToClipboard(`${b.prefix}${val}`); showToast(`${b.label} copied!`); }}>Copy</button>
              </div>
            );
          })}
        </div>
      )}

      {!inputVal && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔢</div>
          <div>Enter a number above to see conversions in all bases</div>
        </div>
      )}

      <div className="controls-panel">
        <div className="controls-title">Quick Reference</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr>{['Decimal', 'Binary', 'Octal', 'Hex'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[0,1,2,4,8,10,15,16,32,64,128,255].map(n => (
                <tr key={n} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '6px 12px', color: 'var(--text-primary)' }}>{n}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-cyan-light)' }}>{n.toString(2)}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-emerald)' }}>{n.toString(8)}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-amber)' }}>{n.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
