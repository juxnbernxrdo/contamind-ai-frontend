'use client';

import React from 'react';
import { FileText, Download, Plus } from 'lucide-react';

export default function Facturacion() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.9rem,3.5vw,2.5rem)] font-serif text-[var(--text-1)] leading-tight tracking-tight">Facturación Electrónica SRI</h1>
          <p className="text-[0.97rem] text-[var(--text-3)] mt-1">Emisión y gestión de comprobantes válidos ante el SRI.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--white)] border border-[var(--border-light)] rounded-full text-[0.9rem] font-medium text-[var(--text-2)] hover:bg-[var(--off-white)] shadow-sm transition-all">
            <Download size={16} /> Descargar XMLs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-full text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] shadow-[0_4px_12px_rgba(0,113,227,0.2)] transition-all">
            <Plus size={16} /> Crear Factura
          </button>
        </div>
      </header>
      
      <div className="bg-[var(--white)] rounded-[18px] border border-[var(--border-light)] p-8 shadow-[0_1px_4px_rgba(0,0,0,0.02)] min-h-[400px] flex items-center justify-center flex-col text-center">
        <div className="w-16 h-16 bg-[var(--green-soft)] text-[var(--green)] rounded-[16px] flex items-center justify-center mb-4">
          <FileText size={32} />
        </div>
        <h3 className="text-[1.2rem] font-semibold text-[var(--text-1)] mb-2">Módulo de Facturación (Próximamente)</h3>
        <p className="text-[0.95rem] text-[var(--text-3)] max-w-md">
          Emite facturas, notas de crédito y guías de remisión con conexión directa al SRI. Autorizaciones en tiempo real.
        </p>
      </div>
    </div>
  );
}
