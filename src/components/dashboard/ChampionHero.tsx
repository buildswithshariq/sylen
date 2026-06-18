'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import ScoreRing from '@/components/ui/ScoreRing';
import Badge from '@/components/ui/Badge';

interface ChampionHeroProps {
  score: number;
  className?: string;
}

export default function ChampionHero({ score, className = '' }: ChampionHeroProps) {
  return (
    <GlassCard
      className={`flex flex-col items-center gap-6 bg-gradient-to-br from-emerald-50/40 to-sky-50/40 border-emerald-200/50 shadow-emerald-900/5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      <div className="text-center">
        <h2 className="text-xl font-bold text-emerald-800 flex items-center justify-center gap-2">
          <span className="text-2xl">🏆</span> Climate Champion
        </h2>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed max-w-[280px]">
          Congratulations! You are already operating at an exceptional sustainability level.
        </p>
      </div>

      <ScoreRing
        score={score}
        label="Top Tier"
        size={180}
        strokeWidth={10}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="flex flex-col items-center gap-2 w-full"
      >
        <Badge
          text="Climate Champion"
          variant="success"
          icon="🏅"
        />
        <div className="w-full rounded-xl bg-white/60 border border-emerald-100 px-4 py-3 text-center mt-2">
          <p className="text-sm font-semibold text-emerald-700">
            Top Sustainability Tier
          </p>
        </div>
      </motion.div>
    </GlassCard>
  );
}
