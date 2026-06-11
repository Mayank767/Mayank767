import React, { useState, useEffect } from 'react';

function generateSchema(val, depth = 0) {
  if (depth > 100) return {}; // Prevent infinite recursion
  if (val === null) return { type: 'null' };
  if (typeof val === 'boolean') return { type: 'boolean' };
  if (typeof val === 'number') return Number.isInteger(val) ? { type: 'integer' } : { type: 'number' };
  if (typeof val === 'string') return { type: 'string' };
  if (Array.isArray(val)) {
    if (val.length === 0) return { type: 'array', items: {} };
    const firstNonNull = val.find(v => v !== null);
    if (firstNonNull === undefined) return { type: 'array', items: { type: 'null' } };
    const itemSchema = generateSchema(firstNonNull, depth + 1);
    return { type: 'array', items: itemSchema };
  }
  if (typeof val === 'object') {
    const properties = {};
    const required = [];
    for (const [k, v] of Object.entries(val)) {
      properties[k] = generateSchema(v, depth + 1);
      required.push(k);
    }
    return { type: 'object', properties, required };
  }
  return {};
}

export default function JsonSchemaGen({ copyToClipboard, showToast, sampleData }) {
  const [input, setInput] = useState('');
  const [schema, setSchema] = useState('');
  const [error, setError] = useState('');
  const [markRequired, setMarkRequired] = useState(true);

  // Try Example via sampleData prop
  useEffect(() => { if (sampleData) setInput(sampleData); }, [sampleData]);

  useEffect(() => {
    const handler = (e) => setInput(e.detail);
    document.addEventListener('load-sample', handler);
    return () => document.removeEventListener('load-sample', handler);
  }, []);

  const generate = () => {
    if (!input.trim()) { showToast('Please enter JSON first', 'error'); return; }
    try {
      const parsed = JSON.parse(input);
      let result = generateSchema(parsed);
      if (!markRequired) {
        const removeRequired = (s) => {
          if (s.required) delete s.required;
          if (s.properties) Object.values(s.properties).forEach(removeRequired);
          if (s.items) removeRequired(s.items);
          return s;
        };
        result = removeRequired(result);
      }
      const finalSchema = { $schema: 'http://json-schema.org/draft-07/schema#', ...result };
      setSchema(JSON.stringify(finalSchema, null, 2));
      setError('');
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      setSchema('');
    }
  };

  return (
    <div className="split-pane">
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Input JSON</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label className="checkbox-label" style={{ fontSize: 12 }}>
              <input type="checkbox" checked={markRequired} onChange={e => setMarkRequired(e.target.checked)} />
              Mark all required
            </label>
            <button className="btn btn-primary btn-sm" onClick={generate}>Generate Schema</button>
          </div>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'{\n  "name": "Alice",\n  "age": 28,\n  "email": "alice@example.com"\n}'}
            spellCheck={false}
          />
          {error && <div style={{ color: 'var(--red)', marginTop: 8, fontSize: 13 }}>❌ {error}</div>}
        </div>
      </div>

      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">JSON Schema (Draft-07)</span>
          <button className="btn btn-ghost btn-sm" disabled={!schema} onClick={() => { copyToClipboard(schema); showToast('Schema copied!'); }}>📋 Copy</button>
        </div>
        <div className="pane-body">
          <pre className="code-output">{schema || 'JSON Schema will appear here...'}</pre>
        </div>
      </div>
    </div>
  );
}
