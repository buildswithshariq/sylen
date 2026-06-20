"use client";

import GlassCard from "@/components/ui/GlassCard";

interface CommunityImpactWidgetProps {
  userEmissionsKg: number;
  className?: string;
}

export default function CommunityImpactWidget({
  userEmissionsKg,
  className = "",
}: Readonly<CommunityImpactWidgetProps>) {
  // US Average footprint is roughly 16,000 kg CO2e/year
  const avgEmissions = 16000;

  // Calculate how much less (or more) the user emits compared to average
  const difference = avgEmissions - userEmissionsKg;
  const isBetter = difference > 0;

  // What if 1,000 people lived like the user?
  const communitySavings = isBetter ? difference * 1000 : 0;
  const treesEquivalent = isBetter ? Math.round(communitySavings / 20) : 0; // 1 tree absorbs ~20kg CO2/year

  return (
    <GlassCard className={`p-6 flex flex-col justify-between ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-stone-800 mb-2">
          Community Impact
        </h3>
        {isBetter ? (
          <p className="text-stone-600 text-sm mb-4">
            You emit{" "}
            <span className="font-bold text-emerald-600">
              {difference.toLocaleString()} kg
            </span>{" "}
            less than the average person annually.
          </p>
        ) : (
          <p className="text-stone-600 text-sm mb-4">
            You emit{" "}
            <span className="font-bold text-rose-500">
              {Math.abs(difference).toLocaleString()} kg
            </span>{" "}
            more than average. Small changes can flip this!
          </p>
        )}
      </div>

      <div className="mt-auto">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
          If 1,000 people had your footprint:
        </h4>
        <div className="bg-white/50 rounded-xl p-4 border border-white/60">
          {isBetter ? (
            <div className="flex items-center gap-4">
              <div className="text-4xl">🌳</div>
              <div>
                <p className="text-sm text-stone-600">
                  It would be equivalent to planting
                </p>
                <p className="text-xl font-bold text-emerald-700">
                  {treesEquivalent.toLocaleString()} trees
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏭</div>
              <div>
                <p className="text-sm text-stone-600">We would need to plant</p>
                <p className="text-xl font-bold text-rose-600">
                  {Math.round(
                    (Math.abs(difference) * 1000) / 20,
                  ).toLocaleString()}{" "}
                  extra trees
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
