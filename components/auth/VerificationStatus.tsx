"use client"

import React from "react"
import { motion } from "motion/react"
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"

interface VerificationStatusProps {
  state: "verifying" | "success" | "error"
  errorMessage?: string
  actionLabel?: string
  onAction: () => void
}

export function VerificationStatus({
  state,
  errorMessage = "El token es inválido o ha caducado.",
  actionLabel,
  onAction,
}: VerificationStatusProps) {
  return (
    <div className="space-y-8 text-center max-w-sm mx-auto">
      {state === "verifying" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 space-y-4 flex flex-col items-center"
        >
          <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
          <h2 className="text-xl font-serif text-[var(--text-1)]">
            Verificando tu dirección de correo...
          </h2>
          <p className="text-sm text-[var(--text-3)] max-w-xs leading-relaxed">
            Por favor espera un momento mientras validamos tus credenciales con el SRI y nuestro servidor seguro.
          </p>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--green-soft)] text-[var(--green)] mx-auto">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-tight">
              ¡Correo verificado!
            </h2>
            <p className="text-[1.02rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
              Tu cuenta ha sido activada y confirmada exitosamente. Ya puedes acceder al panel de ContaMind AI.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onAction}
              className="w-full inline-flex justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 rounded-[24px] transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              {actionLabel || "Iniciar Sesión"}
            </button>
          </div>
        </motion.div>
      )}

      {state === "error" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--red-soft)] text-[var(--red)] mx-auto">
            <XCircle size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-tight">
              Fallo de Verificación
            </h2>
            <p className="text-[1.02rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
              {errorMessage}
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onAction}
              className="w-full inline-flex justify-center items-center gap-1.5 bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] font-semibold py-3 rounded-[24px] transition-all active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft size={16} />
              {actionLabel || "Volver al Login"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
