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
  disabled?: boolean
}

export const GateSelector: React.FC<GateSelectorProps> = ({
  selectedMissingId,
  onGateSelect,
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
        <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
          {GATE_OPTIONS.map((gate) => {
            const SymbolComponent = gate.component
            return (
              <Button
                key={gate.type}
                variant="outline"
                onClick={() => onGateSelect(gate.type)}
                disabled={disabled}
                className="p-2 h-20 sm:h-24 w-full flex items-center justify-center hover:bg-blue-50 border-2"
              >
                {/* <div className="w-16 h-16 sm:w-20 sm:h-20"> */}
                  <SymbolComponent className="w-max! h-max!" />
                {/* </div> */}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
