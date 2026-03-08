const DEFAULT_API_BASE = 'https://faculty-eval-system-1.onrender.com/api';
const BASE = (import.meta.env.VITE_API_BASE || DEFAULT_API_BASE).replace(/\/$/, '');

// Helper to get token from localStorage
const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

// Helper to set default headers with auth token
const getHeaders = (includeAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const auth = {
  login: (data) => fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: getHeaders(false),
    body: JSON.stringify(data)
  }).then(r => r.json()),
  register: (data) => fetch(`${BASE}/auth/register`, {
    method: 'POST', headers: getHeaders(false),
    body: JSON.stringify(data)
  }).then(r => r.json())
};

export const faculty = {
  list: () => fetch(`${BASE}/faculty`, { headers: getHeaders() }).then(r => r.json()),
  create: (d) => fetch(`${BASE}/faculty`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(d) }).then(r => r.json()),
  update: (id, d) => fetch(`${BASE}/faculty/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(d) }).then(r => r.json()),
  remove: (id) => fetch(`${BASE}/faculty/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),
};

export const students = {
  list: () => fetch(`${BASE}/students`, { headers: getHeaders() }).then(r => r.json()),
  toggleBlock: (id) => fetch(`${BASE}/students/${id}/block`, { method: 'PATCH', headers: getHeaders() }).then(r => r.json()),
};

export const feedback = {
  list: () => fetch(`${BASE}/feedback`, { headers: getHeaders() }).then(r => r.json()),
  create: (d) => fetch(`${BASE}/feedback`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(d) }).then(r => r.json()),
};
