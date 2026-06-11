import { useState, useCallback, useMemo, useEffect } from 'react';

const SOURCE_PRESETS = [
  { label: '🔍 Google', value: 'google' },
  { label: '📘 Facebook', value: 'facebook' },
  { label: '📸 Instagram', value: 'instagram' },
  { label: '🐦 Twitter', value: 'twitter' },
  { label: '💼 LinkedIn', value: 'linkedin' },
  { label: '📧 Email', value: 'email' },
  { label: '💬 WhatsApp', value: 'whatsapp' },
  { label: '▶️ YouTube', value: 'youtube' },
  { label: '📰 Newsletter', value: 'newsletter' },
];

const MEDIUM_PRESETS = [
  { label: '💰 CPC', value: 'cpc' },
  { label: '🌱 Organic', value: 'organic' },
  { label: '📲 Social', value: 'social' },
  { label: '📧 Email', value: 'email' },
  { label: '🔗 Referral', value: 'referral' },
  { label: '🖥️ Display', value: 'display' },
  { label: '🤝 Affiliate', value: 'affiliate' },
  { label: '🎬 Video', value: 'video' },
];

const HISTORY_KEY = 'utm_builder_history';
const MAX_HISTORY = 5;

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
}

export default function UtmBuilder({ copyToClipboard, showToast }) {
  const [baseUrl, setBaseUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [history, setHistory] = useState([]);
  const [urlTouched, setUrlTouched] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setHistory(stored);
    } catch { /* ignore */ }
  }, []);

  const urlValid = useMemo(() => isValidUrl(baseUrl), [baseUrl]);

  const generatedUrl = useMemo(() => {
    if (!baseUrl || !source || !medium || !campaign) return '';
    if (!urlValid) return '';

    try {
      const url = new URL(baseUrl);
      if (source) url.searchParams.set('utm_source', source);
      if (medium) url.searchParams.set('utm_medium', medium);
      if (campaign) url.searchParams.set('utm_campaign', campaign);
      if (term) url.searchParams.set('utm_term', term);
      if (content) url.searchParams.set('utm_content', content);
      return url.toString();
    } catch {
      return '';
    }
  }, [baseUrl, source, medium, campaign, term, content, urlValid]);

  const handleCopy = useCallback(() => {
    if (!generatedUrl) return;
    copyToClipboard?.(generatedUrl);
    showToast?.('📋 UTM URL copied to clipboard!');

    // Save to history
    const newEntry = {
      url: generatedUrl,
      source,
      medium,
      campaign,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const next = [newEntry, ...prev.filter((h) => h.url !== generatedUrl)].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [generatedUrl, copyToClipboard, showToast, source, medium, campaign]);

  const handleClear = () => {
    setBaseUrl('');
    setSource('');
    setMedium('');
    setCampaign('');
    setTerm('');
    setContent('');
    setUrlTouched(false);
  };

  const handleHistoryLoad = (entry) => {
    try {
      const u = new URL(entry.url);
      setBaseUrl(u.origin + u.pathname);
      setSource(u.searchParams.get('utm_source') || '');
      setMedium(u.searchParams.get('utm_medium') || '');
      setCampaign(u.searchParams.get('utm_campaign') || '');
      setTerm(u.searchParams.get('utm_term') || '');
      setContent(u.searchParams.get('utm_content') || '');
      setUrlTouched(false);
      showToast?.('⏰ Loaded from history');
    } catch { /* ignore */ }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    showToast?.('🗑️ History cleared');
  };

  const paramCount = [source, medium, campaign, term, content].filter(Boolean).length;

  return (
    <div className="pane" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="pane-header">
        <h2 className="pane-title">🔗 UTM Link Builder</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Build campaign tracking URLs with UTM parameters instantly
        </p>
      </div>

      <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Base URL */}
            <div>
              <label className="input-label">🌐 Base URL <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
              <input
                className="input-field"
                type="url"
                placeholder="https://yourwebsite.com/page"
                value={baseUrl}
                onChange={(e) => { setBaseUrl(e.target.value); setUrlTouched(true); }}
                style={{
                  marginTop: '0.5rem',
                  borderColor: urlTouched && baseUrl && !urlValid ? 'var(--accent-rose)' : undefined,
                }}
              />
              {urlTouched && baseUrl && !urlValid && (
                <p style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  ⚠️ Please enter a valid URL (include https://)
                </p>
              )}
            </div>

            {/* Source */}
            <div>
              <label className="input-label">📡 UTM Source <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
              <input
                className="input-field"
                placeholder="e.g. google, newsletter"
                value={source}
                onChange={(e) => setSource(slugify(e.target.value))}
                style={{ marginTop: '0.5rem' }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                {SOURCE_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    className={`btn btn-sm ${source === p.value ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setSource(p.value)}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Medium */}
            <div>
              <label className="input-label">📺 UTM Medium <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
              <input
                className="input-field"
                placeholder="e.g. cpc, email, social"
                value={medium}
                onChange={(e) => setMedium(slugify(e.target.value))}
                style={{ marginTop: '0.5rem' }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                {MEDIUM_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    className={`btn btn-sm ${medium === p.value ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setMedium(p.value)}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Campaign */}
            <div>
              <label className="input-label">🎯 UTM Campaign <span style={{ color: 'var(--accent-rose)' }}>*</span></label>
              <input
                className="input-field"
                placeholder="e.g. spring-sale-2024"
                value={campaign}
                onChange={(e) => setCampaign(slugify(e.target.value))}
                style={{ marginTop: '0.5rem' }}
              />
            </div>

            {/* Term */}
            <div>
              <label className="input-label">🔑 UTM Term <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
              <input
                className="input-field"
                placeholder="e.g. running+shoes"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                style={{ marginTop: '0.5rem' }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.3rem' }}>
                Used for paid search keywords
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="input-label">🎨 UTM Content <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
              <input
                className="input-field"
                placeholder="e.g. banner-a, cta-button"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ marginTop: '0.5rem' }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.3rem' }}>
                Differentiate ads or links pointing to same URL
              </p>
            </div>

            {/* UTM param count badge */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {['source', 'medium', 'campaign', 'term', 'content'].map((param) => {
                const val = { source, medium, campaign, term, content }[param];
                return val ? (
                  <span key={param} style={{
                    background: 'var(--accent-purple-dim)',
                    border: '1px solid var(--accent-purple-light)',
                    borderRadius: '4px',
                    padding: '0.15rem 0.5rem',
                    fontSize: '0.72rem',
                    color: 'var(--accent-purple)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    utm_{param}={val}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Generated URL Preview */}
        <div style={{
          background: 'var(--bg-elevated)',
          borderRadius: '10px',
          border: `1px solid ${generatedUrl ? 'var(--accent-cyan)' : 'var(--border-primary)'}`,
          overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}>
          <div style={{
            padding: '0.6rem 1rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              🔗 Generated UTM URL
              {generatedUrl && (
                <span style={{
                  marginLeft: '0.5rem',
                  background: 'var(--accent-cyan)',
                  color: '#000',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  padding: '0.1rem 0.4rem',
                  fontWeight: 700,
                }}>
                  {paramCount} params
                </span>
              )}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleClear}
                style={{ fontSize: '0.75rem' }}
              >
                🗑️ Clear
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCopy}
                disabled={!generatedUrl}
                style={{ fontSize: '0.75rem' }}
              >
                📋 Copy URL
              </button>
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem' }}>
            {generatedUrl ? (
              <p
                onClick={handleCopy}
                title="Click to copy"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-cyan)',
                  wordBreak: 'break-all',
                  cursor: 'pointer',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {generatedUrl.replace(/&utm_/g, '\n&utm_')}
              </p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                Fill in the required fields (Base URL, Source, Medium, Campaign) to generate your UTM URL
              </p>
            )}
          </div>
        </div>

        {/* URL Length warning */}
        {generatedUrl && generatedUrl.length > 2048 && (
          <div style={{
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid var(--accent-amber)',
            borderRadius: '8px',
            padding: '0.6rem 0.9rem',
            fontSize: '0.8rem',
            color: 'var(--accent-amber)',
          }}>
            ⚠️ URL is {generatedUrl.length} characters — some browsers/platforms have a ~2048 character limit. Consider shortening parameter values.
          </div>
        )}

        {/* Short URL note */}
        <div style={{
          background: 'var(--bg-elevated)',
          borderRadius: '8px',
          padding: '0.6rem 0.9rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-primary)',
        }}>
          💡 <strong style={{ color: 'var(--text-secondary)' }}>Need a shorter URL?</strong> Use a URL shortener like{' '}
          <span style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>bit.ly</span>,{' '}
          <span style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>t.ly</span>, or{' '}
          <span style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>short.io</span>{' '}
          after generating your UTM URL. This tool is fully client-side and doesn't make any API calls.
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                ⏰ Recent URLs
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={handleClearHistory} style={{ fontSize: '0.72rem' }}>
                Clear History
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {history.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    padding: '0.6rem 0.9rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: '0 0 0.2rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--accent-cyan)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {entry.url}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {entry.source} · {entry.medium} · {entry.campaign}
                      {' · '}{new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { copyToClipboard?.(entry.url); showToast?.('📋 Copied!'); }}
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    >
                      📋
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleHistoryLoad(entry)}
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    >
                      ↩️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
