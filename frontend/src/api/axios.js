import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://13.127.83.204:8000/api/',
  baseURL: 'http://localhost:8000/api/',
  timeout: 5000,
  withCredentials: true, // Crucial for HttpOnly cookies
});

// Remove request interceptor that injects Bearer tokens
api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    // If backend rejects the cookie as expired, alert the application 
    window.dispatchEvent(new Event('unauthorized'));
  }
  return Promise.reject(error);
});

export default api;
