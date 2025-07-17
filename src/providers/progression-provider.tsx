"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { progressionService } from '@/services/progression';
import type { UserProgress, ProgressionState } from '@/types/progression';

export interface ProgressionContextType {
  userProgress: UserProgress | null;
  progressionState: ProgressionState | null;
  isLoading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  completeMaterial: (materialSlug: string) => Promise<boolean>;
  completeQuiz: (quizCode: string, score: number, percentage: number) => Promise<boolean>;
  getProgressPercentage: () => number;
  getCurrentStreak: () => number;
  getTotalXP: () => number;
}

// Export for backward compatibility
export type UseProgressionReturn = ProgressionContextType;

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export function ProgressionProvider({ children }: { children: React.ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progressionState, setProgressionState] = useState<ProgressionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const hasInitialized = useRef(false);

  const refreshProgress = useCallback(async () => {
    // Prevent multiple concurrent requests
    if (isLoadingRef.current) {
      console.log('Skipping refresh - already loading');
      return;
    }

    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching progression data...');
      
      const [progress, state] = await Promise.all([
        progressionService.getUserProgress(),
        progressionService.getProgressionState()
      ]);
      
      console.log('Progression data loaded:', { progress: !!progress, state: !!state });
      
      setUserProgress(progress);
      setProgressionState(state);
      hasInitialized.current = true;
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progression data');
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const completeMaterial = async (materialSlug: string): Promise<boolean> => {
    try {
      const success = await progressionService.completeMaterial(materialSlug);
      if (success) {
        await refreshProgress();
      }
      return success;
    } catch (err) {
      console.error('Error completing material:', err);
      setError('Failed to update progress');
      return false;
    }
  };

  const completeQuiz = async (quizCode: string, score: number, percentage: number): Promise<boolean> => {
    try {
      const success = await progressionService.completeQuiz(quizCode, score, percentage);
      if (success) {
        await refreshProgress();
      }
      return success;
    } catch (err) {
      console.error('Error completing quiz:', err);
      setError('Failed to update progress');
      return false;
    }
  };

  const getProgressPercentage = (): number => {
    if (!userProgress) return 0;
    
    const totalCompleted = userProgress.completed_materials.length + userProgress.passed_quizzes.length;
    const expectedTotal = 10; // 5 materials + 5 quizzes
    
    return Math.min((totalCompleted / expectedTotal) * 100, 100);
  };

  const getCurrentStreak = (): number => {
    return userProgress?.streak_days || 0;
  };

  const getTotalXP = (): number => {
    return userProgress?.total_xp || 0;
  };

  useEffect(() => {
    // Only initialize once when provider mounts
    if (!hasInitialized.current) {
      console.log('Initializing progression provider...');
      refreshProgress();
    }
  }, [refreshProgress]);

  const value: ProgressionContextType = {
    userProgress,
    progressionState,
    isLoading,
    error,
    refreshProgress,
    completeMaterial,
    completeQuiz,
    getProgressPercentage,
    getCurrentStreak,
    getTotalXP,
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
}

export function useProgressionContext(): ProgressionContextType {
  const context = useContext(ProgressionContext);
  if (context === undefined) {
    throw new Error('useProgressionContext must be used within a ProgressionProvider');
  }
  return context;
}
