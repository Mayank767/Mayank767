import React, { useState, useEffect, useRef } from 'react';

const SIZES = [16, 32, 48, 64, 128];

export default function FaviconGenerator({ copyToClipboard, showToast }) {
  const [text, setText] = useState('🚀');
  const [bgColor, setBgColor] = useState('#8b5cf6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [size, setSize] = useState(64);
  const [radius, setRadius] = useState(30);
  const [fontSize, setFontSize] = useState(70);
  const canvasRef = useRef();

  const draw = (canvas, sz) => {
    canvas.width = sz; canvas.height = sz;
    const ctx = canvas.getContext('2d');
    const r = (radius / 100) * sz / 2;
    ctx.clearRect(0, 0, sz, sz);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(sz - r, 0);
    ctx.quadraticCurveTo(sz, 0, sz, r);
    ctx.lineTo(sz, sz - r);
    ctx.quadraticCurveTo(sz, sz, sz - r, sz);
    ctx.lineTo(r, sz);
    ctx.quadraticCurveTo(0, sz, 0, sz - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.font = `bold ${(fontSize / 100) * sz * 0.8}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 2), sz / 2, sz / 2 + 1);
  };

  useEffect(() => {
    if (canvasRef.current) draw(canvasRef.current, size);
  }, [text, bgColor, textColor, size, radius, fontSize]);

  const download = () => {
    const ext = 'png';
    const a = document.createElement('a');
    a.download = `favicon-${size}x${size}.${ext}`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
    showToast(`${size}×${size} favicon downloaded!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Settings</span></div>
          <div className="pane-body" style={{ gap: 16 }}>
            <div>
              <label className="label">Text or Emoji (1-2 chars)</label>
              <input className="input-field" value={text} onChange={e => setText(e.target.value)} maxLength={2}
                style={{ fontSize: 24, textAlign: 'center', fontFamily: 'serif' }} placeholder="🚀" />
            </div>
            <div>
              <label className="label">Size</label>
              <div className="tab-group">
                {SIZES.map(s => (
                  <button key={s} className={`tab-btn ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}px</button>
                ))}
              </div>
            </div>
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-text">Border Radius</span>
                <span className="slider-value">{radius}%</span>
              </div>
              <input type="range" className="slider" min="0" max="50" value={radius} onChange={e => setRadius(Number(e.target.value))} />
            </div>
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-text">Font Size</span>
                <span className="slider-value">{fontSize}%</span>
              </div>
              <input type="range" className="slider" min="30" max="100" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
            </div>
            <div className="split-pane" style={{ gap: 12 }}>
              <div>
                <label className="label">Background</label>
                <div className="color-picker-wrapper">
                  <input type="color" className="color-picker" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{bgColor}</span>
                </div>
              </div>
              <div>
                <label className="label">Text Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" className="color-picker" value={textColor} onChange={e => setTextColor(e.target.value)} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{textColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Preview</span>
            <button className="btn btn-success btn-sm" onClick={download}>⬇ Download PNG</button>
          </div>
          <div className="pane-body" style={{ alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <canvas ref={canvasRef} style={{ imageRendering: 'pixelated', border: '1px solid var(--border-primary)', borderRadius: 4 }} />
            {/* Multi-size preview */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
              {SIZES.map(s => {
                const c = document.createElement('canvas');
                draw(c, s);
                return (
                  <div key={s} style={{ textAlign: 'center' }}>
                    <img src={c.toDataURL()} style={{ width: s, height: s, imageRendering: 'pixelated', border: '1px solid var(--border-primary)', borderRadius: 2 }} alt={`${s}px`} />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{s}px</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
