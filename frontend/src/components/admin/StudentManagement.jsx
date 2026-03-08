import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Btn, Badge } from '../ui';

const StudentManagement = () => {
  const { students, toggleBlock } = useApp();
  const [search, setSearch] = useState('');
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.includes(search));

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0 }}>Student Management</h1>
        <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>{students.length} registered students</p>
      </div>

      <Card style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name or register number..."
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', background: 'transparent' }} />
      </Card>

      <div style={{ display: 'grid', gap: '12px' }}>
        {filtered.map(s => (
          <Card key={s.id} style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: s.blocked ? '#fee2e2' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.blocked ? '#ef4444' : '#fff', fontWeight: 800, fontSize: '14px'
                }}>{s.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1a1735' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{s.regNo} • {s.department} • Year {s.year}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {s.blocked && <Badge variant='error'>Blocked</Badge>}
                <Btn onClick={() => toggleBlock(s.id)} variant={s.blocked ? 'success' : 'danger'} style={{ padding: '7px 14px', fontSize: '12px' }}>
                  {s.blocked ? 'Unblock' : 'Block'}
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentManagement;
