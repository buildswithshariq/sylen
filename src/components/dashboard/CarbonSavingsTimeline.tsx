'use client';

import { m as motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Recommendation } from '@/types';

interface CarbonSavingsTimelineProps {
  recommendations: Recommendation[];
}

const timeframes = [
  { label: '1 Month', months: 1 },
  { label: '3 Months', months: 3 },
  { label: '6 Months', months: 6 },
  { label: '1 Year', months: 12 },
];

export default function CarbonSavingsTimeline({ recommendations }: CarbonSavingsTimelineProps) {
  // Sum all recommendation reductions (annual) and divide by 12 for monthly
  const totalAnnualReduction = recommendations.reduce((sum, r) => sum + r.estimatedReductionKg, 0);
  const monthlyReduction = totalAnnualReduction / 12;

  return (
    <GlassCard className="p-6 sm:p-8 h-full">
      <h3 className="text-lg font-semibold text-stone-800 mb-1">Projected Carbon Savings</h3>
      <p className="text-sm text-stone-500 mb-6">If you follow all recommendations</p>
      <div className="space-y-4">
        {timeframes.map((tf, i) => {
          const savings = Math.round(monthlyReduction * tf.months);
          const progress = tf.months / 12;
          return (
            <motion.div
              key={tf.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
              className="flex items-center gap-4"
            >
              <div className="w-20 shrink-0 text-sm font-medium text-stone-600">{tf.label}</div>
              <div className="flex-1 h-8 rounded-full bg-stone-100 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                />
              </div>
              <div className="w-28 shrink-0 text-right">
                <span className="text-base font-bold text-emerald-700">-{savings.toLocaleString()}</span>
                <span className="text-xs text-stone-500 ml-1">kg CO₂</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
