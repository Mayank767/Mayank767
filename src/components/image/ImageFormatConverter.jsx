import { useState, useRef, useCallback } from 'react';

const FORMAT_OPTIONS = [
  { value: 'jpeg', label: 'JPEG', mime: 'image/jpeg', ext: 'jpg' },
  { value: 'png', label: 'PNG', mime: 'image/png', ext: 'png' },
  { value: 'webp', label: 'WebP', mime: 'image/webp', ext: 'webp' },
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'];

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function detectFormat(file) {
  const map = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/gif': 'GIF',
    'image/bmp': 'BMP',
    'image/svg+xml': 'SVG',
  };
  return map[file.type] || file.type.split('/')[1]?.toUpperCase() || 'Unknown';
}

export default function ImageFormatConverter({ copyToClipboard, showToast }) {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalSrc, setOriginalSrc] = useState('');
  const [convertedSrc, setConvertedSrc] = useState('');
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [targetFormat, setTargetFormat] = useState('webp');
  const [quality, setQuality] = useState(90);
  const [converting, setConverting] = useState(false);
  const [stats, setStats] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const loadFile = useCallback((file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload JPEG, PNG, WebP, GIF, BMP, or SVG.');
      return;
    }
    setError('');
    setConvertedSrc('');
    setConvertedBlob(null);
    setStats(null);
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);
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

  const handleConvert = useCallback(() => {
    if (!imgRef.current || !originalFile) return;
    setConverting(true);
    setError('');

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (targetFormat === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Conversion failed. Your browser may not support this format.');
          setConverting(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        setConvertedSrc(url);
        setConvertedBlob(blob);

        const reduction = ((1 - blob.size / originalFile.size) * 100).toFixed(1);
        setStats({
          originalFormat: detectFormat(originalFile),
          originalSize: originalFile.size,
          convertedSize: blob.size,
          reduction: parseFloat(reduction),
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        setConverting(false);
        showToast?.('✅ Image converted successfully!');
      },
      `image/${targetFormat}`,
      quality / 100
    );
  }, [originalFile, targetFormat, quality, showToast]);

  const handleDownload = useCallback(() => {
    if (!convertedBlob) return;
    const fmt = FORMAT_OPTIONS.find((f) => f.value === targetFormat);
    const a = document.createElement('a');
    a.href = convertedSrc;
    a.download = `converted-image.${fmt?.ext || targetFormat}`;
    a.click();
    showToast?.('⬇️ Download started!');
  }, [convertedBlob, convertedSrc, targetFormat, showToast]);

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalSrc('');
    setConvertedSrc('');
    setConvertedBlob(null);
    setStats(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const supportsQuality = targetFormat === 'jpeg' || targetFormat === 'webp';

  return (
    <div className="pane" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="pane-header">
        <h2 className="pane-title">🖼️ Image Format Converter</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Convert images between JPEG, PNG, and WebP — fully client-side
        </p>
      </div>

      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Upload Zone */}
        {!originalFile && (
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
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📁</div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Drop an image here or click to upload
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Supports JPEG, PNG, WebP, GIF, BMP, SVG
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(251, 113, 133, 0.12)',
            border: '1px solid var(--accent-rose)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: 'var(--accent-rose)',
            fontSize: '0.875rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {originalFile && (
          <>
            {/* Settings Row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1', minWidth: '160px' }}>
                <label className="input-label">Target Format</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {FORMAT_OPTIONS.map((fmt) => (
                    <button
                      key={fmt.value}
                      className={`btn btn-sm ${targetFormat === fmt.value ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setTargetFormat(fmt.value)}
                      style={{ flex: 1 }}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {supportsQuality && (
                <div style={{ flex: '2', minWidth: '200px' }}>
                  <label className="input-label">
                    Quality: <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{quality}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    style={{
                      width: '100%',
                      marginTop: '0.5rem',
                      accentColor: 'var(--accent-purple)',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>10% (small)</span>
                    <span>100% (lossless)</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleConvert}
                  disabled={converting}
                  style={{ minWidth: '120px' }}
                >
                  {converting ? '⏳ Converting…' : '⚡ Convert'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                  🗑️ Reset
                </button>
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="stats-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div className="stat-card">
                  <div className="stat-value">{stats.originalFormat}</div>
                  <div className="stat-label">Original Format</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatBytes(stats.originalSize)}</div>
                  <div className="stat-label">Original Size</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatBytes(stats.convertedSize)}</div>
                  <div className="stat-label">Converted Size</div>
                </div>
                <div className="stat-card">
                  <div
                    className="stat-value"
                    style={{ color: stats.reduction >= 0 ? 'var(--accent-cyan)' : 'var(--accent-rose)' }}
                  >
                    {stats.reduction >= 0 ? '▼' : '▲'} {Math.abs(stats.reduction)}%
                  </div>
                  <div className="stat-label">Size Change</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.width} × {stats.height}</div>
                  <div className="stat-label">Dimensions</div>
                </div>
              </div>
            )}

            {/* Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Original */}
              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid var(--border-primary)',
              }}>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border-primary)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                }}>
                  📌 Original — {detectFormat(originalFile)} — {formatBytes(originalFile.size)}
                </div>
                <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', minHeight: '180px', alignItems: 'center' }}>
                  <img
                    ref={imgRef}
                    src={originalSrc}
                    alt="Original"
                    crossOrigin="anonymous"
                    style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '6px' }}
                  />
                </div>
              </div>

              {/* Converted */}
              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: `1px solid ${convertedSrc ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
              }}>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border-primary)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>✨ Converted — {FORMAT_OPTIONS.find(f => f.value === targetFormat)?.label}</span>
                  {convertedSrc && (
                    <button className="btn btn-primary btn-sm" onClick={handleDownload} style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
                      ⬇️ Download
                    </button>
                  )}
                </div>
                <div style={{
                  padding: '0.75rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '180px',
                  backgroundImage: convertedSrc && targetFormat === 'png'
                    ? 'repeating-conic-gradient(#aaa 0% 25%, transparent 0% 50%) 0 0 / 20px 20px'
                    : 'none',
                }}>
                  {convertedSrc ? (
                    <img
                      src={convertedSrc}
                      alt="Converted"
                      style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '6px' }}
                    />
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                      Click <strong>⚡ Convert</strong> to see the result
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Download CTA */}
            {convertedSrc && (
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  if (convertedSrc) {
                    copyToClipboard?.(convertedSrc);
                    showToast?.('📋 Image URL copied to clipboard!');
                  }
                }}>
                  📋 Copy URL
                </button>
                <button className="btn btn-primary" onClick={handleDownload}>
                  ⬇️ Download Converted Image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
