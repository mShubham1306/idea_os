import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import DashboardCard from '../components/DashboardCard';
import ChartBox from '../components/ChartBox';
import Loader from '../components/Loader';
import { getDashboardInsights, getHistory } from '../services/api';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

const chartColors = {
  primary: '#7c3aed',
  secondary: '#3b82f6',
  accent: '#06d6a0',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};

const doughnutColors = [
  '#7c3aed', '#3b82f6', '#06d6a0', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6', '#f97316',
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          getDashboardInsights(),
          getHistory(),
        ]);
        setStats(statsRes.data);
        setHistory(historyRes.data);
      } catch (e) {
        // use fallback demo data
        setStats({
          total_ideas: 25,
          average_score: 7.92,
          top_category: ['HealthTech', 4],
          top_keywords: [['ai', 8], ['platform', 6], ['health', 4], ['data', 3], ['automation', 3]],
          history: [
            { date: '2026-03-11', avg_score: 7.5 },
            { date: '2026-03-12', avg_score: 8.0 },
            { date: '2026-03-13', avg_score: 7.2 },
            { date: '2026-03-14', avg_score: 8.3 },
            { date: '2026-03-15', avg_score: 7.8 },
            { date: '2026-03-16', avg_score: 8.1 },
            { date: '2026-03-17', avg_score: 7.9 },
          ],
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
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  // Line chart
  const lineData = {
    labels: (stats?.history || []).map((h) => {
      const d = new Date(h.date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Avg Score',
        data: (stats?.history || []).map((h) => h.avg_score),
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 42, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 10,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
  };

  // Doughnut chart
  const catDist = stats?.category_distribution || [];
  const doughnutData = {
    labels: catDist.map((c) => c.category),
    datasets: [
      {
        data: catDist.map((c) => c.count),
        backgroundColor: doughnutColors.slice(0, catDist.length),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
    },
  };

  const topCat = stats?.top_category;
  const topCategoryName = Array.isArray(topCat) ? topCat[0] : topCat || 'N/A';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your startup idea analysis metrics</p>
      </div>

      {/* Stat cards */}
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DashboardCard title="Total Ideas" value={stats?.total_ideas || 0} icon="💡" iconColor="purple" trend="+5" trendDir="up" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DashboardCard title="Average Score" value={`${stats?.average_score || 0}/10`} icon="⭐" iconColor="orange" trend="+0.3" trendDir="up" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <DashboardCard title="Top Category" value={topCategoryName} icon="🏆" iconColor="green" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <DashboardCard title="Success Rate" value="76%" icon="📈" iconColor="blue" trend="+2%" trendDir="up" />
        </motion.div>
      </div>

      {/* Charts */}
      <div className="chart-grid" style={{ marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ChartBox title="Score Trend (Last 7 Days)">
            <Line data={lineData} options={lineOptions} />
          </ChartBox>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <ChartBox title="Category Distribution">
            <div style={{ maxWidth: 280, margin: '0 auto' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </ChartBox>
        </motion.div>
      </div>

      {/* Top Keywords */}
      {stats?.top_keywords && stats.top_keywords.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <ChartBox title="Top Keywords">
            <div className="keyword-pills">
              {stats.top_keywords.map(([kw, count], i) => (
                <span key={i} className="keyword-pill">{kw} ({count})</span>
              ))}
            </div>
          </ChartBox>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Dashboard;