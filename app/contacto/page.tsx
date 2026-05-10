'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactoPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">Hablemos.</h1>
          <p className="text-[1.1rem] text-[var(--text-2)]">
            Tanto si tienes dudas sobre precios, features, o si necesitas un plan personalizado para tu volumen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-1)] mb-6">Envíanos un mensaje</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.85rem] font-medium text-[var(--text-2)] mb-1.5">Nombre</label>
                  <input type="text" className="w-full bg-[var(--off-white)] focus:bg-[var(--white)] border border-[var(--border-light)] hover:border-[var(--border)] rounded-[14px] py-3 px-4 text-[0.95rem] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all dark:bg-[#1a1a1a] dark:focus:bg-[#222222]" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-[0.85rem] font-medium text-[var(--text-2)] mb-1.5">Empresa</label>
                  <input type="text" className="w-full bg-[var(--off-white)] focus:bg-[var(--white)] border border-[var(--border-light)] hover:border-[var(--border)] rounded-[14px] py-3 px-4 text-[0.95rem] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all dark:bg-[#1a1a1a] dark:focus:bg-[#222222]" placeholder="Tu empresa" />
                </div>
              </div>
              <div>
                <label className="block text-[0.85rem] font-medium text-[var(--text-2)] mb-1.5">Email de trabajo</label>
                <input type="email" className="w-full bg-[var(--off-white)] focus:bg-[var(--white)] border border-[var(--border-light)] hover:border-[var(--border)] rounded-[14px] py-3 px-4 text-[0.95rem] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all dark:bg-[#1a1a1a] dark:focus:bg-[#222222]" placeholder="nombre@empresa.com" />
              </div>
              <div>
                <label className="block text-[0.85rem] font-medium text-[var(--text-2)] mb-1.5">¿En qué podemos ayudarte?</label>
                <textarea rows={4} className="w-full bg-[var(--off-white)] focus:bg-[var(--white)] border border-[var(--border-light)] hover:border-[var(--border)] rounded-[14px] py-3 px-4 text-[0.95rem] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all dark:bg-[#1a1a1a] dark:focus:bg-[#222222] resize-none" placeholder="Cuentanos..."></textarea>
              </div>
              <button type="button" className="bg-[var(--accent)] text-white px-6 py-2.5 rounded-[24px] text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] transition-all w-full md:w-auto">
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="bg-[var(--off-white)] p-8 rounded-[18px]">
            <h3 className="text-xl font-bold text-[var(--text-1)] mb-6">Información de Contacto</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="text-[var(--accent)] mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-[var(--text-1)]">Email</p>
                  <p className="text-[var(--text-3)] text-[0.95rem]">sales@contamind.ai</p>
                  <p className="text-[var(--text-3)] text-[0.95rem]">support@contamind.ai</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-[var(--accent)] mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-[var(--text-1)]">Ventas</p>
                  <p className="text-[var(--text-3)] text-[0.95rem]">+593 999 999 999</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-[var(--accent)] mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-[var(--text-1)]">Oficinas (Solo citas)</p>
                  <p className="text-[var(--text-3)] text-[0.95rem]">Edificio The Point, Piso 12<br/>Guayaquil, Ecuador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
