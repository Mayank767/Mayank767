import React, { useState, useMemo } from 'react';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 255, g: 255, b: 255 };
}

export default function GlassmorphismGen({ copyToClipboard, showToast }) {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.15);
  const [borderRadius, setBorderRadius] = useState(16);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [shadowIntensity, setShadowIntensity] = useState(0.1);
  const [bgColor, setBgColor] = useState('#ffffff');

  const rgb = useMemo(() => hexToRgb(bgColor), [bgColor]);

  const cssCode = useMemo(() => {
    return `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid rgba(255, 255, 255, ${borderOpacity});
box-shadow: 0 8px 32px rgba(0, 0, 0, ${shadowIntensity});`;
  }, [blur, transparency, borderRadius, borderOpacity, shadowIntensity, rgb]);

  const previewStyle = {
    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: `${borderRadius}px`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${shadowIntensity})`,
  };

  const handleCopy = () => {
    try {
      copyToClipboard(cssCode);
      showToast('CSS copied to clipboard!');
    } catch {
      showToast('Failed to copy');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="split-pane">
          {/* Controls */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Controls</span>
            </div>
            <div className="pane-body" style={{ gap: '16px' }}>
              {/* Blur */}
              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-label-text">Blur</span>
                  <span className="slider-value">{blur}px</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="30"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                />
              </div>

              {/* Transparency */}
              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-label-text">Transparency</span>
                  <span className="slider-value">{transparency}</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={transparency}
                  onChange={(e) => setTransparency(Number(e.target.value))}
                />
              </div>

              {/* Border Radius */}
              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-label-text">Border Radius</span>
                  <span className="slider-value">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="50"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                />
              </div>

              {/* Border Opacity */}
              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-label-text">Border Opacity</span>
                  <span className="slider-value">{borderOpacity}</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={borderOpacity}
                  onChange={(e) => setBorderOpacity(Number(e.target.value))}
                />
              </div>

              {/* Shadow Intensity */}
              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-label-text">Shadow Intensity</span>
                  <span className="slider-value">{shadowIntensity}</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={shadowIntensity}
                  onChange={(e) => setShadowIntensity(Number(e.target.value))}
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="label">Background Color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    className="color-picker"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {bgColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview + Output */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Preview</span>
            </div>
            <div className="pane-body" style={{ gap: '16px' }}>
              {/* Live Preview */}
              <div className="preview-container">
                <div className="preview-bg" />
                <div className="preview-card" style={previewStyle}>
                  <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                    Glass Card
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                    This is a glassmorphism effect preview. Adjust the sliders to customize.
                  </p>
                </div>
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
