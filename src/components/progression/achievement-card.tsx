import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Star, 
  Crown, 
  Zap,
  Trophy,
  Medal,
  Target
} from 'lucide-react';
import type { UserAchievement } from '@/types/progression';

interface AchievementCardProps {
  achievement: UserAchievement;
  isNew?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement, 
  isNew = false 
}) => {
  const achievementData = achievement.achievement;
  
  if (!achievementData) {
    return null;
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'xp':
        return <Zap className="w-6 h-6 text-blue-500" />;
      case 'streak':
        return <Star className="w-6 h-6 text-orange-500" />;
      case 'perfect_score':
        return <Crown className="w-6 h-6 text-purple-500" />;
      default:
        return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'completion':
        return 'from-yellow-100 to-yellow-200 border-yellow-300';
      case 'xp':
        return 'from-blue-100 to-blue-200 border-blue-300';
      case 'streak':
        return 'from-orange-100 to-orange-200 border-orange-300';
      case 'perfect_score':
        return 'from-purple-100 to-purple-200 border-purple-300';
      default:
        return 'from-gray-100 to-gray-200 border-gray-300';
    }
  };

  return (
    <Card className={`
      relative overflow-hidden p-4 transition-all duration-300 hover:shadow-lg
      bg-gradient-to-br ${getAchievementColor(achievementData.requirement_type)}
      ${isNew ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
    `}>
      {/* New Badge */}
      {isNew && (
        <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
          BARU!
        </Badge>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 p-3 bg-white/80 backdrop-blur-sm rounded-xl">
          {getAchievementIcon(achievementData.requirement_type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 mb-1">
            {achievementData.title}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            {achievementData.description}
          </p>
          
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Medal className="w-3 h-3" />
            <span>
              Diraih pada {new Date(achievement.earned_at).toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Sparkle Effect for New Achievements */}
      {isNew && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute top-8 right-8 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-100" />
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping delay-200" />
        </div>
      )}
    </Card>
  );
};

interface RecentAchievementsProps {
  achievements: UserAchievement[];
  limit?: number;
}

export const RecentAchievements: React.FC<RecentAchievementsProps> = ({ 
  achievements, 
  limit = 3 
}) => {
  const recentAchievements = achievements.slice(0, limit);

  if (recentAchievements.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-600 mb-1">Belum ada pencapaian</h3>
        <p className="text-sm text-gray-500">
          Selesaikan materi dan quiz untuk mendapatkan pencapaian pertama!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-500" />
        Pencapaian Terbaru
      </h3>
      
      {recentAchievements.map((achievement, index) => (
        <AchievementCard 
          key={achievement.id} 
          achievement={achievement}
          isNew={index === 0} // Mark first achievement as new
        />
      ))}
      
      {achievements.length > limit && (
        <Card className="p-4 text-center border-dashed">
          <p className="text-sm text-gray-500">
            +{achievements.length - limit} pencapaian lainnya
          </p>
        </Card>
      )}
    </div>
  );
};
