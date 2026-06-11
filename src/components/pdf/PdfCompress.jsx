import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function calcSaving(original, compressed) {
  if (!original || !compressed) return null;
  const diff = original - compressed;
  const pct = ((diff / original) * 100).toFixed(1);
  return { diff, pct, saved: diff > 0 };
}

const QUALITY_MODES = [
  {
    id: 'screen',
    label: '📺 Screen (72 DPI)',
    desc: 'Smallest file · Web & email sharing',
    removeMetadata: true,
    removeThumbnails: true,
    removeJS: true,
    objectStreams: true,
  },
  {
    id: 'ebook',
    label: '📚 Ebook (150 DPI)',
    desc: 'Balanced size & quality · eReaders',
    removeMetadata: true,
    removeThumbnails: true,
    removeJS: false,
    objectStreams: true,
  },
  {
    id: 'print',
    label: '🖨️ Print (300 DPI)',
    desc: 'Larger file · Preserve print quality',
    removeMetadata: true,
    removeThumbnails: false,
    removeJS: false,
    objectStreams: true,
  },
];

export default function PdfCompress({ copyToClipboard, showToast }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMode, setSelectedMode] = useState('screen');
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState(null); // { blob, size }
  const fileInputRef = useRef(null);

  const loadFile = useCallback(async (f) => {
    if (!(f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
      showToast('Please upload a valid PDF file.', 'error');
      return;
    }
    setFile(f);
    setResult(null);
  }, [showToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
    e.target.value = '';
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsCompressing(true);
    setResult(null);
    const mode = QUALITY_MODES.find((m) => m.id === selectedMode);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, {
        updateMetadata: false,
        ignoreEncryption: true,
      });

      // Remove metadata
      if (mode.removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      // Remove JavaScript actions from the catalog (best-effort)
      if (mode.removeJS) {
        try {
          const catalog = pdfDoc.catalog;
          if (catalog.has('AA')) catalog.delete('AA');
          if (catalog.has('JS')) catalog.delete('JS');
          if (catalog.has('OpenAction')) catalog.delete('OpenAction');
        } catch { /* ignore if not available */ }
      }

      // Remove embedded thumbnails from each page
      if (mode.removeThumbnails) {
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          try {
            const dict = page.node;
            if (dict.has('Thumb')) dict.delete('Thumb');
          } catch { /* ignore */ }
        });
      }

      const outBytes = await pdfDoc.save({
        useObjectStreams: mode.objectStreams,
        addDefaultPage: false,
      });

      const blob = new Blob([outBytes], { type: 'application/pdf' });
      setResult({ blob, size: outBytes.byteLength });
      showToast('PDF compressed successfully! 🎉', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to compress PDF. It may be encrypted.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download started!', 'success');
  };

  const reset = () => { setFile(null); setResult(null); };
  const saving = file ? calcSaving(file.size, result?.size) : null;

  return (
    <div className="pane" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="pane-header">
        <span className="pane-title">🗜️ PDF Compress</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Reduce PDF file size
        </span>
      </div>
      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Note Banner */}
        <div style={{
          background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.25)',
          borderRadius: 8,
          padding: '10px 14px',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>💡</span>
          <p style={{ color: 'var(--accent-amber)', fontSize: '0.83rem', margin: 0, lineHeight: 1.5 }}>
            Best results on PDFs with metadata. Image-heavy PDFs may not compress significantly since
            true DPI re-encoding requires server-side processing.
          </p>
        </div>

        {/* Drop Zone */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
              borderRadius: 12,
              padding: '36px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'var(--accent-purple-dim)' : 'var(--bg-elevated)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📤</div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>
              Drop a PDF here or click to browse
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Single PDF file</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-secondary)',
            borderRadius: 10,
            padding: '12px 16px',
          }}>
            <span style={{ fontSize: '1.6rem' }}>📄</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {file.name}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>
                Original size: <strong>{formatSize(file.size)}</strong>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={reset} style={{ color: 'var(--accent-rose)' }}>
              ✕ Remove
            </button>
          </div>
        )}

        {/* Quality Mode Selector */}
        {file && (
          <div>
            <label className="input-label">🎚️ Compression Profile</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {QUALITY_MODES.map((mode) => (
                <label
                  key={mode.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: selectedMode === mode.id ? 'var(--accent-purple-dim)' : 'var(--bg-elevated)',
                    border: `1.5px solid ${selectedMode === mode.id ? 'var(--accent-purple)' : 'var(--border-secondary)'}`,
                    borderRadius: 9,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="radio"
                    name="quality-mode"
                    value={mode.id}
                    checked={selectedMode === mode.id}
                    onChange={() => { setSelectedMode(mode.id); setResult(null); }}
                    style={{ accentColor: 'var(--accent-purple)', width: 16, height: 16, flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {mode.label}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>
                      {mode.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && saving && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{formatSize(file.size)}</div>
              <div className="stat-label">Original Size</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: saving.saved ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
                {formatSize(result.size)}
              </div>
              <div className="stat-label">Compressed Size</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: saving.saved ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                {saving.saved ? `-${saving.pct}%` : `+${Math.abs(saving.pct)}%`}
              </div>
              <div className="stat-label">{saving.saved ? 'Space Saved' : 'Size Increase'}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {file && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={compressPdf}
              disabled={isCompressing}
              style={{ flex: 1, minWidth: 140 }}
            >
              {isCompressing ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', display: 'inline-block'
                  }} />
                  Compressing…
                </span>
              ) : '🗜️ Compress PDF'}
            </button>

            {result && (
              <button
                className="btn btn-secondary"
                onClick={downloadResult}
                style={{ flex: 1, minWidth: 140 }}
              >
                ⬇️ Download Compressed PDF
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
