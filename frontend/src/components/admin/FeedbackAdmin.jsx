import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, StarRating, Select } from '../ui';

const FeedbackAdmin = () => {
  const { feedback, faculty, students } = useApp();
  const [filterFaculty, setFilterFaculty] = useState('All');

  const filtered = filterFaculty === 'All' ? feedback : feedback.filter(f => f.facultyId === filterFaculty);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0 }}>All Feedback</h1>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>{filtered.length} submissions</p>
        </div>
        <Select value={filterFaculty} onChange={setFilterFaculty}
          options={[{ value: 'All', label: 'All Faculty' }, ...faculty.map(f => ({ value: f.id, label: f.name }))]} />
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {filtered.map(fb => {
          const f = faculty.find(x => x.id === fb.facultyId);
          const ov = ((fb.ratings.teaching + fb.ratings.knowledge + fb.ratings.communication + fb.ratings.punctuality) / 4).toFixed(1);
          return (
            <Card key={fb.id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '13px'
                  }}>{f?.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1a1735' }}>{f?.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      Anonymous Student • {new Date(fb.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: parseFloat(ov) >= 4 ? '#10b981' : parseFloat(ov) >= 3 ? '#f59e0b' : '#ef4444' }}>{ov}</div>
                  <StarRating value={Math.round(ov)} size={14} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {[['📖', 'Teaching', fb.ratings.teaching], ['🧠', 'Knowledge', fb.ratings.knowledge], ['💬', 'Comm.', fb.ratings.communication], ['⏰', 'Punct.', fb.ratings.punctuality]].map(([icon, label, v]) => (
                  <div key={label} style={{ padding: '8px', borderRadius: '8px', background: '#faf9ff', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px' }}>{icon}</div>
                    <div style={{ fontWeight: 800, color: '#6366f1', fontSize: '16px' }}>{v}</div>
                    <div style={{ fontSize: '10px', color: '#888' }}>{label}</div>
                  </div>
                ))}
              </div>
              {fb.comment && <p style={{ marginTop: '12px', padding: '10px 14px', background: '#f8f7ff', borderRadius: '10px', fontSize: '13px', color: '#555', fontStyle: 'italic', borderLeft: '3px solid #6366f1', margin: '12px 0 0' }}>💬 "{fb.comment}"</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackAdmin;
