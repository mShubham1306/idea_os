import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ─── Quality badge color map ────────────────────────────── */
const qualityConfig = {
  Vague:    { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: '⚡ Vague Idea' },
  Basic:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: '📝 Basic Concept' },
  Good:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', label: '✅ Good Detail' },
  Detailed: { color: '#06d6a0', bg: 'rgba(6,214,160,0.15)', label: '🌟 Detailed' },
};

function Analysis() {
  const location = useLocation();
  const data = location.state || {};

  const report = data.report || {};
  const idea = data.idea || {};
  const detailed = data.detailed_analysis || {};
  const score = data.score || report.score || 0;
  const sentiment = data.sentiment || report.sentiment || 'neutral';
  const breakdownList = data.score_breakdown || [];
  const keywords = report.keywords ? report.keywords.split(',').filter(Boolean) : [];
  const execPlan = data.execution_plan || report.execution_plan || '';
  const summary = data.summary || detailed.summary || '';
  const ideaQuality = data.idea_quality || 'Basic';
  const improvementTips = data.improvement_tips || [];
  const scoringExplanations = data.scoring_explanations || {};
  const dimensionInfo = data.dimension_info || {};
  const scoreComponents = data.score_components || {};
  const detectedSector = data.detected_sector || 'General';
  const refinedIdea = detailed.refined_idea || '';

  // Score circle params
  const circumference = 2 * Math.PI * 70;
  const scorePercent = (score / 10) * 100;
  const dashOffset = circumference - (scorePercent / 100) * circumference;

  const qConfig = qualityConfig[ideaQuality] || qualityConfig.Basic;

  // Max values for each dimension for progress bars
  const maxValues = {
    keyword_diversity: 1.5, description_quality: 1.5, market_signals: 1.5,
    innovation: 1.5, feasibility: 1.0, market_alignment: 1.5, market_trend: 1.0,
  };

  if (!data || (!data.report && !data.score)) {
    return (
      <motion.div className="analysis-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No Analysis Data</h3>
          <p>Submit an idea first to see its analysis results.</p>
          <Link to="/submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Submit an Idea
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="analysis-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1>AI Analysis Results</h1>
        <p>{idea.description?.slice(0, 120)}{(idea.description?.length || 0) > 120 ? '...' : ''}</p>
      </div>

      {/* ═══ Executive Summary ═══════════════════════════════════ */}
      <motion.div
        className="glass-card summary-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="summary-header">
          <div className="summary-title-row">
            <h2>📋 Executive Summary</h2>
            <div className="summary-badges">
              <span
                className="idea-quality-badge"
                style={{ color: qConfig.color, background: qConfig.bg, borderColor: qConfig.color + '40' }}
              >
                {qConfig.label}
              </span>
              <span className="sector-badge">🎯 {detectedSector}</span>
            </div>
          </div>
        </div>
        <p className="summary-text">{summary}</p>
      </motion.div>

      {/* ═══ Score + AI Metrics Row ═══════════════════════════════ */}
      <div className="analysis-grid">
        <motion.div
          className="glass-card analysis-score-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="score-ring">
            <svg viewBox="0 0 160 160">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={score >= 6 ? '#10b981' : score >= 4 ? '#f59e0b' : '#f43f5e'} />
                  <stop offset="100%" stopColor={score >= 6 ? '#06b6d4' : score >= 4 ? '#fb923c' : '#dc2626'} />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="70" className="ring-bg" />
              <circle
                cx="80" cy="80" r="70"
                className="ring-fill"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="score-number">
              <span>{score}</span>
              <span className="score-label">out of 10</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className={`sentiment-badge ${sentiment}`}>
              {sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😟' : '😐'} {sentiment}
            </span>
            {detailed.risk_level && (
              <span className={`score-badge ${detailed.risk_level === 'Low' ? 'high' : detailed.risk_level === 'High' ? 'low' : 'medium'}`}>
                Risk: {detailed.risk_level}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          className="glass-card analysis-details-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* AI Metrics */}
          {detailed.innovation != null && (
            <div className="analysis-section">
              <h3>AI Metrics</h3>
              {[
                { label: 'Innovation', value: detailed.innovation, color: detailed.innovation >= 60 ? '#10b981' : detailed.innovation >= 40 ? '#f59e0b' : '#f43f5e' },
                { label: 'Market Demand', value: detailed.market_demand, color: detailed.market_demand >= 60 ? '#06b6d4' : detailed.market_demand >= 40 ? '#fb923c' : '#dc2626' },
                { label: 'Scalability', value: detailed.scalability, color: detailed.scalability >= 60 ? '#34d399' : detailed.scalability >= 40 ? '#fbbf24' : '#f87171' },
              ].map((m, i) => (
                <div className="metric-bar" key={i}>
                  <div className="metric-bar-header">
                    <span className="metric-bar-label">{m.label}</span>
                    <span className="metric-bar-value">{m.value}%</span>
                  </div>
                  <div className="metric-bar-track">
                    <motion.div
                      className="metric-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 1 }}
                      style={{ background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Info */}
          <div className="analysis-section">
            <h3>Quick Info</h3>
            <div className="quick-info-grid">
              {detailed.target_audience && (
                <div className="quick-info-item">
                  <span className="qi-label">🎯 Target Audience</span>
                  <span className="qi-value">{detailed.target_audience}</span>
                </div>
              )}
              {detailed.monetization && (
                <div className="quick-info-item">
                  <span className="qi-label">💰 Monetization</span>
                  <span className="qi-value">{detailed.monetization}</span>
                </div>
              )}
              {detailed.competitive_advantage && (
                <div className="quick-info-item">
                  <span className="qi-label">🏆 Competitive Advantage</span>
                  <span className="qi-value">{detailed.competitive_advantage}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ What We Analyzed — 7 Scoring Dimensions ═════════════ */}
      {Object.keys(scoreComponents).length > 0 && (
        <motion.div
          className="glass-card what-analyzed-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="section-heading">🔬 What We Analyzed</h3>
          <p className="section-subheading">
            Your idea was evaluated across 7 scoring dimensions. Each one contributes to the overall score.
          </p>
          <div className="what-analyzed-grid">
            {Object.entries(scoreComponents).map(([key, val], i) => {
              const info = dimensionInfo[key] || {};
              const explanation = scoringExplanations[key] || '';
              const maxVal = maxValues[key] || 1.5;
              const pct = Math.min((val / maxVal) * 100, 100);

              return (
                <motion.div
                  key={key}
                  className="dimension-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.07 }}
                >
                  <div className="dim-header">
                    <span className="dim-icon">{info.icon || '📌'}</span>
                    <div className="dim-title-group">
                      <span className="dim-title">{info.title || key}</span>
                      <span className="dim-score">{val} / {maxVal}</span>
                    </div>
                  </div>
                  <div className="dim-bar-track">
                    <motion.div
                      className="dim-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                      style={{
                        background: pct >= 70
                          ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                          : pct >= 40
                          ? 'linear-gradient(90deg, #f59e0b, #fb923c)'
                          : 'linear-gradient(90deg, #f43f5e, #dc2626)',
                      }}
                    />
                  </div>
                  <p className="dim-what">{info.what || ''}</p>
                  {explanation && <p className="dim-explanation">{explanation}</p>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ═══ Improvement Tips (for vague/basic ideas) ════════════ */}
      {improvementTips.length > 0 && (
        <motion.div
          className="glass-card improvement-tips-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="section-heading">💡 How to Improve Your Score</h3>
          <p className="section-subheading">
            Your idea is classified as <strong style={{ color: qConfig.color }}>{ideaQuality}</strong>.
            Here's how you can get a better analysis:
          </p>
          <div className="tips-list">
            {improvementTips.map((tip, i) => (
              <motion.div
                key={i}
                className="tip-item"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ Refined Idea Suggestion ═════════════════════════════ */}
      {refinedIdea && refinedIdea !== idea.description && ideaQuality !== 'Detailed' && (
        <motion.div
          className="glass-card refined-idea-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="section-heading">✨ Refined Idea Suggestion</h3>
          <p className="section-subheading">
            Here's an improved version of your idea that could score higher:
          </p>
          <div className="refined-idea-text">{refinedIdea}</div>
        </motion.div>
      )}

      {/* ═══ Keywords ════════════════════════════════════════════ */}
      {keywords.length > 0 && (
        <motion.div
          className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            🔑 Extracted Keywords
          </h3>
          <div className="keyword-pills">
            {keywords.map((kw, i) => (
              <motion.span
                key={i}
                className="keyword-pill"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.05 }}
              >
                {kw.trim()}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ Strengths & Weaknesses ══════════════════════════════ */}
      {(detailed.strengths || detailed.weaknesses) && (
        <div className="sw-grid">
          {detailed.strengths && (
            <motion.div
              className="glass-card" style={{ padding: '1.5rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--accent)' }}>✅ Strengths</h3>
              <ul className="detail-list">
                {detailed.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </motion.div>
          )}
          {detailed.weaknesses && (
            <motion.div
              className="glass-card" style={{ padding: '1.5rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--warning)' }}>⚠️ Weaknesses</h3>
              <ul className="detail-list">
                {detailed.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {/* ═══ Score Breakdown ═════════════════════════════════════ */}
      {breakdownList.length > 0 && (
        <motion.div
          className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            📊 Score Breakdown Summary
          </h3>
          <ul className="detail-list">
            {breakdownList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* ═══ Execution Plan ═════════════════════════════════════ */}
      {execPlan && (
        <motion.div
          className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            📋 Execution Plan & Market Analysis
          </h3>
          <div className="exec-plan">{execPlan}</div>
        </motion.div>
      )}

      {/* ═══ Recommendations ════════════════════════════════════ */}
      {detailed.recommendations && (
        <motion.div
          className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--info)' }}>
            🎯 Recommended Next Steps
          </h3>
          <ul className="detail-list">
            {detailed.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </motion.div>
      )}

      {/* ═══ Actions ════════════════════════════════════════════ */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/submit" className="btn btn-primary">Analyze Another Idea</Link>
        <Link to="/history" className="btn btn-secondary">View History</Link>
      </div>
    </motion.div>
  );
}

export default Analysis;