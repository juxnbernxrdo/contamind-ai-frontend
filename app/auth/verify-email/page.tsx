"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Loader2, XCircle, ArrowLeft, Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { useCooldown } from "@/components/auth/CooldownTimer"
import { AuthNotification } from "@/components/auth/AuthNotification"
import { VerificationStatus } from "@/components/auth/VerificationStatus"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const emailParam = searchParams.get("email") || ""
  const router = useRouter()

  const [state, setState] = useState<"verifying" | "success" | "error">(!token ? "error" : "verifying")
  const [errorMessage, setErrorMessage] = useState(!token ? "Falta el token de verificación de correo en la URL." : "")

  // Form states for resend on error
  const [emailInput, setEmailInput] = useState(emailParam)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState(false)

  const { secondsLeft: cooldown, startCooldown } = useCooldown({
    key: `verify_email_page_resend_${emailInput || "pending"}`,
    defaultSeconds: 60,
  })

  useEffect(() => {
    if (!token) return

    let mounted = true
    const verifyToken = async () => {
      try {
        await apiClient.post("/auth/email-verification/verify", { token })
        if (mounted) {
          setState("success")
        }
      } catch (err: any) {
        if (mounted) {
          setState("error")
          const msg =
            err.response?.data?.message ||
            "El token de verificación es inválido o ha caducado."
          setErrorMessage(msg)
        }
      }
    }

    // Delay start slightly to let the animation reveal smoothly
    const timeout = setTimeout(() => {
      verifyToken()
    }, 1500)

    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) {
      setResendError("Por favor ingrese su correo electrónico.")
      return
    }
    if (cooldown > 0 || resendLoading) return

    setResendLoading(true)
    setResendError(null)
    setResendSuccess(false)

    try {
      await apiClient.post("/auth/email-verification/resend", {
        email: emailInput.trim(),
      })
      setResendSuccess(true)
      startCooldown(60)
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "No se pudo reenviar el correo de verificación."
      setResendError(msg)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {state !== "error" ? (
        <VerificationStatus
          state={state}
          errorMessage={errorMessage}
          actionLabel={state === "success" ? "Iniciar Sesión" : undefined}
          onAction={() => router.push("/auth/login")}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center max-w-sm mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--red-soft)] text-[var(--red)] mx-auto">
            <XCircle size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-tight">
              Fallo de Verificación
            </h2>
            <p className="text-[0.98rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Form to resend verification email */}
          <div className="p-5 rounded-[18px] bg-[var(--off-white)] border border-[var(--border-light)] text-left space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider">
              Solicitar nuevo enlace de verificación
            </h3>
            <p className="text-xs text-[var(--text-3)] leading-relaxed">
              Ingresa el correo asociado a tu cuenta para recibir un nuevo enlace de activación (válido por 24 horas).
            </p>

            <form onSubmit={handleResend} className="space-y-3" noValidate>
              <input
                type="email"
                required
                placeholder="nombre@empresa.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-[10px] border border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)] focus:outline-none focus:ring-2 transition-all bg-[var(--white)] text-[var(--text-1)]"
              />

              {resendError && (
                <AuthNotification type="error" message={resendError} />
              )}

              {resendSuccess && (
                <AuthNotification
                  type="success"
                  message="¡Enlace de verificación enviado! Revisa tu buzón."
                />
              )}

              <button
                type="submit"
                disabled={resendLoading || cooldown > 0}
                className="w-full inline-flex justify-center items-center gap-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--off-white)] disabled:border-[var(--border-light)] disabled:text-[var(--text-4)] border border-transparent text-white font-semibold py-2.5 rounded-[18px] text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                {resendLoading && <Loader2 size={12} className="animate-spin" />}
                {cooldown > 0
                  ? `Reenviar en ${cooldown}s`
                  : "Enviar nuevo enlace"}
              </button>
            </form>
          </div>

          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors font-semibold"
            >
              <ArrowLeft size={12} />
              Volver al inicio de sesión
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-[var(--text-3)]">Cargando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
