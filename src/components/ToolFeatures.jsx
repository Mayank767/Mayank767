import React from 'react';

export default function ToolFeatures({ category }) {
  return (
    <div className="tool-features-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      margin: '40px 0',
      paddingTop: '40px',
      borderTop: '1px solid var(--border-secondary)'
    }}>
      <div className="feature-card" style={{
        background: 'rgba(0, 232, 122, 0.02)',
        border: '1px solid rgba(0, 232, 122, 0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '1px', marginBottom: '12px', color: 'var(--text-1)' }}>100% Client-Side Security</h3>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: '1.6' }}>
          Your sensitive data never leaves your device. All processing happens entirely within your local browser using modern JavaScript, ensuring absolute privacy with zero server uploads.
        </p>
      </div>

      <div className="feature-card" style={{
        background: 'rgba(0, 232, 122, 0.02)',
        border: '1px solid rgba(0, 232, 122, 0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '1px', marginBottom: '12px', color: 'var(--text-1)' }}>Zero-Latency Execution</h3>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: '1.6' }}>
          No more waiting for server responses or API calls. Because everything is calculated locally, you get instantaneous, real-time results the moment you type or click.
        </p>
      </div>

      <div className="feature-card" style={{
        background: 'rgba(0, 232, 122, 0.02)',
        border: '1px solid rgba(0, 232, 122, 0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>♾️</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '1px', marginBottom: '12px', color: 'var(--text-1)' }}>Free & Unlimited Usage</h3>
        <p style={{ color: 'var(--text-2)', fontSize: '14px', lineHeight: '1.6' }}>
          Built for developers, by developers. Use this tool as many times as you need without hitting any paywalls, daily limits, or annoying registration forms.
        </p>
      </div>
    </div>
  );
}
