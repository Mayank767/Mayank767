import React, { useState, useEffect } from 'react';

function toWords(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function toUpperCase(str) {
  return str.toUpperCase();
}

function toLowerCase(str) {
  return str.toLowerCase();
}

function toTitleCase(str) {
  return toWords(str)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function toCamelCase(str) {
  const words = toWords(str);
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join('');
}

function toPascalCase(str) {
  return toWords(str)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function toSnakeCase(str) {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join('_');
}

function toKebabCase(str) {
  return toWords(str)
    .map((w) => w.toLowerCase())
    .join('-');
}

function toConstantCase(str) {
  return toWords(str)
    .map((w) => w.toUpperCase())
    .join('_');
}

function toSentenceCase(str) {
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const CONVERSIONS = [
  { label: 'UPPERCASE', fn: toUpperCase },
  { label: 'lowercase', fn: toLowerCase },
  { label: 'Title Case', fn: toTitleCase },
  { label: 'camelCase', fn: toCamelCase },
  { label: 'PascalCase', fn: toPascalCase },
  { label: 'snake_case', fn: toSnakeCase },
  { label: 'kebab-case', fn: toKebabCase },
  { label: 'CONSTANT_CASE', fn: toConstantCase },
  { label: 'Sentence case', fn: toSentenceCase },
];

export default function CaseConverter({ copyToClipboard, showToast, sampleData }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeConversion, setActiveConversion] = useState('');

  useEffect(() => { if (sampleData) setInput(sampleData); }, [sampleData]);

  const handleConvert = (label, fn) => {
    setActiveConversion(label);
    try {
      setOutput(fn(input));
    } catch {
      setOutput('Error converting text.');
    }
  };

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Case Converter</span>
        </div>
        <div className="pane-body">
          <label className="label">Input Text</label>
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert..."
            rows={5}
          />
          <div className="btn-group" style={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {CONVERSIONS.map(({ label, fn }) => (
              <button
                key={label}
                className={`btn btn-sm ${activeConversion === label ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleConvert(label, fn)}
                disabled={!input}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">
            Output{activeConversion ? ` — ${activeConversion}` : ''}
          </span>
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
            placeholder="Converted text will appear here..."
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}
