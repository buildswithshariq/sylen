'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SproutCompanion from '@/components/sprout/SproutCompanion';
import { AssessmentFormState, CoachContext } from '@/types';
import { calculateCarbonFootprint } from '@/lib/carbonCalculator';
import { generateSustainabilityScore } from '@/lib/carbonScoring';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { getUserEcoLevel } from '@/lib/ecoLevelEngine';

/**
 * Global Sprout 🌱 companion wrapper.
 * Reads assessment state from localStorage and builds context for Sprout.
 */
export default function SproutProvider() {
  const pathname = usePathname();
  const [context, setContext] = useState<CoachContext | null>(null);

  // Re-read assessment state on every page navigation
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sylen-assessment');
      if (stored) {
        const parsed = JSON.parse(stored) as AssessmentFormState;
        if (parsed.isComplete && parsed.data && parsed.data.transport && parsed.data.energy && parsed.data.food && parsed.data.lifestyle) {
          
          const assessmentData = parsed.data as import('@/types').AssessmentData;
          
          const breakdown = calculateCarbonFootprint(assessmentData);
          const score = generateSustainabilityScore(breakdown);
          const recommendations = generateRecommendations(assessmentData);
          const ecoLevel = getUserEcoLevel(score.score);
          
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setContext({
            score,
            recommendations,
            ecoLevel,
            assessment: assessmentData
          });
        } else {
          setContext(null);
        }
      } else {
        setContext(null);
      }
    } catch {
      setContext(null);
    }
  }, [pathname]);

  return (
    <SproutCompanion
      context={context}
    />
  );
}
