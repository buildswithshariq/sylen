// ============================================================
// EcoPilot AI — Roadmap Engine
// Generates a personalized 4-week action plan from recommendations.
// ============================================================

import { Recommendation, Roadmap, RoadmapWeek } from '@/types';

/**
 * Generate a 4-week sustainability roadmap from the user's recommendations.
 * Week 1 = easiest high-impact action.
 * Week 2-3 = medium difficulty actions.
 * Week 4 = consolidation + tracking.
 */
export function generateRoadmap(recommendations: Recommendation[]): Roadmap {
  if (recommendations.length === 0) {
    return { weeks: [], totalEstimatedReduction: 0 };
  }

  // Sort by difficulty (easy first), then impact (highest first)
  const sorted = [...recommendations].sort((a, b) => {
    const diffOrder = { easy: 0, medium: 1, hard: 2 };
    const diffDiff = diffOrder[a.difficulty] - diffOrder[b.difficulty];
    if (diffDiff !== 0) return diffDiff;
    return b.estimatedReductionKg - a.estimatedReductionKg;
  });

  const weeks: RoadmapWeek[] = [];

  // Week 1: Easiest high-impact action
  const week1Rec = sorted[0];
  weeks.push({
    week: 1,
    title: 'Quick Win',
    description: `Start with an easy change that makes a real difference.`,
    action: week1Rec.title,
    estimatedReductionKg: week1Rec.estimatedReductionKg,
    difficulty: week1Rec.difficulty,
    tips: [
      'Set a daily reminder to build the habit',
      'Track your progress each day',
      `This alone could save ~${week1Rec.estimatedReductionKg} kg CO₂e per year`,
    ],
  });

  // Week 2: Second action (medium difficulty if available)
  const week2Rec = sorted.length > 1 ? sorted[1] : sorted[0];
  weeks.push({
    week: 2,
    title: 'Build Momentum',
    description: `Add a second sustainable habit to your routine.`,
    action: week2Rec.title,
    estimatedReductionKg: week2Rec.estimatedReductionKg,
    difficulty: week2Rec.difficulty,
    tips: [
      'Keep your Week 1 habit going',
      'Tell a friend or family member about your journey',
      'Notice how small changes add up',
    ],
  });

  // Week 3: Third action or lifestyle shift
  const week3Rec = sorted.length > 2 ? sorted[2] : sorted[Math.min(1, sorted.length - 1)];
  weeks.push({
    week: 3,
    title: 'Deepen Impact',
    description: `Take on a more meaningful change this week.`,
    action: week3Rec.title,
    estimatedReductionKg: week3Rec.estimatedReductionKg,
    difficulty: week3Rec.difficulty,
    tips: [
      'Reflect on what has been easy and what has been challenging',
      'Research additional ways to reduce your footprint',
      'Consider making one change permanent',
    ],
  });

  // Week 4: Consolidation
  const totalReduction = weeks.reduce((sum, w) => sum + w.estimatedReductionKg, 0);
  weeks.push({
    week: 4,
    title: 'Track & Sustain',
    description: `Review your progress and lock in your new habits.`,
    action: 'Retake the assessment and compare your new score',
    estimatedReductionKg: 0,
    difficulty: 'easy',
    tips: [
      'Celebrate your progress — every kg CO₂e matters',
      `You could be saving up to ${totalReduction} kg CO₂e per year`,
      'Share your results and inspire others',
      'Set goals for next month',
    ],
  });

  return {
    weeks,
    totalEstimatedReduction: totalReduction,
  };
}
