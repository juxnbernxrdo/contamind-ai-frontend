'use client';

import { useSessions } from '@/hooks/use-sessions';
import { motion } from 'motion/react';
import {
  Monitor,
  Smartphone,
  Tablet,
  Shield,
  ShieldAlert,
  Globe,
  Clock,
  Cpu,
} from 'lucide-react';

function getDeviceIcon(deviceType: string) {
  switch (deviceType?.toLowerCase()) {
    case 'ios': case 'android': return Smartphone;
    case 'tablet': return Tablet;
    default: return Monitor;
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

export default function DevicesPage() {
  const { sessions, loading, error } = useSessions();

  // Deduplicate devices from sessions
  const deviceMap = new Map<string, NonNullable<typeof sessions[0]['device']>>();
  sessions.forEach((s) => {
    if (s.device && !deviceMap.has(s.device.id)) {
      deviceMap.set(s.device.id, s.device);
    }
  });
  const devices = Array.from(deviceMap.values());

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
          Seguridad
        </p>
        <h1 className="mt-0.5 font-serif text-[1.6rem] text-[var(--text-1)]">
          Dispositivos
        </h1>
        <p className="mt-1 text-[13px] text-[var(--text-3)]">
          {devices.length > 0
            ? `${devices.length} dispositivo${devices.length !== 1 ? 's' : ''} registrado${devices.length !== 1 ? 's' : ''} en tu cuenta`
            : 'Dispositivos que han accedido a tu cuenta'}
        </p>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-4 text-[13px] text-[var(--red)]">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-[var(--border-light)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded-lg bg-[var(--border-light)]" />
                  <div className="h-3 w-64 rounded-lg bg-[var(--border-light)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-light)] bg-[var(--white)] py-16 text-center">
          <Cpu size={36} className="text-[var(--text-4)] mb-4" />
          <p className="text-[14px] font-semibold text-[var(--text-2)]">Sin dispositivos</p>
          <p className="mt-1 text-[12px] text-[var(--text-4)]">No se encontraron dispositivos activos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {devices.map((device, idx) => {
            const DeviceIcon = getDeviceIcon(device.deviceType);
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] hover:border-[var(--border)] transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${device.isTrusted ? 'bg-[var(--green-soft)]' : 'bg-[var(--off-white)]'}`}>
                    <DeviceIcon size={18} className={device.isTrusted ? 'text-[var(--green)]' : 'text-[var(--text-3)]'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--text-1)] truncate">
                      {device.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-4)] capitalize">
                      {device.deviceType}
                    </p>
                  </div>
                  {device.isTrusted ? (
                    <Shield size={15} className="text-[var(--green)] flex-shrink-0" />
                  ) : (
                    <ShieldAlert size={15} className="text-[var(--text-4)] flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-4)]">
                    <Globe size={11} className="flex-shrink-0" />
                    <span className="truncate">{device.ipAddress || 'IP desconocida'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-4)]">
                    <Clock size={11} className="flex-shrink-0" />
                    <span>Actividad: {timeAgo(device.lastActivityAt)}</span>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${device.isTrusted ? 'bg-[var(--green-soft)] text-[var(--green)]' : 'bg-[var(--off-white)] text-[var(--text-4)]'}`}>
                    {device.isTrusted ? '✓ Dispositivo de confianza' : 'Sin marcar como confiable'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
