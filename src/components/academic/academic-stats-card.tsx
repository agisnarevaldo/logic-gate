"use client"

import { useState } from 'react'
import { useAcademicScoring } from '@/hooks/useAcademicScoring'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/utils/academic-scoring'
import { Trophy, TrendingUp, Target, Star, BookOpen } from 'lucide-react'

export function AcademicStatsCard() {
  const { 
    userStats, 
    recentAttempts, 
    getCurrentMasteryLevel,
    getPerformanceAnalytics,
    getLatestPerformanceFeedback,
    loading,
    error,
    refreshData
  } = useAcademicScoring()

  const [showDetails, setShowDetails] = useState(false)

  const masteryLevel = getCurrentMasteryLevel()
  const analytics = getPerformanceAnalytics()
  const feedback = getLatestPerformanceFeedback()

  if (loading && !userStats) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">
            <p className="mb-2">Error loading statistics</p>
            <Button onClick={refreshData} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userStats) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Academic Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <p className="mb-4">Mulai quiz pertama Anda untuk melihat statistik pembelajaran!</p>
            <div className="text-sm text-gray-400">
              Statistik akan muncul setelah Anda menyelesaikan minimal 1 quiz.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Academic Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mastery Level */}
        {masteryLevel && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-semibold text-purple-900 capitalize">
                  {masteryLevel.level} Level
                </h3>
                <p className="text-sm text-purple-700">{masteryLevel.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {userStats.total_quizzes_taken}
            </div>
            <div className="text-xs text-gray-500">Quiz Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {userStats.average_score.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Average Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {userStats.highest_score.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Best Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatTime(userStats.total_time_spent_seconds)}
            </div>
            <div className="text-xs text-gray-500">Time Spent</div>
          </div>
        </div>

        {/* Recent Performance */}
        {recentAttempts.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              {recentAttempts.slice(0, 3).map((attempt, index) => (
                <div key={attempt.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                  <span className="font-medium">Quiz #{recentAttempts.length - index}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      attempt.percentage >= 90 ? 'bg-green-100 text-green-800' :
                      attempt.percentage >= 75 ? 'bg-blue-100 text-blue-800' :
                      attempt.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {attempt.grade}
                    </span>
                    <span className="text-gray-600">{attempt.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Analytics */}
        {analytics && (
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? 'Hide' : 'Show'} Detailed Analytics
            </Button>
            
            {showDetails && (
              <div className="mt-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Improvement Rate:</span>
                    <div className="font-semibold text-green-600">
                      {analytics.overall_performance.improvement_rate > 0 ? '+' : ''}
                      {analytics.overall_performance.improvement_rate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Consistency:</span>
                    <div className="font-semibold text-blue-600">
                      {analytics.overall_performance.consistency_score.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Average Time:</span>
                  <div className="font-semibold">
                    {formatTime(analytics.time_analytics.average_completion_time)}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Fastest Completion:</span>
                  <div className="font-semibold">
                    {formatTime(analytics.time_analytics.fastest_completion)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Latest Feedback */}
        {feedback && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Performance Feedback
            </h4>
            <div className="text-sm space-y-2">
              <p className="text-gray-700">{feedback.message}</p>
              
              {feedback.achievements.length > 0 && (
                <div>
                  <span className="font-medium text-green-700">Achievements:</span>
                  <ul className="list-disc list-inside text-green-600 ml-2">
                    {feedback.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {feedback.suggestions.length > 0 && (
                <div>
                  <span className="font-medium text-blue-700">Suggestions:</span>
                  <ul className="list-disc list-inside text-blue-600 ml-2">
                    {feedback.suggestions.slice(0, 2).map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
