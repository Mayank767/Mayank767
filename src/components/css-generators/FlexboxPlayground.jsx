import React, { useState, useMemo } from 'react';

export default function FlexboxPlayground({ copyToClipboard, showToast }) {
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [alignContent, setAlignContent] = useState('stretch');
  const [gap, setGap] = useState('10');
  const [itemCount, setItemCount] = useState(5);

  const flexOptions = {
    'flex-direction': {
      value: flexDirection,
      setter: setFlexDirection,
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    'justify-content': {
      value: justifyContent,
      setter: setJustifyContent,
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    },
    'align-items': {
      value: alignItems,
      setter: setAlignItems,
      options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    },
    'flex-wrap': {
      value: flexWrap,
      setter: setFlexWrap,
      options: ['nowrap', 'wrap', 'wrap-reverse'],
    },
    'align-content': {
      value: alignContent,
      setter: setAlignContent,
      options: ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    },
    gap: {
      value: gap,
      setter: setGap,
      options: ['0', '4', '8', '10', '12', '16', '20', '24', '32'],
    },
  };

  const containerStyle = {
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    alignContent,
    gap: `${gap}px`,
    minHeight: '320px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
  };

  const cssCode = useMemo(() => {
    let lines = [
      `display: flex;`,
      `flex-direction: ${flexDirection};`,
      `justify-content: ${justifyContent};`,
      `align-items: ${alignItems};`,
      `flex-wrap: ${flexWrap};`,
    ];
    if (flexWrap !== 'nowrap') {
      lines.push(`align-content: ${alignContent};`);
    }
    lines.push(`gap: ${gap}px;`);
    return lines.join('\n');
  }, [flexDirection, justifyContent, alignItems, flexWrap, alignContent, gap]);

  const handleCopy = () => {
    try {
      copyToClipboard(cssCode);
      showToast('Flexbox CSS copied!');
    } catch {
      showToast('Failed to copy');
    }
  };

  const items = useMemo(() => {
    return Array.from({ length: itemCount }, (_, i) => i + 1);
  }, [itemCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Controls Panel */}
        <div className="controls-panel">
          <h3 className="controls-title">Flex Container Properties</h3>
          <div className="controls-grid">
            {Object.entries(flexOptions).map(([propName, { value, setter, options }]) => (
              <div key={propName}>
                <label className="label">{propName}</label>
                <select
                  className="select-field"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}{propName === 'gap' ? 'px' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Item count */}
            <div>
              <div className="slider-group">
                <div className="slider-label">
                  <span className="slider-label-text">Items</span>
                  <span className="slider-value">{itemCount}</span>
                </div>
                <input
                  type="range"
                  className="slider"
                  min="1"
                  max="12"
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="split-pane">
          {/* Preview */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Preview</span>
            </div>
            <div className="pane-body">
              <div className="flex-container-preview" style={containerStyle}>
                {items.map((num) => (
                  <div
                    key={num}
                    className="flex-item-preview"
                    style={{
                      minWidth: '60px',
                      textAlign: 'center',
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CSS Output */}
          <div className="pane">
            <div className="pane-header">
              <span className="pane-title">Generated CSS</span>
              <button className="btn btn-primary btn-sm" onClick={handleCopy}>
                📋 Copy CSS
              </button>
            </div>
            <div className="pane-body">
              <pre className="code-output">{`/* Flex Container */\n${cssCode}`}</pre>
            </div>
          </div>
        </div>
    </div>
  );
}
