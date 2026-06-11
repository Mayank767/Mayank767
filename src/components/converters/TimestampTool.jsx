import React, { useState, useEffect } from 'react';

function fmt(d) {
  return d.toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short'
  });
}

export default function TimestampTool({ copyToClipboard, showToast }) {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [dtInput, setDtInput] = useState(new Date().toISOString().slice(0, 16));
  const [tsResult, setTsResult] = useState('');
  const [dtResult, setDtResult] = useState('');
  const [tsError, setTsError] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const convertTs = () => {
    const n = Number(tsInput.trim());
    if (!tsInput.trim() || isNaN(n)) { setTsError('Enter a valid Unix timestamp'); setTsResult(''); return; }
    setTsError('');
    const ms = n > 1e10 ? n : n * 1000;
    const d = new Date(ms);
    setTsResult(fmt(d));
  };

  const convertDt = () => {
    const d = new Date(dtInput);
    if (isNaN(d.getTime())) return;
    setDtResult(Math.floor(d.getTime() / 1000).toString());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Live clock */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Current Unix Timestamp</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800, color: 'var(--accent-purple-light)' }}>{now}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{fmt(new Date(now * 1000))}</div>
        </div>
        <button className="btn btn-secondary" onClick={() => { copyToClipboard(String(now)); showToast('Timestamp copied!'); }}>Copy Current</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Unix → Human */}
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Unix → Human Date</span></div>
          <div className="pane-body" style={{ gap: 12 }}>
            <label className="label">Unix Timestamp (seconds or ms)</label>
            <input className="input-field" placeholder="e.g. 1700000000" value={tsInput} onChange={e => setTsInput(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
            {tsError && <div style={{ color: 'var(--accent-rose)', fontSize: 12 }}>{tsError}</div>}
            <button className="btn btn-primary btn-sm" onClick={convertTs}>Convert</button>
            {tsResult && (
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 14, color: 'var(--accent-cyan-light)', marginBottom: 8 }}>{tsResult}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => { copyToClipboard(tsResult); showToast('Copied!'); }}>Copy</button>
              </div>
            )}
          </div>
        </div>

        {/* Human → Unix */}
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Human Date → Unix</span></div>
          <div className="pane-body" style={{ gap: 12 }}>
            <label className="label">Select Date & Time</label>
            <input type="datetime-local" className="input-field" value={dtInput} onChange={e => setDtInput(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
            <button className="btn btn-primary btn-sm" onClick={convertDt}>Convert</button>
            {dtResult && (
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: 'var(--accent-purple-light)', marginBottom: 8 }}>{dtResult}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => { copyToClipboard(dtResult); showToast('Copied!'); }}>Copy</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
