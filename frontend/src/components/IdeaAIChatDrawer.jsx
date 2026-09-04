import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAboutIdea } from '../services/api';

export default function IdeaAIChatDrawer({ ideaContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: "👋 Hi! I'm your Gemini Copilot. I've reviewed your ML success prediction, 7-dimension scores, and market data. What strategic questions can I answer about this startup idea?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await chatAboutIdea(ideaContext, messages, text);
      const replyText = res.data?.reply || "I've reviewed your request. Could you clarify your target demographic or go-to-market plan?";
      setMessages((prev) => [...prev, { sender: 'copilot', text: replyText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'copilot', text: "⚠️ Could not connect to Gemini API. Please ensure your backend server is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "💡 How to raise ML success rate?",
    "🎯 What are my top 3 risks?",
    "🚀 Draft an investor elevator pitch",
    "💰 Recommend seed funding target",
  ];

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.85rem 1.4rem',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.5)',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '0.95rem',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>💬</span>
        <span>{isOpen ? 'Close Copilot' : 'Talk with AI Copilot'}</span>
      </motion.button>

      {/* ── Slide-in Chat Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              bottom: '85px',
              right: '24px',
              width: '420px',
              maxWidth: 'calc(100vw - 48px)',
              height: '560px',
              maxHeight: 'calc(100vh - 120px)',
              background: '#0b1329',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.65)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1000,
              overflow: 'hidden',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.1))',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
                    IDEAOS Copilot
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#06b6d4' }}>
                    Gemini 3.6 Flash Active
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '0.2rem 0.5rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div
              style={{
                padding: '0.65rem 1rem',
                background: 'rgba(15, 23, 42, 0.5)',
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    color: '#cbd5e1',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = 'rgba(6, 182, 212, 0.15)')}
                  onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.05)')}
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div
              style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(30, 41, 59, 0.9)',
                    color: '#f8fafc',
                    fontSize: '0.86rem',
                    lineHeight: '1.5',
                    border: m.sender === 'copilot' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.65rem 1rem',
                    borderRadius: '14px',
                    background: 'rgba(30, 41, 59, 0.9)',
                    color: '#06b6d4',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>⚡ Thinking with Gemini...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '0.85rem 1rem',
                background: 'rgba(15, 23, 42, 0.9)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <input
                type="text"
                placeholder="Ask Gemini about your idea..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: '#0f172a',
                  color: '#f8fafc',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputValue.trim()}
                style={{
                  padding: '0.65rem 1.1rem',
                  borderRadius: '10px',
                  background: inputValue.trim() ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255, 255, 255, 0.05)',
                  color: inputValue.trim() ? '#fff' : '#64748b',
                  border: 'none',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}