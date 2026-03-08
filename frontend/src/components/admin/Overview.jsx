import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, BarChart, StarRating } from '../ui';
import { overallAvg } from '../../utils/helpers';

const AdminOverview = () => {
  const { faculty, feedback, students } = useApp();
  const totalFeedback = feedback.length;
  const avgRating = overallAvg(feedback);
  const topFaculty = [...faculty].map(f => {
    const fbs = feedback.filter(fb => fb.facultyId === f.id);
    return { ...f, avg: parseFloat(overallAvg(fbs)), count: fbs.length };
  }).sort((a, b) => b.avg - a.avg).slice(0, 3);

  const stats = [
    { label: 'Total Faculty', value: faculty.length, icon: '👨‍🏫', color: '#6366f1' },
    { label: 'Total Students', value: students.length, icon: '👨‍🎓', color: '#8b5cf6' },
    { label: 'Feedbacks', value: totalFeedback, icon: '💬', color: '#10b981' },
    { label: 'Avg Rating', value: `${avgRating}/5`, icon: '⭐', color: '#f59e0b' },
  ];

  const deptData = ['CSE', 'ECE', 'IT', 'MECH'].map(dept => ({
    label: dept, value: parseFloat(overallAvg(feedback.filter(fb => faculty.find(f => f.id === fb.facultyId)?.department === dept))) || 0
  }));

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0 }}>Admin Overview</h1>
        <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>System-wide performance at a glance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, marginTop: '4px' }}>{s.value}</div>
              </div>
              <div style={{ fontSize: '30px', opacity: 0.7 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1735', marginBottom: '20px' }}>Avg Rating by Department</h3>
          <BarChart data={deptData} colors={['#6366f1', '#8b5cf6', '#10b981', '#f59e0b']} />
        </Card>

        <Card>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1735', marginBottom: '16px' }}>Top Rated Faculty</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {topFaculty.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: ['#f59e0b', '#9ca3af', '#b45309'][i] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: ['#f59e0b', '#9ca3af', '#b45309'][i] }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a1735' }}>{f.name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{f.count} reviews</div>
                </div>
                <div style={{ fontWeight: 800, color: '#6366f1', fontSize: '16px' }}>{f.avg > 0 ? f.avg : '—'}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1735', marginBottom: '16px' }}>Recent Feedback</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {feedback.slice(-4).reverse().map(fb => {
            const f = faculty.find(x => x.id === fb.facultyId);
            const ov = ((fb.ratings.teaching + fb.ratings.knowledge + fb.ratings.communication + fb.ratings.punctuality) / 4).toFixed(1);
            return (
              <div key={fb.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: '#faf9ff', border: '1.5px solid #ede9ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '11px' }}>{f?.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a1735' }}>{f?.name}</div>
                    {fb.comment && <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
                      "{fb.comment.slice(0, 40)}..."</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarRating value={Math.round(ov)} size={14} />
                  <span style={{ fontWeight: 800, color: '#6366f1' }}>{ov}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AdminOverview;
