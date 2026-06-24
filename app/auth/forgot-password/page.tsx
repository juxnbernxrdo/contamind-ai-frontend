"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "motion/react"
import { Loader2, ArrowLeft, ShieldAlert, KeyRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

const forgotSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true)
    setError("")
    try {
      await apiClient.post("/auth/password-reset/request", data)
      router.push(`/auth/email-sent?email=${encodeURIComponent(data.email)}&type=recovery`)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al enviar el enlace de recuperación. Intente nuevamente."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Icon & Header */}
      <div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)] mb-5">
          <KeyRound size={24} />
        </div>
        <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)] leading-relaxed">
          No te preocupes. Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-[var(--red-soft)] border border-[var(--red)]/20 rounded-[14px] text-[var(--red)] text-xs font-medium flex items-center gap-2">
          <ShieldAlert size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="forgot-email">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            id="forgot-email"
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

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Enviando enlace...
            </>
          ) : (
            "Enviar enlace de recuperación"
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
