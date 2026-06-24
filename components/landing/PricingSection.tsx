'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function PricingSection() {
  const { user } = useAuth();
  const ctaHref = user ? '/dashboard' : '/auth/register';
  const ctaText = user ? 'Ir al Dashboard' : 'Comenzar gratis';

  const plans = [
    { name: "Starter", price: "29", desc: "Para emprendedores.", features: ["Facturación básica", "1 usuario", "Soporte email"] },
    { name: "Professional", price: "79", desc: "Para PyMEs en crecimiento.", features: ["Facturación ilimitada", "Conciliación IA", "5 usuarios", "Flujo predictivo", "Soporte 24/7"], popular: true },
    { name: "Enterprise", price: "199", desc: "Soluciones a medida.", features: ["Todo en Professional", "Usuarios ilimitados", "API Access", "Manager dedicado"] }
  ];

  return (
    <section id="precios" className="py-[100px] bg-[var(--off-white)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-[64px] max-w-2xl mx-auto">
          <h2 className="font-serif text-[clamp(2.1rem,3.5vw,2.9rem)] leading-[1.15] text-[var(--text-1)] mb-4">
            Planes simples.
          </h2>
          <p className="text-[var(--text-2)] text-[1.05rem]">
            Paga solo por lo que usas. Todos los planes incluyen 14 días gratis.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div key={i} className={`bg-[var(--white)] rounded-[18px] p-8 flex flex-col border ${p.popular ? 'border-[var(--accent)] shadow-[var(--shadow-default)] -translate-y-2' : 'border-[var(--border-light)] shadow-[var(--shadow-subtle)]'}`}>
              {p.popular && <div className="bg-[var(--accent-soft)] text-[var(--accent)] text-[0.72rem] font-semibold px-3 py-1 rounded-[20px] self-start mb-4">Recomendado</div>}
              <h3 className="font-sans font-semibold text-[1.2rem] text-[var(--text-1)] mb-2">{p.name}</h3>
              <div className="mb-4">
                <span className="text-[2.5rem] font-bold text-[var(--text-1)] tracking-tight">${p.price}</span>
                <span className="text-[var(--text-3)] text-[0.9rem]">/mes</span>
              </div>
              <p className="text-[var(--text-3)] text-[0.9rem] mb-8 h-10">{p.desc}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-[0.95rem] text-[var(--text-2)]">
                    <Check size={16} className="text-[var(--accent)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              
              <Link 
                href={ctaHref}
                className={`w-full block text-center py-3 rounded-[24px] text-[0.9rem] font-semibold transition-all ${
                  p.popular 
                  ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[0_4px_20px_rgba(0,113,227,0.2)]' 
                  : 'bg-[var(--off-white)] text-[var(--text-1)] hover:bg-[var(--border-light)]'
                }`}
              >
                {ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
