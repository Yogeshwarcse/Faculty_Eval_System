import React from 'react';

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
    {label && <label style={{ fontSize: '12px', fontWeight: 700, color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
        fontSize: '14px', outline: 'none', background: '#fafafa', fontFamily: 'inherit', cursor: 'pointer'
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default Select;
