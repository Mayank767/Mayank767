import React, { useState, useCallback } from 'react';

export default function CssBeautifier({ copyToClipboard, showToast }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('beautify');

  const beautifyCss = useCallback((code) => {
    if (!code.trim()) return '';

    try {
      // Remove comments
      let css = code;

      let result = '';
      let indent = 0;
      const indentStr = '  ';
      let inString = false;
      let stringChar = '';
      let inComment = false;
      let i = 0;

      while (i < css.length) {
        const ch = css[i];
        const next = css[i + 1] || '';

        // Handle strings
        if (inString) {
          result += ch;
          if (ch === '\\') {
            i++;
            if (i < css.length) result += css[i];
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
        if (inComment) {
          result += ch;
          if (ch === '*' && next === '/') {
            result += '/';
            inComment = false;
            i += 2;
            continue;
          }
          i++;
          continue;
        }

        if (ch === '/' && next === '*') {
          result += '\n' + indentStr.repeat(indent) + '/*';
          inComment = true;
          i += 2;
          continue;
        }

        if (ch === '"' || ch === "'") {
          inString = true;
          stringChar = ch;
          result += ch;
          i++;
          continue;
        }

        // Opening brace
        if (ch === '{') {
          result = result.trimEnd();
          result += ' {\n';
          indent++;
          result += indentStr.repeat(indent);
          i++;
          // Skip whitespace after {
          while (i < css.length && /\s/.test(css[i])) i++;
          continue;
        }

        // Closing brace
        if (ch === '}') {
          result = result.trimEnd();
          indent = Math.max(0, indent - 1);
          result += '\n' + indentStr.repeat(indent) + '}\n\n' + indentStr.repeat(indent);
          i++;
          // Skip whitespace after }
          while (i < css.length && /\s/.test(css[i])) i++;
          continue;
        }

        // Semicolons - new line after
        if (ch === ';') {
          result += ';\n' + indentStr.repeat(indent);
          i++;
          // Skip whitespace after ;
          while (i < css.length && /\s/.test(css[i])) i++;
          continue;
        }

        // Colon (property: value) - add space after
        if (ch === ':') {
          result += ': ';
          i++;
          // Skip whitespace after :
          while (i < css.length && /\s/.test(css[i])) i++;
          continue;
        }

        // Collapse whitespace
        if (/\s/.test(ch)) {
          if (result.length > 0 && !/\s/.test(result[result.length - 1])) {
            result += ' ';
          }
          i++;
          continue;
        }

        result += ch;
        i++;
      }

      // Clean up multiple blank lines and trailing whitespace
      result = result.replace(/\n{3,}/g, '\n\n');
      result = result.replace(/[ \t]+\n/g, '\n');
      return result.trim();
    } catch (e) {
      return 'Error beautifying: ' + e.message;
    }
  }, []);

  const minifyCss = useCallback((code) => {
    if (!code.trim()) return '';

    try {
      let css = code;

      // Remove comments
      css = css.replace(/\/\*[\s\S]*?\*\//g, '');

      // Remove newlines and extra whitespace
      css = css.replace(/\s+/g, ' ');

      // Remove spaces around special characters
      css = css.replace(/\s*{\s*/g, '{');
      css = css.replace(/\s*}\s*/g, '}');
      css = css.replace(/\s*;\s*/g, ';');
      css = css.replace(/\s*:\s*/g, ':');
      css = css.replace(/\s*,\s*/g, ',');

      // Remove last semicolon before }
      css = css.replace(/;}/g, '}');

      return css.trim();
    } catch (e) {
      return 'Error minifying: ' + e.message;
    }
  }, []);

  const handleProcess = useCallback(() => {
    if (activeTab === 'beautify') {
      setOutput(beautifyCss(input));
    } else {
      setOutput(minifyCss(input));
    }
  }, [activeTab, input, beautifyCss, minifyCss]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (input.trim()) {
      if (tab === 'beautify') {
        setOutput(beautifyCss(input));
      } else {
        setOutput(minifyCss(input));
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
          <span className="pane-title">CSS Input</span>
          <button className="btn btn-primary btn-sm" onClick={handleProcess}>
            {activeTab === 'beautify' ? '✨ Beautify' : '📦 Minify'}
          </button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS code here..."
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
