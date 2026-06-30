'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  Trash2,
  Check,
  Loader2,
  Building2,
  User as UserIcon,
  ShieldAlert,
  BadgeCheck,
  Camera,
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  twoFAEnabled: boolean;
  roles: string[];
  timezone: string | null;
  language: string | null;
  createdAt: string;
  passwordChangedAt: string;
  tenant?: { id: string; name: string; ruc: string };
  activeCompany?: { id: string; name: string; ruc: string } | null;
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  const [isPending, startTransition] = useTransition();
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    apiClient
      .get<Profile>('/users/profile')
      .then(({ data }) => {
        if (mounted) {
          setProfile(data);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setUsername(data.username || '');
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.response?.data?.message || 'Error al conectar con el servidor.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    startTransition(async () => {
      try {
        const { data } = await apiClient.put<Profile>(`/users/profile/${profile.id}`, {
          firstName: firstName.trim() || null,
          lastName: lastName.trim() || null,
          username: username.trim() || null,
        });

        setProfile(data);
        if (user) {
          setUser({
            ...user,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
          });
        }
        toast.success('Perfil actualizado correctamente.');
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'No se pudo guardar la información.');
      }
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 2MB.');
      return;
    }

    setAvatarLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await apiClient.post<{ avatarUrl: string }>(
        `/users/profile/${profile.id}/avatar`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setProfile((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : null));
      if (user) {
        setUser({ ...user, avatarUrl: data.avatarUrl });
      }
      toast.success('Foto de perfil actualizada.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al subir la imagen.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!profile) return;

    setAvatarLoading(true);
    try {
      await apiClient.delete(`/users/profile/${profile.id}/avatar`);
      setProfile((prev) => (prev ? { ...prev, avatarUrl: null } : null));
      if (user) {
        setUser({ ...user, avatarUrl: null });
      }
      toast.success('Foto de perfil eliminada.');
    } catch (err: any) {
      toast.error('Error al eliminar la foto de perfil.');
    } finally {
      setAvatarLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 space-y-10">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-[var(--border-light)] rounded-lg animate-pulse" />
          <div className="h-5 w-80 bg-[var(--border-light)] rounded-lg animate-pulse" />
        </div>
        <div className="h-px bg-[var(--border-light)]" />
        <div className="h-32 w-full bg-[var(--border-light)] rounded-lg animate-pulse" />
        <div className="h-px bg-[var(--border-light)]" />
        <div className="h-48 w-full bg-[var(--border-light)] rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="rounded-2xl border border-[var(--red)]/20 bg-[var(--red-soft)] p-6 text-[var(--red)] flex items-start gap-4">
          <ShieldAlert className="mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-[0.93rem]">Error de Conexión</p>
            <p className="mt-1 text-[0.86rem] opacity-90">
              {error || 'No se pudo cargar la información de perfil.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const initials = (firstName?.[0] || profile.email[0]).toUpperCase();
  const hasChanges =
    firstName.trim() !== (profile.firstName || '') ||
    lastName.trim() !== (profile.lastName || '') ||
    username.trim() !== (profile.username || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="max-w-5xl mx-auto space-y-0"
    >
      {/* Page Header */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)] mb-2">
          Cuenta
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.8rem)] text-[var(--text-1)] tracking-[-0.02em] leading-[1.1] mb-3">
          Mi Perfil
        </h1>
        <p className="text-[var(--text-3)] text-[0.97rem] max-w-2xl leading-[1.65]">
          Información de identidad, presencia en la organización y estado de la cuenta.
        </p>
      </div>

      {/* ── Avatar Section ── */}
      <section className="py-8 border-t border-[var(--border-light)]">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
              Foto de perfil
            </p>
            <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
              Se muestra en documentos y ante tu equipo.
            </p>
          </div>
          <div className="md:w-2/3 flex items-center gap-5">
            <div className="relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover border border-[var(--border)] shadow-[var(--shadow-subtle)]"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-soft)] text-2xl font-semibold text-[var(--accent)] border border-[var(--border)] shadow-[var(--shadow-subtle)]">
                  {initials}
                </div>
              )}
              {avatarLoading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={18} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleAvatarUpload}
                  disabled={avatarLoading}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--white)] border border-[var(--border)] text-[0.86rem] font-medium text-[var(--text-1)] hover:bg-[var(--off-white)] hover:border-[var(--text-4)] transition-all shadow-[var(--shadow-subtle)] disabled:opacity-50"
                >
                  <Camera size={14} />
                  Cambiar foto
                </button>
                {profile.avatarUrl && (
                  <button
                    onClick={handleAvatarRemove}
                    disabled={avatarLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.86rem] font-medium text-[var(--text-3)] hover:text-[var(--red)] transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                )}
              </div>
              <p className="text-[0.72rem] text-[var(--text-4)]">
                PNG, JPG o WEBP — máximo 2MB.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Personal Details ── */}
      <section className="py-8 border-t border-[var(--border-light)]">
        <form onSubmit={handleSaveChanges} className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
              Datos personales
            </p>
            <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
              Nombres, alias público y estado de verificación de correo.
            </p>
          </div>

          <div className="md:w-2/3 space-y-5 max-w-md w-full">
            {/* Email (Read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                Correo Electrónico
              </label>
              <div className="flex items-center gap-2.5 h-10 px-3 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[10px] text-[0.97rem] text-[var(--text-3)] select-none">
                <span className="truncate">{profile.email}</span>
                {profile.emailVerified ? (
                  <span className="flex items-center gap-1 ml-auto text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[var(--green)] bg-[var(--green-soft)] px-2.5 py-0.5 rounded-full border border-[var(--green)]/15">
                    <BadgeCheck size={13} />
                    Verificado
                  </span>
                ) : (
                  <span className="ml-auto text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[var(--amber)] bg-[var(--amber-soft)] px-2.5 py-0.5 rounded-full border border-[var(--amber)]/15 flex-shrink-0">
                    Pendiente
                  </span>
                )}
              </div>
              <p className="text-[0.72rem] text-[var(--text-4)] mt-0.5">
                Para modificar tu correo, contacta a soporte.
              </p>
            </div>

            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="firstName"
                className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase"
              >
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase"
              >
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase"
              >
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. juan.perez"
                className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
              />
            </div>

            {/* Action Buttons */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2 flex gap-3"
              >
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-6 py-2 h-9 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[0.86rem] font-medium transition-all shadow-[var(--shadow-subtle)] hover:shadow-[0_4px_12px_rgba(0,113,227,0.2)] disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Check size={14} />
                  )}
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFirstName(profile.firstName || '');
                    setLastName(profile.lastName || '');
                    setUsername(profile.username || '');
                  }}
                  disabled={isPending}
                  className="px-6 py-2 h-9 rounded-full bg-transparent border border-[var(--border)] hover:bg-[var(--off-white)] text-[var(--text-2)] text-[0.86rem] font-medium transition-all disabled:opacity-50"
                >
                  Descartar
                </button>
              </motion.div>
            )}
          </div>
        </form>
      </section>

      {/* ── Organization ── */}
      <section className="py-8 border-t border-[var(--border-light)]">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
              Organización
            </p>
            <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
              Workspace y permisos asignados por el administrador.
            </p>
          </div>
          <div className="md:w-2/3 space-y-4 max-w-md w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                Workspace Activo
              </label>
              <div className="flex items-center gap-3 h-10 px-3 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[10px] text-[0.97rem] text-[var(--text-1)] font-medium select-none">
                <Building2 size={16} className="text-[var(--text-3)]" />
                <span>{profile.tenant?.name || 'Workspace Local'}</span>
                <span className="ml-auto text-[0.72rem] font-mono text-[var(--text-4)]">
                  {profile.tenant?.ruc || ''}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                Roles Asignados
              </label>
              <div className="flex flex-wrap gap-2 mt-0.5">
                {profile.roles.length > 0 ? (
                  profile.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[0.72rem] font-medium text-[var(--accent)] border border-[var(--accent)]/15 tracking-[0.03em]"
                    >
                      <UserIcon size={12} />
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-[0.86rem] text-[var(--text-3)] italic">
                    Sin roles asignados
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Account Info ── */}
      <section className="py-8 border-t border-[var(--border-light)]">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-1/3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
              Información de la cuenta
            </p>
            <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
              Fechas relevantes y estado de seguridad de tu cuenta.
            </p>
          </div>
          <div className="md:w-2/3 max-w-md w-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-[0.86rem] text-[var(--text-2)]">Fecha de creación</span>
                <span className="text-[0.86rem] text-[var(--text-1)] font-medium">
                  {new Date(profile.createdAt).toLocaleDateString('es-EC', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="border-t border-[var(--border-light)]" />
              <div className="flex items-center justify-between py-2">
                <span className="text-[0.86rem] text-[var(--text-2)]">Último cambio de contraseña</span>
                <span className="text-[0.86rem] text-[var(--text-1)] font-medium">
                  {profile.passwordChangedAt
                    ? new Date(profile.passwordChangedAt).toLocaleDateString('es-EC', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Nunca'}
                </span>
              </div>
              <div className="border-t border-[var(--border-light)]" />
              <div className="flex items-center justify-between py-2">
                <span className="text-[0.86rem] text-[var(--text-2)]">Autenticación 2 factores</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-[0.03em] ${
                    profile.twoFAEnabled
                      ? 'bg-[var(--green-soft)] text-[var(--green)]'
                      : 'bg-[var(--amber-soft)] text-[var(--amber)]'
                  }`}
                >
                  {profile.twoFAEnabled ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
