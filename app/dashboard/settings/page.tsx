'use client';

import React from 'react';
import { Settings, Building, Users, Key, MonitorSmartphone } from 'lucide-react';

export default function Configuracion() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.9rem,3.5vw,2.5rem)] font-serif text-[var(--text-1)] leading-tight tracking-tight">Configuración</h1>
          <p className="text-[0.97rem] text-[var(--text-3)] mt-1">Ajustes de empresa, roles, fiscalidad y preferencias.</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="md:col-span-1 space-y-2">
          {[
            { label: 'Perfil de Empresa', icon: Building, active: true },
            { label: 'Usuarios y Roles', icon: Users, active: false },
            { label: 'Firma y SRI', icon: Key, active: false },
            { label: 'Preferencias', icon: MonitorSmartphone, active: false },
          ].map((tab, i) => (
            <button key={i} className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[0.9rem] font-medium transition-all text-left
              ${tab.active 
                ? 'bg-[var(--white)] border border-[var(--border-light)] shadow-sm text-[var(--accent)]' 
                : 'text-[var(--text-2)] hover:bg-[var(--white)]/50 border border-transparent'}
            `}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-3 bg-[var(--white)] rounded-[18px] border border-[var(--border-light)] p-6 shadow-sm min-h-[400px]">
          <h3 className="text-[1.1rem] font-semibold text-[var(--text-1)] mb-6">Detalles de Empresa</h3>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[0.8rem] font-bold text-[var(--text-3)] uppercase tracking-wider">Razón Social</label>
                <input type="text" defaultValue="ContaMind S.A." className="w-full bg-[var(--off-white)] border border-[var(--border-light)] rounded-[8px] px-3 py-2 text-[0.95rem] text-[var(--text-1)] focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.8rem] font-bold text-[var(--text-3)] uppercase tracking-wider">RUC</label>
                <input type="text" defaultValue="1792XXXXXX001" className="w-full bg-[var(--off-white)] border border-[var(--border-light)] rounded-[8px] px-3 py-2 text-[0.95rem] text-[var(--text-1)] focus:outline-none" disabled />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[0.8rem] font-bold text-[var(--text-3)] uppercase tracking-wider">Régimen</label>
              <select className="w-full bg-[var(--off-white)] border border-[var(--border-light)] rounded-[8px] px-3 py-2 text-[0.95rem] text-[var(--text-1)] focus:outline-none">
                <option>General</option>
                <option>RIMPE - Emprendedor</option>
                <option>RIMPE - Negocio Popular</option>
              </select>
            </div>
            
            <div className="pt-4 mt-6 border-t border-[var(--border-light)] flex justify-end">
              <button className="bg-[var(--accent)] text-white px-6 py-2 rounded-full text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] transition-all shadow-sm">
                Guardar Cambios
              </button>
            </div>
          </div>
          
        </div>
        
      </div>
      
    </div>
  );
}
