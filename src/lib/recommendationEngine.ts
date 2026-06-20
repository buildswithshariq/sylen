// ============================================================
// Sylen — Recommendation Engine
// Rule-based, deterministic. Never random.
// ============================================================

import { AssessmentData, Recommendation } from "@/types";

let idCounter = 0;
function nextId(): string {
  return `rec-${++idCounter}`;
}

/**
 * Generate transport-related recommendations.
 */
function getTransportRecommendations(data: AssessmentData): Recommendation[] {
  const recs: Recommendation[] = [];
  const { vehicleType, fuelType, dailyDistanceKm } = data.transport;

  if (vehicleType === "car") {
    if (dailyDistanceKm > 10) {
      recs.push({
        id: nextId(),
        title: "Switch to public transport for daily commute",
        description: `Your ${dailyDistanceKm}km daily car commute generates significant emissions. Public transit can reduce this by up to 75%.`,
        category: "transport",
        estimatedReductionKg: Math.round(dailyDistanceKm * 0.12 * 365),
        difficulty: "medium",
        priority: 1,
        icon: "🚇",
      });
    }

    recs.push({
      id: nextId(),
      title: "Try carpooling 3 days per week",
      description:
        "Sharing rides cuts your per-person transport emissions by up to 50% on carpool days.",
      category: "transport",
      estimatedReductionKg: Math.round(dailyDistanceKm * 0.06 * 365 * (3 / 5)),
      difficulty: "easy",
      priority: 2,
      icon: "🚗",
    });

    if (fuelType === "gasoline" || fuelType === "diesel") {
      recs.push({
        id: nextId(),
        title: "Consider switching to a hybrid or electric vehicle",
        description: `Switching from ${fuelType} to electric could reduce your transport emissions by over 75%.`,
        category: "transport",
        estimatedReductionKg: Math.round(dailyDistanceKm * 0.16 * 365),
        difficulty: "hard",
        priority: 3,
        icon: "⚡",
      });
    }

    if (dailyDistanceKm <= 10) {
      recs.push({
        id: nextId(),
        title: "Cycle or walk for short commutes",
        description:
          "Your commute is short enough to bike or walk — zero emissions and great for health!",
        category: "transport",
        estimatedReductionKg: Math.round(dailyDistanceKm * 0.21 * 365),
        difficulty: "easy",
        priority: 1,
        icon: "🚴",
      });
    }
  }

  if (vehicleType === "public_transit" && dailyDistanceKm > 5) {
    recs.push({
      id: nextId(),
      title: "Work from home 1-2 days per week",
      description:
        "Remote work eliminates commute emissions entirely on those days.",
      category: "transport",
      estimatedReductionKg: Math.round(
        dailyDistanceKm * 0.089 * 365 * (1.5 / 5),
      ),
      difficulty: "easy",
      priority: 2,
      icon: "🏠",
    });
  }

  return recs;
}

/**
 * Generate energy-related recommendations.
 */
function getEnergyRecommendations(data: AssessmentData): Recommendation[] {
  const recs: Recommendation[] = [];
  const { monthlyElectricityKwh, acHoursPerDay, applianceUsage } = data.energy;

  if (acHoursPerDay > 6) {
    recs.push(
      {
        id: nextId(),
        title: "Reduce AC usage by 2 hours per day",
        description: `You use AC for ${acHoursPerDay} hours daily. Reducing by 2 hours saves energy and cuts emissions.`,
        category: "energy",
        estimatedReductionKg: Math.round(2 * 1.5 * 365 * 0.42),
        difficulty: "easy",
        priority: 1,
        icon: "❄️",
      },
      {
        id: nextId(),
        title: "Set AC to 24°C instead of 20°C",
        description:
          "Every degree higher saves approximately 6% of AC energy consumption.",
        category: "energy",
        estimatedReductionKg: Math.round(acHoursPerDay * 1.5 * 365 * 0.42 * 0.24),
        difficulty: "easy",
        priority: 2,
        icon: "🌡️",
      }
    );
  } else if (acHoursPerDay > 3) {
    recs.push({
      id: nextId(),
      title: "Use a fan before turning on AC",
      description:
        "Fans use 90% less energy than AC. Use them when the temperature is bearable.",
      category: "energy",
      estimatedReductionKg: Math.round(1.5 * 1.5 * 365 * 0.42),
      difficulty: "easy",
      priority: 2,
      icon: "🌀",
    });
  }

  if (monthlyElectricityKwh > 300) {
    recs.push({
      id: nextId(),
      title: "Switch to LED lighting throughout your home",
      description:
        "LEDs use 75% less energy than incandescent bulbs and last 25× longer.",
      category: "energy",
      estimatedReductionKg: Math.round(monthlyElectricityKwh * 0.1 * 12 * 0.42),
      difficulty: "easy",
      priority: 3,
      icon: "💡",
    });
  }

  if (applianceUsage === "high") {
    recs.push({
      id: nextId(),
      title: "Upgrade to energy-efficient appliances",
      description:
        "Energy Star appliances use 10-50% less energy than standard models.",
      category: "energy",
      estimatedReductionKg: Math.round(
        monthlyElectricityKwh * 0.15 * 12 * 0.42,
      ),
      difficulty: "hard",
      priority: 3,
      icon: "🔌",
    });
  }

  if (monthlyElectricityKwh > 200) {
    recs.push({
      id: nextId(),
      title: "Unplug devices when not in use",
      description:
        'Standby power ("vampire energy") accounts for 5-10% of home energy use.',
      category: "energy",
      estimatedReductionKg: Math.round(
        monthlyElectricityKwh * 0.07 * 12 * 0.42,
      ),
      difficulty: "easy",
      priority: 4,
      icon: "🔋",
    });
  }

  return recs;
}

/**
 * Generate food-related recommendations.
 */
function getFoodRecommendations(data: AssessmentData): Recommendation[] {
  const recs: Recommendation[] = [];
  const { dietType, meatMealsPerWeek, foodWaste } = data.food;

  if (dietType === "heavy_meat" || dietType === "mixed") {
    if (meatMealsPerWeek > 5) {
      recs.push({
        id: nextId(),
        title: "Try 2 meat-free days per week",
        description:
          "Replacing 2 days of meat with plant-based meals can significantly reduce your food emissions.",
        category: "food",
        estimatedReductionKg: Math.round(2 * 60 * (52 / 7)),
        difficulty: "easy",
        priority: 1,
        icon: "🥗",
      });
    }

    if (dietType === "heavy_meat") {
      recs.push({
        id: nextId(),
        title: "Replace beef with chicken or fish",
        description:
          "Beef produces 5-10× more emissions than chicken. Swapping reduces impact dramatically.",
        category: "food",
        estimatedReductionKg: 800,
        difficulty: "medium",
        priority: 2,
        icon: "🐔",
      });
    }
  }

  if (foodWaste === "significant") {
    recs.push({
      id: nextId(),
      title: "Start meal planning to reduce food waste",
      description:
        "Plan meals weekly and buy only what you need. Food waste accounts for 8-10% of global emissions.",
      category: "food",
      estimatedReductionKg: 400,
      difficulty: "easy",
      priority: 1,
      icon: "📋",
    });
  } else if (foodWaste === "some") {
    recs.push({
      id: nextId(),
      title: "Compost food scraps",
      description:
        "Composting diverts waste from landfills where it would produce methane.",
      category: "food",
      estimatedReductionKg: 150,
      difficulty: "easy",
      priority: 3,
      icon: "♻️",
    });
  }

  if (dietType === "mixed" || dietType === "vegetarian") {
    recs.push({
      id: nextId(),
      title: "Choose local and seasonal produce",
      description:
        "Locally sourced food requires less transportation and refrigeration.",
      category: "food",
      estimatedReductionKg: 200,
      difficulty: "easy",
      priority: 4,
      icon: "🌽",
    });
  }

  return recs;
}

/**
 * Generate lifestyle-related recommendations.
 */
function getLifestyleRecommendations(data: AssessmentData): Recommendation[] {
  const recs: Recommendation[] = [];
  const { flightsPerYear, shoppingFrequency, recyclingHabit } = data.lifestyle;

  if (flightsPerYear > 2) {
    recs.push(
      {
        id: nextId(),
        title: `Reduce flights from ${flightsPerYear} to ${Math.max(1, flightsPerYear - 2)} per year`,
        description:
          "A single round-trip flight produces about 1.1 tonnes of CO₂e. Fewer flights = major impact.",
        category: "lifestyle",
        estimatedReductionKg: 2 * 1100,
        difficulty: "medium",
        priority: 1,
        icon: "✈️",
      },
      {
        id: nextId(),
        title: "Choose train travel for shorter trips",
        description: "Trains emit up to 90% less CO₂ per km compared to flying.",
        category: "lifestyle",
        estimatedReductionKg: 900,
        difficulty: "medium",
        priority: 2,
        icon: "🚆",
      }
    );
  }

  if (shoppingFrequency === "weekly") {
    recs.push({
      id: nextId(),
      title: 'Adopt a "buy less, choose well" approach',
      description:
        "Reducing shopping frequency and choosing quality over quantity cuts manufacturing emissions.",
      category: "lifestyle",
      estimatedReductionKg: 600,
      difficulty: "medium",
      priority: 2,
      icon: "🛍️",
    });
  }

  if (recyclingHabit === "never" || recyclingHabit === "sometimes") {
    recs.push({
      id: nextId(),
      title: "Start recycling consistently",
      description:
        "Recycling reduces the need for raw material extraction and manufacturing.",
      category: "lifestyle",
      estimatedReductionKg: recyclingHabit === "never" ? 300 : 200,
      difficulty: "easy",
      priority: 3,
      icon: "♻️",
    });
  }

  return recs;
}

/**
 * Generate all personalized recommendations for a user's assessment data.
 * Sorted by priority (highest first), then by estimated impact (highest first).
 */
export function generateRecommendations(
  data: AssessmentData,
): Recommendation[] {
  // Reset counter for deterministic IDs
  idCounter = 0;

  const allRecs = [
    ...getTransportRecommendations(data),
    ...getEnergyRecommendations(data),
    ...getFoodRecommendations(data),
    ...getLifestyleRecommendations(data),
  ];

  return allRecs.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.estimatedReductionKg - a.estimatedReductionKg;
  });
}
