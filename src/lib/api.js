import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 30000, // C2: 30-second timeout to prevent hung-server infinite loading
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // C3: Guard against SecurityError when storage is blocked (e.g. private browsing)
      try {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (_) {
        // localStorage unavailable — proceed without the token
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // C1: On 401, clear stale token and redirect to login so the user
    // is not left on a broken/empty page.
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      try { localStorage.removeItem('access-token'); } catch (_) {}
      // Avoid redirect loop if already on an auth page
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register') &&
          !window.location.pathname.startsWith('/sign-in') &&
          !window.location.pathname.startsWith('/sign-up')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
