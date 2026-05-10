"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Quote, Sun, Moon, BrainCircuit } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/Logo"
import { useTheme } from "@/components/ThemeProvider"

const testimonials = [
  {
    quote: "Contabilidad que piensa contigo.",
    author: "María García",
    role: "CEO, InnovaTech Ecuador",
  },
  {
    quote: "La IA de ContaMind nos ha ahorrado 20 horas mensuales de trabajo manual.",
    author: "Carlos Rodríguez",
    role: "Director Financiero, Grupo Andes",
  },
  {
    quote: "Cumplir con el SRI nunca fue tan sencillo y rápido.",
    author: "Elena Pazmiño",
    role: "Contadora Independiente",
  }
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-screen bg-[var(--white)] transition-colors duration-300">
      {/* Panel Izquierdo (Visual) - 45% - Estilos aislados y fijos (Modo Oscuro) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0f0f10] flex-col justify-between p-12 relative overflow-hidden shadow-2xl border-r border-white/5">
        
        {/* Logo - Fijo blanco */}
        <Link href="/" className="z-10">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-[#0a84ff]" size={32} />
            <span className="font-semibold tracking-tight text-[1.4rem] text-white">
              ContaMind<span className="text-[#0a84ff]">AI</span>
            </span>
          </div>
        </Link>

        {/* Testimonios - Estilos estáticos y aislados */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-md"
            >
              <Quote className="text-[#0a84ff] w-12 h-12 mb-6 opacity-40" />
              <h1 className="text-4xl md:text-5xl font-serif italic text-white leading-[1.2] mb-8">
                "{testimonials[currentTestimonial].quote}"
              </h1>
              <div className="flex flex-col gap-1.5">
                <p className="text-white font-semibold text-lg">
                  {testimonials[currentTestimonial].author}
                </p>
                <p className="text-gray-400 text-[0.95rem] font-medium">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Panel Izquierdo - Estilos estáticos */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-full border border-white/10 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-[#30d158]" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-gray-300">Cumple SRI Ecuador</span>
          </motion.div>
        </div>

        {/* Elementos Decorativos de Marca - Colores fijos */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0a84ff] opacity-[0.12] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-[#0a84ff] opacity-[0.08] rounded-full blur-[80px]" />
      </div>

      {/* Panel Derecho (Formulario) - 55% */}


      <div className="w-full lg:w-[55%] flex flex-col justify-center p-6 md:p-12 lg:p-20 relative">

        {/* Theme Toggle in Auth */}
        <div className="absolute top-8 right-8 z-20">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-[var(--off-white)] hover:bg-[var(--accent-soft)] transition-all text-[var(--text-3)] hover:text-[var(--text-1)] border border-[var(--border-light)] shadow-sm"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/">
            <Logo size={24} />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
