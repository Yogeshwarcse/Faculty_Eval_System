import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../utils/api';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [faculty, setFaculty] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore user session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          if (userData.role === 'admin') setPage('overview');
          else if (userData.role === 'faculty') setPage('faculty-dashboard');
          else setPage('dashboard');
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Fetch all app data from API
  const loadData = async (role) => {
    // Faculty members must not receive student or raw feedback data
    if (role === 'faculty') return;
    try {
      const [facList, studList, feedList] = await Promise.all([
        api.faculty.list().catch(() => []),
        api.students.list().catch(() => []),
        api.feedback.list().catch(() => [])
      ]);
      
      const format = (list) => (Array.isArray(list) ? list : []).map(item => ({
        ...item,
        id: item._id || item.id
      }));

      const formatFeedback = (list) => (Array.isArray(list) ? list : []).map(item => ({
        ...item,
        id: item._id || item.id,
        facultyId: item.facultyId?._id || item.facultyId?.id || item.facultyId,
        studentId: item.studentId?._id || item.studentId?.id || item.studentId
      }));

      setFaculty(format(facList));
      setStudents(format(studList));
      setFeedback(formatFeedback(feedList));
    } catch (err) {
      console.error('Error loading app data:', err);
    }
  };

  useEffect(() => {
    if (user) loadData(user.role);
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      if (response.message || !response.token) return { success: false, error: response.message || 'Invalid credentials' };
      
      const { user: userData, token } = response;
      const formattedUser = { ...userData, id: userData._id || userData.id };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      
      setUser(formattedUser);
      if (formattedUser.role === 'admin') setPage('overview');
      else if (formattedUser.role === 'faculty') setPage('faculty-dashboard');
      else setPage('dashboard');
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  const register = async (data) => {
    try {
      const response = await api.auth.register(data);
      if (response.message || !response.token) return { success: false, error: response.message || 'Registration failed' };
      
      const { user: userData, token } = response;
      const formattedUser = { ...userData, id: userData._id || userData.id };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      
      setUser(formattedUser);
      if (formattedUser.role === 'faculty') setPage('faculty-dashboard');
      else setPage('dashboard');
      loadData(formattedUser.role);
      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  const logout = () => {
    setUser(null);
    setPage('dashboard');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addFaculty = async (data) => {
    try {
      const response = await api.faculty.create(data);
      if (response && (response._id || response.id)) {
        setFaculty(p => [...p, { ...response, id: response._id || response.id }]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Add faculty error:', err);
      return false;
    }
  };

  const updateFaculty = async (data) => {
    try {
      const response = await api.faculty.update(data.id, data);
      if (response && (response._id || response.id)) {
        setFaculty(p => p.map(f => f.id === data.id ? { ...response, id: response._id || response.id } : f));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update faculty error:', err);
      return false;
    }
  };

  const deleteFaculty = async (id) => {
    try {
      const response = await api.faculty.remove(id);
      if (response && response.success) {
        setFaculty(p => p.filter(f => f.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Delete faculty error:', err);
      return false;
    }
  };

  const addFeedback = async (data) => {
    try {
      const response = await api.feedback.create(data);
      if (response && (response._id || response.id)) {
        const fb = {
          ...response,
          id: response._id || response.id,
          // Extract IDs in case backend returned populated objects
          facultyId: response.facultyId?._id || response.facultyId?.id || response.facultyId,
          studentId: response.studentId?._id || response.studentId?.id || response.studentId
        };
        setFeedback(p => [...p, fb]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Add feedback error:', err);
      return false;
    }
  };

  const toggleBlock = async (id) => {
    try {
      const response = await api.students.toggleBlock(id);
      if (response && (response._id || response.id)) {
        setStudents(p => p.map(s => s.id === id ? { ...response, id: response._id || response.id } : s));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Toggle block error:', err);
      return false;
    }
  };

  const ctx = { 
    user, login, logout, register, page, setPage, 
    faculty, feedback, students, 
    addFaculty, updateFaculty, deleteFaculty, 
    addFeedback, toggleBlock, loadData 
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};
