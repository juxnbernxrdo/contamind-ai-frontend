'use client';

import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { LogOut, User, Shield, Activity, Settings, BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface DashboardStats {
  activeSessions: number;
  devices: number;
  revenue: number;
  pendingInvoices: number;
  systemStatus: string;
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (user && !loading) {
      apiClient.get('/dashboard/stats')
        .then((res) => {
          if (mounted) {
            setStats(res.data);
            setStatsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error cargando stats del dashboard", err);
          if (mounted) setStatsLoading(false);
        });
    }
    return () => { mounted = false; };
  }, [user, loading]);

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Activity className="w-10 h-10 text-blue-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
            C
          </div>
          <h1 className="text-2xl font-bold font-instrument">ContaMind AI</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-white/60" />
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.email.split('@')[0]}</h2>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Shield className="w-4 h-4" />
                2FA Status
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user?.twoFAEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {user?.twoFAEnabled ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats / Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 p-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl relative overflow-hidden flex flex-col justify-end min-h-[300px]"
        >
          <div className="absolute top-0 right-0 p-8">
            <Activity className="w-32 h-32 text-white/10" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-2 font-instrument">¡Hola de nuevo!</h2>
            {stats ? (
              <div className="mt-4 space-y-4">
                <p className="text-blue-100/80 max-w-md">
                  Estado del sistema: <strong className="text-white">{stats.systemStatus}</strong>.
                  Tienes {stats.activeSessions} sesiones activas en {stats.devices} dispositivos.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-black/20 p-4 rounded-xl backdrop-blur-md">
                    <p className="text-sm text-blue-200">Ingresos Mensuales</p>
                    <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl backdrop-blur-md">
                    <p className="text-sm text-blue-200">Facturas Pendientes</p>
                    <p className="text-2xl font-bold">{stats.pendingInvoices}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-blue-100/80 max-w-md mt-4">
                Tu infraestructura de seguridad está operando con normalidad.
              </p>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
