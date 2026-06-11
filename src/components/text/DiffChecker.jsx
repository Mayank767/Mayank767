import React, { useState } from 'react';

function computeDiff(original, modified) {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const maxLen = Math.max(origLines.length, modLines.length);
  const result = [];

  for (let i = 0; i < maxLen; i++) {
    const origLine = i < origLines.length ? origLines[i] : undefined;
    const modLine = i < modLines.length ? modLines[i] : undefined;

    if (origLine === undefined) {
      result.push({ type: 'added', content: modLine, lineNum: i + 1 });
    } else if (modLine === undefined) {
      result.push({ type: 'removed', content: origLine, lineNum: i + 1 });
    } else if (origLine === modLine) {
      result.push({ type: 'same', content: origLine, lineNum: i + 1 });
    } else {
      result.push({ type: 'removed', content: origLine, lineNum: i + 1 });
      result.push({ type: 'added', content: modLine, lineNum: i + 1 });
    }
  }

  return result;
}

export default function DiffChecker({ copyToClipboard, showToast }) {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffResult, setDiffResult] = useState(null);

  const handleCompare = () => {
    const result = computeDiff(original, modified);
    setDiffResult(result);
  };

  const getClassName = (type) => {
    switch (type) {
      case 'added': return 'diff-line diff-added';
      case 'removed': return 'diff-line diff-removed';
      default: return 'diff-line diff-same';
    }
  };

  const getPrefix = (type) => {
    switch (type) {
      case 'added': return '+';
      case 'removed': return '-';
      default: return ' ';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Original</span>
          </div>
          <div className="pane-body">
            <textarea
              className="textarea-code"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
              rows={10}
            />
          </div>
        </div>
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Modified</span>
          </div>
          <div className="pane-body">
            <textarea
              className="textarea-code"
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
              rows={10}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={handleCompare}>
          Compare
        </button>
      </div>

      {diffResult && (
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">
              Diff Result — {diffResult.filter((d) => d.type === 'added').length} additions, {diffResult.filter((d) => d.type === 'removed').length} removals
            </span>
          </div>
          <div className="pane-body">
            <div className="code-output" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {diffResult.map((line, i) => (
                <div key={i} className={getClassName(line.type)}>
                  <span style={{ opacity: 0.5, marginRight: '0.5rem', userSelect: 'none' }}>
                    {getPrefix(line.type)}
                  </span>
                  {line.content}
                </div>
              ))}
              {diffResult.length === 0 && (
                <div style={{ opacity: 0.5, padding: '1rem', textAlign: 'center' }}>
                  No differences found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
