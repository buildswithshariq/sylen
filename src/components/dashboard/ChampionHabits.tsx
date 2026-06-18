'use client';

import { m as motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

interface ChampionHabitsProps {
  className?: string;
}

const leadershipTips = [
  {
    icon: '🗣️',
    title: 'Start Conversations',
    description: 'Talk openly about your sustainable choices without judgement. Normalize climate consciousness.',
  },
  {
    icon: '🏛️',
    title: 'Advocate for Change',
    description: 'Contact local representatives to support green infrastructure and climate policies.',
  },
  {
    icon: '🏢',
    title: 'Workplace Initiatives',
    description: 'Encourage your employer to adopt sustainable practices like composting or energy efficiency.',
  },
  {
    icon: '💰',
    title: 'Divest from Fossils',
    description: 'Ensure your investments and banking choose green portfolios over fossil fuel funding.',
  },
];

export default function ChampionHabits({ className = '' }: ChampionHabitsProps) {
  return (
    <GlassCard className={`p-6 sm:p-8 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-stone-800">Climate Leadership Tips</h3>
        <p className="text-sm text-stone-500 mt-1">Ways to multiply your positive impact</p>
      </div>

      <div className="space-y-4">
        {leadershipTips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * index }}
            className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-xl">
              {tip.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-800">{tip.title}</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">{tip.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
