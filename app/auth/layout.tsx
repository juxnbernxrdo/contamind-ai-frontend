"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Quote, Sun, Moon, BrainCircuit } from "lucide-react"
import Link from "next/link"
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
      {/* Panel Izquierdo (Visual) - 45% */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-16 relative overflow-hidden border-r"
        style={{
          backgroundColor: '#0f0f10',
          borderColor: 'rgba(255,255,255,0.05)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          colorScheme: 'dark',
        }}
      >
        {/* Logo */}
        <Link href="/" className="z-10 transition-opacity hover:opacity-90">
          <div className="flex items-center gap-3">
            <BrainCircuit style={{ color: '#0a84ff' }} size={36} />
            <span
              className="font-bold tracking-tight"
              style={{ fontSize: '1.5rem', color: '#ffffff' }}
            >
              ContaMind<span style={{ color: '#0a84ff' }}>AI</span>
            </span>
          </div>
        </Link>

        {/* Testimonios */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-md"
            >
              <div className="mb-10">
                <Quote
                  className="w-14 h-14 mb-2"
                  style={{ color: '#0a84ff', opacity: 0.4 }}
                />
              </div>

              <h1
                className="font-serif italic leading-[1.15] mb-10 tracking-tight"
                style={{
                  fontSize: '2.75rem',
                  color: '#ffffff',
                }}
              >
                &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
              </h1>

              <div className="flex items-center gap-4">
                <div
                  className="rounded-full"
                  style={{
                    height: '3rem',
                    width: '4px',
                    backgroundColor: '#0a84ff',
                    opacity: 0.6,
                    flexShrink: 0,
                  }}
                />
                <div className="flex flex-col">
                  <p
                    className="font-semibold text-xl tracking-wide"
                    style={{ color: '#ffffff' }}
                  >
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p
                    className="text-[0.95rem] font-medium uppercase tracking-widest mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Decorative glows */}
        <div
          className="absolute rounded-full blur-[140px] pointer-events-none"
          style={{
            top: '-15%', right: '-15%',
            width: '600px', height: '600px',
            backgroundColor: '#0a84ff',
            opacity: 0.15,
          }}
        />
        <div
          className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{
            bottom: '-10%', left: '-10%',
            width: '400px', height: '400px',
            backgroundColor: '#0a84ff',
            opacity: 0.1,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(15,15,16,0.4), #0f0f10)',
          }}
        />
      </div>

      {/* Panel Derecho (Formulario) - 55% */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center p-6 md:p-12 lg:p-20 relative">

        {/* Theme Toggle */}
        <div className="absolute top-8 right-8 z-20">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-[var(--off-white)] hover:bg-[var(--accent-soft)] transition-all text-[var(--text-3)] hover:text-[var(--text-1)] border border-[var(--border-light)] shadow-sm"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
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
