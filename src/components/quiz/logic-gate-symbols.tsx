import type React from "react"
import { Icon } from '@iconify/react'

interface LogicGateSymbolProps {
  className?: string
}

export const AndGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M0,0 L0,60 L60,60 Q90,30 60,0 L0,0 Z" />
    <line x1="0" y1="15" x2="-15" y2="15" />
    <line x1="0" y1="45" x2="-15" y2="45" />
    <line x1="85" y1="30" x2="100" y2="30" />
  </svg>
)

export const OrGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5,0 Q40,0 70,30 Q40,60 5,60 Q20,30 5,0 Z" />
    <line x1="5" y1="15" x2="-10" y2="15" />
    <line x1="5" y1="45" x2="-10" y2="45" />
    <line x1="75" y1="30" x2="90" y2="30" />
  </svg>
)

export const NotGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M0,0 L0,60 L60,30 Z" />
    <circle cx="65" cy="30" r="5" />
    <line x1="0" y1="30" x2="-15" y2="30" />
    <line x1="70" y1="30" x2="85" y2="30" />
  </svg>
)

export const NandGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M0,0 L0,60 L60,60 Q90,30 60,0 L0,0 Z" />
    <circle cx="95" cy="30" r="5" />
    <line x1="0" y1="15" x2="-15" y2="15" />
    <line x1="0" y1="45" x2="-15" y2="45" />
    <line x1="100" y1="30" x2="115" y2="30" />
  </svg>
)

export const NorGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5,0 Q40,0 70,30 Q40,60 5,60 Q20,30 5,0 Z" />
    <circle cx="75" cy="30" r="5" />
    <line x1="5" y1="15" x2="-10" y2="15" />
    <line x1="5" y1="45" x2="-10" y2="45" />
    <line x1="80" y1="30" x2="95" y2="30" />
  </svg>
)

export const XorGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15,0 Q50,0 80,30 Q50,60 15,60 Q30,30 15,0 Z" />
    <path d="M5,0 Q20,30 5,60" />
    <line x1="15" y1="15" x2="0" y2="15" />
    <line x1="15" y1="45" x2="0" y2="45" />
    <line x1="85" y1="30" x2="100" y2="30" />
  </svg>
)

export const XnorGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15,0 Q50,0 80,30 Q50,60 15,60 Q30,30 15,0 Z" />
    <path d="M5,0 Q20,30 5,60" />
    <circle cx="85" cy="30" r="5" />
    <line x1="15" y1="15" x2="0" y2="15" />
    <line x1="15" y1="45" x2="0" y2="45" />
    <line x1="90" y1="30" x2="105" y2="30" />
  </svg>
)

export const BufferGateSymbol: React.FC<LogicGateSymbolProps> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M0,0 L0,60 L60,30 Z" />
    <line x1="0" y1="30" x2="-15" y2="30" />
    <line x1="60" y1="30" x2="75" y2="30" />
  </svg>
)

// Komponen Input - Saklar (tanpa text)
export const InputSwitchSymbol: React.FC<LogicGateSymbolProps & { isOn?: boolean }> = ({ className, isOn = false }) => (
  <svg viewBox="0 0 80 60" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    {/* Base saklar */}
    <rect x="15" y="22" width="50" height="16" rx="8" fill={isOn ? "#22c55e" : "#e5e7eb"} stroke={isOn ? "#16a34a" : "#9ca3af"} />
    {/* Toggle switch */}
    <circle cx={isOn ? "55" : "25"} cy="30" r="6" fill="white" stroke={isOn ? "#16a34a" : "#9ca3af"} strokeWidth="2" />
    {/* Output line */}
    <line x1="65" y1="30" x2="80" y2="30" stroke={isOn ? "#22c55e" : "#9ca3af"} strokeWidth="3" />
  </svg>
)

// Komponen Output - Lampu (menggunakan iconify light bulb)
export const OutputLampSymbol: React.FC<LogicGateSymbolProps & { isOn?: boolean }> = ({ className, isOn = false }) => (
  <div className={`flex items-center justify-center ${className}`}>
    {/* Input line */}
    <svg viewBox="0 0 80 60" className="absolute w-full h-full" fill="none">
      <line x1="0" y1="30" x2="15" y2="30" stroke={isOn ? "#22c55e" : "#9ca3af"} strokeWidth="3" />
    </svg>
    {/* Light Bulb Icon */}
    <Icon 
      icon="noto:light-bulb" 
      className="w-8 h-8 z-10"
      style={{ 
        filter: isOn ? 'brightness(1.2) saturate(1.5)' : 'grayscale(1) brightness(0.7)',
        color: isOn ? '#fbbf24' : '#9ca3af'
      }}
    />
  </div>
)
