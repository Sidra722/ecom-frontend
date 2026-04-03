import axios from 'axios';

// Local dev: use `/api` so Vite can proxy. Production: set `VITE_API_URL` to your App Service base, e.g. `https://your-app.azurewebsites.net/api`.
const raw = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL = typeof raw === 'string' ? raw.replace(/\/+$/, '') : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

