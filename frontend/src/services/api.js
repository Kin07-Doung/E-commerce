import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    if (error.response?.status === 429) {
      const resetHeader = error.response.headers['ratelimit-reset'];
      const retryAfter = resetHeader ? parseInt(resetHeader, 10) : 60;
      error.retryAfter = retryAfter;
    }
    return Promise.reject(error);
  }
);

export default api;
