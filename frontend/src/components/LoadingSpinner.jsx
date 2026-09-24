import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {message && <p className="mt-4 text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
