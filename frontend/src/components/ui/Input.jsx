import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
    {label && <label style={{ fontSize: '12px', fontWeight: 700, color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
      style={{
        padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
        fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#fafafa',
        fontFamily: 'inherit'
      }}
      onFocus={e => e.target.style.borderColor = '#6366f1'}
      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
    />
  </div>
);

export default Input;
