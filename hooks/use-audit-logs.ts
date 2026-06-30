'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  severity: string;
  result: string;
  description: string | null;
  ip: string;
  userAgent: string;
  metadata: Record<string, unknown> | null;
  hash: string;
  previousHash: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseAuditLogsOptions {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  severity?: string;
}

export function useAuditLogs(options: UseAuditLogsOptions = {}) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (options.page) params.set('page', String(options.page));
      if (options.limit) params.set('limit', String(options.limit));
      if (options.userId) params.set('userId', options.userId);
      if (options.action) params.set('action', options.action);
      if (options.severity) params.set('severity', options.severity);

      const { data } = await apiClient.get<AuditLogsResponse>(`/auth-admin/audit-logs?${params.toString()}`);
      setLogs(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar logs de auditoría');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.userId, options.action, options.severity]);

  const verifyIntegrity = useCallback(async () => {
    const { data } = await apiClient.get('/auth-admin/audit-logs/verify');
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return fetchLogs();
    });
    return () => { cancelled = true; };
  }, [fetchLogs]);

  return { logs, total, totalPages, loading, error, refetch: fetchLogs, verifyIntegrity };
}
