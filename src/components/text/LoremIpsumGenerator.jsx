import React, { useState } from 'react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'semper', 'ligula',
  'viverra', 'maecenas', 'accumsan', 'lacus', 'vel', 'facilisis', 'volutpat',
  'sapien', 'nec', 'sagittis', 'orci', 'a', 'scelerisque', 'purus', 'pellentesque',
  'habitant', 'morbi', 'tristique', 'senectus', 'netus', 'malesuada', 'fames',
  'ac', 'turpis', 'egestas', 'integer', 'feugiat', 'nibh', 'cras', 'fermentum',
  'posuere', 'urna', 'suspendisse', 'potenti', 'nullam', 'porttitor', 'lacinia',
  'at', 'auctor', 'blandit', 'cursus', 'risus', 'ultrices', 'mi', 'tempus',
  'imperdiet', 'massa', 'tincidunt', 'dui', 'elementum', 'pulvinar', 'etiam',
  'gravida', 'neque', 'convallis', 'tellus', 'rutrum',
];

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSentence() {
  const length = Math.floor(Math.random() * 10) + 5; // 5-14 words
  const words = [];
  for (let i = 0; i < length; i++) {
    words.push(randomWord());
  }
  words[0] = capitalize(words[0]);
  return words.join(' ') + '.';
}

function generateParagraph() {
  const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

function generateWords(count) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(randomWord());
  }
  words[0] = capitalize(words[0]);
  return words.join(' ');
}

export default function LoremIpsumGenerator({ copyToClipboard, showToast }) {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const clamped = Math.min(100, Math.max(1, count || 1));
    let result = '';

    switch (type) {
      case 'paragraphs': {
        const paragraphs = [];
        for (let i = 0; i < clamped; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
      }
      case 'sentences': {
        const sentences = [];
        for (let i = 0; i < clamped; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      }
      case 'words': {
        result = generateWords(clamped);
        break;
      }
      default:
        break;
    }

    setOutput(result);
  };

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Lorem Ipsum Generator</span>
        </div>
        <div className="pane-body">
          <div className="controls-grid">
            <div>
              <label className="label">Type</label>
              <select
                className="select-field"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div>
              <label className="label">Count (1–100)</label>
              <input
                className="input-field"
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <button className="btn btn-primary" onClick={generate}>
              Generate
            </button>
          </div>
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
            placeholder="Generated text will appear here..."
            rows={10}
          />
        </div>
      </div>
    </div>
  );
}
