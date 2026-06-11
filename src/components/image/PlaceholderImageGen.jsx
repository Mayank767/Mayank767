import React, { useState, useEffect, useRef } from 'react';

export default function PlaceholderImageGen({ copyToClipboard, showToast }) {
  const [w, setW] = useState(400);
  const [h, setH] = useState(300);
  const [bgColor, setBgColor] = useState('#1a2140');
  const [textColor, setTextColor] = useState('#8b5cf6');
  const [text, setText] = useState('');
  const [font, setFont] = useState(32);
  const canvasRef = useRef();

  const generate = () => {
    const canvas = canvasRef.current;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    // Grid pattern
    ctx.strokeStyle = textColor + '22';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y <= h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    // Cross lines
    ctx.strokeStyle = textColor + '44';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w, 0); ctx.lineTo(0, h); ctx.stroke();
    // Text
    const label = text.trim() || `${w}×${h}`;
    ctx.fillStyle = textColor;
    ctx.font = `bold ${font}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, h / 2);
    // Dimensions
    ctx.font = `${Math.max(12, font * 0.5)}px Inter, Arial, sans-serif`;
    ctx.fillStyle = textColor + 'aa';
    ctx.fillText(`${w} × ${h}`, w / 2, h / 2 + font + 8);
  };

  useEffect(() => { generate(); }, [w, h, bgColor, textColor, text, font]);

  const download = () => {
    const a = document.createElement('a');
    a.download = `placeholder_${w}x${h}.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
    showToast('Image downloaded!');
  };

  const copyDataUri = () => {
    copyToClipboard(canvasRef.current.toDataURL('image/png'));
    showToast('Data URI copied!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Settings</span></div>
          <div className="pane-body" style={{ gap: 16 }}>
            <div className="split-pane" style={{ gap: 12 }}>
              <div>
                <label className="label">Width (px)</label>
                <input className="input-field" type="number" value={w} min="10" max="2000" onChange={e => setW(Number(e.target.value))} style={{ fontFamily: 'var(--font-mono)' }} />
              </div>
              <div>
                <label className="label">Height (px)</label>
                <input className="input-field" type="number" value={h} min="10" max="2000" onChange={e => setH(Number(e.target.value))} style={{ fontFamily: 'var(--font-mono)' }} />
              </div>
            </div>
            <div>
              <label className="label">Custom Text (optional)</label>
              <input className="input-field" value={text} onChange={e => setText(e.target.value)} placeholder="Leave empty for dimensions" />
            </div>
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-text">Font Size</span>
                <span className="slider-value">{font}px</span>
              </div>
              <input type="range" className="slider" min="12" max="80" value={font} onChange={e => setFont(Number(e.target.value))} />
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
            <div className="btn-group">
              <button className="btn btn-success btn-sm" onClick={download}>⬇ PNG</button>
              <button className="btn btn-secondary btn-sm" onClick={copyDataUri}>Copy URI</button>
            </div>
          </div>
          <div className="pane-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, border: '1px solid var(--border-primary)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
