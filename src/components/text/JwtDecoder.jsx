import React, { useState, useEffect } from 'react';

function base64UrlDecode(str) {
  // Replace base64url chars with base64 chars
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '='
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  // Decode
  const decoded = atob(base64);
  // Handle Unicode
  return decodeURIComponent(
    Array.from(decoded, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
}

export default function JwtDecoder({ copyToClipboard, showToast, sampleData }) {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { if (sampleData) decodeJwt(sampleData); }, [sampleData]);

  const decodeJwt = (token) => {
    setInput(token);
    setError('');
    setHeader(null);
    setPayload(null);

    const trimmed = token.trim();
    if (!trimmed) return;

    try {
      const parts = trimmed.split('.');
      if (parts.length < 2 || parts.length > 3) {
        setError('Invalid JWT format. Expected 2 or 3 parts separated by dots.');
        return;
      }

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (e) {
      setError('Failed to decode JWT: ' + e.message);
    }
  };

  const getExpiryInfo = () => {
    if (!payload || !payload.exp) return null;
    const expiryDate = new Date(payload.exp * 1000);
    const now = new Date();
    const isExpired = now > expiryDate;
    return { expiryDate, isExpired };
  };

  const expiryInfo = getExpiryInfo();
  const headerJson = header ? JSON.stringify(header, null, 2) : '';
  const payloadJson = payload ? JSON.stringify(payload, null, 2) : '';

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">JWT Input</span>
        </div>
        <div className="pane-body">
          <label className="label">Paste JWT Token</label>
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => decodeJwt(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
            rows={4}
          />
          {error && (
            <div style={{ color: 'var(--red)', marginTop: '0.5rem' }}>{error}</div>
          )}
          <div style={{ fontSize: 12, color: 'var(--accent-amber)', marginTop: 8, padding: '8px 12px', background: 'var(--accent-amber-dim)', borderRadius: 6 }}>
            ⚠️ This tool only decodes the JWT. Signature is NOT verified. Never trust decoded data as authenticated without backend verification.
          </div>
        </div>
      </div>

      {expiryInfo && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Expiry Date</div>
            <div className="stat-value" style={{ fontSize: '0.85rem' }}>
              {expiryInfo.expiryDate.toLocaleString()}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Status</div>
            <div
              className="stat-value"
              style={{
                fontSize: '0.85rem',
                color: expiryInfo.isExpired ? 'var(--red)' : 'var(--green)',
              }}
            >
              {expiryInfo.isExpired ? '✗ Expired' : '✓ Valid'}
            </div>
          </div>
          {payload && payload.iat && (
            <div className="stat-card">
              <div className="stat-label">Issued At</div>
              <div className="stat-value" style={{ fontSize: '0.85rem' }}>
                {new Date(payload.iat * 1000).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {header && (
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Header</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                copyToClipboard(headerJson);
                showToast('Header copied!');
              }}
            >
              Copy
            </button>
          </div>
          <div className="pane-body">
            <pre className="code-output">{headerJson}</pre>
          </div>
        </div>
      )}

      {payload && (
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">Payload</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                copyToClipboard(payloadJson);
                showToast('Payload copied!');
              }}
            >
              Copy
            </button>
          </div>
          <div className="pane-body">
            <pre className="code-output">{payloadJson}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
