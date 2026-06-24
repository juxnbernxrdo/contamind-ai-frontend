"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Loader2, CheckCircle2, XCircle, ArrowLeft, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || "mock-token"
  const router = useRouter()

  const [state, setState] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
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
          setErrorMessage(
            err.response?.data?.message ||
              "El token de verificación es inválido o ha caducado."
          )
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

  return (
    <div className="space-y-8 text-center">
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
          <p className="text-sm text-[var(--text-3)] max-w-xs">
            Por favor espera un momento mientras validamos tus credenciales con el SRI y nuestro servidor.
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
            <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight">
              ¡Correo verificado!
            </h2>
            <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
              Tu cuenta ha sido activada y confirmada exitosamente. Ya puedes acceder al panel de ContaMind AI.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/auth/login"
              className="w-full inline-flex justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 rounded-[24px] transition-all shadow-sm active:scale-[0.98]"
            >
              Iniciar Sesión
            </Link>
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
            <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight">
              Fallo de Verificación
            </h2>
            <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
              {errorMessage}
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Link
              href="/auth/login"
              className="w-full inline-flex justify-center bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] font-semibold py-3 rounded-[24px] transition-all active:scale-[0.98]"
            >
              <ArrowLeft size={16} className="mr-1.5 mt-0.5" />
              Volver al Login
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
