import React, { useState } from 'react';

export default function ApiTester({ copyToClipboard, showToast }) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  
  const [headers, setHeaders] = useState([{ key: 'Accept', value: 'application/json', active: true }]);
  const [body, setBody] = useState('');
  const [tab, setTab] = useState('headers'); // headers, body
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // { status, statusText, time, data, headers }
  const [resTab, setResTab] = useState('body'); // body, headers

  const addHeader = () => setHeaders([...headers, { key: '', value: '', active: true }]);
  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };
  const removeHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };
  const toggleHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders[index].active = !newHeaders[index].active;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      showToast('Please enter a valid URL', 'error');
      return;
    }

    setLoading(true);
    setResponse(null);
    setResTab('body');

    try {
      const fetchHeaders = {};
      headers.filter(h => h.active && h.key.trim()).forEach(h => {
        fetchHeaders[h.key.trim()] = h.value.trim();
      });

      const options = {
        method,
        headers: fetchHeaders,
      };

      if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
        options.body = body;
        if (!fetchHeaders['Content-Type']) {
          fetchHeaders['Content-Type'] = 'application/json';
        }
      }

      const startTime = performance.now();
      
      let res;
      try {
        res = await fetch(url.trim(), options);
      } catch (err) {
        throw new Error("Failed to fetch. This usually means the API is unreachable, or it blocked the request due to CORS (Cross-Origin Resource Sharing). Because ZeroApiTools runs in your browser, it can only test APIs that have CORS enabled.");
      }
      
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);

      let data;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else if (contentType.includes('text/')) {
        data = await res.text();
      } else {
        const blob = await res.blob();
        data = `[Binary Data: ${blob.type} (${blob.size} bytes)]`;
      }

      const resHeaders = [];
      res.headers.forEach((value, key) => {
        resHeaders.push({ key, value });
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time,
        data,
        headers: resHeaders
      });

    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Network Error / CORS',
        time: 0,
        data: error.message || String(error),
        headers: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 0) return '#ef4444'; // Red (Error)
    if (status >= 200 && status < 300) return '#10b981'; // Green
    if (status >= 300 && status < 400) return '#3b82f6'; // Blue
    if (status >= 400 && status < 500) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red (500+)
  };

  const formatData = (data) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>🚀 Online API Tester: Fast REST Client in Your Browser</h2>
        <p>Test REST APIs instantly from your browser. Send HTTP requests, configure headers, and inspect responses with this lightweight, local API tester.</p>
      </div>

      <div className="tool-content">
        {/* Request Line */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            style={{ padding: '12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontWeight: 'bold', minWidth: '100px' }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/users"
            style={{ flex: 1, padding: '12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '14px', minWidth: '200px' }}
            onKeyDown={(e) => { if (e.key === 'Enter') sendRequest(); }}
          />
          <button 
            className="btn btn-primary" 
            onClick={sendRequest} 
            disabled={loading}
            style={{ minWidth: '100px' }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Request Config Tabs */}
        <div style={{ border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
            <button 
              onClick={() => setTab('headers')}
              style={{ flex: 1, padding: '12px', background: tab === 'headers' ? 'transparent' : 'var(--bg-secondary)', color: tab === 'headers' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: tab === 'headers' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Headers ({headers.filter(h => h.active && h.key).length})
            </button>
            <button 
              onClick={() => setTab('body')}
              style={{ flex: 1, padding: '12px', background: tab === 'body' ? 'transparent' : 'var(--bg-secondary)', color: tab === 'body' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: tab === 'body' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Body {body.trim() ? '(Active)' : ''}
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            {tab === 'headers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {headers.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="checkbox" checked={h.active} onChange={() => toggleHeader(i)} />
                    <input 
                      type="text" 
                      placeholder="Key (e.g. Authorization)" 
                      value={h.key} 
                      onChange={e => updateHeader(i, 'key', e.target.value)}
                      style={{ flex: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Value (e.g. Bearer token)" 
                      value={h.value} 
                      onChange={e => updateHeader(i, 'value', e.target.value)}
                      style={{ flex: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                    />
                    <button 
                      onClick={() => removeHeader(i)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addHeader}
                  style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px dashed var(--border-primary)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginTop: '10px' }}
                >
                  + Add Header
                </button>
              </div>
            )}

            {tab === 'body' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Enter raw request body (e.g., JSON). If Content-Type header is not set, it defaults to application/json.
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={'{\n  "name": "ZeroApiTools",\n  "type": "Awesome"\n}'}
                  spellCheck="false"
                  style={{ width: '100%', height: '200px', padding: '12px', background: 'var(--bg-secondary)', color: '#a5d6ff', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', resize: 'vertical' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Response Area */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '16px' }}>Sending request to {url}...</p>
          </div>
        )}

        {response && !loading && (
          <div style={{ border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setResTab('body')}
                style={{ padding: '12px 20px', background: resTab === 'body' ? 'transparent' : 'var(--bg-secondary)', color: resTab === 'body' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: resTab === 'body' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Response Body
              </button>
              <button 
                onClick={() => setResTab('headers')}
                style={{ padding: '12px 20px', background: resTab === 'headers' ? 'transparent' : 'var(--bg-secondary)', color: resTab === 'headers' ? 'var(--primary)' : 'var(--text-muted)', border: 'none', borderBottom: resTab === 'headers' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Headers ({response.headers.length})
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', padding: '0 20px', fontSize: '13px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>Status: <strong style={{ color: getStatusColor(response.status) }}>{response.status === 0 ? 'ERROR' : `${response.status} ${response.statusText}`}</strong></span>
                <span>Time: <strong style={{ color: response.time > 1000 ? '#f59e0b' : '#10b981' }}>{response.time} ms</strong></span>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(resTab === 'body' ? formatData(response.data) : JSON.stringify(response.headers, null, 2))}
                style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}
              >
                Copy
              </button>

              {resTab === 'body' && (
                <textarea
                  readOnly
                  value={formatData(response.data)}
                  style={{ width: '100%', height: '400px', padding: '16px', background: '#0d1117', color: '#e6edf3', border: 'none', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical' }}
                />
              )}

              {resTab === 'headers' && (
                <div style={{ padding: '16px', background: '#0d1117', height: '400px', overflowY: 'auto' }}>
                  {response.headers.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)' }}>No headers</div>
                  ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'monospace' }}>
                      <tbody>
                        {response.headers.map((h, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '8px', color: '#a5d6ff', width: '30%', fontWeight: 'bold' }}>{h.key}</td>
                            <td style={{ padding: '8px', color: '#e6edf3', wordBreak: 'break-all' }}>{h.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="tool-info">
        <h2>What is this Online API Tester?</h2>
        <p>Think of this as a lightweight, browser-native alternative to heavy desktop clients like Postman. It allows you to fire off HTTP requests to your endpoints and inspect the raw JSON responses instantly, without creating an account or installing any software.</p>

        <h2>How to send your first API request</h2>
        <p>Select your HTTP method (GET, POST, PUT, DELETE) from the dropdown and paste your target URL. Add any required custom headers or JSON payloads in the configuration sections, then hit "Send" to instantly view the server's HTTP status code and response body.</p>

        <h2>Essential features for quick debugging</h2>
        <p>We built this to be fast and frictionless for everyday development tasks. You can quickly swap request methods, define custom <code>Authorization</code> or <code>Content-Type</code> headers, and format request bodies on the fly to verify that a new route is returning the correct data.</p>

        <h2>Testing Local vs. Public APIs (CORS)</h2>
        <p>Because this tool executes strictly within your browser environment, it enforces standard CORS policies. To test <code>localhost</code> endpoints, ensure your local development server is configured to return the <code>Access-Control-Allow-Origin: *</code> header.</p>

        <h2>100% Client-Side Privacy</h2>
        <p>Your API keys, Bearer tokens, and sensitive request payloads never touch our servers. Every network request is dispatched directly from your local machine to the target URL, guaranteeing that your proprietary API data remains completely private.</p>
      </div>
    </div>
  );
}
