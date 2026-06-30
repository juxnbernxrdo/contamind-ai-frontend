'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Construction, ArrowLeft, Mail, ChevronRight, Info } from 'lucide-react';

interface Breadcrumb {
  label: string;
  path: string;
}

interface UnderConstructionProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  backendHint?: string;
}

export function UnderConstruction({
  title,
  description = 'Estamos trabajando en esta funcionalidad para ofrecerte una mejor experiencia.',
  breadcrumbs,
  backendHint,
}: UnderConstructionProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center text-center max-w-lg mx-auto px-4"
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 mb-4 text-[11px] text-[var(--text-4)] flex-wrap justify-center">
            <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">
              Inicio
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1">
                <ChevronRight size={10} />
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.path} className="hover:text-[var(--accent)] transition-colors capitalize">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--text-2)] font-medium capitalize">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--amber-soft)] mb-6">
          <Construction size={28} className="text-[var(--amber)]" />
        </div>

        <h1 className="font-serif text-[1.6rem] font-semibold text-[var(--text-1)] leading-tight">
          Módulo en construcción
        </h1>

        <p className="mt-1 text-[15px] font-medium text-[var(--text-2)]">
          {title}
        </p>

        <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-3)]">
          {description}
        </p>

        {/* Backend hint */}
        {backendHint && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--off-white)] px-4 py-3 text-left w-full">
            <Info size={14} className="flex-shrink-0 text-[var(--accent)] mt-0.5" />
            <p className="text-[12px] text-[var(--text-3)]">{backendHint}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            <ArrowLeft size={14} />
            Volver al Dashboard
          </Link>
          <a
            href="mailto:support@contamind.ai"
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-[13px] font-medium text-[var(--text-3)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-colors"
          >
            <Mail size={14} />
            Contactar soporte
          </a>
        </div>
      </motion.div>
    </div>
  );
}
