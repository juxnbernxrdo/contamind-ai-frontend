"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "motion/react"
import { Loader2, ShieldAlert, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

const reauthSchema = z.object({
  password: z.string().min(1, { message: "Ingrese su contraseña" }),
})

type ReauthFormValues = z.infer<typeof reauthSchema>

export default function ReauthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  const [apiError, setApiError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReauthFormValues>({
    resolver: zodResolver(reauthSchema),
  })

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  const onSubmit = async (data: ReauthFormValues) => {
    setIsLoading(true)
    setApiError("")
    try {
      const response = await apiClient.post("/auth/reauth", { password: data.password })
      toast.success("Seguridad confirmada. Acción autorizada.")
      
      // Simulating returning to previous screen or dashboard
      sessionStorage.setItem("contamind_reauth_token", response.data.reauthToken)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
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
      <div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--red-soft)] text-[var(--red)] mb-4">
          <Lock size={24} />
        </div>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Acción Protegida
        </h2>
        <p className="text-[0.95rem] text-[var(--text-3)] leading-relaxed">
          Estás intentando realizar una operación de alta seguridad (ej. modificar datos fiscales, firma electrónica o credenciales de la empresa). Por favor confirma tu identidad ingresando tu contraseña actual.
        </p>
      </div>

      {/* Error alert */}
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
        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="reauth-password">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="reauth-password"
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
              Confirmando seguridad...
            </>
          ) : (
            "Autorizar Acción"
          )}
        </button>
      </motion.form>

      {/* Back button */}
      <div className="text-center pt-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors font-medium"
        >
          <ArrowLeft size={12} />
          Cancelar y regresar
        </button>
      </div>
    </div>
  )
}
