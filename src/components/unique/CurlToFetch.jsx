import React, { useState, useEffect } from 'react';

function parseCurl(cmd) {
  const result = { method: 'GET', url: '', headers: {}, body: null, auth: null };
  const s = cmd.trim().replace(/\\\n/g, ' ').replace(/\s+/g, ' ');
  const urlMatch = s.match(/curl\s+(?:[^\s'"-][^\s]*|'[^']*'|"[^"]*")/);
  let remaining = s.replace(/^curl\s+/, '');

  // Extract URL (first non-flag argument)
  const urlReg = /(?:^|\s)(https?:\/\/[^\s'"]+|'https?:\/\/[^']+'|"https?:\/\/[^"]+"|localhost[^\s'"]+|'localhost[^']+'|"localhost[^"]+")/;
  const urlM = remaining.match(urlReg);
  if (urlM) result.url = urlM[1].replace(/^['"]|['"]$/g, '');

  // Method
  const methodM = remaining.match(/-X\s+([A-Z]+)/);
  if (methodM) result.method = methodM[1];

  // Headers
  const headerReg = /-H\s+['"]([^'"]+)['"]/g;
  let hm;
  while ((hm = headerReg.exec(remaining)) !== null) {
    const [k, ...v] = hm[1].split(':');
    result.headers[k.trim()] = v.join(':').trim();
  }

  // Body
  const bodyM = remaining.match(/(?:-d|--data(?:-raw)?)\s+['"]([^'"]*)['"]/);
  if (bodyM) {
    result.body = bodyM[1];
    if (!methodM) result.method = 'POST';
  }

  // Auth
  const authM = remaining.match(/(?:--user|-u)\s+['"]?([^'":]+):([^'"]+)['"]?/);
  if (authM) result.auth = { user: authM[1], pass: authM[2] };

  return result;
}

function toFetch(p) {
  const opts = [];
  if (p.method !== 'GET') opts.push(`  method: '${p.method}'`);
  const headers = { ...p.headers };
  if (p.auth) {
    try {
      headers['Authorization'] = `Basic ${btoa(unescape(encodeURIComponent(p.auth.user + ':' + p.auth.pass)))}`;
    } catch {
      headers['Authorization'] = `Basic ${btoa(p.auth.user + ':' + p.auth.pass)}`;
    }
  }
  if (Object.keys(headers).length) {
    opts.push(`  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')}`);
  }
  if (p.body) opts.push(`  body: ${JSON.stringify(p.body)}`);
  const optsStr = opts.length ? `,\n{\n${opts.join(',\n')}\n}` : '';
  return `const response = await fetch('${p.url}'${optsStr});\nconst data = await response.json();\nconsole.log(data);`;
}

function toAxios(p) {
  const cfg = {};
  const headers = { ...p.headers };
  if (p.auth) {
    try {
      headers['Authorization'] = `Basic ${btoa(unescape(encodeURIComponent(p.auth.user + ':' + p.auth.pass)))}`;
    } catch {
      headers['Authorization'] = `Basic ${btoa(p.auth.user + ':' + p.auth.pass)}`;
    }
  }
  if (Object.keys(headers).length) cfg.headers = headers;
  if (p.body) {
    try { cfg.data = JSON.parse(p.body); } catch { cfg.data = p.body; }
  }
  const cfgStr = Object.keys(cfg).length ? `, ${JSON.stringify(cfg, null, 2)}` : '';
  const method = p.method.toLowerCase();
  if (method === 'get') return `const { data } = await axios.get('${p.url}'${cfgStr});\nconsole.log(data);`;
  return `const { data } = await axios.${method}('${p.url}'${p.body ? `, ${JSON.stringify(cfg.data ?? p.body, null, 2)}` : ''}${Object.keys({ ...cfg, data: undefined }).filter(k => k !== 'data' && cfg[k]).length ? `, ${JSON.stringify(Object.fromEntries(Object.entries(cfg).filter(([k]) => k !== 'data')), null, 2)}` : ''});\nconsole.log(data);`;
}

const SAMPLE = `curl -X POST https://api.example.com/users \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer mytoken123' \\
  -d '{"name":"John","email":"john@example.com"}'`;

export default function CurlToFetch({ copyToClipboard, showToast, sampleData }) {
  const [input, setInput] = useState('');
  const [tab, setTab] = useState('fetch');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');

  // Try Example via sampleData prop
  useEffect(() => { if (sampleData) setInput(sampleData); }, [sampleData]);

  useEffect(() => {
    const handler = (e) => setInput(e.detail);
    document.addEventListener('load-sample', handler);
    return () => document.removeEventListener('load-sample', handler);
  }, []);

  useEffect(() => {
    if (!input.trim()) { setParsed(null); setError(''); return; }
    try {
      if (!input.trim().startsWith('curl')) { setError('Input must start with "curl"'); setParsed(null); return; }
      const p = parseCurl(input);
      if (!p.url) { setError('Could not extract URL from cURL command'); setParsed(null); return; }
      setParsed(p); setError('');
    } catch (e) { setError('Parse error: ' + e.message); setParsed(null); }
  }, [input]);

  const fetchCode = parsed ? toFetch(parsed) : '';
  const axiosCode = parsed ? toAxios(parsed) : '';
  const output = tab === 'fetch' ? fetchCode : axiosCode;

  return (
    <div className="split-pane" style={{ flexDirection: 'column', gap: 16 }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">cURL Command</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setInput(SAMPLE)}>💡 Example</button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'curl -X POST https://api.example.com/data \\\n  -H \'Content-Type: application/json\' \\\n  -d \'{"key":"value"}\''}
            rows={6}
            spellCheck={false}
          />
          {error && <div style={{ color: 'var(--red)', marginTop: 8, fontSize: 13 }}>⚠ {error}</div>}
        </div>
      </div>

      {parsed && (
        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Method</div><div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{parsed.method}</div></div>
          <div className="stat-card"><div className="stat-label">Headers</div><div className="stat-value">{Object.keys(parsed.headers).length}</div></div>
          <div className="stat-card"><div className="stat-label">Body</div><div className="stat-value">{parsed.body ? 'Yes' : 'No'}</div></div>
          <div className="stat-card"><div className="stat-label">Auth</div><div className="stat-value">{parsed.auth ? 'Basic' : parsed.headers['Authorization'] ? 'Bearer' : 'None'}</div></div>
        </div>
      )}

      {parsed && (
        <div className="pane">
          <div className="pane-header">
            <div className="tab-group">
              <button className={`tab-btn ${tab === 'fetch' ? 'active' : ''}`} onClick={() => setTab('fetch')}>fetch()</button>
              <button className={`tab-btn ${tab === 'axios' ? 'active' : ''}`} onClick={() => setTab('axios')}>axios</button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => { copyToClipboard(output); showToast('Code copied!'); }}>📋 Copy</button>
          </div>
          <div className="pane-body">
            <pre className="code-output">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
