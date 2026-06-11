import React, { useState, useEffect } from 'react';

export default function Base64Tool({ copyToClipboard, showToast, sampleData }) {
  const [activeTab, setActiveTab] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Try Example
  useEffect(() => {
    if (sampleData) handleProcess(sampleData, 'encode');
  }, [sampleData]);

  const handleProcess = (text, mode) => {
    setInput(text);
    setError('');
    if (!text) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        // Handle Unicode by encoding to URI components first
        const encoded = btoa(
          encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
          )
        );
        setOutput(encoded);
      } else {
        // Decode base64 then handle Unicode
        const decoded = decodeURIComponent(
          Array.from(atob(text), (c) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join('')
        );
        setOutput(decoded);
      }
    } catch (e) {
      setError(mode === 'encode' ? 'Failed to encode input.' : 'Invalid Base64 string.');
      setOutput('');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Base64 {activeTab === 'encode' ? 'Encoder' : 'Decoder'}</span>
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === 'encode' ? 'active' : ''}`}
              onClick={() => handleTabChange('encode')}
            >
              Encode
            </button>
            <button
              className={`tab-btn ${activeTab === 'decode' ? 'active' : ''}`}
              onClick={() => handleTabChange('decode')}
            >
              Decode
            </button>
          </div>
        </div>
        <div className="pane-body">
          <label className="label">
            {activeTab === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => handleProcess(e.target.value, activeTab)}
            placeholder={activeTab === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            rows={6}
          />
        </div>
      </div>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Output</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (output) {
                copyToClipboard(output);
                showToast('Copied to clipboard!');
              }
            }}
            disabled={!output}
          >
            Copy
          </button>
        </div>
        <div className="pane-body">
          {error && <div style={{ color: 'var(--red)', marginBottom: '0.5rem' }}>{error}</div>}
          <textarea
            className="textarea-code"
            value={output}
            readOnly
            placeholder="Output will appear here..."
            rows={6}
          />
        </div>
      </div>
    </div>
  );
}
