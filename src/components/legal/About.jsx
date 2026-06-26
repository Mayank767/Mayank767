import React from 'react';

export default function About() {
  return (
    <div className="legal-container animate-in">
      <div className="legal-header">
        <h1 className="legal-title">About ZeroApiTools</h1>
        <p className="legal-subtitle">Our mission and the story behind the project.</p>
      </div>
      <div className="legal-body">
        <h2>The Mission</h2>
        <p>
          ZeroApiTools was built with a simple premise: developer tools should be fast, reliable, and most importantly, <strong>private</strong>. 
          We noticed that many online utilities send your sensitive code, JSON data, and images to remote servers for processing. This is a massive security risk.
        </p>
        <p>
          That's why every single tool on ZeroApiTools runs 100% locally in your web browser. When you format JSON, encode a string, or compress an image, the processing happens directly on your device using JavaScript. Your data never leaves your computer.
        </p>
        
        <h2>The Developer</h2>
        <p>
          ZeroApiTools is maintained by Mayank Mehra, a passionate frontend developer dedicated to building clean, accessible, and high-performance web applications.
        </p>
        
        <h2>Open Source</h2>
        <p>
          We believe in transparency. The core utilities and UI scripts powering ZeroApiTools are designed to be completely client-side, ensuring you always know exactly how your data is being handled.
        </p>
      </div>
    </div>
  );
}
