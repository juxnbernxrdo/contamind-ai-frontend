'use client';

import { useState, Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

function MFAPageContent() {
  const { verify2FA } = useAuth();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      await verify2FA(token, userId);
    } catch (error) {
      // Error handled by context toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="p-4 bg-green-500/20 rounded-2xl">
            <ShieldCheck className="w-12 h-12 text-green-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white font-instrument">
              Verificación en dos pasos
            </h1>
            <p className="text-white/60 text-sm">
              Ingresa el código de 6 dígitos de tu aplicación autenticadora
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            required
            autoFocus
            className="w-full text-center tracking-[0.5em] text-3xl py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-mono"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
          />

          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className="w-full py-4 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verificar y Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/30 uppercase tracking-widest">
          Secure Session Verification
        </p>
      </motion.div>
    </main>
  );
}

export default function MFAPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-10 h-10 text-white animate-spin" /></div>}>
      <MFAPageContent />
    </Suspense>
  );
}
