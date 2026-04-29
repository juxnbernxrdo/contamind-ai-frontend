'use client';

import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import Link from 'next/link';
import { Users, Target, Rocket, Code2, ShieldCheck, Database, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function NosotrosPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--text-1)] mb-6">El CFO autónomo para <br/>la próxima generación.</h1>
          <p className="text-[1.1rem] text-[var(--text-2)]">
            No somos simplemente software contable. Somos una empresa de inteligencia artificial construyendo el futuro financiero de las empresas: un sistema autónomo que piensa, analiza y ejecuta.
          </p>
        </div>

        {/* Foundation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-[var(--white)] p-8 rounded-[18px] border border-[var(--border-light)] shadow-sm">
            <Target className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="text-[var(--text-1)] font-bold text-lg mb-2">Nuestra Misión</h3>
            <p className="text-[var(--text-3)] text-[0.95rem] leading-[1.6]">
              Reducir a cero el tiempo y estrés que las PyMEs invierten en labores administrativas y tributarias (SRI), permitiéndoles enfocarse 100% en ventas e innovación.
            </p>
          </div>
          <div className="bg-[var(--white)] p-8 rounded-[18px] border border-[var(--border-light)] shadow-sm">
            <Rocket className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="text-[var(--text-1)] font-bold text-lg mb-2">La Visión</h3>
            <p className="text-[var(--text-3)] text-[0.95rem] leading-[1.6]">
              Evolucionar de un SaaS a un ente autónomo. Queremos poner un auténtico &quot;CFO de Inteligencia Artificial&quot; en el directorio de cada empresa latinoamericana.
            </p>
          </div>
          <div className="bg-[var(--white)] p-8 rounded-[18px] border border-[var(--border-light)] shadow-sm">
            <Users className="text-[var(--accent)] mb-4" size={32} />
            <h3 className="text-[var(--text-1)] font-bold text-lg mb-2">Nuestro Origen</h3>
            <p className="text-[var(--text-3)] text-[0.95rem] leading-[1.6]">
              Nacimos en Ecuador bajo la sombrilla de StarMind AI de la profunda frustración con sistemas legados. De descargar facturas del SRI, a orquestar carteras enteras.
            </p>
          </div>
        </div>

        {/* Architecture Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-1)] mb-4">Lo que nos diferencia</h2>
            <p className="text-[var(--text-3)] max-w-2xl mx-auto">No somos una interfaz bonita sobre Excel. Somos un motor contable robusto impulsado por IA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[var(--off-white)] p-6 rounded-[16px] text-center border border-[var(--border-light)]">
              <Database className="mx-auto text-[var(--accent)] mb-3" size={24} />
              <div className="font-bold text-[var(--text-1)] mb-1">Doble Partida NIIF</div>
              <div className="text-[0.8rem] text-[var(--text-3)]">Estructura contable real e inmutable bajo la mesa.</div>
            </div>
            <div className="bg-[var(--off-white)] p-6 rounded-[16px] text-center border border-[var(--border-light)]">
              <Code2 className="mx-auto text-[var(--accent)] mb-3" size={24} />
              <div className="font-bold text-[var(--text-1)] mb-1">FastAPI + Supabase</div>
              <div className="text-[0.8rem] text-[var(--text-3)]">Arquitectura de microservicios rápida, escalable y en tiempo real.</div>
            </div>
            <div className="bg-[var(--off-white)] p-6 rounded-[16px] text-center border border-[var(--border-light)]">
              <Cpu className="mx-auto text-[var(--accent)] mb-3" size={24} />
              <div className="font-bold text-[var(--text-1)] mb-1">+20 Tools de IA</div>
              <div className="text-[0.8rem] text-[var(--text-3)]">Nuestro agente expone herramientas para leer y escribir datos.</div>
            </div>
            <div className="bg-[var(--off-white)] p-6 rounded-[16px] text-center border border-[var(--border-light)]">
              <ShieldCheck className="mx-auto text-[var(--accent)] mb-3" size={24} />
              <div className="font-bold text-[var(--text-1)] mb-1">Aislamiento de Cuentas</div>
              <div className="text-[0.8rem] text-[var(--text-3)]">Multi-tenancy rígido para protección total de datos empresariales.</div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-[var(--white)] border border-[var(--border-light)] rounded-[24px] overflow-hidden flex flex-col md:flex-row items-stretch mb-24 shadow-md group">
          <div className="w-full md:w-2/5 aspect-square md:aspect-auto bg-[var(--off-white)] relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--border-light)] p-8 text-center bg-gradient-to-br from-[var(--off-white)] to-transparent">
            <div className="relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[8px] border-[var(--white)] shadow-2xl mx-auto bg-gradient-to-tr from-[var(--text-1)] to-[var(--text-2)] flex items-center justify-center mb-8 overflow-hidden transform group-hover:rotate-[-5deg] transition-all duration-700 hover:shadow-[0_0_30px_rgba(0,113,227,0.3)]">
                <span className="text-5xl md:text-6xl text-[var(--white)] font-serif font-medium tracking-tighter mix-blend-overlay opacity-90">JB</span>
              </div>
              <p className="text-[var(--text-3)] font-mono text-[0.7rem] md:text-xs tracking-[0.2em] uppercase font-bold text-center">Fundador</p>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,1)_25%,rgba(0,0,0,1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,1)_75%,rgba(0,0,0,1)_100%)] bg-[length:20px_20px]"></div>
          </div>
          <div className="w-full md:w-3/5 p-8 md:p-14 text-left flex flex-col justify-center bg-[var(--white)]">
            <div className="inline-flex items-center bg-[var(--accent-soft)] text-[var(--accent)] text-[0.65rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-8 border border-[var(--accent)]/10 w-fit shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-2" />
              Liderazgo & Visión
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--text-1)] mb-4 tracking-[-0.02em]">Juan Bernardo Ordóñez</h2>
            <div className="text-[0.95rem] text-[var(--text-3)] font-medium mb-10 flex flex-col gap-2 md:flex-row md:items-center">
              <span className="font-bold text-[var(--white)] uppercase tracking-wider text-[0.7rem] bg-[var(--text-1)] px-3 py-1 rounded-md w-fit">CEO & Arquitecto</span>
              <span className="hidden md:inline text-[var(--border-light)] px-2">&mdash;</span>
              <span className="flex items-center gap-2 text-[0.85rem]">
                <span>Desarrollador Ecuatoriano, 17 años</span>
              </span>
            </div>
            
            <div className="space-y-6 text-[1.1rem] text-[var(--text-2)] leading-[1.8] font-light">
               <p>
                A sus 17 años, Juan Bernardo no solo vio un problema en la forma en que operaban las empresas; vio una ineficiencia infraestructural masiva. Liderando ContaMind AI bajo la corporación <strong className="font-medium text-[var(--text-1)]">StarMind AI</strong>, su enfoque es inquebrantable.
               </p>
               <div className="relative py-6 pl-8 my-8 before:content-[''] before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:bg-gradient-to-b before:from-[var(--accent)] before:to-transparent before:rounded-full bg-[var(--off-white)]/50 rounded-r-lg">
                <p className="text-[var(--text-1)] font-serif text-[1.25rem] leading-[1.6]">
                 &quot;El software tradicional te da las herramientas, pero tú haces el trabajo manual. La verdadera disrupción radica en sistemas autónomos que asimilen y ejecuten el trabajo por ti.&quot;
                </p>
               </div>
               <p>
                Bajo esta firme convicción técnica, Juan Bernardo dirige el diseño y arquitectura de redes de inteligencia artificial aplicadas a ecosistemas financieros, construyendo flujos y agentes capaces de tomar decisiones analíticas con cero intervención humana.
               </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-b from-[var(--off-white)] to-[var(--white)] border border-[var(--border-light)] rounded-[24px] p-10 md:p-16 text-center max-w-4xl mx-auto shadow-sm">
           <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] m-auto flex items-center justify-center transform rotate-3 shadow-[0_4px_20px_rgba(0,113,227,0.3)] mb-8">
            <Rocket className="text-white" size={32} />
          </div>
          <h2 className="font-serif text-3xl md:text-3xl text-[var(--text-1)] mb-6">Por qué existe ContaMind</h2>
          <p className="text-[1.05rem] text-[var(--text-2)] leading-[1.7] max-w-2xl mx-auto mb-8">
            Tras administrar varios negocios en Ecuador, nos dimos cuenta de que la tecnología disponible estaba estancada en el 2005. Reportes feos, interfaces confusas y un proceso de cumplimiento tributario arcaico.
            <br/><br/>
            ContaMind nace del dolor propio. Queríamos una plataforma corporativa donde pudieras conversar con la data (RAG), automatizar las descargas del portal del SRI y tener métricas financieras reales brillando al iniciar la mañana. 
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/caracteristicas" className="bg-[var(--text-1)] text-[var(--white)] px-8 py-3 rounded-[24px] text-[0.95rem] font-medium hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-transparent">
              Conoce el Producto
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
