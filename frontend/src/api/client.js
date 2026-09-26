import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse envelope: { success, message, data } -> data
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);

// Jobs
export const getPublicJobs = () => api.get('/api/jobs/public');
export const getJobs = () => api.get('/api/jobs');
export const getJob = (id) => api.get(`/api/jobs/${id}`);
export const createJob = (jobData) => api.post('/api/jobs', jobData);
export const updateJob = (id, jobData) => api.put(`/api/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/api/jobs/${id}`);

// Candidates
export const getJobCandidates = (jobId) => api.get(`/api/jobs/${jobId}/candidates`);
export const getCandidate = (id) => api.get(`/api/candidates/${id}`);
export const deleteCandidate = (id) => api.delete(`/api/candidates/${id}`);

export const uploadResumes = (jobId, files, onUploadProgress) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  
  return api.post(`/api/jobs/${jobId}/candidates/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const downloadResume = (candidateId) => {
  return api.get(`/api/candidates/${candidateId}/resume`, {
    responseType: 'blob',
  });
};

export default api;

export const replyToCandidate = (id, data) => api.post(`/api/candidates/${id}/reply`, data);
export const replyToAll = (jobId, data) => api.post(`/api/candidates/job/${jobId}/reply-all`, data);
export const applyForJob = (jobId, formData, onUploadProgress) => api.post(`/api/candidates/job/${jobId}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress });
export const getMyApplications = () => api.get('/api/candidates/my-applications');
export const replyToAll = (jobId, data) => api.post(/api/candidates/job/${jobId}/reply-all, data);
export const applyForJob = (jobId, formData, onUploadProgress) => api.post(/api/candidates/job/${jobId}/apply, formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress });
export const getMyApplications = () => api.get('/api/candidates/my-applications');

