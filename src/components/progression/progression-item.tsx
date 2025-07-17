import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  CheckCircle, 
  Star, 
  Trophy, 
  Zap, 
  Clock,
  Target,
  BookOpen,
  Brain
} from 'lucide-react';
import type { MaterialState, QuizState } from '@/types/progression';

interface ProgressionItemProps {
  type: 'material' | 'quiz';
  item: MaterialState | QuizState;
  onItemClick: () => void;
}

export const ProgressionItem: React.FC<ProgressionItemProps> = ({
  type,
  item,
  onItemClick
}) => {
  const getStatusIcon = () => {
    if (type === 'material') {
      const materialItem = item as MaterialState;
      switch (materialItem.status) {
        case 'completed':
          return <CheckCircle className="w-6 h-6 text-green-500" />;
        case 'available':
          return <BookOpen className="w-6 h-6 text-blue-500" />;
        case 'locked':
          return <Lock className="w-6 h-6 text-gray-400" />;
      }
    } else {
      const quizItem = item as QuizState;
      switch (quizItem.status) {
        case 'passed':
          return <Trophy className="w-6 h-6 text-yellow-500" />;
        case 'available':
          return <Brain className="w-6 h-6 text-purple-500" />;
        case 'failed':
          return <Target className="w-6 h-6 text-red-500" />;
        case 'locked':
          return <Lock className="w-6 h-6 text-gray-400" />;
      }
    }
  };

  const getStatusColor = () => {
    if (type === 'material') {
      const materialItem = item as MaterialState;
      switch (materialItem.status) {
        case 'completed':
          return 'bg-green-50 border-green-200 hover:bg-green-100';
        case 'available':
          return 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer';
        case 'locked':
          return 'bg-gray-50 border-gray-200 cursor-not-allowed';
      }
    } else {
      const quizItem = item as QuizState;
      switch (quizItem.status) {
        case 'passed':
          return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
        case 'available':
          return 'bg-purple-50 border-purple-200 hover:bg-purple-100 cursor-pointer';
        case 'failed':
          return 'bg-red-50 border-red-200 hover:bg-red-100 cursor-pointer';
        case 'locked':
          return 'bg-gray-50 border-gray-200 cursor-not-allowed';
      }
    }
  };

  const isDisabled = () => {
    if (type === 'material') {
      return (item as MaterialState).status === 'locked';
    } else {
      return (item as QuizState).status === 'locked';
    }
  };

  const getTitle = () => {
    if (type === 'material') {
      return (item as MaterialState).material.title;
    } else {
      return (item as QuizState).quiz.title;
    }
  };

  const getDescription = () => {
    if (type === 'material') {
      const materialItem = item as MaterialState;
      return materialItem.material.description;
    } else {
      const quizItem = item as QuizState;
      return quizItem.unlock_reason || `Tingkat kesulitan: ${quizItem.quiz.difficulty}`;
    }
  };

  const getXPReward = () => {
    if (type === 'material') {
      return (item as MaterialState).material.xp_reward;
    } else {
      return (item as QuizState).quiz.xp_reward_pass;
    }
  };

  const getEstimatedTime = () => {
    if (type === 'material') {
      return (item as MaterialState).material.duration_minutes;
    } else {
      return (item as QuizState).quiz.estimated_time_minutes;
    }
  };

  const getLevel = () => {
    if (type === 'material') {
      return (item as MaterialState).material.level;
    } else {
      return (item as QuizState).quiz.level;
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${getStatusColor()}`}
      onClick={!isDisabled() ? onItemClick : undefined}
    >
      {/* Level Badge */}
      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
        Level {getLevel()}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 p-3 bg-white/80 rounded-xl">
            {getStatusIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate">
              {getTitle()}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {getDescription()}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{getEstimatedTime()} min</span>
          </div>
          
          {!isDisabled() && (
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{getXPReward()} XP</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          disabled={isDisabled()}
          variant={isDisabled() ? 'secondary' : 'default'}
          size="sm"
        >
          {type === 'material' ? (
            (item as MaterialState).status === 'completed' ? 'Lihat Kembali' :
            (item as MaterialState).status === 'available' ? 'Mulai Belajar' : 
            'Terkunci'
          ) : (
            (item as QuizState).status === 'passed' ? 'Ulangi Quiz' :
            (item as QuizState).status === 'available' ? 'Mulai Quiz' :
            (item as QuizState).status === 'failed' ? 'Coba Lagi' :
            'Terkunci'
          )}
        </Button>

        {/* Lock Reason */}
        {isDisabled() && type === 'quiz' && (item as QuizState).unlock_reason && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {(item as QuizState).unlock_reason}
          </p>
        )}
      </div>

      {/* Completion Stars */}
      {((type === 'material' && (item as MaterialState).status === 'completed') ||
        (type === 'quiz' && (item as QuizState).status === 'passed')) && (
        <div className="absolute top-2 left-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
      )}
    </Card>
  );
};
