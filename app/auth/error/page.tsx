"use client"

import React, { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { AlertOctagon, ArrowLeft, RefreshCw, Terminal, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get("message") || "Ocurrió un error inesperado al validar sus credenciales."
  const errorCode = searchParams.get("code") || "UNKNOWN_AUTH_ERROR"
  const [showTrace, setShowTrace] = useState(false)

  const simulatedStackTrace = `Error: ${errorCode}: ${errorMsg}
    at validateSession (http://localhost:3000/_next/static/chunks/app/auth/layout.tsx:142:12)
    at async processLoginFlow (http://localhost:3000/_next/static/chunks/app/auth/login/page.tsx:88:24)
    at async onSubmit (http://localhost:3000/_next/static/chunks/app/auth/login/page.tsx:39:5)
    at Object.run (http://localhost:3000/_next/static/chunks/react-dom.development.js:985:12)
    at dispatchEvent (http://localhost:3000/_next/static/chunks/react-dom.development.js:23114:14)
    at invokeGuardedCallbackDev (http://localhost:3000/_next/static/chunks/react-dom.development.js:23163:16)
    at invokeGuardedCallback (http://localhost:3000/_next/static/chunks/react-dom.development.js:23227:10)
    at invokeGuardedCallbackAndCatchFirstError (http://localhost:3000/_next/static/chunks/react-dom.development.js:23241:25)`

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--red-soft)] text-[var(--red)] mb-4 mx-auto">
          <AlertOctagon size={32} />
        </div>

        <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight leading-[1.15] mb-2">
          Error de Autenticación
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
          La plataforma experimentó una dificultad al intentar validar tu sesión. Por favor revisa los detalles a continuación.
        </p>
      </div>

      {/* Error detail */}
      <div className="p-4 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[14px] text-left space-y-1">
        <div className="text-[9px] uppercase font-bold text-[var(--text-4)] tracking-wider">
          Código de Error: {errorCode}
        </div>
        <p className="text-xs font-medium text-[var(--text-2)] leading-normal">
          {errorMsg}
        </p>
      </div>

      {/* Diagnostic collapsible (Trace toggle) */}
      <div className="border border-[var(--border-light)] rounded-[14px] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTrace(!showTrace)}
          className="w-full flex items-center justify-between p-3 bg-[var(--off-white)] hover:bg-[var(--border-light)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors text-xs font-semibold"
        >
          <div className="flex items-center gap-1.5">
            <Terminal size={14} />
            <span>Detalles del diagnóstico (para desarrolladores)</span>
          </div>
          {showTrace ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showTrace && (
          <div className="p-3 bg-black text-[#a6accd] font-mono text-[10px] leading-relaxed overflow-x-auto border-t border-[var(--border-light)] max-h-40 custom-scrollbar select-all whitespace-pre">
            {simulatedStackTrace}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[var(--border-light)] max-w-xs mx-auto">
        <Link
          href="/auth/login"
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <RefreshCw size={14} className="mt-0.5" />
          Reintentar Acceso
        </Link>

        <Link
          href="/auth/login"
          className="w-full bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <ArrowLeft size={14} />
          Volver al Login
        </Link>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
