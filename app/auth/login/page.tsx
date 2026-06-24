"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "motion/react"
import { Loader2, Eye, EyeOff, ShieldAlert, Fingerprint } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

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
      await login(data)
    } catch (err: any) {
      triggerShake()
      const status = err.response?.status
      const message = err.response?.data?.message || ""
      if (status === 403) {
        router.push("/auth/account-locked")
      } else if (status === 500) {
        router.push(`/auth/error?code=INTERNAL_SERVER_ERROR&message=${encodeURIComponent(message)}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
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

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[var(--border-light)]"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-4)]">o ingresar con</span>
          <div className="flex-grow border-t border-[var(--border-light)]"></div>
        </div>

        {/* SSO / Passkeys */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-label="Iniciar sesión con Llave de paso"
            onClick={() => router.push("/auth/passkeys")}
            className="w-full flex items-center justify-center gap-2.5 px-4 h-[42px] rounded-[24px] bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] hover:text-[var(--text-1)] font-semibold text-xs transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed select-none"
          >
            <Fingerprint size={18} className="text-[var(--accent)] flex-shrink-0" />
            <span>Passkey</span>
          </button>
          <button
            type="button"
            aria-label="Iniciar sesión con Google Workspace"
            onClick={async () => {
              setIsLoading(true)
              try {
                await login({ email: "google-user@contamind.com", password: "password123" })
              } catch (e) {
                // error is already toasted by hook
              } finally {
                setIsLoading(false)
              }
            }}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 h-[42px] rounded-[24px] bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] hover:text-[var(--text-1)] font-semibold text-xs transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed select-none"
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>
        </div>
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
