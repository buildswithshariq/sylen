'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { m as motion } from 'framer-motion';

import { useAssessment } from '@/hooks/useAssessment';
import { useScore } from '@/hooks/useScore';
import { useWhatIf } from '@/hooks/useWhatIf';
import { useCoach } from '@/hooks/useCoach';

import ScoreCard from '@/components/dashboard/ScoreCard';
import EcoLevelCard from '@/components/dashboard/EcoLevelCard';
import EmissionBreakdown from '@/components/dashboard/EmissionBreakdown';
import dynamic from 'next/dynamic';

import RecommendationList from '@/components/dashboard/RecommendationList';
import CommunityImpactWidget from '@/components/dashboard/CommunityImpactWidget';
import CarbonSavingsTimeline from '@/components/dashboard/CarbonSavingsTimeline';
import PriorityActions from '@/components/dashboard/PriorityActions';
import GlassCard from '@/components/ui/GlassCard';
import ShareButton from '@/components/dashboard/ShareButton';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

import ChampionHero from '@/components/dashboard/ChampionHero';
import PositiveImpactSummary from '@/components/dashboard/PositiveImpactSummary';
import MaintainImpactCard from '@/components/dashboard/MaintainImpactCard';
import ChampionHabits from '@/components/dashboard/ChampionHabits';

import { SustainabilityScore, UserEcoLevel, AssessmentData, CoachContext } from '@/types';

const CoachChat = dynamic(() => import('@/components/coach/CoachChat'), { ssr: false, loading: () => <div className="p-4 text-center text-sm text-stone-500 animate-pulse">Loading AI Coach...</div> });
const WhatIfSimulator = dynamic(() => import('@/components/simulator/WhatIfSimulator'), { ssr: false, loading: () => <div className="p-4 text-center text-sm text-stone-500 animate-pulse">Loading Simulator...</div> });
const RoadmapCard = dynamic(() => import('@/components/dashboard/RoadmapCard'), { ssr: false, loading: () => <div className="p-4 text-center text-sm text-stone-500 animate-pulse">Loading Roadmap...</div> });

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

/* ------------------------------------------------------------------ */
/*  Shared sub-components to eliminate duplication between dashboards  */
/* ------------------------------------------------------------------ */

function DashboardHeader({ title, subtitle, score, ecoLevel, assessmentData, onShared, onRetake }: Readonly<{
  title: string;
  subtitle: string;
  score: SustainabilityScore;
  ecoLevel: UserEcoLevel;
  assessmentData?: AssessmentData;
  onShared: () => void;
  onRetake: () => void;
}>) {
  return (
    <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">{title}</h1>
        <p className="text-stone-500 mt-2 text-base sm:text-lg leading-relaxed">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ShareButton
          score={score}
          ecoLevelName={ecoLevel.current.name}
          ecoLevelBadge={ecoLevel.current.badge}
          assessmentData={assessmentData}
          onShared={onShared}
        />
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 px-5 py-3 min-h-[56px] bg-white/60 hover:bg-white border border-stone-200 text-stone-700 rounded-xl shadow-sm transition-all text-sm font-medium whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retake Assessment
        </button>
      </div>
    </div>
  );
}

function SproutCoachSection({ coach, coachContext, colSpan }: Readonly<{
  coach: ReturnType<typeof useCoach>;
  coachContext: CoachContext | null;
  colSpan: string;
}>) {
  return (
    <motion.div variants={itemAnim} className={`${colSpan} h-full`} id="sprout-coach-section">
      <GlassCard className="p-0 h-[500px] flex flex-col overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/20 bg-white/40">
          <div className="flex items-center gap-2">
            <span className="text-base">🌱</span>
            <h3 className="font-semibold text-stone-800">Sprout Coach AI</h3>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <CoachChat
            messages={coach.messages}
            isLoading={coach.isLoading}
            error={coach.error}
            onSendMessage={coach.sendMessage}
            onInitialize={coach.initializeGreeting}
            context={coachContext}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}

function RetakeModal({ onConfirm, onCancel }: Readonly<{ onConfirm: () => void; onCancel: () => void }>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
      >
        <h3 className="text-lg font-bold text-stone-900 mb-2">Start a New Assessment?</h3>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          Your current assessment results will be replaced.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-3 min-h-[48px] rounded-xl bg-white/60 text-stone-700 text-sm font-medium border border-stone-200 hover:bg-white transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-3 min-h-[48px] rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">Continue</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard Page                                                */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const { assessmentData, isComplete, isLoaded } = useAssessment();
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
    // Force scroll to top when dashboard mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (mounted && isLoaded && !isComplete) {
      if (document.startViewTransition) {
        document.startViewTransition(() => router.push('/assessment'));
      } else {
        router.push('/assessment');
      }
    }
  }, [mounted, isComplete, isLoaded, router]);

  if (!mounted || !isLoaded || !isComplete || !results) {
    return <DashboardSkeleton />;
  }

  const { score, recommendations, ecoLevel, roadmap } = results;

  const handleRetake = () => {
    localStorage.removeItem('sylen-assessment');
    localStorage.removeItem('eco-score-cache');
    setShowRetakeModal(false);
    if (document.startViewTransition) {
      document.startViewTransition(() => router.push('/assessment?retake=true'));
    } else {
      router.push('/assessment?retake=true');
    }
  };

  const handleShared = () => {
    coach.pushMessage("Your sustainability report is ready 🌱 Share it with friends and encourage them to measure their own impact.", "assistant");
  };

  // CHAMPION DASHBOARD MODE
  if (score.score >= 90) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 lg:px-12 relative bg-off-white">
        <div className="absolute inset-0 bg-grid z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <DashboardHeader
            title="Climate Champion Dashboard"
            subtitle="Thank you for leading the way towards a sustainable future."
            score={score}
            ecoLevel={ecoLevel}
            assessmentData={assessmentData || undefined}
            onShared={handleShared}
            onRetake={() => setShowRetakeModal(true)}
          />

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* Row 1: Hero + Impact Summary */}
            <motion.div variants={itemAnim} className="md:col-span-4 h-full">
              <ChampionHero score={score.score} className="h-full p-6 sm:p-8" />
            </motion.div>
            
            <motion.div variants={itemAnim} className="md:col-span-8 h-full">
              <PositiveImpactSummary totalEmissions={score.totalEmissions} comparisonToAverage={score.comparisonToAverage} className="h-full" />
            </motion.div>

            {/* Row 2: Maintain Impact + Emissions Breakdown */}
            <motion.div variants={itemAnim} className="md:col-span-5 h-full">
              <MaintainImpactCard assessmentData={assessmentData!} />
            </motion.div>

            <motion.div variants={itemAnim} className="md:col-span-7 h-full">
              <GlassCard className="p-6 sm:p-8 h-full">
                <h3 className="text-lg font-semibold text-stone-800 mb-6">Your Emission Sources</h3>
                <EmissionBreakdown contributions={score.contributions} />
              </GlassCard>
            </motion.div>

            {/* Row 3: Habits + Sprout Coach */}
            <motion.div variants={itemAnim} className="md:col-span-5 h-full">
              <ChampionHabits className="h-full" />
            </motion.div>

            <SproutCoachSection coach={coach} coachContext={coachContext} colSpan="md:col-span-7" />
          </motion.div>
        </div>
        
        {showRetakeModal && <RetakeModal onConfirm={handleRetake} onCancel={() => setShowRetakeModal(false)} />}
      </div>
    );
  }

  // STANDARD DASHBOARD MODE (Score < 90)
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 lg:px-12 relative bg-off-white">
      {/* Background */}
      <div className="absolute inset-0 bg-grid z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <DashboardHeader
          title="Your Carbon Dashboard"
          subtitle="Based on your assessment — your environmental impact and how to reduce it."
          score={score}
          ecoLevel={ecoLevel}
          assessmentData={assessmentData || undefined}
          onShared={handleShared}
          onRetake={() => setShowRetakeModal(true)}
        />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Row 1: Score + Eco Level + Community */}
          <motion.div variants={itemAnim} className="md:col-span-4">
            <ScoreCard score={score} />
          </motion.div>
          
          <motion.div variants={itemAnim} className="md:col-span-4">
            <EcoLevelCard ecoLevel={ecoLevel} />
          </motion.div>
          
          <motion.div variants={itemAnim} className="md:col-span-4 h-full">
            <CommunityImpactWidget userEmissionsKg={score.totalEmissions} className="h-full" />
          </motion.div>

          {/* Row 2: Priority Actions + Carbon Savings */}
          <motion.div variants={itemAnim} className="md:col-span-5">
            <PriorityActions recommendations={recommendations} />
          </motion.div>

          <motion.div variants={itemAnim} className="md:col-span-7">
            <CarbonSavingsTimeline recommendations={recommendations} />
          </motion.div>

          {/* Row 3: Emissions + What-If */}
          <motion.div variants={itemAnim} className="md:col-span-7">
            <GlassCard className="p-6 sm:p-8 h-full">
              <h3 className="text-lg font-semibold text-stone-800 mb-6">Emission Sources</h3>
              <EmissionBreakdown contributions={score.contributions} />
            </GlassCard>
          </motion.div>

          <motion.div variants={itemAnim} className="md:col-span-5">
            <GlassCard className="p-6 sm:p-8 h-full">
              <WhatIfSimulator 
                scenarios={whatIf.scenarios}
                selectedScenarioIds={whatIf.selectedScenarioIds}
                result={whatIf.result}
                onToggleScenario={whatIf.toggleScenario}
                onClear={whatIf.clearSimulation}
              />
            </GlassCard>
          </motion.div>

          {/* Row 4: Roadmap + Coach + Recommendations */}
          <motion.div variants={itemAnim} className="md:col-span-4">
            <RoadmapCard roadmap={roadmap} />
          </motion.div>

          <SproutCoachSection coach={coach} coachContext={coachContext} colSpan="md:col-span-4" />

          <motion.div variants={itemAnim} className="md:col-span-4">
            <RecommendationList recommendations={recommendations} className="p-6 sm:p-8 h-full" />
          </motion.div>
          
        </motion.div>
      </div>

      {showRetakeModal && <RetakeModal onConfirm={handleRetake} onCancel={() => setShowRetakeModal(false)} />}
    </div>
  );
}
