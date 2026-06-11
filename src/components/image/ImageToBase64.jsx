import React, { useState, useRef } from 'react';

export default function ImageToBase64({ copyToClipboard, showToast }) {
  const [result, setResult] = useState('');
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const processFile = file => {
    if (!file || !file.type.startsWith('image/')) { showToast('Please upload an image', 'error'); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      setResult(e.target.result);
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className={`drop-zone ${dragOver ? 'dragover' : ''}`} onClick={() => fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}>
        <div className="drop-zone-icon">🖼️</div>
        <div className="drop-zone-text">{fileName || 'Drop image here or click to browse'}</div>
        <div className="drop-zone-hint">JPG, PNG, GIF, WebP, SVG supported</div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
      </div>

      {result && (
        <>
          <div className="stats-row">
            <div className="stat-card"><div className="stat-value">{result.length.toLocaleString()}</div><div className="stat-label">Characters</div></div>
            <div className="stat-card"><div className="stat-value">{(result.length * 0.75 / 1024).toFixed(1)} KB</div><div className="stat-label">Approx Size</div></div>
            <div className="stat-card"><div className="stat-value">{result.split(';')[0].split(':')[1]}</div><div className="stat-label">MIME Type</div></div>
          </div>

          <div className="split-pane">
            <div className="pane">
              <div className="pane-header"><span className="pane-title">Preview</span></div>
              <div className="pane-body" style={{ alignItems: 'center' }}>
                <img src={preview} className="image-preview" alt="Preview" />
              </div>
            </div>
            <div className="pane">
              <div className="pane-header">
                <span className="pane-title">Base64 Output</span>
                <div className="btn-group">
                  <button className="btn btn-secondary btn-sm" onClick={() => { copyToClipboard(result); showToast('Full data URI copied!'); }}>Copy Data URI</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { copyToClipboard(result.split(',')[1]); showToast('Base64 string copied!'); }}>Copy Base64</button>
                </div>
              </div>
              <div className="pane-body">
                <div className="code-output" style={{ maxHeight: 300, overflow: 'auto', wordBreak: 'break-all', fontSize: 11 }}>{result}</div>
              </div>
            </div>
          </div>

          <button className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }} onClick={() => { setResult(''); setPreview(''); setFileName(''); }}>✕ Clear</button>
        </>
      )}
    </div>
  );
}
