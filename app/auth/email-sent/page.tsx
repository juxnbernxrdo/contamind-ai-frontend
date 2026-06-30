"use client"

import React, { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useCooldown } from "@/components/auth/CooldownTimer"
import { EmailSentCard } from "@/components/auth/EmailSentCard"
import { toast } from "sonner"

function EmailSentContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const type = (searchParams.get("type") || "verification") as "verification" | "recovery"

  const { secondsLeft, startCooldown } = useCooldown({
    key: `resend_email_sent_${type}_${email}`,
    defaultSeconds: 60,
  })

  const [isResending, setIsResending] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return
    setIsResending(true)
    setResendError(null)
    setResendSuccess(false)

    try {
      const endpoint =
        type === "recovery"
          ? "/auth/password-reset/request"
          : "/auth/email-verification/resend"

      await apiClient.post(endpoint, { email })
      
      setResendSuccess(true)
      startCooldown(60)
      toast.success("Correo reenviado exitosamente.")
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "No se pudo reenviar el correo. Por favor intente más tarde."
      setResendError(msg)
      toast.error(msg)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <EmailSentCard
      email={email}
      type={type}
      onResend={handleResend}
      cooldown={secondsLeft}
      isResending={isResending}
      resendError={resendError}
      resendSuccess={resendSuccess}
    />
  )
}

export default function EmailSentPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-[var(--text-3)]">Cargando...</div>}>
      <EmailSentContent />
    </Suspense>
  )
}
