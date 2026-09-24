import React from 'react';

const ScoreBar = ({ score }) => {
  const numScore = Number(score) || 0;
  
  let color = '#ef4444'; // danger red
  if (numScore >= 70) color = '#22c55e'; // success green
  else if (numScore >= 40) color = '#eab308'; // warning yellow
  
  return (
    <div className="score-bar-wrapper">
      <div className="score-bar-track">
        <div 
          className="score-bar-fill" 
          style={{ width: `${numScore}%`, backgroundColor: color }}
        />
      </div>
      <div className="score-number" style={{ color }}>
        {numScore}
      </div>
    </div>
  );
};

export default ScoreBar;
