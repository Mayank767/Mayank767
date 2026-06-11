import React, { useState, useMemo } from 'react';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

const defaultShadow = () => ({
  id: Date.now(),
  hOffset: 4,
  vOffset: 4,
  blur: 10,
  spread: 0,
  color: '#000000',
  opacity: 0.25,
  inset: false,
});

export default function BoxShadowGen({ copyToClipboard, showToast }) {
  const [shadows, setShadows] = useState([defaultShadow()]);

  const updateShadow = (id, field, value) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addShadow = () => {
    setShadows((prev) => [...prev, { ...defaultShadow(), id: Date.now() + Math.random() }]);
  };

  const removeShadow = (id) => {
    if (shadows.length <= 1) {
      showToast('At least one shadow is required');
      return;
    }
    setShadows((prev) => prev.filter((s) => s.id !== id));
  };

  const shadowStrings = useMemo(() => {
    return shadows.map((s) => {
      const rgb = hexToRgb(s.color);
      const insetStr = s.inset ? 'inset ' : '';
      return `${insetStr}${s.hOffset}px ${s.vOffset}px ${s.blur}px ${s.spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${s.opacity})`;
    });
  }, [shadows]);

  const cssValue = useMemo(() => shadowStrings.join(',\n    '), [shadowStrings]);
  const cssCode = useMemo(() => `box-shadow: ${cssValue};`, [cssValue]);

  const handleCopy = () => {
    try {
      copyToClipboard(cssCode);
      showToast('Box shadow CSS copied!');
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
              <span className="pane-title">Shadows</span>
              <button className="btn btn-secondary btn-sm" onClick={addShadow}>
                + Add Shadow
              </button>
            </div>
            <div className="pane-body" style={{ gap: '16px', overflowY: 'auto', maxHeight: '600px' }}>
              {shadows.map((shadow, index) => (
                <div
                  key={shadow.id}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Shadow {index + 1}
                    </span>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeShadow(shadow.id)}
                      style={{ padding: '2px 8px', fontSize: '14px' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* H-Offset */}
                    <div className="slider-group">
                      <div className="slider-label">
                        <span className="slider-label-text">H-Offset</span>
                        <span className="slider-value">{shadow.hOffset}px</span>
                      </div>
                      <input
                        type="range" className="slider" min="-50" max="50"
                        value={shadow.hOffset}
                        onChange={(e) => updateShadow(shadow.id, 'hOffset', Number(e.target.value))}
                      />
                    </div>

                    {/* V-Offset */}
                    <div className="slider-group">
                      <div className="slider-label">
                        <span className="slider-label-text">V-Offset</span>
                        <span className="slider-value">{shadow.vOffset}px</span>
                      </div>
                      <input
                        type="range" className="slider" min="-50" max="50"
                        value={shadow.vOffset}
                        onChange={(e) => updateShadow(shadow.id, 'vOffset', Number(e.target.value))}
                      />
                    </div>

                    {/* Blur */}
                    <div className="slider-group">
                      <div className="slider-label">
                        <span className="slider-label-text">Blur</span>
                        <span className="slider-value">{shadow.blur}px</span>
                      </div>
                      <input
                        type="range" className="slider" min="0" max="100"
                        value={shadow.blur}
                        onChange={(e) => updateShadow(shadow.id, 'blur', Number(e.target.value))}
                      />
                    </div>

                    {/* Spread */}
                    <div className="slider-group">
                      <div className="slider-label">
                        <span className="slider-label-text">Spread</span>
                        <span className="slider-value">{shadow.spread}px</span>
                      </div>
                      <input
                        type="range" className="slider" min="-50" max="50"
                        value={shadow.spread}
                        onChange={(e) => updateShadow(shadow.id, 'spread', Number(e.target.value))}
                      />
                    </div>

                    {/* Opacity */}
                    <div className="slider-group">
                      <div className="slider-label">
                        <span className="slider-label-text">Opacity</span>
                        <span className="slider-value">{shadow.opacity}</span>
                      </div>
                      <input
                        type="range" className="slider" min="0" max="1" step="0.01"
                        value={shadow.opacity}
                        onChange={(e) => updateShadow(shadow.id, 'opacity', Number(e.target.value))}
                      />
                    </div>

                    {/* Color + Inset */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          className="color-picker"
                          value={shadow.color}
                          onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                          style={{ width: '32px', height: '32px' }}
                        />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {shadow.color}
                        </span>
                      </div>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={shadow.inset}
                          onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                        />
                        Inset
                      </label>
                    </div>
                  </div>
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
              {/* Preview */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '280px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    background: 'var(--bg-surface)',
                    borderRadius: '16px',
                    boxShadow: shadowStrings.join(', '),
                    transition: 'box-shadow 0.2s ease',
                  }}
                />
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
