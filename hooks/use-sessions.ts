'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface Session {
  id: string;
  deviceId: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  revokedAt: string | null;
  device?: {
    id: string;
    name: string;
    deviceType: string;
    userAgent: string;
    ipAddress: string;
    isTrusted: boolean;
    lastActivityAt: string;
  };
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<Session[]>('/auth/sessions');
      setSessions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar las sesiones');
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeSession = useCallback(async (sessionId: string) => {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
    await fetchSessions();
  }, [fetchSessions]);

  const revokeAll = useCallback(async () => {
    await apiClient.delete('/auth/sessions');
    await fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchSessions();
    });
  }, [fetchSessions]);

  return { sessions, loading, error, refetch: fetchSessions, revokeSession, revokeAll };
}
