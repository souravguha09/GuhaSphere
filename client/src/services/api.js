import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 12000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('guhasphere-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error) {
  return error?.response?.data?.message || (error?.code === 'ECONNABORTED' ? 'The server took too long to respond.' : error?.message) || 'Something went wrong.';
}
export default api;
