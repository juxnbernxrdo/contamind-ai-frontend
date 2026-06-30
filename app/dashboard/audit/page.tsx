'use client';

import { useState } from 'react';
import { useAuditLogs, AuditLog } from '@/hooks/use-audit-logs';
import { motion } from 'motion/react';
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  Filter,
  Lock,
  Unlock,
  UserX,
  UserCheck,
  LogIn,
  LogOut,
  Key,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

const ACTION_ICONS: Record<string, typeof Shield> = {
  login: LogIn,
  logout: LogOut,
  register: UserCheck,
  '2fa_setup': Key,
  '2fa_verify': ShieldCheck,
  'passkey_register': Key,
  'passkey_verify': ShieldCheck,
  lock: Lock,
  unlock: Unlock,
  disable: UserX,
  enable: UserCheck,
  revoke_session: LogOut,
  revoke_all_sessions: LogOut,
  create: Settings,
  update: Settings,
  delete: AlertTriangle,
  export: FileText,
  verify: CheckCircle2,
};

const SEVERITY_STYLES: Record<string, string> = {
  low: 'bg-[var(--green-soft)] text-[var(--green)]',
  medium: 'bg-[var(--amber-soft)] text-[var(--amber)]',
  high: 'bg-[var(--red-soft)] text-[var(--red)]',
  critical: 'bg-[var(--red-soft)] text-[var(--red)]',
};

const RESULT_STYLES: Record<string, string> = {
  success: 'text-[var(--green)]',
  failure: 'text-[var(--red)]',
  partial: 'text-[var(--amber)]',
};

function ActionIcon({ action }: { action: string }) {
  const Icon = ACTION_ICONS[action] || Info;
  return <Icon size={14} />;
}

function LogRow({ log, onExpand }: { log: AuditLog; onExpand: (log: AuditLog) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-4 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] transition-all duration-200 cursor-pointer"
      onClick={() => onExpand(log)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
            log.severity === 'high' || log.severity === 'critical'
              ? 'bg-[var(--red-soft)]'
              : log.severity === 'medium'
              ? 'bg-[var(--amber-soft)]'
              : 'bg-[var(--green-soft)]'
          }`}>
            <ActionIcon action={log.action} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[13px] font-semibold text-[var(--text-1)]">
                {log.action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${SEVERITY_STYLES[log.severity] || 'bg-[var(--off-white)] text-[var(--text-3)]'}`}>
                {log.severity}
              </span>
              <span className={`text-[11px] font-medium ${RESULT_STYLES[log.result] || 'text-[var(--text-3)]'}`}>
                {log.result}
              </span>
            </div>
            {log.description && (
              <p className="mt-1 text-[12px] text-[var(--text-3)] line-clamp-1">{log.description}</p>
            )}
            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[var(--text-4)]">
              {log.user && (
                <span>{log.user.email}</span>
              )}
              {log.user && <span>·</span>}
              <span>{new Date(log.createdAt).toLocaleString('es-EC')}</span>
              {log.ip && (
                <>
                  <span>·</span>
                  <span className="font-mono">{log.ip}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onExpand(log); }}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[var(--text-4)] opacity-0 group-hover:opacity-100 hover:bg-[var(--off-white)] transition-all"
        >
          <Eye size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function LogDetail({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[var(--text-1)]">
            Detalle del evento de auditoría
          </h3>
          <button onClick={onClose} className="text-[var(--text-4)] hover:text-[var(--text-1)] transition-colors text-[18px]">
            ×
          </button>
        </div>

        <div className="space-y-3">
          <DetailRow label="Acción" value={log.action} />
          <DetailRow label="Severidad" value={log.severity} />
          <DetailRow label="Resultado" value={log.result} />
          {log.description && <DetailRow label="Descripción" value={log.description} />}
          <DetailRow label="IP" value={log.ip} mono />
          <DetailRow label="User Agent" value={log.userAgent} />
          <DetailRow label="Fecha" value={new Date(log.createdAt).toLocaleString('es-EC')} />
          {log.user && <DetailRow label="Usuario" value={log.user.email} />}
          <DetailRow label="Hash" value={log.hash} mono />
          {log.previousHash && <DetailRow label="Hash anterior" value={log.previousHash} mono />}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-[var(--text-4)] mb-1">Metadata</p>
              <pre className="rounded-lg bg-[var(--off-white)] p-3 text-[11px] text-[var(--text-2)] overflow-x-auto">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[11px] font-medium text-[var(--text-4)] w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-[12px] text-[var(--text-2)] break-all ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [verifying, setVerifying] = useState(false);
  const limit = 30;

  const { logs, total, totalPages, loading, error, refetch, verifyIntegrity } = useAuditLogs({
    page,
    limit,
    action: actionFilter || undefined,
    severity: severityFilter || undefined,
  });

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const result = await verifyIntegrity();
      if (result.valid) {
        toast.success('Integridad verificada: cadena de auditoría intacta');
      } else {
        toast.error(`Integridad comprometida: ${result.message}`);
      }
    } catch {
      toast.error('Error al verificar integridad');
    } finally {
      setVerifying(false);
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--amber-soft)]">
            <FileText size={17} className="text-[var(--amber)]" />
          </div>
          <div>
            <h1 className="font-serif text-[1.6rem] text-[var(--text-1)]">Auditoría</h1>
            <p className="text-[12px] text-[var(--text-3)]">
              Registro inmutable de eventos del sistema con verificación de integridad
            </p>
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3.5 py-2 text-[12px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] disabled:opacity-50 transition-all"
        >
          <Shield size={13} className={verifying ? 'animate-spin' : ''} />
          {verifying ? 'Verificando...' : 'Verificar integridad'}
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-3)]">
          <Filter size={13} />
          Filtros:
        </div>

        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-[var(--border)] bg-[var(--white)] px-3 py-2 text-[12px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none transition-all"
        >
          <option value="">Todas las acciones</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="register">Registro</option>
          <option value="2fa_setup">2FA Setup</option>
          <option value="2fa_verify">2FA Verify</option>
          <option value="passkey_register">Passkey Register</option>
          <option value="passkey_verify">Passkey Verify</option>
          <option value="lock">Bloqueo</option>
          <option value="unlock">Desbloqueo</option>
          <option value="disable">Deshabilitar</option>
          <option value="enable">Habilitar</option>
          <option value="revoke_session">Revocar Sesión</option>
          <option value="revoke_all_sessions">Revocar Todas</option>
          <option value="create">Crear</option>
          <option value="update">Actualizar</option>
          <option value="delete">Eliminar</option>
          <option value="export">Exportar</option>
          <option value="verify">Verificar</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-[var(--border)] bg-[var(--white)] px-3 py-2 text-[12px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none transition-all"
        >
          <option value="">Todas las severidades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-[12px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] transition-colors"
        >
          <RefreshCw size={13} />
          Actualizar
        </button>
      </motion.div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-[12px] text-[var(--text-3)]">
        <span>
          <span className="font-semibold text-[var(--text-1)]">{total}</span> eventos registrados
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-4 text-[13px] text-[var(--red)]">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[var(--border-light)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 rounded bg-[var(--border-light)]" />
                  <div className="h-2.5 w-72 rounded bg-[var(--border-light)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log list */}
      {!loading && logs.length === 0 && (
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-12 text-center">
          <FileText size={32} className="mx-auto mb-3 text-[var(--text-4)]" />
          <p className="text-[14px] font-medium text-[var(--text-2)]">No hay eventos de auditoría</p>
          <p className="text-[12px] text-[var(--text-4)] mt-1">
            Los eventos aparecerán aquí cuando se realicen acciones en el sistema
          </p>
        </div>
      )}

      {!loading && logs.length > 0 && (
        <div className="space-y-2">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} onExpand={setSelectedLog} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[12px] text-[var(--text-4)]">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-3)] hover:bg-[var(--off-white)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-3)] hover:bg-[var(--off-white)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedLog && <LogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
