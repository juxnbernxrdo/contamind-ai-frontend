'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--off-white)] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-[6rem] font-serif text-[var(--accent)] leading-none mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-4">Página no encontrada</h2>
        <p className="text-[var(--text-3)] mb-8 max-w-md mx-auto">
          La ruta a la que intentas acceder no existe o fue movida.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-full hover:bg-[var(--accent-hover)] transition-all"
        >
          <Home size={18} />
          Volver al Inicio
        </Link>
      </motion.div>
    </div>
  );
}
