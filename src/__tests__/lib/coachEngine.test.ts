import {
  buildSystemPrompt,
  buildChatMessages,
  generateInitialGreeting,
  getFallbackResponse,
} from '../../lib/coachEngine';
import { CoachContext } from '@/types';

const mockContext: CoachContext = {
  score: {
    score: 85,
    totalEmissions: 10000,
    comparisonToAverage: -30,
    categoryLabel: 'Great',
    breakdown: { transport: 4000, energy: 3000, food: 2000, lifestyle: 1000 },
    contributions: [
      { category: 'transport', label: 'Transport', amount: 4000, percentage: 40, color: 'blue' }
    ]
  },
  ecoLevel: {
    current: { id: 'lvl2', name: 'Green Guardian', minScore: 80, badge: '🌿', description: '' },
    pointsToNext: 5
  },
  recommendations: [
    { id: '1', title: 'Recycle', description: 'Recycle more', category: 'lifestyle', estimatedReductionKg: 100, difficulty: 'easy', priority: 1, icon: '♻️' }
  ],
  assessment: {
    transport: { vehicleType: 'car', fuelType: 'electric', dailyDistanceKm: 20 },
    energy: { monthlyElectricityKwh: 300, acHoursPerDay: 2, applianceUsage: 'low' },
    food: { dietType: 'mixed', meatMealsPerWeek: 3, foodWaste: 'minimal' },
    lifestyle: { flightsPerYear: 1, shoppingFrequency: 'rarely', recyclingHabit: 'always' }
  }
};

describe('coachEngine', () => {
  describe('buildSystemPrompt', () => {
    it('returns a generic prompt when context is null', () => {
      const prompt = buildSystemPrompt(null);
      expect(prompt).toContain('You are Sprout 🌱');
      expect(prompt).toContain('## YOUR CAPABILITIES');
      expect(prompt).not.toContain('## USER\'S CARBON FOOTPRINT DATA');
    });

    it('injects user data when context is provided', () => {
      const prompt = buildSystemPrompt(mockContext);
      expect(prompt).toContain('You are Sprout Coach AI 🌱');
      expect(prompt).toContain('85/100');
      expect(prompt).toContain('10,000 kg CO₂e/year');
      expect(prompt).toContain('30% below');
      expect(prompt).toContain('Green Guardian');
      expect(prompt).toContain('Recycle');
    });

    it('generates champion prompt when score >= 90', () => {
      const championContext = { ...mockContext, score: { ...mockContext.score, score: 95 } };
      const prompt = buildSystemPrompt(championContext);
      expect(prompt).toContain('CLIMATE CHAMPION 🏆');
      expect(prompt).toContain('Congratulate the user');
      expect(prompt).not.toContain('Top Recommended Actions:');
    });
  });

  describe('buildChatMessages', () => {
    it('keeps only the last 5 messages plus the new one', () => {
      const history = new Array(10).fill(null).map((_, i) => ({ id: `${i}`, role: 'user' as const, content: `Msg ${i}` }));
      const result = buildChatMessages(mockContext, history, 'New Message');
      
      expect(result.messages.length).toBe(6); // 5 history + 1 new
      expect(result.messages[0].content).toBe('Msg 5');
      expect(result.messages[5].content).toBe('New Message');
    });
  });

  describe('generateInitialGreeting', () => {
    it('returns generic greeting when context is null', () => {
      expect(generateInitialGreeting(null)).toContain('Welcome to Sylen');
    });

    it('returns standard personalized greeting', () => {
      expect(generateInitialGreeting(mockContext)).toContain('Welcome back to Sylen');
    });

    it('returns champion greeting', () => {
      const championContext = { ...mockContext, score: { ...mockContext.score, score: 95 } };
      expect(generateInitialGreeting(championContext)).toContain('🏆 Congratulations');
    });
  });

  describe('getFallbackResponse', () => {
    it('handles generic queries', () => {
      const response = getFallbackResponse('hello', null);
      expect(response).toContain('Hi there! I\'m Sprout');
    });

    it('handles score queries', () => {
      const response = getFallbackResponse('what is my score', mockContext);
      expect(response).toContain('Your sustainability score is **85/100**');
    });

    it('handles improve queries', () => {
      const response = getFallbackResponse('how to improve', mockContext);
      expect(response).toContain('Your top recommendation is: **Recycle**');
    });
  });
});
