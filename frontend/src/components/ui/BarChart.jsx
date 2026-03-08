import React from 'react';

const BarChart = ({ data, colors }) => {
  const max = Math.max(...data.map(d => d.value), 5);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px', padding: '0 8px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: colors[i % colors.length] }}>{d.value}</span>
          <div style={{
            width: '100%', background: colors[i % colors.length] + '22',
            borderRadius: '6px 6px 0 0', height: '90px', display: 'flex', alignItems: 'flex-end',
            overflow: 'hidden', position: 'relative'
          }}>
            <div style={{
              width: '100%', height: `${(d.value / max) * 90}px`,
              background: `linear-gradient(180deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}99)`,
              borderRadius: '6px 6px 0 0', transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)'
            }} />
          </div>
          <span style={{ fontSize: '10px', color: '#888', textAlign: 'center', lineHeight: 1.2, fontFamily: 'monospace' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
