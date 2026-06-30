'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export type ComplianceReportType = 'integrity' | 'access_review' | 'session_audit' | 'event_anomaly' | 'cross_tenant';

export interface ComplianceReport {
  id: string;
  tenantId: string;
  reportType: ComplianceReportType;
  periodStart: string;
  periodEnd: string;
  generatedBy: string;
  status: 'pending' | 'completed' | 'failed';
  summary: string | null;
  filePath: string | null;
  chainVerified: boolean | null;
  entriesAudited: number | null;
  anomaliesFound: number | null;
  createdAt: string;
}

interface UseComplianceReportsOptions {
  reportType?: ComplianceReportType;
  status?: string;
  limit?: number;
}

export function useComplianceReports(options: UseComplianceReportsOptions = {}) {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (options.reportType) params.set('reportType', options.reportType);
      if (options.status) params.set('status', options.status);
      if (options.limit) params.set('limit', String(options.limit));

      const { data } = await apiClient.get<ComplianceReport[]>(`/compliance/reports?${params.toString()}`);
      setReports(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar reportes de cumplimiento');
    } finally {
      setLoading(false);
    }
  }, [options.reportType, options.status, options.limit]);

  const generateReport = useCallback(async (params: {
    reportType: ComplianceReportType;
    periodStart: string;
    periodEnd: string;
    filters?: Record<string, unknown>;
  }) => {
    const { data } = await apiClient.post('/compliance/reports/generate', params);
    await fetchReports();
    return data;
  }, [fetchReports]);

  const exportReport = useCallback(async (reportId: string, format: 'json' | 'csv' = 'json') => {
    const { data } = await apiClient.post(`/compliance/reports/${reportId}/export`, { format });
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return fetchReports();
    });
    return () => { cancelled = true; };
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports, generateReport, exportReport };
}
