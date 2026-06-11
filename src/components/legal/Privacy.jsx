import React from 'react';

export default function Privacy() {
  return (
    <div className="tool-page animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="tool-header">
        <div className="tool-header-left">
          <h1 className="tool-title">🔒 Privacy Policy</h1>
          <p className="tool-description">How we handle (or rather, don't handle) your data.</p>
        </div>
      </div>
      <div className="tool-body" style={{ padding: '30px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '20px' }}><strong>Last Updated:</strong> June 2026</p>
        
        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>1. Zero Data Collection Policy</h2>
        <p style={{ marginBottom: '20px' }}>
          ZeroApiTools is built on a strict "Zero Data Collection" architecture. All processing, formatting, conversion, and calculation happens <strong>locally in your browser</strong> via JavaScript. We do not transmit your input data (text, code, images, files) to any external servers.
        </p>

        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>2. Local Storage</h2>
        <p style={{ marginBottom: '20px' }}>
          We use your browser's local storage mechanism (`localStorage`) solely to improve your user experience. This includes saving your theme preference (dark/light mode), your favorited tools, and your recently used tools list. This data is kept strictly on your device and is never uploaded.
        </p>

        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>3. Analytics & Tracking</h2>
        <p style={{ marginBottom: '20px' }}>
          We may use basic, privacy-respecting analytics to count page views and understand overall site traffic patterns. This tracking does not record your specific inputs or usage within the tools themselves.
        </p>

        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>4. Third-Party Links</h2>
        <p style={{ marginBottom: '20px' }}>
          Our website may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices of those third-party services.
        </p>
      </div>
    </div>
  );
}
