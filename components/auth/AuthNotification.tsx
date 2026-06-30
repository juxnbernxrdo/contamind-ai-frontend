"use client"

import React from "react"
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from "lucide-react"

interface AuthNotificationProps {
  type: "error" | "success" | "warning" | "info"
  message: string
  className?: string
}

export function AuthNotification({ type, message, className = "" }: AuthNotificationProps) {
  if (!message) return null

  const config = {
    error: {
      bg: "bg-[var(--red-soft)]",
      border: "border-[var(--red)]/20",
      text: "text-[var(--red)]",
      icon: ShieldAlert,
      role: "alert",
    },
    success: {
      bg: "bg-[var(--green-soft)]",
      border: "border-[var(--green)]/20",
      text: "text-[var(--green)]",
      icon: CheckCircle2,
      role: "status",
    },
    warning: {
      bg: "bg-[var(--amber-soft)]",
      border: "border-[var(--amber)]/20",
      text: "text-[var(--amber)]",
      icon: AlertTriangle,
      role: "alert",
    },
    info: {
      bg: "bg-[var(--accent-soft)]",
      border: "border-[var(--accent)]/20",
      text: "text-[var(--accent)]",
      icon: Info,
      role: "status",
    },
  }

  const active = config[type]
  const Icon = active.icon

  return (
    <div
      className={`p-4 rounded-[14px] border ${active.bg} ${active.border} ${active.text} text-xs font-medium flex items-start gap-2.5 shadow-sm transition-all duration-300 ${className}`}
      role={active.role}
      aria-live={type === "error" || type === "warning" ? "assertive" : "polite"}
    >
      <Icon size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span className="leading-relaxed">{message}</span>
    </div>
  )
}
