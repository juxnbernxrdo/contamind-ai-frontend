'use client';

import { useState } from 'react';
import { useAdminUsers, AdminUser } from '@/hooks/use-admin-users';
import { motion } from 'motion/react';
import {
  Users,
  Search,
  Lock,
  Unlock,
  UserX,
  UserCheck,
  Shield,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        active
          ? 'bg-[var(--green-soft)] text-[var(--green)]'
          : 'bg-[var(--red-soft)] text-[var(--red)]'
      }`}
    >
      <span className={`h-1 w-1 rounded-full ${active ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`} />
      {label}
    </span>
  );
}

function UserRow({
  user,
  onLock,
  onUnlock,
  onDisable,
  onEnable,
  onRevokeSessions,
}: {
  user: AdminUser;
  onLock: (id: string) => void;
  onUnlock: (id: string) => void;
  onDisable: (id: string) => void;
  onEnable: (id: string) => void;
  onRevokeSessions: (id: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-4 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-default)] transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <span className="text-[13px] font-semibold text-[var(--accent)]">
              {(user.firstName?.[0] || user.email[0]).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[var(--text-1)] truncate">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </p>
            <p className="text-[11px] text-[var(--text-4)] truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!user.accountLocked && !user.accountDisabled && (
            <StatusBadge active={true} label="Activo" />
          )}
          {user.accountLocked && (
            <StatusBadge active={false} label="Bloqueado" />
          )}
          {user.accountDisabled && (
            <StatusBadge active={false} label="Deshabilitado" />
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-3)]">
        <span className="flex items-center gap-1">
          <Shield size={12} />
          {user.roles.join(', ')}
        </span>
        <span className="text-[var(--text-4)]">·</span>
        <span className="flex items-center gap-1">
          <Mail size={12} />
          {user.emailVerified ? 'Verificado' : 'No verificado'}
        </span>
        {user.twoFAEnabled && (
          <>
            <span className="text-[var(--text-4)]">·</span>
            <span className="flex items-center gap-1 text-[var(--green)]">
              <CheckCircle2 size={12} />
              2FA
            </span>
          </>
        )}
        {user.lastLoginAt && (
          <>
            <span className="text-[var(--text-4)]">·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Último acceso: {new Date(user.lastLoginAt).toLocaleDateString('es-EC')}
            </span>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setShowActions(!showActions)}
          className="text-[11px] font-medium text-[var(--accent)] hover:underline"
        >
          {showActions ? 'Ocultar acciones' : 'Administrar'}
        </button>

        {showActions && (
          <div className="flex flex-wrap items-center gap-1.5 ml-2">
            {!user.accountLocked ? (
              <button
                onClick={() => onLock(user.id)}
                className="flex items-center gap-1 rounded-lg border border-[var(--amber-soft)] bg-[var(--amber-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--amber)] hover:opacity-80 transition-opacity"
              >
                <Lock size={11} />
                Bloquear
              </button>
            ) : (
              <button
                onClick={() => onUnlock(user.id)}
                className="flex items-center gap-1 rounded-lg border border-[var(--green-soft)] bg-[var(--green-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--green)] hover:opacity-80 transition-opacity"
              >
                <Unlock size={11} />
                Desbloquear
              </button>
            )}

            {!user.accountDisabled ? (
              <button
                onClick={() => onDisable(user.id)}
                className="flex items-center gap-1 rounded-lg border border-[var(--red-soft)] bg-[var(--red-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--red)] hover:opacity-80 transition-opacity"
              >
                <UserX size={11} />
                Deshabilitar
              </button>
            ) : (
              <button
                onClick={() => onEnable(user.id)}
                className="flex items-center gap-1 rounded-lg border border-[var(--green-soft)] bg-[var(--green-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--green)] hover:opacity-80 transition-opacity"
              >
                <UserCheck size={11} />
                Habilitar
              </button>
            )}

            <button
              onClick={() => onRevokeSessions(user.id)}
              className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-3)] hover:bg-[var(--off-white)] transition-colors"
            >
              <AlertTriangle size={11} />
              Revocar sesiones
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const limit = 20;

  const { users, total, totalPages, loading, error, refetch, lockUser, unlockUser, disableUser, enableUser, revokeUserSessions } = useAdminUsers({
    page,
    limit,
    search,
    role: roleFilter || undefined,
  });

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleLock = async (userId: string) => {
    try {
      await lockUser(userId);
      toast.success('Usuario bloqueado por 15 minutos');
    } catch {
      toast.error('Error al bloquear usuario');
    }
  };

  const handleUnlock = async (userId: string) => {
    try {
      await unlockUser(userId);
      toast.success('Usuario desbloqueado');
    } catch {
      toast.error('Error al desbloquear usuario');
    }
  };

  const handleDisable = async (userId: string) => {
    try {
      await disableUser(userId);
      toast.success('Usuario deshabilitado');
    } catch {
      toast.error('Error al deshabilitar usuario');
    }
  };

  const handleEnable = async (userId: string) => {
    try {
      await enableUser(userId);
      toast.success('Usuario habilitado');
    } catch {
      toast.error('Error al habilitar usuario');
    }
  };

  const handleRevokeSessions = async (userId: string) => {
    try {
      await revokeUserSessions(userId);
      toast.success('Sesiones revocadas');
    } catch {
      toast.error('Error al revocar sesiones');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Users size={17} className="text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="font-serif text-[1.6rem] text-[var(--text-1)]">Gestión de Usuarios</h1>
            <p className="text-[12px] text-[var(--text-3)]">
              Administrar cuentas de usuario, bloqueo, deshabilitación y sesiones
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por email o nombre..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--white)] pl-9 pr-3 py-2.5 text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-[var(--border)] bg-[var(--white)] px-3 py-2.5 text-[13px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none transition-all"
        >
          <option value="">Todos los roles</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>

        <button
          onClick={handleSearch}
          className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Buscar
        </button>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2.5 text-[12px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] transition-colors"
        >
          <RefreshCw size={13} />
          Actualizar
        </button>
      </motion.div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-[12px] text-[var(--text-3)]">
        <span>
          <span className="font-semibold text-[var(--text-1)]">{total}</span> usuarios encontrados
        </span>
        {search && (
          <span className="text-[var(--text-4)]">
            Filtrado por: &ldquo;{search}&rdquo;
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-4 text-[13px] text-[var(--red)]">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--border-light)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 rounded bg-[var(--border-light)]" />
                  <div className="h-2.5 w-56 rounded bg-[var(--border-light)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User list */}
      {!loading && users.length === 0 && (
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-12 text-center">
          <Users size={32} className="mx-auto mb-3 text-[var(--text-4)]" />
          <p className="text-[14px] font-medium text-[var(--text-2)]">No se encontraron usuarios</p>
          <p className="text-[12px] text-[var(--text-4)] mt-1">
            {search ? 'Intenta con otro término de búsqueda' : 'Aún no hay usuarios registrados'}
          </p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="space-y-3">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onLock={handleLock}
              onUnlock={handleUnlock}
              onDisable={handleDisable}
              onEnable={handleEnable}
              onRevokeSessions={handleRevokeSessions}
            />
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
    </div>
  );
}
