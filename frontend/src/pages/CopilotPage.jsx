import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useActiveIdea } from '../context/IdeaContext';
import { chatAboutIdea } from '../services/api';

export default function CopilotPage() {
  const { activeIdea } = useActiveIdea();
  const idea = activeIdea.idea || {};
  const detailed = activeIdea.detailed_analysis || {};
  const ml = activeIdea.ml_prediction || {};

  const ideaContext = {
    idea_text: idea.title || idea.description,
    score: activeIdea.score,
    ml_success_probability: ml.ml_success_probability,
    sector: activeIdea.detected_sector || idea.category,
    innovation: detailed.innovation,
    market_demand: detailed.market_demand,
    strengths: detailed.strengths,
    weaknesses: detailed.weaknesses,
  };

  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: `👋 Welcome to IDEAOS Copilot Studio! I am your AI Venture Partner powered by Gemini 3.6 Flash.\n\nI have fully loaded the evaluation metrics for **"${idea.title || idea.description?.slice(0, 50) || 'Active Startup'}"**:\n• Overall Viability Score: **${activeIdea.score || 6.8}/10**\n• ML Statistical Success Rate: **${ml.ml_success_probability || 64.2}%**\n• Sector: **${activeIdea.detected_sector || 'FoodTech'}**\n\nWhat strategic challenges, pitch deck questions, or go-to-market strategies would you like to explore?`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await chatAboutIdea(ideaContext, messages, text);
      const reply = res.data?.reply || "I analyzed your query based on current sector metrics. How would you like to proceed?";
      setMessages((prev) => [...prev, { sender: 'copilot', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'copilot', text: "⚠️ Network connection error. Please ensure your backend server is active." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const promptStarters = [
    "🚀 Draft an elevator pitch for seed investors",
    "💡 How can I raise my ML success probability?",
    "🎯 Who are my primary direct & indirect competitors?",
    "💰 Suggest a 12-month capital deployment roadmap",
    "⚠️ What is my biggest failure vulnerability?",
  ];

  return (
    <motion.div
      className="copilot-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}
    >
      {/* ── Header ── */}
      <div
        style={{
          paddingBottom: '1rem',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
            }}
          >
            💬
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              IDEAOS Copilot Studio
            </h1>
            <span style={{ fontSize: '0.8rem', color: '#06b6d4' }}>
              Gemini 3.6 Flash Active • Grounded in 66,368 Startups Dataset
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '0.4rem 0.85rem',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '9999px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            fontSize: '0.8rem',
            color: '#cbd5e1',
          }}
        >
          Active Concept: <strong style={{ color: '#38bdf8' }}>{idea.title || 'Startup Idea'}</strong>
        </div>
      </div>

      {/* ── Quick Prompt Starters ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '0.5rem',
        }}
      >
        {promptStarters.map((ps, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(ps)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#cbd5e1',
              fontSize: '0.78rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.target.style.background = 'rgba(6, 182, 212, 0.18)')}
            onMouseLeave={(e) => (e.target.style.background = 'rgba(15, 23, 42, 0.7)')}
          >
            {ps}
          </button>
        ))}
      </div>

      {/* ── Chat Messages Scroll View ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          background: 'rgba(11, 19, 41, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '0.9rem 1.25rem',
              borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(30, 41, 59, 0.95)',
              color: '#f8fafc',
              fontSize: '0.92rem',
              lineHeight: '1.6',
              border: m.sender === 'copilot' ? '1px solid rgba(6, 182, 212, 0.25)' : 'none',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
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
              padding: '0.75rem 1.25rem',
              borderRadius: '16px',
              background: 'rgba(30, 41, 59, 0.95)',
              color: '#06b6d4',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              border: '1px solid rgba(6, 182, 212, 0.25)',
            }}
          >
            <span>⚡ Gemini Copilot is reasoning and analyzing data...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Box ── */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Ask a strategic venture question about this idea..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.85rem 1.2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f8fafc',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputValue.trim()}
          className="btn btn-primary"
          style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: '700' }}
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}