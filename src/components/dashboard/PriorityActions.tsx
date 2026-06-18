'use client';

import { m as motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { Recommendation } from '@/types';

interface PriorityActionsProps {
  recommendations: Recommendation[];
  compact?: boolean;
}

export default function PriorityActions({ recommendations, compact }: PriorityActionsProps) {
  const top3 = recommendations.slice(0, 3);

  const Container = compact ? 'div' : GlassCard;
  const containerClasses = compact ? 'p-0 w-full' : 'p-6 sm:p-8 h-full';

  return (
    <Container className={containerClasses}>
      <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-1'}`}>
        <span className={compact ? 'text-base' : 'text-lg'}>🎯</span>
        <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold text-stone-800`}>Start Here</h3>
      </div>
      {!compact && <p className="text-sm text-stone-500 mb-6">Your top 3 highest-impact actions</p>}
      <div className={compact ? 'space-y-2' : 'space-y-4'}>
        {top3.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 300, damping: 24 }}
            className={`flex items-start ${compact ? 'gap-3 p-3' : 'gap-4 p-4'} rounded-xl bg-white/50 border border-white/30`}
          >
            <div className={`flex items-center justify-center ${compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full bg-emerald-100 text-emerald-700 font-bold shrink-0`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span>{rec.icon}</span>
                <h4 className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-stone-800 line-clamp-1`}>{rec.title}</h4>
              </div>
              {!compact && <p className="text-xs text-stone-500 leading-relaxed">{rec.description}</p>}
              <div className={`mt-2 flex flex-wrap items-center ${compact ? 'gap-1' : 'gap-2'}`}>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${compact ? 'text-[10px]' : 'text-xs'} font-medium bg-emerald-50 text-emerald-700`}>
                  -{rec.estimatedReductionKg.toLocaleString()} kg CO₂/yr
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${compact ? 'text-[10px]' : 'text-xs'} font-medium ${
                  rec.difficulty === 'easy' ? 'bg-green-50 text-green-700' :
                  rec.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {rec.difficulty}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
