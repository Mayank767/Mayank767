import React, { useState } from 'react';

export default function JsonCsvTool({ copyToClipboard, showToast }) {
  const [tab, setTab] = useState('json2csv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function jsonToCsv(jsonStr) {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) throw new Error('Input must be a JSON array of objects');
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const escape = v => {
      const s = v === null || v === undefined ? '' : String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = data.map(row => headers.map(h => escape(row[h])).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  function csvToJson(csvStr) {
    const lines = csvStr.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');
    const parseRow = line => {
      const result = [];
      let cur = '', inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQ && line[i+1] === '"') { cur += '"'; i++; }
          else inQ = !inQ;
        } else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
        else cur += ch;
      }
      result.push(cur);
      return result;
    };
    const headers = parseRow(lines[0]);
    const rows = lines.slice(1).map(line => {
      const vals = parseRow(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = vals[i] !== undefined ? vals[i].trim() : ''; });
      return obj;
    });
    return JSON.stringify(rows, null, 2);
  }

  const convert = () => {
    setError('');
    try {
      if (tab === 'json2csv') setOutput(jsonToCsv(input));
      else setOutput(csvToJson(input));
    } catch (e) { setError(e.message); }
  };

  const samples = {
    json2csv: '[{"name":"Alice","age":30,"city":"NYC"},{"name":"Bob","age":25,"city":"LA"}]',
    csv2json: 'name,age,city\nAlice,30,NYC\nBob,25,LA',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="tab-group" style={{ width: 'fit-content' }}>
        <button className={`tab-btn ${tab === 'json2csv' ? 'active' : ''}`} onClick={() => { setTab('json2csv'); setInput(''); setOutput(''); setError(''); }}>JSON → CSV</button>
        <button className={`tab-btn ${tab === 'csv2json' ? 'active' : ''}`} onClick={() => { setTab('csv2json'); setInput(''); setOutput(''); setError(''); }}>CSV → JSON</button>
      </div>
      <div className="split-pane">
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">{tab === 'json2csv' ? 'JSON Input' : 'CSV Input'}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setInput(samples[tab])}>Load Sample</button>
          </div>
          <div className="pane-body">
            <textarea className="textarea-code" style={{ flex: 1, minHeight: 280 }} value={input} onChange={e => setInput(e.target.value)}
              placeholder={tab === 'json2csv' ? '[{"key":"value"}]' : 'col1,col2\nval1,val2'} />
          </div>
        </div>
        <div className="pane">
          <div className="pane-header">
            <span className="pane-title">{tab === 'json2csv' ? 'CSV Output' : 'JSON Output'}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => { copyToClipboard(output); showToast('Copied!'); }} disabled={!output}>Copy</button>
          </div>
          <div className="pane-body">
            {error && <div style={{ color: 'var(--accent-rose)', fontSize: 13, marginBottom: 8, padding: '8px 12px', background: 'var(--accent-rose-dim)', borderRadius: 6 }}>⚠️ {error}</div>}
            <div className="code-output" style={{ minHeight: 240 }}>{output || <span style={{ color: 'var(--text-muted)' }}>Output will appear here...</span>}</div>
          </div>
        </div>
      </div>
      <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={convert}>Convert →</button>
    </div>
  );
}
