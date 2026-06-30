'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { startRegistration } from '@simplewebauthn/browser';
import {
  Globe,
  Shield,
  FileSpreadsheet,
  X,
  Smartphone,
  Laptop,
  Download,
  AlertTriangle,
  Fingerprint,
  Loader2,
  Lock,
  ShieldCheck,
  Trash,
} from 'lucide-react';
import { NavButton } from '@/components/ui/NavButton';

interface Preferences {
  timezone: string | null;
  language: string | null;
  rememberMe: boolean;
  inactivityTimeout: number;
}

interface Session {
  id: string;
  deviceId: string;
  lastActivityAt: string;
  createdAt: string;
  device: {
    name: string;
    deviceType: string;
    lastActivityIp: string;
    lastActivityAt: string;
  };
}

interface Device {
  id: string;
  name: string;
  deviceType: string;
  ipAddress: string;
  isTrusted: boolean;
  trustedUntil: string | null;
  lastActivityAt: string;
}

interface ExportJob {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  downloadUrl?: string;
  expiresAt?: string;
}

export default function SettingsPage() {
  const { user, loading, setUser, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'preferences' | 'security' | 'privacy'>(
    'preferences'
  );

  const [isPending, startTransition] = useTransition();

  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthCallback, setReauthCallback] = useState<((token: string) => void) | null>(
    null
  );
  const [reauthLoading, setReauthLoading] = useState(false);

  const loadSessionsAndDevices = () => {
    apiClient
      .get<Session[]>('/auth/sessions')
      .then(({ data }) => setSessions(data))
      .catch(() => {});
    apiClient
      .get<Device[]>('/auth/devices')
      .then(({ data }) => setDevices(data))
      .catch(() => {});
  };

  useEffect(() => {
    if (!user) return;

    if (activeTab === 'preferences') {
      apiClient
        .get<Preferences>('/users/preferences')
        .then(({ data }) => setPreferences(data))
        .catch(() => {
          setPreferences({
            timezone: 'America/Guayaquil',
            language: 'es',
            rememberMe: true,
            inactivityTimeout: 28800,
          });
        });
    } else if (activeTab === 'security') {
      loadSessionsAndDevices();
    }
  }, [activeTab, user]);

  const triggerReauth = (callback: (token: string) => void) => {
    setReauthPassword('');
    setReauthCallback(() => callback);
    setReauthOpen(true);
  };

  const handleReauthSubmit = async () => {
    if (!reauthPassword) {
      toast.error('Ingrese su contraseña actual.');
      return;
    }
    setReauthLoading(true);
    try {
      const { data } = await apiClient.post<{ reauthToken: string }>('/auth/reauth', {
        password: reauthPassword,
      });
      setReauthOpen(false);
      if (reauthCallback) reauthCallback(data.reauthToken);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Contraseña incorrecta.');
    } finally {
      setReauthLoading(false);
    }
  };

  // ── Preferences ──
  const updatePreference = async (key: keyof Preferences, value: any) => {
    if (!preferences || !user) return;
    try {
      const updated = { ...preferences, [key]: value };
      setPreferences(updated);
      await apiClient.put(`/users/preferences/${user.id}`, { [key]: value });
      toast.success('Preferencia actualizada.');
    } catch (err: any) {
      toast.error('Error al guardar la preferencia.');
    }
  };

  // ── Security: Password ──
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdNew !== pwdConfirm) return toast.error('Las contraseñas nuevas no coinciden.');
    if (pwdNew.length < 12)
      return toast.error('La contraseña debe tener al menos 12 caracteres.');

    startTransition(async () => {
      try {
        const { data: reauthData } = await apiClient.post<{ reauthToken: string }>(
          '/auth/reauth',
          { password: pwdCurrent }
        );
        await apiClient.post('/auth/change-password', {
          reauthToken: reauthData.reauthToken,
          currentPassword: pwdCurrent,
          newPassword: pwdNew,
          newPasswordConfirm: pwdConfirm,
        });
        toast.success(
          'Contraseña actualizada. Todas las sesiones han sido revocadas.'
        );
        setPwdCurrent('');
        setPwdNew('');
        setPwdConfirm('');
        setTimeout(() => {
          logout();
        }, 1500);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error al actualizar la contraseña.');
      }
    });
  };

  // ── Security: 2FA ──
  const [twoFaSetupData, setTwoFaSetupData] = useState<{
    secret: string;
    qrCodeDataUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaVerificationOpen, setTwoFaVerificationOpen] = useState(false);
  const [disableTwoFaOpen, setDisableTwoFaOpen] = useState(false);

  const handleStart2FA = async () => {
    try {
      const { data } = await apiClient.post('/auth/2fa/setup');
      setTwoFaSetupData(data);
      setTwoFaVerificationOpen(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Error al iniciar la configuración de 2FA.'
      );
    }
  };

  const handleConfirm2FA = async () => {
    if (!twoFaCode) return toast.error('Ingresa el código TOTP.');
    try {
      await apiClient.post('/auth/2fa/activate', { token: twoFaCode });
      toast.success('Autenticación de 2 Factores activada.');
      setTwoFaVerificationOpen(false);
      setTwoFaSetupData(null);
      setTwoFaCode('');
      if (user) setUser({ ...user, twoFAEnabled: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Código incorrecto. Intenta de nuevo.');
    }
  };

  const handleDisable2FA = async () => {
    if (!twoFaCode) return toast.error('Ingresa el código TOTP para desactivar.');
    try {
      await apiClient.delete('/auth/2fa', { data: { token: twoFaCode } });
      toast.success('Autenticación de 2 Factores desactivada.');
      setDisableTwoFaOpen(false);
      setTwoFaCode('');
      if (user) setUser({ ...user, twoFAEnabled: false });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Código incorrecto.');
    }
  };

  // ── Security: Passkeys ──
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const handleRegisterPasskey = async () => {
    setPasskeyLoading(true);
    try {
      const { data: options } = await apiClient.post('/auth/webauthn/register/options');
      const regResp = await startRegistration({ optionsJSON: options });
      await apiClient.post('/auth/webauthn/register/verify', { response: regResp });
      toast.success('Dispositivo registrado como Passkey.');
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || 'Error en el registro biométrico.';
      toast.error(msg);
    } finally {
      setPasskeyLoading(false);
    }
  };

  // ── Security: Sessions ──
  const handleRevokeSession = async (sessionId: string) => {
    try {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
      toast.success('Sesión revocada.');
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err: any) {
      toast.error('No se pudo revocar la sesión.');
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    try {
      await apiClient.delete('/auth/sessions');
      toast.success('Otras sesiones revocadas.');
      loadSessionsAndDevices();
    } catch (err: any) {
      toast.error('Error al revocar sesiones.');
    }
  };

  // ── Security: Devices ──
  const handleToggleDeviceTrust = async (deviceId: string, currentTrust: boolean) => {
    try {
      const { data } = await apiClient.patch<Device>(`/auth/devices/${deviceId}`, {
        isTrusted: !currentTrust,
      });
      toast.success(
        data.isTrusted
          ? 'Dispositivo marcado como confiable.'
          : 'Dispositivo removido de confianza.'
      );
      setDevices((prev) => prev.map((d) => (d.id === deviceId ? data : d)));
    } catch (err: any) {
      toast.error('Error al actualizar el estado del dispositivo.');
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    try {
      await apiClient.delete(`/auth/devices/${deviceId}`);
      toast.success('Dispositivo revocado.');
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      loadSessionsAndDevices();
    } catch (err: any) {
      toast.error('Error al revocar el dispositivo.');
    }
  };

  // ── Privacy: Export ──
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const [exportJob, setExportJob] = useState<ExportJob | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (!exportJobId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await apiClient.get<ExportJob>(
          `/auth/user/export/jobs/${exportJobId}`
        );
        setExportJob(data);
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
          setExportLoading(false);
          if (data.status === 'completed') {
            toast.success('Exportación lista para descargar.');
          } else {
            toast.error('La exportación de datos falló.');
          }
        }
      } catch (err) {
        clearInterval(interval);
        setExportLoading(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [exportJobId]);

  const handleRequestExport = () => {
    triggerReauth(async (token) => {
      setExportLoading(true);
      setExportJob(null);
      try {
        const { data } = await apiClient.post<{ jobId: string; message: string }>(
          '/auth/user/export',
          {
            reauthToken: token,
            includeBusinessData: false,
            notifyEmail: true,
          }
        );
        setExportJobId(data.jobId);
        toast.info('Exportación encolada. Te notificaremos por correo.');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error al exportar datos.');
        setExportLoading(false);
      }
    });
  };

  // ── Privacy: Delete Account ──
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (deletePhrase !== 'DELETE MY ACCOUNT') {
      toast.error('Escribe la frase de confirmación exactamente.');
      return;
    }
    if (!deletePassword) {
      toast.error('Introduce tu contraseña.');
      return;
    }
    setDeleteLoading(true);
    try {
      const { data: reauth } = await apiClient.post<{ reauthToken: string }>(
        '/auth/reauth',
        { password: deletePassword }
      );
      await apiClient.post('/auth/user/cancel', {
        reauthToken: reauth.reauthToken,
        confirmationPhrase: 'DELETE MY ACCOUNT',
      });
      toast.success('Cuenta eliminada.');
      setDeleteOpen(false);
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al dar de baja la cuenta.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { id: 'preferences', label: 'Preferencias', icon: Globe },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'privacy', label: 'Privacidad', icon: FileSpreadsheet },
  ] as const;

  if (loading || !user) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 space-y-10">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-[var(--border-light)] rounded-lg animate-pulse" />
          <div className="h-5 w-80 bg-[var(--border-light)] rounded-lg animate-pulse" />
        </div>
        <div className="h-px bg-[var(--border-light)]" />
        <div className="h-[400px] w-full bg-[var(--border-light)] rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-0">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)] mb-2">
          Cuenta
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.8rem)] text-[var(--text-1)] tracking-[-0.02em] leading-[1.1] mb-3">
          Configuración
        </h1>
        <p className="text-[var(--text-3)] text-[0.97rem] max-w-2xl leading-[1.65]">
          Preferencias de localización, seguridad de acceso y privacidad de datos.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-52 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0 border-b border-[var(--border-light)] lg:border-b-0">
            {tabs.map((tab) => (
              <NavButton
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap"
              />
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {/* ═══ PREFERENCES ═══ */}
              {activeTab === 'preferences' && preferences && (
                <div>
                  {/* Language & Region */}
                  <section className="py-8 border-t border-[var(--border-light)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                          Idioma y región
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Formato numérico y zona horaria para tu cuenta.
                        </p>
                      </div>
                      <div className="md:w-2/3 space-y-5 max-w-sm w-full">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                            Idioma
                          </label>
                          <select
                            value={preferences.language || 'es'}
                            onChange={(e) => updatePreference('language', e.target.value)}
                            className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all appearance-none cursor-pointer"
                          >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                            Zona Horaria
                          </label>
                          <select
                            value={preferences.timezone || 'America/Guayaquil'}
                            onChange={(e) => updatePreference('timezone', e.target.value)}
                            className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all appearance-none cursor-pointer"
                          >
                            <option value="America/Guayaquil">Ecuador (Guayaquil)</option>
                            <option value="America/Bogota">Colombia (Bogotá)</option>
                            <option value="America/Lima">Perú (Lima)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Session & Timeout */}
                  <section className="py-8 border-t border-[var(--border-light)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                          Sesión
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Políticas de cierre automático por inactividad.
                        </p>
                      </div>
                      <div className="md:w-2/3 space-y-5 max-w-sm w-full">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                            Tiempo de Inactividad (segundos)
                          </label>
                          <input
                            type="number"
                            value={preferences.inactivityTimeout}
                            onChange={(e) =>
                              updatePreference(
                                'inactivityTimeout',
                                parseInt(e.target.value) || 28800
                              )
                            }
                            className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
                          />
                          <p className="text-[0.72rem] text-[var(--text-4)] mt-0.5">
                            Valor por defecto: 28800 (8 horas).
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              id="rememberMe"
                              checked={preferences.rememberMe}
                              onChange={(e) =>
                                updatePreference('rememberMe', e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-[var(--border)] peer-focus:ring-2 peer-focus:ring-[var(--accent-soft)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]" />
                          </label>
                          <label
                            htmlFor="rememberMe"
                            className="text-[0.86rem] text-[var(--text-2)] select-none cursor-pointer"
                          >
                            Recordar sesión en este dispositivo
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* ═══ SECURITY ═══ */}
              {activeTab === 'security' && (
                <div>
                  {/* Change Password */}
                  <section className="py-8 border-t border-[var(--border-light)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                          Contraseña
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Actualiza tu clave de acceso. Se revocarán todas las sesiones.
                        </p>
                      </div>
                      <form
                        onSubmit={handleChangePassword}
                        className="md:w-2/3 space-y-5 max-w-sm w-full"
                      >
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                            Contraseña Actual
                          </label>
                          <input
                            type="password"
                            value={pwdCurrent}
                            onChange={(e) => setPwdCurrent(e.target.value)}
                            required
                            className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                            Nueva Contraseña
                          </label>
                          <input
                            type="password"
                            value={pwdNew}
                            onChange={(e) => setPwdNew(e.target.value)}
                            required
                            className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
                          />
                          <p className="text-[0.72rem] text-[var(--text-4)] mt-0.5">
                            Mínimo 12 caracteres. Debe incluir mayúsculas, minúsculas, números y un carácter especial.
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                            Confirmar Nueva Contraseña
                          </label>
                          <input
                            type="password"
                            value={pwdConfirm}
                            onChange={(e) => setPwdConfirm(e.target.value)}
                            required
                            className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] text-[var(--text-1)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isPending}
                          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[0.86rem] font-medium transition-all shadow-[var(--shadow-subtle)] hover:shadow-[0_4px_12px_rgba(0,113,227,0.2)] disabled:opacity-50"
                        >
                          {isPending && <Loader2 className="animate-spin" size={14} />}
                          Actualizar contraseña
                        </button>
                      </form>
                    </div>
                  </section>

                  {/* 2FA */}
                  <section className="py-8 border-t border-[var(--border-light)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                          Autenticación de 2 factores
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Capa adicional de protección con un autenticador TOTP.
                        </p>
                      </div>
                      <div className="md:w-2/3 space-y-5 max-w-lg w-full">
                        {user.twoFAEnabled ? (
                          <>
                            {/* Active status */}
                            <div className="flex items-center gap-3 p-4 border border-[var(--green)]/20 bg-[var(--green-soft)] rounded-[14px]">
                              <ShieldCheck
                                className="text-[var(--green)] flex-shrink-0"
                                size={20}
                              />
                              <div>
                                <p className="text-[0.86rem] font-semibold text-[var(--text-1)]">
                                  2FA activo
                                </p>
                                <p className="text-[0.79rem] text-[var(--text-3)]">
                                  Tu cuenta está protegida con códigos de autenticación.
                                </p>
                              </div>
                            </div>

                            {disableTwoFaOpen ? (
                              <div className="space-y-3 p-4 border border-[var(--border)] rounded-[14px] bg-[var(--off-white)]">
                                <label className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                                  Código TOTP para desactivar
                                </label>
                                <div className="flex gap-2 max-w-xs">
                                  <input
                                    type="text"
                                    value={twoFaCode}
                                    onChange={(e) => setTwoFaCode(e.target.value)}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] tracking-widest text-center focus:border-[var(--red)] focus:ring-[var(--red-soft)] outline-none transition-all"
                                  />
                                  <button
                                    onClick={handleDisable2FA}
                                    className="px-4 py-2 bg-[var(--red)] text-white hover:bg-[var(--red)]/90 rounded-[10px] text-[0.72rem] font-semibold transition-all"
                                  >
                                    Desactivar
                                  </button>
                                  <button
                                    onClick={() => setDisableTwoFaOpen(false)}
                                    className="px-4 py-2 border border-[var(--border)] rounded-[10px] text-[0.72rem] font-semibold text-[var(--text-3)] hover:bg-[var(--white)] transition-all"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDisableTwoFaOpen(true)}
                                className="inline-flex items-center px-5 py-2 rounded-full border border-[var(--red)]/20 hover:border-[var(--red)]/35 text-[var(--red)] text-[0.86rem] font-medium transition-all hover:bg-[var(--red-soft)]"
                              >
                                Desactivar 2FA
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Inactive status */}
                            <div className="flex items-center gap-3 p-4 border border-[var(--border)] bg-[var(--off-white)] rounded-[14px]">
                              <Smartphone
                                className="text-[var(--text-3)] flex-shrink-0"
                                size={20}
                              />
                              <div>
                                <p className="text-[0.86rem] font-semibold text-[var(--text-1)]">
                                  2FA inactivo
                                </p>
                                <p className="text-[0.79rem] text-[var(--text-3)]">
                                  No has configurado tu aplicación de autenticación.
                                </p>
                              </div>
                            </div>

                            {twoFaVerificationOpen && twoFaSetupData ? (
                              <div className="p-5 border border-[var(--border)] rounded-[14px] bg-[var(--off-white)] space-y-5">
                                <p className="text-[0.86rem] font-semibold text-[var(--text-1)]">
                                  Configurar autenticador
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5 items-center">
                                  <img
                                    src={twoFaSetupData.qrCodeDataUrl}
                                    alt="QR Code 2FA"
                                    className="h-36 w-36 border border-[var(--border-light)] rounded-[10px] p-2 bg-white"
                                  />
                                  <div className="space-y-2">
                                    <p className="text-[0.79rem] text-[var(--text-3)] leading-[1.58]">
                                      Escanea el código QR desde Google Authenticator, Authy o
                                      1Password. Si no puedes escanearlo, introduce esta clave
                                      secreta manualmente:
                                    </p>
                                    <code className="block p-2 bg-[var(--white)] text-[0.79rem] font-mono text-[var(--text-1)] select-all rounded-[10px] border border-[var(--border-light)] text-center">
                                      {twoFaSetupData.secret}
                                    </code>
                                  </div>
                                </div>

                                <div className="border-t border-[var(--border-light)] pt-4 space-y-3">
                                  <p className="text-[0.72rem] font-semibold text-[var(--text-1)] tracking-[0.10em] uppercase">
                                    Códigos de respaldo
                                  </p>
                                  <p className="text-[0.72rem] text-[var(--text-3)]">
                                    Guárdalos en un lugar seguro. Recuperarán tu acceso si pierdes tu dispositivo.
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 bg-[var(--white)] border border-[var(--border-light)] p-3 rounded-[10px] font-mono text-[0.72rem] text-[var(--text-2)] text-center">
                                    {twoFaSetupData.backupCodes.map((code) => (
                                      <div key={code}>{code}</div>
                                    ))}
                                  </div>
                                </div>

                                <div className="border-t border-[var(--border-light)] pt-4 space-y-3">
                                  <label
                                    htmlFor="totp-input"
                                    className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase"
                                  >
                                    Verifica el código
                                  </label>
                                  <div className="flex gap-2 max-w-xs">
                                    <input
                                      id="totp-input"
                                      type="text"
                                      value={twoFaCode}
                                      onChange={(e) => setTwoFaCode(e.target.value)}
                                      placeholder="000000"
                                      maxLength={6}
                                      className="h-10 rounded-[10px] border border-[var(--border)] bg-[var(--white)] px-3 text-[0.97rem] tracking-widest text-center focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none transition-all"
                                    />
                                    <button
                                      onClick={handleConfirm2FA}
                                      className="px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-[10px] text-[0.72rem] font-semibold transition-all"
                                    >
                                      Activar
                                    </button>
                                    <button
                                      onClick={() => setTwoFaVerificationOpen(false)}
                                      className="px-4 py-2 border border-[var(--border)] rounded-[10px] text-[0.72rem] font-semibold text-[var(--text-3)] hover:bg-[var(--white)] transition-all"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={handleStart2FA}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[0.86rem] font-medium transition-all shadow-[var(--shadow-subtle)] hover:shadow-[0_4px_12px_rgba(0,113,227,0.2)]"
                              >
                                Configurar 2FA
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Passkeys */}
                  <section className="py-8 border-t border-[var(--border-light)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                          Llaves de paso
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Inicio de sesión biométrico sin contraseña.
                        </p>
                      </div>
                      <div className="md:w-2/3 space-y-4 max-w-lg w-full">
                        <div className="flex items-center gap-3 p-4 border border-[var(--border)] bg-[var(--off-white)] rounded-[14px]">
                          <Fingerprint
                            className="text-[var(--accent)] flex-shrink-0"
                            size={20}
                          />
                          <div>
                            <p className="text-[0.86rem] font-semibold text-[var(--text-1)]">
                              WebAuthn
                            </p>
                            <p className="text-[0.79rem] text-[var(--text-3)]">
                              Criptografía local. Sin datos biométricos en servidores.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRegisterPasskey}
                          disabled={passkeyLoading}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--white)] border border-[var(--border)] hover:bg-[var(--off-white)] text-[var(--text-1)] text-[0.86rem] font-medium transition-all shadow-[var(--shadow-subtle)] disabled:opacity-50"
                        >
                          {passkeyLoading ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <Fingerprint size={14} className="text-[var(--accent)]" />
                          )}
                          Registrar este dispositivo
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Sessions & Devices */}
                  <section className="py-8 border-t border-[var(--border-light)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                          Sesiones y dispositivos
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Dispositivos conectados actualmente a tu cuenta.
                        </p>
                      </div>
                      <div className="md:w-2/3 space-y-8 w-full max-w-xl">
                        {/* Sessions */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                              Sesiones Activas ({sessions.length})
                            </p>
                            {sessions.length > 1 && (
                              <button
                                onClick={handleRevokeAllOtherSessions}
                                className="text-[0.79rem] font-medium text-[var(--red)] hover:underline"
                              >
                                Cerrar todas las otras
                              </button>
                            )}
                          </div>

                          <div className="border border-[var(--border-light)] rounded-[14px] bg-[var(--off-white)] divide-y divide-[var(--border-light)] overflow-hidden">
                            {sessions.length === 0 ? (
                              <p className="p-4 text-[0.86rem] text-[var(--text-3)] italic text-center">
                                Cargando sesiones…
                              </p>
                            ) : (
                              sessions.map((s) => {
                                const isCurrent =
                                  s.device.lastActivityIp === '127.0.0.1';
                                return (
                                  <div
                                    key={s.id}
                                    className="px-4 py-3 flex items-center justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <Laptop
                                        className="text-[var(--text-3)] flex-shrink-0"
                                        size={16}
                                      />
                                      <div className="min-w-0">
                                        <p className="text-[0.86rem] font-medium text-[var(--text-1)] flex items-center gap-1.5">
                                          <span className="truncate">
                                            {s.device.name || 'Dispositivo Web'}
                                          </span>
                                          {isCurrent && (
                                            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded-full flex-shrink-0">
                                              Actual
                                            </span>
                                          )}
                                        </p>
                                        <p className="text-[0.72rem] text-[var(--text-3)] mt-0.5 truncate">
                                          {s.device.lastActivityIp} ·{' '}
                                          {new Date(s.lastActivityAt).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    {!isCurrent && (
                                      <button
                                        onClick={() => handleRevokeSession(s.id)}
                                        className="p-1.5 rounded-full hover:bg-[var(--red-soft)] text-[var(--text-3)] hover:text-[var(--red)] transition-all flex-shrink-0"
                                        aria-label="Cerrar sesión"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Devices */}
                        <div className="space-y-3">
                          <p className="text-[0.72rem] font-semibold text-[var(--text-2)] tracking-[0.10em] uppercase">
                            Dispositivos ({devices.length})
                          </p>

                          <div className="border border-[var(--border-light)] rounded-[14px] bg-[var(--off-white)] divide-y divide-[var(--border-light)] overflow-hidden">
                            {devices.length === 0 ? (
                              <p className="p-4 text-[0.86rem] text-[var(--text-3)] italic text-center">
                                Cargando dispositivos…
                              </p>
                            ) : (
                              devices.map((d) => (
                                <div
                                  key={d.id}
                                  className="px-4 py-3 flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <Laptop
                                      className="text-[var(--text-3)] flex-shrink-0"
                                      size={16}
                                    />
                                    <div className="min-w-0">
                                      <p className="text-[0.86rem] font-medium text-[var(--text-1)] flex items-center gap-2">
                                        <span className="truncate">
                                          {d.name || 'Dispositivo Web'}
                                        </span>
                                        {d.isTrusted ? (
                                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[var(--green)] bg-[var(--green-soft)] px-1.5 py-0.5 rounded-full border border-[var(--green)]/10 flex-shrink-0">
                                            Confiable
                                          </span>
                                        ) : (
                                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[var(--text-3)] bg-[var(--white)] px-1.5 py-0.5 rounded-full border border-[var(--border)] flex-shrink-0">
                                            Sin confirmar
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-[0.72rem] text-[var(--text-3)] mt-0.5 truncate">
                                        {d.ipAddress} ·{' '}
                                        {new Date(d.lastActivityAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 flex-shrink-0">
                                    <button
                                      onClick={() =>
                                        handleToggleDeviceTrust(d.id, d.isTrusted)
                                      }
                                      className="px-3 py-1 border border-[var(--border)] hover:bg-[var(--white)] rounded-full text-[0.72rem] font-medium text-[var(--text-2)] transition-all"
                                    >
                                      {d.isTrusted ? 'Desconfiar' : 'Confiar'}
                                    </button>
                                    <button
                                      onClick={() => handleRevokeDevice(d.id)}
                                      className="p-1 rounded-full hover:bg-[var(--red-soft)] text-[var(--text-3)] hover:text-[var(--red)] transition-all"
                                      aria-label="Revocar dispositivo"
                                    >
                                      <Trash size={13} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* ═══ PRIVACY ═══ */}
              {activeTab === 'privacy' && (
                <div>
                  {/* GDPR Export */}
                  <section className="py-8 border-t border-[var(--border-light)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                          Exportar datos
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Copia completa de tu información, sesiones e historial (GDPR/LOPDP).
                        </p>
                      </div>
                      <div className="md:w-2/3 space-y-4 max-w-md w-full">
                        {exportJob ? (
                          <div className="p-4 border border-[var(--border)] bg-[var(--off-white)] rounded-[14px] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[0.86rem] font-semibold text-[var(--text-1)]">
                                {exportJob.status === 'completed'
                                  ? 'Exportación lista'
                                  : 'Procesando…'}
                              </span>
                              <span className="text-[0.72rem] font-semibold text-[var(--accent)] uppercase tracking-[0.10em] bg-[var(--accent-soft)] px-2 py-0.5 rounded-full">
                                {exportJob.status}
                              </span>
                            </div>

                            {exportJob.status === 'processing' && (
                              <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-[var(--accent)] h-1.5 rounded-full animate-pulse"
                                  style={{ width: '65%' }}
                                />
                              </div>
                            )}

                            {exportJob.downloadUrl && (
                              <a
                                href={exportJob.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-10 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[0.86rem] font-medium transition-all shadow-[var(--shadow-subtle)] flex items-center justify-center gap-2"
                              >
                                <Download size={14} />
                                Descargar ZIP
                              </a>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={handleRequestExport}
                            disabled={exportLoading}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--white)] border border-[var(--border)] hover:bg-[var(--off-white)] text-[var(--text-1)] text-[0.86rem] font-medium transition-all shadow-[var(--shadow-subtle)] disabled:opacity-50"
                          >
                            {exportLoading ? (
                              <Loader2 className="animate-spin" size={14} />
                            ) : (
                              <Download size={14} />
                            )}
                            Solicitar exportación
                          </button>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Danger Zone */}
                  <section className="py-8 border-t border-[var(--red)]/15">
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      <div className="md:w-1/3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--red)]">
                          Zona de peligro
                        </p>
                        <p className="text-[0.86rem] text-[var(--text-3)] mt-1.5 leading-[1.58] pr-4">
                          Eliminación permanente de cuenta. No se puede deshacer.
                        </p>
                      </div>
                      <div className="md:w-2/3 max-w-md w-full">
                        <div className="p-4 rounded-[14px] border border-[var(--red)]/20 bg-[var(--red-soft)] space-y-4">
                          <div>
                            <p className="text-[0.86rem] font-bold text-[var(--red)] flex items-center gap-1.5">
                              <AlertTriangle size={15} />
                              Eliminar cuenta
                            </p>
                            <p className="text-[0.79rem] text-[var(--red)]/80 mt-1 leading-[1.58]">
                              Se cerrarán todas las sesiones, se eliminará tu información y
                              perderás accesos permanentemente.
                            </p>
                          </div>

                          {deleteOpen ? (
                            <div className="space-y-3 border-t border-[var(--red)]/15 pt-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[0.72rem] font-semibold text-[var(--red)] tracking-[0.10em] uppercase">
                                  Escribe &quot;DELETE MY ACCOUNT&quot; para confirmar
                                </label>
                                <input
                                  type="text"
                                  value={deletePhrase}
                                  onChange={(e) => setDeletePhrase(e.target.value)}
                                  placeholder="DELETE MY ACCOUNT"
                                  className="h-9 px-3 rounded-[10px] border border-[var(--red)]/30 bg-[var(--white)] text-[0.86rem] text-[var(--red)] outline-none focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red-soft)] transition-all"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[0.72rem] font-semibold text-[var(--red)] tracking-[0.10em] uppercase">
                                  Contraseña actual
                                </label>
                                <input
                                  type="password"
                                  value={deletePassword}
                                  onChange={(e) => setDeletePassword(e.target.value)}
                                  placeholder="Tu contraseña"
                                  className="h-9 px-3 rounded-[10px] border border-[var(--red)]/30 bg-[var(--white)] text-[0.86rem] text-[var(--red)] outline-none focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red-soft)] transition-all"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setDeleteOpen(false)}
                                  className="px-4 py-2 rounded-full border border-[var(--border)] bg-transparent text-[0.72rem] text-[var(--text-3)] font-semibold hover:bg-[var(--white)] transition-all"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={handleDeleteAccount}
                                  disabled={deleteLoading}
                                  className="px-4 py-2 rounded-full bg-[var(--red)] text-white hover:bg-[var(--red)]/90 text-[0.72rem] font-semibold disabled:opacity-50 transition-all"
                                >
                                  {deleteLoading ? 'Eliminando…' : 'Eliminar permanentemente'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteOpen(true)}
                              className="inline-flex items-center px-5 py-2 rounded-full bg-[var(--red)] text-white hover:bg-[var(--red)]/90 text-[0.86rem] font-medium transition-all shadow-[var(--shadow-subtle)]"
                            >
                              Eliminar mi cuenta
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Reauth Modal */}
      {reauthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-[var(--white)] rounded-2xl p-6 w-full max-w-sm border border-[var(--border-light)] shadow-[var(--shadow-prominent)] space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Lock size={18} />
              </div>
              <div>
                <p className="text-[0.93rem] font-semibold text-[var(--text-1)]">
                  Verificación requerida
                </p>
                <p className="text-[0.79rem] text-[var(--text-3)]">
                  Introduce tu contraseña de acceso.
                </p>
              </div>
            </div>
            <input
              type="password"
              autoFocus
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              className="w-full h-10 rounded-[10px] border border-[var(--border)] px-3 text-[0.97rem] bg-[var(--white)] text-[var(--text-1)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none transition-all"
              placeholder="Contraseña actual"
              onKeyDown={(e) => e.key === 'Enter' && handleReauthSubmit()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReauthOpen(false)}
                className="px-4 py-2 text-[0.86rem] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] rounded-full transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReauthSubmit}
                disabled={reauthLoading}
                className="px-5 py-2 text-[0.86rem] font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-full transition-all shadow-[var(--shadow-subtle)]"
              >
                {reauthLoading ? 'Verificando…' : 'Continuar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
