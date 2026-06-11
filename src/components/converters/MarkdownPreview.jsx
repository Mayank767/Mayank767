import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const SAMPLE = `# Hello, Markdown!

This is a **live preview** of your Markdown.

## Features
- Real-time rendering
- Code blocks
- Tables

## Code Example
\`\`\`javascript
const greet = name => \`Hello, \${name}!\`;
console.log(greet('World'));
\`\`\`

## Table
| Name  | Role     | Level |
|-------|----------|-------|
| Alice | Dev      | Senior|
| Bob   | Designer | Mid   |

> Blockquotes look great too!

Visit [DevTools Hub](https://example.com) for more tools.
`;

export default function MarkdownPreview({ copyToClipboard, showToast }) {
  const [md, setMd] = useState(SAMPLE);
  const [html, setHtml] = useState('');

  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });
    const rawHtml = marked.parse(md);
    setHtml(DOMPurify.sanitize(rawHtml));
  }, [md]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="split-pane" style={{ minHeight: 500 }}>
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Markdown Input</span>
            <div className="btn-group">
              <button className="btn btn-ghost btn-sm" onClick={() => setMd(SAMPLE)}>Load Sample</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setMd('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ flex: 1, padding: 0 }}>
            <textarea
              className="textarea-code"
              style={{ flex: 1, minHeight: 460, borderRadius: 0, border: 'none', padding: 16 }}
              value={md}
              onChange={e => setMd(e.target.value)}
              placeholder="Type Markdown here..."
            />
          </div>
        </div>
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Preview</span>
            <button className="btn btn-secondary btn-sm" onClick={() => { copyToClipboard(html); showToast('HTML copied!'); }}>Copy HTML</button>
          </div>
          <div className="pane-body" style={{ overflow: 'auto', flex: 1 }}>
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  );
}
