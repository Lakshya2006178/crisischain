import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Alerts
export const fetchAlerts = () => API.get('/alerts');
export const createAlert = (newAlert) => API.post('/alerts', newAlert);
export const updateAlertStatus = (id, status) => API.patch(`/alerts/${id}`, { status });
export const fetchStats = () => API.get('/alerts/stats');

// Resources
export const fetchResources = () => API.get('/resources');
export const updateResource = (id, deployed) => API.patch(`/resources/${id}`, { deployed });

// Analytics
export const fetchDistribution = () => API.get('/analytics/distribution');
export const fetchTrends = () => API.get('/analytics/incident-trends');
export const fetchResponseTrends = () => API.get('/analytics/response-trends');

export default API;
