import axios from 'axios';

/**
 * Resolve API base URL for Vite (build-time env only).
 * Prefer VITE_API_BASE_URL; fall back to VITE_API_URL for older configs.
 *
 * Dev: use `/api` so Vite proxies to VITE_BACKEND_URL (see vite.config.js).
 * Production (Static Web Apps): set full App Service API root, e.g.
 *   https://your-app.azurewebsites.net/api
 */
function resolveApiBaseUrl() {
  const raw =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    '/api';

  let base = typeof raw === 'string' ? raw.trim() : '/api';
  if (!base) base = '/api';

  // Relative path (dev proxy): /api
  if (base.startsWith('/')) {
    return base.replace(/\/+$/, '') || '/api';
  }

  // Bare hostname (common misconfiguration): prepend https://
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base.replace(/^\/+/, '')}`;
  }

  base = base.replace(/\/+$/, '');

  // App root without /api — this app mounts all routes under /api on the server
  if (!/\/api$/i.test(base)) {
    base = `${base}/api`;
  }

  return base;
}

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // JWT in Authorization header — no cookies; keeps CORS simpler than withCredentials: true
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase() ?? 'REQ';
    const path =
      (error.config?.baseURL || '') + (error.config?.url || '');
    const detail = error.response?.data ?? error.message;
    console.error(`[API] ${method} ${path} → ${status ?? 'NETWORK'}`, detail);
    return Promise.reject(error);
  }
);

export default api;
