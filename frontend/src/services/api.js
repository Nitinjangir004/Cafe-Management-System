import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cafe-management-system-backend-18pf.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for unified error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.details?.join(', ') ||
      error.message ||
      'Server request failed';
    return Promise.reject(new Error(message));
  }
);

// User Authentication & Management APIs (matching Angular cafe-springboot-angular-frontend)
export const userApi = {
  signup: (data) => api.post('/user/signup', data),
  login: (data) => api.post('/user/login', data),
  getAll: () => api.get('/user/get'),
  updateStatus: (id, status) => api.post('/user/update', { id, status }),
  changePassword: (data) => api.post('/user/changePassword', data),
  forgotPassword: (email) => api.post('/user/forgotPassword', { email }),
  checkToken: () => api.get('/user/checkToken'),
};

// Category Management APIs
export const categoryApi = {
  getAll: () => api.get('/category/get'),
  add: (data) => api.post('/category/add', data),
  update: (data) => api.post('/category/update', data),
  delete: (id) => api.delete(`/category/delete/${id}`),
};

// Product Management APIs
export const productApi = {
  getAll: () => api.get('/product/get'),
  getByCategory: (categoryId) => api.get(`/product/getByCategory/${categoryId}`),
  getById: (id) => api.get(`/product/getById/${id}`),
  add: (data) => api.post('/product/add', data),
  update: (data) => api.post('/product/update', data),
  updateStatus: (id, status) => api.post('/product/updateStatus', { id, status }),
  delete: (id) => api.delete(`/product/delete/${id}`),
};

// Bill & Report APIs (matching Angular View-Bill & Order Report)
export const cafeBillApi = {
  generateReport: (data) => api.post('/bill/generateReport', data),
  getBills: () => api.get('/bill/getBills'),
  getPdf: (id) => api.get(`/bill/getPdf/${id}`),
  delete: (id) => api.delete(`/bill/delete/${id}`),
};

// Dashboard Analytics API
export const dashboardApi = {
  getDetails: () => api.get('/dashboard/details'),
};

export default api;
