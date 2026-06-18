import { getUserEcoLevel } from './ecoLevelEngine';

describe('ecoLevelEngine', () => {
  it('returns lowest level for scores under 40', () => {
    const result = getUserEcoLevel(30);
    expect(result.current.name).toBe('High Impact');
    expect(result.current.badge).toBe('⚠️');
  });

  it('returns Eco Learner for scores between 40 and 59', () => {
    const result = getUserEcoLevel(50);
    expect(result.current.name).toBe('Eco Learner');
    expect(result.current.badge).toBe('🌿');
  });

  it('returns Green Explorer for scores between 60 and 74', () => {
    const result = getUserEcoLevel(70);
    expect(result.current.name).toBe('Green Explorer');
    expect(result.current.badge).toBe('🍃');
  });

  it('returns Climate Champion for scores between 75 and 89', () => {
    const result = getUserEcoLevel(85);
    expect(result.current.name).toBe('Climate Champion');
    expect(result.current.badge).toBe('🌱');
  });

  it('calculates points to next level correctly', () => {
    const result = getUserEcoLevel(50);
    // Next level is Green Explorer (min 60)
    expect(result.pointsToNext).toBe(10);
  });
});
