'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Blocks, CheckCircle2, Lock, Share, Sidebar, BrainCircuit, BarChart3, Globe } from 'lucide-react';

export function AppMockupSection() {
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

function MockupWindow({ children, title, delay = 0 }: { children: React.ReactNode, title: string, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full rounded-t-[10px] rounded-b-none overflow-hidden shadow-[var(--shadow-prominent)] p-[1px] bg-linear-to-b from-[var(--border-light)] to-transparent aspect-[16/11] sm:aspect-[16/9] min-h-[320px] xs:min-h-[380px]"
    >
      <div className="w-full h-full bg-[var(--white)] rounded-t-[7px] flex flex-col overflow-hidden">
        <div className="h-[44px] flex items-center px-4 bg-gradient-to-b from-[var(--off-white)] to-[var(--border-light)] border-b border-[var(--border-light)] relative shrink-0">
          <div className="flex gap-2 items-center absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#ED6158] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#FCC02E] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#5FC038] opacity-80" />
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
          <div key={i} className="bg-[var(--white)] p-4 rounded-[12px] border border-[var(--border-light)] shadow-[var(--shadow-subtle)] hover:border-[var(--accent)]/30 transition-all cursor-pointer group">
            <div className="text-[var(--accent)] mb-3 p-2 bg-[var(--accent-soft)] w-fit rounded-[8px] group-hover:scale-110 transition-transform">{rpt.icon}</div>
            <h5 className="text-[0.8rem] font-bold text-[var(--text-1)] leading-tight">{rpt.label}</h5>
          </div>
        ))}
      </div>

      <div className="bg-[var(--white)] rounded-[12px] border border-[var(--border-light)] p-4 shadow-[var(--shadow-subtle)]">
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
