import { useProgressionContext } from '@/providers/progression-provider';
import type { UseProgressionReturn } from '@/providers/progression-provider';

// Re-export the types for backward compatibility
export type { UseProgressionReturn };

// Simple wrapper hook that uses the context
export const useProgression = (): UseProgressionReturn => {
  return useProgressionContext();
};
