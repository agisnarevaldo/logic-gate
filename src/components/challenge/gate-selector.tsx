'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const GATE_OPTIONS = [
  { type: 'AND', symbol: '&', label: 'AND Gate' },
  { type: 'OR', symbol: '≥1', label: 'OR Gate' },
  { type: 'NOT', symbol: '1', label: 'NOT Gate' },
  { type: 'NAND', symbol: '&̅', label: 'NAND Gate' },
  { type: 'NOR', symbol: '≥1̅', label: 'NOR Gate' },
  { type: 'XOR', symbol: '=1', label: 'XOR Gate' }
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
        <CardContent className="p-4">
          <p className="text-gray-500 text-center">
            Pilih gerbang yang hilang (?) untuk memilih jawabannya
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Pilih Gerbang Logika:</h3>
        <div className="grid grid-cols-2 gap-2">
          {GATE_OPTIONS.map((gate) => (
            <Button
              key={gate.type}
              variant="outline"
              onClick={() => onGateSelect(gate.type)}
              disabled={disabled}
              className="h-16 flex flex-col items-center justify-center hover:bg-blue-50"
            >
              <div className="text-lg font-mono mb-1">{gate.symbol}</div>
              <div className="text-xs">{gate.label}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
