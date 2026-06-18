import React, { useState, useEffect } from 'react';

export default function JsonFormatter({ copyToClipboard, showToast, sampleData }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (sampleData) { setInput(sampleData); parseJson(sampleData); } }, [sampleData]);

  useEffect(() => {
    let script = document.getElementById('faq-schema-json');
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-schema-json';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is my JSON data safe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, absolutely! Our JSON Formatter runs 100% locally in your web browser. Your data is never uploaded to any server or database, making it perfectly safe for sensitive configuration files or API tokens."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between JSON beautify and minify?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Beautifying JSON adds indentation and line breaks to make it readable by humans. Minifying JSON removes all unnecessary whitespace to make the payload size as small as possible for network transfers."
          }
        },
        {
          "@type": "Question",
          "name": "How do I fix 'Unexpected token' in JSON?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The 'Unexpected token' error usually means you have a trailing comma, forgot to quote a key (all keys must be in double quotes), or used single quotes instead of double quotes. Check the exact line and column number provided by our validator."
          }
        }
      ]
    });

    return () => {
      const existingScript = document.getElementById('faq-schema-json');
      if (existingScript) existingScript.remove();
    };
  }, []);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

      {/* SEO & Info Section */}
      <div className="seo-content" style={{ marginTop: '20px', padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px', fontSize: '1.5rem' }}>JSON Formatter & Validator Guide</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>Common JSON Errors</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.6, paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '6px' }}><strong>Trailing commas:</strong> <code>{`{"a": 1,}`}</code> is invalid. Remove the last comma.</li>
              <li style={{ marginBottom: '6px' }}><strong>Single quotes:</strong> JSON requires double quotes. <code>{`{'key': 'value'}`}</code> will fail.</li>
              <li style={{ marginBottom: '6px' }}><strong>Unquoted keys:</strong> <code>{`{key: "value"}`}</code> is invalid. Keys must be quoted.</li>
              <li><strong>Comments:</strong> Standard JSON does not support <code>//</code> or <code>/* */</code> comments.</li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1.1rem' }}>Valid JSON Example</h3>
            <pre style={{ margin: 0, padding: '12px', background: 'var(--bg-elevated)', borderRadius: '6px', fontSize: '12px', overflowX: 'auto', color: 'var(--text-heading)' }}>
{`{
  "user": {
    "id": 104,
    "isActive": true,
    "roles": ["admin", "editor"],
    "preferences": null
  }
}`}
            </pre>
          </div>
        </div>

        <h3 style={{ color: 'var(--text-heading)', marginBottom: '16px', fontSize: '1.2rem' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.05rem' }}>Is my JSON data safe?</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>Yes, absolutely! Our JSON Formatter runs <strong>100% locally in your web browser</strong>. Your data is never uploaded to any server or database, making it perfectly safe for sensitive configuration files or API tokens.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.05rem' }}>What is the difference between JSON beautify and minify?</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}><strong>Beautifying</strong> JSON adds indentation and line breaks to make it readable by humans. <strong>Minifying</strong> JSON removes all unnecessary whitespace to make the payload size as small as possible for network transfers.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.05rem' }}>How do I fix "Unexpected token" in JSON?</h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>The "Unexpected token" error usually means you have a syntax issue. Check for trailing commas, ensure all keys and string values are wrapped in double quotes (<code>"</code>), and verify all brackets <code>[]</code> and braces <code>{}</code> are properly closed. Our validator will show you the exact line and column number of the error.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
