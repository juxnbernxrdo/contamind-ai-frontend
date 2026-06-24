"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "motion/react"
import { Loader2, ShieldAlert, Eye, EyeOff, Hourglass } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

const reloginSchema = z.object({
  password: z.string().min(1, { message: "Ingrese su contraseña" }),
})

type ReloginFormValues = z.infer<typeof reloginSchema>

export default function SessionExpiredPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  const [apiError, setApiError] = useState("")
  const { login, user } = useAuth()
  const router = useRouter()

  const email = user?.email || "usuario@empresa.com"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReloginFormValues>({
    resolver: zodResolver(reloginSchema),
  })

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  const onSubmit = async (data: ReloginFormValues) => {
    setIsLoading(true)
    setApiError("")
    try {
      await login({ email, password: data.password })
      router.push("/dashboard")
    } catch (err: any) {
      triggerShake()
      setApiError(
        err.response?.data?.message ||
          "Contraseña incorrecta. Por favor intente nuevamente."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-[18px] bg-[var(--amber-soft)] text-[var(--amber)] mb-4 mx-auto"
        >
          <Hourglass size={28} />
        </motion.div>

        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Sesión Expirada
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
          Tu sesión ha terminado por inactividad. Ingresa tu contraseña para continuar donde estabas.
        </p>
      </div>

      {/* API error alert */}
      {apiError && (
        <div className="p-3 bg-[var(--red-soft)] border border-[var(--red)]/20 rounded-[14px] text-[var(--red)] text-xs font-medium flex items-center gap-2">
          <ShieldAlert size={14} className="flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        animate={shakeError ? { x: [0, -7, 7, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-4"
        noValidate
      >
        {/* Read-only email */}
        <div className="space-y-1.5 p-3 rounded-[10px] bg-[var(--off-white)] border border-[var(--border-light)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-4)] tracking-widest block ml-0.5">
            Usuario
          </span>
          <span className="text-sm font-semibold text-[var(--text-2)] ml-0.5 block truncate">
            {email}
          </span>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="expired-password">
            Contraseña
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="expired-password"
              type={showPassword ? "text" : "password"}
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
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Reanudando sesión...
            </>
          ) : (
            "Reanudar Sesión"
          )}
        </button>
      </motion.form>

      {/* Log out option */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            // Force return to login, clear local storage
            router.push("/auth/login")
          }}
          className="text-xs text-[var(--text-4)] hover:text-[var(--text-2)] hover:underline font-semibold"
        >
          ¿No eres tú? Iniciar sesión con otra cuenta
        </button>
      </div>
    </div>
  )
}
