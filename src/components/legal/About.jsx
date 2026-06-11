import React from 'react';

export default function About() {
  return (
    <div className="tool-page animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="tool-header">
        <div className="tool-header-left">
          <h1 className="tool-title">👨‍💻 About ZeroApiTools</h1>
          <p className="tool-description">Our mission and the story behind the project.</p>
        </div>
      </div>
      <div className="tool-body" style={{ padding: '30px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '15px' }}>The Mission</h2>
        <p style={{ marginBottom: '20px' }}>
          ZeroApiTools was built with a simple premise: developer tools should be fast, reliable, and most importantly, <strong>private</strong>. 
          We noticed that many online utilities send your sensitive code, JSON data, and images to remote servers for processing. This is a massive security risk.
        </p>
        <p style={{ marginBottom: '20px' }}>
          That's why every single tool on ZeroApiTools runs 100% locally in your web browser. When you format JSON, encode a string, or compress an image, the processing happens directly on your device using JavaScript. Your data never leaves your computer.
        </p>
        
        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>The Developer</h2>
        <p style={{ marginBottom: '20px' }}>
          ZeroApiTools is maintained by Mayank Mehra, a passionate frontend developer dedicated to building clean, accessible, and high-performance web applications.
        </p>
        
        <h2 style={{ color: 'var(--text-heading)', margin: '30px 0 15px' }}>Open Source</h2>
        <p>
          We believe in transparency. The core utilities and UI scripts powering ZeroApiTools are designed to be completely client-side, ensuring you always know exactly how your data is being handled.
        </p>
      </div>
    </div>
  );
}
