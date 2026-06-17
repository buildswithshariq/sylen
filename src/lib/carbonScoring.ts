// ============================================================
// EcoPilot AI — Carbon Scoring Engine
// Maps CO₂e emissions to a 0–100 sustainability score.
// ============================================================

import {
  CarbonBreakdown,
  CategoryContribution,
  EmissionCategory,
  ImpactCategory,
  SustainabilityScore,
} from '@/types';
import {
  SCORE_THRESHOLDS,
  IMPACT_CATEGORIES,
  NATIONAL_AVERAGE_KG,
  CATEGORY_LABELS,
} from './constants';

/**
 * Calculate a 0–100 sustainability score from total annual emissions.
 * Uses linear interpolation between threshold bands.
 * Lower emissions → higher score.
 */
function computeScore(totalEmissionsKg: number): number {
  if (totalEmissionsKg <= SCORE_THRESHOLDS[0].maxEmissions) {
    return 100;
  }

  for (let i = 1; i < SCORE_THRESHOLDS.length; i++) {
    const upper = SCORE_THRESHOLDS[i];
    const lower = SCORE_THRESHOLDS[i - 1];

    if (totalEmissionsKg <= upper.maxEmissions) {
      // Linear interpolation within this band
      const range = upper.maxEmissions - lower.maxEmissions;
      const position = totalEmissionsKg - lower.maxEmissions;
      const scoreRange = lower.score - upper.score;
      return Math.round(lower.score - (position / range) * scoreRange);
    }
  }

  // Beyond the worst threshold
  const last = SCORE_THRESHOLDS[SCORE_THRESHOLDS.length - 1];
  const overshoot = totalEmissionsKg - last.maxEmissions;
  return Math.max(0, Math.round(last.score - (overshoot / 5000) * last.score));
}

/**
 * Determine impact category from score.
 */
function getImpactCategory(score: number): ImpactCategory {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'moderate';
  return 'high_impact';
}

/**
 * Calculate per-category contribution percentages.
 */
function computeContributions(breakdown: CarbonBreakdown): CategoryContribution[] {
  const categories: EmissionCategory[] = ['transport', 'energy', 'food', 'lifestyle'];
  const total = breakdown.total || 1; // prevent division by zero

  return categories
    .map((category) => ({
      category,
      amount: breakdown[category],
      percentage: Math.round((breakdown[category] / total) * 100),
      label: CATEGORY_LABELS[category] ?? category,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Generate a complete sustainability score from a carbon breakdown.
 */
export function generateSustainabilityScore(breakdown: CarbonBreakdown): SustainabilityScore {
  const score = computeScore(breakdown.total);
  const category = getImpactCategory(score);
  const categoryInfo = IMPACT_CATEGORIES[category];
  const contributions = computeContributions(breakdown);

  // How the user compares to national average (negative = better)
  const comparisonToAverage = Math.round(
    ((breakdown.total - NATIONAL_AVERAGE_KG) / NATIONAL_AVERAGE_KG) * 100
  );

  return {
    score,
    category,
    categoryLabel: categoryInfo.label,
    breakdown,
    contributions,
    comparisonToAverage,
    totalEmissions: breakdown.total,
  };
}
