import React, { useState, useMemo } from 'react';

const HTTP_CODES = [
  // 1xx
  { code: 100, name: 'Continue', cat: '1xx', desc: 'Server received request headers; client should proceed.', use: 'Used in large file uploads to check if server is ready.' },
  { code: 101, name: 'Switching Protocols', cat: '1xx', desc: 'Server agrees to switch protocols as requested by client.', use: 'WebSocket upgrade (HTTP → WS).' },
  { code: 102, name: 'Processing', cat: '1xx', desc: 'Server has received and is processing the request.', use: 'Long-running WebDAV operations.' },
  { code: 103, name: 'Early Hints', cat: '1xx', desc: 'Used to return headers before final response.', use: 'Preloading CSS/JS while server prepares response.' },
  // 2xx
  { code: 200, name: 'OK', cat: '2xx', desc: 'Standard response for successful HTTP requests.', use: 'GET, POST success.' },
  { code: 201, name: 'Created', cat: '2xx', desc: 'Request fulfilled and new resource was created.', use: 'POST that creates a new record.' },
  { code: 202, name: 'Accepted', cat: '2xx', desc: 'Request accepted but processing is not complete.', use: 'Async tasks, background jobs.' },
  { code: 204, name: 'No Content', cat: '2xx', desc: 'Success with no content to return.', use: 'DELETE success, PUT with no body.' },
  { code: 206, name: 'Partial Content', cat: '2xx', desc: 'Partial GET fulfilled (range requests).', use: 'Video streaming, resumable downloads.' },
  // 3xx
  { code: 301, name: 'Moved Permanently', cat: '3xx', desc: 'Resource has been permanently moved to new URL.', use: 'Permanent SEO redirects.' },
  { code: 302, name: 'Found', cat: '3xx', desc: 'Resource temporarily at a different URI.', use: 'Temp redirects, auth flows.' },
  { code: 304, name: 'Not Modified', cat: '3xx', desc: 'Resource has not changed since last request.', use: 'Cache validation (ETag, Last-Modified).' },
  { code: 307, name: 'Temporary Redirect', cat: '3xx', desc: 'Like 302 but method must not change.', use: 'Temp redirect preserving POST method.' },
  { code: 308, name: 'Permanent Redirect', cat: '3xx', desc: 'Like 301 but method must not change.', use: 'Permanent redirect preserving POST.' },
  // 4xx
  { code: 400, name: 'Bad Request', cat: '4xx', desc: 'Server cannot process due to client error.', use: 'Invalid JSON, missing required fields.' },
  { code: 401, name: 'Unauthorized', cat: '4xx', desc: 'Authentication required or failed.', use: 'Missing or invalid auth token.' },
  { code: 403, name: 'Forbidden', cat: '4xx', desc: 'Server understood but refuses to authorize.', use: 'Access denied even with valid auth.' },
  { code: 404, name: 'Not Found', cat: '4xx', desc: 'Requested resource does not exist.', use: 'Invalid route or deleted resource.' },
  { code: 405, name: 'Method Not Allowed', cat: '4xx', desc: 'HTTP method not supported for this resource.', use: 'PUT on read-only endpoint.' },
  { code: 408, name: 'Request Timeout', cat: '4xx', desc: 'Client took too long to send the request.', use: 'Slow network causing connection drop.' },
  { code: 409, name: 'Conflict', cat: '4xx', desc: 'Request conflicts with current state.', use: 'Duplicate email, edit conflict.' },
  { code: 410, name: 'Gone', cat: '4xx', desc: 'Resource permanently deleted.', use: 'Deleted content that will never return.' },
  { code: 413, name: 'Payload Too Large', cat: '4xx', desc: 'Request body exceeds server limit.', use: 'File upload too large.' },
  { code: 415, name: 'Unsupported Media Type', cat: '4xx', desc: 'Content-Type not supported.', use: 'Sending XML to a JSON-only API.' },
  { code: 422, name: 'Unprocessable Entity', cat: '4xx', desc: 'Well-formed but semantically incorrect.', use: 'Validation errors (wrong email format).' },
  { code: 429, name: 'Too Many Requests', cat: '4xx', desc: 'Rate limit exceeded.', use: 'API rate limiting.' },
  // 5xx
  { code: 500, name: 'Internal Server Error', cat: '5xx', desc: 'Generic server-side error.', use: 'Unhandled exception in backend.' },
  { code: 501, name: 'Not Implemented', cat: '5xx', desc: 'Server does not support the functionality.', use: 'Unimplemented HTTP method.' },
  { code: 502, name: 'Bad Gateway', cat: '5xx', desc: 'Upstream server returned invalid response.', use: 'Nginx cannot reach your Node app.' },
  { code: 503, name: 'Service Unavailable', cat: '5xx', desc: 'Server is down or overloaded.', use: 'Maintenance mode, deployment.' },
  { code: 504, name: 'Gateway Timeout', cat: '5xx', desc: 'Upstream server did not respond in time.', use: 'Database query taking too long.' },
  { code: 507, name: 'Insufficient Storage', cat: '5xx', desc: 'Server cannot store the representation.', use: 'Disk full error.' },
];

const CATS = ['All', '1xx', '2xx', '3xx', '4xx', '5xx'];
const CAT_COLORS = { '1xx': '#64748b', '2xx': '#10b981', '3xx': '#f59e0b', '4xx': '#f43f5e', '5xx': '#8b5cf6' };
const CAT_LABELS = { '1xx': 'Informational', '2xx': 'Success', '3xx': 'Redirection', '4xx': 'Client Error', '5xx': 'Server Error' };

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return [
    text.slice(0, idx),
    <mark key="h" style={{ background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', borderRadius: 2 }}>{text.slice(idx, idx + query.length)}</mark>,
    text.slice(idx + query.length)
  ];
}

export default function HttpStatusRef({ copyToClipboard, showToast }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return HTTP_CODES.filter(c => {
      const catMatch = cat === 'All' || c.cat === cat;
      const q = search.toLowerCase();
      const searchMatch = !q || String(c.code).includes(q) || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [search, cat]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            className="input-field"
            style={{ paddingLeft: 36 }}
            placeholder="Search by code, name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="tab-group">
        {CATS.map(c => (
          <button key={c} className={`tab-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c === 'All' ? '🌐 All' : `${c} ${CAT_LABELS[c]}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
            No status codes found for "{search}"
          </div>
        )}
        {filtered.map(c => {
          const color = CAT_COLORS[c.cat];
          const isOpen = expanded === c.code;
          return (
            <div
              key={c.code}
              style={{
                border: `1px solid ${isOpen ? color + '60' : 'var(--border-primary)'}`,
                borderRadius: 10,
                background: isOpen ? `${color}0d` : 'var(--bg-surface)',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : c.code)}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18,
                    color, minWidth: 50,
                  }}
                >
                  {c.code}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                    {highlight(c.name, search)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {highlight(c.desc, search)}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100,
                  background: `${color}22`, color,
                }}>{CAT_LABELS[c.cat]}</span>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', padding: '4px 8px' }}
                  onClick={e => { e.stopPropagation(); copyToClipboard(String(c.code)); showToast(`Copied ${c.code}`); }}
                  title="Copy code"
                >📋</button>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div style={{ padding: '0 14px 14px', borderTop: `1px solid var(--border-primary)` }}>
                  <div style={{ marginTop: 10, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>When to use: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{c.use}</span>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-primary)', padding: '4px 10px', borderRadius: 6, fontSize: 12, color }}>
                      HTTP {c.code} {c.name}
                    </code>
                    <button className="btn btn-ghost btn-sm" onClick={() => { copyToClipboard(`HTTP ${c.code} ${c.name}`); showToast('Copied!'); }}>📋</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
