'use client';

import { useState } from 'react';
import { useComplianceReports, ComplianceReport, ComplianceReportType } from '@/hooks/use-compliance-reports';
import { motion } from 'motion/react';
import {
  Shield,
  Plus,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Calendar,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

const REPORT_TYPE_LABELS: Record<ComplianceReportType, string> = {
  integrity: 'Integridad de Cadenas',
  access_review: 'Revisión de Accesos',
  session_audit: 'Auditoría de Sesiones',
  event_anomaly: 'Detección de Anomalías',
  cross_tenant: 'Análisis Multi-Tenant',
};

const REPORT_TYPE_DESCRIPTIONS: Record<ComplianceReportType, string> = {
  integrity: 'Verifica la cadena inmutable de hashes en registros de auditoría',
  access_review: 'Analiza permisos y accesos otorgados en el período',
  session_audit: 'Revisa sesiones activas, revocadas y patrones de uso',
  event_anomaly: 'Detecta patrones inusuales en eventos del sistema',
  cross_tenant: 'Análisis de aislamiento entre tenants',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[var(--amber-soft)] text-[var(--amber)]',
  completed: 'bg-[var(--green-soft)] text-[var(--green)]',
  failed: 'bg-[var(--red-soft)] text-[var(--red)]',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  pending: Clock,
  completed: CheckCircle2,
  failed: XCircle,
};

function ReportCard({ report, onExport }: { report: ComplianceReport; onExport: (id: string, format: 'json' | 'csv') => void }) {
  const StatusIcon = STATUS_ICONS[report.status] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Shield size={17} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[var(--text-1)]">
              {REPORT_TYPE_LABELS[report.reportType]}
            </p>
            <p className="text-[11px] text-[var(--text-4)] mt-0.5">
              {REPORT_TYPE_DESCRIPTIONS[report.reportType]}
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLES[report.status] || 'bg-[var(--off-white)] text-[var(--text-3)]'}`}>
          <StatusIcon size={11} />
          {report.status === 'pending' ? 'Pendiente' : report.status === 'completed' ? 'Completado' : 'Fallido'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <p className="text-[var(--text-4)] mb-0.5">Período</p>
          <p className="text-[var(--text-2)] font-medium">
            {new Date(report.periodStart).toLocaleDateString('es-EC')} — {new Date(report.periodEnd).toLocaleDateString('es-EC')}
          </p>
        </div>
        <div>
          <p className="text-[var(--text-4)] mb-0.5">Generado</p>
          <p className="text-[var(--text-2)] font-medium">
            {new Date(report.createdAt).toLocaleDateString('es-EC')}
          </p>
        </div>
        {report.entriesAudited !== null && (
          <div>
            <p className="text-[var(--text-4)] mb-0.5">Registros auditados</p>
            <p className="text-[var(--text-2)] font-semibold">{report.entriesAudited.toLocaleString()}</p>
          </div>
        )}
        {report.anomaliesFound !== null && (
          <div>
            <p className="text-[var(--text-4)] mb-0.5">Anomalías encontradas</p>
            <p className={`font-semibold ${report.anomaliesFound > 0 ? 'text-[var(--red)]' : 'text-[var(--green)]'}`}>
              {report.anomaliesFound}
            </p>
          </div>
        )}
        {report.chainVerified !== null && (
          <div>
            <p className="text-[var(--text-4)] mb-0.5">Cadena verificada</p>
            <p className={`font-semibold ${report.chainVerified ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {report.chainVerified ? 'Intacta' : 'Comprometida'}
            </p>
          </div>
        )}
      </div>

      {report.summary && (
        <div className="mt-3 rounded-lg bg-[var(--off-white)] p-3 text-[12px] text-[var(--text-2)]">
          {report.summary}
        </div>
      )}

      {report.status === 'completed' && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onExport(report.id, 'json')}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] transition-colors"
          >
            <Download size={12} />
            JSON
          </button>
          <button
            onClick={() => onExport(report.id, 'csv')}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] transition-colors"
          >
            <Download size={12} />
            CSV
          </button>
        </div>
      )}
    </motion.div>
  );
}

function GenerateModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: (params: any) => void }) {
  const [reportType, setReportType] = useState<ComplianceReportType>('integrity');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!periodStart || !periodEnd) {
      toast.error('Selecciona el período del reporte');
      return;
    }
    try {
      setGenerating(true);
      await onGenerate({ reportType, periodStart, periodEnd });
      toast.success('Reporte generado exitosamente');
      onClose();
    } catch {
      toast.error('Error al generar el reporte');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[15px] font-semibold text-[var(--text-1)] mb-4">
          Generar Reporte de Cumplimiento
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-[var(--text-4)] mb-1.5">Tipo de reporte</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ComplianceReportType)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--white)] px-3 py-2.5 text-[13px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none transition-all"
            >
              {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-[var(--text-4)]">
              {REPORT_TYPE_DESCRIPTIONS[reportType]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-4)] mb-1.5">Fecha inicio</label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--white)] px-3 py-2.5 text-[13px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-4)] mb-1.5">Fecha fin</label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--white)] px-3 py-2.5 text-[13px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--border)] px-4 py-2.5 text-[13px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating || !periodStart || !periodEnd}
            className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {generating ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CompliancePage() {
  const [showGenerate, setShowGenerate] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('');

  const { reports, loading, error, refetch, generateReport, exportReport } = useComplianceReports({
    reportType: (typeFilter as ComplianceReportType) || undefined,
  });

  const handleGenerate = async (params: any) => {
    await generateReport(params);
  };

  const handleExport = async (reportId: string, format: 'json' | 'csv') => {
    try {
      const result = await exportReport(reportId, format);
      toast.success(`Exportación ${format.toUpperCase()} descargada`);
    } catch {
      toast.error('Error al exportar el reporte');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--green-soft)]">
            <Shield size={17} className="text-[var(--green)]" />
          </div>
          <div>
            <h1 className="font-serif text-[1.6rem] text-[var(--text-1)]">Cumplimiento Normativo</h1>
            <p className="text-[12px] text-[var(--text-3)]">
              Genera reportes de auditoría, verifica integridad y exporta evidencia
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGenerate(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Generar reporte
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-3"
      >
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--white)] px-3 py-2 text-[12px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none transition-all"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(REPORT_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-[12px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] transition-colors"
        >
          <RefreshCw size={13} />
          Actualizar
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-4 text-[13px] text-[var(--red)]">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-[var(--border-light)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 rounded bg-[var(--border-light)]" />
                  <div className="h-2.5 w-56 rounded bg-[var(--border-light)]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 rounded-lg bg-[var(--border-light)]" />
                <div className="h-12 rounded-lg bg-[var(--border-light)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && reports.length === 0 && (
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-12 text-center">
          <Shield size={32} className="mx-auto mb-3 text-[var(--text-4)]" />
          <p className="text-[14px] font-medium text-[var(--text-2)]">No hay reportes de cumplimiento</p>
          <p className="text-[12px] text-[var(--text-4)] mt-1 mb-4">
            Genera tu primer reporte para comenzar a auditar el sistema
          </p>
          <button
            onClick={() => setShowGenerate(true)}
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={14} className="inline mr-1.5" />
            Generar primer reporte
          </button>
        </div>
      )}

      {/* Report grid */}
      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onExport={handleExport} />
          ))}
        </div>
      )}

      {/* Generate modal */}
      {showGenerate && (
        <GenerateModal
          onClose={() => setShowGenerate(false)}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}
