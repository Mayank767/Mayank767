import React, { useState, useMemo } from 'react';

export default function BorderRadiusGen({ copyToClipboard, showToast }) {
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState('px');
  const [corners, setCorners] = useState({
    topLeft: 16,
    topRight: 16,
    bottomRight: 16,
    bottomLeft: 16,
  });

  const maxVal = unit === 'px' ? 100 : 50;

  const setCorner = (key, value) => {
    if (linked) {
      setCorners({
        topLeft: value,
        topRight: value,
        bottomRight: value,
        bottomLeft: value,
      });
    } else {
      setCorners((prev) => ({ ...prev, [key]: value }));
    }
  };

  const borderRadiusValue = useMemo(() => {
    const { topLeft, topRight, bottomRight, bottomLeft } = corners;
    const u = unit;
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `${topLeft}${u}`;
    }
    return `${topLeft}${u} ${topRight}${u} ${bottomRight}${u} ${bottomLeft}${u}`;
  }, [corners, unit]);

  const cssCode = `border-radius: ${borderRadiusValue};`;

  const handleCopy = () => {
    try {
      copyToClipboard(cssCode);
      showToast('Border radius CSS copied!');
    } catch {
      showToast('Failed to copy');
    }
  };

  const cornerEntries = [
    { key: 'topLeft', label: 'Top Left' },
    { key: 'topRight', label: 'Top Right' },
    { key: 'bottomRight', label: 'Bottom Right' },
    { key: 'bottomLeft', label: 'Bottom Left' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="split-pane">
          {/* Controls */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Controls</span>
            </div>
            <div className="pane-body" style={{ gap: '16px' }}>
              {/* Unit toggle + Link toggle */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <label className="label">Unit</label>
                  <div className="tab-group">
                    <button
                      className={`tab-btn ${unit === 'px' ? 'active' : ''}`}
                      onClick={() => setUnit('px')}
                    >
                      px
                    </button>
                    <button
                      className={`tab-btn ${unit === '%' ? 'active' : ''}`}
                      onClick={() => setUnit('%')}
                    >
                      %
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Link Corners</label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={linked}
                      onChange={(e) => setLinked(e.target.checked)}
                    />
                    {linked ? '🔗 Linked' : '🔓 Unlinked'}
                  </label>
                </div>
              </div>

              {/* Corner Sliders */}
              {cornerEntries.map(({ key, label }) => (
                <div className="slider-group" key={key}>
                  <div className="slider-label">
                    <span className="slider-label-text">{label}</span>
                    <span className="slider-value">
                      {corners[key]}{unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    min="0"
                    max={maxVal}
                    value={corners[key]}
                    onChange={(e) => setCorner(key, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview + Output */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Preview</span>
            </div>
            <div className="pane-body" style={{ gap: '16px' }}>
              {/* Preview Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '300px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'var(--gradient-purple-cyan)',
                    borderRadius: borderRadiusValue,
                    transition: 'border-radius 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>
                    {borderRadiusValue}
                  </span>
                </div>
              </div>

              {/* Corner Values Display */}
              <div className="stats-row">
                {cornerEntries.map(({ key, label }) => (
                  <div className="stat-card" key={key}>
                    <div className="stat-value" style={{ fontSize: '18px' }}>
                      {corners[key]}{unit}
                    </div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>

              {/* CSS Output */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="label" style={{ margin: 0 }}>Generated CSS</span>
                  <button className="btn btn-primary btn-sm" onClick={handleCopy}>
                    📋 Copy CSS
                  </button>
                </div>
                <pre className="code-output">{cssCode}</pre>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
