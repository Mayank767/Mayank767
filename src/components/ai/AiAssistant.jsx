import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function AiAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const newMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Append an empty assistant message to hold the stream
      setMessages((prev) => [...prev, { role: 'assistant', content: '', reasoning: '' }]);

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let done = false;
      let currentContent = '';
      let currentReasoning = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta || {};
                
                if (delta.reasoning_content) {
                  currentReasoning += delta.reasoning_content;
                }
                if (delta.content) {
                  currentContent += delta.content;
                }

                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  last.content = currentContent;
                  last.reasoning = currentReasoning;
                  return updated;
                });
              } catch(err) {
                // Ignore chunk parse errors
              }
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        last.content = `**Error:** ${err.message}`;
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="tool-container" style={{ display: 'flex', flexDirection: 'column', height: '70vh', minHeight: '500px' }}>
      <div className="chat-history" style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', marginBottom: '20px', border: '1px solid var(--border-primary)' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🤖</span>
            <h2 style={{ color: 'var(--text-heading)' }}>NVIDIA Nemotron AI</h2>
            <p>Ask me anything! I can think step-by-step and write code.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%',
                padding: '15px',
                borderRadius: 'var(--radius-lg)',
                background: msg.role === 'user' ? 'var(--accent-cyan-dim)' : 'var(--bg-body)',
                border: msg.role === 'user' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-primary)',
                color: 'var(--text-primary)'
              }}>
                {msg.role === 'assistant' && msg.reasoning && (
                  <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--accent-cyan)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>🧠 Thinking...</strong>
                    <ReactMarkdown>{msg.reasoning}</ReactMarkdown>
                  </div>
                )}
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content || (msg.role === 'assistant' && isTyping ? '...' : '')}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Message NVIDIA Nemotron..." 
          className="input-field" 
          style={{ flex: 1 }}
          disabled={isTyping}
        />
        <button type="submit" className="primary-btn" disabled={isTyping || !input.trim()}>
          {isTyping ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
