"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { ShieldCheck, Copy, Download, Printer, Check, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const FALLBACK_CODES = [
  "ABCD-1234-EFGH",
  "IJKL-5678-MNOP",
  "QRST-9012-UVWX",
  "YZAB-3456-CDEF",
  "GHIJ-7890-KLMN",
  "OPQR-1234-STUV",
  "WXYZ-5678-ABCD",
  "EFGH-9012-IJKL"
]

export default function RecoveryCodesPage() {
  const [codes, setCodes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("contamind_recovery_codes");
      let activeCodes = FALLBACK_CODES;
      if (stored) {
        try {
          activeCodes = JSON.parse(stored);
        } catch (e) {}
      }
      Promise.resolve().then(() => {
        setCodes(activeCodes);
      });
    }
  }, []);

  const handleCopy = () => {
    const textToCopy = codes.join("\n")
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast.success("Códigos copiados al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const textToDownload = `CODIGOS DE RECUPERACION - CONTAMIND AI\nFecha: ${new Date().toLocaleDateString()}\n\nGuarda estos codigos en un lugar seguro. Cada codigo se puede utilizar una sola vez para acceder a tu cuenta si pierdes el dispositivo 2FA.\n\n${codes.join("\n")}`
    const element = document.createElement("a")
    const file = new Blob([textToDownload], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "contamind-codigos-recuperacion.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Archivo de códigos descargado")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFinish = () => {
    sessionStorage.removeItem("contamind_recovery_codes")
    toast.success("Configuración de seguridad completada")
    router.push("/dashboard")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--green-soft)] text-[var(--green)] mb-4">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Códigos de Recuperación
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] leading-relaxed">
          Guarda estos códigos en un lugar seguro. Si pierdes el acceso a tu aplicación de autenticación, podrás iniciar sesión ingresando cualquiera de estos códigos. **Cada uno funciona una sola vez.**
        </p>
      </div>

      {/* Grid of codes */}
      <div className="grid grid-cols-2 gap-3 p-5 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[18px] font-mono text-sm font-semibold tracking-wider text-[var(--text-1)] text-center">
        {codes.map((code, idx) => (
          <div
            key={idx}
            className="bg-[var(--white)] py-2.5 px-3 rounded-[10px] border border-[var(--border-light)] shadow-sm select-all"
          >
            {code}
          </div>
        ))}
      </div>

      {/* Action triggers */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={handleCopy}
          className="flex flex-col items-center justify-center p-3 rounded-[14px] bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] text-xs font-semibold gap-1.5 transition-all active:scale-[0.98]"
        >
          {copied ? <Check size={16} className="text-[var(--green)]" /> : <Copy size={16} />}
          <span>Copiar</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex flex-col items-center justify-center p-3 rounded-[14px] bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] text-xs font-semibold gap-1.5 transition-all active:scale-[0.98]"
        >
          <Download size={16} />
          <span>Descargar</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex flex-col items-center justify-center p-3 rounded-[14px] bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] text-xs font-semibold gap-1.5 transition-all active:scale-[0.98]"
        >
          <Printer size={16} />
          <span>Imprimir</span>
        </button>
      </div>

      {/* Warning note */}
      <div className="p-4 bg-[var(--amber-soft)] border border-[var(--amber)]/20 rounded-[14px] text-[var(--amber)] text-xs leading-normal">
        <strong>Importante:</strong> Si pierdes tu dispositivo 2FA y no dispones de estos códigos, no podrás recuperar el acceso a tu cuenta. El equipo de soporte no puede restablecer tu doble factor por motivos de seguridad.
      </div>

      {/* Continue */}
      <button
        onClick={handleFinish}
        className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98]"
      >
        He guardado los códigos
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
