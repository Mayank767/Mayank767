import React, { useState, useMemo, useEffect } from 'react';

export default function WordCounter({ copyToClipboard, showToast, sampleData }) {
  const [text, setText] = useState('');

  useEffect(() => { if (sampleData) setText(sampleData); }, [sampleData]);


  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Smart word counting using Unicode property escapes
    // Matches letters, numbers, marks, and allows internal hyphens/apostrophes
    const wordMatches = text.match(/[\p{L}\p{N}\p{M}]+(?:[-'’][\p{L}\p{N}\p{M}]+)*/gu) || [];
    const words = wordMatches.length;
    
    // Improved sentence counting
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+(?:[\s"”')\]]*)/).filter((s) => s.trim().length > 0).length;
    
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    
    // Fix reading time logic (Math.ceil was preventing '< 1 min' from ever showing)
    const readingTimeVal = words / 200;
    let readingTime = '0 min';
    if (words > 0) {
      readingTime = readingTimeVal < 1 ? '< 1 min' : `${Math.ceil(readingTimeVal)} min`;
    }

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    };
  }, [text]);

  return (
    <div className="split-pane" style={{ flexDirection: 'column' }}>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Word Counter</span>
        </div>
        <div className="pane-body">
          <label className="label">Enter your text</label>
          <textarea
            className="textarea-code"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            rows={8}
          />
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.charactersNoSpaces}</div>
          <div className="stat-label">Characters</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.characters}</div>
          <div className="stat-label">With Spaces</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.words}</div>
          <div className="stat-label">Words</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.sentences}</div>
          <div className="stat-label">Sentences</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.paragraphs}</div>
          <div className="stat-label">Paragraphs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.readingTime}</div>
          <div className="stat-label">Reading Time</div>
        </div>
      </div>
    </div>
  );
}
