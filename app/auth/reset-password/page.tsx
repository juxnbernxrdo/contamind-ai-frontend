"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"

const resetSchema = z.object({
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error

      setIsSuccess(true)
      toast.success("Contraseña actualizada con éxito")
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-[var(--green-soft)] text-[var(--green)] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-1)]">¡Éxito!</h2>
          <p className="text-[var(--text-3)]">Tu contraseña ha sido actualizada. Serás redirigido al login.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      <div>
        <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Nueva contraseña
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)]">Ingresa tu nueva clave de acceso.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="password">
            Nueva contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" size={18} />
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-3 rounded-[14px] border ${
                errors.password ? "border-[var(--red)] focus:ring-[var(--red)]/20" : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
              } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-3)]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="confirmPassword">
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" size={18} />
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-3 rounded-[14px] border ${
                errors.confirmPassword ? "border-[var(--red)] focus:ring-[var(--red)]/20" : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
              } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1">{errors.confirmPassword.message}</p>
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
              Actualizando...
            </>
          ) : (
            "Actualizar contraseña"
          )}
        </button>
      </form>
    </div>
  )
}
