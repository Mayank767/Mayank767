import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGenerator({ copyToClipboard, showToast }) {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#0a0e1a');
  const [error, setError] = useState('');
  const canvasRef = useRef();

  useEffect(() => {
    if (!text.trim()) { setError('Enter text or URL'); return; }
    setError('');
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      color: { dark: fgColor, light: bgColor },
      margin: 2,
      errorCorrectionLevel: 'H',
    }).catch(e => setError(e.message));
  }, [text, size, fgColor, bgColor]);

  const download = () => {
    const a = document.createElement('a');
    a.download = 'qrcode.png';
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
    showToast('QR Code downloaded!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Settings</span></div>
          <div className="pane-body" style={{ gap: 16 }}>
            <div>
              <label className="label">Text or URL</label>
              <textarea className="textarea-code" style={{ minHeight: 100 }} value={text} onChange={e => setText(e.target.value)} placeholder="Enter text or URL..." />
            </div>
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-text">Size</span>
                <span className="slider-value">{size}px</span>
              </div>
              <input type="range" className="slider" min="100" max="500" step="10" value={size} onChange={e => setSize(Number(e.target.value))} />
            </div>
            <div className="color-picker-wrapper" style={{ flexWrap: 'wrap', gap: 16 }}>
              <div>
                <label className="label">Foreground (Dark)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" className="color-picker" value={fgColor} onChange={e => setFgColor(e.target.value)} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="label">Background (Light)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" className="color-picker" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{bgColor}</span>
                </div>
              </div>
            </div>
            {error && <div style={{ color: 'var(--accent-rose)', fontSize: 13 }}>⚠️ {error}</div>}
          </div>
        </div>
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">QR Code Preview</span>
            <button className="btn btn-success btn-sm" onClick={download} disabled={!!error}>⬇ Download PNG</button>
          </div>
          <div className="pane-body qr-output">
            <canvas ref={canvasRef} style={{ borderRadius: 8, maxWidth: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
