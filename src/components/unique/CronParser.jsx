import React, { useState, useEffect } from 'react';

const PRESETS = [
  { label: '@hourly', value: '0 * * * *', desc: 'Every hour' },
  { label: '@daily', value: '0 0 * * *', desc: 'Every day at midnight' },
  { label: '@weekly', value: '0 0 * * 0', desc: 'Every Sunday at midnight' },
  { label: '@monthly', value: '0 0 1 * *', desc: 'First day of month' },
  { label: 'Every 5 min', value: '*/5 * * * *', desc: 'Every 5 minutes' },
  { label: 'Weekdays 9am', value: '0 9 * * 1-5', desc: 'Mon-Fri at 9:00 AM' },
];

function parseCron(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const [min, hour, dom, month, dow] = parts;
  return { min, hour, dom, month, dow };
}

function describeField(val, type) {
  if (val === '*') return null;
  const names = {
    month: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dow: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  };
  if (val.startsWith('*/')) return `every ${val.slice(2)} ${type}(s)`;
  if (val.includes('-')) {
    const [a, b] = val.split('-');
    if (type === 'dow') return `${names.dow[+a]} through ${names.dow[+b]}`;
    if (type === 'month') return `${names.month[+a]} through ${names.month[+b]}`;
    return `${a} through ${b}`;
  }
  if (val.includes(',')) {
    const vals = val.split(',');
    if (type === 'dow') return vals.map(v => names.dow[+v]).join(', ');
    return vals.join(', ');
  }
  if (type === 'dow') return names.dow[+val] || val;
  if (type === 'month') return names.month[+val] || val;
  return val;
}

function humanReadable(p) {
  if (!p) return 'Invalid expression';
  const parts = [];
  const minDesc = describeField(p.min, 'minute');
  const hourDesc = describeField(p.hour, 'hour');
  const domDesc = describeField(p.dom, 'day');
  const monthDesc = describeField(p.month, 'month');
  const dowDesc = describeField(p.dow, 'dow');

  if (p.min === '*' && p.hour === '*') parts.push('Every minute');
  else if (p.min.startsWith('*/') && p.hour === '*') parts.push(`Every ${p.min.slice(2)} minutes`);
  else {
    const at = `${p.hour === '*' ? 'every hour' : `${p.hour}:${p.min.padStart(2, '0')}`}`;
    parts.push(`At ${at}`);
  }
  if (dowDesc) parts.push(`on ${dowDesc}`);
  else if (domDesc) parts.push(`on day ${domDesc}`);
  if (monthDesc) parts.push(`in ${monthDesc}`);
  return parts.join(', ');
}

function getNextRuns(p, count = 5) {
  if (!p) return [];
  const results = [];
  const now = new Date();
  let d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  const matchField = (val, n, max) => {
    if (val === '*') return true;
    if (val.includes(',')) return val.split(',').some(v => matchField(v, n, max));
    if (val.startsWith('*/')) {
      const step = +val.slice(2);
      return step > 0 && n % step === 0;
    }
    if (val.includes('-')) { const [a, b] = val.split('-').map(Number); return n >= a && n <= b; }
    return +val === n;
  };

  let iterations = 0;
  while (results.length < count && iterations < 100000) {
    iterations++;
    if (
      matchField(p.month, d.getMonth() + 1, 12) &&
      matchField(p.dom, d.getDate(), 31) &&
      matchField(p.dow, d.getDay(), 6) &&
      matchField(p.hour, d.getHours(), 23) &&
      matchField(p.min, d.getMinutes(), 59)
    ) {
      results.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

export default function CronParser({ copyToClipboard, showToast, sampleData }) {
  const [expr, setExpr] = useState('0 9 * * 1-5');

  // Try Example via sampleData prop
  useEffect(() => { if (sampleData) setExpr(sampleData); }, [sampleData]);

  useEffect(() => {
    const handler = (e) => setExpr(e.detail);
    document.addEventListener('load-sample', handler);
    return () => document.removeEventListener('load-sample', handler);
  }, []);

  const parsed = parseCron(expr);
  const description = humanReadable(parsed);
  const nextRuns = getNextRuns(parsed);
  const fields = parsed ? [
    { label: 'Minute', val: parsed.min, range: '0-59' },
    { label: 'Hour', val: parsed.hour, range: '0-23' },
    { label: 'Day of Month', val: parsed.dom, range: '1-31' },
    { label: 'Month', val: parsed.month, range: '1-12' },
    { label: 'Day of Week', val: parsed.dow, range: '0-6' },
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Cron Expression</span>
          <button className="btn btn-primary btn-sm" onClick={() => { copyToClipboard(expr); showToast('Copied!'); }}>📋 Copy</button>
        </div>
        <div className="pane-body" style={{ gap: 12 }}>
          <input
            className="input-field"
            value={expr}
            onChange={e => setExpr(e.target.value)}
            placeholder="* * * * *"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 20, textAlign: 'center', letterSpacing: 4 }}
            spellCheck={false}
          />
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            MIN &nbsp;&nbsp; HOUR &nbsp;&nbsp; DOM &nbsp;&nbsp; MONTH &nbsp;&nbsp; DOW
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PRESETS.map(p => (
              <button key={p.label} className="btn btn-ghost btn-sm" onClick={() => setExpr(p.value)} title={p.desc}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {parsed ? (
        <>
          <div className="pane">
            <div className="pane-header"><span className="pane-title">Human Readable</span></div>
            <div className="pane-body">
              <div style={{
                fontSize: 20, fontWeight: 700, color: 'var(--accent-purple)',
                padding: '12px 0', textAlign: 'center'
              }}>
                {description}
              </div>
              <div className="stats-row" style={{ marginTop: 8 }}>
                {fields.map(f => (
                  <div className="stat-card" key={f.label}>
                    <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', color: f.val === '*' ? 'var(--text-muted)' : 'var(--accent-cyan)' }}>{f.val}</div>
                    <div className="stat-label">{f.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pane">
            <div className="pane-header"><span className="pane-title">Next 5 Scheduled Runs</span></div>
            <div className="pane-body">
              {nextRuns.length > 0 ? nextRuns.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', borderRadius: 8, marginBottom: 6,
                  background: i === 0 ? 'var(--accent-purple-dim)' : 'var(--bg-primary)',
                  border: `1px solid ${i === 0 ? 'var(--border-glow-purple)' : 'var(--border-primary)'}`,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    {d.toLocaleString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {i === 0 && <span style={{ fontSize: 11, color: 'var(--accent-purple)', fontWeight: 700 }}>NEXT RUN</span>}
                </div>
              )) : <div style={{ color: 'var(--text-muted)', padding: 12 }}>Could not calculate next runs</div>}
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--red)', padding: 24 }}>
          ⚠ Invalid cron expression — must have exactly 5 fields
        </div>
      )}
    </div>
  );
}
