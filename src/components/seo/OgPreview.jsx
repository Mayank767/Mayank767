import React, { useState } from 'react';

export default function OgPreview({ copyToClipboard, showToast }) {
  const [title, setTitle] = useState('My Amazing Page Title');
  const [desc, setDesc] = useState('This is the description that will appear when this page is shared on social media. Make it compelling!');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('My Website');
  const [url, setUrl] = useState('https://example.com/my-page');

  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="controls-panel">
        <div className="controls-grid">
          <div>
            <label className="label">Title</label>
            <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="Page title" />
          </div>
          <div>
            <label className="label">Site Name</label>
            <input className="input-field" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="My Website" />
          </div>
          <div>
            <label className="label">URL</label>
            <input className="input-field" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>
          <div>
            <label className="label">Image URL (optional)</label>
            <input className="input-field" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="label">Description</label>
            <textarea className="textarea-code" style={{ minHeight: 70 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Page description..." />
          </div>
        </div>
      </div>

      <div className="split-pane">
        {/* Facebook card */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📘 Facebook Preview
          </div>
          <div style={{ background: '#1c1e21', borderRadius: 4, overflow: 'hidden', border: '1px solid #3a3b3c', fontFamily: 'Helvetica, Arial, sans-serif', maxWidth: 500 }}>
            {image ? (
              <img src={image} alt="" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <div style={{ width: '100%', height: 260, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🌐</div>
            )}
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#8a8d91', textTransform: 'uppercase', marginBottom: 4 }}>{domain}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#e4e6eb', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</div>
              <div style={{ fontSize: 14, color: '#8a8d91', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{desc}</div>
            </div>
          </div>
        </div>

        {/* Twitter card */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🐦 Twitter Preview
          </div>
          <div style={{ background: '#15202b', borderRadius: 16, overflow: 'hidden', border: '1px solid #38444d', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', maxWidth: 500 }}>
            {image ? (
              <img src={image} alt="" style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <div style={{ width: '100%', height: 240, background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🐦</div>
            )}
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#e7e9ea', marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{title}</div>
              <div style={{ fontSize: 14, color: '#8b98a5', lineHeight: 1.4, marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{desc}</div>
              <div style={{ fontSize: 14, color: '#8b98a5', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🔗</span><span>{domain}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
