'use client';

import { m as motion } from 'framer-motion';
import type { SustainabilityScore, ImpactCategory } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import ScoreRing from '@/components/ui/ScoreRing';
import Badge from '@/components/ui/Badge';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface ScoreCardProps {
  score: SustainabilityScore;
  className?: string;
}

const categoryBadgeConfig: Record<
  ImpactCategory,
  { variant: 'success' | 'warning' | 'danger' | 'info'; icon: string }
> = {
  excellent: { variant: 'success', icon: '🌍' },
  good: { variant: 'info', icon: '🌱' },
  moderate: { variant: 'warning', icon: '🌿' },
  high_impact: { variant: 'danger', icon: '⚠️' },
};

export default function ScoreCard({ score, className = '' }: ScoreCardProps) {
  const badgeConfig = categoryBadgeConfig[score.category];
  const betterThanAvg = score.comparisonToAverage < 0;
  const comparisonAbs = Math.abs(score.comparisonToAverage);

  return (
    <GlassCard
      className={`flex flex-col items-center gap-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-stone-700">
          Your Eco Score
        </h2>
        <p className="mt-0.5 text-sm text-stone-400">
          Based on your lifestyle assessment
        </p>
      </div>

      {/* Score Ring */}
      <ScoreRing
        score={score.score}
        label={score.categoryLabel}
        size={180}
        strokeWidth={10}
      />

      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <Badge
          text={score.categoryLabel}
          variant={badgeConfig.variant}
          icon={badgeConfig.icon}
        />
      </motion.div>

      {/* Comparison */}
      <motion.div
        className="w-full rounded-xl bg-stone-50 px-4 py-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <p className="text-sm text-stone-500">
          {betterThanAvg ? (
            <>
              <span className="font-semibold text-emerald-600">
                <AnimatedCounter
                  value={comparisonAbs}
                  duration={1800}
                  suffix="%"
                  decimals={0}
                />
              </span>{' '}
              lower than the national average
            </>
          ) : (
            <>
              <span className="font-semibold text-amber-600">
                <AnimatedCounter
                  value={comparisonAbs}
                  duration={1800}
                  suffix="%"
                  decimals={0}
                />
              </span>{' '}
              higher than the national average
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Total:{' '}
          <AnimatedCounter
            value={score.totalEmissions}
            duration={2000}
            suffix=" kg CO₂e/yr"
            className="font-medium text-stone-500"
          />
        </p>
      </motion.div>
    </GlassCard>
  );
}
