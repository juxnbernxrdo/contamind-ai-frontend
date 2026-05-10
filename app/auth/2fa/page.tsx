"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useTenantStore } from "@/store/tenantStore"

const DIGITS = 6

export default function TwoFactorPage() {
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  const [factorId, setFactorId] = useState<string | null>(null)
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(DIGITS).fill(null))
  const router = useRouter()
  const supabase = createClient()

  // Obtener el factorId del MFA al montar el componente
  useEffect(() => {
    async function fetchFactor() {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (!error && data.totp.length > 0) {
        setFactorId(data.totp[0].id)
      }
    }
    fetchFactor()
  }, [supabase])

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = sanitized
    setDigits(next)

    if (sanitized && index < DIGITS - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    // Auto-submit when all digits are filled
    if (sanitized && index === DIGITS - 1) {
      const allFilled = next.every((d) => d !== "")
      if (allFilled) verifyCode(next.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === "ArrowRight" && index < DIGITS - 1) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS)
    if (!pasted) return
    const next = [...digits]
    pasted.split("").forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    const lastIdx = Math.min(pasted.length - 1, DIGITS - 1)
    inputRefs.current[lastIdx]?.focus()
    if (pasted.length === DIGITS) verifyCode(pasted)
  }

  const verifyCode = useCallback(async (code: string) => {
    if (code.length < DIGITS || isLoading) return
    setIsLoading(true)

    try {
      if (!factorId) throw new Error("No se encontró un factor de autenticación TOTP.")

      // 1. Crear el challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
      if (challengeError) throw challengeError

      // 2. Verificar con el código TOTP
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      })
      if (verifyError) throw verifyError

      // 3. Si hay sesión, sincronizar empresa
      const token = verifyData.session?.access_token
      if (token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const userData = await res.json()
            const companies: Array<{ id: string }> = userData.companies || []
            if (companies.length > 0) {
              useTenantStore.getState().setActiveCompanyId(companies[0].id)
            }
          }
        } catch {
          // no-op
        }
      }

      toast.success("Verificación exitosa")
      router.push("/app/dashboard")
      router.refresh()
    } catch (err: unknown) {
      triggerShake()
      setDigits(Array(DIGITS).fill(""))
      inputRefs.current[0]?.focus()
      const message = err instanceof Error ? err.message : "Código inválido. Intenta de nuevo."
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [factorId, isLoading, supabase, router])

  const handleManualSubmit = () => {
    const code = digits.join("")
    if (code.length === DIGITS) verifyCode(code)
  }

  const handleResend = async () => {
    setIsResending(true)
    setTimeout(() => setIsResending(false), 3000)
    toast.info("Los códigos TOTP se generan automáticamente en tu app de autenticación.")
  }

  const code = digits.join("")
  const isComplete = code.length === DIGITS

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--accent-soft)] text-[var(--accent)] mb-5 mx-auto"
        >
          <ShieldCheck size={32} />
        </motion.div>

        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Verificación en dos pasos
        </h2>
        <p className="text-[1rem] text-[var(--text-3)] max-w-[300px] mx-auto leading-relaxed">
          Ingresa el código de 6 dígitos de tu aplicación de autenticación.
        </p>
      </div>

      {/* OTP Input */}
      <motion.div
        className="flex flex-col items-center gap-6"
        animate={shakeError ? { x: [0, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div
          className="flex gap-3"
          onPaste={handlePaste}
          role="group"
          aria-label="Código de verificación de 6 dígitos"
        >
          {digits.map((digit, i) => (
            <motion.input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              id={`otp-digit-${i}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoFocus={i === 0}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isLoading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                width: "52px",
                height: "64px",
                borderRadius: "14px",
                border: digit
                  ? "2px solid var(--accent, #0071e3)"
                  : "1.5px solid var(--border-light, #e5e7eb)",
                background: digit ? "var(--accent-soft)" : "var(--off-white)",
                color: "var(--text-1)",
                fontSize: "24px",
                fontWeight: 700,
                textAlign: "center",
                outline: "none",
                transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                boxShadow: digit ? "0 0 0 3px var(--accent-soft)" : "none",
                caretColor: "transparent",
                cursor: isLoading ? "not-allowed" : "text",
                opacity: isLoading ? 0.6 : 1,
              }}
            />
          ))}
        </div>

        {/* Verify button */}
        <AnimatePresence>
          {isComplete && (
            <motion.button
              key="verify-btn"
              id="2fa-verify-submit"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              onClick={handleManualSubmit}
              disabled={isLoading}
              className="w-full max-w-[320px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verificando...
                </>
              ) : (
                "Verificar código"
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Helper links */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="flex items-center gap-1.5 text-sm text-[var(--text-3)] hover:text-[var(--accent)] transition-colors disabled:opacity-50"
        >
          <RotateCcw size={13} className={isResending ? "animate-spin" : ""} />
          {isResending ? "Procesando..." : "¿No ves el código?"}
        </button>

        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 text-sm text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
        >
          <ArrowLeft size={13} />
          Volver al login
        </Link>
      </div>
    </div>
  )
}
