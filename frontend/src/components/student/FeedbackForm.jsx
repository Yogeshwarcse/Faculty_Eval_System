import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Btn, StarRating } from '../ui';

const FeedbackForm = () => {
  const { user, faculty, feedback, addFeedback } = useApp();
  const deptFaculty = faculty.filter(f => f.department === user.department);
  const submitted = new Set(feedback.filter(f => f.studentId === user.id).map(f => f.facultyId));
  const available = deptFaculty.filter(f => !submitted.has(f.id));

  const [selectedFaculty, setSelectedFaculty] = useState(available[0]?.id || '');
  const [ratings, setRatings] = useState({ teaching: 0, knowledge: 0, communication: 0, punctuality: 0 });
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const criteria = [
    { key: 'teaching', label: 'Teaching Quality', icon: '📖' },
    { key: 'knowledge', label: 'Subject Knowledge', icon: '🧠' },
    { key: 'communication', label: 'Communication Skills', icon: '💬' },
    { key: 'punctuality', label: 'Punctuality', icon: '⏰' },
  ];

  const handleSubmit = () => {
    if (!selectedFaculty) { setError('Please select a faculty.'); return; }
    if (Object.values(ratings).some(r => r === 0)) { setError('Please rate all criteria.'); return; }
    addFeedback({ studentId: user.id, facultyId: selectedFaculty, ratings, comment, submittedAt: new Date().toISOString() });
    setSuccess(true);
  };

  if (success) return (
    <div style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Card style={{ textAlign: 'center', padding: '48px', maxWidth: '400px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1735', marginBottom: '8px' }}>Feedback Submitted!</h2>
        <p style={{ color: '#888', marginBottom: '24px' }}>Your anonymous feedback has been recorded. Thank you for helping improve education quality!</p>
        <Btn onClick={() => { setSuccess(false); setRatings({ teaching: 0, knowledge: 0, communication: 0, punctuality: 0 }); setComment(''); }}>
          Submit Another
        </Btn>
      </Card>
    </div>
  );

  if (available.length === 0) return (
    <div style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Card style={{ textAlign: 'center', padding: '48px', maxWidth: '400px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1735' }}>All Done!</h2>
        <p style={{ color: '#888' }}>You've submitted feedback for all your department's faculty. Great job!</p>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0 }}>Submit Feedback</h1>
        <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>Your feedback is completely anonymous 🔒</p>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Select Faculty</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {available.map(f => (
            <div key={f.id} onClick={() => setSelectedFaculty(f.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                background: selectedFaculty === f.id ? '#f0eeff' : '#fafafa',
                border: `2px solid ${selectedFaculty === f.id ? '#6366f1' : '#f0f0f5'}`,
                transition: 'all 0.2s'
              }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: '14px'
              }}>{f.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#1a1735', fontSize: '14px' }}>{f.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{f.subjects.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Rate Criteria</h3>
        {criteria.map(c => (
          <div key={c.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '20px', marginRight: '12px' }}>{c.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{c.label}</div>
              <StarRating value={ratings[c.key]} onChange={v => setRatings(r => ({ ...r, [c.key]: v }))} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: '16px' }}>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment..." rows={4}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
        {error && <p style={{ color: '#f87171', fontSize: '12px', margin: '8px 0 0' }}>{error}</p>}

        <Btn variant='primary' onClick={handleSubmit} style={{ marginTop: '20px' }}>Submit</Btn>
      </Card>
    </div>
  );
};

export default FeedbackForm;
