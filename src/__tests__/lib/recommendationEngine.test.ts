import { generateRecommendations } from '../../lib/recommendationEngine';
import { AssessmentData } from '@/types';

// ============================================================================
// Helpers & Factories
// ============================================================================

const createBaseAssessment = (): AssessmentData => ({
  transport: { vehicleType: 'walk', fuelType: 'gasoline', dailyDistanceKm: 0 },
  energy: { monthlyElectricityKwh: 100, acHoursPerDay: 0, applianceUsage: 'low' },
  food: { dietType: 'vegan', meatMealsPerWeek: 0, foodWaste: 'minimal' },
  lifestyle: { flightsPerYear: 0, shoppingFrequency: 'rarely', recyclingHabit: 'always' }
});

const expectRec = (recs: ReturnType<typeof generateRecommendations>, titleIncludes: string, expectedCount?: number) => {
  const matches = recs.filter(r => r.title.includes(titleIncludes));
  expect(matches.length).toBeGreaterThan(0);
  if (expectedCount !== undefined) {
    expect(matches.length).toBe(expectedCount);
  }
};

const expectNoRec = (recs: ReturnType<typeof generateRecommendations>, titleIncludes: string) => {
  const matches = recs.filter(r => r.title.includes(titleIncludes));
  expect(matches.length).toBe(0);
};

// ============================================================================
// Test Suite
// ============================================================================

describe('recommendationEngine', () => {
  describe('General Behavior & Sorting', () => {
    it('returns no recommendations for a perfect eco-friendly lifestyle', () => {
      const recs = generateRecommendations(createBaseAssessment());
      expect(recs.length).toBe(0);
    });

    it('generates deterministic IDs and sorts correctly', () => {
      const data = createBaseAssessment();
      data.transport = { vehicleType: 'car', fuelType: 'gasoline', dailyDistanceKm: 50 };
      data.lifestyle = { flightsPerYear: 10, shoppingFrequency: 'weekly', recyclingHabit: 'never' };
      
      const recs1 = generateRecommendations(data);
      const recs2 = generateRecommendations(data);
      
      expect(recs1.length).toBeGreaterThan(0);
      
      // Check deterministic ID format and uniqueness
      const ids = new Set(recs1.map(r => r.id));
      expect(ids.size).toBe(recs1.length);
      recs1.forEach(r => expect(r.id).toMatch(/^rec-\d+$/));

      // Second call should yield exact same IDs due to counter reset
      expect(recs1.map(r => r.id)).toEqual(recs2.map(r => r.id));

      // Check sorting: Priority ascending, then estimatedReductionKg descending
      for (let i = 0; i < recs1.length - 1; i++) {
        const current = recs1[i];
        const next = recs1[i + 1];
        
        expect(current.priority).toBeLessThanOrEqual(next.priority);
        if (current.priority === next.priority) {
          expect(current.estimatedReductionKg).toBeGreaterThanOrEqual(next.estimatedReductionKg);
        }
      }
    });
  });

  describe('TRANSPORT Rules', () => {
    it('car + distance > 10 (gasoline)', () => {
      const data = createBaseAssessment();
      data.transport = { vehicleType: 'car', fuelType: 'gasoline', dailyDistanceKm: 20 };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Switch to public transport');
      expectRec(recs, 'carpooling');
      expectRec(recs, 'electric vehicle');
      expectNoRec(recs, 'Cycle or walk');
    });

    it('car + distance > 10 (diesel)', () => {
      const data = createBaseAssessment();
      data.transport = { vehicleType: 'car', fuelType: 'diesel', dailyDistanceKm: 20 };
      const recs = generateRecommendations(data);

      expectRec(recs, 'electric vehicle');
    });

    it('car + distance <= 10 (electric)', () => {
      const data = createBaseAssessment();
      data.transport = { vehicleType: 'car', fuelType: 'electric', dailyDistanceKm: 8 };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Cycle or walk');
      expectRec(recs, 'carpooling');
      expectNoRec(recs, 'Switch to public transport');
      expectNoRec(recs, 'electric vehicle'); // already electric
    });

    it('public_transit + distance > 5', () => {
      const data = createBaseAssessment();
      data.transport = { vehicleType: 'public_transit', fuelType: 'gasoline', dailyDistanceKm: 15 };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Work from home');
    });
  });

  describe('ENERGY Rules', () => {
    it('acHoursPerDay > 6', () => {
      const data = createBaseAssessment();
      data.energy = { monthlyElectricityKwh: 100, acHoursPerDay: 8, applianceUsage: 'low' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Reduce AC usage');
      expectRec(recs, 'Set AC to 24°C');
      expectNoRec(recs, 'Use a fan'); // Only triggered for >3 but <=6 since it is an else-if in logic
    });

    it('acHoursPerDay between 4 and 6', () => {
      const data = createBaseAssessment();
      data.energy = { monthlyElectricityKwh: 100, acHoursPerDay: 5, applianceUsage: 'low' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Use a fan');
      expectNoRec(recs, 'Reduce AC usage');
    });

    it('monthlyElectricityKwh > 300 and applianceUsage === "high"', () => {
      const data = createBaseAssessment();
      data.energy = { monthlyElectricityKwh: 400, acHoursPerDay: 0, applianceUsage: 'high' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'LED lighting');
      expectRec(recs, 'Unplug devices'); // > 200 condition
      expectRec(recs, 'energy-efficient appliances');
    });

    it('monthlyElectricityKwh > 200 but <= 300', () => {
      const data = createBaseAssessment();
      data.energy = { monthlyElectricityKwh: 250, acHoursPerDay: 0, applianceUsage: 'medium' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Unplug devices');
      expectNoRec(recs, 'LED lighting');
    });
  });

  describe('FOOD Rules', () => {
    it('heavy_meat + meatMealsPerWeek > 5', () => {
      const data = createBaseAssessment();
      data.food = { dietType: 'heavy_meat', meatMealsPerWeek: 10, foodWaste: 'minimal' };
      const recs = generateRecommendations(data);

      expectRec(recs, '2 meat-free days');
      expectRec(recs, 'Replace beef');
      expectNoRec(recs, 'local and seasonal');
    });

    it('mixed + meatMealsPerWeek > 5', () => {
      const data = createBaseAssessment();
      data.food = { dietType: 'mixed', meatMealsPerWeek: 6, foodWaste: 'minimal' };
      const recs = generateRecommendations(data);

      expectRec(recs, '2 meat-free days');
      expectNoRec(recs, 'Replace beef');
      expectRec(recs, 'local and seasonal'); // Triggered by 'mixed'
    });

    it('vegetarian', () => {
      const data = createBaseAssessment();
      data.food = { dietType: 'vegetarian', meatMealsPerWeek: 0, foodWaste: 'minimal' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'local and seasonal');
    });

    it('foodWaste === "significant"', () => {
      const data = createBaseAssessment();
      data.food = { dietType: 'vegan', meatMealsPerWeek: 0, foodWaste: 'significant' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'meal planning');
      expectNoRec(recs, 'Compost');
    });

    it('foodWaste === "some"', () => {
      const data = createBaseAssessment();
      data.food = { dietType: 'vegan', meatMealsPerWeek: 0, foodWaste: 'some' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Compost');
      expectNoRec(recs, 'meal planning');
    });
  });

  describe('LIFESTYLE Rules', () => {
    it('flightsPerYear > 2', () => {
      const data = createBaseAssessment();
      data.lifestyle = { flightsPerYear: 5, shoppingFrequency: 'rarely', recyclingHabit: 'always' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Reduce flights');
      expectRec(recs, 'Choose train travel');
    });

    it('shoppingFrequency === "weekly"', () => {
      const data = createBaseAssessment();
      data.lifestyle = { flightsPerYear: 0, shoppingFrequency: 'weekly', recyclingHabit: 'always' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'buy less');
    });

    it('recyclingHabit === "never"', () => {
      const data = createBaseAssessment();
      data.lifestyle = { flightsPerYear: 0, shoppingFrequency: 'rarely', recyclingHabit: 'never' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Start recycling');
    });

    it('recyclingHabit === "sometimes"', () => {
      const data = createBaseAssessment();
      data.lifestyle = { flightsPerYear: 0, shoppingFrequency: 'rarely', recyclingHabit: 'sometimes' };
      const recs = generateRecommendations(data);

      expectRec(recs, 'Start recycling');
    });
  });
});
