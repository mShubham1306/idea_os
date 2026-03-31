import React from 'react';
import './Loader.css';

const Loader = ({ text = 'Analyzing your idea...' }) => (
  <div className="loader-container">
    <div className="spinner" />
    {text && <p className="loader-text">{text}</p>}
  </div>
);

export default Loader;