"use client";

import { m as motion } from "framer-motion";
import type { UserEcoLevel } from "@/types";
import GlassCard from "@/components/ui/GlassCard";

interface EcoLevelCardProps {
  ecoLevel: UserEcoLevel;
  className?: string;
}

export default function EcoLevelCard({
  ecoLevel,
  className = "",
}: Readonly<EcoLevelCardProps>) {
  const { current, next, pointsToNext, progressPercent } = ecoLevel;

  return (
    <GlassCard
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Badge */}
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
          style={{
            backgroundColor: `${current.color}14`,
            border: `2px solid ${current.color}30`,
          }}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.5,
          }}
        >
          {current.badge}
        </motion.div>

        {/* Level Name */}
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: current.color }}>
            {current.name}
          </h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Score range: {current.minScore}–{current.maxScore}
          </p>
        </div>

        {/* Progress to Next Level */}
        {next && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {/* Progress bar */}
            <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: next.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{
                  duration: 1.2,
                  ease: [0.33, 1, 0.68, 1],
                  delay: 1,
                }}
              />
            </div>

            {/* Label */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">
                {pointsToNext} pts to{" "}
                <span className="font-semibold" style={{ color: next.color }}>
                  {next.badge} {next.name}
                </span>
              </span>
              <span className="font-medium text-stone-500">
                {progressPercent}%
              </span>
            </div>
          </motion.div>
        )}

        {/* Max level state */}
        {!next && (
          <motion.p
            className="text-sm font-medium text-emerald-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            🎉 You&apos;ve reached the highest level!
          </motion.p>
        )}
      </div>
    </GlassCard>
  );
}
