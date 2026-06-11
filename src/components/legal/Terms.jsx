import React from 'react';

export default function Terms() {
  return (
    <div className="tool-page animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="tool-header">
        <div className="tool-header-left">
          <h1 className="tool-title">⚖️ Terms of Service</h1>
          <p className="tool-description">The rules and guidelines for using ZeroApiTools.</p>
        </div>
      </div>
      <div className="tool-body" style={{ padding: '30px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '20px' }}><strong>Last Updated:</strong> June 2026</p>
        
        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '20px' }}>
          By accessing and using ZeroApiTools, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
        </p>

        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>2. Description of Service</h2>
        <p style={{ marginBottom: '20px' }}>
          ZeroApiTools provides a collection of browser-based utility tools for developers and users. The tools are provided "as is" and without warranty of any kind. We reserve the right to modify, suspend, or discontinue any tool at any time without notice.
        </p>

        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>3. Disclaimer of Warranties</h2>
        <p style={{ marginBottom: '20px' }}>
          The use of the service is at your sole risk. The service is provided on an "as is" and "as available" basis. ZeroApiTools expressly disclaims all warranties of any kind, whether express or implied. We do not guarantee that the generated code, formatted text, or converted files are 100% accurate or suitable for your specific use cases. Always verify the output.
        </p>

        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>4. Limitation of Liability</h2>
        <p style={{ marginBottom: '20px' }}>
          ZeroApiTools shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from the use or inability to use the service.
        </p>
      </div>
    </div>
  );
}
