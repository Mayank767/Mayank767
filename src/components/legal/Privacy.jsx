import React from 'react';

export default function Privacy() {
  return (
    <div className="legal-container animate-in">
      <div className="legal-header">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-subtitle">How we handle (or rather, don't handle) your data.</p>
      </div>
      <div className="legal-body">
        <p><strong>Last Updated:</strong> June 2026</p>
        
        <h2>1. Zero Data Collection Policy</h2>
        <p>
          ZeroApiTools is built on a strict "Zero Data Collection" architecture. All processing, formatting, conversion, and calculation happens <strong>locally in your browser</strong> via JavaScript. We do not transmit your input data (text, code, images, files) to any external servers.
        </p>

        <h2>2. Local Storage</h2>
        <p>
          We use your browser's local storage mechanism (`localStorage`) solely to improve your user experience. This includes saving your theme preference (dark/light mode), your favorited tools, and your recently used tools list. This data is kept strictly on your device and is never uploaded.
        </p>

        <h2>3. Analytics & Tracking</h2>
        <p>
          We may use basic, privacy-respecting analytics to count page views and understand overall site traffic patterns. This tracking does not record your specific inputs or usage within the tools themselves.
        </p>

        <h2>4. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices of those third-party services.
        </p>
      </div>
    </div>
  );
}
