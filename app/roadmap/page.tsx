'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Check, Clock, Sparkles } from 'lucide-react';

export default function RoadmapPage() {
  const roadmap = [
    { 
      quarter: "Q1 2026", 
      status: "done", 
      title: "Lanzamiento Base",
      items: ["Asistente contable chat", "Facturación Electrónica SRI (Ecuador)", "Conciliación bancaria básica"] 
    },
    { 
      quarter: "Q2 2026", 
      status: "now", 
      title: "Automatización Predictiva",
      items: ["Sincronización en vivo con Bancos Principales", "Reportes NIFF automáticos", "Flujo predictivo a 90 días via IA"] 
    },
    { 
      quarter: "Q3 2026", 
      status: "next", 
      title: "Ecosistema Payments",
      items: ["Pasarela de pagos nativa", "Links de cobro inteligentes", "Generación de remesas Multi-banco"] 
    },
    { 
      quarter: "Q4 2026", 
      status: "next", 
      title: "Expansión Regional",
      items: ["Soporte para Facturación Colombia (DIAN)", "Soporte para Facturación Perú (SUNAT)", "Multimoneda avanzado corporativo"] 
    }
  ];

  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">El futuro de ContaMind.</h1>
          <p className="text-[1.1rem] text-[var(--text-2)]">
            Transparencia total. Lo que hemos hecho, en lo que estamos trabajando y lo que planificamos lanzar pronto.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative border-l-2 border-[var(--border-light)] pl-8 md:pl-12 space-y-16">
          {roadmap.map((phase, i) => (
            <div key={i} className="relative">
              <div className={`absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 rounded-full border-4 border-[var(--white)] ${
                phase.status === 'done' ? 'bg-[var(--green)]' : 
                phase.status === 'now' ? 'bg-[var(--accent)] animate-pulse' : 
                'bg-[var(--border-light)]'
              }`}></div>
              
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[0.8rem] font-bold uppercase tracking-wider ${
                  phase.status === 'done' ? 'text-[var(--green)]' : 
                  phase.status === 'now' ? 'text-[var(--accent)]' : 
                  'text-[var(--text-4)]'
                }`}>{phase.quarter}</span>
                {phase.status === 'now' && <span className="bg-[var(--accent-soft)] text-[var(--accent)] text-[0.65rem] px-2 py-0.5 rounded-full font-bold">En Progreso</span>}
              </div>
              
              <h3 className="text-2xl font-bold text-[var(--text-1)] mb-6">{phase.title}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {phase.items.map((item, j) => (
                  <div key={j} className="bg-[var(--off-white)] p-4 rounded-[12px] flex items-start gap-3 border border-[var(--border-light)]">
                    {phase.status === 'done' ? <Check className="text-[var(--green)] mt-0.5" size={16} /> : 
                     phase.status === 'now' ? <Clock className="text-[var(--accent)] mt-0.5" size={16} /> : 
                     <Sparkles className="text-[var(--text-4)] mt-0.5" size={16} />}
                    <span className="text-[0.95rem] text-[var(--text-2)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
