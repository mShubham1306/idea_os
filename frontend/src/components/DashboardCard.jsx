import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, icon, iconColor = 'purple', trend, trendDir = 'up', children }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className={`card-icon ${iconColor}`}>
          {icon}
        </div>
        {trend && (
          <span className={`card-trend ${trendDir}`}>
            {trendDir === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="card-value">{value}</div>
      <div className="card-title">{title}</div>
      {children}
    </div>
  );
};

export default DashboardCard;