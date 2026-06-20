"use client";

import { useSearchParams } from "next/navigation";
import { m as motion } from "framer-motion";
import TransitionLink from "@/components/ui/TransitionLink";
import GlassCard from "@/components/ui/GlassCard";
import EmissionBreakdown from "@/components/dashboard/EmissionBreakdown";
import SharedReportSkeleton from "@/components/shared-report/SharedReportSkeleton";
import { CategoryContribution } from "@/types";
import { useState, useEffect } from "react";

interface SharedReportData {
  displayName?: string;
  score: number;
  ecoLevel: string;
  ecoBadge: string;
  totalEmissions: number;
  contributions: CategoryContribution[];
  topStrength: string;
  improvementArea: string;
}

export default function SharedReportContent() {
  const searchParams = useSearchParams();
  const rawData = searchParams.get("data");

  const [data, setData] = useState<SharedReportData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      if (!rawData) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/share/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: rawData }),
        });

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (json.data) {
          setData(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to verify token", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    verifyToken();
  }, [rawData]);

  if (loading) {
    return <SharedReportSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-off-white p-6">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">
          Invalid Report Link
        </h1>
        <p className="text-stone-600 mb-8">
          This sustainability report link appears to be broken, invalid, or
          tampered with.
        </p>
        <TransitionLink
          href="/"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-sm transition-all"
        >
          Go to Sylen
        </TransitionLink>
      </div>
    );
  }

  const titleName = data.displayName ? `${data.displayName}'s` : "Anonymous";

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 lg:px-12 relative bg-off-white">
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header / Share Card */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block glass-strong rounded-3xl p-8 sm:p-12 border-2 border-emerald-500/20 shadow-xl relative overflow-hidden max-w-2xl w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-sky-400/10 z-0" />
            <div className="relative z-10">
              <div className="text-6xl mb-4">{data.ecoBadge}</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
                {titleName} Sustainability Report 🌱
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10">
                {data.displayName && (
                  <>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-stone-500 uppercase tracking-wider font-bold mb-2">
                        Name
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-stone-800">
                        {data.displayName}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px h-16 bg-stone-200" />
                  </>
                )}

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-stone-500 uppercase tracking-wider font-bold mb-2">
                    Score
                  </p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600">
                    {data.score}
                    <span className="text-xl sm:text-2xl text-stone-500 font-bold">
                      /100
                    </span>
                  </p>
                </div>

                <div className="hidden sm:block w-px h-16 bg-stone-200" />

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-stone-500 uppercase tracking-wider font-bold mb-2">
                    Level
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-stone-800">
                    {data.ecoLevel}
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-stone-200/50">
                <p className="text-sm font-medium text-stone-500">
                  Generated by Sylen 🌱
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <GlassCard className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Carbon Footprint Summary
            </h3>
            <p className="text-4xl font-bold text-emerald-700">
              {data.totalEmissions.toLocaleString()}{" "}
              <span className="text-lg text-stone-500 font-medium">
                kg CO₂e/year
              </span>
            </p>
            <div className="mt-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Top Strength
                </h4>
                <p className="text-stone-800 font-medium text-lg">
                  🌟 Low Impact in {data.topStrength}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Potential Improvement Area
                </h4>
                <p className="text-stone-800 font-medium text-lg">
                  📈 Focus on {data.improvementArea}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-stone-800 mb-6">
              Emission Breakdown
            </h3>
            <EmissionBreakdown contributions={data.contributions} />
          </GlassCard>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-16 pt-10 border-t border-stone-200"
        >
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Want to measure your own impact?
          </h2>
          <TransitionLink
            href="/assessment"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Take Your Own Assessment
          </TransitionLink>
        </motion.div>
      </div>
    </div>
  );
}
