'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { staggerContainer, fadeIn } from './animations';

export function HeroSection() {
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
          <Link 
            href="/auth/register"
            className="bg-[var(--accent)] text-white px-[28px] py-[12px] rounded-[24px] text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-[0_4px_20px_rgba(0,113,227,0.2)] hover:shadow-[0_8px_25px_rgba(0,113,227,0.3)] hover:-translate-y-[1px] whitespace-nowrap"
          >
            Empieza gratis
          </Link>
          <Link 
            href="/contacto"
            className="px-[28px] py-[12px] rounded-[24px] text-[0.9rem] font-medium text-[var(--text-2)] border border-[var(--border-light)] hover:bg-[var(--off-white)] transition-colors duration-200 whitespace-nowrap"
          >
            Ver demo
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
