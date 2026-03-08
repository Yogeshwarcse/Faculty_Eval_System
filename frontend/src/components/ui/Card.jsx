import React from 'react';

const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', borderRadius: '16px',
    border: '1px solid #f0f0f5', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    padding: '24px', ...style
  }}>{children}</div>
);

export default Card;
