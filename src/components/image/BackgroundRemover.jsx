import { useState, useRef, useCallback, useEffect } from 'react';

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function floodFill(imageData, startX, startY, tolerance) {
  const { width, height, data } = imageData;
  const idx = (y, x) => (y * width + x) * 4;
  const si = idx(startY, startX);
  const sr = data[si], sg = data[si + 1], sb = data[si + 2];

  const visited = new Uint8Array(width * height);
  const stack = [[startX, startY]];
  const removed = new Set();

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    const flatIdx = y * width + x;
    if (visited[flatIdx]) continue;
    visited[flatIdx] = 1;

    const i = idx(y, x);
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a === 0) { removed.add(flatIdx); continue; }

    if (colorDistance(r, g, b, sr, sg, sb) <= tolerance) {
      removed.add(flatIdx);
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }

  // Apply transparency to removed pixels
  removed.forEach((flatIdx) => {
    const i = flatIdx * 4;
    data[i + 3] = 0;
  });
}

export default function BackgroundRemover({ copyToClipboard, showToast }) {
  const [imageSrc, setImageSrc] = useState('');
  const [originalFile, setOriginalFile] = useState(null);
  const [resultSrc, setResultSrc] = useState('');
  const [tolerance, setTolerance] = useState(30);
  const [processing, setProcessing] = useState(false);
  const [pickedColor, setPickedColor] = useState(null);
  const [clickPos, setClickPos] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('upload'); // upload | pick | result

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);

  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setError('');
    setResultSrc('');
    setPickedColor(null);
    setClickPos(null);
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setStep('pick');
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  // Draw image onto canvas once loaded
  const handleImgLoad = useCallback(() => {
    const img = previewRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (step !== 'pick') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] };
    setPickedColor(color);
    setClickPos({ x, y });
    showToast?.(`🎨 Color picked: rgb(${color.r}, ${color.g}, ${color.b})`);
  }, [step, showToast]);

  const handleRemove = useCallback(() => {
    if (!clickPos || !canvasRef.current || !previewRef.current) return;
    setProcessing(true);
    setError('');

    setTimeout(() => {
      try {
        const img = previewRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Tolerance maps 0-100 to 0-441 (max color distance is ~441)
        const mappedTolerance = (tolerance / 100) * 150;
        floodFill(imageData, clickPos.x, clickPos.y, mappedTolerance);

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            setError('Failed to process the image.');
            setProcessing(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          setResultSrc(url);
          setStep('result');
          setProcessing(false);
          showToast?.('✅ Background removed successfully!');
        }, 'image/png');
      } catch (err) {
        setError('Processing failed. Try a different image.');
        setProcessing(false);
      }
    }, 50);
  }, [clickPos, tolerance, showToast]);

  const handleDownload = useCallback(() => {
    if (!resultSrc) return;
    const a = document.createElement('a');
    a.href = resultSrc;
    a.download = 'background-removed.png';
    a.click();
    showToast?.('⬇️ Download started!');
  }, [resultSrc, showToast]);

  const handleReset = () => {
    setImageSrc('');
    setOriginalFile(null);
    setResultSrc('');
    setPickedColor(null);
    setClickPos(null);
    setError('');
    setStep('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const checkerboard = `repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 0 0 / 20px 20px`;

  return (
    <div className="pane" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="pane-header">
        <h2 className="pane-title">✂️ Background Remover</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Click on a background color to remove it — works best on solid-color backgrounds
        </p>
      </div>

      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {['upload', 'pick', 'result'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: step === s ? 'var(--accent-purple)' :
                  ['upload', 'pick', 'result'].indexOf(step) > i ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
                color: step === s || ['upload', 'pick', 'result'].indexOf(step) > i ? '#fff' : 'var(--text-muted)',
                border: `2px solid ${step === s ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
                transition: 'all 0.3s',
              }}>
                {['upload', 'pick', 'result'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '0.8rem',
                color: step === s ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: step === s ? 600 : 400,
                textTransform: 'capitalize',
              }}>
                {s === 'upload' ? 'Upload Image' : s === 'pick' ? 'Pick Background Color' : 'Download Result'}
              </span>
              {i < 2 && <div style={{ width: '24px', height: '2px', background: 'var(--border-primary)', borderRadius: '2px' }} />}
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(251,113,133,0.12)',
            border: '1px solid var(--accent-rose)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: 'var(--accent-rose)',
            fontSize: '0.875rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Upload Zone */}
        {step === 'upload' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'var(--accent-purple-dim)' : 'var(--bg-elevated)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✂️</div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Drop an image here or click to upload
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Works best with solid or near-solid color backgrounds
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Pick step */}
        {(step === 'pick' || step === 'result') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Controls */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              background: 'var(--bg-elevated)',
              borderRadius: '10px',
              padding: '1rem',
              border: '1px solid var(--border-primary)',
            }}>
              <div style={{ flex: '2', minWidth: '200px' }}>
                <label className="input-label">
                  Tolerance: <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{tolerance}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--accent-purple)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Precise</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {pickedColor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: `rgb(${pickedColor.r},${pickedColor.g},${pickedColor.b})`,
                    border: '2px solid var(--border-primary)',
                    flexShrink: 0,
                  }} />
                  <span>Picked color</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {clickPos && step === 'pick' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleRemove}
                    disabled={processing}
                    style={{ minWidth: '140px' }}
                  >
                    {processing ? '⏳ Processing…' : '✂️ Remove Background'}
                  </button>
                )}
                {step === 'result' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleRemove}
                    disabled={processing}
                  >
                    {processing ? '⏳ Re-processing…' : '🔄 Redo'}
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={handleReset}>🗑️ Reset</button>
              </div>
            </div>

            {/* Image canvas area */}
            {step === 'pick' && (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  👆 Click on the background area you want to remove
                  {clickPos && ` — Color picked at (${clickPos.x}, ${clickPos.y})`}
                </p>
                <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border-primary)', cursor: 'crosshair', maxHeight: '420px', overflowY: 'auto' }}>
                  <img
                    ref={previewRef}
                    src={imageSrc}
                    alt="Source"
                    onLoad={handleImgLoad}
                    crossOrigin="anonymous"
                    style={{ display: 'none' }}
                  />
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    style={{ width: '100%', display: 'block' }}
                  />
                  {clickPos && (
                    <div style={{
                      position: 'absolute',
                      top: `${(clickPos.y / (canvasRef.current?.height || 1)) * 100}%`,
                      left: `${(clickPos.x / (canvasRef.current?.width || 1)) * 100}%`,
                      transform: 'translate(-50%,-50%)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '3px solid white',
                      boxShadow: '0 0 0 2px black',
                      pointerEvents: 'none',
                    }} />
                  )}
                </div>
              </div>
            )}

            {/* Result */}
            {step === 'result' && resultSrc && (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  ✅ Background removed! Checkerboard pattern indicates transparency.
                </p>
                <div style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '2px solid var(--accent-cyan)',
                  background: checkerboard,
                  display: 'flex',
                  justifyContent: 'center',
                  maxHeight: '420px',
                }}>
                  <img
                    src={resultSrc}
                    alt="Result"
                    style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setStep('pick')}>
                    ← Try Again
                  </button>
                  <button className="btn btn-primary" onClick={handleDownload}>
                    ⬇️ Download PNG (Transparent)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info note */}
        <div style={{
          background: 'var(--accent-purple-dim)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--accent-purple-light)',
          display: 'flex',
          gap: '0.5rem',
        }}>
          <span>💡</span>
          <span>
            This tool uses flood-fill from your clicked point. It works best on images with solid or nearly-solid backgrounds.
            Adjust the tolerance slider for better results — higher tolerance removes more similar colors.
          </span>
        </div>
      </div>
    </div>
  );
}
