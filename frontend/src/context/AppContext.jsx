import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../utils/api';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// initial mock data (could be fetched from API later)
const INITIAL_FACULTY = [
  { id: 'f1', name: 'Dr. Anitha Rajan', department: 'CSE', subjects: ['Data Structures', 'Algorithms'], avatar: 'AR' },
  { id: 'f2', name: 'Prof. Karthik Selvam', department: 'CSE', subjects: ['DBMS', 'Cloud Computing'], avatar: 'KS' },
  { id: 'f3', name: 'Dr. Priya Mohan', department: 'ECE', subjects: ['Digital Circuits', 'VLSI Design'], avatar: 'PM' },
  { id: 'f4', name: 'Prof. Suresh Kumar', department: 'MECH', subjects: ['Thermodynamics', 'Fluid Mechanics'], avatar: 'SK' },
  { id: 'f5', name: 'Dr. Lakshmi Devi', department: 'IT', subjects: ['Web Technology', 'Machine Learning'], avatar: 'LD' },
];

const INITIAL_STUDENTS = [
  { id: 's1', name: 'Arjun Krishnan', email: 'arjun@college.edu', regNo: '21CSE001', department: 'CSE', year: 3, blocked: false },
  { id: 's2', name: 'Divya Sharma', email: 'divya@college.edu', regNo: '21CSE002', department: 'CSE', year: 3, blocked: false },
  { id: 's3', name: 'Ravi Shankar', email: 'ravi@college.edu', regNo: '21ECE001', department: 'ECE', year: 2, blocked: false },
];

const INITIAL_FEEDBACK = [
  { id: 'fb1', studentId: 's1', facultyId: 'f1', ratings: { teaching: 4, knowledge: 5, communication: 4, punctuality: 3 }, comment: 'Very clear explanations!', submittedAt: '2024-11-15T10:00:00Z' },
  { id: 'fb2', studentId: 's2', facultyId: 'f1', ratings: { teaching: 5, knowledge: 5, communication: 5, punctuality: 4 }, comment: 'Best professor!', submittedAt: '2024-11-15T11:00:00Z' },
  { id: 'fb3', studentId: 's1', facultyId: 'f2', ratings: { teaching: 3, knowledge: 4, communication: 3, punctuality: 5 }, comment: 'Good but pace is fast', submittedAt: '2024-11-16T09:00:00Z' },
  { id: 'fb4', studentId: 's3', facultyId: 'f3', ratings: { teaching: 4, knowledge: 4, communication: 5, punctuality: 4 }, comment: '', submittedAt: '2024-11-17T08:00:00Z' },
  { id: 'fb5', studentId: 's2', facultyId: 'f5', ratings: { teaching: 5, knowledge: 5, communication: 4, punctuality: 5 }, comment: 'Absolutely outstanding!', submittedAt: '2024-11-18T14:00:00Z' },
];

const USERS = [
  { id: 's1', name: 'Arjun Krishnan', email: 'arjun@college.edu', password: 'pass123', role: 'student', department: 'CSE', regNo: '21CSE001', year: 3 },
  { id: 's2', name: 'Divya Sharma', email: 'divya@college.edu', password: 'pass123', role: 'student', department: 'CSE', regNo: '21CSE002', year: 3 },
  { id: 'admin1', name: 'Admin User', email: 'admin@college.edu', password: 'admin123', role: 'admin' },
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [faculty, setFaculty] = useState(INITIAL_FACULTY);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [users, setUsers] = useState(USERS);
  const [loading, setLoading] = useState(true);

  // Restore user session from localStorage on app load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser);
          // Try to verify token is still valid by checking if user data exists
          if (userData && userData.email) {
            setUser(userData);
            setPage(userData.role === 'admin' ? 'overview' : 'dashboard');
          } else {
            // Invalid saved data, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        // Clear invalid session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      if (response.message || !response.token) return false;
      
      const { user: userData, token } = response;
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setPage(userData.role === 'admin' ? 'overview' : 'dashboard');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (data) => {
    try {
      const response = await api.auth.register(data);
      if (response.message || !response.token) return false;
      
      const { user: userData, token } = response;
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      if (data.role === 'student') setStudents(p => [...p, userData]);
      setUsers(p => [...p, userData]);
      setPage('dashboard');
      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setPage('dashboard');
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addFaculty = (data) => {
    const f = { ...data, id: `f${Date.now()}`, avatar: data.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() };
    setFaculty(p => [...p, f]);
  };
  const updateFaculty = (data) => setFaculty(p => p.map(f => f.id === data.id ? { ...f, ...data } : f));
  const deleteFaculty = (id) => setFaculty(p => p.filter(f => f.id !== id));
  const addFeedback = (data) => setFeedback(p => [...p, { ...data, id: `fb${Date.now()}` }]);
  const toggleBlock = (id) => setStudents(p => p.map(s => s.id === id ? { ...s, blocked: !s.blocked } : s));

  const ctx = { user, login, logout, register, page, setPage, faculty, feedback, students, addFaculty, updateFaculty, deleteFaculty, addFeedback, toggleBlock };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};
