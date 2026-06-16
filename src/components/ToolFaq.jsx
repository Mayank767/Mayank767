import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import toolHowToData from '../data/toolHowTo.json';
import { TOOL_FAQS, GENERIC_FAQS } from '../data/faqs.js';

export default function ToolFaq({ toolId }) {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = TOOL_FAQS[toolId] || GENERIC_FAQS;
  const howToMarkdown = toolHowToData[toolId];

  return (
    <div className="tool-faq-section">
      {howToMarkdown && (
        <div className="tool-how-to" style={{ marginBottom: '40px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 style={{ color: 'var(--text-heading)', marginBottom: '15px', fontSize: '1.4rem' }} {...props} />,
              p: ({node, ...props}) => <p style={{ marginBottom: '15px' }} {...props} />,
              ol: ({node, ...props}) => <ol style={{ marginBottom: '15px', paddingLeft: '20px' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: '8px' }} {...props} />
            }}
          >
            {howToMarkdown}
          </ReactMarkdown>
        </div>
      )}

      <h2 className="tool-faq-heading">❓ Frequently Asked Questions</h2>
      <div className="tool-faq-list">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className={`tool-faq-item ${openIndex === i ? 'open' : ''}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="tool-faq-question">
              <span>{faq.q}</span>
              <span className="tool-faq-toggle">{openIndex === i ? '−' : '+'}</span>
            </div>
            {openIndex === i && (
              <div className="tool-faq-answer">{faq.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Schema (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
