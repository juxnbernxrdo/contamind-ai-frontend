"use client"

import React from "react"
import { motion } from "motion/react"
import { Mail, Loader2, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react"
import { CooldownTimer } from "./CooldownTimer"

interface EmailSentCardProps {
  email: string
  type?: "verification" | "recovery"
  onResend: () => Promise<void>
  cooldown: number
  isResending: boolean
  resendError?: string | null
  resendSuccess?: boolean
}

export function EmailSentCard({
  email,
  type = "verification",
  onResend,
  cooldown,
  isResending,
  resendError = null,
  resendSuccess = false,
}: EmailSentCardProps) {
  const isCooldown = cooldown > 0

  const title = type === "recovery" ? "Correo de recuperación enviado" : "Verifica tu correo electrónico"
  const description =
    type === "recovery"
      ? "Hemos enviado un enlace para restablecer tu contraseña al correo:"
      : "Hemos enviado un enlace de confirmación para activar tu cuenta al correo:"

  return (
    <div className="space-y-6 text-center max-w-sm mx-auto">
      {/* Icon with Premium Pulsing Animation */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--accent-soft)] text-[var(--accent)] mb-2 mx-auto">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <Mail size={32} />
        </motion.div>
      </div>

      {/* Title & Desc */}
      <div className="space-y-3">
        <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-[1.15]">
          {title}
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
        <p className="text-[0.95rem] font-semibold text-[var(--text-2)] break-all px-2 select-all font-mono bg-[var(--off-white)] py-1.5 rounded-lg border border-[var(--border-light)]">
          {email}
        </p>
      </div>

      {/* Info Boxes / Subtext */}
      <p className="text-xs text-[var(--text-4)] max-w-[280px] mx-auto leading-relaxed">
        Si no lo encuentras en unos minutos, revisa tu bandeja de correo no deseado o spam.
      </p>

      {/* Action panel */}
      <div className="pt-4 border-t border-[var(--border-light)] flex flex-col items-center gap-3">
        {resendError && (
          <div
            className="flex items-center gap-2 p-3 rounded-[12px] bg-[var(--red-soft)] border border-[var(--red)]/20 text-[var(--red)] text-xs text-left w-full"
            role="alert"
          >
            <AlertCircle size={14} className="shrink-0" />
            <span>{resendError}</span>
          </div>
        )}

        {resendSuccess && (
          <div
            className="flex items-center gap-2 p-3 rounded-[12px] bg-[var(--green-soft)] border border-[var(--green)]/20 text-[var(--green)] text-xs text-left w-full animate-fade-in"
            role="status"
          >
            <CheckCircle2 size={14} className="shrink-0" />
            <span>¡Correo reenviado con éxito!</span>
          </div>
        )}

        {isCooldown ? (
          <CooldownTimer secondsLeft={cooldown} label="Puedes reenviar en" />
        ) : (
          <button
            onClick={onResend}
            disabled={isResending}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--accent)] disabled:opacity-50 disabled:hover:text-[var(--text-2)] transition-all cursor-pointer bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] px-4 py-2.5 rounded-[24px] shadow-sm select-none"
            aria-label="Reenviar correo de confirmación"
          >
            {isResending ? (
              <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
            ) : (
              <RotateCcw size={14} />
            )}
            {isResending ? "Reenviando..." : "Reenviar correo electrónico"}
          </button>
        )}
      </div>
    </div>
  )
}
