import React from 'react';
import { useApp } from '../../context/AppContext';

const Shell = ({ children }) => {
  const { user, logout, page, setPage } = useApp();
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';

  const studentLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'feedback', label: 'Submit Feedback', icon: '✍' },
    { id: 'history', label: 'My Submissions', icon: '📋' },
  ];
  const adminLinks = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'feedback-admin', label: 'Feedback', icon: '💬' },
  ];
  const facultyLinks = [
    { id: 'faculty-dashboard', label: 'My Performance', icon: '📊' },
  ];

  const links = isAdmin ? adminLinks : isFaculty ? facultyLinks : studentLinks;

  const portalLabel = isAdmin ? 'Admin Panel' : isFaculty ? 'Faculty Portal' : 'Student Portal';
  const avatarGradient = isAdmin
    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
    : isFaculty
    ? 'linear-gradient(135deg, #6366f1, #06b6d4)'
    : 'linear-gradient(135deg, #10b981, #06b6d4)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f4ff' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px', background: 'linear-gradient(180deg, #1a1735 0%, #0f0e28 100%)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh'
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
            }}>🎓</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '14px', letterSpacing: '-0.01em' }}>EduRate</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {portalLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Faculty privacy notice */}
        {isFaculty && (
          <div style={{
            margin: '12px', padding: '10px 12px', borderRadius: '10px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)'
          }}>
            <p style={{ color: '#a5b4fc', fontSize: '10px', lineHeight: 1.5, margin: 0 }}>
              🔒 You can only view your own performance metrics. Student data is not accessible.
            </p>
          </div>
        )}

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: page === l.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: page === l.id ? '#a5b4fc' : 'rgba(255,255,255,0.45)',
                fontWeight: page === l.id ? 700 : 500, fontSize: '13px',
                fontFamily: 'inherit', marginBottom: '2px', transition: 'all 0.2s',
                textAlign: 'left', borderLeft: page === l.id ? '3px solid #6366f1' : '3px solid transparent'
              }}
              onMouseEnter={e => page !== l.id && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)', e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => page !== l.id && (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '8px 12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: avatarGradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, color: '#fff'
            }}>{user?.name?.[0] || 'U'}</div>
            <div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px' }}>
                {isFaculty ? `${user?.department || ''} Faculty` : user?.email}
              </div>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '8px', borderRadius: '9px',
            border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
            color: '#f87171', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
          }}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default Shell;
