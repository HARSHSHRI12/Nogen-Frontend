// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3500/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// No request interceptor needed to attach token manually, as tokens are HTTP-only cookies
// and are sent automatically by the browser with `withCredentials: true`.

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
