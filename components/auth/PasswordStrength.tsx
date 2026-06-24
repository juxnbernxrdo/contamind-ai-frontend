"use client"

import React, { useMemo } from "react"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password?: string
}

export default function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const criteria = useMemo(() => {
    return [
      { id: "length", label: "Mínimo 12 caracteres", met: password.length >= 12 },
      { id: "uppercase", label: "Una letra mayúscula", met: /[A-Z]/.test(password) },
      { id: "lowercase", label: "Una letra minúscula", met: /[a-z]/.test(password) },
      { id: "number", label: "Un número", met: /[0-9]/.test(password) },
      { id: "special", label: "Un carácter especial (ej. !@#$%)", met: /[^A-Za-z0-9]/.test(password) },
    ]
  }, [password])

  const score = useMemo(() => {
    if (!password) return 0
    return criteria.filter((c) => c.met).length
  }, [criteria, password])

  const { colorClass, label, widthClass } = useMemo(() => {
    switch (score) {
      case 0:
        return { colorClass: "bg-[var(--text-4)]", label: "Sin contraseña", widthClass: "w-0" }
      case 1:
        return { colorClass: "bg-[var(--red)]", label: "Muy débil", widthClass: "w-1/5" }
      case 2:
        return { colorClass: "bg-[var(--amber)]", label: "Débil", widthClass: "w-2/5" }
      case 3:
        return { colorClass: "bg-yellow-500", label: "Media", widthClass: "w-3/5" }
      case 4:
        return { colorClass: "bg-[var(--accent)]", label: "Fuerte", widthClass: "w-4/5" }
      case 5:
        return { colorClass: "bg-[var(--green)]", label: "Excelente", widthClass: "w-full" }
      default:
        return { colorClass: "bg-[var(--text-4)]", label: "", widthClass: "w-0" }
    }
  }, [score])

  if (!password) return null

  return (
    <div className="space-y-3 p-4 rounded-[14px] bg-[var(--off-white)] border border-[var(--border-light)] transition-all">
      <div className="flex justify-between items-center text-xs">
        <span className="text-[var(--text-3)]">Seguridad:</span>
        <span className="font-semibold text-[var(--text-2)]">{label}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[var(--border-light)] rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} ${widthClass} transition-all duration-300 rounded-full`} />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
        {criteria.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 text-xs">
            {item.met ? (
              <span className="text-[var(--green)] flex-shrink-0">
                <Check size={14} className="stroke-[3px]" />
              </span>
            ) : (
              <span className="text-[var(--text-4)] flex-shrink-0">
                <X size={14} className="stroke-[3px]" />
              </span>
            )}
            <span className={item.met ? "text-[var(--text-2)]" : "text-[var(--text-3)]"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
