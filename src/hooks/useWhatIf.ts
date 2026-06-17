'use client';

import { useState, useCallback, useMemo } from 'react';
import { AssessmentData, WhatIfResult } from '@/types';
import { simulateStackedWhatIf, getPresetScenarios } from '@/lib/whatIfEngine';

/**
 * Hook for managing the What-If simulator state.
 */
export function useWhatIf(assessmentData: AssessmentData | null) {
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [result, setResult] = useState<WhatIfResult | null>(null);

  // Get preset scenarios based on user's assessment data
  const scenarios = useMemo(() => {
    if (!assessmentData) return [];
    return getPresetScenarios(assessmentData);
  }, [assessmentData]);

  // Toggle a scenario selection and recalculate stacked simulation
  const toggleScenario = useCallback(
    (scenarioId: string) => {
      if (!assessmentData) return;

      setSelectedScenarioIds((prev) => {
        let nextIds;
        if (prev.includes(scenarioId)) {
          nextIds = prev.filter((id) => id !== scenarioId);
        } else {
          nextIds = [...prev, scenarioId];
        }

        if (nextIds.length === 0) {
          setResult(null);
        } else {
          const selectedScenarios = scenarios.filter((s) => nextIds.includes(s.id));
          const simResult = simulateStackedWhatIf(assessmentData, selectedScenarios);
          setResult(simResult);
        }
        
        return nextIds;
      });
    },
    [assessmentData, scenarios]
  );

  // Clear the simulation
  const clearSimulation = useCallback(() => {
    setSelectedScenarioIds([]);
    setResult(null);
  }, []);

  return {
    scenarios,
    selectedScenarioIds,
    result,
    toggleScenario,
    clearSimulation,
  };
}
