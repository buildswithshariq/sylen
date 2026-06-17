// ============================================================
// EcoPilot AI — Eco Level / Gamification Engine
// ============================================================

import { EcoLevel, UserEcoLevel } from '@/types';
import { ECO_LEVELS } from './constants';

/**
 * Determine the user's Eco Level from their sustainability score.
 */
export function getUserEcoLevel(score: number): UserEcoLevel {
  // Find current level
  const current = ECO_LEVELS.find(
    (level) => score >= level.minScore && score <= level.maxScore
  ) ?? ECO_LEVELS[ECO_LEVELS.length - 1]; // Default to lowest

  // Find next level (the one just above current)
  const currentIndex = ECO_LEVELS.indexOf(current);
  const next = currentIndex > 0 ? ECO_LEVELS[currentIndex - 1] : null;

  // Calculate progress to next level
  const pointsToNext = next ? next.minScore - score : 0;
  const levelRange = current.maxScore - current.minScore + 1;
  const positionInLevel = score - current.minScore;
  const progressPercent = Math.round((positionInLevel / levelRange) * 100);

  return {
    current,
    next,
    pointsToNext,
    progressPercent,
  };
}

/**
 * Get all eco levels for display.
 */
export function getAllEcoLevels(): EcoLevel[] {
  return ECO_LEVELS;
}
