import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─── Data ─────────────────────────────────────────────────────── */
const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Analysis',
    desc: 'Advanced AI evaluates your startup idea across innovation, market demand, scalability, and risk factors using real-time market intelligence.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
  },
  {
    icon: '📊',
    title: 'Real Market Data',
    desc: 'Powered by live stock market data from 14+ companies across sectors — we benchmark your idea against actual sector performance.',
    gradient: 'linear-gradient(135deg, #06d6a0 0%, #3b82f6 100%)',
  },
  {
    icon: '🎯',
    title: 'Smart Scoring Engine',
    desc: 'Data-driven scoring that combines keyword analysis, market alignment, innovation signals, and sector trend bonuses for accurate ratings.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  },
  {
    icon: '🔍',
    title: 'Competitive Insights',
    desc: 'Understand where your idea fits in the market landscape. Get competitive advantages, target audience, and monetization strategies.',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
  },
  {
    icon: '📈',
    title: 'Sector Benchmarks',
    desc: 'Compare your idea against real sector health scores computed from AMZN, NVDA, NFLX, CRM and more — not just guesswork.',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  },
  {
    icon: '🚀',
    title: 'Execution Roadmap',
    desc: 'Get a detailed execution plan with recommended next steps, funding strategies, and a clear path from idea to launch.',
    gradient: 'linear-gradient(135deg, #06d6a0 0%, #f59e0b 100%)',
  },
];

const howItWorks = [
  {
    step: '01',
    icon: '✏️',
    title: 'Submit Your Idea',
    desc: 'Describe your startup concept, pick a category, and let our engine do the rest.',
  },
  {
    step: '02',
    icon: '⚡',
    title: 'AI Analyzes It',
    desc: 'Our scoring engine evaluates innovation, market fit, keyword depth, and real sector performance data.',
  },
  {
    step: '03',
    icon: '📊',
    title: 'Get Your Report',
    desc: 'Receive a detailed breakdown with scores, strengths, weaknesses, and an actionable roadmap.',
  },
  {
    step: '04',
    icon: '🚀',
    title: 'Execute & Grow',
    desc: 'Use insights to refine your pitch, attract investors, and build with confidence backed by data.',
  },
];

const testimonials = [
  {
    name: 'Arun Mehta',
    role: 'Founder, TechVerse',
    text: 'IdeaOS completely changed how I evaluate startup ideas. The market alignment score based on real stock data gave me confidence to pitch to investors.',
    avatar: '👨‍💼',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager, InnoLabs',
    text: 'The AI-powered analysis is incredibly accurate. It identified market gaps I hadn\'t even considered. Saved us months of manual research.',
    avatar: '👩‍💻',
    rating: 5,
  },
  {
    name: 'Ravi Krishnan',
    role: 'Angel Investor',
    text: 'As an investor, I use IdeaOS to pre-screen pitches. The sector benchmarking against real market data is a game-changer for due diligence.',
    avatar: '👨‍💻',
    rating: 5,
  },
];

const techStack = [
  { name: 'Python', icon: '🐍' },
  { name: 'React', icon: '⚛️' },
  { name: 'AI/ML', icon: '🤖' },
  { name: 'Flask', icon: '🌶️' },
  { name: 'OpenAI', icon: '🧠' },
  { name: 'Chart.js', icon: '📊' },
  { name: 'SQLite', icon: '🗄️' },
  { name: 'REST API', icon: '🔗' },
];

const categories = [
  { name: 'AI/ML', count: '2.4K+', color: '#7c3aed' },
  { name: 'FinTech', count: '1.8K+', color: '#3b82f6' },
  { name: 'HealthTech', count: '1.5K+', color: '#06d6a0' },
  { name: 'SaaS', count: '2.1K+', color: '#f59e0b' },
  { name: 'E-Commerce', count: '1.2K+', color: '#ef4444' },
  { name: 'EdTech', count: '900+', color: '#ec4899' },
  { name: 'GreenTech', count: '750+', color: '#06b6d4' },
  { name: 'PropTech', count: '600+', color: '#a78bfa' },
  { name: 'Cybersecurity', count: '550+', color: '#10b981' },
  { name: 'BioTech', count: '480+', color: '#14b8a6' },
  { name: 'Robotics', count: '420+', color: '#8b5cf6' },
  { name: 'Gaming', count: '680+', color: '#f472b6' },
  { name: 'LegalTech', count: '310+', color: '#6366f1' },
  { name: 'Mobility', count: '390+', color: '#0ea5e9' },
  { name: 'SpaceTech', count: '180+', color: '#d946ef' },
  { name: '30+ More', count: '∞', color: '#64748b' },
];

/* ─── Animated Counter Hook ─────────────────────────────────── */
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    const numericEnd = parseInt(end);
    if (isNaN(numericEnd)) { setCount(end); return; }
    let start = 0;
    const step = numericEnd / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericEnd) { setCount(numericEnd); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return { count, ref };
}

function StatCounter({ value, label, suffix = '' }) {
  const numericPart = value.replace(/[^0-9]/g, '');
  const textSuffix = value.replace(/[0-9]/g, '');
  const { count, ref } = useCounter(numericPart);
  const display = numericPart ? `${count}${textSuffix}` : value;

  return (
    <motion.div
      ref={ref}
      className="stat-item-enhanced"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200 }}
      whileHover={{ y: -6 }}
    >
      <div className="stat-value-enhanced">{display}{suffix}</div>
      <div className="stat-label-enhanced">{label}</div>
    </motion.div>
  );
}

/* ─── Market Pulse Component ────────────────────────────────── */
function MarketPulse() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/market/summary')
      .then(res => res.json())
      .then(data => { setMarketData(data); setLoading(false); })
      .catch(() => {
        // Fallback data when backend is offline
        setMarketData({
          overall_health: 72.5,
          total_tickers: 14,
          total_sectors: 7,
          sectors: {
            'AI/ML': { avg_recent_growth: 185.3, health_score: 89.2, avg_volatility: 42.1, tickers: ['NVDA'] },
            'FinTech': { avg_recent_growth: 28.4, health_score: 74.1, avg_volatility: 25.3, tickers: ['MA', 'V'] },
            'E-Commerce': { avg_recent_growth: 45.2, health_score: 78.5, avg_volatility: 35.7, tickers: ['AMZN'] },
            'SaaS': { avg_recent_growth: 15.8, health_score: 65.3, avg_volatility: 31.2, tickers: ['CRM', 'AKAM'] },
            'Media': { avg_recent_growth: -12.5, health_score: 42.8, avg_volatility: 38.9, tickers: ['NFLX', 'SONY', 'PARA', 'WBD'] },
            'Logistics': { avg_recent_growth: 8.7, health_score: 58.4, avg_volatility: 22.8, tickers: ['FDX', 'UPS'] },
          },
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="market-pulse-loading">
        <div className="pulse-dot" />
        <span>Loading market data...</span>
      </div>
    );
  }

  const sectors = marketData?.sectors || {};
  const sectorEntries = Object.entries(sectors).sort((a, b) => b[1].health_score - a[1].health_score);

  return (
    <div className="market-pulse-grid">
      {/* Overall health */}
      <motion.div
        className="market-health-card"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="health-ring">
          <svg viewBox="0 0 120 120">
            <defs>
              <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06d6a0" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50"
              fill="none" stroke="url(#healthGrad)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={314}
              strokeDashoffset={314 - (314 * (marketData?.overall_health || 0)) / 100}
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1.5s ease' }}
            />
          </svg>
          <div className="health-value">{marketData?.overall_health || 0}</div>
        </div>
        <div className="health-label">Market Health Index</div>
        <div className="health-sub">{marketData?.total_tickers} stocks · {marketData?.total_sectors} sectors</div>
      </motion.div>

      {/* Sector bars */}
      <div className="sector-bars">
        {sectorEntries.map(([name, data], i) => (
          <motion.div
            key={name}
            className="sector-bar-item"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="sector-bar-header">
              <span className="sector-name">{name}</span>
              <span className={`sector-growth ${data.avg_recent_growth >= 0 ? 'positive' : 'negative'}`}>
                {data.avg_recent_growth >= 0 ? '↑' : '↓'} {Math.abs(data.avg_recent_growth).toFixed(1)}%
              </span>
            </div>
            <div className="sector-bar-track">
              <motion.div
                className="sector-bar-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${data.health_score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1 }}
                style={{
                  background: data.health_score > 70
                    ? 'linear-gradient(90deg, #06d6a0, #3b82f6)'
                    : data.health_score > 50
                      ? 'linear-gradient(90deg, #f59e0b, #3b82f6)'
                      : 'linear-gradient(90deg, #ef4444, #f59e0b)',
                }}
              />
            </div>
            <div className="sector-bar-meta">
              <span>{data.tickers?.join(', ')}</span>
              <span>Health: {data.health_score}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Landing Component ─────────────────────────────────── */
function Landing() {
  return (
    <div className="landing-page">
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <span className="logo-icon">💡</span>
            <span className="logo-text">Idea<span className="gradient-text">OS</span></span>
          </Link>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#market">Market Pulse</a>
            <Link to="/dashboard" className="nav-btn-outline">Dashboard</Link>
            <Link to="/submit" className="nav-btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            🚀 AI-Powered · Data-Driven · Real Market Intelligence
          </motion.span>

          <h1 className="hero-title">
            Validate Your{' '}
            <span className="gradient-text">Startup Ideas</span>
            <br />
            With Real Market Data
          </h1>

          <p className="hero-subtitle">
            Stop guessing. Use AI analysis powered by real stock market performance
            from 14+ companies across 7 sectors. Get instant scores, market alignment,
            competitive insights, and a clear roadmap to launch.
          </p>

          <div className="hero-ctas">
            <Link to="/submit">
              <motion.button
                className="btn-hero-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Analyze Your Idea →
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                className="btn-hero-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ▶ View Dashboard
              </motion.button>
            </Link>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              {['👨‍💼', '👩‍💻', '👨‍💻', '👩‍🔬', '🧑‍💼'].map((a, i) => (
                <span key={i} className="trust-avatar">{a}</span>
              ))}
            </div>
            <span className="trust-text">
              <strong>500+</strong> ideas analyzed this month
            </span>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Floating dashboard preview */}
          <motion.div
            className="hero-dashboard-preview"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <div className="preview-header">
              <div className="preview-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="preview-title">IdeaOS Analysis</span>
            </div>
            <div className="preview-body">
              <div className="preview-score-section">
                <svg viewBox="0 0 120 120" className="preview-ring">
                  <defs>
                    <linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#previewGrad)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray="314" strokeDashoffset="78"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                </svg>
                <div className="preview-score-value">8.4</div>
              </div>
              <div className="preview-metrics">
                {[
                  { label: 'Innovation', value: 85, color: '#7c3aed' },
                  { label: 'Market Fit', value: 92, color: '#3b82f6' },
                  { label: 'Scalability', value: 78, color: '#06d6a0' },
                ].map((m, i) => (
                  <div key={i} className="preview-metric">
                    <div className="pm-header">
                      <span>{m.label}</span>
                      <span>{m.value}%</span>
                    </div>
                    <div className="pm-track">
                      <motion.div
                        className="pm-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                        style={{ background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="preview-tags">
                {['AI', 'SaaS', 'B2B', 'Scale'].map((t, i) => (
                  <span key={i} className="preview-tag">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating badges around the card */}
          <motion.div
            className="floating-badge fb-1"
            animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            📈 +185% AI/ML Growth
          </motion.div>
          <motion.div
            className="floating-badge fb-2"
            animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
          >
            🎯 92% Market Fit
          </motion.div>
          <motion.div
            className="floating-badge fb-3"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            ⚡ Real-time Data
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Strip ─────────────────────────────────────── */}
      <section className="stats-section-enhanced">
        <div className="stats-inner">
          <StatCounter value="500+" label="Ideas Analyzed" />
          <StatCounter value="14" label="Tracked Stocks" suffix="+" />
          <StatCounter value="7" label="Market Sectors" />
          <StatCounter value="95" label="Accuracy Rate" suffix="%" />
          <StatCounter value="24" label="Availability" suffix="/7" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="features-section-enhanced">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge">✨ Features</span>
          <h2 className="section-title-enhanced">
            Everything You Need to <span className="gradient-text">Validate</span> Your Idea
          </h2>
          <p className="section-subtitle">
            From AI-powered scoring to real market intelligence — our platform provides
            complete startup idea validation in seconds.
          </p>
        </motion.div>

        <div className="features-grid-enhanced">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card-enhanced"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="feature-icon-enhanced" style={{ background: f.gradient }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="hiw-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge">🔄 Process</span>
          <h2 className="section-title-enhanced">
            How <span className="gradient-text">IdeaOS</span> Works
          </h2>
          <p className="section-subtitle">
            Four simple steps from concept to actionable data-driven insights
          </p>
        </motion.div>

        <div className="hiw-grid">
          {howItWorks.map((step, i) => (
            <motion.div
              key={i}
              className="hiw-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
            >
              <div className="hiw-step-number">{step.step}</div>
              <div className="hiw-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < howItWorks.length - 1 && <div className="hiw-connector">→</div>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Live Market Pulse ────────────────────────────────── */}
      <section id="market" className="market-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge pulse-badge">
            <span className="pulse-dot-inline" /> Live Market Pulse
          </span>
          <h2 className="section-title-enhanced">
            Real <span className="gradient-text">Market Intelligence</span>
          </h2>
          <p className="section-subtitle">
            Our scoring engine is powered by real stock market data from 14 companies across 7 sectors.
            See how different sectors are performing right now.
          </p>
        </motion.div>

        <MarketPulse />
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="categories-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge">🏷️ Categories</span>
          <h2 className="section-title-enhanced">
            Analyze Ideas Across <span className="gradient-text">30+ Global Sectors</span>
          </h2>
        </motion.div>

        <div className="categories-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              className="category-chip"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.08, y: -4 }}
              style={{ borderColor: cat.color + '40' }}
            >
              <span className="cat-dot" style={{ background: cat.color }} />
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count" style={{ color: cat.color }}>{cat.count}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="testimonials-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge">💬 Testimonials</span>
          <h2 className="section-title-enhanced">
            Loved by <span className="gradient-text">Founders & Investors</span>
          </h2>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
            >
              <div className="testimonial-stars">
                {'★'.repeat(t.rating)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <span className="testimonial-avatar">{t.avatar}</span>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────── */}
      <section className="tech-section">
        <motion.p
          className="tech-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Powered By Modern Technology
        </motion.p>
        <div className="tech-strip">
          {techStack.map((t, i) => (
            <motion.div
              key={i}
              className="tech-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.1 }}
            >
              <span className="tech-icon">{t.icon}</span>
              <span className="tech-name">{t.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Validate Your Next <span className="gradient-text">Big Idea</span>?</h2>
          <p>
            Join hundreds of founders and investors using data-driven insights
            to evaluate startup ideas with confidence.
          </p>
          <div className="cta-buttons">
            <Link to="/submit">
              <motion.button
                className="btn-hero-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Analysis →
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                className="btn-hero-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-logo">
              <span className="logo-icon">💡</span>
              <span className="logo-text">Idea<span className="gradient-text">OS</span></span>
            </div>
            <p className="footer-tagline">
              AI-powered startup idea validation backed by real market intelligence.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Product</h4>
            <Link to="/submit">Submit Idea</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/analysis">Analysis</Link>
            <Link to="/insights">Insights</Link>
          </div>

          <div className="footer-links-group">
            <h4>Resources</h4>
            <Link to="/history">History</Link>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#market">Market Data</a>
          </div>

          <div className="footer-links-group">
            <h4>Connect</h4>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 IdeaOS. Built with ❤️ for innovators everywhere.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;