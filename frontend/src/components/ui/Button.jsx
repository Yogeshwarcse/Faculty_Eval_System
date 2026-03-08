import React from 'react';

const Btn = ({ children, onClick, variant = 'primary', style = {}, disabled }) => {
  const variants = {
    primary: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none' },
    secondary: { background: '#f8f7ff', color: '#6366f1', border: '1.5px solid #e2e0ff' },
    danger: { background: '#fff0f0', color: '#ef4444', border: '1.5px solid #fecaca' },
    success: { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        ...variants[variant], padding: '10px 20px', borderRadius: '10px',
        fontSize: '13px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'all 0.2s', fontFamily: 'inherit',
        letterSpacing: '0.03em', ...style
      }}
      onMouseEnter={e => !disabled && (e.target.style.transform = 'translateY(-1px)', e.target.style.boxShadow = '0 6px 20px rgba(99,102,241,0.3)')}
      onMouseLeave={e => !disabled && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
    >{children}</button>
  );
};

export default Btn;
