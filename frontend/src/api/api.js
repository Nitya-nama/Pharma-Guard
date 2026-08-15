import axios from 'axios';

// Get API Base URL from env variable, defaulting to Render host or local
const BASE_URL = import.meta.env.VITE_API_URL || 'https://pharma-guard-ow5u.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const api = {
  // System & Health
  getAppStatus: async () => {
    const res = await apiClient.get('/');
    return res.data;
  },

  getHealth: async () => {
    const res = await apiClient.get('/api/health');
    return res.data.data;
  },

  getModelInfo: async () => {
    const res = await apiClient.get('/api/model/info');
    return res.data.data;
  },

  // Prediction
  predict: async (patientPayload) => {
    const res = await apiClient.post('/api/predict', patientPayload);
    return res.data.data;
  },

  predictBatch: async (patientsPayload) => {
    const res = await apiClient.post('/api/predict/batch', patientsPayload);
    return res.data.data;
  },

  // Explainability
  explain: async (patientPayload) => {
    const res = await apiClient.post('/api/explain', patientPayload);
    return res.data.data;
  },

  // History
  getHistory: async () => {
    const res = await apiClient.get('/api/history');
    return res.data.data;
  },

  getHistoryById: async (id) => {
    const res = await apiClient.get(`/api/history/${id}`);
    return res.data.data;
  },

  deleteHistory: async (id) => {
    const res = await apiClient.delete(`/api/history/${id}`);
    return res.data.data;
  },

  // Analytics
  getAnalyticsSummary: async () => {
    const res = await apiClient.get('/api/analytics/summary');
    return res.data.data;
  },

  getRiskDistribution: async () => {
    const res = await apiClient.get('/api/analytics/risk-distribution');
    return res.data.data;
  },

  getDailyAnalytics: async () => {
    const res = await apiClient.get('/api/analytics/daily');
    return res.data.data;
  },

  getConfidenceDistribution: async () => {
    const res = await apiClient.get('/api/analytics/confidence');
    return res.data.data;
  },

  getTopGenes: async () => {
    const res = await apiClient.get('/api/analytics/top-genes');
    return res.data.data;
  },
};

export default apiClient;
