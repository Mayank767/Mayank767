import React, { useState } from 'react';

const GST_RATES = [3, 5, 12, 18, 28];

export default function GstCalculator({ copyToClipboard, showToast }) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState('add'); // 'add' = exclusive, 'extract' = inclusive

  const calc = (() => {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt) || amt <= 0) return null;
    if (mode === 'add') {
      const gst = amt * rate / 100;
      const total = amt + gst;
      return { original: amt, gst, total, cgst: gst / 2, sgst: gst / 2 };
    } else {
      const original = (amt * 100) / (100 + rate);
      const gst = amt - original;
      return { original, gst, total: amt, cgst: gst / 2, sgst: gst / 2 };
    }
  })();

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="pane">
        <div className="pane-header"><span className="pane-title">GST Calculator</span></div>
        <div className="pane-body" style={{ gap: 16 }}>
          {/* Mode Toggle */}
          <div className="tab-group">
            <button className={`tab-btn ${mode === 'add' ? 'active' : ''}`} onClick={() => setMode('add')}>➕ Add GST (Exclusive)</button>
            <button className={`tab-btn ${mode === 'extract' ? 'active' : ''}`} onClick={() => setMode('extract')}>➖ Extract GST (Inclusive)</button>
          </div>

          <div>
            <label className="input-label">{mode === 'add' ? 'Amount (Before GST) ₹' : 'Amount (GST Included) ₹'}</label>
            <input className="input-field" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" min="0" style={{ fontSize: 18 }} />
          </div>

          {/* GST Rate Selector */}
          <div>
            <label className="input-label">GST Rate</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {GST_RATES.map(r => (
                <button key={r} onClick={() => setRate(r)}
                  style={{
                    padding: '8px 20px', border: `2px solid ${rate === r ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
                    borderRadius: 8, background: rate === r ? 'var(--accent-purple-dim)' : 'var(--bg-surface)',
                    color: rate === r ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 700, fontSize: 15, transition: 'all 150ms',
                  }}>{r}%</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {calc && (
        <>
          {/* Main Result */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="pane" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="pane-body" style={{ textAlign: 'center', padding: '20px 14px' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Original Amount</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'Space Grotesk, sans-serif' }}>{fmt(calc.original)}</div>
              </div>
            </div>
            <div className="pane" style={{ borderColor: 'var(--accent-purple)', background: 'var(--accent-purple-dim)' }}>
              <div className="pane-body" style={{ textAlign: 'center', padding: '20px 14px', cursor: 'pointer' }}
                onClick={() => { copyToClipboard(calc.total.toFixed(2)); showToast('Total copied!'); }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{mode === 'add' ? 'Total (with GST)' : 'GST-Exclusive Price'}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-purple-light)', fontFamily: 'Space Grotesk, sans-serif' }}>{fmt(mode === 'add' ? calc.total : calc.original)}</div>
              </div>
            </div>
          </div>

          {/* GST Breakdown */}
          <div className="pane">
            <div className="pane-header"><span className="pane-title">GST Breakdown</span></div>
            <div className="pane-body" style={{ gap: 0, padding: 0 }}>
              {[
                { label: `Total GST (${rate}%)`, value: calc.gst, color: 'var(--accent-rose)' },
                { label: 'CGST (Central)', value: calc.cgst, color: 'var(--accent-amber)' },
                { label: 'SGST / IGST (State)', value: calc.sgst, color: 'var(--accent-blue)' },
                { label: 'Original Amount', value: calc.original, color: 'var(--accent-cyan)' },
                { label: 'Final Amount (Total)', value: calc.total, color: 'var(--accent-purple-light)', bold: true },
              ].map(({ label, value, color, bold }, i) => (
                <div key={label} onClick={() => { copyToClipboard(value.toFixed(2)); showToast('Copied!'); }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderBottom: i < 4 ? '1px solid var(--border-primary)' : 'none',
                    cursor: 'pointer', transition: 'background 150ms',
                    background: bold ? 'var(--accent-purple-dim)' : 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = bold ? 'var(--accent-purple-dim)' : 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = bold ? 'var(--accent-purple-dim)' : 'transparent'}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: bold ? 700 : 400 }}>{label}</span>
                  <span style={{ fontWeight: bold ? 900 : 600, color, fontFamily: 'Space Grotesk, sans-serif', fontSize: bold ? 16 : 14 }}>{fmt(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Bar */}
          <div className="pane">
            <div className="pane-header"><span className="pane-title">Amount Split</span></div>
            <div className="pane-body">
              <div style={{ height: 28, borderRadius: 8, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${(calc.original / calc.total) * 100}%`, background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000', transition: 'width 0.5s' }}>
                  {((calc.original / calc.total) * 100).toFixed(1)}%
                </div>
                <div style={{ flex: 1, background: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                  GST {rate}%
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, background: 'var(--accent-cyan)', borderRadius: 2, display: 'inline-block' }} />Base Amount</span>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, background: 'var(--accent-rose)', borderRadius: 2, display: 'inline-block' }} />GST Amount</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
