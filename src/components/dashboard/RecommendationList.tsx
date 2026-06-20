"use client";

import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import type { Recommendation, Difficulty } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

interface RecommendationListProps {
  recommendations: Recommendation[];
  /** Max items shown (default 5) */
  limit?: number;
  className?: string;
}

const difficultyBadge: Record<
  Difficulty,
  { variant: "success" | "warning" | "danger"; label: string }
> = {
  easy: { variant: "success", label: "Easy" },
  medium: { variant: "warning", label: "Medium" },
  hard: { variant: "danger", label: "Hard" },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] as const },
  },
};

function RecommendationItem({ rec }: { rec: Recommendation }) {
  const [expanded, setExpanded] = useState(false);
  const diffConfig = difficultyBadge[rec.difficulty];
  const truncated =
    rec.description.length > 100
      ? rec.description.slice(0, 100) + "…"
      : rec.description;

  return (
    <motion.button
      layout
      variants={itemVariants}
      type="button"
      onClick={() => setExpanded((prev) => !prev)}
      className="w-full cursor-pointer rounded-xl bg-white/50 p-4 text-left transition-colors hover:bg-white/70 overflow-hidden"
      aria-expanded={expanded}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.span
          layout="position"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-lg"
          role="img"
          aria-hidden="true"
        >
          {rec.icon}
        </motion.span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            layout="position"
            className="flex items-center justify-between gap-2"
          >
            <h3 className="text-sm font-semibold text-stone-800 truncate">
              {rec.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge
                text={`-${rec.estimatedReductionKg} kg`}
                variant="success"
                size="sm"
              />
              <Badge
                text={diffConfig.label}
                variant={diffConfig.variant}
                size="sm"
              />
            </div>
          </motion.div>

          {/* Description */}
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.p
                layout
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1.5 text-sm leading-relaxed text-stone-500"
              >
                {rec.description}
              </motion.p>
            ) : (
              <motion.p
                layout
                key="truncated"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-1.5 text-sm leading-relaxed text-stone-500"
              >
                {truncated}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}

export default function RecommendationList({
  recommendations,
  limit = 5,
  className = "",
}: Readonly<RecommendationListProps>) {
  const sorted = [...recommendations]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);

  return (
    <GlassCard
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-700">
          Top Recommendations
        </h2>
        <span className="text-xs font-medium text-stone-500">
          {sorted.length} actions
        </span>
      </div>

      <motion.div
        className="flex flex-col gap-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {sorted.map((rec) => (
          <RecommendationItem key={rec.id} rec={rec} />
        ))}
      </motion.div>
    </GlassCard>
  );
}
