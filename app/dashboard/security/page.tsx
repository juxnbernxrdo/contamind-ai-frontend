'use client';

import { useState } from 'react';
import { useSessions, Session } from '@/hooks/use-sessions';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import {
  Shield,
  MonitorSmartphone,
  Key,
  Lock,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  Smartphone,
  Laptop,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function SessionRow({ session, onRevoke }: { session: Session; onRevoke: (id: string) => void }) {
  const isCurrent = !session.revokedAt && new Date(session.expiresAt) > new Date();
  const deviceIcon = session.device?.deviceType === 'mobile' ? Smartphone : Laptop;

  const DeviceIcon = deviceIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-xl border border-[var(--border-light)] bg-[var(--white)] p-3.5 shadow-[var(--shadow-subtle)]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
          isCurrent ? 'bg-[var(--green-soft)]' : 'bg-[var(--off-white)]'
        }`}>
          <DeviceIcon size={16} className={isCurrent ? 'text-[var(--green)]' : 'text-[var(--text-4)]'} />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-1)] truncate">
            {session.device?.name || 'Dispositivo desconocido'}
          </p>
          <p className="text-[11px] text-[var(--text-4)] truncate">
            {session.device?.ipAddress} · {session.device?.userAgent?.split(' ').slice(-2).join(' ') || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isCurrent ? (
          <span className="rounded-full bg-[var(--green-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--green)]">
            Activa
          </span>
        ) : (
          <span className="rounded-full bg-[var(--off-white)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-4)]">
            Revocada
          </span>
        )}

        {isCurrent && (
          <button
            onClick={() => onRevoke(session.id)}
            className="flex h-7 items-center gap-1 rounded-lg border border-[var(--red-soft)] px-2 text-[10px] font-semibold text-[var(--red)] hover:bg-[var(--red-soft)] transition-colors"
          >
            <LogOut size={11} />
            Revocar
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function SecurityCenterPage() {
  const { user } = useAuth();
  const { sessions, loading: sessionsLoading, refetch, revokeSession, revokeAll } = useSessions();
  const [revokingAll, setRevokingAll] = useState(false);

  const activeSessions = sessions.filter((s) => !s.revokedAt && new Date(s.expiresAt) > new Date());
  const revokedSessions = sessions.filter((s) => s.revokedAt || new Date(s.expiresAt) <= new Date());

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      toast.success('Sesión revocada');
    } catch {
      toast.error('Error al revocar la sesión');
    }
  };

  const handleRevokeAll = async () => {
    try {
      setRevokingAll(true);
      await revokeAll();
      toast.success('Todas las sesiones han sido revocadas');
    } catch {
      toast.error('Error al revocar las sesiones');
    } finally {
      setRevokingAll(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--green-soft)]">
            <Shield size={17} className="text-[var(--green)]" />
          </div>
          <div>
            <h1 className="font-serif text-[1.6rem] text-[var(--text-1)]">Centro de Seguridad</h1>
            <p className="text-[12px] text-[var(--text-3)]">
              Gestiona sesiones, dispositivos, autenticación de dos factores y passkeys
            </p>
          </div>
        </div>
      </motion.div>

      {/* Security status overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <SecurityCard
          icon={MonitorSmartphone}
          title="Sesiones activas"
          value={activeSessions.length}
          description="Dispositivos conectados actualmente"
          href="/dashboard/security/sessions"
          color="blue"
        />
        <SecurityCard
          icon={Key}
          title="2FA"
          value={user?.twoFAEnabled ? 'Activo' : 'Inactivo'}
          description={user?.twoFAEnabled ? 'Autenticación de dos factores habilitada' : 'Recomendado: activa 2FA'}
          href="/dashboard/profile/2fa"
          color={user?.twoFAEnabled ? 'green' : 'amber'}
        />
        <SecurityCard
          icon={Lock}
          title="Passkeys"
          value={user?.twoFAEnabled ? 'Configurado' : 'Pendiente'}
          description="Autenticación biométrica por hardware"
          href="/dashboard/security/passkeys"
          color={user?.twoFAEnabled ? 'green' : 'amber'}
        />
      </motion.div>

      {/* Active sessions */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
            Sesiones activas ({activeSessions.length})
          </p>
          {activeSessions.length > 1 && (
            <button
              onClick={handleRevokeAll}
              disabled={revokingAll}
              className="flex items-center gap-1 rounded-lg border border-[var(--red-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--red)] hover:bg-[var(--red-soft)] disabled:opacity-50 transition-colors"
            >
              <AlertTriangle size={11} />
              {revokingAll ? 'Revocando...' : 'Revocar todas excepto esta'}
            </button>
          )}
        </div>

        {sessionsLoading ? (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-[var(--border-light)] bg-[var(--white)] p-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[var(--border-light)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-[var(--border-light)]" />
                    <div className="h-2.5 w-48 rounded bg-[var(--border-light)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeSessions.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-light)] bg-[var(--white)] p-6 text-center">
            <MonitorSmartphone size={24} className="mx-auto mb-2 text-[var(--text-4)]" />
            <p className="text-[13px] text-[var(--text-2)]">No hay sesiones activas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeSessions.map((session) => (
              <SessionRow key={session.id} session={session} onRevoke={handleRevoke} />
            ))}
          </div>
        )}
      </motion.section>

      {/* Quick links */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
          Configuración de seguridad
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <SecurityLink
            href="/dashboard/security/sessions"
            icon={MonitorSmartphone}
            title="Historial de sesiones"
            description="Ver todas las sesiones (activas y revocadas)"
          />
          <SecurityLink
            href="/dashboard/security/devices"
            icon={Smartphone}
            title="Dispositivos"
            description="Gestionar dispositivos registrados"
          />
          <SecurityLink
            href="/dashboard/profile/2fa"
            icon={Lock}
            title="Autenticación 2FA"
            description="Configurar verificación en dos pasos"
          />
          <SecurityLink
            href="/dashboard/security/passkeys"
            icon={Key}
            title="Passkeys"
            description="Gestionar llaves de seguridad"
          />
          <SecurityLink
            href="/dashboard/security/policies"
            icon={Shield}
            title="Políticas de acceso"
            description="Configurar reglas de seguridad"
          />
          <SecurityLink
            href="/dashboard/settings"
            icon={Lock}
            title="Cambiar contraseña"
            description="Actualizar credenciales de acceso"
          />
        </div>
      </motion.section>
    </div>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  value,
  description,
  href,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
  href: string;
  color: 'green' | 'amber' | 'blue';
}) {
  const colorMap = {
    green: { bg: 'bg-[var(--green-soft)]', icon: 'text-[var(--green)]' },
    amber: { bg: 'bg-[var(--amber-soft)]', icon: 'text-[var(--amber)]' },
    blue: { bg: 'bg-[var(--accent-soft)]', icon: 'text-[var(--accent)]' },
  };
  const c = colorMap[color];

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-4 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.bg}`}>
          <Icon size={17} className={c.icon} />
        </div>
        <ChevronRight size={14} className="text-[var(--text-4)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
      <p className="text-[20px] font-semibold text-[var(--text-1)]">{value}</p>
      <p className="text-[12px] font-medium text-[var(--text-3)]">{title}</p>
      <p className="text-[11px] text-[var(--text-4)] mt-0.5">{description}</p>
    </Link>
  );
}

function SecurityLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--white)] p-3.5 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] transition-all duration-200"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--off-white)]">
        <Icon size={16} className="text-[var(--text-3)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--text-1)]">{title}</p>
        <p className="text-[11px] text-[var(--text-4)]">{description}</p>
      </div>
      <ChevronRight size={14} className="flex-shrink-0 text-[var(--text-4)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all duration-200" />
    </Link>
  );
}
