import { generateRoadmap } from './roadmapEngine';
import { Recommendation } from '@/types';

describe('roadmapEngine', () => {
  it('returns empty roadmap when no recommendations provided', () => {
    const result = generateRoadmap([]);
    expect(result.weeks).toHaveLength(0);
    expect(result.totalEstimatedReduction).toBe(0);
  });

  it('generates a 4-week roadmap sorting by easy and high impact', () => {
    const mockRecs: Recommendation[] = [
      { id: '1', category: 'energy', title: 'Hard High Impact', description: 'desc', estimatedReductionKg: 1000, difficulty: 'hard' },
      { id: '2', category: 'transport', title: 'Easy Low Impact', description: 'desc', estimatedReductionKg: 100, difficulty: 'easy' },
      { id: '3', category: 'food', title: 'Easy High Impact', description: 'desc', estimatedReductionKg: 500, difficulty: 'easy' },
    ];

    const result = generateRoadmap(mockRecs);
    expect(result.weeks).toHaveLength(4);
    
    // Week 1 should be the Easy High Impact (id: 3)
    expect(result.weeks[0].action).toBe('Easy High Impact');
    
    // Week 2 should be Easy Low Impact (id: 2)
    expect(result.weeks[1].action).toBe('Easy Low Impact');

    // Week 3 should be Hard High Impact (id: 1)
    expect(result.weeks[2].action).toBe('Hard High Impact');

    // Week 4 is fixed tracking week
    expect(result.weeks[3].action).toBe('Retake the assessment and compare your new score');

    // Total reduction should sum up the first 3 weeks' actions
    expect(result.totalEstimatedReduction).toBe(500 + 100 + 1000);
  });

  it('generates a roadmap with fallback weeks when less than 3 recommendations are provided', () => {
    const mockRecs: Recommendation[] = [
      { id: '1', category: 'energy', title: 'Single Action', description: 'desc', estimatedReductionKg: 1000, difficulty: 'medium' },
    ];

    const result = generateRoadmap(mockRecs);
    expect(result.weeks).toHaveLength(4);
    
    // Week 1 should be the Single Action
    expect(result.weeks[0].action).toBe('Single Action');
    
    // Week 2 and Week 3 should fallback to Single Action
    expect(result.weeks[1].action).toBe('Single Action');
    expect(result.weeks[2].action).toBe('Single Action');

    // Total reduction should sum up all 3 instances
    expect(result.totalEstimatedReduction).toBe(3000);
  });
});
