"use client"

import React from "react"
import { motion } from "motion/react"
import { ShieldAlert, ArrowLeft, Home, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AccessDeniedPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 text-center">
      {/* Icon */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--red-soft)] text-[var(--red)] mb-2 mx-auto">
        <ShieldAlert size={32} />
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-[1.15]">
          Acceso Denegado
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
          Lo sentimos, no tienes los permisos requeridos para acceder a este módulo. Tu rol actual en la empresa no cuenta con privilegios de lectura o escritura.
        </p>
      </div>

      {/* Audit warning */}
      <div className="p-4 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[14px] text-left max-w-xs mx-auto">
        <span className="text-[9px] uppercase font-bold text-[var(--text-4)] tracking-wider block mb-1">
          Detalles de Seguridad
        </span>
        <p className="text-[10px] text-[var(--text-3)] leading-normal">
          Este intento ha sido registrado en nuestra bitácora de auditoría inmutable de seguridad. Si consideras que deberías tener acceso, comunícate con el Administrador TI.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-light)] max-w-xs mx-auto">
        <Link
          href="/dashboard"
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <Home size={16} />
          Ir al Dashboard
        </Link>

        <button
          onClick={() => router.back()}
          className="w-full bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          Regresar
        </button>
      </div>
    </div>
  )
}
