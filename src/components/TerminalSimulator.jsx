import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TerminalSimulator() {
  const [step, setStep] = useState(0); 
  const [typedCommand, setTypedCommand] = useState('');
  
  const fullCommand = '{"name":"ZeroApi","tools":67,"type":"Web","private":true}';

  useEffect(() => {
    let timeout;
    if (step === 0) {
      // Type the raw data
      if (typedCommand.length < fullCommand.length) {
        timeout = setTimeout(() => {
          setTypedCommand(fullCommand.substring(0, typedCommand.length + 1));
        }, Math.random() * 50 + 20); // Fast typing speed
      } else {
        timeout = setTimeout(() => setStep(1), 500); // Wait after typing before formatting
      }
    } else if (step === 1) {
      // Show formatting process
      timeout = setTimeout(() => setStep(2), 600);
    } else if (step === 2) {
      // Wait a few seconds, then reset
      timeout = setTimeout(() => {
        setStep(0);
        setTypedCommand('');
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [step, typedCommand, fullCommand]);

  return (
    <motion.div 
      className="terminal-simulator"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        background: 'rgba(10, 10, 15, 0.95)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 232, 122, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 232, 122, 0.1)',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono, monospace)',
        textAlign: 'left'
      }}
    >
      {/* Mac-style Window Bar (No CLI text) */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'rgba(0, 0, 0, 0.5)', borderBottom: '1px solid rgba(0, 232, 122, 0.15)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: '#8b949e', fontSize: '13px', letterSpacing: '1px', fontWeight: '500' }}>
          JSON Formatter (Local Mode)
        </div>
      </div>
      
      {/* Editor Content */}
      <div style={{ padding: '24px', fontSize: '15px', lineHeight: '1.6', minHeight: '320px' }}>
        <div style={{ color: '#8b949e', marginBottom: '8px', fontSize: '13px' }}>// Input: Raw Unformatted JSON</div>
        <div style={{ display: 'flex', color: '#ff7b72' }}>
          <span>
            {typedCommand}
            {step === 0 && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: '8px', height: '18px', background: '#00e87a', marginLeft: '4px', verticalAlign: 'text-bottom' }} />}
          </span>
        </div>
        
        {step >= 1 && (
          <div style={{ color: '#8b949e', marginTop: '24px', fontSize: '14px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <span style={{ color: '#d2a8ff' }}>[Action]</span> Formatting locally in your browser...
          </div>
        )}
        
        {step >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '16px', color: '#e6edf3' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '14px', background: 'transparent', padding: 0, border: 'none' }}>
              <span style={{ color: '#ff7b72' }}>{'{'}</span>{'\n'}
              {'  '}<span style={{ color: '#79c0ff' }}>"name"</span>: <span style={{ color: '#a5d6ff' }}>"ZeroApi"</span>,{'\n'}
              {'  '}<span style={{ color: '#79c0ff' }}>"tools"</span>: <span style={{ color: '#79c0ff' }}>67</span>,{'\n'}
              {'  '}<span style={{ color: '#79c0ff' }}>"type"</span>: <span style={{ color: '#a5d6ff' }}>"Web"</span>,{'\n'}
              {'  '}<span style={{ color: '#79c0ff' }}>"private"</span>: <span style={{ color: '#79c0ff' }}>true</span>{'\n'}
              <span style={{ color: '#ff7b72' }}>{'}'}</span>
            </pre>
            <div style={{ marginTop: '12px', color: '#00e87a', fontSize: '13px', fontWeight: 'bold' }}>✓ Formatted in 0.2ms</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
