'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Target } from 'lucide-react'

interface GuessGameInstructionsProps {
  onStartGame: () => void
}

export function GuessGameInstructions({ onStartGame }: GuessGameInstructionsProps) {
  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <Target className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-xl font-bold">Tebak Gambar</CardTitle>
          <p className="text-gray-600 text-sm">
            Temukan perangkat yang menggunakan gerbang logika!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simple Game Rules */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Cara Bermain:
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Pilih gambar perangkat yang menggunakan logika digital</p>
              <p>• Contoh: ATM, smartphone, traffic light, security system</p>
            </div>
          </div>

          {/* Quick Level Info */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 p-3 rounded">
              <Badge variant="default" className="mb-1 text-xs">Mudah</Badge>
              <div className="text-xs text-gray-600">
                <div>3/9 gambar</div>
                <div>60 detik</div>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <Badge variant="secondary" className="mb-1 text-xs">Sedang</Badge>
              <div className="text-xs text-gray-600">
                <div>4/12 gambar</div>
                <div>90 detik</div>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <Badge variant="destructive" className="mb-1 text-xs text-white">Sulit</Badge>
              <div className="text-xs text-gray-600">
                <div>5/15 gambar</div>
                <div>120 detik</div>
              </div>
            </div>
          </div>

          {/* Simple Scoring */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-700 text-center">
              <strong>Poin:</strong> Benar +20 | Salah -10 | Perfect +100
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center pt-2">
            <Button onClick={onStartGame} size="lg" className="px-8 w-full sm:w-auto">
              <Play className="h-4 w-4 mr-2" />
              Mulai Bermain
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
