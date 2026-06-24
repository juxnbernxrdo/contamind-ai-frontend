"use client"

import React, { useState, useRef, useCallback, Suspense } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Loader2, ShieldCheck, RotateCcw, ArrowLeft, Key } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

const DIGITS = 6

function TwoFAPageContent() {
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""))
  const [recoveryCode, setRecoveryCode] = useState("")
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verify2FA } = useAuth()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId") || "mock_user_2fa"

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  const verifyCode = useCallback(async (code: string) => {
    if (!code || isLoading) return
    setIsLoading(true)

    try {
      await verify2FA(code, isRecoveryMode, userId || undefined)
    } catch (err: unknown) {
      triggerShake()
      if (!isRecoveryMode) {
        setDigits(Array(DIGITS).fill(""))
        inputRefs.current[0]?.focus()
      } else {
        setRecoveryCode("")
      }
    } finally {
      setIsLoading(false)
    }
  }, [userId, isLoading, verify2FA, isRecoveryMode])

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = sanitized
    setDigits(next)

    if (sanitized && index < DIGITS - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    
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

  const handleManualSubmit = () => {
    if (isRecoveryMode) {
      verifyCode(recoveryCode)
    } else {
      const code = digits.join("")
      if (code.length === DIGITS) verifyCode(code)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setTimeout(() => setIsResending(false), 2000)
    toast.info("Los códigos TOTP se generan automáticamente en tu app de autenticación.")
  }

  const isComplete = isRecoveryMode
    ? recoveryCode.trim().length >= 10
    : digits.join("").length === DIGITS

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--accent-soft)] text-[var(--accent)] mb-5 mx-auto"
        >
          {isRecoveryMode ? <Key size={32} /> : <ShieldCheck size={32} />}
        </motion.div>

        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          {isRecoveryMode ? "Código de Recuperación" : "Verificación en dos pasos"}
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] max-w-[320px] mx-auto leading-relaxed">
          {isRecoveryMode
            ? "Ingresa uno de tus códigos de recuperación de 12 caracteres (ej: ABCD-1234-EFGH)."
            : "Ingresa el código de 6 dígitos de tu aplicación de autenticación."}
        </p>
      </div>

      {/* OTP Input or Recovery Code Input */}
      <motion.div
        className="flex flex-col items-center gap-6"
        animate={shakeError ? { x: [0, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {!isRecoveryMode ? (
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
        ) : (
          <div className="w-full max-w-[320px] space-y-2">
            <input
              type="text"
              placeholder="ABCD-1234-EFGH"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)] focus:outline-none focus:ring-[3px] text-center font-mono font-bold tracking-wider bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm uppercase"
            />
          </div>
        )}

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
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98]"
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
      <div className="flex flex-col items-center gap-3 pt-2 border-t border-[var(--border-light)]">
        {!isRecoveryMode ? (
          <>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--accent)] transition-colors disabled:opacity-50 font-medium"
            >
              <RotateCcw size={13} className={isResending ? "animate-spin" : ""} />
              {isResending ? "Procesando..." : "¿No ves el código?"}
            </button>
            <button
              onClick={() => setIsRecoveryMode(true)}
              className="text-xs text-[var(--accent)] hover:underline font-semibold"
            >
              Usar código de recuperación de respaldo
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsRecoveryMode(false)}
            className="text-xs text-[var(--accent)] hover:underline font-semibold"
          >
            Usar código 2FA temporal estándar
          </button>
        )}

        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 text-xs text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors font-medium mt-1"
        >
          <ArrowLeft size={13} />
          Volver al login
        </Link>
      </div>
    </div>
  )
}

export default function TwoFAPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TwoFAPageContent />
    </Suspense>
  )
}
