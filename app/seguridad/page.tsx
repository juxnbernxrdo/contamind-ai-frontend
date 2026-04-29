'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { ShieldCheck, Lock, Database, Server } from 'lucide-react';

export default function SeguridadPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="mx-auto w-16 h-16 bg-[var(--green-soft)] rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="text-[var(--green)]" size={32} />
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">Seguridad a nivel<br/>bancario.</h1>
          <p className="text-[1.1rem] text-[var(--text-2)]">
            Tu información financiera es crítica. Protegemos tus datos con los mismos estándares de encriptación que utilizan las principales instituciones financieras del mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          <div className="bg-[var(--off-white)] p-8 rounded-[18px]">
            <Lock className="text-[var(--accent)] mb-4" size={28} />
            <h3 className="font-bold text-[var(--text-1)] text-lg mb-2">Encriptación de extremo a extremo</h3>
            <p className="text-[var(--text-3)] text-[0.95rem] leading-[1.6]">
              Todos los datos están encriptados en tránsito (TLS 1.2 o superior) y en reposo (AES-256). Solo tú y tus usuarios autorizados pueden ver la información.
            </p>
          </div>
          <div className="bg-[var(--off-white)] p-8 rounded-[18px]">
            <Database className="text-[var(--accent)] mb-4" size={28} />
            <h3 className="font-bold text-[var(--text-1)] text-lg mb-2">Respaldos redundantes</h3>
            <p className="text-[var(--text-3)] text-[0.95rem] leading-[1.6]">
              Realizamos respaldos automáticos continuos de tu base de datos en múltiples zonas geográficas para asegurar disponibilidad 99.99%.
            </p>
          </div>
          <div className="bg-[var(--off-white)] p-8 rounded-[18px]">
            <Server className="text-[var(--accent)] mb-4" size={28} />
            <h3 className="font-bold text-[var(--text-1)] text-lg mb-2">Infraestructura Segura</h3>
            <p className="text-[var(--text-3)] text-[0.95rem] leading-[1.6]">
              Alojamientos en la nube de Google con certificaciones ISO 27001, SOC 2 y PCI-DSS. Monitoreo constante contra intrusiones.
            </p>
          </div>
          <div className="bg-[var(--off-white)] p-8 rounded-[18px]">
            <ShieldCheck className="text-[var(--accent)] mb-4" size={28} />
            <h3 className="font-bold text-[var(--text-1)] text-lg mb-2">Auditorías rigurosas</h3>
            <p className="text-[var(--text-3)] text-[0.95rem] leading-[1.6]">
              Realizamos penetration testing trimestral a cargo de empresas externas independientes para encontrar y corregir vulnerabilidades.
            </p>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
