"use client";

import { m as motion } from "framer-motion";
import type { EnergyData, ApplianceUsage } from "@/types";

interface EnergyStepProps {
  data: Partial<EnergyData>;
  onChange: (data: EnergyData) => void;
}

const APPLIANCE_OPTIONS: {
  value: ApplianceUsage;
  label: string;
  description: string;
}[] = [
  { value: "low", label: "Low", description: "Minimal electronics" },
  { value: "medium", label: "Medium", description: "Typical household" },
  { value: "high", label: "High", description: "Many devices" },
];

const defaults: EnergyData = {
  monthlyElectricityKwh: 300,
  acHoursPerDay: 4,
  applianceUsage: "medium",
};

function merged(data: Partial<EnergyData>): EnergyData {
  return { ...defaults, ...data };
}

export default function EnergyStep({ data, onChange }: EnergyStepProps) {
  const current = merged(data);

  function update(patch: Partial<EnergyData>) {
    onChange({ ...current, ...patch });
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          Home energy usage
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Help us understand your electricity consumption patterns.
        </p>
      </div>

      {/* Monthly electricity */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label
            htmlFor="electricity"
            className="text-sm font-medium text-gray-700"
          >
            Monthly electricity
          </label>
          <span className="text-lg font-semibold text-emerald-700">
            {current.monthlyElectricityKwh} kWh
          </span>
        </div>
        <input
          id="electricity"
          type="range"
          min={0}
          max={1000}
          step={10}
          aria-label="Monthly electricity consumption"
          value={current.monthlyElectricityKwh}
          onChange={(e) =>
            update({ monthlyElectricityKwh: Number(e.target.value) })
          }
          className="w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0 kWh</span>
          <span>1,000 kWh</span>
        </div>
      </div>

      {/* AC hours */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="ac" className="text-sm font-medium text-gray-700">
            Air conditioning per day
          </label>
          <span className="text-lg font-semibold text-emerald-700">
            {current.acHoursPerDay} hrs
          </span>
        </div>
        <input
          id="ac"
          type="range"
          min={0}
          max={24}
          step={1}
          aria-label="Air conditioning hours per day"
          value={current.acHoursPerDay}
          onChange={(e) => update({ acHoursPerDay: Number(e.target.value) })}
          className="w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0 hrs</span>
          <span>24 hrs</span>
        </div>
      </div>

      {/* Appliance usage */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-gray-700">
          Appliance usage level
        </legend>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
          role="radiogroup"
          aria-label="Appliance usage level"
        >
          {APPLIANCE_OPTIONS.map(({ value, label, description }) => {
            const selected = current.applianceUsage === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => update({ applianceUsage: value })}
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
    </div>
  );
}
