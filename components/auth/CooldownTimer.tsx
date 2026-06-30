"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Timer } from "lucide-react"

interface UseCooldownProps {
  key: string
  defaultSeconds?: number
}

export function useCooldown({ key, defaultSeconds = 60 }: UseCooldownProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0)

  const getExpirationTime = useCallback(() => {
    if (typeof window === "undefined") return 0
    const stored = localStorage.getItem(`cooldown_${key}`)
    return stored ? parseInt(stored, 10) : 0
  }, [key])

  const calculateSecondsLeft = useCallback((expirationTime: number) => {
    const now = Date.now()
    if (expirationTime > now) {
      return Math.ceil((expirationTime - now) / 1000)
    }
    return 0
  }, [])

  useEffect(() => {
    const exp = getExpirationTime()
    const initial = calculateSecondsLeft(exp)

    const timeoutId = setTimeout(() => {
      setSecondsLeft(initial)
    }, 0)

    if (initial <= 0) {
      return () => clearTimeout(timeoutId)
    }

    const interval = setInterval(() => {
      const remaining = calculateSecondsLeft(exp)
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, [getExpirationTime, calculateSecondsLeft])

  const startCooldown = useCallback((customSeconds?: number) => {
    if (typeof window === "undefined") return
    const duration = (customSeconds ?? defaultSeconds) * 1000
    const expiration = Date.now() + duration
    localStorage.setItem(`cooldown_${key}`, expiration.toString())
    setSecondsLeft(customSeconds ?? defaultSeconds)
  }, [key, defaultSeconds])

  return {
    secondsLeft,
    startCooldown,
    isReady: secondsLeft <= 0,
  }
}

interface CooldownTimerProps {
  secondsLeft: number
  label?: string
  className?: string
}

export function CooldownTimer({ secondsLeft, label = "Reenviar en", className = "" }: CooldownTimerProps) {
  if (secondsLeft <= 0) return null

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-3)] select-none bg-[var(--off-white)] border border-[var(--border-light)] px-3 py-1.5 rounded-[10px] ${className}`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <Timer size={14} className="text-[var(--accent)] shrink-0" />
      <span>
        {label} <strong className="font-mono text-[var(--text-1)]">{secondsLeft}s</strong>
      </span>
    </div>
  )
}
