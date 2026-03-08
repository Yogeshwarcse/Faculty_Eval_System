import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Btn, Badge } from '../ui';

const StudentDashboard = () => {
  const { user, faculty, feedback, setPage } = useApp();
  const myFeedback = feedback.filter(f => f.studentId === user.id);
  const deptFaculty = faculty.filter(f => f.department === user.department);
  const submitted = new Set(myFeedback.map(f => f.facultyId));

  const stats = [
    { label: 'Faculty in Dept', value: deptFaculty.length, icon: '👨‍🏫', color: '#6366f1' },
    { label: 'Feedbacks Given', value: myFeedback.length, icon: '✍', color: '#10b981' },
    { label: 'Pending', value: deptFaculty.length - myFeedback.length, icon: '⏳', color: '#f59e0b' },
    { label: 'Your Year', value: `Year ${user.year}`, icon: '📚', color: '#8b5cf6' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0, letterSpacing: '-0.02em' }}>
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>{user.department} • {user.regNo}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, marginTop: '4px' }}>{s.value}</div>
              </div>
              <div style={{ fontSize: '28px', opacity: 0.7 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1735', margin: 0 }}>Your Department Faculty</h2>
          <Btn onClick={() => setPage('feedback')} variant='primary' style={{ padding: '8px 16px', fontSize: '12px' }}>Submit Feedback</Btn>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {deptFaculty.map(f => {
            const done = submitted.has(f.id);
            return (
              <div key={f.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: '12px',
                background: done ? '#f0fdf4' : '#faf9ff',
                border: `1.5px solid ${done ? '#bbf7d0' : '#e8e5ff'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: `linear-gradient(135deg, ${done ? '#10b981' : '#6366f1'}, ${done ? '#059669' : '#8b5cf6'})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '13px'
                  }}>{f.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1a1735', fontSize: '14px' }}>{f.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{f.subjects.join(', ')}</div>
                  </div>
                </div>
                {done
                  ? <Badge variant='success'>✓ Submitted</Badge>
                  : <Badge variant='warning'>Pending</Badge>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
