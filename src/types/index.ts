// ============================================================
// Sylen — Type Definitions
// ============================================================

// --- Assessment Data Types ---

export type VehicleType =
  | "car"
  | "public_transit"
  | "motorbike"
  | "bicycle"
  | "walk";
export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric";
export type DietType = "vegan" | "vegetarian" | "mixed" | "heavy_meat";
export type FoodWasteLevel = "minimal" | "some" | "significant";
export type ApplianceUsage = "low" | "medium" | "high";
export type ShoppingFrequency = "rarely" | "monthly" | "weekly";
export type RecyclingHabit = "always" | "sometimes" | "never";

export interface TransportData {
  vehicleType: VehicleType;
  fuelType: FuelType;
  dailyDistanceKm: number;
}

export interface EnergyData {
  monthlyElectricityKwh: number;
  acHoursPerDay: number;
  applianceUsage: ApplianceUsage;
}

export interface FoodData {
  dietType: DietType;
  meatMealsPerWeek: number;
  foodWaste: FoodWasteLevel;
}

export interface LifestyleData {
  flightsPerYear: number;
  shoppingFrequency: ShoppingFrequency;
  recyclingHabit: RecyclingHabit;
  displayName?: string;
}

export interface AssessmentData {
  transport: TransportData;
  energy: EnergyData;
  food: FoodData;
  lifestyle: LifestyleData;
}

// --- Carbon Calculation Types ---

export interface CarbonBreakdown {
  transport: number; // kg CO₂e per year
  energy: number; // kg CO₂e per year
  food: number; // kg CO₂e per year
  lifestyle: number; // kg CO₂e per year
  total: number; // kg CO₂e per year
}

export type EmissionCategory = keyof Omit<CarbonBreakdown, "total">;

export interface CategoryContribution {
  category: EmissionCategory;
  amount: number;
  percentage: number;
  label: string;
}

// --- Scoring Types ---

export type ImpactCategory = "excellent" | "good" | "moderate" | "high_impact";

export interface SustainabilityScore {
  score: number; // 0–100
  category: ImpactCategory;
  categoryLabel: string;
  breakdown: CarbonBreakdown;
  contributions: CategoryContribution[];
  comparisonToAverage: number; // percentage vs national average (negative = better)
  totalEmissions: number;
}

// --- Recommendation Types ---

export type Difficulty = "easy" | "medium" | "hard";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: EmissionCategory;
  estimatedReductionKg: number;
  difficulty: Difficulty;
  priority: number; // 1 = highest
  icon: string; // emoji
}

// --- Eco Level / Gamification Types ---

export interface EcoLevel {
  name: string;
  badge: string;
  minScore: number;
  maxScore: number;
  color: string;
}

export interface UserEcoLevel {
  current: EcoLevel;
  next: EcoLevel | null;
  pointsToNext: number;
  progressPercent: number;
}

// --- Roadmap Types ---

export interface RoadmapWeek {
  week: number;
  title: string;
  description: string;
  action: string;
  estimatedReductionKg: number;
  difficulty: Difficulty;
  tips: string[];
}

export interface Roadmap {
  weeks: RoadmapWeek[];
  totalEstimatedReduction: number;
}

// --- What-If Simulator Types ---

export interface WhatIfScenario {
  id: string;
  label: string;
  description: string;
  icon: string;
  modifications: {
    transport?: Partial<TransportData>;
    energy?: Partial<EnergyData>;
    food?: Partial<FoodData>;
    lifestyle?: Partial<LifestyleData>;
  };
}

export interface WhatIfResult {
  originalScore: number;
  newScore: number;
  originalEmissions: number;
  newEmissions: number;
  reductionKg: number;
  improvementPercent: number;
  newCategory: ImpactCategory;
  newCategoryLabel: string;
}

// --- AI Coach Types ---

export type CoachRole = "user" | "assistant";

export interface CoachMessage {
  id: string;
  role: CoachRole;
  content: string;
  timestamp: number;
  uiCard?: "priority" | "breakdown" | "transport";
  isStreaming?: boolean;
}

export interface CoachContext {
  assessment: AssessmentData;
  score: SustainabilityScore;
  recommendations: Recommendation[];
  ecoLevel: UserEcoLevel;
}

// --- Assessment Form State ---

export type AssessmentStep = 0 | 1 | 2 | 3;

export interface AssessmentFormState {
  currentStep: AssessmentStep;
  data: Partial<AssessmentData>;
  isComplete: boolean;
}
