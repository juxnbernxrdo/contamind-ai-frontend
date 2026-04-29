'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';

export default function LegalPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] text-[var(--text-1)] mb-4">Términos y Privacidad</h1>
        <p className="text-[var(--text-3)] mb-12">Última actualización: Abril 2026</p>

        <div className="space-y-12 text-[0.95rem] text-[var(--text-2)] leading-[1.7]">
          <section>
            <h2 className="text-xl font-bold text-[var(--text-1)] mb-4">1. Recopilación de Datos</h2>
            <p className="mb-4">
              En ContaMind nos tomamos en serio su privacidad. Solo recopilamos los datos estrictamente necesarios para operar la plataforma y automatizar su contabilidad. Esto incluye información tributaria, financiera y de identidad, cifrada en todo momento.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-[var(--text-1)] mb-4">2. Uso de Inteligencia Artificial</h2>
            <p className="mb-4">
              Sus datos no son utilizados para entrenar modelos base públicos. La información procesada por nuestros asistentes de IA permanece dentro de un entorno aislado (tenant isolation) y está sujeta a los acuerdos de confidencialidad estándar corporativos.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-[var(--text-1)] mb-4">3. Servicios de Terceros</h2>
            <p className="mb-4">
              Para brindar funciones como la sincronización bancaria, requerimos conectar con APIs de terceros. Ud. autoriza explícitamente estas conexiones al ingresar sus credenciales en nuestros flujos OAuth. Su información viaja encriptada y no almacenamos credenciales directas (solo tokens de acceso revocables).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-1)] mb-4">4. Cancelación</h2>
            <p className="mb-4">
              Puede exportar todos sus reportes y comprobantes en formato XML o CSV en cualquier momento. Si decide cancelar su suscripción, sus datos permanecerán disponibles en modo lectura por 30 días antes de su eliminación permanente de nuestros servidores para cumplir con la normativa legal de borrado de datos.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
