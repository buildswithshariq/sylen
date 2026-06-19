import { calculateTransportEmissions, calculateEnergyEmissions, calculateFoodEmissions, calculateLifestyleEmissions, calculateCarbonFootprint } from './carbonCalculator';
import { AssessmentData } from '@/types';
import { TRANSPORT_FACTORS, GRID_EMISSION_FACTOR, AC_POWER_KW, DIET_BASE_EMISSIONS, FLIGHT_EMISSIONS_PER_TRIP, RECYCLING_OFFSETS, SHOPPING_EMISSIONS } from './constants';

describe('carbonCalculator', () => {
  describe('calculateTransportEmissions', () => {
    it('returns 0 for walking and bicycling', () => {
      expect(calculateTransportEmissions({ vehicleType: 'walk', fuelType: 'gasoline', dailyDistanceKm: 10 })).toBe(0);
      expect(calculateTransportEmissions({ vehicleType: 'bicycle', fuelType: 'gasoline', dailyDistanceKm: 10 })).toBe(0);
    });

    it('calculates public transit emissions correctly', () => {
      const distance = 10;
      const expected = distance * TRANSPORT_FACTORS.public_transit * 365;
      expect(calculateTransportEmissions({ vehicleType: 'public_transit', fuelType: 'gasoline', dailyDistanceKm: distance })).toBe(expected);
    });

    it('calculates car emissions based on fuel type', () => {
      const distance = 20;
      const expected = distance * TRANSPORT_FACTORS.electric * 365;
      expect(calculateTransportEmissions({ vehicleType: 'car', fuelType: 'electric', dailyDistanceKm: distance })).toBe(expected);
    });

    it('calculates motorbike emissions correctly', () => {
      const distance = 15;
      const expected = distance * TRANSPORT_FACTORS.motorbike * 365;
      expect(calculateTransportEmissions({ vehicleType: 'motorbike', fuelType: 'gasoline', dailyDistanceKm: distance })).toBe(expected);
    });

    it('uses gasoline fallback for unknown fuel types in cars', () => {
      const distance = 10;
      const expected = distance * TRANSPORT_FACTORS.gasoline * 365;
      // @ts-expect-error - testing fallback
      expect(calculateTransportEmissions({ vehicleType: 'car', fuelType: 'unknown', dailyDistanceKm: distance })).toBe(expected);
    });
  });

  describe('calculateEnergyEmissions', () => {
    it('calculates base energy and AC correctly without appliance multiplier', () => {
      const data = { monthlyElectricityKwh: 100, acHoursPerDay: 0, applianceUsage: 'medium' as const };
      const expected = 100 * 12 * GRID_EMISSION_FACTOR; // medium multiplier is 1.0
      expect(calculateEnergyEmissions(data)).toBeCloseTo(expected, 2);
    });

    it('includes AC power correctly', () => {
      const data = { monthlyElectricityKwh: 0, acHoursPerDay: 5, applianceUsage: 'medium' as const };
      const expected = 5 * AC_POWER_KW * 365 * GRID_EMISSION_FACTOR;
      expect(calculateEnergyEmissions(data)).toBeCloseTo(expected, 2);
    });

    it('uses 1.0 multiplier fallback for unknown appliance usage', () => {
      // @ts-expect-error - testing fallback
      const data = { monthlyElectricityKwh: 100, acHoursPerDay: 0, applianceUsage: 'unknown' };
      const expected = 100 * 12 * GRID_EMISSION_FACTOR * 1.0;
      expect(calculateEnergyEmissions(data)).toBeCloseTo(expected, 2);
    });
  });

  describe('calculateFoodEmissions', () => {
    it('calculates vegan diet emissions without meat', () => {
      const data = { dietType: 'vegan' as const, meatMealsPerWeek: 0, foodWaste: 'minimal' as const };
      const expected = DIET_BASE_EMISSIONS.vegan * 1.0; // minimal waste is 1.0
      expect(calculateFoodEmissions(data)).toBeCloseTo(expected, 2);
    });

    it('uses fallback for unknown diet type and food waste', () => {
      // @ts-expect-error - testing fallback
      const data = { dietType: 'unknown', meatMealsPerWeek: 0, foodWaste: 'unknown' };
      const expected = DIET_BASE_EMISSIONS.mixed * 1.0;
      expect(calculateFoodEmissions(data)).toBeCloseTo(expected, 2);
    });
  });

  describe('calculateLifestyleEmissions', () => {
    it('calculates flights and recycling', () => {
      const data = { flightsPerYear: 2, shoppingFrequency: 'rarely' as const, recyclingHabit: 'always' as const };
      const expected = (2 * FLIGHT_EMISSIONS_PER_TRIP) + 200 + RECYCLING_OFFSETS.always;
      expect(calculateLifestyleEmissions(data)).toBe(expected);
    });

    it('uses fallback for unknown shopping frequency and recycling habit', () => {
      // @ts-expect-error - testing fallback
      const data = { flightsPerYear: 0, shoppingFrequency: 'unknown', recyclingHabit: 'unknown' };
      const expected = SHOPPING_EMISSIONS.monthly + 0;
      expect(calculateLifestyleEmissions(data)).toBe(expected);
    });
  });

  describe('calculateCarbonFootprint', () => {
    it('aggregates all categories', () => {
      const fullData: AssessmentData = {
        transport: { vehicleType: 'bicycle', fuelType: 'gasoline', dailyDistanceKm: 10 },
        energy: { monthlyElectricityKwh: 0, acHoursPerDay: 0, applianceUsage: 'medium' },
        food: { dietType: 'vegan', meatMealsPerWeek: 0, foodWaste: 'minimal' },
        lifestyle: { flightsPerYear: 0, shoppingFrequency: 'rarely', recyclingHabit: 'never' }
      };

      const result = calculateCarbonFootprint(fullData);
      expect(result.transport).toBe(0);
      expect(result.energy).toBe(0);
      expect(result.food).toBe(Math.round(DIET_BASE_EMISSIONS.vegan * 1.0));
      expect(result.lifestyle).toBe(200); // 200 is shopping rarely + 0 recycling
      expect(result.total).toBe(result.transport + result.energy + result.food + result.lifestyle);
    });
  });
});
