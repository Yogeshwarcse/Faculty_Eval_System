import React, { useEffect, useState, useCallback } from 'react';
import * as api from '../../utils/api';

const CATEGORIES = ['teaching', 'knowledge', 'communication', 'punctuality'];
const CAT_ICONS = { teaching: '📖', knowledge: '🧠', communication: '💬', punctuality: '⏱' };
const CAT_COLORS = { teaching: '#6366f1', knowledge: '#8b5cf6', communication: '#06b6d4', punctuality: '#10b981' };

const FacultyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.faculty.myMetrics();
      if (result.message) { setError(result.message); }
      else setData(result);
    } catch (e) {
      setError('Failed to fetch metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={fetchMetrics} />;
  if (!data) return null;

  const { faculty, totalResponses, overallAvg, avgRatings, comments } = data;
  const starCount = Math.round(overallAvg);

  return (
    <div style={{ padding: '32px', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #1a1035 50%, #0d1b2e 100%)' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 800, color: '#fff',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)'
          }}>
            {faculty.avatar || faculty.name?.[0] || '👨‍🏫'}
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: 0 }}>{faculty.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: '2px 0 0' }}>
              {faculty.designation || 'Faculty'} · {faculty.department}
            </p>
          </div>
        </div>
        <div style={{
          padding: '6px 16px', borderRadius: '99px',
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
          color: '#a5b4fc', fontSize: '12px', fontWeight: 700
        }}>
          🔒 Privacy-Protected View
        </div>
      </div>

      {/* Top stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Overall Rating" value={overallAvg.toFixed(1)} icon="⭐" accent="#f59e0b">
          <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: '14px', opacity: i <= starCount ? 1 : 0.25 }}>★</span>
            ))}
          </div>
        </StatCard>
        <StatCard label="Total Responses" value={totalResponses} icon="📝" accent="#06b6d4" />
        <StatCard label="Subjects Taught" value={faculty.subjects?.length || '—'} icon="📚" accent="#10b981" />
        <StatCard label="Department" value={faculty.department} icon="🏫" accent="#8b5cf6" small />
      </div>

      {/* Category ratings */}
      <GlassCard title="Performance by Category" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', padding: '4px 0' }}>
          {CATEGORIES.map(cat => (
            <CategoryBar key={cat} category={cat} score={avgRatings[cat] || 0} />
          ))}
        </div>
      </GlassCard>

      {/* Subjects */}
      {faculty.subjects?.length > 0 && (
        <GlassCard title="Subjects" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
            {faculty.subjects.map((s, i) => (
              <span key={i} style={{
                padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc'
              }}>{s}</span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Comments */}
      <GlassCard title={`Student Feedback (${comments.length} comment${comments.length !== 1 ? 's' : ''})`}>
        {comments.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '24px 0', fontSize: '14px' }}>
            No written feedback yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
            {comments.map((c, i) => <CommentCard key={i} comment={c} index={i} />)}
          </div>
        )}
        <div style={{
          marginTop: '16px', padding: '10px 14px', borderRadius: '10px',
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
          color: 'rgba(255,255,255,0.4)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          🔒 Student identities are not disclosed. Names, emails, and registration numbers are hidden.
        </div>
      </GlassCard>
    </div>
  );
};

/* ────────── Sub-components ────────── */

const StatCard = ({ label, value, icon, accent, small, children }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
    padding: '20px', position: 'relative', overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: '-10px', right: '-10px',
      width: '60px', height: '60px', borderRadius: '50%',
      background: accent, opacity: 0.12, filter: 'blur(20px)'
    }} />
    <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ color: '#fff', fontSize: small ? '16px' : '28px', fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    {children}
  </div>
);

const GlassCard = ({ title, children, style }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', ...style
  }}>
    {title && (
      <h2 style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.7 }}>
        {title}
      </h2>
    )}
    {children}
  </div>
);

const CategoryBar = ({ category, score }) => {
  const pct = Math.round((score / 5) * 100);
  const color = CAT_COLORS[category];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600 }}>
          {CAT_ICONS[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 800 }}>{score.toFixed(1)}<span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>/5</span></span>
      </div>
      <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          boxShadow: `0 0 10px ${color}88`,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)'
        }} />
      </div>
    </div>
  );
};

const CommentCard = ({ comment, index }) => {
  const dateStr = comment.date ? new Date(comment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const miniAvg = comment.ratings
    ? (Object.values(comment.ratings).reduce((a, b) => a + b, 0) / Object.values(comment.ratings).length).toFixed(1)
    : null;

  return (
    <div style={{
      padding: '14px 16px', borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: 1.6, margin: 0, flex: 1 }}>
          "{comment.text}"
        </p>
        {miniAvg && (
          <span style={{
            background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
            borderRadius: '8px', padding: '3px 8px', fontSize: '12px', fontWeight: 700, flexShrink: 0
          }}>★ {miniAvg}</span>
        )}
      </div>
      {dateStr && (
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '6px', display: 'block' }}>
          Submitted {dateStr}
        </span>
      )}
    </div>
  );
};

const LoadingScreen = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29, #1a1035)' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading your metrics…</p>
    </div>
  </div>
);

const ErrorScreen = ({ message, onRetry }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29, #1a1035)', padding: '24px' }}>
    <div style={{ textAlign: 'center', maxWidth: '360px' }}>
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
      <p style={{ color: '#f87171', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>{message}</p>
      <button onClick={onRetry} style={{
        padding: '10px 28px', borderRadius: '10px', border: 'none',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
      }}>Retry</button>
    </div>
  </div>
);

export default FacultyDashboard;
