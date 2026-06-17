'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { useAssessment } from '@/hooks/useAssessment';
import { useScore } from '@/hooks/useScore';
import { useWhatIf } from '@/hooks/useWhatIf';
import { useCoach } from '@/hooks/useCoach';

import ScoreCard from '@/components/dashboard/ScoreCard';
import EcoLevelCard from '@/components/dashboard/EcoLevelCard';
import EmissionBreakdown from '@/components/dashboard/EmissionBreakdown';
import RecommendationList from '@/components/dashboard/RecommendationList';
import RoadmapCard from '@/components/dashboard/RoadmapCard';
import WhatIfSimulator from '@/components/simulator/WhatIfSimulator';
import CoachChat from '@/components/coach/CoachChat';
import CommunityImpactWidget from '@/components/dashboard/CommunityImpactWidget';
import GlassCard from '@/components/ui/GlassCard';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { assessmentData, isComplete, isLoaded, resetAssessment } = useAssessment();
  const results = useScore(assessmentData);
  
  const whatIf = useWhatIf(assessmentData);
  
  // Prepare coach context
  const coachContext = results && assessmentData ? {
    assessment: assessmentData,
    score: results.score,
    recommendations: results.recommendations,
    ecoLevel: results.ecoLevel,
  } : null;
  
  const coach = useCoach(coachContext);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    console.log('[Dashboard] Redirect check: mounted=', mounted, 'isLoaded=', isLoaded, 'isComplete=', isComplete);
    if (mounted && isLoaded && !isComplete) {
      console.log('[Dashboard] Redirecting back to /assessment!');
      router.push('/assessment');
    }
  }, [mounted, isComplete, isLoaded, router]);

  if (!mounted || !isLoaded || !isComplete || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const { score, recommendations, ecoLevel, roadmap } = results;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 lg:px-12 relative bg-off-white">
      {/* Background */}
      <div className="absolute inset-0 bg-grid z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Your Carbon Dashboard</h1>
            <p className="text-stone-500 mt-2 text-base sm:text-lg">Based on your assessment, here is your environmental impact and how to reduce it.</p>
          </div>
          
          <button
            onClick={() => {
              if (window.confirm("Start a new assessment? This will clear your current results.")) {
                if (assessmentData) resetAssessment();
                router.push('/assessment');
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 min-h-[56px] bg-white/60 hover:bg-white border border-stone-200 text-stone-700 rounded-xl shadow-sm transition-all text-sm font-medium whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake Assessment
          </button>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Top Row */}
          <motion.div variants={itemAnim} className="md:col-span-4">
            <ScoreCard score={score} />
          </motion.div>
          
          <motion.div variants={itemAnim} className="md:col-span-4">
            <EcoLevelCard ecoLevel={ecoLevel} />
          </motion.div>
          
          <motion.div variants={itemAnim} className="md:col-span-4 h-full">
            <CommunityImpactWidget userEmissionsKg={score.totalEmissions} className="h-full" />
          </motion.div>

          {/* Middle Row */}
          <motion.div variants={itemAnim} className="md:col-span-7">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-stone-800 mb-6">Emission Sources</h3>
              <EmissionBreakdown contributions={score.contributions} />
            </GlassCard>
          </motion.div>

          <motion.div variants={itemAnim} className="md:col-span-5">
            <GlassCard className="p-6 h-full">
              <WhatIfSimulator 
                scenarios={whatIf.scenarios}
                selectedScenarioIds={whatIf.selectedScenarioIds}
                result={whatIf.result}
                onToggleScenario={whatIf.toggleScenario}
                onClear={whatIf.clearSimulation}
              />
            </GlassCard>
          </motion.div>

          {/* Bottom Row */}
          <motion.div variants={itemAnim} className="md:col-span-4">
            <RoadmapCard roadmap={roadmap} />
          </motion.div>

          <motion.div variants={itemAnim} className="md:col-span-4">
            <GlassCard className="p-0 h-[500px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/20 bg-white/40">
                <h3 className="font-semibold text-stone-800">AI Sustainability Coach</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <CoachChat 
                  messages={coach.messages}
                  isLoading={coach.isLoading}
                  error={coach.error}
                  onSendMessage={coach.sendMessage}
                  onInitialize={coach.initializeGreeting}
                />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemAnim} className="md:col-span-4">
            <RecommendationList recommendations={recommendations} className="p-6 h-full" />
          </motion.div>
          
        </motion.div>
      </div>
    </div>
  );
}
