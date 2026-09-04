import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useActiveIdea } from '../context/IdeaContext';
import PowerBIAnalytics from '../components/PowerBIAnalytics';

export default function PowerBIPage() {
  const { activeIdea } = useActiveIdea();
  const idea = activeIdea.idea || {};
  const detailed = activeIdea.detailed_analysis || {};
  const mlPrediction = activeIdea.ml_prediction || {};
  const geminiAudit = activeIdea.gemini_audit || {};
  const detectedSector = activeIdea.detected_sector || idea.category || 'General';

  return (
    <motion.div
      className="powerbi-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ paddingBottom: '3rem' }}
    >
      {/* ── Header Ribbon ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              PowerBI Visual Analytics Hub
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            Deep market intelligence, valuation histograms, and benchmark comparisons for:
            <strong style={{ color: '#38bdf8', marginLeft: '0.4rem' }}>
              "{idea.title || idea.description?.slice(0, 60) || 'Active Startup Concept'}"
            </strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            to="/analysis"
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
          >
            📋 Executive View
          </Link>
          <Link
            to="/submit"
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
          >
            + Analyze New Idea
          </Link>
        </div>
      </div>

      {/* ── Full PowerBI Analytics Component ── */}
      <PowerBIAnalytics
        mlPrediction={mlPrediction}
        geminiAudit={geminiAudit}
        detailed={detailed}
        scoreData={activeIdea}
        sector={detectedSector}
      />
    </motion.div>
  );
}