"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { useAssessmentData } from '@/hooks/use-assessment-data'
import Link from 'next/link'

export function LearningProgress() {
  const { learningProgress, loading } = useAssessmentData()

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'locked': return 'bg-gray-300'
      default: return 'bg-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai'
      case 'in_progress': return 'Sedang Belajar'
      case 'locked': return 'Terkunci'
      default: return 'Belum Dimulai'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Progres Pembelajaran</span>
          </CardTitle>
          <Badge variant="outline">
            {learningProgress.completedMaterials}/{learningProgress.totalMaterials} Materi
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progres Keseluruhan</span>
            <span>{Math.round(learningProgress.overallProgress)}%</span>
          </div>
          <Progress value={learningProgress.overallProgress} className="h-2" />
        </div>

        {/* Materials List */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Materi Pembelajaran</h4>
          <div className="space-y-2">
            {learningProgress.materials.map((material, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(material.status)}`}></div>
                    {material.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {material.status === 'in_progress' && (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{material.title}</p>
                    <p className="text-xs text-gray-500">
                      {getStatusText(material.status)}
                      {material.completedAt && (
                        <span className="ml-1">
                          • {new Date(material.completedAt).toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {material.progress > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {material.progress}%
                    </Badge>
                  )}
                  {material.status !== 'locked' && (
                    <Link href={material.url}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <Link href="/materi">
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-1" />
                Lanjut Belajar
              </Button>
            </Link>
            <Link href="/kuis">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Kerjakan Kuis
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
