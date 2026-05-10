'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { BookOpen, FileText, PlayCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function DocumentacionPage() {
  const sections = [
    { icon: <BookOpen className="text-[var(--accent)]" />, title: "Guía de Inicio Rápido", desc: "Configura tu cuenta y conecta tus bancos en 5 minutos." },
    { icon: <FileText className="text-[var(--accent)]" />, title: "Manual de Facturación", desc: "Aprende a emitir facturas, notas de crédito y retenciones." },
    { icon: <PlayCircle className="text-[var(--accent)]" />, title: "Tutoriales en Video", desc: "Una serie de videos cubriendo casos de uso completos." },
    { icon: <HelpCircle className="text-[var(--accent)]" />, title: "Preguntas Frecuentes", desc: "Respuestas a dudas comunes de nuestros usuarios." },
  ];

  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">Centro de Ayuda</h1>
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Buscar guías, tutoriales, errores..." 
              className="w-full pl-6 pr-12 py-4 rounded-[14px] bg-[var(--off-white)] focus:bg-[var(--white)] border border-[var(--border-light)] hover:border-[var(--border)] text-[var(--text-1)] shadow-sm focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all dark:bg-[#1a1a1a] dark:focus:bg-[#222222]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-3)]">
              🔍
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sections.map((sec, i) => (
            <Link href="#" key={i} className="bg-[var(--off-white)] p-6 rounded-[18px] border border-transparent hover:border-[var(--border-light)] hover:bg-[var(--white)] hover:shadow-sm transition-all group">
              <div className="bg-[var(--accent-soft)] w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {sec.icon}
              </div>
              <h3 className="font-bold text-[var(--text-1)] mb-2">{sec.title}</h3>
              <p className="text-[0.85rem] text-[var(--text-3)] leading-[1.5]">{sec.desc}</p>
            </Link>
          ))}
        </div>

        <div className="bg-[var(--accent-soft)] rounded-[18px] p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-[var(--text-1)] mb-3">¿No encuentras lo que buscas?</h2>
          <p className="text-[var(--text-2)] mb-6 text-[0.95rem]">Nuestro equipo de soporte técnico y contable está disponible 24/7 para asistirte.</p>
          <Link href="/contacto" className="bg-[var(--accent)] text-white px-[24px] py-[10px] rounded-[24px] text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] transition-all">
            Contactar Soporte
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
