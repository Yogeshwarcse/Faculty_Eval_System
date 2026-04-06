import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './components/common/Auth';
import Shell from './components/common/Shell';
import StudentDashboard from './components/student/Dashboard';
import FeedbackForm from './components/student/FeedbackForm';
import MySubmissions from './components/student/Submissions';
import AdminOverview from './components/admin/Overview';
import FacultyManagement from './components/admin/FacultyManagement';
import StudentManagement from './components/admin/StudentManagement';
import Analytics from './components/admin/Analytics';
import FeedbackAdmin from './components/admin/FeedbackAdmin';

function AppContent() {
  const { user, page, setPage } = useApp();
  const isAdmin = user?.role === 'admin';

  const pages = {
    dashboard: <StudentDashboard />,
    feedback: <FeedbackForm />,
    history: <MySubmissions />,
    overview: <AdminOverview />,
    faculty: <FacultyManagement />,
    students: <StudentManagement />,
    analytics: <Analytics />,
    'feedback-admin': <FeedbackAdmin />,
  };

  if (!user) return <AuthPage />;
  return <Shell>{pages[page] || (isAdmin ? <AdminOverview /> : <StudentDashboard />)}</Shell>;
}

export default function App() {
  return (
    <AppProvider>
      <style>{`/* global styles */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f4ff; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(150,150,170,0.6); }
        textarea::placeholder { color: rgba(150,150,170,0.6); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 10px; }
      `}</style>
      <AppContent />
    </AppProvider>
  );
}
