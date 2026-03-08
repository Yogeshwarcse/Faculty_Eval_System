import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, BarChart, Badge } from '../ui';
import { avg, ratingAvg, overallAvg } from '../../utils/helpers';

const Analytics = () => {
  const { faculty, feedback } = useApp();
  const [filterDept, setFilterDept] = useState('All');
  const depts = ['All', 'CSE', 'ECE', 'IT', 'MECH'];

  const filtered = filterDept === 'All' ? faculty : faculty.filter(f => f.department === filterDept);

  const facultyData = filtered.map(f => {
    const fbs = feedback.filter(fb => fb.facultyId === f.id);
    return {
      ...f,
      teaching: parseFloat(ratingAvg(fbs, 'teaching')) || 0,
      knowledge: parseFloat(ratingAvg(fbs, 'knowledge')) || 0,
      communication: parseFloat(ratingAvg(fbs, 'communication')) || 0,
      punctuality: parseFloat(ratingAvg(fbs, 'punctuality')) || 0,
      overall: parseFloat(overallAvg(fbs)) || 0,
      count: fbs.length,
    };
  });

  const criteriaOverall = [
    { label: 'Teaching', value: parseFloat(avg(feedback.map(f => f.ratings.teaching))) },
    { label: 'Knowledge', value: parseFloat(avg(feedback.map(f => f.ratings.knowledge))) },
    { label: 'Communication', value: parseFloat(avg(feedback.map(f => f.ratings.communication))) },
    { label: 'Punctuality', value: parseFloat(avg(feedback.map(f => f.ratings.punctuality))) },
  ];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0 }}>Analytics</h1>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>Performance insights across all faculty</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {depts.map(d => (
            <button key={d} onClick={() => setFilterDept(d)}
              style={{
                padding: '7px 14px', borderRadius: '9px', border: '1.5px solid',
                borderColor: filterDept === d ? '#6366f1' : '#e2e8f0',
                background: filterDept === d ? '#f0eeff' : '#fff',
                color: filterDept === d ? '#6366f1' : '#888',
                fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit'
              }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1735', marginBottom: '20px' }}>Overall Criteria Averages</h3>
          <BarChart data={criteriaOverall} colors={['#6366f1', '#8b5cf6', '#10b981', '#f59e0b']} />
        </Card>

        <Card>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1735', marginBottom: '16px' }}>Faculty Performance Heatmap</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {facultyData.map(f => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#555', width: '80px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name.split(' ').slice(-1)[0]}</span>
                {[f.teaching, f.knowledge, f.communication, f.punctuality].map((v, i) => {
                  const intensity = v / 5;
                  return <div key={i} style={{
                    flex: 1, height: '24px', borderRadius: '5px',
                    background: v === 0 ? '#f0f0f5' : `rgba(99,102,241,${0.1 + intensity * 0.9})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 700, color: intensity > 0.5 ? '#fff' : '#6366f1'
                  }}>{v > 0 ? v : '—'}</div>;
                })}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '80px' }} />
              {['Teach', 'Know', 'Comm', 'Punct'].map(l => (
                <div key={l} style={{ flex: 1, fontSize: '9px', textAlign: 'center', color: '#aaa', fontWeight: 700 }}>{l}</div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1735', marginBottom: '16px' }}>Detailed Faculty Ratings</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f5' }}>
                {['Faculty', 'Dept', 'Reviews', 'Teaching', 'Knowledge', 'Communication', 'Punctuality', 'Overall'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#888', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facultyData.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f8f7ff' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#1a1735' }}>{f.name}</td>
                  <td style={{ padding: '12px' }}><Badge variant='info'>{f.department}</Badge></td>
                  <td style={{ padding: '12px', color: '#888' }}>{f.count}</td>
                  {[f.teaching, f.knowledge, f.communication, f.punctuality].map((v, i) => (
                    <td key={i} style={{ padding: '12px' }}>
                      <span style={{ fontWeight: 700, color: v >= 4 ? '#10b981' : v >= 3 ? '#f59e0b' : v > 0 ? '#ef4444' : '#ccc' }}>
                        {v > 0 ? `${v} ★` : '—'}
                      </span>
                    </td>
                  ))}
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#6366f1' }}>{f.overall > 0 ? f.overall : '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
