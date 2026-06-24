import axios from 'axios';

// Configuración de API segura, sin hardcoding
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin + '/api' : '');

/**
 * API Client con interceptores para manejo automático de JWT.
 * El Access Token se maneja en memoria/headers.
 * El Refresh Token lo maneja el backend automáticamente vía cookies HttpOnly.
 */
import { handleMockRequest } from './mock-auth';

// Set this to true to run in mock mode (UI/UX only)
const USE_MOCK = false;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

if (USE_MOCK) {
  apiClient.defaults.adapter = async (config) => {
    try {
      let parsedData = config.data;
      if (typeof config.data === 'string') {
        try {
          parsedData = JSON.parse(config.data);
        } catch (e) {
          // ignore
        }
      }
      
      const responseData = await handleMockRequest(config.url || '', config.method || 'get', parsedData);
      
      return {
        data: responseData.data,
        status: responseData.status || 200,
        statusText: 'OK',
        headers: config.headers as any,
        config,
      };
    } catch (error: any) {
      if (error.response) {
        return Promise.reject({
          ...error,
          config,
          request: {},
        });
      }
      return Promise.reject(error);
    }
  };
}

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Control de concurrencia para el refresco del token (Fix para Race Conditions)
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Interceptor de Petición: Inyecta el Access Token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Maneja 401 y concurrencia de refresco
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.endsWith('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Petición al backend sin enviar el refreshToken en el body
        // El backend lo leerá directamente de la cookie HttpOnly
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data.accessToken) {
          accessToken = data.accessToken as string;
          isRefreshing = false;
          onRefreshed(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        accessToken = null;
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          // Solo redirigir si se intenta acceder a una ruta protegida
          if (path.startsWith('/dashboard') || path.startsWith('/profile') || path.startsWith('/app')) {
            window.location.href = '/auth/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
