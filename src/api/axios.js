// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // Backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
