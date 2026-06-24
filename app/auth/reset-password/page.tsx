"use client"

import React, { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "motion/react"
import { Loader2, ShieldCheck, ShieldAlert, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import PasswordStrength from "@/components/auth/PasswordStrength"
import { apiClient } from "@/lib/api-client"

const resetSchema = z
  .object({
    password: z
      .string()
      .min(12, { message: "La contraseña debe tener al menos 12 caracteres" })
      .regex(/[a-z]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
      .regex(/[0-9]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
    confirmPassword: z.string().min(1, { message: "Confirme su contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type ResetFormValues = z.infer<typeof resetSchema>

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const token = searchParams.get("token") || "mock-token"
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  const passwordVal = watch("password")

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true)
    setError("")
    try {
      await apiClient.post("/auth/password-reset/confirm", {
        token,
        newPassword: data.password,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "El enlace de recuperación es inválido o ha expirado. Por favor solicite otro."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--green-soft)] text-[var(--green)] mb-2 mx-auto"
        >
          <ShieldCheck size={32} />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight">
            Contraseña restablecida
          </h2>
          <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mx-auto leading-relaxed">
            Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/auth/login"
            className="w-full inline-flex justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 rounded-[24px] transition-all shadow-sm active:scale-[0.98]"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)] mb-5">
          <Lock size={24} />
        </div>
        <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Restablecer Contraseña
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)] leading-relaxed">
          Ingresa tu nueva contraseña para volver a acceder a tu cuenta de ContaMind.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-[var(--red-soft)] border border-[var(--red)]/25 rounded-[14px] text-[var(--red)] text-xs font-medium flex items-center gap-2">
          <ShieldAlert size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* New Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="new-password">
            Nueva contraseña
          </label>
          <input
            {...register("password")}
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 rounded-[14px] border ${
              errors.password
                ? "border-[var(--red)] focus:ring-[var(--red)]/20"
                : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
            } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
          />
          {errors.password && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {errors.password.message}
            </p>
          )}
          <PasswordStrength password={passwordVal} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="confirm-password">
            Confirmar contraseña
          </label>
          <input
            {...register("confirmPassword")}
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 rounded-[14px] border ${
              errors.confirmPassword
                ? "border-[var(--red)] focus:ring-[var(--red)]/20"
                : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
            } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1">
              <ShieldAlert size={12} /> {errors.confirmPassword.message}
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
              Actualizando contraseña...
            </>
          ) : (
            "Restablecer contraseña"
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center pt-2">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors font-medium"
        >
          <ArrowLeft size={14} />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
