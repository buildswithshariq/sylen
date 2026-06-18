'use client';

import { m as motion } from 'framer-motion';
import type { Roadmap, RoadmapWeek, Difficulty } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';

interface RoadmapCardProps {
  roadmap: Roadmap;
  className?: string;
}

const difficultyBadge: Record<
  Difficulty,
  { variant: 'success' | 'warning' | 'danger'; label: string }
> = {
  easy: { variant: 'success', label: 'Easy' },
  medium: { variant: 'warning', label: 'Medium' },
  hard: { variant: 'danger', label: 'Hard' },
};

const weekVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.3 + i * 0.12,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  }),
};

function WeekItem({
  week,
  index,
  isLast,
}: {
  week: RoadmapWeek;
  index: number;
  isLast: boolean;
}) {
  const diffConfig = difficultyBadge[week.difficulty];

  return (
    <motion.div
      className="relative flex gap-4"
      variants={weekVariants}
      custom={index}
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-200/60">
          {week.week}
        </div>
        {/* Connector Line */}
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-emerald-200 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
        <div className="rounded-xl bg-white/50 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-stone-800">
              {week.title}
            </h3>
            <Badge
              text={diffConfig.label}
              variant={diffConfig.variant}
              size="sm"
            />
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
            {week.action}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <Badge
              text={`-${week.estimatedReductionKg} kg CO₂e`}
              variant="success"
              size="sm"
              icon="📉"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RoadmapCard({
  roadmap,
  className = '',
}: RoadmapCardProps) {
  return (
    <GlassCard
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-700">
          4-Week Roadmap
        </h2>
        <span className="text-xs font-medium text-stone-400">
          {roadmap.weeks.length} weeks
        </span>
      </div>

      {/* Timeline */}
      <motion.div
        initial="hidden"
        animate="visible"
      >
        {roadmap.weeks.map((week, i) => (
          <WeekItem
            key={week.week}
            week={week}
            index={i}
            isLast={i === roadmap.weeks.length - 1}
          />
        ))}
      </motion.div>

      {/* Total Reduction */}
      <motion.div
        className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-center border border-emerald-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
          Estimated Total Reduction
        </p>
        <p className="mt-1 text-xl font-bold text-emerald-700">
          {roadmap.totalEstimatedReduction.toLocaleString('en-US')} kg CO₂e
        </p>
      </motion.div>
    </GlassCard>
  );
}
