'use client';

import { motion } from 'motion/react';
import { Blocks, CheckCircle2, BarChart3, Globe, Shield, MessageSquareHeart } from 'lucide-react';
import { staggerContainer, fadeIn } from './animations';

export function FeaturesSection() {
  const features = [
    { icon: <Blocks className="text-[var(--accent)]" size={20} />, title: "Módulo Financiero NIIF", desc: "Plan de cuentas, cierres, asientos automáticos y estados financieros." },
    { icon: <CheckCircle2 className="text-[var(--accent)]" size={20} />, title: "Facturación SRI", desc: "Autoriza tus facturas al instante y descarga comprobantes recibidos." },
    { icon: <BarChart3 className="text-[var(--accent)]" size={20} />, title: "Cuentas por Cobrar y Pagar", desc: "Gestiona cartera, facturas de proveedores y órdenes de compra." },
    { icon: <Globe className="text-[var(--accent)]" size={20} />, title: "Nómina e IESS", desc: "Corre roles de pago, descuentos IESS y cálculos de ley." },
    { icon: <Shield className="text-[var(--accent)]" size={20} />, title: "Cumplimiento Tributario", desc: "Generación de Formulario 104, 103, y creación de Anexos (ATS)." },
    { icon: <MessageSquareHeart className="text-[var(--accent)]" size={20} />, title: "IA Financiera Contable", desc: "Asientos en lenguaje natural, y análisis M/M de márgenes y solvencia." }
  ];

  return (
    <section id="producto" className="py-[80px] md:py-[120px] bg-[var(--off-white)]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mb-[64px] max-w-2xl mx-auto text-center">
          <motion.h2 variants={fadeIn} className="font-serif text-[clamp(2.1rem,3.5vw,2.9rem)] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-4">
            Tu ERP. Autónomo.
          </motion.h2>
          <motion.p variants={fadeIn} className="text-[var(--text-2)] text-[1.05rem] leading-[1.65]">
            Todo integrado, desde enviar y recibir facturas al SRI, hasta el análisis del estado de resultados. Cero apps externas.
          </motion.p>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeIn} className="bg-[var(--white)] p-[28px] rounded-[18px] border border-[var(--border-light)] shadow-subtle hover:-translate-y-[2px] transition-transform duration-300">
              <div className="h-12 w-12 flex items-center justify-center rounded-[12px] bg-[var(--off-white)] mb-6">
                {f.icon}
              </div>
              <h3 className="font-sans font-semibold text-[0.98rem] text-[var(--text-1)] mb-2 tracking-tight">{f.title}</h3>
              <p className="text-[0.95rem] text-[var(--text-3)] leading-[1.65]">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
