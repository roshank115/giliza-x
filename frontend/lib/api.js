import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return config;
});

export const triageAPI = {
  assessPatient: (data) => api.post('/triage/assess', data),
  getQueue: () => api.get('/triage/queue'),
  getAlerts: () => api.get('/triage/alerts'),
  getRecord: (id) => api.get(`/triage/${id}`),
  updateStatus: (id, status) => api.put(`/triage/${id}/status`, { status }),
};

export const xrayAPI = {
  analyzeImage: (formData) => api.post('/xray/analyze', formData),
  getResults: (id) => api.get(`/xray/${id}`),
  generateReport: (id) => api.post(`/xray/${id}/report`),
  getStudies: (patientId) => api.get(`/xray/patient/${patientId}`),
};

export const reportAPI = {
  generate: (data) => api.post('/reports/generate', data),
  getReport: (id) => api.get(`/reports/${id}`),
  updateReport: (id, data) => api.put(`/reports/${id}/edit`, data),
  approveReport: (id) => api.put(`/reports/${id}/approve`),
  exportPDF: (id) => api.get(`/reports/${id}/pdf`),
  getPatientReports: (patientId) => api.get(`/reports/patient/${patientId}`),
};

export const aiAPI = {
  analyzePatient: (data) => api.post('/ai/patient-analysis', data),
  getRiskScore: (patientId) => api.get(`/ai/risk-score/${patientId}`),
  getReasoning: (analysisId, question) => api.post('/ai/reasoning', { analysisId, question }),
};

export const offlineAPI = {
  storeData: (data) => api.post('/offline/store', data),
  syncData: (deviceId) => api.post('/offline/sync', { deviceId }),
  getModels: (type) => api.get(`/offline/models/${type}`),
  getStatus: (deviceId) => api.get(`/offline/status/${deviceId}`),
};

export const patientAPI = {
  create: (data) => api.post('/patients', data),
  get: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  list: () => api.get('/patients'),
};

export default api;
