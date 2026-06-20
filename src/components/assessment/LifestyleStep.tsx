"use client";

import { m as motion } from "framer-motion";
import type { LifestyleData, ShoppingFrequency, RecyclingHabit } from "@/types";

interface LifestyleStepProps {
  readonly data: Partial<LifestyleData>;
  readonly onChange: (data: LifestyleData) => void;
}

const SHOPPING_OPTIONS: {
  value: ShoppingFrequency;
  label: string;
  description: string;
}[] = [
  { value: "rarely", label: "Rarely", description: "A few times a year" },
  { value: "monthly", label: "Monthly", description: "Once or twice a month" },
  { value: "weekly", label: "Weekly", description: "Most weeks" },
];

const RECYCLING_OPTIONS: {
  value: RecyclingHabit;
  label: string;
  icon: string;
}[] = [
  { value: "always", label: "Always", icon: "♻️" },
  { value: "sometimes", label: "Sometimes", icon: "🔄" },
  { value: "never", label: "Never", icon: "🗑️" },
];

const defaults: LifestyleData = {
  flightsPerYear: 2,
  shoppingFrequency: "monthly",
  recyclingHabit: "sometimes",
  displayName: "",
};

function merged(data: Partial<LifestyleData>): LifestyleData {
  return { ...defaults, ...data };
}

export default function LifestyleStep({ data, onChange }: LifestyleStepProps) {
  const current = merged(data);

  function update(patch: Partial<LifestyleData>) {
    onChange({ ...current, ...patch });
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          Lifestyle &amp; habits
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          A few more questions about your consumption and recycling habits.
        </p>
      </div>

      {/* Flights per year */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label
            htmlFor="flights"
            className="text-sm font-medium text-gray-700"
          >
            Flights per year
          </label>
          <span className="text-lg font-semibold text-emerald-700">
            {current.flightsPerYear}
          </span>
        </div>
        <input
          id="flights"
          type="range"
          min={0}
          max={20}
          step={1}
          aria-label="Flights per year"
          value={current.flightsPerYear}
          onChange={(e) => update({ flightsPerYear: Number(e.target.value) })}
          className="w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>20</span>
        </div>
      </div>

      {/* Shopping frequency */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-gray-700">
          How often do you shop for non-essentials?
        </legend>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          role="radiogroup"
          aria-label="How often do you shop for non-essentials?"
        >
          {SHOPPING_OPTIONS.map(({ value, label, description }) => {
            const selected = current.shoppingFrequency === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => update({ shoppingFrequency: value })}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 min-h-[56px] transition-colors ${
                  selected
                    ? "border-emerald-500 bg-emerald-50/80"
                    : "border-transparent bg-white/40 hover:bg-emerald-50/60"
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

      {/* Recycling */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-gray-700">
          Do you recycle?
        </legend>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          role="radiogroup"
          aria-label="Do you recycle?"
        >
          {RECYCLING_OPTIONS.map(({ value, label, icon }) => {
            const selected = current.recyclingHabit === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => update({ recyclingHabit: value })}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 min-h-[56px] transition-colors ${
                  selected
                    ? "border-emerald-500 bg-emerald-50/80"
                    : "border-transparent bg-white/40 hover:bg-emerald-50/60"
                }`}
                role="radio"
                aria-checked={selected}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </fieldset>

      {/* Display Name */}
      <fieldset className="pt-4 border-t border-gray-100">
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-gray-700"
        >
          What should we call you?
        </label>
        <p className="mb-3 text-xs text-gray-500">
          Optional. Used only when sharing your sustainability report.
        </p>
        <input
          id="displayName"
          type="text"
          placeholder="Alex"
          value={current.displayName || ""}
          onChange={(e) => {
            // Sanitize: allow only alphanumeric and spaces, max 20 chars
            const sanitized = e.target.value
              .replace(/[^a-zA-Z0-9 ]/g, "")
              .slice(0, 20);
            update({ displayName: sanitized });
          }}
          className="w-full rounded-xl border-2 border-transparent bg-white/60 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
        />
      </fieldset>
    </div>
  );
}
