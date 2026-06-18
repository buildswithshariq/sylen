'use client';

import { m as motion } from 'framer-motion';
import type { FoodData, DietType, FoodWasteLevel } from '@/types';

interface FoodStepProps {
  data: Partial<FoodData>;
  onChange: (data: FoodData) => void;
}

const DIETS: { value: DietType; label: string; icon: string }[] = [
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'mixed', label: 'Mixed', icon: '🍽️' },
  { value: 'heavy_meat', label: 'Heavy Meat', icon: '🥩' },
];

const WASTE_LEVELS: {
  value: FoodWasteLevel;
  label: string;
  description: string;
}[] = [
  { value: 'minimal', label: 'Minimal', description: 'Almost none' },
  { value: 'some', label: 'Some', description: 'Occasional waste' },
  {
    value: 'significant',
    label: 'Significant',
    description: 'Frequent waste',
  },
];

const defaults: FoodData = {
  dietType: 'mixed',
  meatMealsPerWeek: 5,
  foodWaste: 'some',
};

function merged(data: Partial<FoodData>): FoodData {
  return { ...defaults, ...data };
}

export default function FoodStep({ data, onChange }: FoodStepProps) {
  const current = merged(data);

  function update(patch: Partial<FoodData>) {
    onChange({ ...current, ...patch });
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          Food &amp; diet habits
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your eating habits play a big role in your carbon footprint.
        </p>
      </div>

      {/* Diet type */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-gray-700">
          What best describes your diet?
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup" aria-label="What best describes your diet?">
          {DIETS.map(({ value, label, icon }) => {
            const selected = current.dietType === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => update({ dietType: value })}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 min-h-[56px] transition-colors ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50/80'
                    : 'border-transparent bg-white/40 hover:bg-emerald-50/60'
                }`}
                role="radio"
                aria-checked={selected}
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </fieldset>

      {/* Meat meals per week */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label
            htmlFor="meatMeals"
            className="text-sm font-medium text-gray-700"
          >
            Meat meals per week
          </label>
          <span className="text-lg font-semibold text-emerald-700">
            {current.meatMealsPerWeek}
          </span>
        </div>
        <input
          id="meatMeals"
          type="range"
          min={0}
          max={14}
          step={1}
          aria-label="Meat meals per week"
          value={current.meatMealsPerWeek}
          onChange={(e) =>
            update({ meatMealsPerWeek: Number(e.target.value) })
          }
          className="w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>14</span>
        </div>
      </div>

      {/* Food waste */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-gray-700">
          How much food do you waste?
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" role="radiogroup" aria-label="How much food do you waste?">
          {WASTE_LEVELS.map(({ value, label, description }) => {
            const selected = current.foodWaste === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => update({ foodWaste: value })}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 min-h-[56px] transition-colors ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50/80'
                    : 'border-transparent bg-white/40 hover:bg-emerald-50/60'
                }`}
                role="radio"
                aria-checked={selected}
              >
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
                <span className="text-xs text-gray-500">{description}</span>
              </motion.button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
