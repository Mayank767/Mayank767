import React, { useState } from 'react';

const COMMON = [8, 10, 12, 14, 16, 18, 20, 24, 32, 48, 64, 72, 96];

export default function PxRemConverter({ copyToClipboard, showToast }) {
  const [base, setBase] = useState(16);
  const [pxVal, setPxVal] = useState('');
  const [remVal, setRemVal] = useState('');

  const onPxChange = v => {
    setPxVal(v);
    const n = parseFloat(v);
    setRemVal(isNaN(n) ? '' : (n / base).toFixed(4).replace(/\.?0+$/, ''));
  };

  const onRemChange = v => {
    setRemVal(v);
    const n = parseFloat(v);
    setPxVal(isNaN(n) ? '' : (n * base).toFixed(4).replace(/\.?0+$/, ''));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="controls-panel">
        <div className="controls-title">Base Font Size</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input type="range" className="slider" min="8" max="32" value={base} onChange={e => { setBase(Number(e.target.value)); onPxChange(pxVal); }} style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input className="input-field" type="number" value={base} onChange={e => setBase(Number(e.target.value))} style={{ width: 70, fontFamily: 'var(--font-mono)', fontWeight: 700 }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>px</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Pixels (px)</span></div>
          <div className="pane-body">
            <input className="input-field" type="number" placeholder="e.g. 16" value={pxVal} onChange={e => onPxChange(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, padding: '12px 16px', textAlign: 'center' }} />
            {pxVal && <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => { copyToClipboard(`${pxVal}px`); showToast('Copied!'); }}>Copy {pxVal}px</button>}
          </div>
        </div>

        <div style={{ fontSize: 24, color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>⇄</div>

        <div className="pane">
          <div className="pane-header"><span className="pane-title">Root EM (rem)</span></div>
          <div className="pane-body">
            <input className="input-field" type="number" placeholder="e.g. 1" value={remVal} onChange={e => onRemChange(e.target.value)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, padding: '12px 16px', textAlign: 'center' }} />
            {remVal && <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => { copyToClipboard(`${remVal}rem`); showToast('Copied!'); }}>Copy {remVal}rem</button>}
          </div>
        </div>
      </div>

      <div className="controls-panel">
        <div className="controls-title">Common Values (base: {base}px)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr>
                {['px', 'rem', 'em (same base)'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMMON.map(n => (
                <tr key={n} style={{ borderBottom: '1px solid var(--border-primary)', cursor: 'pointer' }}
                  onClick={() => onPxChange(String(n))}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-amber)' }}>{n}px</td>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-cyan-light)' }}>{(n / base).toFixed(4).replace(/\.?0+$/, '')}rem</td>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-emerald)' }}>{(n / base).toFixed(4).replace(/\.?0+$/, '')}em</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
