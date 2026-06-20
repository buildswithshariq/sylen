"use client";

import { m as motion } from "framer-motion";
import { AssessmentData } from "@/types";
import GlassCard from "@/components/ui/GlassCard";

interface MaintainImpactCardProps {
  assessmentData: AssessmentData;
  className?: string;
}

export default function MaintainImpactCard({
  assessmentData,
  className = "",
}: MaintainImpactCardProps) {
  const habits = [];

  if (
    assessmentData.transport.vehicleType === "bicycle" ||
    assessmentData.transport.vehicleType === "walk" ||
    assessmentData.transport.vehicleType === "public_transit"
  ) {
    habits.push("Low-emission transportation");
  } else if (assessmentData.transport.fuelType === "electric") {
    habits.push("Electric vehicle usage");
  }

  if (assessmentData.energy.monthlyElectricityKwh < 300) {
    habits.push("Highly efficient home energy usage");
  }

  if (
    assessmentData.food.dietType === "vegan" ||
    assessmentData.food.dietType === "vegetarian"
  ) {
    habits.push("Plant-based diet");
  } else if (assessmentData.food.meatMealsPerWeek <= 3) {
    habits.push("Low meat consumption");
  }

  if (assessmentData.lifestyle.flightsPerYear <= 1) {
    habits.push("Minimal air travel");
  }

  if (assessmentData.lifestyle.recyclingHabit === "always") {
    habits.push("Consistent recycling habits");
  }

  if (habits.length === 0) {
    habits.push("Consistent mindfulness of carbon footprint");
  }

  return (
    <GlassCard
      className={`p-6 sm:p-8 flex flex-col justify-between h-full ${className}`}
    >
      <div>
        <h3 className="text-lg font-bold text-emerald-800 mb-2">
          Maintain Your Impact
        </h3>
        <p className="text-sm text-stone-500 mb-6">
          You are already practicing these highly sustainable habits. Keep it
          up!
        </p>

        <ul className="space-y-3 mb-8">
          {habits.map((habit, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-stone-700">
                {habit}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100/50">
        <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
          <span>🌟</span> Inspire Others
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed">
          The biggest impact you can have now is helping others. Share your
          sustainable practices with friends and family, or advocate for climate
          policies in your community.
        </p>
      </div>
    </GlassCard>
  );
}
