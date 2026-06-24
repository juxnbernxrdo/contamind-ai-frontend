'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  activeSessions: number;
  devices: number;
  revenue: number;
  pendingInvoices: number;
  systemStatus: string;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
      setStats(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar las métricas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchStats();
    });
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
