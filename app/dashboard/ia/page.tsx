'use client';

import React from 'react';
import { Sparkles, Send, BrainCircuit } from 'lucide-react';

export default function ContaMindIA() {
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-[clamp(1.9rem,3.5vw,2.5rem)] font-serif text-[var(--accent)] leading-tight tracking-tight flex items-center gap-2">
            ContaMind IA <Sparkles size={24} className="text-[var(--accent)]" />
          </h1>
          <p className="text-[0.97rem] text-[var(--text-3)] mt-1">Tu asistente financiero autónomo. Creado para analizar y automatizar tu negocio.</p>
        </div>
      </header>
      
      <div className="flex-1 bg-[var(--white)] rounded-[18px] border border-[var(--border-light)] shadow-[0_1px_4px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        
        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
          
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 border border-[var(--accent)]/20">
              <BrainCircuit className="text-[var(--accent)]" size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-[0.8rem] font-bold text-[var(--text-3)] mb-1">ContaMind</h4>
              <div className="text-[0.95rem] text-[var(--text-1)] bg-[var(--off-white)] p-4 rounded-[12px] rounded-tl-none inline-block max-w-[85%] border border-[var(--border-light)] shadow-sm">
                <p>Hola Juan, he revisado tus cuentas y noté algunas cosas importantes hoy:</p>
                <ul className="mt-3 space-y-2 list-disc pl-4 text-[0.9rem] text-[var(--text-2)]">
                  <li>Tienes 3 reportes tributarios pendientes que cerrarán esta semana.</li>
                  <li>Recomiendo enviar un recordatorio de pago a <strong>Globex Inc</strong>.</li>
                  <li>Tu Flujo de caja luce positivo (+12.4%) en comparación a los últimos 30 días.</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-[var(--text-1)] text-white flex items-center justify-center shrink-0 font-bold text-[0.7rem]">
              JO
            </div>
            <div className="flex-1 flex flex-col items-end">
              <h4 className="text-[0.8rem] font-bold text-[var(--text-3)] mb-1 mr-1">Tú</h4>
              <div className="text-[0.95rem] text-white bg-[var(--accent)] p-3 px-4 rounded-[12px] rounded-tr-none inline-block max-w-[85%] shadow-sm">
                Genera el flujo de caja proyectado de los próximos 3 meses.
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Chat Input */}
        <div className="p-4 bg-[var(--off-white)] border-t border-[var(--border-light)] shrink-0">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <input 
              type="text" 
              placeholder="Hazle una consulta a ContaMind IA..."
              className="flex-1 bg-[var(--white)] border border-[var(--border-light)] rounded-full px-5 py-3 text-[0.95rem] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-sm"
            />
            <button className="bg-[var(--accent)] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all shadow-[0_4px_12px_rgba(0,113,227,0.2)] shrink-0">
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
          <p className="text-center text-[0.65rem] text-[var(--text-4)] mt-2 font-medium">ContaMind es una IA, puede equivocarse. Considera verificar la información importante.</p>
        </div>
        
      </div>
    </div>
  );
}
