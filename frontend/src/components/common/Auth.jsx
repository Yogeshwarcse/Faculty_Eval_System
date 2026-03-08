import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const AuthPage = () => {
  const { login, register } = useApp();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', regNo: '', department: 'CSE', year: 2 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    if (mode === 'login') {
      const ok = await login(form.email, form.password);
      if (!ok) setError('Invalid email or password.');
    } else {
      if (form.password !== form.confirm) { setError("Passwords don't match."); setLoading(false); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const ok = await register({ ...form, role });
      if (!ok) setError('Email already registered.');
    }
    setLoading(false);
  };

  const demos = [
    { label: 'Student Demo', email: 'arjun@college.edu', pass: 'pass123' },
    { label: 'Admin Demo', email: 'admin@college.edu', pass: 'admin123' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', 'Helvetica Neue', sans-serif",
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* background decorations */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: `${80 + i * 60}px`, height: `${80 + i * 60}px`,
          border: `1px solid rgba(139,92,246,${0.08 + i * 0.02})`,
          top: `${10 + i * 8}%`, left: `${5 + i * 7}%`,
          animation: `spin ${20 + i * 5}s linear infinite`,
          pointerEvents: 'none'
        }} />
      ))}

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* logo and header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '28px',
            boxShadow: '0 0 40px rgba(99,102,241,0.5)'
          }}>🎓</div>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>EduRate</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>Faculty Evaluation System</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '8px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  background: mode === m ? 'rgba(99,102,241,0.8)' : 'transparent',
                  color: mode === m ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontWeight: 700, fontSize: '13px', transition: 'all 0.2s', fontFamily: 'inherit',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>{m === 'login' ? 'Sign In' : 'Sign Up'}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['student', 'admin'].map(r => (
                    <button key={r} onClick={() => setRole(r)}
                      style={{
                        flex: 1, padding: '8px', borderRadius: '9px',
                        border: `1.5px solid ${role === r ? '#6366f1' : 'rgba(255,255,255,0.15)'}`,
                        background: role === r ? 'rgba(99,102,241,0.2)' : 'transparent',
                        color: role === r ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                        fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: 'inherit', textTransform: 'capitalize'
                      }}>{r}</button>
                  ))}
                </div>
                <DarkInput label="Full Name" value={form.name} onChange={set('name')} placeholder="Your name" />
                {role === 'student' && (
                  <>
                    <DarkInput label="Register Number" value={form.regNo} onChange={set('regNo')} placeholder="21CSE001" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <DarkSelect label="Department" value={form.department} onChange={set('department')}
                        options={["CSE", "ECE", "IT", "MECH", "CIVIL"].map(d => ({ value: d, label: d }))} />
                      <DarkSelect label="Year" value={form.year} onChange={set('year')}
                        options={[1, 2, 3, 4].map(y => ({ value: y, label: `Year ${y}` }))} />
                    </div>
                  </>
                )}
              </>
            )}
            <DarkInput label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@college.edu" />
            <DarkInput label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
            {mode === 'signup' && (
              <DarkInput label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" />
            )}

            {error && <p style={{ color: '#f87171', fontSize: '12px', margin: 0, textAlign: 'center', fontWeight: 600 }}>⚠ {error}</p>}

            <button onClick={handleSubmit} disabled={loading}
              style={{
                padding: '12px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                fontFamily: 'inherit', letterSpacing: '0.05em', textTransform: 'uppercase',
                opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                marginTop: '4px'
              }}>{loading ? 'Please wait...' : (mode === 'login' ? 'Sign In →' : 'Create Account →')}</button>
          </div>

          {mode === 'login' && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Demo Access</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {demos.map(d => (
                  <button key={d.label} onClick={() => { setForm(p => ({ ...p, email: d.email, password: d.pass })); }}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '9px',
                      border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.6)', fontSize: '11px', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.2s'
                    }}>{d.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DarkInput = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        padding: '10px 14px', borderRadius: '10px',
        border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)',
        color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
        transition: 'border-color 0.2s'
      }}
      onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.8)'}
      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
    />
  </div>
);

const DarkSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        padding: '10px 14px', borderRadius: '10px',
        border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(30,30,50,0.8)',
        color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer'
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default AuthPage;
