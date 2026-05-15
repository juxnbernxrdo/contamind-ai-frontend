'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setAccessToken } from '@/lib/api-client';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  roles: string[];
  tenantId: string;
  twoFAEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (dto: any) => Promise<any>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  verify2FA: (token: string, userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const { data } = await apiClient.post('/auth/refresh');
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      return false;
    }
  }, []);

  useEffect(() => {
    // Intento de refresco silencioso al cargar la app
    const initAuth = async () => {
      await refresh();
      setLoading(false);
    };
    initAuth();
  }, [refresh]);

  const login = async (dto: any) => {
    try {
      const { data } = await apiClient.post('/auth/login', dto);
      
      // Si el backend requiere 2FA (por anomalía o configuración)
      if (data.requires2FA || data.twoFAEnabled) {
        router.push(`/auth/mfa?userId=${data.userId || data.user?.id}`);
        return { requires2FA: true };
      }

      setAccessToken(data.accessToken);
      setUser(data.user);
      
      // Persistir refresh token en cookie (idealmente el backend debería hacerlo via HttpOnly)
      if (data.refreshToken) {
        Cookies.set('contamind-refresh', data.refreshToken, { expires: 30, sameSite: 'strict' });
      }
      
      if (data.securityWarnings) {
        data.securityWarnings.forEach((warn: string) => {
          toast.warning(`Aviso de seguridad: ${warn}`);
        });
      }

      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setUser(null);
      setAccessToken(null);
      Cookies.remove('contamind-refresh');
      router.push('/auth/login');
    }
  };

  const verify2FA = async (token: string, userId: string) => {
    try {
      const { data } = await apiClient.post('/auth/2fa/verify', { totpToken: token, userId });
      
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        router.push('/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Código 2FA inválido';
      toast.error(message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh, verify2FA }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
