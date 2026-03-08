import React from 'react';

const StarRating = ({ value, onChange, size = 24 }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} onClick={() => onChange && onChange(s)}
        style={{ fontSize: size, cursor: onChange ? 'pointer' : 'default', color: s <= value ? '#f59e0b' : '#e2e8f0', transition: 'transform 0.15s', display: 'inline-block' }}
        onMouseEnter={e => onChange && (e.target.style.transform = 'scale(1.2)')}
        onMouseLeave={e => onChange && (e.target.style.transform = 'scale(1)')}>★</span>
    ))}
  </div>
);

export default StarRating;
