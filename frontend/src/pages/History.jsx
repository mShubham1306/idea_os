import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getHistory } from '../services/api';
import Loader from '../components/Loader';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistory();
        setHistory(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreClass = (score) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  const getSentimentEmoji = (s) => {
    if (s === 'positive') return '😊';
    if (s === 'negative') return '😟';
    return '😐';
  };

  if (loading) return <Loader text="Loading history..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="page-header">
        <h1>Idea History</h1>
        <p>Review all previously analyzed startup ideas</p>
      </div>

      {history.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No Ideas Yet</h3>
          <p>Submit your first startup idea to see analysis history here.</p>
          <Link to="/submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Submit an Idea
          </Link>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0.5rem', overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Idea</th>
                <th>Category</th>
                <th>Score</th>
                <th>Sentiment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <motion.tr
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ maxWidth: 350 }}>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{item.title || item.idea?.slice(0, 60)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.idea?.slice(0, 80)}{(item.idea?.length || 0) > 80 ? '...' : ''}
                    </div>
                  </td>
                  <td>
                    <span className="keyword-pill">{item.category || 'General'}</span>
                  </td>
                  <td>
                    <span className={`score-badge ${getScoreClass(item.score)}`}>
                      {item.score}/10
                    </span>
                  </td>
                  <td>
                    <span className={`sentiment-badge ${item.sentiment || 'neutral'}`}>
                      {getSentimentEmoji(item.sentiment)} {item.sentiment || 'neutral'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default History;