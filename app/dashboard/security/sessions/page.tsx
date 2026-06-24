'use client';

import { useSessions } from '@/hooks/use-sessions';
import { motion } from 'motion/react';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Shield,
  ShieldOff,
  Trash2,
  RefreshCw,
  Clock,
  Wifi,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

function getDeviceIcon(deviceType: string) {
  switch (deviceType?.toLowerCase()) {
    case 'ios':
    case 'android':
      return Smartphone;
    case 'tablet':
      return Tablet;
    case 'web':
    default:
      return Monitor;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export default function SessionsPage() {
  const { sessions, loading, error, refetch, revokeSession, revokeAll } = useSessions();
  const { logout } = useAuth();
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const handleRevoke = async (sessionId: string) => {
    try {
      setRevoking(sessionId);
      await revokeSession(sessionId);
      toast.success('Sesión revocada correctamente');
    } catch {
      toast.error('No se pudo revocar la sesión');
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('¿Cerrar todas las sesiones activas? Serás desconectado.')) return;
    try {
      setRevokingAll(true);
      await revokeAll();
      toast.success('Todas las sesiones fueron cerradas');
      logout();
    } catch {
      toast.error('No se pudieron revocar las sesiones');
      setRevokingAll(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
            Seguridad
          </p>
          <h1 className="mt-0.5 font-serif text-[1.6rem] text-[var(--text-1)]">
            Sesiones activas
          </h1>
          <p className="mt-1 text-[13px] text-[var(--text-3)]">
            {sessions.length > 0
              ? `${sessions.length} sesión${sessions.length !== 1 ? 'es' : ''} activa${sessions.length !== 1 ? 's' : ''} en tu cuenta`
              : 'Gestiona los dispositivos conectados a tu cuenta'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-[12px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-all"
          >
            <RefreshCw size={13} />
            Actualizar
          </button>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAll}
              disabled={revokingAll}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--red-soft)] px-3 py-2 text-[12px] font-semibold text-[var(--red)] hover:opacity-80 disabled:opacity-50 transition-all"
            >
              <ShieldOff size={13} />
              {revokingAll ? 'Revocando…' : 'Cerrar todas'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-4 text-[13px] text-[var(--red)]">
          ⚠️ {error}
        </div>
      )}

      {/* Sessions list */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5"
            >
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-[var(--border-light)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded-lg bg-[var(--border-light)]" />
                  <div className="h-3 w-72 rounded-lg bg-[var(--border-light)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-light)] bg-[var(--white)] py-16 text-center"
        >
          <Wifi size={36} className="text-[var(--text-4)] mb-4" />
          <p className="text-[14px] font-semibold text-[var(--text-2)]">
            Sin sesiones activas
          </p>
          <p className="mt-1 text-[12px] text-[var(--text-4)]">
            No hay sesiones activas en este momento
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, idx) => {
            const DeviceIcon = session.device
              ? getDeviceIcon(session.device.deviceType)
              : Globe;
            const isThisSession = idx === 0; // heuristic: first is usually current

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group flex items-start gap-4 rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] hover:border-[var(--border)] transition-all duration-200"
              >
                {/* Device icon */}
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                    isThisSession
                      ? 'bg-[var(--accent-soft)]'
                      : 'bg-[var(--off-white)]'
                  }`}
                >
                  <DeviceIcon
                    size={20}
                    className={
                      isThisSession
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-3)]'
                    }
                  />
                </div>

                {/* Session info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-[var(--text-1)]">
                      {session.device?.name || 'Dispositivo desconocido'}
                    </p>
                    {isThisSession && (
                      <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                        Sesión actual
                      </span>
                    )}
                    {session.device?.isTrusted && (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--green-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--green)]">
                        <Shield size={9} />
                        Confiable
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                    {session.device?.ipAddress && (
                      <span className="flex items-center gap-1 text-[11px] text-[var(--text-4)]">
                        <Globe size={11} />
                        {session.device.ipAddress}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-[var(--text-4)]">
                      <Clock size={11} />
                      Activa {timeAgo(session.lastActivityAt)}
                    </span>
                    <span className="text-[11px] text-[var(--text-4)]">
                      Desde {formatDate(session.createdAt)}
                    </span>
                  </div>

                  {session.device?.userAgent && (
                    <p className="mt-1 text-[11px] text-[var(--text-4)] truncate max-w-md">
                      {session.device.userAgent}
                    </p>
                  )}
                </div>

                {/* Revoke button */}
                {!isThisSession && (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    disabled={revoking === session.id}
                    aria-label="Revocar sesión"
                    className="flex-shrink-0 flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-[11px] font-medium text-[var(--text-3)] opacity-0 group-hover:opacity-100 hover:bg-[var(--red-soft)] hover:text-[var(--red)] hover:border-[var(--red-soft)] disabled:opacity-50 transition-all duration-200"
                  >
                    <Trash2 size={12} />
                    {revoking === session.id ? 'Revocando…' : 'Revocar'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info note */}
      <p className="text-center text-[11px] text-[var(--text-4)]">
        Las sesiones inactivas se revocan automáticamente según la política de seguridad de tu cuenta.
      </p>
    </div>
  );
}
