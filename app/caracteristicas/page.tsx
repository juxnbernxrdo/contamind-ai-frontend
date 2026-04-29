'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Zap, CheckCircle2, BarChart3, Globe, Blocks, MessageSquareHeart, Shield, Smartphone, Bot, ChevronRight, FileText, UploadCloud, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function CaracteristicasPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">Todas las herramientas,<br/>sin el estrés.</h1>
          <p className="text-[1.1rem] text-[var(--text-2)] max-w-2xl mx-auto">
            ContaMind es la solución ERP más completa y autónoma para administrar las finanzas de tu negocio en Ecuador y la región.
          </p>
        </div>

        {/* AI & Automation Section (Deep dive) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[var(--accent-soft)] p-2 rounded-lg">
                <Bot className="text-[var(--accent)]" size={24} />
              </div>
              <span className="font-semibold text-[var(--accent)] tracking-wide text-sm uppercase">ContaMind AI</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-1)] mb-6 leading-tight">El primer Agente Financiero que realmente ejecuta acciones.</h2>
            <p className="text-[var(--text-2)] text-[1.05rem] leading-relaxed mb-6">
              La mayoría del software &quot;con IA&quot; solo te ofrece un chat genérico. ContaMind cuenta con un <strong>Agente de Inteligencia Artificial Financiero</strong> conectado a más de 20 herramientas del sistema (API/Tools Registry).
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Genera asientos contables de partida doble desde lenguaje natural.",
                "Vector Search (RAG) embebido para consultar el histórico de transacciones.",
                "Análisis mensual automático del Balance Sheet (Liquidez y Solvencia).",
                "Alerta anomalías financieras (gastos inusuales) en tiempo real."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 text-[0.95rem] text-[var(--text-2)]">
                  <CheckCircle2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            {/* AI Mockup */}
            <div className="bg-[var(--white)] border border-[var(--border-light)] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="bg-[var(--off-white)] border-b border-[var(--border-light)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-inner">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[0.85rem] font-bold text-[var(--text-1)]">ContaMind AI</div>
                    <div className="text-[0.7rem] text-[var(--green)] font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"></span> Conectado a contabilidad</div>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4 bg-[var(--off-white)]/30 text-[0.9rem]">
                <div className="flex gap-3 justify-end">
                  <div className="bg-[var(--text-1)] text-[var(--white)] p-3 rounded-[18px] rounded-tr-[4px] max-w-[85%]">
                    Contabiliza el pago del arriendo del mes de Marzo al proveedor Inmobiliaria del Sur por $1,200. Salió de la cuenta Banco Pichincha.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex shrink-0 items-center justify-center mt-1">
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="space-y-2 max-w-[85%]">
                    <div className="bg-[var(--white)] border border-[var(--border-light)] p-3 rounded-[18px] rounded-tl-[4px] shadow-sm text-[var(--text-2)]">
                      Entendido. Ejecuté la herramienta <code className="bg-[var(--off-white)] px-1 rounded text-[0.75rem] text-[var(--accent)]">create_journal_entry</code> para ti:
                      
                      <div className="mt-3 bg-[var(--off-white)] border border-[var(--border-light)] rounded-lg overflow-hidden">
                        <div className="px-3 py-2 border-b border-[var(--border-light)] text-[0.75rem] font-bold flex justify-between bg-[var(--white)]">
                          <span>Asiento #JE-2026-042</span>
                          <span className="text-[var(--text-3)]">15 Mar 2026</span>
                        </div>
                        <div className="p-3 text-[0.8rem] space-y-2 font-mono">
                          <div className="flex justify-between">
                            <span>Gasto Arriendo Local</span>
                            <span className="text-[var(--text-1)]">1,200.00</span>
                          </div>
                          <div className="flex justify-between pl-4 text-[var(--text-3)]">
                            <span>Bancos - Pichincha Corriente</span>
                            <span className="text-[var(--text-1)]">-1,200.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            

          </div>
        </div>

        {/* SRI / Invoicing Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="order-2 lg:order-1 relative">
             <div className="bg-[var(--white)] border border-[var(--border-light)] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center bg-[var(--off-white)]">
                  <div className="font-bold text-[0.9rem]">Comprobantes Electrónicos</div>
                  <div className="flex gap-2">
                    <div className="bg-[var(--white)] border border-[var(--border-light)] text-[0.75rem] px-2 py-1 rounded-md flex items-center gap-1 shadow-sm"><UploadCloud size={12} className="text-[var(--accent)]"/> SRI Sync </div>
                  </div>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-[0.8rem]">
                    <thead className="bg-[var(--off-white)] text-[var(--text-3)] border-b border-[var(--border-light)]">
                      <tr>
                        <th className="font-medium p-3">Tipo</th>
                        <th className="font-medium p-3">Entidad</th>
                        <th className="font-medium p-3">Estado SRI</th>
                        <th className="font-medium p-3 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {[
                        { t: 'Factura Recibida', ent: 'Corporación Favorita', s: 'Autorizado', a: '$450.00', sync: true },
                        { t: 'Factura Emitida', ent: 'Cliente Final S.A.', s: 'Autorizado', a: '$1,200.00', sync: false },
                        { t: 'Retención Recibida', ent: 'Banco Pichincha', s: 'Autorizado', a: '$24.50', sync: true },
                        { t: 'Factura Recibida', ent: 'CNT EP', s: 'Autorizado', a: '$85.00', sync: true },
                      ].map((r, i) => (
                        <tr key={i} className="hover:bg-[var(--off-white)] transition-colors">
                          <td className="p-3 font-medium text-[var(--text-2)] flex items-center gap-2">
                            {r.sync && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" title="Descargado automáticamente por SRI Downloader"></span>}
                            {r.t}
                          </td>
                          <td className="p-3 font-semibold text-[var(--text-1)]">{r.ent}</td>
                          <td className="p-3"><span className="bg-[var(--green-soft)] text-[var(--green)] px-2 py-0.5 rounded-[4px] text-[0.7rem] font-bold">AUTORIZADO</span></td>
                          <td className="p-3 text-right font-mono text-[var(--text-1)]">{r.a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[var(--green-soft)] p-2 rounded-lg">
                <FileText className="text-[var(--green)]" size={24} />
              </div>
              <span className="font-semibold text-[var(--green)] tracking-wide text-sm uppercase">SRI Downloader & Compliance</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-1)] mb-6 leading-tight">Cumplimiento tributario en piloto automático.</h2>
            <p className="text-[var(--text-2)] text-[1.05rem] leading-relaxed mb-6">
              Descargamos masivamente todos tus comprobantes electrónicos (facturas y retenciones recibidas) desde el portal del SRI en segundo plano (Web Scraping / Playwright). Olvídate de pedirlos por correo o descargarlos manualmente.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3 text-[0.95rem] text-[var(--text-2)]">
                <CheckCircle2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                <span>Generación de los <strong>Formularios 104 y 103</strong> automáticamente.</span>
              </li>
              <li className="flex gap-3 text-[0.95rem] text-[var(--text-2)]">
                <CheckCircle2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                <span>Creación y validación del <strong>Anexo Transaccional Simplificado (ATS)</strong>.</span>
              </li>
              <li className="flex gap-3 text-[0.95rem] text-[var(--text-2)]">
                <CheckCircle2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                <span>Facturación con cálculo automático de todos los tipos de IVA e ICE.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Grid (The Rest) */}
        <div className="text-center mb-16 mt-24">
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-1)] mb-4">El ERP que reemplaza 5 aplicaciones.</h2>
          <p className="text-[1.05rem] text-[var(--text-3)] max-w-2xl mx-auto">
            Desde el módulo financiero principal basado en normas NIIF hasta tu nómina. Todo encriptado en el mismo lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            { icon: <Blocks size={20} className="text-[var(--accent)]" />, title: "Módulo Financiero Core", desc: "Plan de cuentas con jerarquía de 6 niveles (Activo, Pasivo, Patrimonio, etc) y cierres de períodos duros y de gracia." },
            { icon: <BarChart3 size={20} className="text-[var(--accent)]" />, title: "Reportes Gerenciales", desc: "Balance de Comprobación, General Ledger, Balance General y Estado de Resultados clasificando Activos/Pasivos Corrientes y No Corrientes." },
            { icon: <Globe size={20} className="text-[var(--accent)]" />, title: "Nómina (Payroll)", desc: "Manejo completo de empleados. Generación de roles de pago con retenciones de IESS patronal e individual, provisiones de décimos y vacaciones." },
            { icon: <Shield size={20} className="text-[var(--accent)]" />, title: "Multi-tenancy Fuerte", desc: "Una sola cuenta, múltiples empresas aisladas de forma segura. Roles granulares: Audítor, Contador, Dueño, Visualizador." },
            { icon: <Zap size={20} className="text-[var(--accent)]" />, title: "Gestión de Inventarios", desc: "Catálogo de productos y servicios con métodos de valuación, puntos de re-orden, precios de costo y precios de venta automáticos." },
            { icon: <Search size={20} className="text-[var(--accent)]" />, title: "Cuentas por Pagar (AP)", desc: "Generación de Órdenes de Compra (PO), flujos de aprobación y registro de Bills con enlace contable a tu libro mayor." }
          ].map((f, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[var(--off-white)] p-6 rounded-[16px] border border-[var(--border-light)] hover:border-[var(--accent)]/30 hover:shadow-sm transition-all"
            >
              <div className="text-[var(--text-1)] mb-4 bg-[var(--white)] w-10 h-10 rounded-lg flex justify-center items-center shadow-sm border border-[var(--border-light)]">
                {f.icon}
              </div>
              <h3 className="font-bold text-[var(--text-1)] mb-2 text-[1.1rem]">{f.title}</h3>
              <p className="text-[0.9rem] text-[var(--text-3)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </MarketingLayout>
  );
}

