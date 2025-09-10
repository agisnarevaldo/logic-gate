"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Brain, Gamepad2, Trophy, Calendar } from 'lucide-react'
import { useAssessmentData } from '@/hooks/use-assessment-data'

export function ScoreHistory() {
  const { scoreHistory, loading } = useAssessmentData()
  const [activeTab, setActiveTab] = useState('all')

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const filterByType = (type: string) => {
    if (type === 'all') return scoreHistory.records
    return scoreHistory.records.filter(record => record.type === type)
  }

  const getBestScore = (type: string) => {
    const filtered = filterByType(type)
    if (filtered.length === 0) return 0
    return Math.max(...filtered.map(record => record.score))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Riwayat Skor</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600">
              <Trophy className="h-3 w-3 mr-1" />
              Best Quiz: {getBestScore('quiz')}%
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              <Gamepad2 className="h-3 w-3 mr-1" />
              Best Game: {getBestScore('game')}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="quiz">Kuis</TabsTrigger>
            <TabsTrigger value="game">Game</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            <ScoreRecordsList records={scoreHistory.records} />
          </TabsContent>

          <TabsContent value="quiz" className="space-y-4 mt-4">
            <ScoreRecordsList records={filterByType('quiz')} />
          </TabsContent>

          <TabsContent value="game" className="space-y-4 mt-4">
            <ScoreRecordsList records={filterByType('game')} />
          </TabsContent>
        </Tabs>

        {scoreHistory.records.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada riwayat skor</p>
            <p className="text-sm">Mulai kerjakan kuis atau main game untuk melihat progres Anda</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ScoreRecord {
  title: string
  type: 'quiz' | 'game'
  score: number
  correctAnswers?: number
  totalQuestions?: number
  timeTaken?: number
  completedAt: string
  isPersonalBest: boolean
}

function ScoreRecordsList({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>Tidak ada data untuk kategori ini</p>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getGrade = (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return Brain
      case 'game': return Gamepad2
      default: return BarChart3
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'Kuis'
      case 'game': return 'Game'
      default: return 'Lainnya'
    }
  }

  return (
    <div className="space-y-3">
      {records.map((record, index) => {
        const IconComponent = getTypeIcon(record.type)
        return (
          <div 
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <IconComponent className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">{record.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(record.type)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(record.completedAt).toLocaleDateString('id-ID')}</span>
                  {record.timeTaken && (
                    <>
                      <span>•</span>
                      <span>{Math.floor(record.timeTaken / 60)}m {record.timeTaken % 60}s</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className={`px-3 py-1 rounded-lg border text-sm font-medium ${getScoreColor(record.score)}`}>
                  {record.score}% ({getGrade(record.score)})
                </div>
                {record.correctAnswers !== undefined && record.totalQuestions && (
                  <p className="text-xs text-gray-500 mt-1">
                    {record.correctAnswers}/{record.totalQuestions} benar
                  </p>
                )}
              </div>
              {record.isPersonalBest && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Trophy className="h-3 w-3 mr-1" />
                  Best
                </Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
