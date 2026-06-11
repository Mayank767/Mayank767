import React, { useState, useCallback } from 'react';

export default function SqlFormatter({ copyToClipboard, showToast }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatSql = useCallback((sql) => {
    if (!sql.trim()) return '';

    try {
      const indentStr = '  ';

      // Keywords that should appear on their own new line (top-level)
      const majorKeywords = [
        'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
        'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT',
        'INSERT INTO', 'INSERT', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'DELETE',
        'CREATE TABLE', 'CREATE INDEX', 'CREATE VIEW', 'CREATE DATABASE',
        'CREATE', 'ALTER TABLE', 'ALTER', 'DROP TABLE', 'DROP INDEX', 'DROP VIEW',
        'DROP DATABASE', 'DROP',
        'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
        'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN',
        'FULL JOIN', 'CROSS JOIN', 'NATURAL JOIN', 'JOIN',
        'ON', 'USING', 'INTO', 'RETURNING'
      ];

      // All SQL keywords to uppercase
      const allKeywords = [
        ...majorKeywords,
        'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'ILIKE',
        'IS', 'NULL', 'IS NOT', 'IS NULL', 'IS NOT NULL',
        'AS', 'ASC', 'DESC', 'DISTINCT', 'ALL', 'ANY', 'SOME',
        'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
        'IF', 'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
        'GRANT', 'REVOKE', 'TRUNCATE', 'EXPLAIN', 'ANALYZE',
        'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT',
        'DEFAULT', 'CHECK', 'UNIQUE', 'INDEX', 'CASCADE',
        'ADD', 'COLUMN', 'TABLE', 'DATABASE', 'VIEW',
        'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
        'COALESCE', 'NULLIF', 'CAST',
        'TRUE', 'FALSE',
        'INT', 'INTEGER', 'VARCHAR', 'TEXT', 'BOOLEAN', 'FLOAT',
        'DOUBLE', 'DECIMAL', 'DATE', 'TIMESTAMP', 'SERIAL', 'BIGINT',
        'SMALLINT', 'CHAR', 'NUMERIC', 'REAL',
        'NOT NULL', 'AUTO_INCREMENT', 'IDENTITY',
        'WITH', 'RECURSIVE', 'OVER', 'PARTITION BY', 'ROWS', 'RANGE',
        'FETCH', 'NEXT', 'FIRST', 'LAST', 'ONLY'
      ];

      // Sort keywords by length (longest first) for proper matching
      const sortedKeywords = [...new Set(allKeywords)].sort((a, b) => b.length - a.length);
      const sortedMajorKeywords = [...new Set(majorKeywords)].sort((a, b) => b.length - a.length);

      // Step 1: Normalize whitespace (but preserve strings)
      let normalized = '';
      let inString = false;
      let strChar = '';
      for (let i = 0; i < sql.length; i++) {
        const ch = sql[i];
        if (inString) {
          normalized += ch;
          if (ch === strChar && sql[i + 1] !== strChar) {
            inString = false;
          } else if (ch === strChar && sql[i + 1] === strChar) {
            normalized += sql[i + 1];
            i++;
          }
          continue;
        }
        if (ch === "'" || ch === '"') {
          inString = true;
          strChar = ch;
          normalized += ch;
          continue;
        }
        // Remove single-line comments
        if (ch === '-' && sql[i + 1] === '-') {
          const nlIdx = sql.indexOf('\n', i);
          if (nlIdx !== -1) {
            i = nlIdx;
          } else {
            break;
          }
          continue;
        }
        // Remove multi-line comments
        if (ch === '/' && sql[i + 1] === '*') {
          const endIdx = sql.indexOf('*/', i + 2);
          if (endIdx !== -1) {
            i = endIdx + 1;
          } else {
            break;
          }
          continue;
        }
        if (/\s/.test(ch)) {
          if (normalized.length > 0 && normalized[normalized.length - 1] !== ' ') {
            normalized += ' ';
          }
        } else {
          normalized += ch;
        }
      }
      normalized = normalized.trim();

      // Step 2: Uppercase keywords (preserve strings)
      let uppercased = '';
      let idx = 0;
      inString = false;
      strChar = '';

      while (idx < normalized.length) {
        const ch = normalized[idx];

        if (inString) {
          uppercased += ch;
          if (ch === strChar && normalized[idx + 1] !== strChar) {
            inString = false;
          } else if (ch === strChar && normalized[idx + 1] === strChar) {
            uppercased += normalized[idx + 1];
            idx += 2;
            continue;
          }
          idx++;
          continue;
        }

        if (ch === "'" || ch === '"') {
          inString = true;
          strChar = ch;
          uppercased += ch;
          idx++;
          continue;
        }

        // Try to match a keyword at current position
        let matched = false;
        const remaining = normalized.substring(idx);
        for (const kw of sortedKeywords) {
          const re = new RegExp(`^(${kw.replace(/\s+/g, '\\s+')})(?=[\\s(),;]|$)`, 'i');
          const m = remaining.match(re);
          if (m) {
            // Make sure we're at a word boundary (start or preceded by space/special)
            if (idx === 0 || /[\s(,;]/.test(normalized[idx - 1])) {
              uppercased += kw;
              idx += m[1].length;
              matched = true;
              break;
            }
          }
        }

        if (!matched) {
          uppercased += ch;
          idx++;
        }
      }

      // Step 3: Add newlines before major keywords
      let formatted = uppercased;
      for (const kw of sortedMajorKeywords) {
        // Add newline before the keyword (if not at start)
        const regex = new RegExp(`(?<!^)\\s+(?=${kw.replace(/\s+/g, '\\s+')}(?=[\\s(,;]|$))`, 'gi');
        formatted = formatted.replace(regex, '\n');
      }

      // Step 4: Indent lines after major keywords
      const lines = formatted.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let result = '';
      const indentKeywords = new Set(['SELECT', 'SET', 'VALUES']);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const firstWord = line.split(/[\s(]/)[0].toUpperCase();

        // Check if this line starts with a major keyword
        let isMajor = false;
        for (const kw of sortedMajorKeywords) {
          if (line.toUpperCase().startsWith(kw)) {
            isMajor = true;
            break;
          }
        }

        if (isMajor) {
          result += line + '\n';
        } else {
          result += indentStr + line + '\n';
        }
      }

      return result.trimEnd();
    } catch (e) {
      return 'Error formatting: ' + e.message;
    }
  }, []);

  const handleFormat = () => {
    setOutput(formatSql(input));
  };

  const handleCopy = () => {
    if (!output) {
      showToast('Nothing to copy');
      return;
    }
    copyToClipboard(output);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="split-pane">
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">SQL Input</span>
          <button className="btn btn-primary btn-sm" onClick={handleFormat}>
            ✨ Format SQL
          </button>
        </div>
        <div className="pane-body">
          <textarea
            className="textarea-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here...&#10;&#10;SELECT * FROM users WHERE id = 1"
            spellCheck={false}
          />
        </div>
      </div>
      <div className="pane">
        <div className="pane-header">
          <span className="pane-title">Formatted Output</span>
          <button className="btn btn-ghost btn-sm" onClick={handleCopy}>📋 Copy</button>
        </div>
        <div className="pane-body">
          <pre className="code-output">{output || 'Formatted SQL will appear here...'}</pre>
        </div>
      </div>
    </div>
  );
}
