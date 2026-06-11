import React, { useState, useEffect } from 'react';

const ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  ' ': '&nbsp;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '₹': '&#8377;',
  '—': '&mdash;',
  '–': '&ndash;',
  '…': '&hellip;',
  '×': '&times;',
  '÷': '&divide;',
  '±': '&plusmn;',
  '°': '&deg;',
  '→': '&rarr;',
  '←': '&larr;',
  '↑': '&uarr;',
  '↓': '&darr;',
  '↔': '&harr;',
  '♥': '&hearts;',
  '♣': '&clubs;',
  '♠': '&spades;',
  '♦': '&diams;',
  '✓': '&#10003;',
  '✗': '&#10007;',
  '½': '&frac12;',
  '¼': '&frac14;',
  '¾': '&frac34;',
  '²': '&sup2;',
  '³': '&sup3;',
  'α': '&alpha;',
  'β': '&beta;',
  'γ': '&gamma;',
  'δ': '&delta;',
  'π': '&pi;',
  'Ω': '&Omega;',
  '∞': '&infin;',
  '≈': '&asymp;',
  '≠': '&ne;',
  '≤': '&le;',
  '≥': '&ge;',
};

const REVERSE_ENTITY_MAP = Object.fromEntries(
  Object.entries(ENTITY_MAP).map(([k, v]) => [v, k])
);

const ENCODE_REGEX = new RegExp(
  '[' + Object.keys(ENTITY_MAP).map(c => c.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')).join('') + ']',
  'g'
);

const DECODE_REGEX = new RegExp(
  Object.values(ENTITY_MAP).map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') +
  '|&#[0-9]+;|&#x[0-9a-fA-F]+;',
  'g'
);

function encodeHtmlEntities(str) {
  return str.replace(ENCODE_REGEX, (char) => ENTITY_MAP[char] || char);
}

function decodeHtmlEntities(str) {
  return str.replace(DECODE_REGEX, (entity) => {
    if (REVERSE_ENTITY_MAP[entity]) return REVERSE_ENTITY_MAP[entity];
    if (entity.startsWith('&#x')) return String.fromCodePoint(parseInt(entity.slice(3, -1), 16));
    if (entity.startsWith('&#')) return String.fromCodePoint(parseInt(entity.slice(2, -1), 10));
    return entity;
  });
}

export default function HtmlEntityTool({ copyToClipboard, showToast, sampleData }) {
  const [activeTab, setActiveTab] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => { if (sampleData) handleProcess(sampleData, 'encode'); }, [sampleData]);

  const handleProcess = (text, mode) => {
    setInput(text);
    if (!text) {
      setOutput('');
      return;
    }
    try {
      setOutput(mode === 'encode' ? encodeHtmlEntities(text) : decodeHtmlEntities(text));
    } catch {
      setOutput('Error processing input.');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInput('');
    setOutput('');
  };

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">HTML Entity {activeTab === 'encode' ? 'Encoder' : 'Decoder'}</span>
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === 'encode' ? 'active' : ''}`}
              onClick={() => handleTabChange('encode')}
            >
              Encode
            </button>
            <button
              className={`tab-btn ${activeTab === 'decode' ? 'active' : ''}`}
              onClick={() => handleTabChange('decode')}
            >
              Decode
            </button>
          </div>
        </div>
        <div className="pane-body">
          <label className="label">
            {activeTab === 'encode' ? 'Text to Encode' : 'HTML Entities to Decode'}
          </label>
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => handleProcess(e.target.value, activeTab)}
            placeholder={
              activeTab === 'encode'
                ? 'Enter HTML to encode (e.g. <div class="test">)...'
                : 'Enter HTML entities to decode (e.g. &lt;div&gt;)...'
            }
            rows={6}
          />
        </div>
      </div>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Output</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (output) {
                copyToClipboard(output);
                showToast('Copied to clipboard!');
              }
            }}
            disabled={!output}
          >
            Copy
          </button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={output}
            readOnly
            placeholder="Output will appear here..."
            rows={6}
          />
        </div>
      </div>
    </div>
  );
}
