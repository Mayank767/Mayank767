import React from 'react';
import { useApp } from '../App';
import { TOOLS } from '../data/toolsList';


export default function Footer() {
  const { selectTool } = useApp();

  return (
    <footer className="footer-new">


      {/* ── Main grid ── */}
      <div className="footer-main">
        {/* Brand + Feedback column */}
        <div className="footer-brand-wide">
          <div className="footer-brand-info">
            <div className="footer-logo">
              <div className="footer-logo-badge">ZA</div>
              <span className="footer-logo-name">ZeroApiTools</span>
            </div>

            <p className="footer-brand-desc">
              The all-in-one developer toolbox that runs <strong>entirely in your browser</strong>.
              No server. No API. No signup. No cost. Your data never leaves your device.
            </p>

            <div className="footer-badges">
              <span className="footer-badge">🔒 100% Private</span>
              <span className="footer-badge">⚡ Instant</span>
              <span className="footer-badge">💰 Free</span>
              <span className="footer-badge">🚫 No Signup</span>
              <span className="footer-badge">📡 No Tracking</span>
            </div>
          </div>

          {/* Why ZeroApiTools section */}
          <div className="footer-why">
            <div className="footer-why-title">Why ZeroApiTools?</div>
            <ul className="footer-why-list">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                No data sent to any server — ever
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Lightning fast & instant load times
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                No rate limits or quotas
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Open source, always free
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* ── Divider with tagline ── */}
      <div className="footer-tagline-row">
        <div className="footer-tagline">
          "Stop switching tabs. All your dev tools in one place."
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <span>© {new Date().getFullYear()} <strong>ZeroApiTools</strong></span>
          <span className="footer-sep">·</span>
          <a href="/about" onClick={(e) => { e.preventDefault(); selectTool('about'); }} style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a>
          <span className="footer-sep">·</span>
          <a href="/privacy" onClick={(e) => { e.preventDefault(); selectTool('privacy'); }} style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <span className="footer-sep">·</span>
          <a href="/terms" onClick={(e) => { e.preventDefault(); selectTool('terms'); }} style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          <span className="footer-sep">·</span>
          <a href="/blog" onClick={(e) => { e.preventDefault(); selectTool('blog'); }} style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a>
          <span className="footer-sep">·</span>
          <span>{TOOLS.length} tools available</span>
        </div>
        <div className="footer-bottom-right">
          <span className="footer-status">
            <span className="status-dot" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
