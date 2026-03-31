import React from 'react';
import './ChartBox.css';

const ChartBox = ({ children, title }) => {
  return (
    <div className="chart-box">
      {title && <h3 className="chart-title">{title}</h3>}
      {children}
    </div>
  );
};

export default ChartBox;