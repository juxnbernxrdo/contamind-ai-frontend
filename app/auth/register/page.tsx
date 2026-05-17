'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es obligatorio' }),
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError('');
    
    try {
      const { apiClient } = await import('@/lib/api-client');
      await apiClient.post('/auth/register', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la cuenta. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">¡Cuenta Creada!</h2>
        <p className="text-white/60 mb-6">Tu registro fue exitoso. Ya puedes iniciar sesión en ContaMind AI.</p>
        <Link 
          href="/auth/login"
          className="inline-block w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
        >
          Ir a Iniciar Sesión
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white font-instrument">
          Crear una cuenta
        </h1>
        <p className="text-white/60">
          Únete a ContaMind y automatiza tu contabilidad
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <div className="relative group">
            <UserPlus className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`} />
            <input
              type="text"
              placeholder="Nombre Completo"
              {...register('name')}
              className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 transition-all ${
                errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative group">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`} />
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              {...register('email')}
              className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 transition-all ${
                errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative group">
            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-white/40 group-focus-within:text-white'}`} />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 transition-all ${
                errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Registrarse'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-white/40">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="text-white hover:underline transition-all">
          Inicia sesión
        </Link>
      </div>
    </motion.div>
  );
}
