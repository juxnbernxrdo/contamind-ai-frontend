'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
  emailVerified: boolean;
  twoFAEnabled: boolean;
  accountLocked: boolean;
  accountDisabled: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  tenantId: string;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseAdminUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  accountLocked?: boolean;
  accountDisabled?: boolean;
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (options.page) params.set('page', String(options.page));
      if (options.limit) params.set('limit', String(options.limit));
      if (options.search) params.set('search', options.search);
      if (options.role) params.set('role', options.role);
      if (options.accountLocked !== undefined) params.set('accountLocked', String(options.accountLocked));
      if (options.accountDisabled !== undefined) params.set('accountDisabled', String(options.accountDisabled));

      const { data } = await apiClient.get<AdminUsersResponse>(`/auth-admin/users?${params.toString()}`);
      setUsers(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.search, options.role, options.accountLocked, options.accountDisabled]);

  const lockUser = useCallback(async (userId: string, lockMinutes = 15) => {
    await apiClient.post(`/auth-admin/users/${userId}/lock`, { lockMinutes });
    await fetchUsers();
  }, [fetchUsers]);

  const unlockUser = useCallback(async (userId: string) => {
    await apiClient.post(`/auth-admin/users/${userId}/unlock`);
    await fetchUsers();
  }, [fetchUsers]);

  const disableUser = useCallback(async (userId: string) => {
    await apiClient.post(`/auth-admin/users/${userId}/disable`);
    await fetchUsers();
  }, [fetchUsers]);

  const enableUser = useCallback(async (userId: string) => {
    await apiClient.post(`/auth-admin/users/${userId}/enable`);
    await fetchUsers();
  }, [fetchUsers]);

  const revokeUserSessions = useCallback(async (userId: string) => {
    await apiClient.post(`/auth-admin/users/${userId}/revoke-sessions`);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return fetchUsers();
    });
    return () => { cancelled = true; };
  }, [fetchUsers]);

  return { users, total, totalPages, loading, error, refetch: fetchUsers, lockUser, unlockUser, disableUser, enableUser, revokeUserSessions };
}
