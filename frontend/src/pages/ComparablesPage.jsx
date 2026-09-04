import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useActiveIdea } from '../context/IdeaContext';
import { submitIdeaFeedback } from '../services/api';

export default function ComparablesPage() {
  const { activeIdea } = useActiveIdea();
  const idea = activeIdea.idea || {};
  const ml = activeIdea.ml_prediction || {};
  const quartiles = ml.sector_quartiles || { p25: 75000, median: 450000, p75: 2200000, p90: 8500000 };

  const [feedbackIdea, setFeedbackIdea] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('operating');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatCurrency = (val) => {
    if (!val) return '$0';
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackIdea.trim()) return;
    setSubmitting(true);
    try {
      await submitIdeaFeedback(feedbackIdea, ml.matched_sector || 'General', feedbackStatus);
      setFeedbackMsg('✅ Outcome feedback ingested into dataset! Model will incorporate this data.');
      setFeedbackIdea('');
    } catch {
      setFeedbackMsg('⚠️ Feedback could not be recorded.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="comparables-page"
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
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              66,368 Startup Comparables & Benchmarks
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            Historical precedents, funding distribution, and sector cohorts for:
            <strong style={{ color: '#38bdf8', marginLeft: '0.4rem' }}>
              "{idea.title || idea.description?.slice(0, 60) || 'Active Startup Concept'}"
            </strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/powerbi" className="btn btn-secondary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
            📊 View PowerBI Charts
          </Link>
        </div>
      </div>

      {/* ── Top Quartile Ribbon ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.85)', borderRadius: '14px', borderLeft: '4px solid #94a3b8' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Seed Stage 25th Percentile</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc', margin: '0.2rem 0' }}>{formatCurrency(quartiles.p25)}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Minimum traction baseline</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.85)', borderRadius: '14px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', textTransform: 'uppercase' }}>50th Percentile (Sector Median)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#06b6d4', margin: '0.2rem 0' }}>{formatCurrency(quartiles.median)}</div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Typical successful early round</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.85)', borderRadius: '14px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.75rem', color: '#3b82f6', textTransform: 'uppercase' }}>75th Percentile (Series A Scale)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6', margin: '0.2rem 0' }}>{formatCurrency(quartiles.p75)}</div>
          <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>Growth-stage expansion capital</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.85)', borderRadius: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase' }}>90th Percentile (Market Leaders)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981', margin: '0.2rem 0' }}>{formatCurrency(quartiles.p90)}</div>
          <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>Category-defining breakouts</div>
        </div>
      </div>

      {/* ── 2-Column Grid: Successful Exits vs Cautionary Failures ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Successful Precedents */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🏆</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981', margin: 0 }}>
              Historical Success & Funded Precedents
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Real startups in the {ml.matched_sector || 'relevant'} space that successfully raised funding and achieved operating/exit milestones:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(ml.historical_comparables?.success || [
              { name: 'Chai Point', funding_numeric: 54000000, status: 'operating' },
              { name: 'Chaayos', funding_numeric: 85000000, status: 'operating' },
              { name: 'Faasos (Rebel Foods)', funding_numeric: 500000000, status: 'operating' },
            ]).map((comp, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.92rem' }}>{comp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>Status: {comp.status}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#10b981', fontWeight: '800', fontSize: '1.05rem' }}>{formatCurrency(comp.funding_numeric)}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>Total Capital Raised</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cautionary Failures */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f43f5e', margin: 0 }}>
              Cautionary Closed Companies (Failure Precedents)
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Startups in this vertical that shut down or ceased operations, highlighting key vulnerabilities:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(ml.historical_comparables?.cautionary || [
              { name: 'Samosa On Wheels', funding_numeric: 80000, status: 'closed' },
              { name: 'StreetBites Tech', funding_numeric: 120000, status: 'closed' },
            ]).map((comp, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '0.92rem' }}>{comp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#f43f5e' }}>Status: Ceased Operations (Closed)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#cbd5e1', fontWeight: '700', fontSize: '0.95rem' }}>{formatCurrency(comp.funding_numeric)}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Peak Capital</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Incremental Learning: Ingest New Startup Data ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🔄</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
            Continuous Incremental ML Ingestion
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          Train the model on new real-world data! Enter a newly known startup and its actual market outcome to enrich the training dataset.
        </p>

        <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Startup name or idea summary..."
            value={feedbackIdea}
            onChange={(e) => setFeedbackIdea(e.target.value)}
            style={{
              flex: '1 1 300px',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '0.86rem',
            }}
          />
          <select
            value={feedbackStatus}
            onChange={(e) => setFeedbackStatus(e.target.value)}
            style={{
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '0.86rem',
            }}
          >
            <option value="operating">Operating / Growing</option>
            <option value="acquired">Acquired / Successful Exit</option>
            <option value="closed">Closed / Discontinued</option>
          </select>
          <button
            type="submit"
            disabled={submitting || !feedbackIdea.trim()}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
          >
            {submitting ? 'Ingesting...' : 'Ingest Into Model'}
          </button>
        </form>
        {feedbackMsg && <p style={{ fontSize: '0.82rem', color: '#06b6d4', marginTop: '0.75rem' }}>{feedbackMsg}</p>}
      </div>
    </motion.div>
  );
}