"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { Mail, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

function EmailSentContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "tu correo"
  const type = searchParams.get("type") || "verification"

  const [cooldown, setCooldown] = useState(30)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return
    setIsResending(true)

    try {
      const endpoint = type === "recovery" ? "/auth/forgot-password" : "/auth/register/resend-email"
      await apiClient.post(endpoint, { email })
      toast.success("Correo de confirmación enviado exitosamente.")
      setCooldown(30)
    } catch (e) {
      toast.error("Error al reenviar el correo. Intente más tarde.")
    } finally {
      setIsResending(false)
    }
  }

  const title = type === "recovery" ? "Correo de recuperación enviado" : "Verifica tu correo electrónico"
  const description =
    type === "recovery"
      ? `Hemos enviado un enlace para restablecer tu contraseña al correo:`
      : `Hemos enviado un enlace de confirmación para activar tu cuenta al correo:`

  return (
    <div className="space-y-8 text-center">
      {/* Icon */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--accent-soft)] text-[var(--accent)] mb-2 mx-auto">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Mail size={32} />
        </motion.div>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-[1.15]">
          {title}
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
        <p className="text-[1.05rem] font-semibold text-[var(--text-2)] break-all px-2 max-w-sm mx-auto">
          {email}
        </p>
      </div>

      {/* Instructions */}
      <p className="text-xs text-[var(--text-4)] max-w-[280px] mx-auto leading-relaxed pt-2">
        Si no lo encuentras en unos minutos, revisa tu bandeja de correo no deseado (spam).
      </p>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-4 pt-4 border-t border-[var(--border-light)]">
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="flex items-center gap-1.5 text-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors disabled:opacity-50 disabled:hover:text-[var(--text-3)] font-semibold"
        >
          <RotateCcw size={14} className={isResending ? "animate-spin" : ""} />
          {cooldown > 0 ? `Reenviar correo en ${cooldown}s` : "Reenviar correo electrónico"}
        </button>

        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 text-xs text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors font-medium"
        >
          <ArrowLeft size={12} />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}

export default function EmailSentPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EmailSentContent />
    </Suspense>
  )
}
