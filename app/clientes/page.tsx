'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';

export default function CasosExitoPage() {
  const casos = [
    { empresa: "E-commerce Local S.A.", author: "Mariana R.", rol: "CFO", quote: "Antes pasábamos 3 días al mes conciliando transferencias de 4 bancos distintos. Ahora entramos el día 1, la IA ya empató el 99% de los pagos. Es magia.", logo: "E", color: "bg-[#FCC02E]" },
    { empresa: "Agencia Creativa XYZ", author: "Daniel T.", rol: "Founder", quote: "Poder decirle al chat 'dime cuánto IVA me toca pagar en abril basado en lo facturado' y que me dé el número exacto, cambió mi vida.", logo: "X", color: "bg-[#ED6158]" },
    { empresa: "TechStart", author: "Carolina C.", rol: "CEO", quote: "Cambiamos a nuestro software legacy por ContaMind. La interfaz es tan limpia y los reportes tan claros que ahora todos los socios revisan las finanzas sin pedirme que se los explique.", logo: "T", color: "bg-[#5FC038]" },
  ];

  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">Equipos que confían en nosotros.</h1>
          <p className="text-[1.1rem] text-[var(--text-2)]">
            Conoce cómo otras PyMEs están escalando sus operaciones financieras utilizando la inteligencia artificial de ContaMind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {casos.map((caso, i) => (
            <div key={i} className="bg-[var(--white)] p-8 rounded-[18px] border border-[var(--border-light)] shadow-sm flex flex-col">
              <div className="text-[3rem] font-serif text-[var(--border-light)] leading-none mb-4">&quot;</div>
              <p className="text-[0.95rem] text-[var(--text-2)] leading-[1.6] mb-8 grow italic font-medium">
                {caso.quote}
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-light)]">
                <div className={`w-10 h-10 rounded-full ${caso.color} flex items-center justify-center text-white font-bold text-lg shadow-sm font-serif`}>
                  {caso.logo}
                </div>
                <div>
                  <p className="font-bold text-[var(--text-1)] text-[0.9rem] flex items-center gap-1.5">{caso.empresa} {caso.logo === 'E' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" title="Verificado"></span>}</p>
                  <p className="text-[0.75rem] text-[var(--text-3)]">{caso.author}, {caso.rol}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
