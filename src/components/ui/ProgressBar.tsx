'use client';

import { m as motion } from 'framer-motion';

const STEP_LABELS = ['Transport', 'Energy', 'Food', 'Lifestyle'] as const;

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps = 4,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Native progress element for accessibility */}
      <progress
        className="sr-only"
        value={currentStep + 1}
        max={totalSteps}
      >
        Step {currentStep + 1} of {totalSteps}
      </progress>

      {/* Step labels */}
      <div className="mb-3 flex justify-between">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium transition-colors sm:text-sm ${
              i <= currentStep ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Track */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        />
      </div>

      {/* Step dots */}
      <div className="relative mt-1.5 flex justify-between px-[2px]">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${
              i <= currentStep
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-gray-300 bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
