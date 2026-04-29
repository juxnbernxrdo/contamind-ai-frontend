'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    { title: "El impacto de la IA en la contabilidad diaria de las PyMEs", category: "Tecnología", date: "24 Abr 2026", desc: "Descubre cómo las conciliaciones automatizadas ahorran hasta 20 horas al mes a las empresas modernas." },
    { title: "Cómo prepararse para los nuevos formatos del SRI en 2026", category: "Impuestos", date: "12 May 2026", desc: "Un resumen de todas las normativas a considerar para el presente año fiscal, explicado paso a paso." },
    { title: "Métricas vs. Vanidad: Lo que realmente importa en tu SaaS", category: "Negocios", date: "02 Mar 2026", desc: "Dejar de mirar los likes y empezar a mirar el flujo de caja proyectado a 90 días." },
    { title: "5 errores comunes en la facturación electrónica", category: "Finanzas", date: "15 Feb 2026", desc: "Pequeños errores pueden desencadenar grandes multas. Te contamos cómo prevenirlos usando ContaMind." },
  ];

  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-4">Blog y Recursos</h1>
          <p className="text-[1.1rem] text-[var(--text-2)] max-w-2xl">
            La última información sobre finanzas, contabilidad e inteligencia artificial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <Link href="#" key={idx} className="group bg-[var(--white)] border border-[var(--border-light)] p-8 rounded-[18px] hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
              <div className="flex items-center gap-3 mb-4 text-[0.8rem]">
                <span className="text-[var(--accent)] font-semibold bg-[var(--accent-soft)] px-2 py-1 rounded-md">{post.category}</span>
                <span className="text-[var(--text-4)]">{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-1)] mb-3 group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
              <p className="text-[0.95rem] text-[var(--text-3)] mb-6 leading-[1.6]">
                {post.desc}
              </p>
              <div className="text-[var(--accent)] font-medium text-[0.9rem] flex items-center gap-2">
                Leer artículo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
