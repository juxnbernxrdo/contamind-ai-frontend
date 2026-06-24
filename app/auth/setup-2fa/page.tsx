"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Loader2, ShieldCheck, Copy, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

const DIGITS = 6

export default function Setup2FAPage() {
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [copied, setCopied] = useState(false)
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [shakeError, setShakeError] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetch2FASetup = async () => {
      try {
        const { data } = await apiClient.post("/auth/2fa/setup")
        setQrCode(data.qrCodeDataUrl || data.qrCodeUrl)
        setSecret(data.secret)
      } catch (e) {
        toast.error("Error al inicializar la configuración de 2FA.")
      }
    }
    fetch2FASetup()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    toast.success("Clave secreta copiada al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  const verifySetup = async (code: string) => {
    setIsLoading(true)
    try {
      const { data } = await apiClient.post("/auth/2fa/activate", { token: code })
      toast.success("¡Autenticación en dos pasos activada exitosamente!")
      
      // Store recovery codes in sessionStorage for recovery page
      sessionStorage.setItem("contamind_recovery_codes", JSON.stringify(data.backupCodes))
      router.push("/auth/recovery-codes")
    } catch (err: any) {
      triggerShake()
      setDigits(Array(DIGITS).fill(""))
      inputRefs.current[0]?.focus()
      toast.error(err.response?.data?.message || "Código incorrecto. Verifique el token de su aplicación.")
    } finally {
      setIsLoading(false)
    }
  }

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
      if (allFilled) verifySetup(next.join(""))
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
    if (pasted.length === DIGITS) verifySetup(pasted)
  }

  const isComplete = digits.join("").length === DIGITS

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)] mb-4">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Configurar Doble Factor
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] leading-relaxed">
          Protege tu cuenta con una capa de seguridad adicional. Escanea el código QR con tu aplicación autenticadora (Google Authenticator, Microsoft Authenticator o 1Password).
        </p>
      </div>

      {/* QR Code and Secret */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[18px]">
        {/* QR Wrapper */}
        <div className="flex justify-center bg-white p-3 rounded-[12px] border border-[var(--border-light)] w-full max-w-[170px] mx-auto">
          {qrCode ? (
            <img src={qrCode} alt="Setup QR Code" className="w-full h-auto aspect-square rounded-[8px]" />
          ) : (
            <div className="w-full aspect-square bg-[var(--off-white)] animate-pulse rounded-[8px] flex items-center justify-center text-xs text-[var(--text-4)]">
              Generando...
            </div>
          )}
        </div>

        {/* Manual key */}
        <div className="space-y-2 text-left w-full">
          <span className="text-xs font-semibold text-[var(--text-3)]">
            Ingreso Manual:
          </span>
          <div className="relative flex items-center bg-[var(--white)] rounded-[10px] border border-[var(--border-light)] p-2">
            <span className="text-xs font-mono font-bold text-[var(--text-1)] tracking-wider truncate max-w-[180px]">
              {secret || "Generando..."}
            </span>
            <button
              onClick={handleCopy}
              disabled={!secret}
              className="absolute right-1.5 p-1.5 rounded-md hover:bg-[var(--off-white)] text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
              title="Copiar clave"
            >
              {copied ? <Check size={14} className="text-[var(--green)]" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-[10px] text-[var(--text-4)] leading-normal">
            Si no puedes escanear el código QR, ingresa este secreto manualmente en tu aplicación de autenticación.
          </p>
        </div>
      </div>

      {/* Code validation */}
      <div className="space-y-3 pt-2">
        <label className="text-sm font-semibold text-[var(--text-2)] ml-1">
          Código de confirmación
        </label>
        
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={shakeError ? { x: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div
            className="flex gap-2.5"
            onPaste={handlePaste}
            role="group"
            aria-label="Código de verificación de 6 dígitos"
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                id={`setup-otp-digit-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                autoFocus={i === 0}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isLoading}
                className={`w-11 h-14 text-center text-xl font-bold rounded-[10px] border focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] text-[var(--text-1)] focus:bg-[var(--white)] ${
                  digit
                    ? "border-[var(--accent)] focus:ring-[var(--accent-soft)]"
                    : "border-[var(--border-light)] focus:ring-[var(--accent-soft)]"
                }`}
                style={{ caretColor: "transparent" }}
              />
            ))}
          </div>

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)]">
              <Loader2 className="animate-spin" size={14} />
              Verificando...
            </div>
          )}
        </motion.div>
      </div>

      {/* Back button */}
      <div className="text-center pt-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors font-medium"
        >
          <ArrowLeft size={12} />
          Volver
        </button>
      </div>
    </div>
  )
}
