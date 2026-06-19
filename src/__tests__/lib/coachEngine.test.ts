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

    it('handles comparisonToAverage > 0', () => {
      const highEmissionsContext = { ...mockContext, score: { ...mockContext.score, comparisonToAverage: 25 } };
      const prompt = buildSystemPrompt(highEmissionsContext);
      expect(prompt).toContain('25% above');
    });

    it('handles ecoLevel.next being null', () => {
      const maxLevelContext = { ...mockContext, ecoLevel: { current: mockContext.ecoLevel.current, pointsToNext: 0, next: null } };
      const prompt = buildSystemPrompt(maxLevelContext);
      // It shouldn't contain the "points to" text if next is null
      expect(prompt).not.toContain('points to');
    });

    it('handles non-car vehicle types in prompt', () => {
      const transitContext = { ...mockContext, assessment: { ...mockContext.assessment, transport: { ...mockContext.assessment.transport, vehicleType: 'public_transit' } } };
      // @ts-expect-error - overriding union type string
      const prompt = buildSystemPrompt(transitContext);
      expect(prompt).toContain('Uses public transit');
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

    it('maps non-user roles to model', () => {
      // @ts-expect-error - testing role mapping
      const history = [{ id: '1', role: 'assistant', content: 'Hello' }];
      const result = buildChatMessages(mockContext, history, 'Hi');
      
      expect(result.messages[0].role).toBe('model');
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
  const expectResponseToContain = (
    message: string,
    context: CoachContext | null,
    expected: string
  ) => {
    const response = getFallbackResponse(message, context);
    expect(response).toContain(expected);
  };

  it('handles transport queries', () => {
    expectResponseToContain(
      'transport',
      mockContext,
      'Transportation accounts for'
    );
  });

  it('handles energy queries', () => {
    expectResponseToContain(
      'energy',
      mockContext,
      'Your home energy use contributes'
    );
  });

  it('handles energy queries when AC usage is low', () => {
    const context = {
      ...mockContext,
      assessment: {
        ...mockContext.assessment,
        energy: {
          ...mockContext.assessment.energy,
          acHoursPerDay: 2,
        },
      },
    };

    expectResponseToContain(
      'energy',
      context,
      'Your energy usage is moderate'
    );
  });

  it('handles food queries', () => {
    expectResponseToContain(
      'food',
      mockContext,
      'Your food choices account for'
    );
  });

  it('handles unknown queries with default response', () => {
    expectResponseToContain(
      'tell me something random',
      mockContext,
      'Your sustainability score is **85/100**'
    );
  });

  it('handles low-emission transport method', () => {
    const context = {
      ...mockContext,
      assessment: {
        ...mockContext.assessment,
        transport: {
          ...mockContext.assessment.transport,
          vehicleType: 'walk',
        },
      },
    };

    expectResponseToContain(
      'transport',
      context,
      'low-emission transport method'
    );
  });

  it('handles vegan diet', () => {
    const context = {
      ...mockContext,
      assessment: {
        ...mockContext.assessment,
        food: {
          ...mockContext.assessment.food,
          dietType: 'vegan',
        },
      },
    };

    expectResponseToContain(
      'food',
      context,
      'plant-based diet'
    );
  });

  it('handles heavy meat diet', () => {
    const context = {
      ...mockContext,
      assessment: {
        ...mockContext.assessment,
        food: {
          ...mockContext.assessment.food,
          dietType: 'heavy_meat',
        },
      },
    };

    expectResponseToContain(
      'food',
      context,
      'meat-free day'
    );
  });

  it('handles generic queries', () => {
    expectResponseToContain(
      'hello',
      null,
      "Hi there! I'm Sprout"
    );
  });

  it('handles score queries', () => {
    expectResponseToContain(
      'what is my score',
      mockContext,
      'Your sustainability score is **85/100**'
    );
  });

  it('handles improve queries', () => {
    expectResponseToContain(
      'how to improve',
      mockContext,
      'Your top recommendation is: **Recycle**'
     );
   });
 });
});
