"use client";

import { useRef } from "react";
import { m as motion, useInView } from "framer-motion";
import type { CategoryContribution, EmissionCategory } from "@/types";
import GlassCard from "@/components/ui/GlassCard";

interface EmissionBreakdownProps {
  contributions: CategoryContribution[];
  className?: string;
  compact?: boolean;
}

const categoryConfig: Record<
  EmissionCategory,
  { icon: string; color: string; trackColor: string }
> = {
  transport: {
    icon: "🚗",
    color: "#0284c7", // sky-600
    trackColor: "rgba(2, 132, 199, 0.1)",
  },
  energy: {
    icon: "⚡",
    color: "#d97706", // amber-600
    trackColor: "rgba(217, 119, 6, 0.1)",
  },
  food: {
    icon: "🥬",
    color: "#16a34a", // green-600
    trackColor: "rgba(22, 163, 74, 0.1)",
  },
  lifestyle: {
    icon: "🛍️",
    color: "#7c3aed", // violet-600
    trackColor: "rgba(124, 58, 237, 0.1)",
  },
};

function BarRow({
  contribution,
  index,
  isInView,
  compact,
}: {
  contribution: CategoryContribution;
  index: number;
  isInView: boolean;
  compact?: boolean;
}) {
  const config = categoryConfig[contribution.category];
  const barPercent = Math.max(contribution.percentage, 2); // min visible width

  return (
    <div className="flex flex-col gap-2">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={compact ? "text-base" : "text-lg"}
            role="img"
            aria-hidden="true"
          >
            {config.icon}
          </span>
          <span
            className={`${compact ? "text-xs" : "text-sm"} font-medium text-stone-700`}
          >
            {contribution.label}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}
        >
          <span className="font-semibold text-stone-600">
            {contribution.amount.toLocaleString("en-US")}{" "}
            <span
              className={`${compact ? "text-[10px]" : "text-xs"} font-normal text-stone-500`}
            >
              kg
            </span>
          </span>
          <span
            className={`${compact ? "text-[10px]" : "text-xs"} text-stone-500`}
          >
            ({contribution.percentage}%)
          </span>
        </div>
      </div>

      {/* Bar */}
      <div
        className={`${compact ? "h-1.5" : "h-2.5"} w-full overflow-hidden rounded-full`}
        style={{ backgroundColor: config.trackColor }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: config.color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${barPercent}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: 0.15 * index,
            ease: [0.33, 1, 0.68, 1],
          }}
        />
      </div>
    </div>
  );
}

export default function EmissionBreakdown({
  contributions,
  className = "",
  compact,
}: EmissionBreakdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  // Sort by amount descending for visual priority
  const sorted = [...contributions].sort((a, b) => b.amount - a.amount);

  const Container = compact ? motion.div : GlassCard;
  const containerClasses = compact ? `p-0 w-full ${className}` : className;

  return (
    <Container
      className={containerClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
    >
      {!compact && (
        <h2 className="mb-5 text-lg font-semibold text-stone-700">
          Emission Breakdown
        </h2>
      )}

      <div ref={ref} className={`flex flex-col ${compact ? "gap-3" : "gap-5"}`}>
        {sorted.map((contribution, i) => (
          <BarRow
            key={contribution.category}
            contribution={contribution}
            index={i}
            isInView={isInView}
            compact={compact}
          />
        ))}
      </div>
    </Container>
  );
}
