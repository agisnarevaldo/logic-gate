import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressionItem } from './progression-item';
import { ProgressionStats } from './progression-stats';
import { RecentAchievements } from './achievement-card';
import { useProgression } from '@/hooks/useProgression';
import { 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  Brain,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { MaterialState, QuizState } from '@/types/progression';

export const ProgressionPath: React.FC = () => {
  const router = useRouter();
  const { 
    userProgress, 
    progressionState, 
    isLoading, 
    error, 
    refreshProgress,
    getProgressPercentage
  } = useProgression();

  const handleMaterialClick = async (material: MaterialState) => {
    if (material.status === 'locked') return;
    
    // Navigate to material page
    router.push(`/materi/${material.material.slug}`);
    
    // If material is available but not completed, mark as started
    if (material.status === 'available') {
      // This would be tracked when user actually reads the material
      // For now, just navigate
    }
  };

  const handleQuizClick = async (quiz: QuizState) => {
    if (quiz.status === 'locked') return;
    
    // Navigate to quiz page
    router.push(`/kuis/${quiz.quiz.quiz_code.toLowerCase().replace('_', '-')}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Memuat jalur pembelajaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Gagal memuat data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refreshProgress}>
          Coba Lagi
        </Button>
      </Card>
    );
  }

  if (!progressionState || !userProgress) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-600 mb-2">Data tidak tersedia</h3>
        <p className="text-gray-500">Silakan refresh halaman atau login ulang.</p>
      </Card>
    );
  }

  // Group materials and quizzes by level for better visualization
  const learningPath = [];
  const maxLevel = Math.max(
    ...progressionState.materials.map(m => m.material.level),
    ...progressionState.quizzes.map(q => q.quiz.level)
  );

  for (let level = 1; level <= maxLevel; level++) {
    const materialsForLevel = progressionState.materials.filter(
      m => m.material.level === level
    );
    const quizzesForLevel = progressionState.quizzes.filter(
      q => q.quiz.level === level
    );

    if (materialsForLevel.length > 0 || quizzesForLevel.length > 0) {
      learningPath.push({
        level,
        materials: materialsForLevel,
        quizzes: quizzesForLevel
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Jalur Pembelajaran
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ikuti jalur pembelajaran step-by-step untuk menguasai Logic Gate. 
          Selesaikan materi dan quiz secara berurutan untuk unlock level berikutnya!
        </p>
      </div>

      {/* Stats */}
      <ProgressionStats 
        userProgress={userProgress}
        progressPercentage={getProgressPercentage()}
      />

      {/* Learning Path */}
      <div className="space-y-8">
        {learningPath.map((pathLevel, levelIndex) => (
          <div key={pathLevel.level} className="relative">
            {/* Level Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold text-lg">
                {pathLevel.level}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Level {pathLevel.level}
                </h2>
                <p className="text-gray-600">
                  {pathLevel.materials.length} Materi • {pathLevel.quizzes.length} Quiz
                </p>
              </div>
            </div>

            {/* Materials */}
            {pathLevel.materials.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Materi Pembelajaran
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pathLevel.materials.map((material) => (
                    <ProgressionItem
                      key={material.material.id}
                      type="material"
                      item={material}
                      onItemClick={() => handleMaterialClick(material)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quizzes */}
            {pathLevel.quizzes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Quiz & Latihan
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pathLevel.quizzes.map((quiz) => (
                    <ProgressionItem
                      key={quiz.quiz.id}
                      type="quiz"
                      item={quiz}
                      onItemClick={() => handleQuizClick(quiz)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Connection Arrow */}
            {levelIndex < learningPath.length - 1 && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border-2 border-dashed border-blue-300">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">
                    Lanjut ke Level {pathLevel.level + 1}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Achievements */}
      {progressionState.recentAchievements && progressionState.recentAchievements.length > 0 && (
        <RecentAchievements achievements={progressionState.recentAchievements} />
      )}

      {/* Motivational Card */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">
            Tetap Semangat Belajar!
          </h3>
          <p className="text-gray-600 mb-4">
            Konsistensi adalah kunci. Luangkan 15-20 menit setiap hari untuk belajar Logic Gate.
          </p>
          {progressionState.canProceedToNext && (
            <div className="bg-green-100 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 font-medium">
                🎉 Selamat! Anda siap melanjutkan ke level berikutnya!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
