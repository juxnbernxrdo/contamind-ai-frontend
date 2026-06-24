"use client"

import React, { useState } from "react"
import { Check, UploadCloud, FileCheck, AlertCircle } from "lucide-react"

export interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  recommended?: boolean
}

const plans: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    price: "$29",
    description: "Ideal para profesionales y microempresas.",
    features: ["Facturación Electrónica ilimitada", "Reportes básicos", "1 usuario", "Soporte vía email"],
  },
  {
    id: "profesional",
    name: "Profesional",
    price: "$59",
    description: "Ideal para PYMEs en crecimiento.",
    features: [
      "Todo lo de Básico",
      "Descarga automática de SRI",
      "Contabilidad automática con IA",
      "3 usuarios incluidos",
      "Soporte prioritario",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$129",
    description: "Para empresas con alta complejidad.",
    features: [
      "Todo lo de Profesional",
      "Agente de IA exclusivo",
      "Consolidación multi-empresa",
      "Usuarios ilimitados",
      "API de integración",
    ],
  },
]

interface PlanSelectorProps {
  selectedPlanId: string
  onPlanSelect: (planId: string) => void
  onCertificateChange: (file: File | null) => void
  certificateFile: File | null
}

export default function PlanSelector({
  selectedPlanId,
  onPlanSelect,
  onCertificateChange,
  certificateFile,
}: PlanSelectorProps) {
  const [dragActive, setDragActive] = useState(false)
  const [certName, setCertName] = useState<string | null>(certificateFile ? certificateFile.name : null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith(".p12") || file.name.endsWith(".pfx")) {
        onCertificateChange(file)
        setCertName(file.name)
      } else {
        alert("Por favor cargue un archivo de firma electrónica válido (.p12 o .pfx)")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.name.endsWith(".p12") || file.name.endsWith(".pfx")) {
        onCertificateChange(file)
        setCertName(file.name)
      } else {
        alert("Por favor cargue un archivo de firma electrónica válido (.p12 o .pfx)")
      }
    }
  }

  const handleClearCert = () => {
    onCertificateChange(null)
    setCertName(null)
  }

  return (
    <div className="space-y-6">
      {/* Plan selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-[var(--text-1)] ml-1">
          Selecciona tu Plan
        </label>
        <div className="grid grid-cols-1 gap-3">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id
            return (
              <div
                key={plan.id}
                onClick={() => onPlanSelect(plan.id)}
                className={`relative flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-[18px] border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border-light)] hover:border-[var(--border)] bg-[var(--white)]"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--accent)] text-white shadow-sm">
                    Recomendado
                  </span>
                )}

                <div className="space-y-1 max-w-[260px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[var(--text-1)]">
                      {plan.name}
                    </span>
                    {isSelected && (
                      <span className="text-[var(--accent)]">
                        <Check size={16} className="stroke-[3px]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-3)] leading-snug">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-2 md:mt-0 text-left md:text-right">
                  <span className="text-2xl font-bold text-[var(--text-1)]">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[var(--text-3)]">/mes</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Digital certificate upload (SRI compliance) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center ml-1">
          <label className="text-sm font-semibold text-[var(--text-1)]">
            Firma Electrónica <span className="text-xs font-normal text-[var(--text-4)]">(Opcional)</span>
          </label>
          <div className="flex items-center gap-1 text-xs text-[var(--text-3)]">
            <AlertCircle size={12} className="text-[var(--amber)]" />
            Necesaria para emitir facturas
          </div>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-[14px] text-center transition-all ${
            dragActive
              ? "border-[var(--accent)] bg-[var(--accent-soft)]/20"
              : certName
              ? "border-[var(--green)] bg-[var(--green-soft)]/20"
              : "border-[var(--border)] bg-[var(--off-white)] hover:bg-[var(--border-light)]"
          }`}
        >
          {certName ? (
            <div className="space-y-2">
              <div className="w-10 h-10 bg-[var(--green-soft)] text-[var(--green)] rounded-full flex items-center justify-center mx-auto">
                <FileCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-1)] truncate max-w-[250px]">
                  {certName}
                </p>
                <p className="text-[10px] text-[var(--text-3)]">
                  Archivo cargado correctamente.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearCert}
                className="text-[10px] text-[var(--red)] hover:underline font-semibold"
              >
                Eliminar firma
              </button>
            </div>
          ) : (
            <label className="cursor-pointer space-y-2 w-full block">
              <div className="w-10 h-10 bg-[var(--border-light)] text-[var(--text-3)] rounded-full flex items-center justify-center mx-auto">
                <UploadCloud size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-2)]">
                  Arrastre o seleccione su firma electrónica (.p12 o .pfx)
                </p>
                <p className="text-[10px] text-[var(--text-4)] mt-1">
                  Suba su certificado del Banco Central, Consejo de la Judicatura, Security Data, etc.
                </p>
              </div>
              <input
                type="file"
                accept=".p12,.pfx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  )
}
