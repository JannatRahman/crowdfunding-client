import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 30000, // 30-second timeout to prevent hung-server infinite loading
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Attach the Better-Auth session token from localStorage (set by auth-client)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Guard against SecurityError when storage is blocked (e.g. private browsing)
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

// ─── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};

    // ── Automatic retry with exponential back-off for transient network errors ──
    // Only retry GET requests (idempotent) and only on network/timeout errors,
    // not on 4xx/5xx API errors (those have meaningful error bodies).
    const isNetworkError  = !error.response; // timeout, ECONNRESET, etc.
    const isGetRequest    = config.method === 'get' || config.method === 'GET';
    const MAX_RETRIES     = 2;
    config._retryCount    = config._retryCount || 0;

    if (isNetworkError && isGetRequest && config._retryCount < MAX_RETRIES) {
      config._retryCount += 1;
      const delay = 500 * 2 ** (config._retryCount - 1); // 500ms, 1000ms
      await new Promise((r) => setTimeout(r, delay));
      return api(config);
    }

    // ── On 401, clear stale token and redirect to login ────────────────────────
    // Avoids leaving the user on a broken/empty page.
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      try { localStorage.removeItem('access-token'); } catch (_) {}
      // Avoid redirect loop if already on an auth page
      const p = window.location.pathname;
      if (
        !p.startsWith('/login') &&
        !p.startsWith('/register') &&
        !p.startsWith('/sign-in') &&
        !p.startsWith('/sign-up')
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
