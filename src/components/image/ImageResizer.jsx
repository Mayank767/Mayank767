import React, { useState, useRef } from 'react';

function formatBytes(b) {
  if (!b) return '0 B';
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
}

export default function ImageResizer({ copyToClipboard, showToast }) {
  const [original, setOriginal] = useState(null);
  const [resized, setResized] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState('image/png');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const canvasRef = useRef();

  const processFile = file => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        setOriginal({ src: e.target.result, w: img.width, h: img.height, size: file.size });
        setWidth(String(img.width));
        setHeight(String(img.height));
        setResized(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const onWidthChange = v => {
    setWidth(v);
    if (locked && original) {
      const ratio = original.h / original.w;
      setHeight(String(Math.round(Number(v) * ratio)));
    }
  };

  const onHeightChange = v => {
    setHeight(v);
    if (locked && original) {
      const ratio = original.w / original.h;
      setWidth(String(Math.round(Number(v) * ratio)));
    }
  };

  const resize = () => {
    if (!original) return;
    const w = parseInt(width), h = parseInt(height);
    if (!w || !h || w < 1 || h < 1) { showToast('Enter valid dimensions', 'error'); return; }
    const canvas = canvasRef.current;
    canvas.width = w; canvas.height = h;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        setResized({ src: URL.createObjectURL(blob), size: blob.size, w, h, blob });
      }, format, 0.95);
    };
    img.src = original.src;
  };

  const download = () => {
    if (!resized) return;
    const ext = format.split('/')[1];
    const a = document.createElement('a');
    a.href = resized.src;
    a.download = `resized_${resized.w}x${resized.h}.${ext}`;
    a.click();
    showToast('Image downloaded!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!original ? (
        <div className={`drop-zone ${dragOver ? 'dragover' : ''}`} onClick={() => fileRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}>
          <div className="drop-zone-icon">📏</div>
          <div className="drop-zone-text">Drop image here or click to upload</div>
          <div className="drop-zone-hint">JPG, PNG, WebP, GIF supported</div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
        </div>
      ) : (
        <>
          <div className="controls-panel">
            <div className="controls-title">Resize Settings</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <label className="label">Width (px)</label>
                <input className="input-field" type="number" value={width} onChange={e => onWidthChange(e.target.value)} style={{ width: 110, fontFamily: 'var(--font-mono)' }} />
              </div>
              <button style={{ marginBottom: 2, background: 'none', border: '1px solid var(--border-secondary)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: locked ? 'var(--accent-purple-light)' : 'var(--text-muted)', fontSize: 18 }}
                onClick={() => setLocked(!locked)} title="Lock aspect ratio">
                {locked ? '🔒' : '🔓'}
              </button>
              <div>
                <label className="label">Height (px)</label>
                <input className="input-field" type="number" value={height} onChange={e => onHeightChange(e.target.value)} style={{ width: 110, fontFamily: 'var(--font-mono)' }} />
              </div>
              <div>
                <label className="label">Format</label>
                <select className="select-field" value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
              <div className="btn-group">
                <button className="btn btn-primary" onClick={resize}>Resize</button>
                <button className="btn btn-ghost" onClick={() => { setOriginal(null); setResized(null); }}>✕ Clear</button>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              Original: {original.w} × {original.h}px ({formatBytes(original.size)})
            </div>
          </div>

          <div className="image-compare">
            <div className="pane">
              <div className="pane-header"><span className="pane-title">Original — {original.w}×{original.h}</span></div>
              <div className="pane-body" style={{ alignItems: 'center' }}>
                <img src={original.src} className="image-preview" alt="Original" />
              </div>
            </div>
            <div className="pane">
              <div className="pane-header">
                <span className="pane-title">{resized ? `Resized — ${resized.w}×${resized.h}` : 'Resized (pending)'}</span>
                {resized && <button className="btn btn-success btn-sm" onClick={download}>⬇ Download</button>}
              </div>
              <div className="pane-body" style={{ alignItems: 'center' }}>
                {resized
                  ? <img src={resized.src} className="image-preview" alt="Resized" />
                  : <div style={{ color: 'var(--text-muted)', padding: 40 }}>Click Resize to process</div>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
