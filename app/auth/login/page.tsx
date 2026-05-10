"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useTenantStore } from "@/store/tenantStore"

const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      const { error: authError, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) throw authError

      // Fetch perfil y empresas desde el backend
      const token = authData.session?.access_token
      if (token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (res.ok) {
            const userData = await res.json()
            const companies: Array<{ id: string }> = userData.companies || []
            if (companies.length > 0) {
              useTenantStore.getState().setActiveCompanyId(companies[0].id)
            }
          } else if (res.status === 403 && res.headers.get("X-2FA-Required") === "true") {
            router.push("/auth/2fa")
            return
          }
        } catch {
          // Backend no disponible — continúa el flujo de login
        }
      }

      toast.success("¡Bienvenido de vuelta!")
      router.push("/app/dashboard")
      router.refresh()
    } catch (err: unknown) {
      triggerShake()
      const message = err instanceof Error ? err.message : "Error al iniciar sesión"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" expand={false} richColors />

      {/* Header */}
      <div>
        <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Bienvenido de vuelta
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)]">Ingresa a tu cuenta de ContaMind</p>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        animate={shakeError ? { x: [0, -7, 7, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-5"
        noValidate
      >
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="login-email">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="nombre@empresa.com"
            className={`w-full px-4 py-3 rounded-[14px] border ${
              errors.email
                ? "border-[var(--red)] focus:ring-[var(--red)]/20"
                : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
            } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
          />
          {errors.email && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-[var(--text-2)]" htmlFor="login-password">
              Contraseña
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 pr-11 rounded-[14px] border ${
                errors.password
                  ? "border-[var(--red)] focus:ring-[var(--red)]/20"
                  : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
              } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>
      </motion.form>

      {/* Footer */}
      <p className="text-center text-sm text-[var(--text-3)]">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors">
          Empieza gratis →
        </Link>
      </p>
    </div>
  )
}
