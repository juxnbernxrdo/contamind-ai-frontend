"use client"

import React, { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "motion/react"
import { Loader2, ArrowLeft, ArrowRight, User, Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import PasswordStrength from "@/components/auth/PasswordStrength"
import { AuthNotification } from "@/components/auth/AuthNotification"
import { toast } from "sonner"

const joinSchema = z
  .object({
    userName: z.string().min(3, { message: "El nombre es obligatorio (mínimo 3 caracteres)" }),
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

type JoinFormValues = z.infer<typeof joinSchema>

function RegisterJoinContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const code = searchParams.get("code") || ""
  const email = searchParams.get("email") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      userName: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const passwordVal = watch("password")

  const onSubmit = async (data: JoinFormValues) => {
    if (!code) {
      setError("Código de invitación inválido o ausente en la URL.")
      return
    }
    if (!email) {
      setError("Falta el correo electrónico del destinatario en la URL.")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      await apiClient.post("/auth/register/join", {
        email: email.trim().toLowerCase(),
        password: data.password,
        userName: data.userName,
        code,
      })

      toast.success("Registro completado. Por favor verifica tu correo.")
      router.push(`/auth/email-sent?email=${encodeURIComponent(email)}&type=verification`)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al unirse al workspace. Intente nuevamente."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!code) {
    return (
      <div className="space-y-6 text-center max-w-sm mx-auto">
        <AuthNotification
          type="error"
          message="Enlace de invitación inválido. Falta el código de validación de workspace en la URL."
        />
        <div className="pt-2">
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)] mb-5 animate-pulse">
          <UserPlus size={24} />
        </div>
        <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Aceptar Invitación
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)]">
          Completa tus datos para unirte al workspace de ContaMind AI
        </p>
      </div>

      {error && <AuthNotification type="error" message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email pre-filled & locked */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1">
            Correo de invitación
          </label>
          <input
            type="email"
            disabled
            value={email}
            className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] bg-[var(--off-white)] text-[var(--text-3)] cursor-not-allowed font-medium"
          />
        </div>

        {/* Nombre completo */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="join-name">
            Tu nombre
          </label>
          <input
            {...register("userName")}
            id="join-name"
            type="text"
            placeholder="Juan Pérez"
            className={`w-full px-4 py-3 rounded-[14px] border ${
              errors.userName
                ? "border-[var(--red)] focus:ring-[var(--red)]/20"
                : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
            } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
          />
          {errors.userName && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1">
              {errors.userName.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="join-password">
            Contraseña nueva
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="join-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
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
              {errors.password.message}
            </p>
          )}

          {/* Real-time Password strength meter */}
          {(isPasswordFocused || passwordVal) && (
            <div className="pt-1">
              <PasswordStrength password={passwordVal} />
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="join-confirm">
            Confirmar contraseña
          </label>
          <input
            {...register("confirmPassword")}
            id="join-confirm"
            type="password"
            placeholder="••••••••"
            className={`w-full px-4 py-3 rounded-[14px] border ${
              errors.confirmPassword
                ? "border-[var(--red)] focus:ring-[var(--red)]/20"
                : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
            } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98] cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              Registrarse y unirse
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-3)] pt-2">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}

export default function RegisterJoinPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-[var(--text-3)]">Cargando...</div>}>
      <RegisterJoinContent />
    </Suspense>
  )
}
