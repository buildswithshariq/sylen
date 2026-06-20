"use client";

import { m as motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface PositiveImpactSummaryProps {
  totalEmissions: number;
  comparisonToAverage: number; // e.g. -50 means 50% below
  className?: string;
}

export default function PositiveImpactSummary({
  totalEmissions,
  comparisonToAverage,
  className = "",
}: Readonly<PositiveImpactSummaryProps>) {
  // US Average is around 16000 kg
  const averageEmissions = 16000;
  const preventedEmissions = Math.max(0, averageEmissions - totalEmissions);

  // Roughly 1 mature tree absorbs 21kg of CO2 per year
  const treesEquivalent = Math.round(preventedEmissions / 21);

  return (
    <GlassCard className={`p-6 sm:p-8 ${className}`}>
      <h3 className="text-lg font-bold text-stone-800 mb-6">
        Your Positive Impact
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Emissions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-white/40"
        >
          <div className="text-2xl mb-1">🌍</div>
          <p className="text-xs text-stone-500 font-medium mb-1 uppercase tracking-wider">
            Annual Footprint
          </p>
          <p className="text-xl font-bold text-emerald-800">
            <AnimatedCounter
              value={totalEmissions}
              duration={2000}
              suffix=" kg"
            />
          </p>
        </motion.div>

        {/* Trees Equivalent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-50/70 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-emerald-100/50"
        >
          <div className="text-2xl mb-1">🌲</div>
          <p className="text-xs text-emerald-700/70 font-medium mb-1 uppercase tracking-wider">
            Trees Equivalent
          </p>
          <p className="text-xl font-bold text-emerald-700">
            <AnimatedCounter value={treesEquivalent} duration={2000} />
          </p>
        </motion.div>

        {/* Prevented CO2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-sky-50/70 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-sky-100/50"
        >
          <div className="text-2xl mb-1">🛡️</div>
          <p className="text-xs text-sky-700/70 font-medium mb-1 uppercase tracking-wider">
            CO₂ Prevented
          </p>
          <p className="text-xl font-bold text-sky-700">
            <AnimatedCounter
              value={preventedEmissions}
              duration={2000}
              suffix=" kg"
            />
          </p>
        </motion.div>
      </div>

      <p className="text-sm text-stone-500 mt-6 text-center leading-relaxed">
        By keeping your emissions {Math.abs(comparisonToAverage)}% below the
        average, you are actively participating in global climate mitigation.
      </p>
    </GlassCard>
  );
}
