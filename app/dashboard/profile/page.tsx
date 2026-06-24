'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Globe,
  Clock,
  Edit2,
  Check,
  X,
  Camera,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

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
  tenant?: { id: string; name: string; ruc: string };
  activeCompany?: { id: string; name: string; ruc: string } | null;
}

function EditableField({
  label,
  value,
  fieldKey,
  onSave,
}: {
  label: string;
  value: string | null;
  fieldKey: string;
  onSave: (key: string, value: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    try {
      setSaving(true);
      await onSave(fieldKey, draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)] last:border-0">
      <span className="text-[12px] font-medium text-[var(--text-3)] w-28 flex-shrink-0">
        {label}
      </span>
      {editing ? (
        <div className="flex flex-1 items-center gap-2">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setEditing(false);
            }}
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--off-white)] px-3 py-1.5 text-[13px] text-[var(--text-1)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-white hover:opacity-80 disabled:opacity-50 transition-all"
          >
            <Check size={13} />
          </button>
          <button
            onClick={() => { setEditing(false); setDraft(value || ''); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-3)] hover:bg-[var(--off-white)] transition-all"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between">
          <span className="text-[13px] text-[var(--text-1)]">{value || '—'}</span>
          <button
            onClick={() => setEditing(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-4)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-all opacity-0 group-hover:opacity-100"
          >
            <Edit2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    apiClient.get<Profile>('/users/profile')
      .then(({ data }) => { 
        if (mounted) {
          setProfile(data);
          setIsFallback(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          if (user) {
            const fallbackProfile: Profile = {
              id: user.id,
              email: user.email,
              firstName: user.firstName || null,
              lastName: user.lastName || null,
              username: user.username || null,
              avatarUrl: user.avatarUrl || null,
              emailVerified: true,
              twoFAEnabled: user.twoFAEnabled || false,
              roles: user.roles || [],
              timezone: 'America/Guayaquil',
              language: 'es',
              createdAt: new Date().toISOString(),
              tenant: { id: user.tenantId || 'default', name: 'Workspace Local', ruc: '0999999999001' }
            };
            setProfile(fallbackProfile);
            setIsFallback(true);
          } else {
            setError(err?.response?.data?.message || 'Error al cargar el perfil');
          }
        }
      })
      .finally(() => { 
        if (mounted) setLoading(false); 
      });
    return () => { mounted = false; };
  }, [user]);

  const handleSaveField = async (key: string, value: string) => {
    if (isFallback) {
      setProfile((prev) => {
        if (!prev) return null;
        const next = { ...prev, [key]: value };
        if (user) {
          setUser({
            ...user,
            firstName: key === 'firstName' ? value : user.firstName,
            lastName: key === 'lastName' ? value : user.lastName,
            username: key === 'username' ? value : user.username,
            avatarUrl: key === 'avatarUrl' ? value : user.avatarUrl,
          });
        }
        return next;
      });
      toast.success('Perfil actualizado localmente (Modo Demo)');
      return;
    }

    try {
      const { data } = await apiClient.put<Profile>('/users/profile', { [key]: value });
      setProfile(data);
      if (user) {
        setUser({
          ...user,
          firstName: data.firstName || user.firstName,
          lastName: data.lastName || user.lastName,
          username: data.username || user.username,
          avatarUrl: data.avatarUrl || user.avatarUrl,
        });
      }
      toast.success('Perfil actualizado');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'No se pudo actualizar');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-6 space-y-4">
            <div className="h-4 w-32 rounded-lg bg-[var(--border-light)]" />
            <div className="h-3 w-full rounded-lg bg-[var(--border-light)]" />
            <div className="h-3 w-3/4 rounded-lg bg-[var(--border-light)]" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-5 text-[13px] text-[var(--red)]">
          ⚠️ {error || 'No se pudo cargar el perfil'}
        </div>
      </div>
    );
  }

  const displayName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : profile.email.split('@')[0];

  const initials = profile.firstName?.[0]?.toUpperCase() || profile.email[0].toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
          Mi cuenta
        </p>
        <h1 className="mt-0.5 font-serif text-[1.6rem] text-[var(--text-1)]">
          Perfil
        </h1>
        <p className="mt-1 text-[13px] text-[var(--text-3)]">
          Gestiona tu información personal y preferencias
        </p>
      </motion.div>

      {/* Fallback warning if backend endpoint is missing */}
      {isFallback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--amber)]/20 bg-[var(--amber-soft)] p-4 text-[13px] text-[var(--amber)] flex items-start gap-2.5"
        >
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Servidor incompleto</p>
            <p className="mt-0.5 opacity-90">
              El módulo de perfil de usuario no está registrado en el backend. Mostrando datos locales de sesión. Los cambios no se persistirán en el servidor.
            </p>
          </div>
        </motion.div>
      )}

      {/* Avatar + name banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center gap-5 rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-6 shadow-[var(--shadow-subtle)]"
      >
        <div className="relative">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[var(--border-light)]"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#5e5ce6] text-2xl font-bold text-white shadow-sm">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--white)] bg-[var(--text-1)] text-[var(--white)] hover:opacity-80 transition-opacity">
            <Camera size={10} />
          </div>
        </div>
        <div>
          <p className="text-[17px] font-semibold text-[var(--text-1)]">{displayName}</p>
          <p className="text-[13px] text-[var(--text-3)]">{profile.email}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {profile.roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]"
              >
                {role}
              </span>
            ))}
            {profile.emailVerified && (
              <span className="flex items-center gap-1 rounded-full bg-[var(--green-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--green)]">
                <Mail size={9} /> Email verificado
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Personal info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="group rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-6 shadow-[var(--shadow-subtle)]"
      >
        <div className="mb-4 flex items-center gap-2">
          <User size={15} className="text-[var(--text-3)]" />
          <p className="text-[13px] font-semibold text-[var(--text-1)]">
            Información personal
          </p>
        </div>
        <EditableField
          label="Nombre"
          value={profile.firstName}
          fieldKey="firstName"
          onSave={handleSaveField}
        />
        <EditableField
          label="Apellido"
          value={profile.lastName}
          fieldKey="lastName"
          onSave={handleSaveField}
        />
        <EditableField
          label="Usuario"
          value={profile.username}
          fieldKey="username"
          onSave={handleSaveField}
        />
        <EditableField
          label="Email"
          value={profile.email}
          fieldKey="email"
          onSave={handleSaveField}
        />
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="group rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-6 shadow-[var(--shadow-subtle)]"
      >
        <div className="mb-4 flex items-center gap-2">
          <Globe size={15} className="text-[var(--text-3)]" />
          <p className="text-[13px] font-semibold text-[var(--text-1)]">
            Preferencias
          </p>
        </div>
        <EditableField
          label="Zona horaria"
          value={profile.timezone}
          fieldKey="timezone"
          onSave={handleSaveField}
        />
        <EditableField
          label="Idioma"
          value={profile.language}
          fieldKey="language"
          onSave={handleSaveField}
        />
      </motion.div>

      {/* Workspace / tenant */}
      {profile.tenant && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-[var(--border-light)] bg-[var(--white)] p-6 shadow-[var(--shadow-subtle)]"
        >
          <div className="mb-4 flex items-center gap-2">
            <Clock size={15} className="text-[var(--text-3)]" />
            <p className="text-[13px] font-semibold text-[var(--text-1)]">
              Workspace
            </p>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
            <span className="text-[12px] text-[var(--text-3)]">Organización</span>
            <span className="text-[13px] font-medium text-[var(--text-1)]">{profile.tenant.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
            <span className="text-[12px] text-[var(--text-3)]">RUC</span>
            <span className="text-[13px] font-medium text-[var(--text-1)] font-mono">{profile.tenant.ruc}</span>
          </div>
          {profile.activeCompany && (
            <div className="flex items-center justify-between py-2">
              <span className="text-[12px] text-[var(--text-3)]">Empresa activa</span>
              <span className="text-[13px] font-medium text-[var(--text-1)]">{profile.activeCompany.name}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
