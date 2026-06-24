'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setAccessToken } from '@/lib/api-client';
import { toast } from 'sonner';

export type AuthState =
  | 'IDLE'
  | 'HYDRATING'
  | 'AUTH_PENDING'
  | 'AWAITING_2FA'
  | 'AUTHENTICATED'
  | 'REFRESHING'
  | 'TERMINATED';

interface User {
  id: string;
  email: string;
  roles: string[];
  tenantId: string;
  twoFAEnabled: boolean;
  is2FAVerified: boolean;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  displayName?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  state: AuthState;
  login: (dto: any) => Promise<any>;
  logout: () => Promise<void>;
  refresh: (shouldBroadcast?: boolean) => Promise<boolean>;
  verify2FA: (code: string, isBackup?: boolean, userId?: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setAuthState: (state: AuthState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tab synchronization BroadcastChannel
export let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined') {
  broadcastChannel = new BroadcastChannel('contamind_auth_channel');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<AuthState>('IDLE');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const setAuthState = useCallback((newState: AuthState) => {
    setState(newState);
  }, []);

  const refresh = useCallback(async (shouldBroadcast = true) => {
    if (typeof window !== 'undefined') {
      const lock = localStorage.getItem('auth_refresh_lock');
      const lockTime = localStorage.getItem('auth_refresh_lock_time');
      const now = Date.now();

      // If another tab is currently performing a refresh, wait for it instead of repeating
      if (lock === 'true' && lockTime && now - parseInt(lockTime, 10) < 4000) {
        await new Promise<void>((resolve) => {
          const checkState = () => {
            if (stateRef.current === 'AUTHENTICATED') {
              resolve();
            } else {
              setTimeout(checkState, 200);
            }
          };
          const timeout = setTimeout(resolve, 3000);
          checkState();
          return () => clearTimeout(timeout);
        });

        if (stateRef.current === 'AUTHENTICATED') {
          return true;
        }
      }

      localStorage.setItem('auth_refresh_lock', 'true');
      localStorage.setItem('auth_refresh_lock_time', now.toString());
    }

    setState('REFRESHING');
    try {
      const { data } = await apiClient.post('/auth/refresh');
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        setState('AUTHENTICATED');

        if (shouldBroadcast) {
          broadcastChannel?.postMessage({
            type: 'SESSION_CHANGED',
          });
        }
        return true;
      }
      setState('IDLE');
      return false;
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      setState('IDLE');
      return false;
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_refresh_lock');
        localStorage.removeItem('auth_refresh_lock_time');
      }
    }
  }, []);

  // Cross-tab synchronization listener
  useEffect(() => {
    if (!broadcastChannel) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};

      switch (type) {
        case 'LOGIN':
          if (payload?.accessToken && payload?.user) {
            setAccessToken(payload.accessToken);
            setUser(payload.user);
            setState('AUTHENTICATED');
            router.push('/dashboard');
          }
          break;
        case 'SESSION_CHANGED':
          // Securely refresh session on other tabs without transmitting JWT
          refresh(false);
          break;
        case 'LOGOUT':
          if (stateRef.current !== 'TERMINATED' && stateRef.current !== 'IDLE') {
            setUser(null);
            setAccessToken(null);
            setState('TERMINATED');
            router.push('/auth/login');
            toast.info('Sesión cerrada en otra pestaña.');
          }
          break;
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel?.removeEventListener('message', handleMessage);
    };
  }, [router, refresh]);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      setState('HYDRATING');
      await refresh();
      if (mounted) {
        setLoading(false);
      }
    };
    initAuth();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const login = async (dto: any) => {
    setState('AUTH_PENDING');
    try {
      const { data } = await apiClient.post('/auth/login', dto);

      if (data.user && !data.user.is2FAVerified) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        setState('AWAITING_2FA');
        router.push(`/auth/2fa?userId=${data.user.id}`);
        return { requires2FA: true };
      }

      setAccessToken(data.accessToken);
      setUser(data.user);
      setState('AUTHENTICATED');

      broadcastChannel?.postMessage({
        type: 'SESSION_CHANGED',
      });

      if (data.securityWarnings) {
        data.securityWarnings.forEach((warn: string) => {
          toast.warning(`Aviso de seguridad: ${warn}`);
        });
      }

      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      setState('IDLE');
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    } finally {
      setUser(null);
      setAccessToken(null);
      setState('TERMINATED');
      broadcastChannel?.postMessage({ type: 'LOGOUT' });
      router.push('/auth/login');
    }
  };

  const verify2FA = async (code: string, isBackup: boolean = false, userId?: string) => {
    setState('AUTH_PENDING');
    try {
      const payload: any = isBackup ? { backupCode: code } : { totpToken: code };
      if (userId) {
        payload.userId = userId;
      }
      const { data } = await apiClient.post('/auth/2fa/verify', payload);

      if (data.accessToken) {
        setAccessToken(data.accessToken);
        
        let verifiedUser: User | null = null;
        if (data.user) {
          verifiedUser = { ...data.user, is2FAVerified: true };
          setUser(verifiedUser);
        } else {
          setUser((prevUser) => {
            if (prevUser) {
              verifiedUser = { ...prevUser, is2FAVerified: true };
              return verifiedUser;
            }
            return null;
          });
        }

        setState('AUTHENTICATED');

        broadcastChannel?.postMessage({
          type: 'SESSION_CHANGED',
        });

        router.push('/dashboard');
      }
    } catch (error: any) {
      setState('AWAITING_2FA');
      const message = error.response?.data?.message || 'Código de verificación inválido';
      toast.error(message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        state,
        login,
        logout,
        refresh,
        verify2FA,
        setUser,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
