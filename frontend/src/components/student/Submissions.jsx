import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, StarRating } from '../ui';

const MySubmissions = () => {
  const { user, feedback, faculty } = useApp();
  const myFeedback = feedback.filter(f => f.studentId === user.id);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0 }}>My Submissions</h1>
        <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>{myFeedback.length} feedback(s) submitted</p>
      </div>
      {myFeedback.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p style={{ color: '#888' }}>No submissions yet. Start by giving feedback to your faculty!</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {myFeedback.map(fb => {
            const f = faculty.find(x => x.id === fb.facultyId);
            const overall = ((fb.ratings.teaching + fb.ratings.knowledge + fb.ratings.communication + fb.ratings.punctuality) / 4).toFixed(1);
            return (
              <Card key={fb.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 800, fontSize: '14px'
                    }}>{f?.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1a1735' }}>{f?.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{new Date(fb.submittedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#6366f1' }}>{overall}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>Overall</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {[['Teaching', '📖', fb.ratings.teaching], ['Knowledge', '🧠', fb.ratings.knowledge], ['Communication', '💬', fb.ratings.communication], ['Punctuality', '⏰', fb.ratings.punctuality]].map(([label, icon, val]) => (
                    <div key={label} style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', background: '#faf9ff' }}>
                      <div style={{ fontSize: '16px' }}>{icon}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }}>{val}</div>
                      <div style={{ fontSize: '10px', color: '#888' }}>{label}</div>
                    </div>
                  ))}
                </div>
                {fb.comment && <p style={{ marginTop: '12px', padding: '10px 14px', background: '#f8f7ff', borderRadius: '10px', fontSize: '13px', color: '#555', fontStyle: 'italic', borderLeft: '3px solid #6366f1' }}>"{fb.comment}"</p>}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
