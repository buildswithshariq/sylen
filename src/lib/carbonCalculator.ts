// ============================================================
// EcoPilot AI — Carbon Calculator
// Calculates annual CO₂e emissions from assessment data.
// Sources: EPA GHG Emission Factors Hub, UK DEFRA 2023
// ============================================================

import {
  AssessmentData,
  CarbonBreakdown,
} from '@/types';
import {
  TRANSPORT_FACTORS,
  GRID_EMISSION_FACTOR,
  AC_POWER_KW,
  APPLIANCE_MULTIPLIERS,
  DIET_BASE_EMISSIONS,
  MEAT_MEAL_FACTOR,
  FOOD_WASTE_MULTIPLIERS,
  FLIGHT_EMISSIONS_PER_TRIP,
  SHOPPING_EMISSIONS,
  RECYCLING_OFFSETS,
} from './constants';

/**
 * Calculate annual transport emissions (kg CO₂e/year).
 */
export function calculateTransportEmissions(data: AssessmentData['transport']): number {
  const { vehicleType, fuelType, dailyDistanceKm } = data;

  if (vehicleType === 'bicycle' || vehicleType === 'walk') {
    return 0;
  }

  if (vehicleType === 'public_transit') {
    return dailyDistanceKm * TRANSPORT_FACTORS.public_transit * 365;
  }

  if (vehicleType === 'motorbike') {
    return dailyDistanceKm * TRANSPORT_FACTORS.motorbike * 365;
  }

  // Car — use fuel-type-specific factor
  const factor = TRANSPORT_FACTORS[fuelType] ?? TRANSPORT_FACTORS.gasoline;
  return dailyDistanceKm * factor * 365;
}

/**
 * Calculate annual home energy emissions (kg CO₂e/year).
 */
export function calculateEnergyEmissions(data: AssessmentData['energy']): number {
  const { monthlyElectricityKwh, acHoursPerDay, applianceUsage } = data;

  // Base electricity
  const baseElectricity = monthlyElectricityKwh * 12 * GRID_EMISSION_FACTOR;

  // AC usage
  const acEmissions = acHoursPerDay * AC_POWER_KW * 365 * GRID_EMISSION_FACTOR;

  // Appliance multiplier on base
  const multiplier = APPLIANCE_MULTIPLIERS[applianceUsage] ?? 1.0;

  return baseElectricity * multiplier + acEmissions;
}

/**
 * Calculate annual food-related emissions (kg CO₂e/year).
 */
export function calculateFoodEmissions(data: AssessmentData['food']): number {
  const { dietType, meatMealsPerWeek, foodWaste } = data;

  const baseEmissions = DIET_BASE_EMISSIONS[dietType] ?? DIET_BASE_EMISSIONS.mixed;
  const meatAdjustment = meatMealsPerWeek * MEAT_MEAL_FACTOR;
  const wasteMultiplier = FOOD_WASTE_MULTIPLIERS[foodWaste] ?? 1.0;

  return (baseEmissions + meatAdjustment) * wasteMultiplier;
}

/**
 * Calculate annual lifestyle emissions (kg CO₂e/year).
 */
export function calculateLifestyleEmissions(data: AssessmentData['lifestyle']): number {
  const { flightsPerYear, shoppingFrequency, recyclingHabit } = data;

  const flightEmissions = flightsPerYear * FLIGHT_EMISSIONS_PER_TRIP;
  const shoppingEmissions = SHOPPING_EMISSIONS[shoppingFrequency] ?? SHOPPING_EMISSIONS.monthly;
  const recyclingOffset = RECYCLING_OFFSETS[recyclingHabit] ?? 0;

  return Math.max(0, flightEmissions + shoppingEmissions + recyclingOffset);
}

/**
 * Calculate complete carbon breakdown from assessment data.
 * Returns per-category and total annual emissions in kg CO₂e.
 */
export function calculateCarbonFootprint(data: AssessmentData): CarbonBreakdown {
  const transport = calculateTransportEmissions(data.transport);
  const energy = calculateEnergyEmissions(data.energy);
  const food = calculateFoodEmissions(data.food);
  const lifestyle = calculateLifestyleEmissions(data.lifestyle);

  return {
    transport: Math.round(transport),
    energy: Math.round(energy),
    food: Math.round(food),
    lifestyle: Math.round(lifestyle),
    total: Math.round(transport + energy + food + lifestyle),
  };
}
