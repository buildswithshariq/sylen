import { generateRecommendations } from '../../lib/recommendationEngine';
import { AssessmentData } from '@/types';

const defaultAssessment: AssessmentData = {
  transport: { vehicleType: 'walk', fuelType: 'gasoline', dailyDistanceKm: 0 },
  energy: { monthlyElectricityKwh: 100, acHoursPerDay: 0, applianceUsage: 'low' },
  food: { dietType: 'vegan', meatMealsPerWeek: 0, foodWaste: 'minimal' },
  lifestyle: { flightsPerYear: 0, shoppingFrequency: 'rarely', recyclingHabit: 'always' }
};

describe('recommendationEngine', () => {
  it('returns no recommendations for a perfect eco-friendly lifestyle', () => {
    const recs = generateRecommendations(defaultAssessment);
    expect(recs.length).toBe(0);
  });

  it('generates transport recommendations based on high daily distance with car', () => {
    const data = { ...defaultAssessment, transport: { vehicleType: 'car' as const, fuelType: 'gasoline' as const, dailyDistanceKm: 20 } };
    const recs = generateRecommendations(data);
    
    expect(recs.some(r => r.title.includes('Switch to public transport'))).toBe(true);
    expect(recs.some(r => r.title.includes('carpooling'))).toBe(true);
    expect(recs.some(r => r.title.includes('electric vehicle'))).toBe(true);
  });

  it('prioritizes recommendations properly (priority 1 first, then highest reduction)', () => {
    const data = { 
      ...defaultAssessment, 
      transport: { vehicleType: 'car' as const, fuelType: 'gasoline' as const, dailyDistanceKm: 50 },
      lifestyle: { flightsPerYear: 10, shoppingFrequency: 'weekly' as const, recyclingHabit: 'never' as const }
    };
    const recs = generateRecommendations(data);
    
    // Check sorting: Priority 1 before 2
    for (let i = 0; i < recs.length - 1; i++) {
      const current = recs[i];
      const next = recs[i + 1];
      
      expect(current.priority).toBeLessThanOrEqual(next.priority);
      
      if (current.priority === next.priority) {
        // If same priority, highest reduction first
        expect(current.estimatedReductionKg).toBeGreaterThanOrEqual(next.estimatedReductionKg);
      }
    }
  });

  it('generates specific food recommendations for heavy meat diet', () => {
    const data = { ...defaultAssessment, food: { dietType: 'heavy_meat' as const, meatMealsPerWeek: 10, foodWaste: 'minimal' as const } };
    const recs = generateRecommendations(data);
    
    expect(recs.some(r => r.title.includes('meat-free days'))).toBe(true);
    expect(recs.some(r => r.title.includes('Replace beef'))).toBe(true);
  });

  it('generates specific energy recommendations for high AC usage', () => {
    const data = { ...defaultAssessment, energy: { monthlyElectricityKwh: 500, acHoursPerDay: 8, applianceUsage: 'low' as const } };
    const recs = generateRecommendations(data);
    
    expect(recs.some(r => r.title.includes('Reduce AC usage'))).toBe(true);
    expect(recs.some(r => r.title.includes('24°C'))).toBe(true);
    expect(recs.some(r => r.title.includes('LED lighting'))).toBe(true);
  });

  it('deduplicates recommendations intrinsically by returning a specific mapped set', () => {
    // The engine builds a fresh array every time.
    // Ensure that multiple triggers do not create duplicate IDs for the same rule.
    const recs = generateRecommendations({
      ...defaultAssessment,
      transport: { vehicleType: 'car', fuelType: 'gasoline', dailyDistanceKm: 50 }
    });
    
    const uniqueIds = new Set(recs.map(r => r.title));
    expect(uniqueIds.size).toBe(recs.length);
  });
});
