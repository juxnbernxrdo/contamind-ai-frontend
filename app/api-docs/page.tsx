'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';

export default function ApiDocsPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <h4 className="text-[0.85rem] font-bold text-[var(--text-4)] uppercase tracking-wider mb-4">API REST v1</h4>
            <div className="space-y-2">
              <a href="#auth" className="block text-[0.9rem] text-[var(--text-2)] hover:text-[var(--accent)] font-medium">Autenticación</a>
              <a href="#invoices" className="block text-[0.9rem] text-[var(--text-2)] hover:text-[var(--accent)] font-medium">Facturas (Invoices)</a>
              <a href="#customers" className="block text-[0.9rem] text-[var(--text-2)] hover:text-[var(--accent)] font-medium">Clientes de facturación</a>
              <a href="#webhooks" className="block text-[0.9rem] text-[var(--text-2)] hover:text-[var(--accent)] font-medium">Webhooks</a>
            </div>
          </div>
        </aside>

        <div className="flex-1 max-w-3xl">
          <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] text-[var(--text-1)] mb-6">Documentación de la API</h1>
          <p className="text-[1.1rem] text-[var(--text-2)] mb-12">
            La API de ContaMind te permite automatizar la facturación y recuperar datos financieros directamente desde tu aplicación de software.
          </p>

          <div id="auth" className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--text-1)] mb-4">Autenticación</h2>
            <p className="text-[0.95rem] text-[var(--text-3)] mb-4">
              Cada solicitud a la API debe incluir la cabecera <code className="bg-[var(--off-white)] p-1 rounded">Authorization</code> con el esquema Bearer y tu API Key generada desde tu cuenta.
            </p>
            <div className="bg-[#1d1d1f] rounded-[12px] p-4 text-[0.85rem] text-[var(--white)] font-mono overflow-x-auto">
              <span className="text-[#ff9f0a]">curl</span> https://api.contamind.ai/v1/invoices \<br/>
              &nbsp;&nbsp;-H <span className="text-[#30d158]">&quot;Authorization: Bearer sk_live_xxxxxxxxxx&quot;</span>
            </div>
          </div>

          <div id="invoices" className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--text-1)] mb-4">Crear una factura</h2>
            <p className="text-[0.95rem] text-[var(--text-3)] mb-4">
              Este endpoint generará una factura en el sistema y, si estás en producción, solicitará la autorización automática en el ente tributario seleccionado en tu cuenta (ej. SRI).
            </p>
            <div className="bg-[#1d1d1f] rounded-[12px] p-4 text-[0.85rem] text-[var(--white)] font-mono overflow-x-auto">
              <span className="text-[#ff9f0a]">POST</span> /v1/invoices<br/><br/>
              {`{`} <br/>
              &nbsp;&nbsp;<span className="text-[#aeaeb2]">&quot;customerId&quot;</span>: <span className="text-[#30d158]">&quot;cus_kj823&quot;</span>, <br/>
              &nbsp;&nbsp;<span className="text-[#aeaeb2]">&quot;items&quot;</span>: [{`{`}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#aeaeb2]">&quot;productId&quot;</span>: <span className="text-[#30d158]">&quot;prod_xxyz&quot;</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#aeaeb2]">&quot;quantity&quot;</span>: <span className="text-[#0071e3]">1</span><br/>
              &nbsp;&nbsp;{`}`}]<br/>
              {`}`}
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
