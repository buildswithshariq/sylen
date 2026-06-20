// ============================================================
// Sylen — What-If Simulation Engine
// Compares current assessment with hypothetical changes.
// ============================================================

import { AssessmentData, WhatIfResult, WhatIfScenario } from "@/types";
import { calculateCarbonFootprint } from "./carbonCalculator";
import { generateSustainabilityScore } from "./carbonScoring";

/**
 * Deep-merge partial assessment modifications onto the original data.
 */
function applyModifications(
  original: AssessmentData,
  modifications: WhatIfScenario["modifications"],
): AssessmentData {
  return {
    transport: { ...original.transport, ...modifications.transport },
    energy: { ...original.energy, ...modifications.energy },
    food: { ...original.food, ...modifications.food },
    lifestyle: { ...original.lifestyle, ...modifications.lifestyle },
  };
}

/**
 * Run a What-If simulation: given original data and a scenario,
 * calculate the new score, emissions, and improvement.
 */
export function simulateWhatIf(
  originalData: AssessmentData,
  scenario: WhatIfScenario,
): WhatIfResult {
  const originalBreakdown = calculateCarbonFootprint(originalData);
  const originalScoreResult = generateSustainabilityScore(originalBreakdown);

  const modifiedData = applyModifications(originalData, scenario.modifications);
  const newBreakdown = calculateCarbonFootprint(modifiedData);
  const newScoreResult = generateSustainabilityScore(newBreakdown);

  const reductionKg = originalBreakdown.total - newBreakdown.total;
  const improvementPercent =
    originalBreakdown.total > 0
      ? Math.round((reductionKg / originalBreakdown.total) * 100)
      : 0;

  return {
    originalScore: originalScoreResult.score,
    newScore: newScoreResult.score,
    originalEmissions: originalBreakdown.total,
    newEmissions: newBreakdown.total,
    reductionKg,
    improvementPercent,
    newCategory: newScoreResult.category,
    newCategoryLabel: newScoreResult.categoryLabel,
  };
}

/**
 * Run a What-If simulation with MULTIPLE scenarios stacked together.
 */
export function simulateStackedWhatIf(
  originalData: AssessmentData,
  scenarios: WhatIfScenario[],
): WhatIfResult {
  const originalBreakdown = calculateCarbonFootprint(originalData);
  const originalScoreResult = generateSustainabilityScore(originalBreakdown);

  // Apply all scenario modifications sequentially
  let modifiedData = { ...originalData };
  for (const scenario of scenarios) {
    modifiedData = applyModifications(modifiedData, scenario.modifications);
  }

  const newBreakdown = calculateCarbonFootprint(modifiedData);
  const newScoreResult = generateSustainabilityScore(newBreakdown);

  const reductionKg = originalBreakdown.total - newBreakdown.total;
  const improvementPercent =
    originalBreakdown.total > 0
      ? Math.round((reductionKg / originalBreakdown.total) * 100)
      : 0;

  return {
    originalScore: originalScoreResult.score,
    newScore: newScoreResult.score,
    originalEmissions: originalBreakdown.total,
    newEmissions: newBreakdown.total,
    reductionKg,
    improvementPercent,
    newCategory: newScoreResult.category,
    newCategoryLabel: newScoreResult.categoryLabel,
  };
}

/**
 * Pre-built What-If scenarios.
 * These adapt dynamically based on user's current assessment data.
 */
export function getPresetScenarios(data: AssessmentData): WhatIfScenario[] {
  const scenarios: WhatIfScenario[] = [];

  // Only show car-related scenarios if user drives
  if (data.transport.vehicleType === "car") {
    scenarios.push(
      {
        id: "switch-to-transit",
        label: "Switch to public transit",
        description: "What if you used public transport instead of driving?",
        icon: "🚇",
        modifications: {
          transport: {
            vehicleType: "public_transit",
          },
        },
      },
      {
        id: "switch-to-ev",
        label: "Switch to electric vehicle",
        description: "What if you drove an electric car instead?",
        icon: "⚡",
        modifications: {
          transport: {
            fuelType: "electric",
          },
        },
      }
    );
  }

  // AC reduction scenario
  if (data.energy.acHoursPerDay > 2) {
    scenarios.push({
      id: "reduce-ac",
      label: "Reduce AC by 2 hours/day",
      description: "What if you used AC for 2 fewer hours each day?",
      icon: "❄️",
      modifications: {
        energy: {
          acHoursPerDay: Math.max(0, data.energy.acHoursPerDay - 2),
        },
      },
    });
  }

  // Diet change scenario
  if (data.food.dietType === "heavy_meat" || data.food.dietType === "mixed") {
    scenarios.push({
      id: "go-vegetarian-partial",
      label: "Go vegetarian 2 days/week",
      description: "What if you ate vegetarian meals twice a week?",
      icon: "🥗",
      modifications: {
        food: {
          meatMealsPerWeek: Math.max(0, data.food.meatMealsPerWeek - 4),
        },
      },
    });
  }

  if (data.food.dietType !== "vegan") {
    scenarios.push({
      id: "go-fully-vegetarian",
      label: "Go fully vegetarian",
      description: "What if you switched to a vegetarian diet?",
      icon: "🌱",
      modifications: {
        food: {
          dietType: "vegetarian",
          meatMealsPerWeek: 0,
        },
      },
    });
  }

  // Flight reduction
  if (data.lifestyle.flightsPerYear > 1) {
    scenarios.push({
      id: "reduce-flights",
      label: "Cut flights in half",
      description: "What if you flew half as often?",
      icon: "✈️",
      modifications: {
        lifestyle: {
          flightsPerYear: Math.ceil(data.lifestyle.flightsPerYear / 2),
        },
      },
    });
  }

  // Recycling improvement
  if (data.lifestyle.recyclingHabit !== "always") {
    scenarios.push({
      id: "recycle-always",
      label: "Recycle everything",
      description: "What if you recycled consistently?",
      icon: "♻️",
      modifications: {
        lifestyle: {
          recyclingHabit: "always",
        },
      },
    });
  }

  return scenarios;
}
