import React, { useState, useCallback } from 'react';
import { html_beautify } from 'js-beautify';

export default function HtmlBeautifier({ copyToClipboard, showToast }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('beautify');

  const beautifyHtml = useCallback((code) => {
    if (!code.trim()) return '';
    try {
      return html_beautify(code, {
        indent_size: 2,
        wrap_line_length: 120,
        preserve_newlines: true,
        max_preserve_newlines: 2
      });
    } catch (e) {
      return 'Error beautifying: ' + e.message;
    }
  }, []);

  const minifyHtml = useCallback((code) => {
    if (!code.trim()) return '';

    try {
      let html = code;

      // Remove HTML comments
      html = html.replace(/<!--[\s\S]*?-->/g, '');

      // Remove whitespace between tags
      html = html.replace(/>\s+</g, '><');

      // Collapse remaining whitespace
      html = html.replace(/\s+/g, ' ');

      return html.trim();
    } catch (e) {
      return 'Error minifying: ' + e.message;
    }
  }, []);

  const handleProcess = useCallback(() => {
    if (activeTab === 'beautify') {
      setOutput(beautifyHtml(input));
    } else {
      setOutput(minifyHtml(input));
    }
  }, [activeTab, input, beautifyHtml, minifyHtml]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (input.trim()) {
      if (tab === 'beautify') {
        setOutput(beautifyHtml(input));
      } else {
        setOutput(minifyHtml(input));
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
          <span className="pane-title">HTML Input</span>
          <button className="btn btn-primary btn-sm" onClick={handleProcess}>
            {activeTab === 'beautify' ? '✨ Beautify' : '📦 Minify'}
          </button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML code here..."
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
