'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Check, Info, Bot } from 'lucide-react';
import { motion } from 'motion/react';

export default function PreciosPage() {
  const plans = [
    { name: "Starter", price: "29", desc: "Para emprendedores con cuentas base.", features: ["Facturas SRI ilimitadas", "Plan de cuentas estándar", "1 Usuario / 1 Empresa", "Descarga de doc. recibidos"] },
    { name: "Professional", price: "79", desc: "La suite ERP completa para PyMEs.", features: ["Agente IA NIIF ilimitado", "Nómina, Roles e IESS", "Gestión de Inventario", "Anexos Transaccionales (ATS)", "5 Usuarios"], popular: true },
    { name: "Enterprise", price: "199", desc: "Para firmas contables y holdings.", features: ["Multitenancy ilimitado", "Control de accesos granulares", "API Access total", "Manager asociado y soporte", "Roles personalizados"] }
  ];

  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">Precios simples y<br/>transparentes.</h1>
        <p className="text-[1.1rem] text-[var(--text-2)] max-w-2xl mx-auto mb-16">
          Comienza tus 14 días gratis hoy. Cero compromisos, cancela cuando quieras.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left mb-16">
          {plans.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-[var(--white)] rounded-[18px] p-8 flex flex-col border ${p.popular ? 'border-[var(--accent)] shadow-[0_8px_30px_rgba(0,113,227,0.12)] -translate-y-2' : 'border-[var(--border-light)] shadow-sm'}`}
            >
              {p.popular && <div className="bg-[var(--accent-soft)] text-[var(--accent)] text-[0.72rem] font-semibold px-3 py-1 rounded-[20px] self-start mb-4">Recomendado</div>}
              <h3 className="font-sans font-semibold text-[1.2rem] text-[var(--text-1)] mb-2">{p.name}</h3>
              <div className="mb-4 flex items-baseline">
                <span className="text-[2.5rem] font-bold text-[var(--text-1)] tracking-tight">${p.price}</span>
                <span className="text-[var(--text-3)] text-[0.9rem] ml-1">/mes</span>
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
              
              <button className={`w-full py-3 rounded-[24px] text-[0.9rem] font-medium transition-all ${p.popular ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]' : 'bg-[var(--off-white)] text-[var(--text-1)] hover:bg-[var(--border-light)]'}`}>
                Empieza tu prueba gratis
              </button>
            </motion.div>
          ))}
        </div>

        {/* ROI / Value Prop Section */}
        <div className="bg-[var(--off-white)] rounded-[24px] max-w-5xl mx-auto p-8 md:p-12 text-left mb-24 border border-[var(--border-light)] flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="text-[var(--accent)]" size={24} />
              <div className="font-bold text-[var(--text-1)] text-lg">¿Por qué ContaMind?</div>
            </div>
            <p className="text-[var(--text-2)] leading-relaxed mb-6 text-[0.95rem]">
              El costo promedio de un asistente contable jr en Ecuador es de $500/mes. Un ERP tradicional te cobra licenciamiento, servidor y soporte por hora. ContaMind te brinda el poder de un equipo financiero entero impulsado por IA, 24/7 y sin errores humanos, por una fracción del costo.
            </p>
            <div className="flex gap-4">
              <div className="bg-[var(--white)] p-3 px-4 rounded-lg border border-[var(--border-light)] shadow-sm">
                <div className="text-[var(--text-4)] text-[0.7rem] font-bold uppercase tracking-wide mb-1">Costo Tradicional</div>
                <div className="text-[var(--text-3)] line-through font-mono">~$8,500/año</div>
              </div>
              <div className="bg-[var(--accent-soft)] p-3 px-4 rounded-lg border border-[var(--accent)] shadow-sm">
                <div className="text-[var(--accent)] text-[0.7rem] font-bold uppercase tracking-wide mb-1">Costo ContaMind</div>
                <div className="text-[var(--text-1)] font-bold font-mono">Desde $348/año</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <div className="flex items-start gap-3">
              <Info className="text-[var(--text-4)] shrink-0 mt-0.5" size={16} />
              <p className="text-[0.85rem] text-[var(--text-3)]">Los planes Enterprise incluyen horas de asesoría contable humana para configuraciones complejas y migración.</p>
            </div>
            <div className="flex items-start gap-3">
              <Info className="text-[var(--text-4)] shrink-0 mt-0.5" size={16} />
              <p className="text-[0.85rem] text-[var(--text-3)]">No hay límites ocultos en facturación electrónica. Todos los planes soportan el volumen que necesites.</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-left">
          <h3 className="text-2xl font-serif text-[var(--text-1)] mb-8 text-center">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            <div className="bg-[var(--white)] p-6 rounded-[16px] border border-[var(--border-light)] shadow-sm">
              <h4 className="font-bold text-[var(--text-1)] mb-2">¿Puedo cambiar de plan más adelante?</h4>
              <p className="text-[var(--text-3)] text-[0.95rem]">Sí, puedes mejorar o degradar tu plan en cualquier momento desde los ajustes de tu cuenta.</p>
            </div>
            <div className="bg-[var(--white)] p-6 rounded-[16px] border border-[var(--border-light)] shadow-sm">
              <h4 className="font-bold text-[var(--text-1)] mb-2">¿Necesito tarjeta de crédito para la prueba?</h4>
              <p className="text-[var(--text-3)] text-[0.95rem]">No, empieza a probar todas las funciones inmediatamente sin añadir un método de pago. Tendrás 14 días con acceso completo.</p>
            </div>
            <div className="bg-[var(--white)] p-6 rounded-[16px] border border-[var(--border-light)] shadow-sm">
              <h4 className="font-bold text-[var(--text-1)] mb-2">¿Ofrecen descuentos para planes anuales?</h4>
              <p className="text-[var(--text-3)] text-[0.95rem]">Sí, obtienes 2 meses gratis si decides pagar anualmente en cualquiera de nuestros planes de pago.</p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
