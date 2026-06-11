import React, { useState } from 'react';

export default function RegexTester({ copyToClipboard, showToast }) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const { matches, highlightedParts, regexError } = React.useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [], highlightedParts: [], regexError: '' };
    }
    try {
      const regex = new RegExp(pattern, flags);
      const allMatches = [];
      const parts = [];
      if (flags.includes('g')) {
        let match;
        const seen = new Set();
        while ((match = regex.exec(testString)) !== null) {
          if (seen.has(match.index) && match[0].length === 0) { regex.lastIndex++; continue; }
          seen.add(match.index);
          allMatches.push({ value: match[0], index: match.index, groups: match.slice(1) });
        }
      } else {
        const match = regex.exec(testString);
        if (match) allMatches.push({ value: match[0], index: match.index, groups: match.slice(1) });
      }
      let lastIndex = 0;
      for (const m of allMatches) {
        if (m.index > lastIndex) parts.push({ text: testString.slice(lastIndex, m.index), highlight: false });
        parts.push({ text: m.value, highlight: true });
        lastIndex = m.index + m.value.length;
      }
      if (lastIndex < testString.length) parts.push({ text: testString.slice(lastIndex), highlight: false });
      return { matches: allMatches, highlightedParts: parts, regexError: '' };
    } catch (e) {
      return { matches: [], highlightedParts: [], regexError: e.message };
    }
  }, [pattern, flags, testString]);

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Regex Tester</span>
        </div>
        <div className="pane-body">
          <div className="controls-grid">
            <div style={{ flex: 3 }}>
              <label className="label">Pattern</label>
              <input
                className="input-field"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern (e.g. \\d+)"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Flags</label>
              <input
                className="input-field"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="g, i, m..."
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>
          {regexError && (
            <div style={{ color: 'var(--red)', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              ⚠ Invalid regex: {regexError}
            </div>
          )}
          <div style={{ marginTop: '0.75rem' }}>
            <label className="label">Test String</label>
            <textarea
              className="textarea-code"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              rows={5}
            />
          </div>
        </div>
      </div>

      {testString && pattern && !regexError && (
        <>
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Highlighted Matches</span>
            </div>
            <div className="pane-body">
              <div
                className="code-output"
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {highlightedParts.length > 0
                  ? highlightedParts.map((part, i) =>
                      part.highlight ? (
                        <mark
                          key={i}
                          style={{
                            backgroundColor: 'var(--yellow, #e2b714)',
                            color: 'var(--bg, #000)',
                            borderRadius: '2px',
                            padding: '0 2px',
                          }}
                        >
                          {part.text}
                        </mark>
                      ) : (
                        <span key={i}>{part.text}</span>
                      )
                    )
                  : <span style={{ opacity: 0.5 }}>No matches found.</span>
                }
              </div>
            </div>
          </div>

          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Matches ({matches.length})</span>
            </div>
            <div className="pane-body">
              {matches.length === 0 ? (
                <div style={{ opacity: 0.5, padding: '0.5rem' }}>No matches found.</div>
              ) : (
                <div className="code-output" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {matches.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.5rem',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>Match {i + 1}</strong>
                          <span style={{ opacity: 0.6, marginLeft: '0.5rem' }}>
                            index: {m.index}
                          </span>
                        </div>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            copyToClipboard(m.value);
                            showToast('Match copied!');
                          }}
                        >
                          Copy
                        </button>
                      </div>
                      <code style={{ display: 'block', marginTop: '0.25rem' }}>
                        "{m.value}"
                      </code>
                      {m.groups.length > 0 && (
                        <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', opacity: 0.8 }}>
                          {m.groups.map((g, gi) => (
                            <div key={gi}>
                              Group {gi + 1}: <code>"{g ?? ''}"</code>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
