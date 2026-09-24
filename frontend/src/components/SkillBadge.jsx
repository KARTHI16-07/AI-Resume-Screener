import React from 'react';

const SkillBadge = ({ label, type }) => {
  const className = type === 'matched' ? 'badge badge-success' : 'badge badge-danger';
  
  return (
    <span className={className} style={{ margin: '0.125rem' }}>
      {label}
    </span>
  );
};

export default SkillBadge;
