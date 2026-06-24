'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { startRegistration } from '@simplewebauthn/browser';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Settings,
  Shield,
  Key,
  Laptop,
  Activity,
  Users,
  Cpu,
  FileSpreadsheet,
  Trash2,
  Plus,
  RefreshCw,
  Check,
  Copy,
  Lock,
  User,
  AlertTriangle,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Logo } from '@/components/Logo';

// Pre-defined modules and actions for delegation selection
const AVAILABLE_PERMISSIONS = [
  { value: 'invoicing:read', label: 'Facturación: Lectura' },
  { value: 'invoicing:write', label: 'Facturación: Escritura' },
  { value: 'accounting:read', label: 'Contabilidad: Lectura' },
  { value: 'accounting:write', label: 'Contabilidad: Escritura' },
  { value: 'taxes:read', label: 'Impuestos: Lectura' },
  { value: 'taxes:write', label: 'Impuestos: Escritura' },
  { value: 'payroll:read', label: 'Nómina: Lectura' },
  { value: 'payroll:write', label: 'Nómina: Escritura' },
];

export default function SettingsPage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  // Active Tab: 'sessions' | 'security' | 'delegations' | 'm2m' | 'gdpr'
  const [activeTab, setActiveTab] = useState<'sessions' | 'security' | 'delegations' | 'm2m' | 'gdpr'>('sessions');

  // Generic Reauth Modal State
  const [isReauthOpen, setIsReauthOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthLoading, setReauthLoading] = useState(false);
  const [reauthCallback, setReauthCallback] = useState<((token: string) => void) | null>(null);

  // Loading states for data fetching
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [delegationsLoading, setDelegationsLoading] = useState(false);
  const [m2mLoading, setM2MLoading] = useState(false);

  // Resource States
  const [sessions, setSessions] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [delegatedGranted, setDelegatedGranted] = useState<any[]>([]);
  const [delegatedReceived, setDelegatedReceived] = useState<any[]>([]);
  const [m2mAgents, setM2MAgents] = useState<any[]>([]);

  // 1. Devices & Sessions Logic
  const fetchSessionsAndDevices = useCallback(async () => {
    setSessionsLoading(true);
    setDevicesLoading(true);
    try {
      const [sessRes, devRes] = await Promise.all([
        apiClient.get('/auth/sessions'),
        apiClient.get('/auth/devices')
      ]);
      setSessions(sessRes.data);
      setDevices(devRes.data);
    } catch (err: any) {
      toast.error('Error al cargar dispositivos y sesiones');
    } finally {
      setSessionsLoading(false);
      setDevicesLoading(false);
    }
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
      toast.success('Sesión revocada exitosamente');
      fetchSessionsAndDevices();
    } catch (err: any) {
      toast.error('No se pudo revocar la sesión');
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!confirm('¿Está seguro de que desea cerrar todas las demás sesiones activas? Se cerrará la sesión de todos los demás navegadores.')) return;
    try {
      await apiClient.delete('/auth/sessions');
      toast.success('Todas las demás sesiones han sido cerradas');
      fetchSessionsAndDevices();
    } catch (err: any) {
      toast.error('Error al cerrar todas las sesiones');
    }
  };

  const handleRenameDevice = async (deviceId: string, currentName: string) => {
    const newName = prompt('Ingrese el nuevo nombre para este dispositivo:', currentName);
    if (!newName || newName.trim() === '') return;
    try {
      await apiClient.patch(`/auth/devices/${deviceId}`, { name: newName.trim() });
      toast.success('Dispositivo renombrado');
      fetchSessionsAndDevices();
    } catch (err: any) {
      toast.error('Error al renombrar el dispositivo');
    }
  };

  const handleToggleDeviceTrust = async (deviceId: string, isTrusted: boolean) => {
    try {
      await apiClient.patch(`/auth/devices/${deviceId}`, { isTrusted });
      toast.success(isTrusted ? 'Dispositivo marcado como de confianza' : 'Dispositivo removido de confianza');
      fetchSessionsAndDevices();
    } catch (err: any) {
      toast.error('Error al cambiar estado de confianza');
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (!confirm('¿Está seguro de revocar este dispositivo? Todas las sesiones asociadas a él serán cerradas inmediatamente.')) return;
    try {
      await apiClient.delete(`/auth/devices/${deviceId}`);
      toast.success('Dispositivo revocado');
      fetchSessionsAndDevices();
    } catch (err: any) {
      toast.error('Error al revocar el dispositivo');
    }
  };

  // 2. Security / 2FA Logic
  const [twoFAStep, setTwoFAStep] = useState<'idle' | 'setup' | 'backup_codes'>('idle');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFASecret, setTwoFASecret] = useState('');
  const [totpVerificationToken, setTotpVerificationToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [twoFALoading, setTwoFALoading] = useState(false);

  const [disable2FAOpen, setDisable2FAOpen] = useState(false);
  const [disable2FAToken, setDisable2FAToken] = useState('');

  const handleSetup2FA = async () => {
    setTwoFALoading(true);
    try {
      const { data } = await apiClient.post('/auth/2fa/setup');
      setQrCodeUrl(data.qrCodeUrl);
      setTwoFASecret(data.secret);
      setTwoFAStep('setup');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al iniciar la configuración 2FA';
      toast.error(msg);
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerifyAndActivate2FA = async () => {
    if (!totpVerificationToken.trim()) {
      toast.error('Ingrese el código de verificación de su aplicación');
      return;
    }
    setTwoFALoading(true);
    try {
      const { data } = await apiClient.post('/auth/2fa/activate', { token: totpVerificationToken });
      setBackupCodes(data.backupCodes || []);
      setTwoFAStep('backup_codes');
      if (user) {
        setUser({ ...user, twoFAEnabled: true });
      }
      toast.success('¡Autenticación de dos factores activada exitosamente!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Código incorrecto. Inténtelo de nuevo.';
      toast.error(msg);
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disable2FAToken.trim()) {
      toast.error('Ingrese el código de verificación para desactivar');
      return;
    }
    setTwoFALoading(true);
    try {
      await apiClient.delete('/auth/2fa', { data: { token: disable2FAToken } });
      if (user) {
        setUser({ ...user, twoFAEnabled: false });
      }
      setDisable2FAOpen(false);
      setDisable2FAToken('');
      toast.success('Autenticación de dos factores desactivada.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Código incorrecto';
      toast.error(msg);
    } finally {
      setTwoFALoading(false);
    }
  };

  // WebAuthn Passkeys Enrollment
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const handleRegisterPasskey = async () => {
    setPasskeyLoading(true);
    try {
      const { data: options } = await apiClient.post('/auth/webauthn/register/options');
      const regResp = await startRegistration({ optionsJSON: options });
      await apiClient.post('/auth/webauthn/register/verify', { response: regResp });
      toast.success('¡Llave de paso (Passkey) registrada con éxito en este dispositivo!');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al registrar passkey';
      toast.error(msg);
    } finally {
      setPasskeyLoading(false);
    }
  };

  // 3. User-to-User Delegations Logic
  const fetchDelegations = useCallback(async () => {
    setDelegationsLoading(true);
    try {
      const { data } = await apiClient.get('/auth/delegation/user-grants');
      setDelegatedGranted(data.granted || []);
      setDelegatedReceived(data.received || []);
    } catch (err: any) {
      toast.error('Error al cargar las delegaciones de usuario');
    } finally {
      setDelegationsLoading(false);
    }
  }, []);

  const [delDelegateeUserId, setDelDelegateeUserId] = useState('');
  const [delExpiresInHours, setDelExpiresInHours] = useState(24);
  const [delNote, setDelNote] = useState('');
  const [delPermissions, setDelPermissions] = useState<string[]>([]);
  const [createdDelegationToken, setCreatedDelegationToken] = useState<string | null>(null);

  const handleToggleDelPermission = (perm: string) => {
    if (delPermissions.includes(perm)) {
      setDelPermissions(delPermissions.filter(p => p !== perm));
    } else {
      setDelPermissions([...delPermissions, perm]);
    }
  };

  const triggerReauth = (callback: (token: string) => void) => {
    setReauthPassword('');
    setReauthCallback(() => callback);
    setIsReauthOpen(true);
  };

  const submitReauth = async () => {
    if (!reauthPassword) {
      toast.error('Ingrese su contraseña actual');
      return;
    }
    setReauthLoading(true);
    try {
      const { data } = await apiClient.post('/auth/reauth', { password: reauthPassword });
      setIsReauthOpen(false);
      if (reauthCallback) {
        reauthCallback(data.reauthToken);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Contraseña incorrecta';
      toast.error(msg);
    } finally {
      setReauthLoading(false);
    }
  };

  const handleCreateDelegation = () => {
    if (!delDelegateeUserId.trim()) {
      toast.error('Debe ingresar el ID del usuario delegatario.');
      return;
    }
    if (delPermissions.length === 0) {
      toast.error('Debe seleccionar al menos un permiso para delegar.');
      return;
    }

    triggerReauth(async (reauthToken) => {
      try {
        const { data } = await apiClient.post('/auth/delegation/user-grants', {
          delegateeUserId: delDelegateeUserId.trim(),
          permissions: delPermissions,
          expiresInHours: Number(delExpiresInHours),
          note: delNote.trim() || undefined,
          reauthToken
        });
        setCreatedDelegationToken(data.delegationToken);
        toast.success('Delegación creada exitosamente');
        fetchDelegations();
        // Reset form
        setDelDelegateeUserId('');
        setDelNote('');
        setDelPermissions([]);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Error al crear la delegación';
        toast.error(msg);
      }
    });
  };

  const handleRevokeGrant = async (grantId: string) => {
    if (!confirm('¿Está seguro de que desea revocar esta delegación de permisos? El token generado quedará inmediatamente invalidado.')) return;
    try {
      await apiClient.delete(`/auth/delegation/grants/${grantId}`);
      toast.success('Delegación revocada');
      fetchDelegations();
    } catch (err: any) {
      toast.error('Error al revocar la delegación');
    }
  };

  const handleReissueToken = async (grantId: string) => {
    try {
      const { data } = await apiClient.post(`/auth/delegation/user-grants/${grantId}/token`);
      setCreatedDelegationToken(data.delegationToken);
      toast.info('Token de delegación re-emitido. Copie el token a continuación.');
    } catch (err: any) {
      toast.error('Error al re-emitir el token de delegación');
    }
  };

  // M2M Sign/Approval Form
  const [signGrantId, setSignGrantId] = useState('');
  const [signTotpToken, setSignTotpToken] = useState('');
  const [signLoading, setSignLoading] = useState(false);
  const [approvedActionToken, setApprovedActionToken] = useState<string | null>(null);

  const handleSignGrant = async () => {
    if (!signGrantId.trim() || !signTotpToken.trim()) {
      toast.error('Debe completar el ID de la solicitud y el token TOTP.');
      return;
    }
    setSignLoading(true);
    try {
      const { data } = await apiClient.post(`/auth/delegation/grants/${signGrantId.trim()}/sign`, {
        totpToken: signTotpToken.trim()
      });
      setApprovedActionToken(data.actionToken);
      toast.success('¡Solicitud M2M firmada y aprobada con éxito!');
      setSignGrantId('');
      setSignTotpToken('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'No se pudo firmar la solicitud M2M. Verifique el ID y el código TOTP.';
      toast.error(msg);
    } finally {
      setSignLoading(false);
    }
  };

  // 4. Machine-to-Machine Admin Logic (Admin Role Only)
  const fetchM2MAgents = useCallback(async () => {
    setM2MLoading(true);
    try {
      const { data } = await apiClient.get('/auth/m2m/agents');
      setM2MAgents(data);
    } catch (err: any) {
      toast.error('Error al cargar agentes de máquina');
    } finally {
      setM2MLoading(false);
    }
  }, []);

  const [agentName, setAgentName] = useState('');
  const [agentDesc, setAgentDesc] = useState('');
  const [agentExpires, setAgentExpires] = useState(30);
  const [agentScopes, setAgentScopes] = useState<string[]>([]);
  const [newAgentSecret, setNewAgentSecret] = useState<string | null>(null);

  const handleToggleAgentScope = (scope: string) => {
    if (agentScopes.includes(scope)) {
      setAgentScopes(agentScopes.filter(s => s !== scope));
    } else {
      setAgentScopes([...agentScopes, scope]);
    }
  };

  const handleCreateAgent = async () => {
    if (!agentName.trim()) {
      toast.error('Debe ingresar un nombre para el agente M2M.');
      return;
    }
    if (agentScopes.length === 0) {
      toast.error('Debe seleccionar al menos un ámbito de acción (scope).');
      return;
    }

    try {
      const { data } = await apiClient.post('/auth/m2m/agents', {
        name: agentName.trim(),
        description: agentDesc.trim() || undefined,
        actionScope: agentScopes,
        expiresInDays: Number(agentExpires)
      });
      setNewAgentSecret(data.secretKey);
      toast.success('Agente M2M creado correctamente.');
      fetchM2MAgents();
      // Reset form
      setAgentName('');
      setAgentDesc('');
      setAgentScopes([]);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear agente M2M';
      toast.error(msg);
    }
  };

  const handleRotateAgentSecret = async (agentId: string) => {
    if (!confirm('¿Está seguro de rotar la clave secreta? La clave anterior será invalidada de inmediato.')) return;
    try {
      const { data } = await apiClient.post(`/auth/m2m/agents/${agentId}/rotate-secret`);
      setNewAgentSecret(data.secretKey);
      toast.info('Clave secreta rotada. Copie la nueva clave.');
    } catch (err: any) {
      toast.error('Error al rotar la clave secreta.');
    }
  };

  const handleRevokeAgent = async (agentId: string) => {
    if (!confirm('¿Está seguro de revocar este agente? Se eliminarán todas las delegaciones y accesos de inmediato.')) return;
    try {
      await apiClient.delete(`/auth/m2m/agents/${agentId}`);
      toast.success('Agente M2M revocado.');
      fetchM2MAgents();
    } catch (err: any) {
      toast.error('Error al revocar el agente.');
    }
  };

  // 5. Privacy & GDPR Logic
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportDownloadUrl, setExportDownloadUrl] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const handleRequestDataExport = () => {
    triggerReauth(async (reauthToken) => {
      setExportLoading(true);
      setExportStatus('Iniciando...');
      setExportDownloadUrl(null);
      setExportProgress(0);
      try {
        const { data } = await apiClient.post('/auth/user/export', {
          reauthToken,
          includeBusinessData: true,
          notifyEmail: true
        });
        setExportJobId(data.jobId);
        setExportStatus('Encolado');
        toast.info('Solicitud de exportación de datos encolada.');
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Error al solicitar exportación';
        toast.error(msg);
        setExportLoading(false);
      }
    });
  };

  // Poll Job Status
  useEffect(() => {
    if (!exportJobId) return;

    let intervalId = setInterval(async () => {
      try {
        const { data } = await apiClient.get(`/auth/user/export/jobs/${exportJobId}`);
        setExportStatus(data.status);
        if (data.progress) {
          setExportProgress(data.progress);
        }
        if (data.status === 'completed' || data.status === 'success') {
          setExportDownloadUrl(data.downloadUrl);
          setExportJobId(null);
          setExportLoading(false);
          toast.success('¡Exportación de datos lista para descargar!');
        } else if (data.status === 'failed') {
          toast.error('La exportación de datos falló en el servidor.');
          setExportJobId(null);
          setExportLoading(false);
        }
      } catch (e) {
        // Stop polling on error
        setExportJobId(null);
        setExportLoading(false);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [exportJobId]);

  // Account Cancellation
  const [cancelConfirmation, setCancelConfirmation] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelAccount = () => {
    if (cancelConfirmation !== 'DELETE MY ACCOUNT') {
      toast.error('Debe escribir exactamente "DELETE MY ACCOUNT" para proceder.');
      return;
    }

    triggerReauth(async (reauthToken) => {
      setCancelLoading(true);
      try {
        await apiClient.post('/auth/user/cancel', {
          reauthToken,
          confirmationPhrase: 'DELETE MY ACCOUNT'
        });
        toast.success('Cuenta cancelada y anonimizada. Lamentamos verlo partir.');
        // Redirect to register after short delay
        setTimeout(() => {
          window.location.href = '/auth/register';
        }, 3000);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Error al cancelar la cuenta';
        toast.error(msg);
        setCancelLoading(false);
      }
    });
  };

  // Fetch initial data based on tab selected
  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login');
      return;
    }

    Promise.resolve().then(() => {
      if (activeTab === 'sessions') {
        fetchSessionsAndDevices();
      } else if (activeTab === 'delegations') {
        fetchDelegations();
      } else if (activeTab === 'm2m' && user?.roles?.includes('ADMIN')) {
        fetchM2MAgents();
      }
    });
  }, [activeTab, user, loading, fetchSessionsAndDevices, fetchDelegations, fetchM2MAgents, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Activity className="w-10 h-10 text-blue-500 animate-pulse" />
      </div>
    );
  }

  const isAdmin = user.roles.includes('ADMIN') || user.roles.includes('admin');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Navigation Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-medium text-sm text-white/80"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <aside className="col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-medium text-sm transition-all ${
              activeTab === 'sessions'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            Sesiones y Dispositivos
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-medium text-sm transition-all ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Seguridad y 2FA
          </button>
          <button
            onClick={() => setActiveTab('delegations')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-medium text-sm transition-all ${
              activeTab === 'delegations'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Delegación (U2U / M2M)
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('m2m')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-medium text-sm transition-all ${
                activeTab === 'm2m'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Administración M2M
            </button>
          )}
          <button
            onClick={() => setActiveTab('gdpr')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-medium text-sm transition-all ${
              activeTab === 'gdpr'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Privacidad y LOPDP
          </button>

          {/* User ID Card Info */}
          <div className="pt-8 border-t border-white/10 mt-8 space-y-3">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
              <span className="text-xs text-white/40 font-medium block">Mi ID de Usuario</span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs text-blue-400 font-mono select-all truncate block flex-1">
                  {user.id}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    toast.success('ID copiado al portapapeles');
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <section className="col-span-1 lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 space-y-8 backdrop-blur-md"
            >
              {/* Tab 1: Sessions & Devices */}
              {activeTab === 'sessions' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      Dispositivos y Sesiones Activas
                    </h2>
                    <p className="text-sm text-white/50 mt-1">
                      Gestiona los dispositivos de confianza y controla las sesiones abiertas en tu cuenta.
                    </p>
                  </div>

                  {/* Device List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold text-white/80 flex items-center gap-2">
                        <Laptop className="w-4.5 h-4.5 text-blue-400" />
                        Dispositivos Registrados
                      </h3>
                      {devicesLoading && <Loader2 className="w-4 h-4 animate-spin text-white/40" />}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {devices.length === 0 && !devicesLoading && (
                        <div className="col-span-full p-8 text-center text-white/30 border border-dashed border-white/10 rounded-2xl">
                          No se han detectado dispositivos registrados.
                        </div>
                      )}
                      {devices.map((device) => (
                        <div
                          key={device.id}
                          className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4 flex flex-col justify-between"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-bold text-white/90 truncate max-w-[180px]">{device.name || 'Dispositivo Desconocido'}</h4>
                              <p className="text-xs text-white/40 mt-0.5 font-mono">{device.deviceType} • {device.lastActivityIp}</p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                device.isTrusted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {device.isTrusted ? 'De confianza' : 'No verificado'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRenameDevice(device.id, device.name)}
                                className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/80"
                              >
                                Renombrar
                              </button>
                              <button
                                onClick={() => handleToggleDeviceTrust(device.id, !device.isTrusted)}
                                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                                  device.isTrusted
                                    ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                                    : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                }`}
                              >
                                {device.isTrusted ? 'Quitar confianza' : 'Confiar'}
                              </button>
                            </div>
                            <button
                              onClick={() => handleRevokeDevice(device.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                              title="Revocar dispositivo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sessions List */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold text-white/80 flex items-center gap-2">
                        <Activity className="w-4.5 h-4.5 text-blue-400" />
                        Sesiones Activas
                      </h3>
                      <div className="flex items-center gap-4">
                        {sessions.length > 1 && (
                          <button
                            onClick={handleRevokeAllSessions}
                            className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                          >
                            Cerrar las demás sesiones
                          </button>
                        )}
                        {sessionsLoading && <Loader2 className="w-4 h-4 animate-spin text-white/40" />}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {sessions.length === 0 && !sessionsLoading && (
                        <div className="p-8 text-center text-white/30 border border-dashed border-white/10 rounded-2xl">
                          No se han detectado sesiones activas.
                        </div>
                      )}
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <Laptop className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">
                                {session.device?.name || 'Navegador'}
                              </p>
                              <p className="text-xs text-white/40">
                                IP: {session.device?.lastActivityIp || 'Desconocida'} • Actividad:{' '}
                                {new Date(session.lastActivityAt || session.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRevokeSession(session.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 text-xs rounded-xl hover:bg-red-500/20 transition-all"
                          >
                            Cerrar sesión
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Security & 2FA */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      Seguridad de la Cuenta
                    </h2>
                    <p className="text-sm text-white/50 mt-1">
                      Agrega capas adicionales de seguridad a tu cuenta utilizando MFA/TOTP y Biometría.
                    </p>
                  </div>

                  {/* 2FA Section */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-md font-semibold text-white/90">Autenticación de Dos Factores (2FA / TOTP)</h3>
                        <p className="text-xs text-white/40 mt-1 max-w-[480px]">
                          Protege tu cuenta con un código de verificación dinámico generado por tu aplicación móvil (Google Authenticator, Authy, Microsoft Authenticator, etc.).
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          user.twoFAEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user.twoFAEnabled ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Steps / Wizard */}
                    {twoFAStep === 'idle' && (
                      <div className="pt-2">
                        {user.twoFAEnabled ? (
                          <button
                            onClick={() => setDisable2FAOpen(true)}
                            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold rounded-xl transition-all text-sm"
                          >
                            Desactivar Autenticación de Dos Factores
                          </button>
                        ) : (
                          <button
                            onClick={handleSetup2FA}
                            disabled={twoFALoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-50"
                          >
                            {twoFALoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Configurar 2FA ahora
                          </button>
                        )}
                      </div>
                    )}

                    {/* Step: Setup 2FA QR code */}
                    {twoFAStep === 'setup' && (
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          {qrCodeUrl && (
                            <div className="bg-white p-3 rounded-2xl shrink-0">
                              {/* QR Code element, we can use the URL returned */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={qrCodeUrl} alt="QR Code 2FA" className="w-40 h-40" />
                            </div>
                          )}
                          <div className="space-y-3 flex-1 text-sm">
                            <h4 className="font-bold text-white/90">Escanear Código QR</h4>
                            <p className="text-white/60 text-xs leading-relaxed">
                              1. Escanea el código QR de la izquierda desde tu aplicación de autenticación móvil.<br/>
                              2. Si no puedes escanear el código, ingresa manualmente la siguiente clave secreta en tu aplicación:
                            </p>
                            <div className="flex items-center justify-between gap-2 p-2.5 bg-black/40 border border-white/10 rounded-xl">
                              <code className="text-xs text-blue-400 font-mono select-all truncate block">
                                {twoFASecret}
                              </code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(twoFASecret);
                                  toast.success('Clave secreta copiada');
                                }}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Verification field */}
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <label className="text-xs font-semibold text-white/70 block">
                            Confirmar Código de Autenticación
                          </label>
                          <div className="flex gap-3 max-w-[320px]">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="000000"
                              value={totpVerificationToken}
                              onChange={(e) => setTotpVerificationToken(e.target.value.replace(/\D/g, ''))}
                              className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-center font-mono tracking-widest text-lg flex-1"
                            />
                            <button
                              onClick={handleVerifyAndActivate2FA}
                              disabled={twoFALoading}
                              className="px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                            >
                              {twoFALoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step: Backup Codes */}
                    {twoFAStep === 'backup_codes' && (
                      <div className="p-5 bg-green-500/10 rounded-2xl border border-green-500/20 space-y-4">
                        <h4 className="font-bold text-green-400 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          ¡Autenticación de dos factores activada!
                        </h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                          Guarda estos códigos de recuperación de un solo uso en un lugar seguro. Si pierdes tu dispositivo móvil, podrás usarlos para ingresar a tu cuenta.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 bg-black/40 border border-white/10 rounded-xl font-mono text-center text-sm text-white/95">
                          {backupCodes.map((code, idx) => (
                            <div key={idx} className="p-1 select-all">{code}</div>
                          ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(backupCodes.join('\n'));
                              toast.success('Códigos de recuperación copiados');
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Códigos
                          </button>
                          <button
                            onClick={() => setTwoFAStep('idle')}
                            className="px-4 py-2 bg-green-500 text-black font-semibold rounded-xl transition-all text-xs"
                          >
                            Entendido, guardar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Disable 2FA Modal */}
                  <AnimatePresence>
                    {disable2FAOpen && (
                      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="bg-[#121214] border border-[#2c2c2e] rounded-3xl p-6 max-w-sm w-full space-y-4 text-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">Desactivar 2FA</h3>
                            <p className="text-xs text-white/50 mt-1">
                              Por favor ingrese el código de 6 dígitos de su aplicación de autenticación para confirmar la desactivación.
                            </p>
                          </div>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={disable2FAToken}
                            onChange={(e) => setDisable2FAToken(e.target.value.replace(/\D/g, ''))}
                            className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl focus:border-red-500 focus:outline-none text-center font-mono tracking-widest text-lg w-full"
                          />
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => {
                                setDisable2FAOpen(false);
                                setDisable2FAToken('');
                              }}
                              className="px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold flex-1"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleDisable2FA}
                              disabled={twoFALoading}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-xs flex-1 flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              {twoFALoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              Desactivar
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Passkeys (WebAuthn) Section */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-md font-semibold text-white/90">Biometría y Llaves de Paso (Passkeys)</h3>
                        <p className="text-xs text-white/40 mt-1 max-w-[480px]">
                          Registra tu dispositivo actual con TouchID, FaceID o el PIN nativo del sistema para iniciar sesión instantáneamente sin necesidad de escribir contraseñas.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleRegisterPasskey}
                        disabled={passkeyLoading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 font-semibold rounded-xl transition-all text-sm disabled:opacity-50"
                      >
                        {passkeyLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        ) : (
                          <Key className="w-4 h-4 text-blue-400" />
                        )}
                        Registrar este dispositivo como Passkey
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Delegations */}
              {activeTab === 'delegations' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      Delegación de Permisos (U2U / M2M)
                    </h2>
                    <p className="text-sm text-white/50 mt-1">
                      Concede acceso controlado sobre tu cuenta a otros usuarios (U2U) o firma solicitudes de tokens M2M.
                    </p>
                  </div>

                  {/* User-to-User Form */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <h3 className="text-md font-semibold text-white/95">Delegar Permisos a otro Usuario (User-to-User)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">ID del Usuario Delegatario</label>
                        <input
                          type="text"
                          placeholder="Ingrese el ID del usuario destino"
                          value={delDelegateeUserId}
                          onChange={(e) => setDelDelegateeUserId(e.target.value)}
                          className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">Expiración de la Delegación (Horas)</label>
                        <select
                          value={delExpiresInHours}
                          onChange={(e) => setDelExpiresInHours(Number(e.target.value))}
                          className="px-4 py-2.5 bg-[#121214] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm"
                        >
                          <option value={1}>1 hora</option>
                          <option value={12}>12 horas</option>
                          <option value={24}>24 horas (1 día)</option>
                          <option value={72}>72 horas (3 días)</option>
                          <option value={168}>168 horas (7 días)</option>
                        </select>
                      </div>
                      <div className="col-span-full space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">Nota / Propósito de la Delegación</label>
                        <input
                          type="text"
                          placeholder="Ej. Revisión temporal de impuestos de Junio"
                          value={delNote}
                          onChange={(e) => setDelNote(e.target.value)}
                          className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-white/50 font-semibold block">Seleccionar Módulos / Permisos</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {AVAILABLE_PERMISSIONS.map((perm) => {
                          const isSelected = delPermissions.includes(perm.value);
                          return (
                            <button
                              key={perm.value}
                              onClick={() => handleToggleDelPermission(perm.value)}
                              className={`p-2 rounded-xl text-xs border text-center transition-all ${
                                isSelected
                                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                                  : 'bg-black/20 border-white/5 text-white/60 hover:text-white hover:border-white/10'
                              }`}
                            >
                              {perm.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleCreateDelegation}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm"
                    >
                      Generar Token de Delegación
                    </button>
                  </div>

                  {/* Token Display Pane */}
                  {createdDelegationToken && (
                    <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-3">
                      <h4 className="font-bold text-blue-400 text-sm">Token de Delegación Emitido</h4>
                      <p className="text-xs text-white/70">
                        Comparte este token con el usuario delegado. Podrá usarlo para ejecutar acciones autorizadas en tu nombre.
                      </p>
                      <div className="flex gap-2">
                        <textarea
                          readOnly
                          value={createdDelegationToken}
                          className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono select-all flex-1 h-20 resize-none focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(createdDelegationToken);
                            toast.success('Token de delegación copiado');
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center"
                          title="Copiar token"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => setCreatedDelegationToken(null)}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                      >
                        Ocultar panel
                      </button>
                    </div>
                  )}

                  {/* M2M Sign/Approval Interface */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <h3 className="text-md font-semibold text-white/95">Aprobación M2M (Firmar Solicitud de Token)</h3>
                    <p className="text-xs text-white/40 max-w-[480px]">
                      Si una integración M2M externa solicita acceso temporal a tu cuenta, ingresa el ID de solicitud y tu código MFA para firmarla digitalmente.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">ID de la Solicitud (Grant ID)</label>
                        <input
                          type="text"
                          placeholder="Ej. c28a44d0-..."
                          value={signGrantId}
                          onChange={(e) => setSignGrantId(e.target.value)}
                          className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">Código TOTP (MFA de tu Móvil)</label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          value={signTotpToken}
                          onChange={(e) => setSignTotpToken(e.target.value.replace(/\D/g, ''))}
                          className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm text-center font-mono tracking-widest"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSignGrant}
                      disabled={signLoading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-750 text-black font-bold rounded-xl transition-all text-sm disabled:opacity-50"
                    >
                      {signLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Firmar y Autorizar M2M
                    </button>

                    {approvedActionToken && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl space-y-2">
                        <p className="text-xs text-green-400 font-bold">Solicitud Aprobada Correctamente</p>
                        <p className="text-[11px] text-white/60">
                          Se ha generado el token de acción. La integración puede consumirlo para obtener el token final.
                        </p>
                        <div className="flex items-center justify-between p-2 bg-black/40 border border-white/10 rounded-lg">
                          <code className="text-xs text-green-400 font-mono select-all truncate block flex-1">
                            {approvedActionToken}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(approvedActionToken);
                              toast.success('Token de acción copiado');
                            }}
                            className="p-1 hover:bg-white/10 rounded text-white/60"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* List of Granted/Received */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-md font-semibold text-white/80">Delegaciones Emitidas</h3>
                    {delegationsLoading && <Loader2 className="w-4 h-4 animate-spin text-white/40" />}
                    <div className="space-y-3">
                      {delegatedGranted.length === 0 && !delegationsLoading && (
                        <p className="text-sm text-white/30 italic">No has otorgado ninguna delegación.</p>
                      )}
                      {delegatedGranted.map((grant) => (
                        <div key={grant.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold">
                              Para: {grant.delegatee?.email || grant.delegateeUserId}
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                              Permisos: {grant.originalPermissions?.join(', ') || grant.actionScope}
                            </p>
                            {grant.contextMetadata?.note && (
                              <p className="text-xs text-blue-400 mt-1">Nota: {grant.contextMetadata.note}</p>
                            )}
                            <p className="text-[10px] text-white/30 mt-1 font-mono">
                              Expira: {new Date(grant.expiresAt).toLocaleString()} | Estado: <span className="uppercase text-blue-400">{grant.status}</span>
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {grant.status === 'active' && (
                              <button
                                onClick={() => handleReissueToken(grant.id)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs rounded-xl font-medium"
                              >
                                Obtener Token
                              </button>
                            )}
                            <button
                              onClick={() => handleRevokeGrant(grant.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6">
                    <h3 className="text-md font-semibold text-white/80">Delegaciones Recibidas</h3>
                    <div className="space-y-3">
                      {delegatedReceived.length === 0 && !delegationsLoading && (
                        <p className="text-sm text-white/30 italic">No has recibido ninguna delegación.</p>
                      )}
                      {delegatedReceived.map((grant) => (
                        <div key={grant.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold">
                              De: {grant.delegator?.email || grant.delegatorUserId}
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                              Permisos: {grant.originalPermissions?.join(', ') || grant.actionScope}
                            </p>
                            {grant.contextMetadata?.note && (
                              <p className="text-xs text-blue-400 mt-1">Nota: {grant.contextMetadata.note}</p>
                            )}
                            <p className="text-[10px] text-white/30 mt-1 font-mono">
                              Expira: {new Date(grant.expiresAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRevokeGrant(grant.id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs rounded-xl transition-all"
                          >
                            Devolver acceso
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: M2M Agent Admin */}
              {activeTab === 'm2m' && isAdmin && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      Agentes Machine-to-Machine (Service Principals)
                    </h2>
                    <p className="text-sm text-white/50 mt-1">
                      Crea y administra credenciales seguras para integraciones de software automatizadas.
                    </p>
                  </div>

                  {/* Create Agent Form */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <h3 className="text-md font-semibold text-white/95">Crear Nuevo Agente M2M</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">Nombre del Agente</label>
                        <input
                          type="text"
                          placeholder="Ej. integracion-sri-cron"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">Expiración de la Clave (Días)</label>
                        <input
                          type="number"
                          min={1}
                          max={365}
                          value={agentExpires}
                          onChange={(e) => setAgentExpires(Number(e.target.value))}
                          className="px-4 py-2.5 bg-[#121214] border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm"
                        />
                      </div>
                      <div className="col-span-full space-y-1.5">
                        <label className="text-xs text-white/50 font-semibold">Descripción del Agente</label>
                        <input
                          type="text"
                          placeholder="Ej. Agente encargado de sincronizar facturas automáticamente"
                          value={agentDesc}
                          onChange={(e) => setAgentDesc(e.target.value)}
                          className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-white/50 font-semibold block">Ámbito de Acción (Scopes autorizados)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {AVAILABLE_PERMISSIONS.map((perm) => {
                          const isSelected = agentScopes.includes(perm.value);
                          return (
                            <button
                              key={perm.value}
                              onClick={() => handleToggleAgentScope(perm.value)}
                              className={`p-2 rounded-xl text-xs border text-center transition-all ${
                                isSelected
                                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                                  : 'bg-black/20 border-white/5 text-white/60 hover:text-white hover:border-white/10'
                              }`}
                            >
                              {perm.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleCreateAgent}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm"
                    >
                      Crear Agente M2M
                    </button>
                  </div>

                  {/* Secret Display Modal/Panel */}
                  {newAgentSecret && (
                    <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3 text-yellow-500">
                        <AlertTriangle className="w-6 h-6 shrink-0" />
                        <h4 className="font-bold text-sm">¡Clave Secreta M2M Generada!</h4>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Copie la siguiente clave de inmediato. Por motivos de seguridad, **no se volverá a mostrar en pantalla.**
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={newAgentSecret}
                          className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs font-mono select-all flex-1 focus:outline-none text-yellow-400"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(newAgentSecret);
                            toast.success('Clave secreta copiada');
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => setNewAgentSecret(null)}
                        className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-xl text-xs transition-all hover:bg-yellow-600"
                      >
                        He guardado la clave
                      </button>
                    </div>
                  )}

                  {/* Agent List */}
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-md font-semibold text-white/80">Agentes Activos</h3>
                    {m2mLoading && <Loader2 className="w-4 h-4 animate-spin text-white/40" />}
                    <div className="space-y-3">
                      {m2mAgents.length === 0 && !m2mLoading && (
                        <p className="text-sm text-white/30 italic">No hay agentes M2M configurados.</p>
                      )}
                      {m2mAgents.map((agent) => (
                        <div key={agent.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-white/90 font-mono">
                              {agent.name}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">{agent.description || 'Sin descripción.'}</p>
                            <p className="text-xs text-white/40 mt-1">
                              Scopes: {agent.actionScope?.join(', ')}
                            </p>
                            <p className="text-[10px] text-white/30 mt-1 font-mono">
                              ID: {agent.id} | Expira: {new Date(agent.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2.5 shrink-0">
                            <button
                              onClick={() => handleRotateAgentSecret(agent.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs rounded-xl font-medium transition-all"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                              Rotar Clave
                            </button>
                            <button
                              onClick={() => handleRevokeAgent(agent.id)}
                              className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: GDPR / LOPDP Controls */}
              {activeTab === 'gdpr' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold font-serif bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      Privacidad y Ley de Protección de Datos (LOPDP)
                    </h2>
                    <p className="text-sm text-white/50 mt-1">
                      Ejerce tus derechos LOPDP de portabilidad (Art. 22) y derecho al olvido (Art. 23) de forma autónoma.
                    </p>
                  </div>

                  {/* Art. 22: Data Export */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <div>
                      <h3 className="text-md font-semibold text-white/95 flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                        Derecho de Portabilidad (Art. 22) — Exportar Datos Personales
                      </h3>
                      <p className="text-xs text-white/40 mt-1.5 max-w-[500px]">
                        Solicita un archivo comprimido que contiene toda tu información personal, configuraciones, logs de auditoría y facturas registradas en ContaMind AI.
                      </p>
                    </div>

                    {!exportLoading ? (
                      <button
                        onClick={handleRequestDataExport}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm"
                      >
                        Solicitar Exportación de Datos
                      </button>
                    ) : (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-blue-400 font-bold flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Estado: {exportStatus}
                          </span>
                          <span className="text-white/60">{exportProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full transition-all duration-300"
                            style={{ width: `${exportProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {exportDownloadUrl && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between gap-4">
                        <div className="text-xs">
                          <p className="text-green-400 font-bold">¡Tu exportación está lista!</p>
                          <p className="text-[11px] text-white/60 mt-0.5">El enlace expirará en 24 horas.</p>
                        </div>
                        <a
                          href={exportDownloadUrl}
                          download
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-xl text-xs transition-all"
                        >
                          Descargar ZIP
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Art. 23: Right to Forget */}
                  <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-6">
                    <div>
                      <h3 className="text-md font-semibold text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Derecho al Olvido (Art. 23) — Cancelación Definitiva de Cuenta
                      </h3>
                      <p className="text-xs text-white/40 mt-1.5 max-w-[500px]">
                        Esta acción anonimizará de manera irreversible todos tus registros personales, revocarà tus llaves de paso y cerrará tu suscripción activa. Los datos de facturación legal se archivarán de forma offline solo para fines de cumplimiento fiscal.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-xs text-white/60 font-semibold block">
                        Para confirmar, escriba exactamente <span className="text-red-500 font-bold">DELETE MY ACCOUNT</span> a continuación:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 max-w-[420px]">
                        <input
                          type="text"
                          placeholder="Escriba la frase de confirmación"
                          value={cancelConfirmation}
                          onChange={(e) => setCancelConfirmation(e.target.value)}
                          className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-red-500 focus:outline-none text-sm flex-1 font-mono text-red-400"
                        />
                        <button
                          onClick={handleCancelAccount}
                          disabled={cancelLoading || cancelConfirmation !== 'DELETE MY ACCOUNT'}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {cancelLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Eliminar Cuenta'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Global Re-authentication Password Modal */}
      <AnimatePresence>
        {isReauthOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121214] border border-[#2c2c2e] rounded-3xl p-6 max-w-sm w-full space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold">Confirmar Contraseña</h3>
                <p className="text-xs text-white/50 mt-1">
                  Esta es una operación altamente sensible. Confirme su contraseña de acceso para continuar.
                </p>
              </div>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                className="px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none w-full text-sm text-center"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsReauthOpen(false);
                    setReauthPassword('');
                    setReauthCallback(null);
                  }}
                  className="px-4 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-xs font-semibold flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={submitReauth}
                  disabled={reauthLoading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-xs flex-1 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {reauthLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
