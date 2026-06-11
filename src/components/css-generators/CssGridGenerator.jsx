import React, { useState, useMemo } from 'react';

export default function CssGridGenerator({ copyToClipboard, showToast }) {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(8);
  const [colTemplate, setColTemplate] = useState('');
  const [rowTemplate, setRowTemplate] = useState('');

  const effectiveColTemplate = useMemo(() => {
    const trimmed = colTemplate.trim();
    return trimmed || `repeat(${columns}, 1fr)`;
  }, [colTemplate, columns]);

  const effectiveRowTemplate = useMemo(() => {
    const trimmed = rowTemplate.trim();
    return trimmed || `repeat(${rows}, 1fr)`;
  }, [rowTemplate, rows]);

  const cellCount = useMemo(() => {
    // If custom templates, try to count columns & rows from them
    let colCount = columns;
    let rowCount = rows;

    const trimCol = colTemplate.trim();
    if (trimCol) {
      // Count space-separated values (simplified)
      const repeatMatch = trimCol.match(/^repeat\((\d+),/);
      if (repeatMatch) {
        colCount = parseInt(repeatMatch[1], 10);
      } else {
        colCount = trimCol.split(/\s+/).length;
      }
    }

    const trimRow = rowTemplate.trim();
    if (trimRow) {
      const repeatMatch = trimRow.match(/^repeat\((\d+),/);
      if (repeatMatch) {
        rowCount = parseInt(repeatMatch[1], 10);
      } else {
        rowCount = trimRow.split(/\s+/).length;
      }
    }

    return Math.min(colCount * rowCount, 400); // Cap at 400 to prevent browser crash
  }, [columns, rows, colTemplate, rowTemplate]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: effectiveColTemplate,
    gridTemplateRows: effectiveRowTemplate,
    gap: `${gap}px`,
    minHeight: '300px',
  };

  const cssCode = useMemo(() => {
    return `display: grid;
grid-template-columns: ${effectiveColTemplate};
grid-template-rows: ${effectiveRowTemplate};
gap: ${gap}px;`;
  }, [effectiveColTemplate, effectiveRowTemplate, gap]);

  const handleCopy = () => {
    try {
      copyToClipboard(cssCode);
      showToast('Grid CSS copied!');
    } catch {
      showToast('Failed to copy');
    }
  };

  const cells = useMemo(
    () => Array.from({ length: cellCount }, (_, i) => i + 1),
    [cellCount]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Controls */}
        <div className="controls-panel">
          <h3 className="controls-title">Grid Properties</h3>
          <div className="controls-grid">
            {/* Columns */}
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-text">Columns</span>
                <span className="slider-value">{columns}</span>
              </div>
              <input
                type="range"
                className="slider"
                min="1"
                max="12"
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
              />
            </div>

            {/* Rows */}
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-text">Rows</span>
                <span className="slider-value">{rows}</span>
              </div>
              <input
                type="range"
                className="slider"
                min="1"
                max="12"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
              />
            </div>

            {/* Gap */}
            <div className="slider-group">
              <div className="slider-label">
                <span className="slider-label-text">Gap</span>
                <span className="slider-value">{gap}px</span>
              </div>
              <input
                type="range"
                className="slider"
                min="0"
                max="40"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Template Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div>
              <label className="label">Column Template (custom)</label>
              <input
                type="text"
                className="input-field"
                placeholder={`e.g. 1fr 2fr 1fr`}
                value={colTemplate}
                onChange={(e) => setColTemplate(e.target.value)}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Leave empty to use: repeat({columns}, 1fr)
              </span>
            </div>
            <div>
              <label className="label">Row Template (custom)</label>
              <input
                type="text"
                className="input-field"
                placeholder={`e.g. auto 1fr auto`}
                value={rowTemplate}
                onChange={(e) => setRowTemplate(e.target.value)}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Leave empty to use: repeat({rows}, 1fr)
              </span>
            </div>
          </div>
        </div>

        <div className="split-pane">
          {/* Preview */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Preview</span>
            </div>
            <div className="pane-body">
              <div className="grid-visual" style={gridStyle}>
                {cells.map((num) => (
                  <div key={num} className="grid-cell">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CSS Output */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Generated CSS</span>
              <button className="btn btn-primary btn-sm" onClick={handleCopy}>
                📋 Copy CSS
              </button>
            </div>
            <div className="pane-body">
              <pre className="code-output">{`/* Grid Container */\n${cssCode}`}</pre>
            </div>
          </div>
        </div>
    </div>
  );
}
