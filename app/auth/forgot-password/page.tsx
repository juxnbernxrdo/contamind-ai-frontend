"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"

const forgotSchema = z.object({
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido" }),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      })

      if (error) throw error

      setIsSent(true)
      toast.success("Enlace de recuperación enviado")
    } catch (err: any) {
      toast.error(err.message || "Error al enviar el enlace")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-16 h-16 bg-[var(--green-soft)] text-[var(--green)] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-1)]">Revisa tu correo</h2>
          <p className="text-[var(--text-3)]">
            Hemos enviado un enlace de recuperación a tu bandeja de entrada.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]"
        >
          <ArrowLeft size={16} /> Volver al inicio de sesión
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      <div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-3)] hover:text-[var(--text-1)] mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Volver al login
        </Link>
        <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Recuperar contraseña
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)]">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="email">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" size={18} />
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="nombre@empresa.com"
              className={`w-full pl-10 pr-4 py-3 rounded-[14px] border ${
                errors.email ? "border-[var(--red)] focus:ring-[var(--red)]/20" : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
              } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--text-1)] dark:bg-[var(--accent)] hover:bg-black dark:hover:bg-[var(--accent-hover)] disabled:bg-[var(--text-1)]/40 text-white font-medium py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Enviando...
            </>
          ) : (
            "Enviar enlace"
          )}
        </button>
      </form>
    </div>
  )
}
