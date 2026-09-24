import React from 'react';

const ErrorAlert = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className="alert alert-danger">
      <div>{message}</div>
      {onDismiss && (
        <button type="button" className="close-btn" onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
