import React, { useState } from 'react';

export default function MetaTagGenerator({ copyToClipboard, showToast }) {
  const [f, setF] = useState({
    title: '', desc: '', keywords: '', author: '', viewport: 'width=device-width, initial-scale=1.0',
    robots: 'index, follow', charset: true,
    ogTitle: '', ogDesc: '', ogImage: '', ogUrl: '', ogType: 'website',
    twCard: 'summary_large_image', twTitle: '', twDesc: '', twImage: '',
  });

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const generateTags = () => {
    const lines = [];
    if (f.charset) lines.push('<meta charset="UTF-8" />');
    if (f.viewport) lines.push(`<meta name="viewport" content="${f.viewport}" />`);
    if (f.title) lines.push(`<title>${f.title}</title>`, `<meta name="title" content="${f.title}" />`);
    if (f.desc) lines.push(`<meta name="description" content="${f.desc}" />`);
    if (f.keywords) lines.push(`<meta name="keywords" content="${f.keywords}" />`);
    if (f.author) lines.push(`<meta name="author" content="${f.author}" />`);
    if (f.robots) lines.push(`<meta name="robots" content="${f.robots}" />`);
    lines.push('');
    if (f.ogTitle || f.ogDesc || f.ogImage || f.ogUrl) {
      lines.push('<!-- Open Graph / Facebook -->');
      lines.push(`<meta property="og:type" content="${f.ogType}" />`);
      if (f.ogUrl) lines.push(`<meta property="og:url" content="${f.ogUrl}" />`);
      if (f.ogTitle || f.title) lines.push(`<meta property="og:title" content="${f.ogTitle || f.title}" />`);
      if (f.ogDesc || f.desc) lines.push(`<meta property="og:description" content="${f.ogDesc || f.desc}" />`);
      if (f.ogImage) lines.push(`<meta property="og:image" content="${f.ogImage}" />`);
      lines.push('');
    }
    if (f.twTitle || f.twDesc || f.twImage || f.title) {
      lines.push('<!-- Twitter -->');
      lines.push(`<meta property="twitter:card" content="${f.twCard}" />`);
      if (f.ogUrl) lines.push(`<meta property="twitter:url" content="${f.ogUrl}" />`);
      lines.push(`<meta property="twitter:title" content="${f.twTitle || f.title}" />`);
      if (f.twDesc || f.desc) lines.push(`<meta property="twitter:description" content="${f.twDesc || f.desc}" />`);
      if (f.twImage || f.ogImage) lines.push(`<meta property="twitter:image" content="${f.twImage || f.ogImage}" />`);
    }
    return lines.join('\n');
  };

  const output = generateTags();

  const Field = ({ label, field, placeholder, type = 'text' }) => (
    <div>
      <label className="label">{label}</label>
      {type === 'textarea'
        ? <textarea className="textarea-code" style={{ minHeight: 70 }} value={f[field]} onChange={e => set(field, e.target.value)} placeholder={placeholder} />
        : <input className="input-field" value={f[field]} onChange={e => set(field, e.target.value)} placeholder={placeholder} />}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Basic SEO</span></div>
          <div className="pane-body" style={{ gap: 12 }}>
            <Field label="Page Title" field="title" placeholder="My Awesome Page" />
            <div>
              <label className="label">Description</label>
              <textarea className="textarea-code" style={{ minHeight: 80 }} value={f.desc} onChange={e => set('desc', e.target.value)} placeholder="Brief page description (150-160 chars ideal)" />
            </div>
            <Field label="Keywords" field="keywords" placeholder="react, javascript, web" />
            <Field label="Author" field="author" placeholder="Your Name" />
            <Field label="Robots" field="robots" placeholder="index, follow" />
            <label className="checkbox-label">
              <input type="checkbox" checked={f.charset} onChange={e => set('charset', e.target.checked)} />
              Include charset UTF-8
            </label>
          </div>
        </div>
        <div className="pane">
          <div className="pane-header"><span className="pane-title">Open Graph + Twitter</span></div>
          <div className="pane-body" style={{ gap: 12 }}>
            <Field label="OG Title (fallback: title)" field="ogTitle" placeholder="Override title for social" />
            <Field label="OG Description" field="ogDesc" placeholder="Override desc for social" />
            <Field label="OG Image URL" field="ogImage" placeholder="https://example.com/image.jpg" />
            <Field label="Page URL" field="ogUrl" placeholder="https://example.com/page" />
            <div>
              <label className="label">OG Type</label>
              <select className="select-field" value={f.ogType} onChange={e => set('ogType', e.target.value)} style={{ width: '100%' }}>
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="profile">profile</option>
                <option value="product">product</option>
              </select>
            </div>
            <div>
              <label className="label">Twitter Card Type</label>
              <select className="select-field" value={f.twCard} onChange={e => set('twCard', e.target.value)} style={{ width: '100%' }}>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="summary">Summary</option>
                <option value="app">App</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Generated Meta Tags</span>
          <button className="btn btn-primary btn-sm" onClick={() => { copyToClipboard(output); showToast('Meta tags copied!'); }}>Copy All</button>
        </div>
        <div className="pane-body">
          <pre className="meta-output" style={{ minHeight: 200 }}>{output || '<!-- Fill in the fields above -->'}</pre>
        </div>
      </div>
    </div>
  );
}
