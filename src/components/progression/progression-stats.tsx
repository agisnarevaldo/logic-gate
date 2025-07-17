import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Trophy, 
  Zap, 
  Calendar, 
  Target,
  TrendingUp,
  Flame
} from 'lucide-react';
import type { UserProgress } from '@/types/progression';

interface ProgressionStatsProps {
  userProgress: UserProgress | null;
  progressPercentage: number;
}

export const ProgressionStats: React.FC<ProgressionStatsProps> = ({
  userProgress,
  progressPercentage
}) => {
  if (!userProgress) {
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center text-gray-500">
          Memuat statistik pembelajaran...
        </div>
      </Card>
    );
  }

  const stats = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      label: 'Total XP',
      value: userProgress.total_xp.toLocaleString(),
      color: 'text-yellow-600'
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      label: 'Streak',
      value: `${userProgress.streak_days} hari`,
      color: 'text-orange-600'
    },
    {
      icon: <Trophy className="w-5 h-5 text-purple-500" />,
      label: 'Quiz Lulus',
      value: userProgress.passed_quizzes.length,
      color: 'text-purple-600'
    },
    {
      icon: <Target className="w-5 h-5 text-green-500" />,
      label: 'Materi Selesai',
      value: userProgress.completed_materials.length,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Progress Pembelajaran
          </h3>
          <span className="text-2xl font-bold text-blue-600">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600">
          Level Materi: {userProgress.material_level} | Level Quiz: {userProgress.quiz_level}
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className={`text-lg font-bold ${stat.color} truncate`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Last Activity */}
      {userProgress.last_activity && (
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Terakhir belajar: {new Date(userProgress.last_activity).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};
