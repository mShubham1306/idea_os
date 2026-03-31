import React from 'react';
import './Card.css';

const Card = ({ data }) => {
  // data may come from history (/api/idea/history) or analyze response
  const ideaText = data.idea || data.description || 'Untitled idea';
  const score = data.score != null ? data.score : data.report?.score;
  const date = data.date || data.idea?.created_at || '';

  return (
    <div className="card">
      <h2 className="card-title">{ideaText}</h2>
      {score != null && <div className="score">Score: {score}</div>}
      {date && <div className="date">{date}</div>}
    </div>
  );
};

export default Card;
