import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
}

export default function ImageCompressor({ copyToClipboard, showToast }) {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState('image/webp');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    let script = document.getElementById('faq-schema-image');
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-schema-image';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are my images uploaded to a server?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Our Image Compressor runs entirely in your browser using local JavaScript. Your files never leave your device, ensuring 100% privacy and blazing fast speeds."
          }
        },
        {
          "@type": "Question",
          "name": "What image formats are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We support all modern web formats including JPEG, PNG, WebP, AVIF, BMP, and GIF. You can also convert your images between these formats."
          }
        },
        {
          "@type": "Question",
          "name": "How does this compare to TinyPNG or Squoosh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlike TinyPNG which requires uploading files to their servers, our tool processes everything locally. It uses similar compression algorithms (like browser-native WebP/JPEG encoding) giving you comparable quality without the upload wait time or file size limits."
          }
        }
      ]
    });

    return () => {
      const existingScript = document.getElementById('faq-schema-image');
      if (existingScript) existingScript.remove();
    };
  }, []);

  const processFile = file => {
    if (!file || !file.type.startsWith('image/')) { showToast('Please upload an image file', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      setOriginal({ src: e.target.result, size: file.size, name: file.name, file: file });
      setCompressed(null);
    };
    reader.readAsDataURL(file);
  };

  const compress = async () => {
    if (!original || !original.file) return;
    setLoading(true);
    
    try {
      if (format === 'image/png') {
        showToast('Tip: PNGs are lossless. For maximum compression, switch to WebP or JPEG.', 'info');
      }

      const options = {
        maxSizeMB: (quality * 3) + 0.1, // Scale size roughly with quality slider
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: format,
        initialQuality: quality
      };
      
      const compressedFile = await imageCompression(original.file, options);
      const url = URL.createObjectURL(compressedFile);
      setCompressed({ src: url, size: compressedFile.size, blob: compressedFile, format });
    } catch (error) {
      console.error(error);
      showToast('Failed to compress. The image might already be fully optimized.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!compressed) return;
    const ext = format.split('/')[1];
    const a = document.createElement('a');
    a.href = compressed.src;
    a.download = `compressed.${ext}`;
    a.click();
    showToast('Image downloaded!');
  };

  const saved = original && compressed ? Math.round((1 - compressed.size / original.size) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ padding: '12px 16px', background: 'var(--accent-emerald-dim)', border: '1px solid var(--accent-emerald)', borderRadius: 'var(--radius-sm)', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <span style={{ fontSize: '18px' }}>🔒</span>
        <span><strong>100% Private Client-Side Compression:</strong> Your files are processed entirely in your web browser and are <em>never</em> uploaded to any server.</span>
      </div>

      {!original ? (
        <div
          className={`drop-zone ${dragOver ? 'dragover' : ''}`}
          onClick={() => fileRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
        >
          <div className="drop-zone-icon">🖼️</div>
          <div className="drop-zone-text">Drop an image here or click to browse</div>
          <div className="drop-zone-hint">Supports PNG, JPEG, WebP, AVIF, GIF, BMP</div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
        </div>
      ) : (
        <>
          <div className="controls-panel">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div className="slider-label">
                  <span className="slider-label-text">Quality</span>
                  <span className="slider-value">{Math.round(quality * 100)}%</span>
                </div>
                <input type="range" className="slider" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Output Format</label>
                <select className="select-field" value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="image/webp">WebP</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                </select>
              </div>
              <div className="btn-group">
                <button className="btn btn-primary" onClick={compress} disabled={loading}>
                  {loading ? '⏳ Compressing...' : '🗜️ Compress'}
                </button>
                <button className="btn btn-ghost" onClick={() => { setOriginal(null); setCompressed(null); }}>✕ Clear</button>
              </div>
            </div>
          </div>

          {original && compressed && (
            <div className="stats-row">
              <div className="stat-card"><div className="stat-value">{formatBytes(original.size)}</div><div className="stat-label">Original</div></div>
              <div className="stat-card"><div className="stat-value">{formatBytes(compressed.size)}</div><div className="stat-label">Compressed</div></div>
              <div className="stat-card"><div className="stat-value" style={{ color: saved > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{saved > 0 ? '-' : '+'}{Math.abs(saved)}%</div><div className="stat-label">Size Change</div></div>
            </div>
          )}

          <div className="image-compare">
            <div className="pane">
              <div className="pane-header"><span className="pane-title">Original — {formatBytes(original.size)}</span></div>
              <div className="pane-body" style={{ alignItems: 'center' }}>
                <img src={original.src} className="image-preview" alt="Original" />
              </div>
            </div>
            <div className="pane">
              <div className="pane-header">
                <span className="pane-title">Compressed {compressed ? `— ${formatBytes(compressed.size)}` : '— Not yet'}</span>
                {compressed && <button className="btn btn-success btn-sm" onClick={download}>⬇ Download</button>}
              </div>
              <div className="pane-body" style={{ alignItems: 'center' }}>
                {compressed
                  ? <img src={compressed.src} className="image-preview" alt="Compressed" />
                  : <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Press Compress to process</div>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* SEO & Info Section */}
      <div className="seo-content" style={{ marginTop: '20px', padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px', fontSize: '1.5rem' }}>Image Compressor FAQs & Details</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.1rem' }}>Are my images uploaded to a server?</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>No. Our Image Compressor runs entirely in your browser using local JavaScript and Web Workers. Your files <strong>never leave your device</strong>, ensuring complete privacy, zero upload wait times, and zero data limits.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.1rem' }}>What image formats are supported?</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>We support modern web formats including <strong>JPEG, PNG, WebP, AVIF, BMP, and GIF</strong>. You can easily compress images and convert them to next-gen formats like WebP to dramatically improve your website's load speed.</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.1rem' }}>How does this compare to TinyPNG or Squoosh?</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>Unlike server-based tools like TinyPNG which require uploading files over the internet, our tool processes everything locally on your machine. It utilizes browser-native encoding to achieve comparable quality compression instantly, without any file size limits or paywalls.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
