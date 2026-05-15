'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
    } catch (error) {
      // Error handled by context toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white font-instrument">
          Bienvenido de nuevo
        </h1>
        <p className="text-white/60">
          Ingresa tus credenciales para acceder a ContaMind
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Iniciar Sesión
              <LogIn className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-white/40">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/register" className="text-white hover:underline transition-all">
          Regístrate aquí
        </Link>
      </div>
    </motion.div>
  );
}
