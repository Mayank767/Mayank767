import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Parses a page range string like "1-3, 5, 7-9" into a sorted, deduped
 * 0-based array of page indices. Returns null on invalid input.
 */
function parsePageRanges(rangeStr, totalPages) {
  const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);
  const indices = new Set();
  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start < 1 || end > totalPages || start > end) return null;
      for (let i = start; i <= end; i++) indices.add(i - 1);
    } else if (singleMatch) {
      const pg = parseInt(singleMatch[1], 10);
      if (pg < 1 || pg > totalPages) return null;
      indices.add(pg - 1);
    } else {
      return null;
    }
  }
  return [...indices].sort((a, b) => a - b);
}

export default function PdfSplit({ copyToClipboard, showToast }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [totalPages, setTotalPages] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const [parsedPages, setParsedPages] = useState(null);
  const [parseError, setParseError] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const fileInputRef = useRef(null);

  const loadFile = useCallback(async (f) => {
    if (!f || !(f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))) {
      showToast('Please upload a valid PDF file.', 'error');
      return;
    }
    try {
      const bytes = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setFile(f);
      setTotalPages(pdfDoc.getPageCount());
      setPageRange('');
      setParsedPages(null);
      setParseError('');
    } catch {
      showToast('Failed to read PDF. It may be corrupted or encrypted.', 'error');
    }
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

  const handleRangeChange = (value) => {
    setPageRange(value);
    if (!value.trim() || totalPages === null) { setParsedPages(null); setParseError(''); return; }
    const result = parsePageRanges(value, totalPages);
    if (result === null) {
      setParsedPages(null);
      setParseError(`Invalid range. Use format like "1-3, 5, 7-9" (pages 1–${totalPages}).`);
    } else {
      setParsedPages(result);
      setParseError('');
    }
  };

  const applyQuickOption = (option) => {
    if (!totalPages) return;
    let range = '';
    if (option === 'first-half') {
      const mid = Math.ceil(totalPages / 2);
      range = `1-${mid}`;
    } else if (option === 'second-half') {
      const mid = Math.ceil(totalPages / 2) + 1;
      range = `${mid}-${totalPages}`;
    } else if (option === 'odd') {
      range = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((n) => n % 2 !== 0).join(', ');
    } else if (option === 'even') {
      range = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((n) => n % 2 === 0).join(', ');
    }
    handleRangeChange(range);
  };

  const splitPdf = async () => {
    if (!file || !parsedPages || parsedPages.length === 0) return;
    setIsSplitting(true);
    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, parsedPages);
      pages.forEach((page) => newDoc.addPage(page));
      const outBytes = await newDoc.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `split_${file.name.replace(/\.pdf$/i, '')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Extracted ${parsedPages.length} page(s) successfully! 🎉`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to split PDF. Please try again.', 'error');
    } finally {
      setIsSplitting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setTotalPages(null);
    setPageRange('');
    setParsedPages(null);
    setParseError('');
  };

  return (
    <div className="pane" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="pane-header">
        <span className="pane-title">✂️ PDF Split</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Extract specific pages from a PDF
        </span>
      </div>
      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Drop Zone */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent-cyan)' : 'var(--border-primary)'}`,
              borderRadius: 12,
              padding: '36px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'rgba(6,182,212,0.06)' : 'var(--bg-elevated)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📤</div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>
              Drop a PDF here or click to browse
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Single PDF file only
            </p>
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
                {formatSize(file.size)} &middot; {totalPages} page{totalPages !== 1 ? 's' : ''}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={reset} style={{ color: 'var(--accent-rose)' }}>
              ✕ Remove
            </button>
          </div>
        )}

        {/* Controls (only after file loaded) */}
        {totalPages && (
          <>
            {/* Quick Options */}
            <div>
              <label className="input-label">⚡ Quick Select</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {[
                  { label: '📖 First Half', key: 'first-half' },
                  { label: '📑 Second Half', key: 'second-half' },
                  { label: '1️⃣ Odd Pages', key: 'odd' },
                  { label: '2️⃣ Even Pages', key: 'even' },
                ].map(({ label, key }) => (
                  <button key={key} className="btn btn-ghost btn-sm" onClick={() => applyQuickOption(key)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Range Input */}
            <div>
              <label className="input-label" htmlFor="page-range-input">
                📄 Page Range <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                  (1–{totalPages})
                </span>
              </label>
              <input
                id="page-range-input"
                className="input-field"
                type="text"
                placeholder={`e.g. 1-3, 5, 7-9`}
                value={pageRange}
                onChange={(e) => handleRangeChange(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', marginTop: 6 }}
              />
              {parseError && (
                <p style={{ color: 'var(--accent-rose)', fontSize: '0.82rem', marginTop: 6 }}>
                  ⚠️ {parseError}
                </p>
              )}
              {parsedPages && parsedPages.length > 0 && !parseError && (
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.82rem', marginTop: 6 }}>
                  ✅ Will extract <strong>{parsedPages.length}</strong> page(s):&nbsp;
                  {parsedPages.slice(0, 20).map((p) => p + 1).join(', ')}
                  {parsedPages.length > 20 ? ` … +${parsedPages.length - 20} more` : ''}
                </p>
              )}
            </div>

            {/* Stats */}
            {parsedPages && parsedPages.length > 0 && (
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value">{totalPages}</div>
                  <div className="stat-label">Total Pages</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                    {parsedPages.length}
                  </div>
                  <div className="stat-label">Pages to Extract</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{totalPages - parsedPages.length}</div>
                  <div className="stat-label">Pages Excluded</div>
                </div>
              </div>
            )}

            {/* Split Button */}
            <button
              className="btn btn-primary"
              onClick={splitPdf}
              disabled={!parsedPages || parsedPages.length === 0 || isSplitting || !!parseError}
              style={{ width: '100%' }}
            >
              {isSplitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', display: 'inline-block'
                  }} />
                  Extracting Pages…
                </span>
              ) : '✂️ Split & Download PDF'}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
