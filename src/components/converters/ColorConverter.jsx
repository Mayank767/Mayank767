import React, { useState } from 'react';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

function rgbToCmyk(r, g, b) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rp = r / 255, gp = g / 255, bp = b / 255;
  const k = 1 - Math.max(rp, gp, bp);
  const c = (1 - rp - k) / (1 - k);
  const m = (1 - gp - k) / (1 - k);
  const y = (1 - bp - k) / (1 - k);
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
}

export default function ColorConverter({ copyToClipboard, showToast }) {
  const [hex, setHex] = useState('#8b5cf6');
  const [hexInput, setHexInput] = useState('#8b5cf6');
  const [alpha, setAlpha] = useState(1);

  const applyHex = (h) => {
    const clean = h.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) setHex(clean);
  };

  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = hexToHsl(hex);
  const { c, m, y, k } = rgbToCmyk(r, g, b);

  const vals = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, ${alpha})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'HSLA', value: `hsla(${h}, ${s}%, ${l}%, ${alpha})` },
    { label: 'CMYK', value: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Color Input</span></div>
          <div className="pane-body" style={{ gap: 16 }}>
            <div className="color-swatch-large" style={{ backgroundColor: hex }} />
            <div className="color-picker-wrapper" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div>
                <label className="label">Color Picker</label>
                <input type="color" className="color-picker" value={hex} onChange={e => { setHex(e.target.value); setHexInput(e.target.value); }} style={{ width: 60, height: 50 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">HEX Value</label>
                <input className="input-field" value={hexInput} onChange={e => { setHexInput(e.target.value); applyHex(e.target.value); }}
                  placeholder="#8b5cf6" style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }} />
              </div>
            </div>
            <div>
              <label className="label">Opacity / Alpha — {alpha}</label>
              <input type="range" className="slider" min="0" max="1" step="0.01" value={alpha} onChange={e => setAlpha(Number(e.target.value))} />
            </div>
            {/* Alpha preview */}
            <div style={{ height: 40, borderRadius: 8, border: '1px solid var(--border-primary)',
              background: `linear-gradient(to right, transparent, ${hex}), repeating-conic-gradient(#888 0% 25%, #444 0% 50%) 0 0 / 12px 12px`,
              opacity: 1 }}>
              <div style={{ height: '100%', borderRadius: 8, background: `rgba(${r},${g},${b},${alpha})` }} />
            </div>
          </div>
        </div>
        <div className="pane">
          <div className="pane-header"><span className="pane-title">All Formats</span></div>
          <div className="pane-body" style={{ gap: 10 }}>
            {vals.map(({ label, value }) => (
              <div key={label} className="color-value-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                onClick={() => { copyToClipboard(value); showToast(`${label} copied!`); }}>
                <div>
                  <div className="color-value-label">{label}</div>
                  <div className="color-value-text" style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{value}</div>
                </div>
                <span style={{ fontSize: 16, opacity: 0.5 }}>📋</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
