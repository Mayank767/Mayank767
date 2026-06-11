import React, { useState, useEffect } from 'react';

export default function UrlEncodeTool({ copyToClipboard, showToast, sampleData }) {
  const [activeTab, setActiveTab] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (sampleData) handleProcess(sampleData, 'encode'); }, [sampleData]);

  const handleProcess = (text, mode) => {
    setInput(text);
    setError('');
    if (!text) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
    } catch (e) {
      setError(mode === 'encode' ? 'Failed to encode input.' : 'Invalid URL-encoded string.');
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
          <span className="pane-title">URL {activeTab === 'encode' ? 'Encoder' : 'Decoder'}</span>
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
            {activeTab === 'encode' ? 'Text to Encode' : 'URL-encoded String to Decode'}
          </label>
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => handleProcess(e.target.value, activeTab)}
            placeholder={activeTab === 'encode' ? 'Enter text to URL-encode...' : 'Enter URL-encoded string to decode...'}
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
