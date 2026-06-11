import React, { useState } from 'react';

const PRESETS = [
  { label: '755', val: '755' }, { label: '644', val: '644' },
  { label: '777', val: '777' }, { label: '600', val: '600' },
  { label: '700', val: '700' }, { label: '664', val: '664' },
];

const PERMS = ['read', 'write', 'execute'];
const GROUPS = ['owner', 'group', 'others'];

function octalToPerms(octal) {
  const str = octal.toString().padStart(3, '0');
  return GROUPS.map((_, gi) => {
    const digit = parseInt(str[gi], 8) || 0;
    return { read: !!(digit & 4), write: !!(digit & 2), execute: !!(digit & 1) };
  });
}

function permsToOctal(perms) {
  return perms.map(p => (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)).join('');
}

function permsToSymbolic(perms) {
  return perms.map(p => `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`).join('');
}

export default function ChmodCalculator({ copyToClipboard, showToast }) {
  const [perms, setPerms] = useState(() => octalToPerms('755'));
  const [octalInput, setOctalInput] = useState('755');

  const toggle = (gi, perm) => {
    setPerms(prev => {
      const next = prev.map((g, i) => i === gi ? { ...g, [perm]: !g[perm] } : g);
      setOctalInput(permsToOctal(next));
      return next;
    });
  };

  const applyOctal = (val) => {
    setOctalInput(val);
    if (/^[0-7]{3}$/.test(val)) setPerms(octalToPerms(val));
  };

  const octal = permsToOctal(perms);
  const symbolic = permsToSymbolic(perms);
  const binary = perms.map(p => `${p.read ? 1 : 0}${p.write ? 1 : 0}${p.execute ? 1 : 0}`).join(' ');
  const chmodCmd = `chmod ${octal} filename`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Output */}
      <div className="stats-row">
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => { copyToClipboard(octal); showToast('Octal copied!'); }}>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: 'var(--accent-purple)' }}>{octal}</div>
          <div className="stat-label">Octal</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => { copyToClipboard(symbolic); showToast('Symbolic copied!'); }}>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--accent-cyan)' }}>{symbolic}</div>
          <div className="stat-label">Symbolic</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => { copyToClipboard(binary); showToast('Binary copied!'); }}>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-emerald)' }}>{binary}</div>
          <div className="stat-label">Binary</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer', gridColumn: 'span 1' }} onClick={() => { copyToClipboard(chmodCmd); showToast('Command copied!'); }}>
          <div className="stat-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{chmodCmd}</div>
          <div className="stat-label">Command</div>
        </div>
      </div>

      {/* Octal input */}
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Enter Octal Directly</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {PRESETS.map(p => (
              <button key={p.label} className="btn btn-ghost btn-sm" onClick={() => applyOctal(p.val)}>{p.label}</button>
            ))}
          </div>
        </div>
        <div className="pane-body">
          <input
            className="input-field"
            value={octalInput}
            onChange={e => applyOctal(e.target.value)}
            placeholder="755"
            maxLength={3}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 20, textAlign: 'center', width: 120 }}
          />
        </div>
      </div>

      {/* Visual checkboxes */}
      <div className="pane">
        <div className="pane-header"><span className="pane-title">Visual Permission Editor</span></div>
        <div className="pane-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontSize: 12 }}></th>
                {PERMS.map(p => (
                  <th key={p} style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </th>
                ))}
                <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-muted)', fontSize: 12 }}>Octal</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group, gi) => (
                <tr key={group} style={{ borderTop: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{group}</td>
                  {PERMS.map(perm => (
                    <td key={perm} style={{ textAlign: 'center', padding: '12px' }}>
                      <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perms[gi][perm]}
                          onChange={() => toggle(gi, perm)}
                          style={{ width: 18, height: 18, accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                        />
                      </label>
                    </td>
                  ))}
                  <td style={{ textAlign: 'center', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--accent-purple)' }}>
                    {(perms[gi].read ? 4 : 0) + (perms[gi].write ? 2 : 0) + (perms[gi].execute ? 1 : 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
