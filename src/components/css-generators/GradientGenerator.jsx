import React, { useState, useMemo } from 'react';

export default function GradientGenerator({ copyToClipboard, showToast }) {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { id: 1, color: '#8b5cf6', position: 0 },
    { id: 2, color: '#06b6d4', position: 100 },
  ]);
  const [nextId, setNextId] = useState(3);

  const updateStop = (id, field, value) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addStop = () => {
    const newPos = 50;
    setStops((prev) => [...prev, { id: nextId, color: '#10b981', position: newPos }]);
    setNextId((n) => n + 1);
  };

  const removeStop = (id) => {
    if (stops.length <= 2) {
      showToast('Minimum 2 color stops required');
      return;
    }
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const sortedStops = useMemo(
    () => [...stops].sort((a, b) => a.position - b.position),
    [stops]
  );

  const stopsStr = useMemo(
    () => sortedStops.map((s) => `${s.color} ${s.position}%`).join(', '),
    [sortedStops]
  );

  const gradientValue = useMemo(() => {
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    }
    return `radial-gradient(circle, ${stopsStr})`;
  }, [type, angle, stopsStr]);

  const cssCode = useMemo(() => {
    if (type === 'linear') {
      return `background: ${gradientValue};
background: -webkit-${gradientValue};
background: -moz-${gradientValue};`;
    }
    return `background: ${gradientValue};
background: -webkit-${gradientValue};
background: -moz-${gradientValue};`;
  }, [type, gradientValue]);

  const handleCopy = () => {
    try {
      copyToClipboard(cssCode);
      showToast('Gradient CSS copied!');
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
              {/* Type */}
              <div>
                <label className="label">Type</label>
                <div className="tab-group">
                  <button
                    className={`tab-btn ${type === 'linear' ? 'active' : ''}`}
                    onClick={() => setType('linear')}
                  >
                    Linear
                  </button>
                  <button
                    className={`tab-btn ${type === 'radial' ? 'active' : ''}`}
                    onClick={() => setType('radial')}
                  >
                    Radial
                  </button>
                </div>
              </div>

              {/* Angle (linear only) */}
              {type === 'linear' && (
                <div className="slider-group">
                  <div className="slider-label">
                    <span className="slider-label-text">Angle</span>
                    <span className="slider-value">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                  />
                </div>
              )}

              {/* Color Stops */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="label" style={{ margin: 0 }}>Color Stops</span>
                  <button className="btn btn-secondary btn-sm" onClick={addStop}>
                    + Add Stop
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'var(--bg-primary)',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-primary)',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, minWidth: '14px' }}>
                        {index + 1}
                      </span>
                      <input
                        type="color"
                        className="color-picker"
                        value={stop.color}
                        onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                        style={{ width: '32px', height: '32px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div className="slider-label" style={{ marginBottom: '4px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {stop.color}
                          </span>
                          <span className="slider-value" style={{ fontSize: '11px' }}>{stop.position}%</span>
                        </div>
                        <input
                          type="range"
                          className="slider"
                          min="0"
                          max="100"
                          value={stop.position}
                          onChange={(e) => updateStop(stop.id, 'position', Number(e.target.value))}
                        />
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeStop(stop.id)}
                        title="Remove stop"
                        style={{ padding: '4px 8px', fontSize: '14px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
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
              {/* Gradient Preview */}
              <div
                style={{
                  width: '100%',
                  minHeight: '260px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  background: gradientValue,
                }}
              />

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
