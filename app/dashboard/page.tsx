'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, BrainCircuit, Wallet, Users, Receipt } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.9rem,3.5vw,2.5rem)] font-serif text-[var(--text-1)] leading-tight tracking-tight">Buenos días, Juan</h1>
          <p className="text-[0.97rem] text-[var(--text-3)] mt-1">Aquí está el resumen financiero de tu negocio hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[var(--white)] border border-[var(--border-light)] rounded-full text-[0.9rem] font-medium text-[var(--text-2)] hover:bg-[var(--off-white)] shadow-sm transition-all">
            Ver Reportes
          </button>
          <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-full text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] shadow-[0_4px_12px_rgba(0,113,227,0.2)] transition-all">
            Nueva Factura
          </button>
        </div>
      </header>

      {/* Proactive AI Insight */}
      <div className="bg-[var(--accent-soft)] border border-[var(--accent)]/10 rounded-[18px] p-5 flex items-start gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-bl-full pointer-events-none"></div>
        <div className="w-10 h-10 rounded-full bg-[var(--white)] flex items-center justify-center shrink-0 shadow-sm border border-[var(--border-light)]">
          <BrainCircuit className="text-[var(--accent)]" size={20} />
        </div>
        <div>
          <h3 className="text-[0.93rem] font-semibold text-[var(--accent)] mb-1">Insight del Agente</h3>
          <p className="text-[0.93rem] text-[var(--text-1)] leading-[1.6]">
            Veo que tienes <strong className="font-semibold">3 facturas vencidas</strong> de Distribuidora Oriente por $4,200. Históricamente pagan cuando se les envía un recordatorio por WhatsApp. ¿Deseas que prepare un mensaje de cobranza?
          </p>
          <div className="mt-3 flex gap-3">
            <button className="text-[0.85rem] font-medium bg-[var(--white)] px-3 py-1.5 rounded-full border border-[var(--border-light)] text-[var(--text-2)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-colors">
              Sí, preparar mensaje
            </button>
            <button className="text-[0.85rem] font-medium text-[var(--text-3)] hover:text-[var(--text-2)] px-2 py-1.5 transition-colors">
              Ignorar
            </button>
          </div>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Flujo de Caja (30d)', auth: '$24,500.00', inc: '+12.4%', up: true, icon: Wallet, color: 'text-[var(--green)]', bg: 'bg-[var(--green-soft)]' },
          { label: 'Cuentas por Cobrar', auth: '$12,840.50', inc: '+5.2%', up: true, icon: Receipt, color: 'text-[var(--accent)]', bg: 'bg-[var(--accent-soft)]' },
          { label: 'Cuentas por Pagar', auth: '$4,120.00', inc: '-2.1%', up: false, icon: Receipt, color: 'text-[var(--amber)]', bg: 'bg-[var(--amber)]/10' },
          { label: 'Nómina Proyectada', auth: '$8,450.00', inc: '+0.0%', up: null, icon: Users, color: 'text-[var(--text-3)]', bg: 'bg-[var(--off-white)]' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[var(--white)] rounded-[18px] border border-[var(--border-light)] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-[10px] ${kpi.bg}`}>
                <kpi.icon size={18} className={kpi.color} />
              </div>
              <button className="text-[var(--text-4)] hover:text-[var(--text-1)] transition-colors"><MoreHorizontal size={18} /></button>
            </div>
            <p className="text-[0.8rem] text-[var(--text-3)] font-medium mb-1">{kpi.label}</p>
            <div className="flex items-end gap-3 tracking-tight">
              <h4 className="text-[1.5rem] font-bold text-[var(--text-1)]">{kpi.auth}</h4>
              {kpi.up !== null && (
                <div className={`flex items-center text-[0.75rem] font-semibold mb-1 ${kpi.up ? 'text-[var(--green)]' : 'text-[var(--amber)]'}`}>
                  {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.inc}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart placeholder */}
        <div className="bg-[var(--white)] rounded-[18px] border border-[var(--border-light)] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)] lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[1.05rem] font-semibold text-[var(--text-1)]">Ingresos vs Gastos</h3>
            <select className="bg-[var(--off-white)] border-none text-[0.85rem] font-medium text-[var(--text-2)] rounded-[8px] py-1.5 px-3 focus:ring-0 cursor-pointer">
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px] flex items-end gap-4">
            {[40, 60, 45, 80, 50, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-1.5 group">
                <div style={{ height: `${h}%` }} className="w-full bg-[var(--accent)] rounded-[6px] opacity-80 group-hover:opacity-100 transition-opacity relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--text-1)] text-white text-[0.7rem] px-2 py-1 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    $12k
                  </div>
                </div>
                <div style={{ height: `${h * 0.6}%` }} className="w-full bg-[var(--border)] rounded-[6px] opacity-50 group-hover:opacity-70 transition-opacity"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[0.8rem] text-[var(--text-3)] font-medium">
            <span>Mar</span>
            <span>Abr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Ago</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--white)] rounded-[18px] border border-[var(--border-light)] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[1.05rem] font-semibold text-[var(--text-1)]">Facturas Recientes</h3>
            <Link href="/dashboard/facturacion" className="text-[0.85rem] font-medium text-[var(--accent)] hover:underline">Ver todas</Link>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {[
              { client: 'Mercorp S.A.', amount: '$1,200.00', status: 'Pagada' },
              { client: 'Juan Pérez', amount: '$450.00', status: 'Pendiente' },
              { client: 'Globex Inc.', amount: '$3,400.00', status: 'Vencida' },
              { client: 'TechSolutions', amount: '$890.00', status: 'Pagada' },
              { client: 'Restaurante El Lago', amount: '$150.00', status: 'Pendiente' },
            ].map((inv, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-[10px] hover:bg-[var(--off-white)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.75rem] ${
                    inv.status === 'Pagada' ? 'bg-[var(--green-soft)] text-[var(--green)]' :
                    inv.status === 'Vencida' ? 'bg-[var(--red)]/10 text-[var(--red)]' :
                    'bg-[var(--accent-soft)] text-[var(--accent)]'
                  }`}>
                    {inv.client[0]}
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-medium text-[var(--text-1)]">{inv.client}</p>
                    <p className="text-[0.75rem] text-[var(--text-3)]">Hoy, 10:45 AM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[0.9rem] font-semibold text-[var(--text-1)]">{inv.amount}</p>
                  <p className={`text-[0.7rem] font-medium ${
                    inv.status === 'Pagada' ? 'text-[var(--green)]' :
                    inv.status === 'Vencida' ? 'text-[var(--red)]' :
                    'text-[var(--amber)]'
                  }`}>{inv.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
