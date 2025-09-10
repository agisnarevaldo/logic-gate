'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  AndGateSymbol, 
  OrGateSymbol, 
  NotGateSymbol, 
  NandGateSymbol, 
  NorGateSymbol, 
  XorGateSymbol, 
  XnorGateSymbol 
} from "@/components/quiz/logic-gate-symbols"

const GATE_OPTIONS = [
  { type: 'AND', component: AndGateSymbol },
  { type: 'OR', component: OrGateSymbol },
  { type: 'NOT', component: NotGateSymbol },
  { type: 'NAND', component: NandGateSymbol },
  { type: 'NOR', component: NorGateSymbol },
  { type: 'XOR', component: XorGateSymbol },
  { type: 'XNOR', component: XnorGateSymbol }
]

interface GateSelectorProps {
  selectedMissingId: string | null
  onGateSelect: (gateType: string) => void
  currentAnswer?: string | null
  disabled?: boolean
}

export const GateSelector: React.FC<GateSelectorProps> = ({
  selectedMissingId,
  onGateSelect,
  currentAnswer,
  disabled = false
}) => {
  if (!selectedMissingId) {
    return (
      <Card className="w-full">
        <CardContent className="p-3 sm:p-4">
          <p className="text-gray-500 text-center text-sm">
            Pilih gerbang yang hilang (?) untuk memilih jawabannya
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold mb-3 text-sm sm:text-base">Pilih Gerbang Logika:</h3>
        
        {/* Show current answer if exists */}
        {currentAnswer && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              <span className="font-medium">Jawaban terpilih: {currentAnswer}</span>
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
          {GATE_OPTIONS.map((gate) => {
            const SymbolComponent = gate.component
            const isSelected = currentAnswer === gate.type
            
            return (
              <Button
                key={gate.type}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onGateSelect(gate.type)}
                disabled={disabled}
                className={`p-2 h-20 sm:h-24 w-full flex items-center justify-center transition-all border-2 ${
                  isSelected 
                    ? 'bg-blue-500 hover:bg-blue-600 border-blue-500 text-white ring-2 ring-blue-300' 
                    : 'hover:bg-blue-50 border-gray-300 hover:border-blue-400'
                }`}
              >
                <SymbolComponent className="w-max! h-max!" />
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
