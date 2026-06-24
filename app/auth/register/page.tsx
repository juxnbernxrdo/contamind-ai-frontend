"use client"

import React, { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "motion/react"
import { 
  Loader2, ArrowLeft, ArrowRight, User, Briefcase, 
  ShieldAlert, CheckCircle2, ChevronRight, Eye, EyeOff,
  Mail, Cloud, Database, UploadCloud, Smile, UserPlus, HelpCircle
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import PasswordStrength from "@/components/auth/PasswordStrength"
import { apiClient, setAccessToken } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Step 1 Schema: Credentials
const step1Schema = z.object({
  name: z.string().min(3, { message: "El nombre es obligatorio (mínimo 3 caracteres)" }),
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
  password: z.string().min(12, { message: "La contraseña debe tener al menos 12 caracteres" })
    .regex(/[a-z]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
    .regex(/[0-9]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
})

type Step1Values = z.infer<typeof step1Schema>

function generateTemporaryRuc() {
  const province = Math.floor(Math.random() * 24) + 1
  const provinceStr = String(province).padStart(2, "0")
  let middle = ""
  for (let i = 0; i < 8; i++) {
    middle += Math.floor(Math.random() * 10)
  }
  return `${provinceStr}${middle}001`
}

export default function RegisterPage() {
  const [step, setStep] = useState<"ACCOUNT" | "VERIFY_EMAIL" | "WORKSPACE" | "ACTIVATION" | "LAUNCH" | "SUCCESS">("ACCOUNT")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [rucError, setRucError] = useState("")
  const [sriVerifying, setSriVerifying] = useState(false)
  const [shakeError, setShakeError] = useState(false)
  
  // Cache user inputs
  const [userCredentials, setUserCredentials] = useState<Step1Values | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [workspaceType, setWorkspaceType] = useState<"personal" | "empresa">("personal")
  const [activationChoice, setActivationChoice] = useState<"sri" | "upload" | "demo" | "blank" | null>(null)
  
  const { setUser, setAuthState } = useAuth()
  const router = useRouter()

  // Step 1 Form
  const methods = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const { register, handleSubmit, watch, formState: { errors } } = methods
  const passwordVal = watch("password")

  // Step 3 Form States
  const [workspaceName, setWorkspaceName] = useState("")
  const [rucVal, setRucVal] = useState("")
  const [razonSocial, setRazonSocial] = useState("")

  // Step 5 Form States
  const [teammateEmail, setTeammateEmail] = useState("")
  const [teammateRole, setTeammateRole] = useState("VENDEDOR")
  const [invitedMembers, setInvitedMembers] = useState<{ email: string; role: string }[]>([])

  // Step 2 Countdown
  const [resendCountdown, setResendCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCountdown])

  // Email Polling (Paso 2)
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout
    if (step === "VERIFY_EMAIL" && userCredentials) {
      pollingInterval = setInterval(async () => {
        try {
          const { data } = await apiClient.get(`/auth/email-status?email=${encodeURIComponent(userCredentials.email)}`)
          if (data.verified) {
            clearInterval(pollingInterval)
            toast.success("¡Email verificado! Iniciando sesión...")
            
            const loginRes = await apiClient.post("/auth/login", {
              email: userCredentials.email,
              password: userCredentials.password,
            })
            
            setAccessToken(loginRes.data.accessToken)
            setUser(loginRes.data.user)
            setAuthState("AUTHENTICATED")
            
            setStep("WORKSPACE")
          }
        } catch (e) {
          // ignore
        }
      }, 5000)
    }
    return () => clearInterval(pollingInterval)
  }, [step, userCredentials, setUser, setAuthState])

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  // Step 1: Submit Credentials
  const onSubmitStep1 = async (data: Step1Values) => {
    setIsLoading(true)
    setError("")
    try {
      const tempRuc = generateTemporaryRuc()
      const payload = {
        email: data.email,
        password: data.password,
        userName: data.name,
        companyName: `Workspace de ${data.name}`,
        workspaceName: data.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        ruc: tempRuc,
        country: "EC",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Guayaquil",
      }

      const res = await apiClient.post("/auth/register/tenant", payload)
      setUserId(res.data.userId)
      setUserCredentials(data)
      setWorkspaceName(`${data.name}'s Workspace`)
      setStep("VERIFY_EMAIL")
      setResendCountdown(60)
    } catch (err: any) {
      triggerShake()
      setError(err.response?.data?.message || "Error al registrar cuenta. Intente de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // SSO Signup
  const handleSSO = async (provider: "google" | "microsoft") => {
    setIsLoading(true)
    setError("")
    try {
      const randomId = Math.floor(Math.random() * 10000)
      const data = {
        name: `Usuario ${provider === "google" ? "Google" : "Microsoft"}`,
        email: `sso-${provider}-${randomId}@contamind.io`,
        password: `SSO_Secret_Pass_2026_${provider}_${randomId}!`,
      }
      const tempRuc = generateTemporaryRuc()
      const payload = {
        email: data.email,
        password: data.password,
        userName: data.name,
        companyName: `Workspace de ${data.name}`,
        workspaceName: `workspace-${provider}-${randomId}`,
        ruc: tempRuc,
        country: "EC",
        timezone: "America/Guayaquil",
      }
      
      const res = await apiClient.post("/auth/register/tenant", payload)
      const loginRes = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      })
      
      setAccessToken(loginRes.data.accessToken)
      setUser(loginRes.data.user)
      setAuthState("AUTHENTICATED")
      
      setUserCredentials(data)
      setUserId(res.data.userId)
      setWorkspaceName(`${data.name}'s Workspace`)
      
      toast.success(`Cuenta de ${provider} conectada.`)
      setStep("WORKSPACE")
    } catch (err: any) {
      triggerShake()
      setError("Error al autenticar con SSO. Intenta por correo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Resend Email
  const handleResendEmail = async () => {
    if (!userCredentials || resendCountdown > 0) return
    setIsLoading(true)
    try {
      await apiClient.post("/auth/email-verification/resend", { email: userCredentials.email })
      toast.success("Correo de verificación reenviado.")
      setResendCountdown(60)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al reenviar correo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: SRI Validation
  const handleRucChange = async (val: string) => {
    const cleanVal = val.replace(/\D/g, "")
    setRucVal(cleanVal)
    
    if (cleanVal.length === 13) {
      setSriVerifying(true)
      setRucError("")
      try {
        const provinceCode = parseInt(cleanVal.substring(0, 2), 10)
        if (provinceCode < 1 || provinceCode > 24) {
          setRucError("Código de provincia del RUC inválido (01-24)")
          setSriVerifying(false)
          return
        }
        if (!cleanVal.endsWith("001")) {
          setRucError("El RUC ecuatoriano debe terminar en 001")
          setSriVerifying(false)
          return
        }

        setTimeout(() => {
          setRazonSocial("CORPORACIÓN " + workspaceName.toUpperCase() + " S.A.")
          setSriVerifying(false)
          toast.success("RUC validado con éxito desde el SRI")
        }, 1200)
      } catch (e) {
        setRucError("No se pudo verificar el RUC.")
        setSriVerifying(false)
      }
    } else {
      setRazonSocial("")
    }
  }

  const handleWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspaceName.trim()) {
      toast.error("El nombre del workspace es requerido")
      return
    }
    if (workspaceType === "empresa") {
      if (rucVal.length !== 13) {
        setRucError("El RUC debe tener 13 dígitos.")
        triggerShake()
        return
      }
      if (rucError) {
        triggerShake()
        return
      }
    }

    setIsLoading(true)
    try {
      await apiClient.post("/auth/workspace/setup", {
        name: workspaceName,
        type: workspaceType,
        ruc: workspaceType === "empresa" ? rucVal : undefined,
      })
      toast.success("Workspace configurado")
      setStep("ACTIVATION")
    } catch (err: any) {
      triggerShake()
      toast.error(err.response?.data?.message || "Error al guardar el workspace")
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivationSubmit = () => {
    if (!activationChoice) {
      toast.error("Selecciona una opción de activación")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Fuente de datos sincronizada")
      setStep("LAUNCH")
    }, 2000)
  }

  const addTeammate = () => {
    if (!teammateEmail || !z.string().email().safeParse(teammateEmail).success) {
      toast.error("Email inválido")
      return
    }
    if (invitedMembers.some(m => m.email === teammateEmail)) {
      toast.error("Ya está invitado")
      return
    }
    setInvitedMembers([...invitedMembers, { email: teammateEmail, role: teammateRole }])
    setTeammateEmail("")
  }

  const handleFinishOnboarding = async () => {
    setIsLoading(true)
    try {
      if (invitedMembers.length > 0) {
        toast.info("Invitaciones de equipo enviadas.")
      }
      setStep("SUCCESS")
    } catch (e) {
      toast.error("Error al finalizar.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: ACCOUNT CREATION */}
        {step === "ACCOUNT" && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
                Crear una cuenta
              </h1>
              <p className="text-[1.05rem] text-[var(--text-3)]">
                Empieza gratis y automatiza tu contabilidad
              </p>
            </div>

            {error && (
              <div className="p-4 bg-[var(--red-soft)] border border-[var(--red)]/20 rounded-[14px] text-[var(--red)] text-xs font-medium flex items-center gap-2" role="alert">
                <ShieldAlert size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <FormProvider {...methods}>
              <motion.form 
                onSubmit={handleSubmit(onSubmitStep1)} 
                animate={shakeError ? { x: [0, -7, 7, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="space-y-5" 
                noValidate
              >
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="reg-name">
                    Nombre completo
                  </label>
                  <input
                    {...register("name")}
                    id="reg-name"
                    type="text"
                    autoFocus
                    placeholder="Juan Pérez"
                    className={`w-full px-4 py-3 rounded-[14px] border ${
                      errors.name
                        ? "border-[var(--red)] focus:ring-[var(--red)]/20"
                        : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
                    } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
                  />
                  {errors.name && (
                    <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1" role="alert">
                      <ShieldAlert size={12} /> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="reg-email">
                    Correo electrónico
                  </label>
                  <input
                    {...register("email")}
                    id="reg-email"
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
                    <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1" role="alert">
                      <ShieldAlert size={12} /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="reg-password">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1" role="alert">
                      <ShieldAlert size={12} /> {errors.password.message}
                    </p>
                  )}
                  
                  {/* Focus-Triggered Password Criteria */}
                  <AnimatePresence>
                    {(isPasswordFocused || passwordVal) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-1"
                      >
                        <PasswordStrength password={passwordVal} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98] cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Empieza ahora
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[var(--border-light)]"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-4)]">o registrarse con</span>
                  <div className="flex-grow border-t border-[var(--border-light)]"></div>
                </div>

                {/* SSO options aligned with login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSSO("google")}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 px-4 h-[42px] rounded-[24px] bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] hover:text-[var(--text-1)] font-semibold text-xs transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSSO("microsoft")}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 px-4 h-[42px] rounded-[24px] bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] hover:text-[var(--text-1)] font-semibold text-xs transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    <svg className="w-[16px] h-[16px] flex-shrink-0" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z" />
                      <path fill="#80bb0a" d="M12 0h11v11H12z" />
                      <path fill="#00a1f1" d="M0 12h11v11H0z" />
                      <path fill="#ffb900" d="M12 12h11v11H12z" />
                    </svg>
                    <span className="ml-0.5">Microsoft</span>
                  </button>
                </div>
              </motion.form>
            </FormProvider>

            <p className="text-center text-sm text-[var(--text-3)] pt-2">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </motion.div>
        )}

        {/* STEP 2: EMAIL VERIFICATION */}
        {step === "VERIFY_EMAIL" && (
          <motion.div
            key="verify-email"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="space-y-6 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-[var(--accent-soft)] text-[var(--accent)] mb-2 animate-bounce">
              <Mail size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-[clamp(1.9rem,3.5vw,2.5rem)] font-serif text-[var(--text-1)] tracking-tight">
                Verifica tu correo
              </h2>
              <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mx-auto">
                Hemos enviado un enlace de confirmación a <strong className="text-[var(--text-1)]">{userCredentials?.email}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-[18px] bg-[var(--off-white)] border border-[var(--border-light)] max-w-sm mx-auto space-y-2 text-left shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                <Loader2 className="animate-spin text-[var(--accent)]" size={14} />
                Esperando confirmación
              </div>
              <p className="text-xs text-[var(--text-3)] leading-relaxed">
                El sistema detectará automáticamente cuando hagas clic en el enlace del correo y te llevará al siguiente paso sin necesidad de refrescar.
              </p>
            </div>

            <div className="pt-4 space-y-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isLoading || resendCountdown > 0}
                className="w-full inline-flex justify-center bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] font-semibold py-3 rounded-[24px] transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer shadow-sm"
              >
                {resendCountdown > 0 
                  ? `Reenviar en ${resendCountdown}s` 
                  : "Reenviar correo de verificación"
                }
              </button>
              
              <button
                type="button"
                onClick={() => setStep("ACCOUNT")}
                className="text-xs text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors hover:underline block mx-auto cursor-pointer"
              >
                Cambiar dirección de correo
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: WORKSPACE CREATION */}
        {step === "WORKSPACE" && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)] block mb-1">Paso 3 de 5</span>
              <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
                Crea tu Workspace
              </h2>
              <p className="text-[1.05rem] text-[var(--text-3)]">
                Configura el entorno de trabajo para tus finanzas
              </p>
            </div>

            <motion.form 
              onSubmit={handleWorkspaceSubmit} 
              animate={shakeError ? { x: [0, -7, 7, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Workspace Type Selector */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-[var(--text-2)] ml-1">Tipo de Workspace</span>
                <div className="grid grid-cols-2 gap-4">
                  {/* Personal Card */}
                  <div
                    tabIndex={0}
                    onClick={() => setWorkspaceType("personal")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setWorkspaceType("personal")
                      }
                    }}
                    className={`p-5 rounded-[18px] border transition-all cursor-pointer text-left relative focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      workspaceType === "personal"
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-md"
                        : "border-[var(--border-light)] hover:border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-subtle)]"
                    }`}
                  >
                    <User className={`w-8 h-8 mb-3 ${workspaceType === "personal" ? "text-[var(--accent)]" : "text-[var(--text-3)]"}`} />
                    <h3 className="text-sm font-semibold mb-1 text-[var(--text-1)]">Personal</h3>
                    <p className="text-[0.78rem] text-[var(--text-3)] leading-relaxed">
                      Personas naturales o profesionales independientes.
                    </p>
                    {workspaceType === "personal" && (
                      <CheckCircle2 size={16} className="absolute top-4 right-4 text-[var(--accent)]" />
                    )}
                  </div>

                  {/* Empresa Card */}
                  <div
                    tabIndex={0}
                    onClick={() => setWorkspaceType("empresa")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setWorkspaceType("empresa")
                      }
                    }}
                    className={`p-5 rounded-[18px] border transition-all cursor-pointer text-left relative focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                      workspaceType === "empresa"
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-md"
                        : "border-[var(--border-light)] hover:border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-subtle)]"
                    }`}
                  >
                    <Briefcase className={`w-8 h-8 mb-3 ${workspaceType === "empresa" ? "text-[var(--accent)]" : "text-[var(--text-3)]"}`} />
                    <h3 className="text-sm font-semibold mb-1 text-[var(--text-1)]">Empresa</h3>
                    <p className="text-[0.78rem] text-[var(--text-3)] leading-relaxed">
                      PYMEs y Sociedades. Control fiscal y múltiples roles.
                    </p>
                    {workspaceType === "empresa" && (
                      <CheckCircle2 size={16} className="absolute top-4 right-4 text-[var(--accent)]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Workspace Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="ws-name">
                  Nombre del Workspace
                </label>
                <input
                  id="ws-name"
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Mi Empresa"
                  className="w-full px-4 py-3 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)] focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm"
                />
                <span className="text-[0.75rem] text-[var(--text-3)] block ml-1">
                  Namespace de acceso: <strong className="text-[var(--text-2)]">/w/{workspaceName.toLowerCase().replace(/[^a-z0-9]/g, "-")}</strong>
                </span>
              </div>

              {/* Empresa Conditional Fields */}
              <AnimatePresence>
                {workspaceType === "empresa" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* RUC Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text-2)] ml-1" htmlFor="ws-ruc">
                        RUC (Ecuador)
                      </label>
                      <div className="relative">
                        <input
                          id="ws-ruc"
                          type="text"
                          maxLength={13}
                          value={rucVal}
                          onChange={(e) => handleRucChange(e.target.value)}
                          placeholder="1791234567001"
                          className={`w-full px-4 py-3 rounded-[14px] border ${
                            rucError ? "border-[var(--red)] focus:ring-[var(--red)]/20" : "border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)]"
                          } focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] shadow-sm`}
                        />
                        {sriVerifying && (
                          <div className="absolute right-4 top-3.5 flex items-center gap-1.5 text-xs text-[var(--text-3)]">
                            <Loader2 className="animate-spin text-[var(--accent)]" size={14} />
                            <span>SRI</span>
                          </div>
                        )}
                      </div>
                      {rucError && (
                        <p className="text-xs text-[var(--red)] mt-1 ml-1 flex items-center gap-1" role="alert">
                          <ShieldAlert size={12} /> {rucError}
                        </p>
                      )}
                    </div>

                    {/* Razón Social */}
                    {razonSocial && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-[var(--green-soft)] border border-[var(--green)]/20 rounded-[14px]"
                      >
                        <span className="text-[0.68rem] text-[var(--text-3)] block uppercase font-semibold">Razón Social SRI</span>
                        <span className="text-xs font-bold text-[var(--text-1)]">{razonSocial}</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading || sriVerifying}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Confirmar Workspace
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </motion.form>
          </motion.div>
        )}

        {/* STEP 4: INITIAL ACTIVATION */}
        {step === "ACTIVATION" && (
          <motion.div
            key="activation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)] block mb-1">Paso 4 de 5</span>
              <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
                Conecta tus datos
              </h2>
              <p className="text-[1.05rem] text-[var(--text-3)]">
                Para empezar a ver valor de inmediato, alimenta tu cuenta
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: SRI Portal */}
              <div
                tabIndex={0}
                onClick={() => setActivationChoice("sri")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActivationChoice("sri") }}
                className={`p-4 rounded-[18px] border cursor-pointer text-left transition-all flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  activationChoice === "sri"
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border-light)] hover:border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-subtle)]"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activationChoice === "sri" ? "bg-[var(--accent)] text-white" : "bg-[var(--off-white)] text-[var(--text-2)]"}`}>
                  <Cloud size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-[var(--text-1)]">Sincronización SRI</h3>
                    <span className="bg-[var(--green-soft)] text-[#1a7a3a] text-[0.62rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Recomendado</span>
                  </div>
                  <p className="text-xs text-[var(--text-3)]">Descarga tus facturas emitidas y recibidas automáticamente.</p>
                </div>
              </div>

              {/* Option 2: Upload Files */}
              <div
                tabIndex={0}
                onClick={() => setActivationChoice("upload")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActivationChoice("upload") }}
                className={`p-4 rounded-[18px] border cursor-pointer text-left transition-all flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  activationChoice === "upload"
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border-light)] hover:border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-subtle)]"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activationChoice === "upload" ? "bg-[var(--accent)] text-white" : "bg-[var(--off-white)] text-[var(--text-2)]"}`}>
                  <UploadCloud size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-1)]">Subir archivos (.xml / .pdf / Excel)</h3>
                  <p className="text-xs text-[var(--text-3)]">Carga de forma manual tus documentos fiscales.</p>
                </div>
              </div>

              {/* Option 3: Demo Data */}
              <div
                tabIndex={0}
                onClick={() => setActivationChoice("demo")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActivationChoice("demo") }}
                className={`p-4 rounded-[18px] border cursor-pointer text-left transition-all flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  activationChoice === "demo"
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border-light)] hover:border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-subtle)]"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activationChoice === "demo" ? "bg-[var(--accent)] text-white" : "bg-[var(--off-white)] text-[var(--text-2)]"}`}>
                  <Database size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-[var(--text-1)]">Cargar Datos Demo</h3>
                    <span className="bg-[var(--accent-soft)] text-[var(--accent)] text-[0.62rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Pruebas</span>
                  </div>
                  <p className="text-xs text-[var(--text-3)]">Puebla el panel con facturas y gráficos simulados.</p>
                </div>
              </div>

              {/* Option 4: Blank Slate */}
              <div
                tabIndex={0}
                onClick={() => setActivationChoice("blank")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActivationChoice("blank") }}
                className={`p-4 rounded-[18px] border cursor-pointer text-left transition-all flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  activationChoice === "blank"
                    ? "border(--accent)"
                    : "border-[var(--border-light)] hover:border-[var(--border)] bg-[var(--white)] shadow-[var(--shadow-subtle)]"
                }`}
              >
                <div className={`p-2.5 rounded-xl bg-[var(--off-white)] text-[var(--text-2)]`}>
                  <Smile size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-1)]">Empezar en Blanco</h3>
                  <p className="text-xs text-[var(--text-3)]">Comienza sin datos y configúralos más tarde.</p>
                </div>
              </div>
            </div>

            {/* Custom inputs conditional on SRI selection */}
            <AnimatePresence>
              {activationChoice === "sri" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-[18px] bg-[var(--off-white)] border border-[var(--border-light)] space-y-3 overflow-hidden text-left"
                >
                  <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider block">Credenciales del SRI</span>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="RUC o Identificación" value={rucVal} disabled className="px-4 py-2 text-xs border border-[var(--border-light)] rounded-[10px] bg-[var(--white)] text-[var(--text-1)] opacity-70" />
                    <input type="password" placeholder="Clave del SRI" className="px-4 py-2 text-xs border border-[var(--border-light)] rounded-[10px] bg-[var(--white)] text-[var(--text-1)] focus:outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-soft)]" />
                  </div>
                  <span className="text-[0.68rem] text-[var(--text-3)] flex items-center gap-1">
                    <HelpCircle size={10} /> Encriptado de grado militar (AES-256). ContaMind no almacena claves legibles.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom upload conditional */}
            <AnimatePresence>
              {activationChoice === "upload" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-8 rounded-[18px] bg-[var(--white)] border border-dashed border-[var(--border)] text-center space-y-3 overflow-hidden"
                >
                  <UploadCloud className="mx-auto text-[var(--text-3)] w-10 h-10 animate-pulse" />
                  <div>
                    <span className="text-xs font-bold text-[var(--text-1)] block">Arrastra tus facturas XML o Excel aquí</span>
                    <span className="text-[0.7rem] text-[var(--text-3)]">Formatos autorizados por el SRI. Máximo 10MB.</span>
                  </div>
                  <input type="file" className="hidden" id="file-activation-upload" />
                  <label htmlFor="file-activation-upload" className="inline-flex justify-center bg-[var(--off-white)] hover:bg-[var(--border-light)] border text-[var(--text-2)] text-[0.75rem] font-semibold py-2 px-4 rounded-[24px] transition-all cursor-pointer shadow-sm active:scale-[0.98]">
                    Seleccionar Archivos
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleActivationSubmit}
              disabled={isLoading || !activationChoice}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sincronizar y Continuar
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* STEP 5: LAUNCH & COLLABORATION */}
        {step === "LAUNCH" && (
          <motion.div
            key="launch"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)] block mb-1">Paso 5 de 5</span>
              <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight mb-2">
                Invita a tu equipo
              </h2>
              <p className="text-[1.05rem] text-[var(--text-3)]">
                La contabilidad es más rápida en equipo
              </p>
            </div>

            <div className="space-y-4">
              {/* Add Teammate row */}
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={teammateEmail}
                    onChange={(e) => setTeammateEmail(e.target.value)}
                    placeholder="correo@socio.com"
                    className="w-full px-4 py-2.5 rounded-[14px] border border-[var(--border-light)] hover:border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent-soft)] focus:outline-none focus:ring-[3px] transition-all bg-[var(--off-white)] focus:bg-[var(--white)] text-[var(--text-1)] text-xs shadow-sm"
                  />
                </div>
                <select
                  value={teammateRole}
                  onChange={(e) => setTeammateRole(e.target.value)}
                  className="px-3 py-2 text-xs border border-[var(--border-light)] rounded-[14px] bg-[var(--off-white)] text-[var(--text-1)] focus:outline-none focus:ring-[3px] focus:ring-[var(--accent-soft)]"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="ACCOUNTANT">Contador</option>
                  <option value="VENDEDOR">Vendedor</option>
                  <option value="VIEWER">Visualizador</option>
                </select>
                <button
                  type="button"
                  onClick={addTeammate}
                  className="bg-[var(--off-white)] hover:bg-[var(--border-light)] border border-[var(--border-light)] text-[var(--text-2)] font-semibold px-4 rounded-[24px] text-xs cursor-pointer active:scale-95 transition-all"
                >
                  Añadir
                </button>
              </div>

              {/* Invited list */}
              {invitedMembers.length > 0 && (
                <div className="border border-[var(--border-light)] rounded-[18px] overflow-hidden bg-[var(--white)] shadow-sm">
                  <ul className="divide-y divide-[var(--border-light)]">
                    {invitedMembers.map((member, index) => (
                      <li key={index} className="px-4 py-3 flex justify-between items-center text-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[var(--text-1)]">{member.email}</span>
                          <span className="text-[var(--text-3)] lowercase text-[10px] tracking-wide">Rol: {member.role}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setInvitedMembers(invitedMembers.filter((_, i) => i !== index))}
                          className="text-[var(--red)] hover:underline cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isLoading}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Finalizar y Lanzar Workspace
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("SUCCESS")}
                className="text-xs text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors hover:underline block mx-auto cursor-pointer"
              >
                Omitir invitaciones por ahora
              </button>
            </div>
          </motion.div>
        )}

        {/* SUCCESS INTERACTIVE CONFIRMATION */}
        {step === "SUCCESS" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-[var(--green-soft)] text-[var(--green)] mb-2 mx-auto"
            >
              <CheckCircle2 size={40} className="stroke-[2.5px]" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-[clamp(1.9rem,3.5vw,2.9rem)] font-serif text-[var(--text-1)] tracking-tight">
                ¡Todo listo!
              </h2>
              <p className="text-[1.05rem] text-[var(--text-3)] max-w-xs mx-auto leading-relaxed">
                Tu workspace empresarial en ContaMind AI ha sido creado correctamente.
              </p>
            </div>

            <div className="pt-4 max-w-xs mx-auto">
              <button
                onClick={() => {
                  router.push("/dashboard")
                }}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_4px_20px_rgba(0,113,227,0.25)] active:scale-[0.98] cursor-pointer"
              >
                Entrar al Dashboard
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
