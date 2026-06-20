"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import { useAssessment } from "@/hooks/useAssessment";

import ProgressBar from "@/components/ui/ProgressBar";
import GlassCard from "@/components/ui/GlassCard";
import TransportStep from "@/components/assessment/TransportStep";
import EnergyStep from "@/components/assessment/EnergyStep";
import FoodStep from "@/components/assessment/FoodStep";
import LifestyleStep from "@/components/assessment/LifestyleStep";
import AssessmentSkeleton from "@/components/assessment/AssessmentSkeleton";

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retake = searchParams.get("retake");
  const [mounted, setMounted] = useState(false);
  const {
    currentStep,
    data,
    isComplete,
    isLoaded,
    updateTransport,
    updateEnergy,
    updateFood,
    updateLifestyle,
    nextStep,
    prevStep,
    isStepValid,
    resetAssessment,
  } = useAssessment();

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Redirect if complete
  useEffect(() => {
    if (retake === "true") {
      resetAssessment();
      router.replace("/assessment");
      return;
    }
    if (isLoaded && isComplete && retake !== "true") {
      if (document.startViewTransition) {
        document.startViewTransition(() => router.push("/dashboard"));
      } else {
        router.push("/dashboard");
      }
    }
  }, [isLoaded, isComplete, router, retake, resetAssessment]);

  if (!mounted || !isLoaded || isComplete) return <AssessmentSkeleton />;

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TransportStep data={data.transport ?? {}} onChange={updateTransport} />
        );
      case 1:
        return <EnergyStep data={data.energy ?? {}} onChange={updateEnergy} />;
      case 2:
        return <FoodStep data={data.food ?? {}} onChange={updateFood} />;
      case 3:
        return (
          <LifestyleStep data={data.lifestyle ?? {}} onChange={updateLifestyle} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 lg:px-12 relative overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl z-0" />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col flex-1">
        {/* Header & Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Carbon Footprint Assessment
          </h1>
          <p className="text-stone-500 mb-6">
            Let&apos;s understand your impact. We use real EPA emission factors
            to calculate your footprint.
          </p>
          <ProgressBar currentStep={currentStep} totalSteps={4} />
        </div>

        {/* Step Content */}
        <div className="flex-1 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="h-full"
            >
              <GlassCard className="p-6 sm:p-10 md:p-12 h-full flex flex-col">
                <div className="flex-1">{renderStep()}</div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 min-h-[56px] rounded-xl font-medium transition-all ${
              currentStep === 0
                ? "opacity-0 cursor-default"
                : "bg-white/60 text-stone-600 hover:bg-white/80 border border-white/40"
            }`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`px-8 py-3 min-h-[56px] rounded-xl font-medium transition-all shadow-sm ${
              isStepValid()
                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20 active:scale-[0.98]"
                : "bg-stone-200 text-stone-500 cursor-not-allowed"
            }`}
          >
            {currentStep === 3 ? "Calculate Score" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={<AssessmentSkeleton />}>
      <AssessmentContent />
    </Suspense>
  );
}
