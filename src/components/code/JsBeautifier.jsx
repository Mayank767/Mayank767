import React, { useState, useCallback } from 'react';

export default function JsBeautifier({ copyToClipboard, showToast }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('beautify');

  const beautifyJs = useCallback((code) => {
    if (!code.trim()) return '';

    try {
      let result = '';
      let indent = 0;
      const indentStr = '  ';
      let inString = false;
      let stringChar = '';
      let inSingleLineComment = false;
      let inMultiLineComment = false;
      let i = 0;
      let lineStart = true;

      const addNewline = () => {
        result = result.trimEnd();
        result += '\n' + indentStr.repeat(indent);
        lineStart = true;
      };

      while (i < code.length) {
        const ch = code[i];
        const next = code[i + 1] || '';

        // Handle string literals
        if (inString) {
          result += ch;
          if (ch === '\\') {
            i++;
            if (i < code.length) result += code[i];
            i++;
            continue;
          }
          if (ch === stringChar) {
            inString = false;
          }
          i++;
          continue;
        }

        // Handle comments
        if (inSingleLineComment) {
          result += ch;
          if (ch === '\n') {
            inSingleLineComment = false;
            result = result.trimEnd() + '\n' + indentStr.repeat(indent);
            lineStart = true;
          }
          i++;
          continue;
        }

        if (inMultiLineComment) {
          result += ch;
          if (ch === '*' && next === '/') {
            result += '/';
            inMultiLineComment = false;
            i += 2;
            continue;
          }
          i++;
          continue;
        }

        // Detect comments
        if (ch === '/' && next === '/') {
          inSingleLineComment = true;
          result += ch;
          i++;
          continue;
        }
        if (ch === '/' && next === '*') {
          inMultiLineComment = true;
          result += ch;
          i++;
          continue;
        }

        // Detect strings
        if (ch === '"' || ch === "'" || ch === '`') {
          inString = true;
          stringChar = ch;
          result += ch;
          lineStart = false;
          i++;
          continue;
        }

        // Opening braces
        if (ch === '{' || ch === '[' || ch === '(') {
          result = result.trimEnd();
          result += ' ' + ch;
          indent++;
          addNewline();
          i++;
          continue;
        }

        // Closing braces
        if (ch === '}' || ch === ']' || ch === ')') {
          indent = Math.max(0, indent - 1);
          addNewline();
          result += ch;
          lineStart = false;
          i++;
          continue;
        }

        // Semicolons
        if (ch === ';') {
          result += ch;
          // Check if inside a for-loop header
          const lastOpen = result.lastIndexOf('(');
          const lastClose = result.lastIndexOf(')');
          if (lastOpen > lastClose) {
            // Inside parentheses (e.g., for loop), add space instead
            result += ' ';
          } else {
            addNewline();
          }
          i++;
          continue;
        }

        // Commas
        if (ch === ',') {
          result += ch;
          result += '\n' + indentStr.repeat(indent);
          lineStart = true;
          i++;
          continue;
        }

        // Whitespace
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
          if (!lineStart && result.length > 0 && result[result.length - 1] !== ' ') {
            result += ' ';
          }
          i++;
          continue;
        }

        result += ch;
        lineStart = false;
        i++;
      }

      // Clean up multiple blank lines
      result = result.replace(/\n{3,}/g, '\n\n');
      return result.trim();
    } catch (e) {
      return 'Error beautifying: ' + e.message;
    }
  }, []);

  const minifyJs = useCallback((code) => {
    if (!code.trim()) return '';

    try {
      let result = '';
      let inString = false;
      let stringChar = '';
      let inSingleLineComment = false;
      let inMultiLineComment = false;
      let lastChar = '';
      let i = 0;

      while (i < code.length) {
        const ch = code[i];
        const next = code[i + 1] || '';

        if (inString) {
          result += ch;
          if (ch === '\\') {
            i++;
            if (i < code.length) result += code[i];
            i++;
            continue;
          }
          if (ch === stringChar) {
            inString = false;
          }
          lastChar = ch;
          i++;
          continue;
        }

        if (inSingleLineComment) {
          if (ch === '\n') {
            inSingleLineComment = false;
          }
          i++;
          continue;
        }

        if (inMultiLineComment) {
          if (ch === '*' && next === '/') {
            inMultiLineComment = false;
            i += 2;
            continue;
          }
          i++;
          continue;
        }

        if (ch === '/' && next === '/') {
          inSingleLineComment = true;
          i += 2;
          continue;
        }

        if (ch === '/' && next === '*') {
          inMultiLineComment = true;
          i += 2;
          continue;
        }

        if (ch === '"' || ch === "'" || ch === '`') {
          inString = true;
          stringChar = ch;
          result += ch;
          lastChar = ch;
          i++;
          continue;
        }

        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
          // Keep a space only if needed between identifiers/keywords
          const isAlphaNum = (c) => /[a-zA-Z0-9_$]/.test(c);
          if (isAlphaNum(lastChar) && i + 1 < code.length) {
            // Look ahead to next non-whitespace
            let j = i + 1;
            while (j < code.length && /\s/.test(code[j])) j++;
            if (j < code.length && isAlphaNum(code[j])) {
              result += ' ';
              lastChar = ' ';
            }
          }
          i++;
          continue;
        }

        result += ch;
        lastChar = ch;
        i++;
      }

      return result.trim();
    } catch (e) {
      return 'Error minifying: ' + e.message;
    }
  }, []);

  const handleProcess = useCallback(() => {
    if (activeTab === 'beautify') {
      setOutput(beautifyJs(input));
    } else {
      setOutput(minifyJs(input));
    }
  }, [activeTab, input, beautifyJs, minifyJs]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (input.trim()) {
      if (tab === 'beautify') {
        setOutput(beautifyJs(input));
      } else {
        setOutput(minifyJs(input));
      }
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
          <span className="pane-title">JavaScript Input</span>
          <button className="btn btn-primary btn-sm" onClick={handleProcess}>
            {activeTab === 'beautify' ? '✨ Beautify' : '📦 Minify'}
          </button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JavaScript code here..."
            spellCheck={false}
          />
        </div>
      </div>
      <div className="pane">
        <div className="pane-header">
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === 'beautify' ? 'active' : ''}`}
              onClick={() => handleTabChange('beautify')}
            >
              Beautify
            </button>
            <button
              className={`tab-btn ${activeTab === 'minify' ? 'active' : ''}`}
              onClick={() => handleTabChange('minify')}
            >
              Minify
            </button>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleCopy}>📋 Copy</button>
        </div>
        <div className="pane-body">
          <pre className="code-output">{output || 'Output will appear here...'}</pre>
        </div>
      </div>
    </div>
  );
}
