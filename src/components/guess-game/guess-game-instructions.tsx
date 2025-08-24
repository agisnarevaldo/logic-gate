'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Target, Clock, Heart } from 'lucide-react'

interface GuessGameInstructionsProps {
  onStartGame: () => void
}

export function GuessGameInstructions({ onStartGame }: GuessGameInstructionsProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Target className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Tebak Gambar</CardTitle>
          <p className="text-gray-600 mt-2">
            Temukan aplikasi gerbang logika dalam kehidupan sehari-hari!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Play className="h-5 w-5" />
              Cara Bermain:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 ml-6">
              <li>• Kamu akan melihat grid berisi berbagai gambar perangkat</li>
              <li>• Pilih gambar yang menunjukkan aplikasi gerbang logika</li>
              <li>• Setiap level memiliki jumlah jawaban benar yang berbeda</li>
              <li>• Hindari memilih gambar yang bukan aplikasi logika digital</li>
              <li>• Selesaikan sebelum waktu habis!</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Yang Harus Dicari:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-800 mb-2">✅ Contoh Benar:</div>
                <ul className="text-green-700 space-y-1">
                  <li>• ATM (PIN + Kartu)</li>
                  <li>• Smartphone (Face ID)</li>
                  <li>• Rice cooker digital</li>
                  <li>• Traffic light system</li>
                  <li>• Security system</li>
                </ul>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="font-medium text-red-800 mb-2">❌ Contoh Salah:</div>
                <ul className="text-red-700 space-y-1">
                  <li>• Kunci manual</li>
                  <li>• Jam analog</li>
                  <li>• Alat masak biasa</li>
                  <li>• Furniture</li>
                  <li>• Peralatan manual</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Level Kesulitan:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="text-center">
                <Badge variant="default" className="mb-2">Mudah</Badge>
                <div className="text-sm space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>3/9 gambar</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>60 detik</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">Sedang</Badge>
                <div className="text-sm space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>4/12 gambar</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>90 detik</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Badge variant="destructive" className="mb-2">Sulit</Badge>
                <div className="text-sm space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>5/15 gambar</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>120 detik</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Sistem Poin:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Perfect: 100 poin (semua benar, tidak ada salah)</li>
              <li>• Jawaban benar: +20 poin per gambar</li>
              <li>• Jawaban salah: -10 poin per gambar</li>
              <li>• Terlewat: -5 poin per gambar</li>
              <li>• Nyawa berkurang jika akurasi kurang dari 70%</li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={onStartGame} size="lg" className="px-8">
              <Play className="h-5 w-5 mr-2" />
              Mulai Bermain
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
