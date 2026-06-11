import React, { useState, useEffect } from 'react';

export default function JsonFormatter({ copyToClipboard, showToast, sampleData }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (sampleData) { setInput(sampleData); parseJson(sampleData); } }, [sampleData]);

  const parseJson = (text) => {
    try {
      const parsed = JSON.parse(text);
      setError('');
      return parsed;
    } catch (e) {
      const msg = e.message;
      const posMatch = msg.match(/position\s+(\d+)/i);
      let info = msg;
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const lines = text.substring(0, pos).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        info = `${msg} (Line ${line}, Column ${col})`;
      }
      setError(info);
      return null;
    }
  };

  const handleBeautify = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    const parsed = parseJson(input);
    if (parsed !== null) {
      setOutput(JSON.stringify(parsed, null, 2));
    } else {
      setOutput('');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    const parsed = parseJson(input);
    if (parsed !== null) {
      setOutput(JSON.stringify(parsed));
    } else {
      setOutput('');
    }
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setError('');
      setOutput('');
      showToast('Please enter some JSON to validate');
      return;
    }
    const parsed = parseJson(input);
    if (parsed !== null) {
      setError('');
      setOutput('');
      showToast('✅ Valid JSON!');
    }
  };

  const handleCopy = () => {
    if (!output) {
      showToast('Nothing to copy');
      return;
    }
    copyToClipboard(output);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="split-pane">
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">JSON Input</span>
          <div className="btn-group">
            <button className="btn btn-primary btn-sm" onClick={handleBeautify}>Beautify</button>
            <button className="btn btn-secondary btn-sm" onClick={handleMinify}>Minify</button>
            <button className="btn btn-success btn-sm" onClick={handleValidate}>Validate</button>
          </div>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...\n{\n  "key": "value"\n}'
            spellCheck={false}
          />
        </div>
      </div>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Output</span>
          <button className="btn btn-ghost btn-sm" onClick={handleCopy}>📋 Copy</button>
        </div>
        <div className="pane-body">
          {error && (
            <div style={{
              color: '#ef4444',
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '6px',
              padding: '10px 14px',
              marginBottom: '10px',
              fontSize: '13px',
              fontFamily: 'monospace',
              wordBreak: 'break-word'
            }}>
              ❌ {error}
            </div>
          )}
          <pre className="code-output">{output || 'Formatted JSON will appear here...'}</pre>
        </div>
      </div>
    </div>
  );
}
