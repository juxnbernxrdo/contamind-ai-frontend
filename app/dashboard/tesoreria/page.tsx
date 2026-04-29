'use client';

import React from 'react';
import { Wallet, Search, RefreshCw } from 'lucide-react';

export default function Tesoreria() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.9rem,3.5vw,2.5rem)] font-serif text-[var(--text-1)] leading-tight tracking-tight">Tesorería</h1>
          <p className="text-[0.97rem] text-[var(--text-3)] mt-1">Control de bancos, conciliaciones bancarias y flujo de caja.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--white)] border border-[var(--border-light)] rounded-full text-[0.9rem] font-medium text-[var(--text-2)] hover:bg-[var(--off-white)] shadow-sm transition-all">
            <RefreshCw size={16} /> Sincronizar Bancos
          </button>
        </div>
      </header>
      
      <div className="bg-[var(--white)] rounded-[18px] border border-[var(--border-light)] p-8 shadow-[0_1px_4px_rgba(0,0,0,0.02)] min-h-[400px] flex items-center justify-center flex-col text-center">
        <div className="w-16 h-16 bg-[var(--amber)]/10 text-[var(--amber)] rounded-[16px] flex items-center justify-center mb-4">
          <Wallet size={32} />
        </div>
        <h3 className="text-[1.2rem] font-semibold text-[var(--text-1)] mb-2">Módulo de Tesorería (Próximamente)</h3>
        <p className="text-[0.95rem] text-[var(--text-3)] max-w-md">
          Sincroniza cuentas del Banco Pichincha, Guayaquil, Pacífico, y más. Realiza conciliaciones con un clic respaldado por IA.
        </p>
      </div>
    </div>
  );
}
