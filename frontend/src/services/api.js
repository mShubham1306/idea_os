import axios from 'axios';

// Use relative URLs — Vite dev server proxies /api to Flask backend.
// In production, configure reverse proxy (nginx) similarly.
const API = axios.create({
  baseURL: '',          // empty = same origin (uses Vite proxy in dev)
  timeout: 60000,       // 60s for AI analysis
});

export const analyzeIdea = (idea, category) => {
  return API.post('/api/idea/analyze', { idea, category });
};

export const getHistory = () => {
  return API.get('/api/idea/history');
};

export const getDashboardInsights = () => {
  return API.get('/api/dashboard/insights');
};

export default API;
