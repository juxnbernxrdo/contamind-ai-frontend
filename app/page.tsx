'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, CheckCircle2, BarChart3, Globe, Blocks, MessageSquareHeart, 
  BrainCircuit, Lock, Sidebar, Share, Plus, Check, Shield
} from 'lucide-react';
import { MarketingLayout } from '@/components/MarketingLayout';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function ContaMindLanding() {
  return (
    <MarketingLayout>
      <HeroSection />
      <FeaturesSection />
      <AppMockupSection />
      <PricingSection />
    </MarketingLayout>
  );
}



function HeroSection() {
  return (
    <section className="px-6 py-[80px] md:py-[120px] max-w-7xl mx-auto flex flex-col items-center text-center">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center max-w-3xl">
        <motion.div variants={fadeIn} className="bg-[var(--accent-soft)] text-[var(--accent)] px-[12px] py-[4px] rounded-[20px] text-[0.72rem] font-semibold tracking-wide mb-8 inline-flex items-center gap-2">
          <span className="flex h-[6px] w-[6px] rounded-full bg-[var(--accent)]"></span>
          Nuevo: Facturación IA
        </motion.div>
        
        <motion.h1 variants={fadeIn} className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.08] tracking-[-0.02em] text-[var(--text-1)] mb-6">
          Contabilidad que piensa <em className="italic font-serif pr-1">contigo</em>.
        </motion.h1>
        
        <motion.p variants={fadeIn} className="text-[1.05rem] md:text-[1.2rem] text-[var(--text-2)] mb-10 leading-[1.65] max-w-lg md:max-w-2xl mx-auto">
          Las PyMEs pierden horas valiosas en contabilidad manual. ContaMind automatiza tu facturación y conciliación bancaria con inteligencia artificial.
        </motion.p>
        
        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4">
          <button className="bg-[var(--accent)] text-white px-[28px] py-[12px] rounded-[24px] text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-[0_4px_20px_rgba(0,113,227,0.2)] hover:shadow-[0_8px_25px_rgba(0,113,227,0.3)] hover:-translate-y-[1px] whitespace-nowrap">
            Empieza gratis
          </button>
          <button className="px-[28px] py-[12px] rounded-[24px] text-[0.9rem] font-medium text-[var(--text-2)] border border-[var(--border-light)] hover:bg-[var(--off-white)] transition-colors duration-200 whitespace-nowrap">
            Ver demo
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
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
            <motion.div key={i} variants={fadeIn} className="bg-[var(--white)] p-[28px] rounded-[18px] border border-[var(--border-light)] shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:-translate-y-[2px] transition-transform duration-300">
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

function AppMockupSection() {
  const [activeTab, setActiveTab] = useState('invoicing');

  const tabs = [
    { id: 'invoicing', label: 'Facturación', icon: <Plus size={14} /> },
    { id: 'reports', label: 'Reportes', icon: <Blocks size={14} /> }
  ];

  return (
    <section id="soluciones" className="py-[80px] md:py-[120px] bg-[var(--white)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <h2 className="font-serif text-[clamp(2.2rem,3.5vw,2.8rem)] leading-[1.1] text-[var(--text-1)] mb-6">
              Toda tu gestión,<br/>en una sola suite.
            </h2>
            <p className="text-[1.05rem] text-[var(--text-2)] mb-10 leading-[1.65]">
              Desde el flujo de caja hasta la emisión de facturas electrónicas. ContaMind es el cerebro financiero que tu PyME necesita.
            </p>
            
            <div className="flex flex-col gap-2 p-1 bg-[var(--off-white)] rounded-[14px] border border-[var(--border-light)] mb-8 relative">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-[10px] text-[0.9rem] font-medium transition-colors duration-200 ${
                    activeTab === tab.id 
                    ? 'text-[var(--accent)]' 
                    : 'text-[var(--text-3)] hover:text-[var(--text-1)]'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--white)] rounded-[10px] border border-[var(--border-light)] shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    {tab.icon}
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            <ul className="space-y-4">
              {['Plan de cuentas NIIF y estados financieros.', 'Generadores de roles de pago e IESS.', 'Descargas automáticas del SRI.', 'Vector Search RAG para tus dudas.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.93rem] text-[var(--text-2)]">
                  <CheckCircle2 size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:w-2/3 w-full">
            <MockupWindow title={`app.contamind.ai/${activeTab}`} delay={0.1}>
              {activeTab === 'invoicing' && <InvoicingMockup />}
              {activeTab === 'reports' && <ReportsMockup />}
            </MockupWindow>
          </div>
        </div>
      </div>
    </section>
  );
}

function InvoicingMockup() {
  return (
    <div className="p-3 sm:p-6 bg-[var(--white)] h-full flex flex-col gap-4 sm:gap-6 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h4 className="text-[0.95rem] sm:text-[1.1rem] text-[var(--text-1)] font-bold">Facturas Recientes</h4>
        <div className="flex gap-2">
          <button className="bg-[var(--accent)] text-white p-2 rounded-full shadow-lg hover:bg-[var(--accent-hover)] transition-colors">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-[var(--border-light)] rounded-[12px] border border-[var(--border-light)]">
        {[
          { client: 'Acme Corp', id: 'FAC-001', date: '24 Abr', status: 'Pagada', val: '$1,200.00' },
          { client: 'Globex Inc', id: 'FAC-002', date: '25 Abr', status: 'Pendiente', val: '$3,450.50' },
          { client: 'Stark Ind', id: 'FAC-003', date: '26 Abr', status: 'Pagada', val: '$890.00' },
          { client: 'Wayne Ent', id: 'FAC-004', date: '27 Abr', status: 'Vencida', val: '$2,100.00' },
        ].map((f, i) => (
          <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-[var(--white)] hover:bg-[var(--off-white)] transition-colors cursor-pointer group shrink-0">
            <div className="flex gap-2 sm:gap-4 items-center overflow-hidden">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[0.65rem] sm:text-[0.8rem] font-bold shrink-0 ${
                f.status === 'Pagada' ? 'bg-[var(--green-soft)] text-[var(--green)]' : 
                f.status === 'Vencida' ? 'bg-[var(--red)]/10 text-[var(--red)]' : 
                'bg-[var(--accent-soft)] text-[var(--accent)]'
              }`}>
                {f.client[0]}
              </div>
              <div className="min-w-0">
                <p className="text-[0.75rem] sm:text-[0.85rem] font-bold text-[var(--text-1)] group-hover:text-[var(--accent)] transition-colors truncate">{f.client}</p>
                <p className="text-[0.6rem] sm:text-[0.7rem] text-[var(--text-3)] truncate">{f.id} • {f.date}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <p className="text-[0.75rem] sm:text-[0.85rem] font-bold text-[var(--text-1)]">{f.val}</p>
              <p className={`text-[0.6rem] sm:text-[0.65rem] font-bold ${
                f.status === 'Pagada' ? 'text-[var(--green)]' : 
                f.status === 'Vencida' ? 'text-[var(--red)]' : 
                'text-[var(--amber)]'
              }`}>{f.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto hidden xs:block p-3 sm:p-4 rounded-[12px] bg-[var(--accent-soft)] border border-[var(--accent)]/10 shrink-0">
        <p className="text-[0.7rem] sm:text-[0.8rem] text-[var(--accent)] font-semibold mb-1 flex items-center gap-2">
          <BrainCircuit size={13} /> <span className="truncate">Sugerencia Automática</span>
        </p>
        <p className="text-[0.65rem] sm:text-[0.75rem] text-[var(--text-2)] leading-[1.5]">
          Enviar recordatorio a <span className="font-semibold">Globex Inc</span> por factura vencida.
        </p>
      </div>
    </div>
  );
}


function ReportsMockup() {
  return (
    <div className="p-4 sm:p-6 bg-[var(--off-white)] h-full overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <h4 className="text-[1.1rem] text-[var(--text-1)] font-bold mb-1">Centro de Reportes</h4>
        <p className="text-[0.75rem] text-[var(--text-3)]">Analiza cada centavo de tu operación.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Pérdidas y Ganancias', icon: <BarChart3 size={18} /> },
          { label: 'Balance General', icon: <Blocks size={18} /> },
          { label: 'IVA Ventas', icon: <Globe size={18} /> },
          { label: 'Gastos por Categoría', icon: <Plus size={18} /> }
        ].map((rpt, i) => (
          <div key={i} className="bg-[var(--white)] p-4 rounded-[12px] border border-[var(--border-light)] shadow-sm hover:border-[var(--accent)]/30 transition-all cursor-pointer group">
            <div className="text-[var(--accent)] mb-3 p-2 bg-[var(--accent-soft)] w-fit rounded-[8px] group-hover:scale-110 transition-transform">{rpt.icon}</div>
            <h5 className="text-[0.8rem] font-bold text-[var(--text-1)] leading-tight">{rpt.label}</h5>
          </div>
        ))}
      </div>

      <div className="bg-[var(--white)] rounded-[12px] border border-[var(--border-light)] p-4 shadow-sm">
        <h4 className="text-[0.75rem] text-[var(--text-3)] font-bold uppercase mb-4 tracking-wider">Top Clientes</h4>
        <div className="space-y-4">
          {[
            { name: 'Acme Corp', share: 45 },
            { name: 'Globex', share: 25 },
            { name: 'Soylent', share: 20 },
            { name: 'Initech', share: 10 }
          ].map((c, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-[0.7rem] font-bold">
                <span className="text-[var(--text-2)]">{c.name}</span>
                <span className="text-[var(--text-1)]">{c.share}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--off-white)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${c.share}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-[var(--accent)]"
                ></motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockupWindow({ children, title, delay = 0 }: { children: React.ReactNode, title: string, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full rounded-t-[10px] rounded-b-none overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-[1px] bg-linear-to-b from-[var(--border-light)] to-transparent aspect-[16/11] sm:aspect-[16/9] min-h-[320px] xs:min-h-[380px]"
    >
      <div className="w-full h-full bg-[var(--white)] rounded-t-[7px] flex flex-col overflow-hidden">
        <div className="h-[44px] flex items-center px-4 bg-gradient-to-b from-[var(--off-white)] to-[var(--border-light)] border-b border-black/5 relative shrink-0">
          <div className="flex gap-2 items-center absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ED6158] border border-black/5" />
            <div className="w-3 h-3 rounded-full bg-[#FCC02E] border border-black/5" />
            <div className="w-3 h-3 rounded-full bg-[#5FC038] border border-black/5" />
          </div>
          <div className="mx-auto flex w-[60%] sm:w-[40%] items-center justify-center bg-[var(--white)]/60 border border-black/5 rounded-md px-3 py-1 text-[0.7rem] text-[var(--text-3)] font-medium shadow-sm">
            <Lock size={10} className="mr-1.5 opacity-70" />
            {title}
          </div>
          <div className="absolute right-4 hidden sm:flex items-center gap-3 text-[var(--text-3)]">
            <Share size={12} />
            <Plus size={14} className="rotate-45" />
            <Sidebar size={12} />
          </div>
        </div>
        <div className="flex-1 bg-[var(--white)] overflow-hidden relative">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function PricingSection() {
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
            <div key={i} className={`bg-[var(--white)] rounded-[18px] p-8 flex flex-col border ${p.popular ? 'border-[var(--accent)] shadow-[0_8px_30px_rgba(0,113,227,0.12)] -translate-y-2' : 'border-[var(--border-light)] shadow-[0_1px_4px_rgba(0,0,0,0.03)]'}`}>
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
              
              <button className={`w-full py-3 rounded-[24px] text-[0.9rem] font-medium transition-all ${p.popular ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]' : 'bg-[var(--off-white)] text-[var(--text-1)] hover:bg-[var(--border-light)]'}`}>
                Empieza gratis
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


