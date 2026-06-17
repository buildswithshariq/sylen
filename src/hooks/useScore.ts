'use client';

import { useMemo } from 'react';
import { AssessmentData, SustainabilityScore, Recommendation, UserEcoLevel, Roadmap } from '@/types';
import { calculateCarbonFootprint } from '@/lib/carbonCalculator';
import { generateSustainabilityScore } from '@/lib/carbonScoring';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { getUserEcoLevel } from '@/lib/ecoLevelEngine';
import { generateRoadmap } from '@/lib/roadmapEngine';

interface ScoreResults {
  score: SustainabilityScore;
  recommendations: Recommendation[];
  ecoLevel: UserEcoLevel;
  roadmap: Roadmap;
}

/**
 * Hook that computes the full score results from assessment data.
 * Runs the entire deterministic carbon intelligence pipeline.
 */
export function useScore(assessmentData: AssessmentData | null): ScoreResults | null {
  return useMemo(() => {
    if (!assessmentData) return null;

    // Layer 1: Deterministic Carbon Intelligence
    const breakdown = calculateCarbonFootprint(assessmentData);
    const score = generateSustainabilityScore(breakdown);
    const recommendations = generateRecommendations(assessmentData);
    const ecoLevel = getUserEcoLevel(score.score);
    const roadmap = generateRoadmap(recommendations);

    return {
      score,
      recommendations,
      ecoLevel,
      roadmap,
    };
  }, [assessmentData]);
}
