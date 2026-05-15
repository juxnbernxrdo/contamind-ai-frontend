import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * API Client con interceptores para manejo automático de JWT.
 * El Access Token se maneja en memoria/headers.
 * El Refresh Token lo maneja el navegador automáticamente vía Cookies HttpOnly.
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial para enviar cookies (Refresh Token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para almacenar el Access Token en memoria
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Interceptor de Petición: Inyecta el Access Token si existe
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Maneja el refresco de token en caso de 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos 401 y no hemos reintentado ya esta petición
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentamos refrescar el token
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data.accessToken) {
          accessToken = data.accessToken;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si el refresco falla, redirigimos al login (o dejamos que el hook lo maneje)
        accessToken = null;
        if (typeof window !== 'undefined') {
          // window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
