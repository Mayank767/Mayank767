import React, { useState } from 'react';

function generateUUIDv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Manual fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator({ copyToClipboard, showToast }) {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);

  const generate = () => {
    const clamped = Math.min(100, Math.max(1, count || 1));
    const generated = [];
    for (let i = 0; i < clamped; i++) {
      generated.push(generateUUIDv4());
    }
    setUuids(generated);
  };

  const formatUuid = (uuid) => (uppercase ? uuid.toUpperCase() : uuid.toLowerCase());

  const formattedUuids = uuids.map(formatUuid);

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">UUID v4 Generator</span>
        </div>
        <div className="pane-body">
          <div className="controls-grid">
            <div>
              <label className="label">Count (1–100)</label>
              <input
                className="input-field"
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
              />
            </div>
            <div>
              <label className="label">Format</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                  />
                  Uppercase
                </label>
              </div>
            </div>
          </div>
          <div className="btn-group" style={{ marginTop: '0.75rem' }}>
            <button className="btn btn-primary" onClick={generate}>
              Generate
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (formattedUuids.length > 0) {
                  copyToClipboard(formattedUuids.join('\n'));
                  showToast('All UUIDs copied!');
                }
              }}
              disabled={formattedUuids.length === 0}
            >
              Copy All
            </button>
          </div>
        </div>
      </div>

      {formattedUuids.length > 0 && (
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Generated UUIDs ({formattedUuids.length})</span>
          </div>
          <div className="pane-body">
            <div className="code-output" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {formattedUuids.map((uuid, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.25rem 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <code>{uuid}</code>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      copyToClipboard(uuid);
                      showToast('UUID copied!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
