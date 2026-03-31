import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">💡</span>
        <span className="brand-name">IdeaOS</span>
      </Link>

      <div className="nav-links">
        <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        <Link to="/submit" className={isActive('/submit')}>Submit Idea</Link>
        <Link to="/history" className={isActive('/history')}>History</Link>
        <Link to="/insights" className={isActive('/insights')}>Insights</Link>
      </div>

      <div className="nav-actions">
        <Link to="/dashboard" className="nav-btn nav-btn-primary">Get Started</Link>
      </div>
    </nav>
  );
}

export default Navbar;