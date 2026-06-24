"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { ShieldAlert, Hourglass, ArrowLeft, HeartHandshake } from "lucide-react"
import { useRouter } from "next/navigation"
import { getLockedUntil, setLockedUntil } from "@/lib/mock-auth"

export default function AccountLockedPage() {
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const checkLock = () => {
      const lockedUntil = getLockedUntil()
      const diff = Math.max(0, Math.round((lockedUntil - Date.now()) / 1000))
      setTimeLeft(diff)
    }

    checkLock()
    const timer = setInterval(() => {
      const lockedUntil = getLockedUntil()
      const diff = Math.max(0, Math.round((lockedUntil - Date.now()) / 1000))
      setTimeLeft(diff)
      if (diff <= 0) {
        clearInterval(timer)
        setLockedUntil(0) // Reset lock
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleReturn = () => {
    router.push("/auth/login")
  }

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6 text-center">
      {/* Icon */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--red-soft)] text-[var(--red)] mb-2 mx-auto">
        <motion.div
          animate={timeLeft > 0 ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ShieldAlert size={32} />
        </motion.div>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-[1.15]">
          Cuenta Bloqueada
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
          Por razones de seguridad, hemos bloqueado temporalmente el acceso a tu cuenta debido a 5 intentos fallidos consecutivos de inicio de sesión.
        </p>
      </div>

      {/* Timer Section */}
      <div className="p-5 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[18px] max-w-xs mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-[var(--text-3)] text-xs font-semibold">
          <Hourglass size={14} className={timeLeft > 0 ? "animate-spin" : ""} />
          <span>Tiempo restante para desbloqueo:</span>
        </div>
        <div className="text-3xl font-mono font-bold text-[var(--text-1)] tracking-wider">
          {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
        </div>
      </div>

      {/* Helper text / support */}
      <p className="text-xs text-[var(--text-4)] max-w-[280px] mx-auto leading-normal">
        Si crees que esto es un error o no recuerdas tus credenciales, por favor contacta al administrador de TI de tu empresa.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-light)] max-w-xs mx-auto">
        <button
          onClick={handleReturn}
          disabled={timeLeft > 0}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--text-4)] disabled:opacity-40 text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          Volver al Login
        </button>

        <a
          href="mailto:soporte@contamind.com"
          className="inline-flex items-center justify-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors font-medium py-1"
        >
          <HeartHandshake size={14} />
          Contactar a Soporte
        </a>
      </div>
    </div>
  )
}
