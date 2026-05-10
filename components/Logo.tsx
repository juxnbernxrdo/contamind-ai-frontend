import React from "react"
import { BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
  size?: number
}

export function Logo({ 
  className, 
  iconClassName, 
  textClassName, 
  showText = true,
  size = 24
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BrainCircuit 
        className={cn(
          "text-[var(--accent)] transition-colors duration-300", 
          iconClassName
        )} 
        size={size} 
      />
      {showText && (
        <span className={cn(
          "font-semibold tracking-tight text-[1.1rem] text-[var(--text-1)] transition-colors duration-300",
          textClassName
        )}>
          ContaMind<span className="text-[var(--accent)]">AI</span>
        </span>
      )}
    </div>
  )
}
