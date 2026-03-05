import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';

// Create axios instance with security headers
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true, // Enable CSRF tokens
});

// CSRF Token storage
let csrfToken: string | null = null;

// Request interceptor - Add auth token and CSRF token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token if available
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID();

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and CSRF tokens
apiClient.interceptors.response.use(
  (response) => {
    // Extract CSRF token from response headers if present
    const newCsrfToken = response.headers['x-csrf-token'];
    if (newCsrfToken) {
      csrfToken = newCsrfToken;
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { logout } = useAuthStore.getState();
      logout();

      // Store current URL for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';

      return Promise.reject(error);
    }

    // Handle 403 Forbidden (CSRF token invalid)
    if (error.response?.status === 403) {
      // Refresh CSRF token and retry
      try {
        const csrfResponse = await axios.get(`${API_BASE_URL}/csrf-token`, {
          withCredentials: true,
        });

        csrfToken = csrfResponse.data.csrfToken;

        // Retry original request with new CSRF token
        if (originalRequest) {
          originalRequest.headers['X-CSRF-Token'] = csrfToken;
          return apiClient(originalRequest);
        }
      } catch (csrfError) {
        console.error('Failed to refresh CSRF token:', csrfError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

// Fetch initial CSRF token
export async function initializeCSRF() {
  try {
    const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
      withCredentials: true,
    });

    csrfToken = response.data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}

export default apiClient;
