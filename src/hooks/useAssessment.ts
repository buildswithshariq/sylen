'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  AssessmentData,
  AssessmentFormState,
  AssessmentStep,
  TransportData,
  EnergyData,
  FoodData,
  LifestyleData,
} from '@/types';

const STORAGE_KEY = 'sylen-assessment';

const defaultTransport: TransportData = {
  vehicleType: 'car',
  fuelType: 'gasoline',
  dailyDistanceKm: 20,
};

const defaultEnergy: EnergyData = {
  monthlyElectricityKwh: 300,
  acHoursPerDay: 4,
  applianceUsage: 'medium',
};

const defaultFood: FoodData = {
  dietType: 'mixed',
  meatMealsPerWeek: 5,
  foodWaste: 'some',
};

const defaultLifestyle: LifestyleData = {
  flightsPerYear: 2,
  shoppingFrequency: 'monthly',
  recyclingHabit: 'sometimes',
  displayName: '',
};

function loadFromStorage(): AssessmentFormState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('[useAssessment] loadFromStorage read:', stored);
    if (stored) return JSON.parse(stored);
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveToStorage(state: AssessmentFormState) {
  if (typeof window === 'undefined') return;
  try {
    console.log('[useAssessment] saveToStorage writing:', state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Validate whether a step has all required data.
 */
function isStepDataValid(step: AssessmentStep, data: Partial<AssessmentData>): boolean {
  switch (step) {
    case 0:
      return !!(data.transport?.vehicleType && data.transport?.dailyDistanceKm !== undefined);
    case 1:
      return !!(
        data.energy?.monthlyElectricityKwh !== undefined &&
        data.energy?.acHoursPerDay !== undefined &&
        data.energy?.applianceUsage
      );
    case 2:
      return !!(
        data.food?.dietType &&
        data.food?.meatMealsPerWeek !== undefined &&
        data.food?.foodWaste
      );
    case 3:
      return !!(
        data.lifestyle?.flightsPerYear !== undefined &&
        data.lifestyle?.shoppingFrequency &&
        data.lifestyle?.recyclingHabit
      );
    default:
      return false;
  }
}

export function useAssessment() {
  const [state, setState] = useState<AssessmentFormState>({
    currentStep: 0,
    data: {
      transport: defaultTransport,
      energy: defaultEnergy,
      food: defaultFood,
      lifestyle: defaultLifestyle,
    },
    isComplete: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        ...stored,
        // Ensure defaults are set for any missing data
        data: {
          transport: { ...defaultTransport, ...stored.data.transport },
          energy: { ...defaultEnergy, ...stored.data.energy },
          food: { ...defaultFood, ...stored.data.food },
          lifestyle: { ...defaultLifestyle, ...stored.data.lifestyle },
        },
      });
    } else {
      console.log('[useAssessment] No stored data found during mount');
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on every change, ONLY AFTER LOADED
  useEffect(() => {
    if (isLoaded) {
      console.log('[useAssessment] isLoaded is true, triggering saveToStorage');
      saveToStorage(state);
    } else {
      console.log('[useAssessment] isLoaded is false, SKIPPING saveToStorage');
    }
  }, [state, isLoaded]);

  const updateTransport = useCallback((transport: TransportData) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, transport },
    }));
  }, []);

  const updateEnergy = useCallback((energy: EnergyData) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, energy },
    }));
  }, []);

  const updateFood = useCallback((food: FoodData) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, food },
    }));
  }, []);

  const updateLifestyle = useCallback((lifestyle: LifestyleData) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, lifestyle },
    }));
  }, []);

  const nextStep = useCallback(() => {
    console.log('[useAssessment] nextStep called');
    setState((prev) => {
      if (prev.currentStep >= 3) {
        console.log('[useAssessment] Assessment complete!');
        return { ...prev, isComplete: true };
      }
      return {
        ...prev,
        currentStep: (prev.currentStep + 1) as AssessmentStep,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1) as AssessmentStep,
    }));
  }, []);

  const isStepValid = useCallback(
    (step?: AssessmentStep) => {
      return isStepDataValid(step ?? state.currentStep, state.data);
    },
    [state.currentStep, state.data]
  );

  const resetAssessment = useCallback(() => {
    const newState: AssessmentFormState = {
      currentStep: 0,
      data: {
        transport: defaultTransport,
        energy: defaultEnergy,
        food: defaultFood,
        lifestyle: defaultLifestyle,
      },
      isComplete: false,
    };
    setState(newState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Build full AssessmentData when complete
  const assessmentData: AssessmentData | null = state.isComplete
    ? {
        transport: state.data.transport ?? defaultTransport,
        energy: state.data.energy ?? defaultEnergy,
        food: state.data.food ?? defaultFood,
        lifestyle: state.data.lifestyle ?? defaultLifestyle,
      }
    : null;

  return {
    currentStep: state.currentStep,
    data: state.data,
    isComplete: state.isComplete,
    isLoaded,
    assessmentData,
    updateTransport,
    updateEnergy,
    updateFood,
    updateLifestyle,
    nextStep,
    prevStep,
    isStepValid,
    resetAssessment,
  };
}
