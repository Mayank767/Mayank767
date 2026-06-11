import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfMerge({ copyToClipboard, showToast }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState(null);
  const [mergedSize, setMergedSize] = useState(null);
  const fileInputRef = useRef(null);

  const addFiles = useCallback((newFiles) => {
    const pdfFiles = Array.from(newFiles).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (pdfFiles.length === 0) {
      showToast('Please upload valid PDF files.', 'error');
      return;
    }
    setFiles((prev) => [...prev, ...pdfFiles]);
    setMergedBlob(null);
    setMergedSize(null);
  }, [showToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedBlob(null);
    setMergedSize(null);
  };

  const moveFile = (index, direction) => {
    setFiles((prev) => {
      const arr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
    setMergedBlob(null);
    setMergedSize(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      showToast('Add at least 2 PDF files to merge.', 'error');
      return;
    }
    setIsMerging(true);
    setMergedBlob(null);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let src;
        try {
          src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        } catch {
          showToast(`Could not read "${file.name}". It may be encrypted.`, 'error');
          setIsMerging(false);
          return;
        }
        const pages = await pdfDoc.copyPages(src, src.getPageIndices());
        pages.forEach((page) => pdfDoc.addPage(page));
      }
      const mergedBytes = await pdfDoc.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setMergedBlob(blob);
      setMergedSize(mergedBytes.byteLength);
      showToast('PDFs merged successfully! 🎉', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to merge PDFs. Please check your files.', 'error');
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download started!', 'success');
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="pane" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="pane-header">
        <span className="pane-title">📄 PDF Merge</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Combine multiple PDFs into one
        </span>
      </div>
      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent-purple)' : 'var(--border-primary)'}`,
            borderRadius: 12,
            padding: '32px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? 'var(--accent-purple-dim)' : 'var(--bg-elevated)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📂</div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>
            Drop PDFs here or click to browse
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            You can add multiple PDFs at once
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                📋 Files ({files.length}) — Total: {formatSize(totalSize)}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => { setFiles([]); setMergedBlob(null); }}>
                🗑 Clear All
              </button>
            </div>

            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  transition: 'border-color 0.15s',
                }}
              >
                <span style={{ color: 'var(--accent-rose)', fontSize: '1.2rem' }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '0.9rem',
                  }}>
                    {file.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {formatSize(file.size)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => moveFile(index, -1)}
                    disabled={index === 0}
                    title="Move Up"
                    style={{ padding: '3px 8px', opacity: index === 0 ? 0.35 : 1 }}
                  >
                    ▲
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => moveFile(index, 1)}
                    disabled={index === files.length - 1}
                    title="Move Down"
                    style={{ padding: '3px 8px', opacity: index === files.length - 1 ? 0.35 : 1 }}
                  >
                    ▼
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeFile(index)}
                    title="Remove"
                    style={{ padding: '3px 8px', color: 'var(--accent-rose)' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Row */}
        {mergedSize && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{files.length}</div>
              <div className="stat-label">Files Merged</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatSize(totalSize)}</div>
              <div className="stat-label">Combined Input</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
                {formatSize(mergedSize)}
              </div>
              <div className="stat-label">Output Size</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={mergePdfs}
            disabled={files.length < 2 || isMerging}
            style={{ flex: 1, minWidth: 140, position: 'relative' }}
          >
            {isMerging ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span className="spinner" style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block'
                }} />
                Merging…
              </span>
            ) : '🔗 Merge PDFs'}
          </button>

          {mergedBlob && (
            <button
              className="btn btn-secondary"
              onClick={downloadMerged}
              style={{ flex: 1, minWidth: 140 }}
            >
              ⬇️ Download Merged PDF
            </button>
          )}
        </div>

        {files.length < 2 && files.length > 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', textAlign: 'center' }}>
            ℹ️ Add at least one more PDF to enable merging.
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
