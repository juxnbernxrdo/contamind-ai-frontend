"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, ShieldCheck, Fingerprint, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { startRegistration, startAuthentication } from "@simplewebauthn/browser"
import { apiClient, setAccessToken } from "@/lib/api-client"
import { useAuth, broadcastChannel } from "@/hooks/use-auth"

export default function PasskeysPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<"register" | "authenticate" | null>(null)
  
  const { setUser, setAuthState } = useAuth()
  const router = useRouter()

  const handleStartPasskey = async (type: "register" | "authenticate") => {
    setIsLoading(true)
    setActiveAction(type)
    
    try {
      if (type === "register") {
        // 1. Get options from backend (requires JWT authenticated session)
        const { data: options } = await apiClient.post("/auth/webauthn/register/options")
        
        // 2. Start browser WebAuthn registration dialog
        const regResp = await startRegistration({
          optionsJSON: options,
        })
        
        // 3. Send verification payload to backend
        await apiClient.post("/auth/webauthn/register/verify", { response: regResp })
        toast.success("¡Llave de paso (Passkey) registrada exitosamente!")
      } else {
        // Authenticate / Login
        if (!email.trim()) {
          toast.error("Por favor ingrese su correo electrónico para iniciar sesión con Passkey.")
          setIsLoading(false)
          setActiveAction(null)
          return
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
          toast.error("Por favor ingrese un correo electrónico válido.")
          setIsLoading(false)
          setActiveAction(null)
          return
        }
        
        // 1. Get login options
        const { data: options } = await apiClient.post("/auth/webauthn/login/options", {
          email: email.trim().toLowerCase(),
        })
        
        // 2. Start browser WebAuthn authentication dialog
        const authResp = await startAuthentication({
          optionsJSON: options,
        })
        
        // 3. Send validation credentials payload to backend
        const { data } = await apiClient.post("/auth/webauthn/login/verify", {
          email: email.trim().toLowerCase(),
          response: authResp,
        })
        
        // Save session credentials in memory
        setAccessToken(data.accessToken)
        setUser(data.user)
        setAuthState("AUTHENTICATED")

        broadcastChannel?.postMessage({
          type: 'LOGIN',
          payload: { accessToken: data.accessToken, user: data.user },
        })
        
        toast.success("Sesión iniciada correctamente con Llave de paso.")
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error(error)
      const msg = error.response?.data?.message || error.message || "Fallo en la operación biométrica."
      toast.error(msg)
    } finally {
      setIsLoading(false)
      setActiveAction(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)] mb-4">
          <Fingerprint size={24} />
        </div>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Llaves de Paso (Passkeys)
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] leading-relaxed">
          Accede a tu cuenta de ContaMind AI utilizando tu huella dactilar, FaceID o el PIN de tu dispositivo de forma segura y sin necesidad de escribir contraseñas.
        </p>
      </div>

      {/* Visual illustration of passkey */}
      <div className="p-4 bg-[var(--off-white)] border border-[var(--border-light)] rounded-[18px] space-y-3 relative overflow-hidden">
        <div className="absolute top-2 right-2 text-[var(--accent)]/15">
          <Sparkles size={60} />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#121212] border border-[var(--border-light)] flex items-center justify-center text-[var(--accent)]">
            <ShieldCheck size={16} />
          </div>
          <span className="text-xs font-semibold text-[var(--text-2)]">
            Criptografía Asimétrica de Nivel Militar
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-3)] leading-normal max-w-[340px]">
          Las Llaves de Paso protegen tu cuenta contra ataques de phishing, ya que el par de claves criptográficas se asocia directamente a nuestro dominio y nunca se almacena en un servidor central.
        </p>
      </div>

      {/* Email input for login */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="passkey-email">
          Correo electrónico
        </label>
        <input
          id="passkey-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          placeholder="nombre@empresa.com"
          className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:outline-none transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm"
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => handleStartPasskey("authenticate")}
          disabled={isLoading}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading && activeAction === "authenticate" ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Fingerprint size={18} />
          )}
          Iniciar sesión con Passkey
        </button>

        <button
          onClick={() => handleStartPasskey("register")}
          disabled={isLoading}
          className="w-full bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading && activeAction === "register" ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Sparkles size={16} className="text-[var(--accent)]" />
          )}
          Registrar nuevo dispositivo
        </button>
      </div>

      {/* Back button */}
      <div className="text-center pt-2">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors font-medium"
        >
          <ArrowLeft size={12} />
          Volver al Login estándar
        </Link>
      </div>
    </div>
  )
}
