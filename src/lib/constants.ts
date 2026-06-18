// ============================================================
// Sylen — Constants & Emission Factors
// Sources: EPA GHG Emission Factors Hub, UK DEFRA 2023
// ============================================================

import { EcoLevel, ImpactCategory } from '@/types';

// --- Transport Emission Factors (kg CO₂e per km) ---

export const TRANSPORT_FACTORS: Record<string, number> = {
  gasoline: 0.21,
  diesel: 0.27,
  hybrid: 0.12,
  electric: 0.05,
  public_transit: 0.089,
  motorbike: 0.11,
  bicycle: 0,
  walk: 0,
};

// --- Energy Emission Factors ---

/** US average grid emission factor (kg CO₂e per kWh) */
export const GRID_EMISSION_FACTOR = 0.42;

/** Average AC power consumption (kW) */
export const AC_POWER_KW = 1.5;

/** Appliance usage multipliers on base electricity */
export const APPLIANCE_MULTIPLIERS: Record<string, number> = {
  low: 0.8,
  medium: 1.0,
  high: 1.3,
};

// --- Food Emission Factors (kg CO₂e per year, base by diet) ---

export const DIET_BASE_EMISSIONS: Record<string, number> = {
  vegan: 1500,
  vegetarian: 1700,
  mixed: 2500,
  heavy_meat: 3300,
};

/** Additional CO₂e per meat meal per week over a year (kg) */
export const MEAT_MEAL_FACTOR = 60;

/** Food waste multipliers */
export const FOOD_WASTE_MULTIPLIERS: Record<string, number> = {
  minimal: 1.0,
  some: 1.1,
  significant: 1.25,
};

// --- Lifestyle Emission Factors ---

/** Average CO₂e per round-trip flight (kg) — blended short/long */
export const FLIGHT_EMISSIONS_PER_TRIP = 1100;

/** Shopping frequency emissions (kg CO₂e per year) */
export const SHOPPING_EMISSIONS: Record<string, number> = {
  rarely: 200,
  monthly: 600,
  weekly: 1200,
};

/** Recycling offset (kg CO₂e saved per year) */
export const RECYCLING_OFFSETS: Record<string, number> = {
  always: -300,
  sometimes: -100,
  never: 0,
};

// --- Scoring Thresholds ---

/** US national average annual carbon footprint (kg CO₂e) */
export const NATIONAL_AVERAGE_KG = 16000;

/** Global average annual carbon footprint (kg CO₂e) */
export const GLOBAL_AVERAGE_KG = 4700;

/** Score boundaries — lower emissions = higher score */
export const SCORE_THRESHOLDS: { maxEmissions: number; score: number }[] = [
  { maxEmissions: 2000, score: 100 },
  { maxEmissions: 4000, score: 90 },
  { maxEmissions: 6000, score: 80 },
  { maxEmissions: 8000, score: 70 },
  { maxEmissions: 10000, score: 60 },
  { maxEmissions: 12000, score: 50 },
  { maxEmissions: 14000, score: 40 },
  { maxEmissions: 16000, score: 30 },
  { maxEmissions: 20000, score: 20 },
  { maxEmissions: 25000, score: 10 },
];

// --- Impact Categories ---

export const IMPACT_CATEGORIES: Record<ImpactCategory, { label: string; minScore: number; maxScore: number; color: string }> = {
  excellent: { label: 'Excellent', minScore: 80, maxScore: 100, color: '#16a34a' },
  good: { label: 'Good', minScore: 60, maxScore: 79, color: '#65a30d' },
  moderate: { label: 'Moderate', minScore: 40, maxScore: 59, color: '#ca8a04' },
  high_impact: { label: 'High Impact', minScore: 0, maxScore: 39, color: '#dc2626' },
};

// --- Eco Levels ---

export const ECO_LEVELS: EcoLevel[] = [
  { name: 'Earth Guardian', badge: '🌍', minScore: 90, maxScore: 100, color: '#16a34a' },
  { name: 'Climate Champion', badge: '🌱', minScore: 75, maxScore: 89, color: '#22c55e' },
  { name: 'Green Explorer', badge: '🍃', minScore: 60, maxScore: 74, color: '#65a30d' },
  { name: 'Eco Learner', badge: '🌿', minScore: 40, maxScore: 59, color: '#ca8a04' },
  { name: 'High Impact', badge: '⚠️', minScore: 0, maxScore: 39, color: '#dc2626' },
];

// --- Category Labels ---

export const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transportation',
  energy: 'Home Energy',
  food: 'Food & Diet',
  lifestyle: 'Lifestyle',
};
