import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analyzeIdea } from '../services/api';
import AnimatedButton from '../components/AnimatedButton';
import Loader from '../components/Loader';

const CATEGORIES = [
  'FinTech', 'HealthTech', 'EdTech', 'SaaS', 'AI/ML',
  'E-Commerce', 'GreenTech', 'FoodTech', 'PropTech',
  'Social', 'AgriTech', 'Other',
];

export default function SubmitIdea() {
  const [idea, setIdea] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!idea.trim()) {
      setError('Please describe your startup idea');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await analyzeIdea(idea, category || undefined);
      navigate('/analysis', { state: res.data });
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <Loader text="AI is analyzing your idea... This may take a moment." />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="submit-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1>Submit Your Idea</h1>
        <p>Describe your startup idea and let AI analyze its potential</p>
      </div>

      <div className="glass-card submit-card">
        <div className="form-group">
          <label className="form-label">Startup Idea *</label>
          <textarea
            className="textarea"
            placeholder="Describe your startup idea in detail... Include the problem you're solving, your target audience, and your unique approach."
            rows={7}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <div className="char-counter">{idea.length} characters</div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category (optional)</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#ef4444',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </motion.div>
        )}

        <div className="submit-actions">
          <AnimatedButton onClick={handleSubmit} disabled={!idea.trim()}>
            🔍 Analyze with AI
          </AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => { setIdea(''); setCategory(''); setError(''); }}>
            Clear
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
}
