import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Btn, Badge, Input, Select } from '../ui';

const FacultyManagement = () => {
  const { faculty, addFaculty, updateFaculty, deleteFaculty } = useApp();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ customId: '', name: '', department: 'CSE', subjects: '' });
  const set = k => v => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setForm({ customId: '', name: '', department: 'CSE', subjects: '' }); setModal('add'); };
  const openEdit = (f) => { setForm({ ...f, customId: f.customId || '', subjects: f.subjects.join(', ') }); setModal('edit'); };

  const handleSave = () => {
    const data = { ...form, subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean) };
    if (modal === 'add') addFaculty(data);
    else updateFaculty(data);
    setModal(null);
  };

  const depts = ['CSE', 'ECE', 'IT', 'MECH', 'CIVIL'];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1735', margin: 0 }}>Faculty Management</h1>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '14px' }}>{faculty.length} faculty members</p>
        </div>
        <Btn onClick={openAdd}>+ Add Faculty</Btn>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {faculty.map(f => (
          <Card key={f.id} style={{ padding: '18px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '15px'
                }}>{f.avatar}</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1a1735', fontSize: '15px' }}>{f.name}</div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>ID: {f.customId ? f.customId : f.id}</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <Badge variant='info'>{f.department}</Badge>
                    {f.subjects.map(s => <Badge key={s} variant='info'>{s}</Badge>)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Btn onClick={() => openEdit(f)} variant='secondary' style={{ padding: '7px 14px', fontSize: '12px' }}>Edit</Btn>
                <Btn onClick={() => deleteFaculty(f.id)} variant='danger' style={{ padding: '7px 14px', fontSize: '12px' }}>Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1735', marginBottom: '24px' }}>{modal === 'add' ? 'Add New Faculty' : 'Edit Faculty'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input label='Custom ID (Optional)' value={form.customId} onChange={set('customId')} placeholder='e.g., Yogeshwar-cse-12' />
              <Input label='Full Name' value={form.name} onChange={set('name')} placeholder='Dr. Name Here' />
              <Select label='Department' value={form.department} onChange={set('department')} options={depts.map(d => ({ value: d, label: d }))} />
              <Input label='Subjects (comma separated)' value={form.subjects} onChange={set('subjects')} placeholder='DBMS, Networks' />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <Btn onClick={handleSave} style={{ flex: 1 }}>Save</Btn>
              <Btn onClick={() => setModal(null)} variant='secondary' style={{ flex: 1 }}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
