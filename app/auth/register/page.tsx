"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowRight, ArrowLeft, Building2, User, CreditCard, CheckCircle2, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"

const registerSchema = z.object({
  fullName: z.string().min(3, "El nombre completo es requerido"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  companyName: z.string().min(3, "La razón social es requerida"),
  ruc: z.string().length(13, "El RUC debe tener 13 dígitos"),
  industry: z.string().min(1, "Selecciona una industria"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  })

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormValues)[] = []
    if (step === 1) fieldsToValidate = ["fullName", "email", "password"]
    if (step === 2) fieldsToValidate = ["companyName", "ruc", "industry"]

    const isValid = await trigger(fieldsToValidate)
    if (isValid) setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company_name: data.companyName,
            ruc: data.ruc,
            industry: data.industry,
          }
        }
      })

      if (error) throw error

      toast.success("¡Registro exitoso! Por favor verifica tu correo.")
      setStep(4) // Success state
    } catch (err: any) {
      toast.error(err.message || "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      {step < 4 && (
        <>
          <div>
            <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
              Empieza con ContaMind
            </h2>
            <p className="text-[1.05rem] text-[var(--text-3)]">Potencia tu empresa con inteligencia artificial</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? "bg-[var(--accent)] text-white" : step > s ? "bg-[var(--green)] text-white" : "bg-[var(--off-white)] dark:bg-[#1a1a1a] text-[var(--text-4)]"
                }`}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-[2px] ${step > s ? "bg-[var(--green)]" : "bg-[var(--border-light)]"}`} />}
              </div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 text-[var(--accent)] font-medium mb-4">
              <User size={18} />
              <span className="text-[0.72rem] font-semibold tracking-[0.10em] uppercase">Datos Personales</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-2)] ml-1">Nombre completo</label>
                <input
                  {...register("fullName")}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm"
                />
                {errors.fullName && <p className="text-xs text-[var(--red)]">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-2)] ml-1">Correo electrónico</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="juan@empresa.com"
                  className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm"
                />
                {errors.email && <p className="text-xs text-[var(--red)]">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-2)] ml-1">Contraseña</label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm"
                />
                {errors.password && <p className="text-xs text-[var(--red)]">{errors.password.message}</p>}
              </div>
            </div>
            <button
              onClick={nextStep}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Siguiente <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 text-[var(--accent)] font-medium mb-4">
              <Building2 size={18} />
              <span className="text-[0.72rem] font-semibold tracking-[0.10em] uppercase">Datos de la Empresa</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-2)] ml-1">Razón Social</label>
                <input
                  {...register("companyName")}
                  placeholder="Nombre de tu empresa"
                  className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm"
                />
                {errors.companyName && <p className="text-xs text-[var(--red)]">{errors.companyName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-2)] ml-1">RUC (Ecuador)</label>
                <input
                  {...register("ruc")}
                  placeholder="0999999999001"
                  maxLength={13}
                  className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm"
                />
                {errors.ruc && <p className="text-xs text-[var(--red)]">{errors.ruc.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-2)] ml-1">Industria</label>
                <div className="relative">
                  <select
                    {...register("industry")}
                    className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] dark:bg-[var(--off-white)] dark:focus:bg-[var(--white)] shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="comercio">Comercio</option>
                    <option value="servicios">Servicios</option>
                    <option value="manufactura">Manufactura</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-4)] pointer-events-none" size={18} />
                </div>
                {errors.industry && <p className="text-xs text-[var(--red)]">{errors.industry.message}</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 border border-[var(--border-light)] hover:bg-[var(--off-white)] dark:hover:bg-[var(--white)] dark:hover:text-black text-[var(--text-2)] font-medium py-3 rounded-[24px] transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Atrás
              </button>
              <button
                onClick={nextStep}
                className="flex-[2] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Siguiente <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 text-[var(--accent)] font-medium mb-4">
              <CreditCard size={18} />
              <span className="text-[0.72rem] font-semibold tracking-[0.10em] uppercase">Selecciona un Plan</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 border-2 border-[var(--accent)] rounded-[18px] bg-[var(--accent-soft)]/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[var(--text-1)]">Plan Free Trial</h4>
                  <span className="text-[var(--accent)] font-bold">$0</span>
                </div>
                <p className="text-xs text-[var(--text-3)] mb-4">Prueba todas las funcionalidades por 15 días.</p>
                <ul className="text-xs space-y-2">
                  <li className="flex items-center gap-2 text-[var(--text-2)]"><CheckCircle2 size={12} className="text-[var(--green)]" /> Facturación ilimitada</li>
                  <li className="flex items-center gap-2 text-[var(--text-2)]"><CheckCircle2 size={12} className="text-[var(--green)]" /> 1 Usuario</li>
                  <li className="flex items-center gap-2 text-[var(--text-2)]"><CheckCircle2 size={12} className="text-[var(--green)]" /> Soporte IA básico</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-center text-[var(--text-4)] italic mt-4">
              Podrás subir tu firma electrónica y configurar tu plan final en el onboarding.
            </p>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 border border-[var(--border-light)] hover:bg-[var(--off-white)] dark:hover:bg-[var(--white)] dark:hover:text-black text-[var(--text-2)] font-medium py-3 rounded-[24px] transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Atrás
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="flex-[2] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Finalizar Registro"}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="w-20 h-20 bg-[var(--green-soft)] rounded-full flex items-center justify-center mx-auto text-[var(--green)]">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[var(--text-1)]">¡Casi listo!</h3>
              <p className="text-[var(--text-3)]">
                Hemos enviado un enlace de confirmación a tu correo. Por favor verifícalo para activar tu cuenta.
              </p>
            </div>
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-[var(--text-1)] hover:bg-black dark:hover:bg-[var(--white)] dark:text-black dark:font-bold text-white font-medium py-3 rounded-[24px] transition-all"
            >
              Ir al Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 4 && (
        <p className="text-center text-sm text-[var(--text-3)]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold">
            Inicia sesión →
          </Link>
        </p>
      )}
    </div>
  )
}
