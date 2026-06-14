import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import toolHowToData from '../data/toolHowTo.json';

// ─── FAQ Data for high-traffic tools ───
const TOOL_FAQS = {
  'sip-calc': [
    { q: 'What is a SIP Calculator?', a: 'A SIP (Systematic Investment Plan) Calculator helps you estimate returns on monthly mutual fund investments over time using compound interest.' },
    { q: 'How is SIP return calculated?', a: 'SIP returns are calculated using the formula: FV = P × [(1+r)^n – 1] / r × (1+r), where P is monthly investment, r is monthly rate of return, and n is total months.' },
    { q: 'Is this SIP Calculator free?', a: 'Yes! ZeroApiTools SIP Calculator is 100% free and runs entirely in your browser. No signup required.' },
    { q: 'What is a good monthly SIP amount?', a: 'It depends on your financial goals. Even ₹500/month can grow significantly over 10-20 years due to compounding. Financial advisors recommend investing 20-30% of income.' },
    { q: 'Is my financial data safe?', a: 'Absolutely. All calculations happen locally in your browser. No data is sent to any server.' },
  ],
  'compound-interest': [
    { q: 'What is Compound Interest?', a: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It makes your money grow faster than simple interest.' },
    { q: 'How is Compound Interest calculated?', a: 'The formula is A = P(1 + r/n)^(nt), where P = principal, r = annual rate, n = compounding frequency per year, t = time in years.' },
    { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is calculated only on the principal amount. Compound interest is calculated on principal + accumulated interest, resulting in faster growth.' },
    { q: 'Which compounding frequency is best?', a: 'More frequent compounding (daily > monthly > quarterly > yearly) results in slightly higher returns due to interest-on-interest effect.' },
    { q: 'Is this calculator accurate?', a: 'Yes, this calculator uses the standard compound interest formula and provides accurate results. All processing happens in your browser.' },
  ],
  'emi-calc': [
    { q: 'What is EMI?', a: 'EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender on a specified date each month to repay a loan.' },
    { q: 'How is EMI calculated?', a: 'EMI = P × r × (1+r)^n / ((1+r)^n – 1), where P = principal loan amount, r = monthly interest rate, n = total number of months.' },
    { q: 'Is this EMI Calculator free to use?', a: 'Yes, completely free! No registration needed. Your data stays in your browser.' },
    { q: 'Can I see the full amortization schedule?', a: 'Yes! Click "Show Table" to see month-by-month breakdown of principal, interest, and remaining balance.' },
  ],
  'instagram-bio': [
    { q: 'What is an Instagram Bio Generator?', a: 'It helps you create attractive, creative Instagram bios with emojis and formatting that fit within Instagram\'s 150 character limit.' },
    { q: 'How many characters can an Instagram bio have?', a: 'Instagram allows a maximum of 150 characters in your bio. Our generator shows a live character count.' },
    { q: 'Can I customize the generated bios?', a: 'Yes! You can mix and match different bio lines, edit the text, and create your own unique combination.' },
    { q: 'Is this tool free?', a: 'Yes, 100% free with no signup required. Generate unlimited bios!' },
  ],
  'youtube-title': [
    { q: 'What makes a good YouTube title?', a: 'A good YouTube title is 60-70 characters, includes keywords, creates curiosity, and uses power words. Our generator follows all these best practices.' },
    { q: 'How does the YouTube Title Generator work?', a: 'Enter your topic and select a style. The tool generates multiple title variations using proven templates that drive clicks and views.' },
    { q: 'What is the YouTube title character limit?', a: 'YouTube allows up to 100 characters, but titles are truncated at ~70 characters in search results. Aim for 60-70 characters for best visibility.' },
    { q: 'Is this tool free?', a: 'Yes! Generate unlimited YouTube titles for free, no account needed.' },
  ],
  'hashtag-gen': [
    { q: 'How many hashtags should I use on Instagram?', a: 'Instagram allows up to 30 hashtags per post. Research suggests 11-15 relevant hashtags perform best for reach.' },
    { q: 'What are niche hashtags?', a: 'Niche hashtags have lower competition (under 500K posts) and help your content reach a more targeted audience. Our generator color-codes hashtags by competition level.' },
    { q: 'Can I generate hashtags for different platforms?', a: 'Yes! Our generator supports Instagram, Twitter/X, LinkedIn, and TikTok with platform-specific hashtag recommendations.' },
    { q: 'Is this Hashtag Generator free?', a: 'Yes, completely free! Generate unlimited hashtags with no signup required.' },
  ],
  'thumbnail-text': [
    { q: 'What is a Thumbnail Text Generator?', a: 'It helps you create short, attention-grabbing text overlays for YouTube thumbnails that drive clicks and views.' },
    { q: 'How many words should thumbnail text have?', a: 'Effective thumbnail text is typically 2-5 words. Keep it short, bold, and readable even on small screens.' },
    { q: 'Is this tool free?', a: 'Yes! Generate unlimited thumbnail text ideas with color suggestions, completely free.' },
  ],
  'json-formatter': [
    { q: 'What is a JSON Formatter online?', a: 'A JSON Formatter online (also called a JSON Beautifier) takes raw, minified JSON and adds proper indentation, line breaks, and syntax highlighting, making API responses and config files instantly readable.' },
    { q: 'How do I use a JSON Beautifier for free?', a: 'Paste your minified JSON into ZeroApiTools\' free JSON Formatter, click Beautify, and get clean, indented JSON in one click. No signup, no upload — it runs 100% in your browser.' },
    { q: 'Is my JSON data safe when using this formatter?', a: 'Absolutely. All formatting and validation happens in your browser using JavaScript. Your JSON data is never transmitted to any server.' },
    { q: 'Can this JSON Formatter validate syntax errors?', a: 'Yes! The formatter simultaneously validates your JSON and highlights syntax errors like missing commas, unclosed brackets, or invalid values, showing you exactly where the problem is.' },
  ],
  'base64': [
    { q: 'What is Base64 encoding and when should I use it?', a: 'Base64 is a binary-to-text encoding scheme that converts data into ASCII characters. Use it for embedding images as data URIs in CSS, encoding Basic Auth headers, or safely transmitting binary data in JSON.' },
    { q: 'How do I encode or decode Base64 online for free?', a: 'Use ZeroApiTools\' free Base64 Encoder Decoder — paste your text to encode, or paste a Base64 string to decode. The result appears instantly with no signup or server upload required.' },
    { q: 'Is Base64 a secure encryption method?', a: 'No. Base64 is an encoding scheme, NOT encryption. It can be decoded by anyone instantly. Never use it to protect sensitive passwords or private data.' },
    { q: 'What is the difference between a Base64 encoder and decoder?', a: 'A Base64 encoder converts plain text or binary data into a Base64 string. A decoder reverses this — converting the Base64 string back into the original text. ZeroApiTools does both in one tool.' },
  ],
  'image-compress': [
    { q: 'How does a browser-based image compressor work?', a: 'It uses your browser\'s native Canvas API to re-encode images at a lower quality level, significantly reducing file size while maintaining acceptable visual quality — without uploading anything to a server.' },
    { q: 'How do I compress an image online for free without uploading it?', a: 'Open ZeroApiTools\' Image Compressor, drag and drop your image, adjust the quality slider, and download the compressed file. Your image never leaves your device.' },
    { q: 'What image formats does this compressor support?', a: 'The compressor supports JPEG, PNG, and WebP formats. You can also convert between formats (e.g., PNG to WebP) during the compression process for maximum optimization.' },
    { q: 'How much can I compress an image without losing quality?', a: 'For most photos, 70-85% quality setting reduces file size by 40-70% with no visible difference. For web use, WebP format at 80% quality is the gold standard.' },
  ],
  'pdf-merge': [
    { q: 'Can I merge PDFs for free?', a: 'Yes! ZeroApiTools PDF Merger is 100% free and processes files entirely in your browser.' },
    { q: 'Are my PDF files safe?', a: 'Absolutely. No files are uploaded to any server. All merging happens locally on your device.' },
    { q: 'Is there a file size limit?', a: 'Since processing happens in your browser, it depends on your device\'s memory. Most modern devices can handle files up to 50-100MB easily.' },
  ],
  'gst-calc': [
    { q: 'What is GST?', a: 'GST (Goods and Services Tax) is an indirect tax in India that replaced multiple state and central taxes. It has slabs of 5%, 12%, 18%, and 28%.' },
    { q: 'How to calculate GST?', a: 'GST Amount = (Original Price × GST Rate) / 100. For inclusive calculation: Original Price = Price / (1 + GST Rate/100).' },
    { q: 'What is CGST and SGST?', a: 'CGST (Central GST) and SGST (State GST) are equal halves of the total GST for intra-state transactions. For interstate, IGST applies.' },
  ],
  'html-entity': [
    { q: 'What is an HTML Entity?', a: 'HTML entities are used to display reserved characters (like <, >, &) or invisible characters in HTML. They start with an ampersand (&) and end with a semicolon (;).' },
    { q: 'How does the converter work?', a: 'It replaces special characters with their corresponding HTML entities for encode, and vice versa for decode. All processing happens locally in your browser.' },
  ],
};

// Generic FAQs for tools without specific FAQs
const GENERIC_FAQS = [
  { q: 'Is this tool free to use?', a: 'Yes! All tools on ZeroApiTools are 100% free with no signup required.' },
  { q: 'Is my data safe?', a: 'Absolutely. All processing happens locally in your browser. No data is ever sent to any server.' },
  { q: 'Does this tool work on mobile?', a: 'Yes! ZeroApiTools is fully responsive and works on all devices — desktop, tablet, and mobile.' },
];

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
