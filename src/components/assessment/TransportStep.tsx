"use client";

import { m as motion } from "framer-motion";
import type { TransportData, VehicleType, FuelType } from "@/types";

interface TransportStepProps {
  data: Partial<TransportData>;
  onChange: (data: TransportData) => void;
}

const VEHICLES: { value: VehicleType; label: string; icon: string }[] = [
  { value: "car", label: "Car", icon: "🚗" },
  { value: "public_transit", label: "Public Transit", icon: "🚇" },
  { value: "motorbike", label: "Motorbike", icon: "🏍️" },
  { value: "bicycle", label: "Bicycle", icon: "🚴" },
  { value: "walk", label: "Walk", icon: "🚶" },
];

const FUELS: { value: FuelType; label: string }[] = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
];

const defaults: TransportData = {
  vehicleType: "car",
  fuelType: "gasoline",
  dailyDistanceKm: 20,
};

function merged(data: Partial<TransportData>): TransportData {
  return { ...defaults, ...data };
}

export default function TransportStep({ data, onChange }: TransportStepProps) {
  const current = merged(data);

  function update(patch: Partial<TransportData>) {
    onChange({ ...current, ...patch });
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          How do you get around?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your daily commute and travel habits.
        </p>
      </div>

      {/* Vehicle selector */}
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-gray-700">
          Primary mode of transport
        </legend>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          role="radiogroup"
          aria-label="Primary mode of transport"
        >
          {VEHICLES.map(({ value, label, icon }) => {
            const selected = current.vehicleType === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => update({ vehicleType: value })}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 min-h-[56px] transition-colors ${
                  selected
                    ? "border-emerald-500 bg-emerald-50/80"
                    : "border-transparent bg-white/40 hover:bg-emerald-50/60"
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

      {/* Fuel type (car only) */}
      {current.vehicleType === "car" && (
        <motion.fieldset
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
        >
          <legend className="mb-3 text-sm font-medium text-gray-700">
            Fuel type
          </legend>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            role="radiogroup"
            aria-label="Fuel type"
          >
            {FUELS.map(({ value, label }) => {
              const selected = current.fuelType === value;
              return (
                <motion.button
                  key={value}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => update({ fuelType: value })}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors min-h-[56px] flex items-center justify-center ${
                    selected
                      ? "border-emerald-500 bg-emerald-50/80 text-emerald-700"
                      : "border-transparent bg-white/40 text-gray-600 hover:bg-emerald-50/60"
                  }`}
                  role="radio"
                  aria-checked={selected}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </motion.fieldset>
      )}

      {/* Distance slider */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label
            htmlFor="distance"
            className="text-sm font-medium text-gray-700"
          >
            Daily commute distance
          </label>
          <span className="text-lg font-semibold text-emerald-700">
            {current.dailyDistanceKm} km
          </span>
        </div>
        <input
          id="distance"
          type="range"
          min={0}
          max={100}
          step={1}
          aria-label="Daily commute distance"
          value={current.dailyDistanceKm}
          onChange={(e) => update({ dailyDistanceKm: Number(e.target.value) })}
          className="w-full accent-emerald-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0 km</span>
          <span>100 km</span>
        </div>
      </div>
    </div>
  );
}
