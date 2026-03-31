import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartBox from '../components/ChartBox';
import Loader from '../components/Loader';
import { getDashboardInsights } from '../services/api';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const barColors = [
  '#7c3aed', '#3b82f6', '#06d6a0', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6', '#f97316',
];

function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardInsights();
        setData(res.data);
      } catch (e) {
        // fallback
        setData({
          total_ideas: 25,
          average_score: 7.92,
          top_keywords: [['ai', 8], ['platform', 6], ['health', 4], ['data', 3], ['automation', 3]],
          category_distribution: [
            { category: 'HealthTech', count: 4 },
            { category: 'FinTech', count: 3 },
            { category: 'SaaS', count: 3 },
            { category: 'GreenTech', count: 3 },
            { category: 'AI/ML', count: 3 },
            { category: 'EdTech', count: 2 },
            { category: 'E-Commerce', count: 3 },
            { category: 'Other', count: 4 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading insights..." />;

  const catDist = data?.category_distribution || [];
  const topKw = data?.top_keywords || [];

  // Bar chart for categories
  const barData = {
    labels: catDist.map((c) => c.category),
    datasets: [
      {
        label: 'Ideas',
        data: catDist.map((c) => c.count),
        backgroundColor: barColors.slice(0, catDist.length),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 42, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 },
      },
    },
  };

  // Keyword horizontal bar
  const kwBarData = {
    labels: topKw.map(([kw]) => kw),
    datasets: [
      {
        label: 'Frequency',
        data: topKw.map(([, c]) => c),
        backgroundColor: '#7c3aed',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const kwBarOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 42, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', stepSize: 1 },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#f1f5f9', font: { size: 12 } },
      },
    },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="page-header">
        <h1>Insights</h1>
        <p>Deep dive into your idea portfolio analytics</p>
      </div>

      {/* Summary cards */}
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <motion.div
          className="glass-card insight-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>📊 Total Ideas</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="gradient-text">
            {data?.total_ideas || 0}
          </div>
        </motion.div>
        <motion.div
          className="glass-card insight-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>⭐ Average Score</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="gradient-text">
            {data?.average_score || 0}
          </div>
        </motion.div>
        <motion.div
          className="glass-card insight-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>🏷️ Categories</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="gradient-text">
            {catDist.length}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="chart-grid" style={{ marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <ChartBox title="Ideas by Category">
            <Bar data={barData} options={barOptions} />
          </ChartBox>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ChartBox title="Top Keywords">
            <Bar data={kwBarData} options={kwBarOptions} />
          </ChartBox>
        </motion.div>
      </div>

      {/* Keyword Pills */}
      {topKw.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <ChartBox title="Trending Keywords">
            <div className="keyword-pills">
              {topKw.map(([kw, count], i) => (
                <motion.span
                  key={i}
                  className="keyword-pill"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  style={{ fontSize: `${0.75 + count * 0.05}rem` }}
                >
                  {kw} ({count})
                </motion.span>
              ))}
            </div>
          </ChartBox>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Insights;