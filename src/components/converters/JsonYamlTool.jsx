import React, { useState } from 'react';

function jsonToYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  if (obj === null) return 'null';
  if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') {
    if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.includes('"') || obj.includes("'"))
      return `"${obj.replace(/"/g, '\\"')}"`;
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => {
      const val = jsonToYaml(item, indent + 1);
      return typeof item === 'object' && item !== null && !Array.isArray(item)
        ? `\n${pad}- ${val.trimStart()}`
        : `\n${pad}- ${val}`;
    }).join('');
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    return keys.map(k => {
      const val = obj[k];
      if (typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val).length > 0)
        return `\n${pad}${k}:${jsonToYaml(val, indent + 1)}`;
      if (Array.isArray(val))
        return `\n${pad}${k}:${jsonToYaml(val, indent + 1)}`;
      return `\n${pad}${k}: ${jsonToYaml(val, indent)}`;
    }).join('');
  }
  return String(obj);
}

function yamlToJson(yaml) {
  const lines = yaml.split('\n');
  const root = {};
  const stack = [{ obj: root, indent: -1 }];
  let lastKey = null;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.search(/\S/);
    const trimmed = raw.trim();
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (trimmed.startsWith('- ')) {
      const val = trimmed.slice(2).trim();
      if (!Array.isArray(parent[lastKey])) parent[lastKey] = [];
      const parsed = parseScalar(val);
      parent[lastKey].push(parsed);
    } else if (trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      const valStr = trimmed.slice(colonIdx + 1).trim();
      lastKey = key;
      if (valStr === '' || valStr === null) {
        parent[key] = {};
        stack.push({ obj: parent[key], indent });
      } else {
        parent[key] = parseScalar(valStr);
      }
    }
  }
  return root;
}

function parseScalar(s) {
  if (s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (!isNaN(s) && s !== '') return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
    return s.slice(1, -1);
  return s;
}

export default function JsonYamlTool({ copyToClipboard, showToast }) {
  const [tab, setTab] = useState('json2yaml');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      if (tab === 'json2yaml') {
        const parsed = JSON.parse(input);
        const yaml = jsonToYaml(parsed).trim();
        setOutput(yaml);
      } else {
        const obj = yamlToJson(input);
        setOutput(JSON.stringify(obj, null, 2));
      }
    } catch (e) { setError(e.message); }
  };

  const samples = {
    json2yaml: JSON.stringify({ name: 'Alice', age: 30, skills: ['JS', 'React'], address: { city: 'NYC', zip: '10001' } }, null, 2),
    yaml2json: `name: Alice\nage: 30\nskills:\n  - JS\n  - React\naddress:\n  city: NYC\n  zip: '10001'`,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="tab-group" style={{ width: 'fit-content' }}>
        <button className={`tab-btn ${tab === 'json2yaml' ? 'active' : ''}`} onClick={() => { setTab('json2yaml'); setInput(''); setOutput(''); setError(''); }}>JSON → YAML</button>
        <button className={`tab-btn ${tab === 'yaml2json' ? 'active' : ''}`} onClick={() => { setTab('yaml2json'); setInput(''); setOutput(''); setError(''); }}>YAML → JSON</button>
      </div>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">{tab === 'json2yaml' ? 'JSON Input' : 'YAML Input'}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setInput(samples[tab === 'json2yaml' ? 'json2yaml' : 'yaml2json'])}>Sample</button>
          </div>
          <div className="pane-body">
            <textarea className="textarea-code" style={{ flex: 1, minHeight: 280 }} value={input} onChange={e => setInput(e.target.value)}
              placeholder={tab === 'json2yaml' ? '{"key": "value"}' : 'key: value'} />
          </div>
        </div>
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">{tab === 'json2yaml' ? 'YAML Output' : 'JSON Output'}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => { copyToClipboard(output); showToast('Copied!'); }} disabled={!output}>Copy</button>
          </div>
          <div className="pane-body">
            {error && <div style={{ color: 'var(--accent-rose)', fontSize: 13, marginBottom: 8, padding: '8px 12px', background: 'var(--accent-rose-dim)', borderRadius: 6 }}>⚠️ {error}</div>}
            <div className="code-output" style={{ minHeight: 240 }}>{output || <span style={{ color: 'var(--text-muted)' }}>Output will appear here...</span>}</div>
          </div>
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={convert}>Convert →</button>
    </div>
  );
}
