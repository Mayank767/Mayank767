import React, { useState, useCallback } from 'react';

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generate(length, opts) {
  let chars = '';
  if (opts.upper) chars += SETS.upper;
  if (opts.lower) chars += SETS.lower;
  if (opts.numbers) chars += SETS.numbers;
  if (opts.symbols) chars += SETS.symbols;
  if (!chars) return '';
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(n => chars[n % chars.length]).join('');
}

function strength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 20) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'Weak', cls: 'strength-weak' };
  if (score <= 4) return { label: 'Fair', cls: 'strength-fair' };
  if (score <= 5) return { label: 'Good', cls: 'strength-good' };
  return { label: 'Strong', cls: 'strength-strong' };
}

export default function PasswordGenerator({ copyToClipboard, showToast }) {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false });
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState([]);

  const gen = useCallback(() => {
    const pws = Array.from({ length: count }, () => generate(length, opts));
    setPasswords(pws);
  }, [length, opts, count]);

  const toggleOpt = k => setOpts(o => ({ ...o, [k]: !o[k] }));
  const sw = strength(passwords[0] || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="controls-panel">
        <div className="controls-title">Generator Settings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="slider-group">
            <div className="slider-label">
              <span className="slider-label-text">Password Length</span>
              <span className="slider-value">{length} chars</span>
            </div>
            <input type="range" className="slider" min="4" max="128" value={length} onChange={e => setLength(Number(e.target.value))} />
          </div>
          <div className="slider-group">
            <div className="slider-label">
              <span className="slider-label-text">Number of Passwords</span>
              <span className="slider-value">{count}</span>
            </div>
            <input type="range" className="slider" min="1" max="20" value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Character Sets</label>
            <div className="checkbox-group">
              {[['upper', 'ABC Uppercase'], ['lower', 'abc Lowercase'], ['numbers', '123 Numbers'], ['symbols', '!@# Symbols']].map(([k, lbl]) => (
                <label key={k} className="checkbox-label">
                  <input type="checkbox" checked={opts[k]} onChange={() => toggleOpt(k)} />
                  {lbl}
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={gen} style={{ width: 'fit-content' }}>🎲 Generate</button>
        </div>
      </div>

      {passwords.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {passwords.map((pw, i) => {
            const s = strength(pw);
            return (
              <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <div className="password-display" style={{ marginBottom: 10, textAlign: 'left', letterSpacing: 1 }}>{pw}</div>
                <div className="strength-bar" style={{ marginBottom: 8 }}>
                  <div className={`strength-fill ${s.cls}`} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Strength: <strong style={{ color: 'var(--text-primary)' }}>{s.label}</strong> — {pw.length} chars</span>
                  <button className="btn btn-secondary btn-sm" onClick={() => { copyToClipboard(pw); showToast('Password copied!'); }}>Copy</button>
                </div>
              </div>
            );
          })}
          {passwords.length > 1 && (
            <button className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }} onClick={() => { copyToClipboard(passwords.join('\n')); showToast('All passwords copied!'); }}>Copy All</button>
          )}
        </div>
      )}
    </div>
  );
}
