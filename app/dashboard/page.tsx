'use client';

import { useAuth } from '@/hooks/use-auth';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { motion } from 'motion/react';
import {
  TrendingUp,
  FileText,
  MonitorSmartphone,
  Activity,
  Shield,
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

// ── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  color?: 'default' | 'green' | 'amber' | 'blue';
  href?: string;
  delay?: number;
}

function KPICard({
  label,
  value,
  icon: Icon,
  description,
  color = 'default',
  href,
  delay = 0,
}: KPICardProps) {
  const colorMap = {
    default: {
      bg: 'bg-[var(--off-white)]',
      icon: 'text-[var(--text-3)]',
    },
    green: {
      bg: 'bg-[var(--green-soft)]',
      icon: 'text-[var(--green)]',
    },
    amber: {
      bg: 'bg-[var(--amber-soft)]',
      icon: 'text-[var(--amber)]',
    },
    blue: {
      bg: 'bg-[var(--accent-soft)]',
      icon: 'text-[var(--accent)]',
    },
  };

  const c = colorMap[color];

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      className="group rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] transition-all duration-200"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.bg}`}>
          <Icon size={17} className={c.icon} />
        </div>
        {href && (
          <ChevronRight
            size={15}
            className="text-[var(--text-4)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
          />
        )}
      </div>
      <p className="text-[22px] font-semibold text-[var(--text-1)] leading-none">{value}</p>
      <p className="mt-1.5 text-[12px] font-medium text-[var(--text-3)]">{label}</p>
      {description && (
        <p className="mt-1 text-[11px] text-[var(--text-4)]">{description}</p>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="block">{inner}</Link>;
  }
  return inner;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isOk = status === 'Operational';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isOk
          ? 'bg-[var(--green-soft)] text-[var(--green)]'
          : 'bg-[var(--amber-soft)] text-[var(--amber)]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOk ? 'bg-[var(--green)]' : 'bg-[var(--amber)]'} animate-pulse`}
      />
      {isOk ? 'Sistema operativo' : status}
    </span>
  );
}

// ── Quick Actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: 'Ver sesiones activas',
    description: 'Gestiona tus dispositivos conectados',
    icon: MonitorSmartphone,
    href: '/dashboard/security/sessions',
    color: 'text-[var(--accent)]',
    bg: 'bg-[var(--accent-soft)]',
  },
  {
    label: 'Seguridad & 2FA',
    description: 'Configura autenticación de dos factores',
    icon: Shield,
    href: '/dashboard/profile/2fa',
    color: 'text-[var(--green)]',
    bg: 'bg-[var(--green-soft)]',
  },
  {
    label: 'Reportes de Cumplimiento',
    description: 'Genera y exporta reportes de auditoría',
    icon: Layers,
    href: '/dashboard/compliance',
    color: 'text-[var(--amber)]',
    bg: 'bg-[var(--amber-soft)]',
  },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[var(--border-light)] ${className}`}
    />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error } = useDashboardStats();

  const firstName = user?.firstName || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-[13px] font-medium text-[var(--text-4)] uppercase tracking-wide">
            {getGreeting()}
          </p>
          <h1 className="mt-0.5 font-serif text-[1.9rem] leading-tight text-[var(--text-1)]">
            {firstName}
          </h1>
          <p className="mt-1 text-[14px] text-[var(--text-3)]">
            Aquí está el estado de tu cuenta hoy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {stats && <StatusBadge status={stats.systemStatus} />}
          <span className="text-[12px] text-[var(--text-4)]">
            {new Date().toLocaleDateString('es-EC', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </span>
        </div>
      </motion.div>

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-4 text-[13px] text-[var(--red)]">
          ⚠️ {error}
        </div>
      )}

      {/* KPI Strip */}
      <section>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
          Métricas de cuenta
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5 shadow-[var(--shadow-subtle)]">
                  <Skeleton className="h-9 w-9 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </>
          ) : (
            <>
              <KPICard
                label="Ingresos autorizados"
                value={stats ? formatCurrency(stats.revenue) : '—'}
                icon={TrendingUp}
                description="Facturas con estado AUTHORIZED"
                color="green"
                delay={0.05}
              />
              <KPICard
                label="Documentos pendientes"
                value={stats?.pendingInvoices ?? '—'}
                icon={FileText}
                description="DRAFT / VALIDATED / SIGNED"
                color="amber"
                delay={0.1}
              />
              <KPICard
                label="Sesiones activas"
                value={stats?.activeSessions ?? '—'}
                icon={Activity}
                description="Sesiones no revocadas"
                color="blue"
                href="/dashboard/security/sessions"
                delay={0.15}
              />
              <KPICard
                label="Dispositivos"
                value={stats?.devices ?? '—'}
                icon={MonitorSmartphone}
                description="Dispositivos registrados"
                href="/dashboard/security/devices"
                delay={0.2}
              />
            </>
          )}
        </div>
      </section>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
            Acciones rápidas
          </p>
          <div className="space-y-2.5">
            {QUICK_ACTIONS.map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-4 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] hover:border-[var(--border)] transition-all duration-200"
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${action.bg}`}>
                  <action.icon size={18} className={action.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-1)]">
                    {action.label}
                  </p>
                  <p className="text-[12px] text-[var(--text-3)]">
                    {action.description}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="flex-shrink-0 text-[var(--text-4)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all duration-200"
                />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Account status */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
            Estado de la cuenta
          </p>
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-5 shadow-[var(--shadow-subtle)] space-y-3">
            {/* Email verified */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2
                  size={15}
                  className={
                    user?.email
                      ? 'text-[var(--green)]'
                      : 'text-[var(--text-4)]'
                  }
                />
                <span className="text-[12px] text-[var(--text-2)]">Email</span>
              </div>
              <span className="text-[11px] text-[var(--text-4)] max-w-[120px] truncate text-right">
                {user?.email}
              </span>
            </div>

            <div className="border-t border-[var(--border-light)]" />

            {/* 2FA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield
                  size={15}
                  className={
                    user?.twoFAEnabled
                      ? 'text-[var(--green)]'
                      : 'text-[var(--amber)]'
                  }
                />
                <span className="text-[12px] text-[var(--text-2)]">
                  Autenticación 2FA
                </span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  user?.twoFAEnabled
                    ? 'bg-[var(--green-soft)] text-[var(--green)]'
                    : 'bg-[var(--amber-soft)] text-[var(--amber)]'
                }`}
              >
                {user?.twoFAEnabled ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="border-t border-[var(--border-light)]" />

            {/* Role */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers size={15} className="text-[var(--accent)]" />
                <span className="text-[12px] text-[var(--text-2)]">Rol</span>
              </div>
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                {user?.roles?.[0]?.toUpperCase() || 'USER'}
              </span>
            </div>

            {/* Sessions */}
            {stats && (
              <>
                <div className="border-t border-[var(--border-light)]" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-[var(--text-3)]" />
                    <span className="text-[12px] text-[var(--text-2)]">
                      Sesiones abiertas
                    </span>
                  </div>
                  <span className="text-[12px] font-semibold text-[var(--text-1)]">
                    {stats.activeSessions}
                  </span>
                </div>
              </>
            )}

            {/* CTA if 2FA disabled */}
            {!user?.twoFAEnabled && (
              <Link
                href="/dashboard/profile/2fa"
                className="mt-2 block rounded-xl bg-[var(--amber-soft)] px-3.5 py-2.5 text-center text-[12px] font-semibold text-[var(--amber)] hover:opacity-80 transition-opacity"
              >
                Activar 2FA para mayor seguridad →
              </Link>
            )}
          </div>
        </motion.section>
      </div>

      {/* Platform roadmap notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)] p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
            <Activity size={15} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--accent)]">
              ContaMind AI está en desarrollo activo
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--accent)] opacity-80">
              Los módulos de Contabilidad, Facturación, Tesorería e Impuestos SRI estarán disponibles próximamente. 
              La arquitectura segura y de identidad ya está operativa.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
