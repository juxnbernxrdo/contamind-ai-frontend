"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(false)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        throw authError
      }

      toast.success("¡Bienvenido de vuelta!")
      router.push("/app/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(true)
      toast.error(err.message || "Error al iniciar sesión. Por favor verifica tus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error("Error al conectar con Google")
    }
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" expand={false} richColors />
      
      <div>
        <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
          Bienvenido de vuelta
        </h2>
        <p className="text-[1.05rem] text-[var(--text-3)]">Ingresa a tu cuenta de ContaMind</p>
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        animate={error ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="email">
            Correo electrónico
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="nombre@empresa.com"
            className={`w-full px-4 py-3 rounded-[14px] border ${
              errors.email ? "border-[var(--red)] focus:ring-[var(--red)]/20" : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
            } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm`}
          />
          {errors.email && (
            <p className="text-xs text-[var(--red)] mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-[var(--text-2)]" htmlFor="password">
              Contraseña
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-[14px] border ${
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--accent)]/40 text-white font-medium py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.2)]"
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-light)]"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-[var(--white)] px-2 text-[var(--text-4)]">o continuar con</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-[var(--white)] dark:bg-[var(--off-white)] border border-[var(--border-light)] hover:bg-[var(--off-white)] dark:hover:bg-[var(--white)] dark:hover:text-black text-[var(--text-1)] font-medium py-3 rounded-[24px] transition-all shadow-sm"
      >
        <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google Workspace
      </button>

      <p className="text-center text-sm text-[var(--text-3)]">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold">
          Empieza gratis →
        </Link>
      </p>
    </div>
  )
}
