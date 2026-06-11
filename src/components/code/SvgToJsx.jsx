import React, { useState, useCallback, useEffect } from 'react';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="yellow" />
  <circle cx="35" cy="40" r="5" fill="black" />
  <circle cx="65" cy="40" r="5" fill="black" />
  <path d="M 30 65 Q 50 80 70 65" stroke="black" stroke-width="3" fill="none" stroke-linecap="round" />
  <rect x="10" y="10" width="80" height="80" fill="none" stroke="gray" stroke-dasharray="5,5" style="opacity:0.3;stroke-width:1" />
  <text x="50" y="95" text-anchor="middle" font-size="8" fill-opacity="0.6" class="label" for="smiley">Smiley</text>
</svg>`;

export default function SvgToJsx({ copyToClipboard, showToast }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const hyphenToCamelCase = useCallback((str) => {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }, []);

  const convertStyleString = useCallback((styleStr) => {
    const properties = styleStr.split(';').filter(s => s.trim());
    const styleObj = {};

    for (const prop of properties) {
      const colonIdx = prop.indexOf(':');
      if (colonIdx === -1) continue;
      const key = prop.substring(0, colonIdx).trim();
      let value = prop.substring(colonIdx + 1).trim();
      const camelKey = hyphenToCamelCase(key);

      // Keep numeric values without quotes if they're purely numeric
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        styleObj[camelKey] = parseFloat(value);
      } else {
        styleObj[camelKey] = value;
      }
    }

    // Build the style object string
    const entries = Object.entries(styleObj).map(([k, v]) => {
      if (typeof v === 'number') {
        return `${k}: ${v}`;
      }
      return `${k}: '${v}'`;
    });

    return `{{${entries.join(', ')}}}`;
  }, [hyphenToCamelCase]);

  const convertSvgToJsx = useCallback((svg) => {
    if (!svg.trim()) return '';

    try {
      const parser = new DOMParser();
      // Use text/html to parse it forgivingly, or application/xml
      const doc = parser.parseFromString(svg, 'image/svg+xml');

      if (doc.querySelector('parsererror')) {
        return 'Error parsing SVG: ' + doc.querySelector('parsererror').textContent;
      }

      const svgNode = doc.querySelector('svg');
      if (!svgNode) return 'No <svg> element found.';

      function processNode(node, indentLevel = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim();
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const tagName = node.tagName.toLowerCase();
        let attrs = '';

        for (const attr of Array.from(node.attributes)) {
          let name = attr.name;
          let value = attr.value;

          // Skip xmlns:xlink
          if (name === 'xmlns:xlink') continue;

          // React replacements
          if (name === 'class') name = 'className';
          if (name === 'for') name = 'htmlFor';

          if (name === 'style') {
            value = convertStyleString(value);
            attrs += ` style=${value}`;
          } else if (name.includes('-') && !name.startsWith('data-') && !name.startsWith('aria-')) {
            name = hyphenToCamelCase(name);
            attrs += ` ${name}="${value}"`;
          } else {
            attrs += ` ${name}="${value}"`;
          }
        }

        const indent = '  '.repeat(indentLevel);
        let inner = '';
        for (const child of Array.from(node.childNodes)) {
          const childHtml = processNode(child, indentLevel + 1);
          if (childHtml) {
            inner += `\n${childHtml}`;
          }
        }

        if (inner) {
          return `${indent}<${tagName}${attrs}>${inner}\n${indent}</${tagName}>`;
        } else {
          return `${indent}<${tagName}${attrs} />`;
        }
      }

      return processNode(svgNode);
    } catch (e) {
      return 'Error converting: ' + e.message;
    }
  }, [hyphenToCamelCase, convertStyleString]);

  // Real-time conversion
  useEffect(() => {
    setOutput(convertSvgToJsx(input));
  }, [input, convertSvgToJsx]);

  const handleLoadSample = () => {
    setInput(SAMPLE_SVG);
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
          <span className="pane-title">SVG Input</span>
          <button className="btn btn-secondary btn-sm" onClick={handleLoadSample}>
            📄 Sample SVG
          </button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SVG code here..."
            spellCheck={false}
          />
        </div>
      </div>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">JSX Output</span>
          <button className="btn btn-ghost btn-sm" onClick={handleCopy}>📋 Copy JSX</button>
        </div>
        <div className="pane-body">
          <pre className="code-output">{output || 'JSX output will appear here as you type...'}</pre>
        </div>
      </div>
    </div>
  );
}
