'use client';

import { m as motion, AnimatePresence } from 'framer-motion';
import { WhatIfResult, WhatIfScenario } from '@/types';

interface WhatIfSimulatorProps {
  scenarios: WhatIfScenario[];
  selectedScenarioIds: string[];
  result: WhatIfResult | null;
  onToggleScenario: (scenarioId: string) => void;
  onClear: () => void;
}

export default function WhatIfSimulator({
  scenarios,
  selectedScenarioIds,
  result,
  onToggleScenario,
  onClear,
}: WhatIfSimulatorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-stone-800 mb-1">
          🔮 What-If Simulator
        </h3>
        <p className="text-xs text-stone-500">
          See how lifestyle changes could impact your footprint
        </p>
      </div>

      {/* Scenario Cards */}
      <div className="space-y-2">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenarioIds.includes(scenario.id);
          return (
            <button
              key={scenario.id}
              onClick={() => onToggleScenario(scenario.id)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 border relative ${
                isSelected
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                  : 'bg-white/40 border-white/30 hover:bg-white/60 hover:border-emerald-200'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className="flex items-center gap-2 pr-6">
                <span className="text-lg">{scenario.icon}</span>
                <div>
                  <p className={`text-sm font-medium ${isSelected ? 'text-emerald-900' : 'text-stone-800'}`}>
                    {scenario.label}
                  </p>
                <p className="text-xs text-stone-500">{scenario.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-emerald-50/80 to-sky-50/80 rounded-xl p-4 border border-emerald-200/50 space-y-3">
              <h4 className="text-sm font-semibold text-emerald-800">
                📊 Simulation Result
              </h4>

              {/* Score Comparison */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs text-stone-500 mb-1">Current</p>
                  <p className="text-2xl font-bold text-stone-700">
                    {result.originalScore}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <svg
                    className="w-6 h-6 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span className="text-xs text-emerald-600 font-medium mt-0.5">
                    +{result.newScore - result.originalScore} pts
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-xs text-stone-500 mb-1">Projected</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {result.newScore}
                  </p>
                </div>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/60 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-stone-500">CO₂e Saved</p>
                  <p className="text-sm font-bold text-emerald-700">
                    ↓ {result.reductionKg.toLocaleString()} kg/yr
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-stone-500">Improvement</p>
                  <p className="text-sm font-bold text-emerald-700">
                    {result.improvementPercent}%
                  </p>
                </div>
              </div>

              {/* New Category */}
              <div className="text-center pt-1">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  New Category: {result.newCategoryLabel}
                </span>
              </div>

              {/* Clear */}
              <button
                onClick={onClear}
                className="w-full text-xs text-stone-400 hover:text-stone-600 transition-colors pt-1"
              >
                Clear simulation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {scenarios.length === 0 && (
        <p className="text-xs text-stone-400 text-center py-4">
          Complete the assessment to unlock scenarios
        </p>
      )}
    </div>
  );
}
