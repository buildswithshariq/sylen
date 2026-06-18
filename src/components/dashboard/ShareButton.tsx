'use client';

import { useState, useEffect } from 'react';
import { SustainabilityScore, AssessmentData } from '@/types';

interface ShareButtonProps {
  score: SustainabilityScore;
  ecoLevelName: string;
  ecoLevelBadge: string;
  assessmentData?: AssessmentData;
  onShared?: () => void;
}

export default function ShareButton({ score, ecoLevelName, ecoLevelBadge, assessmentData, onShared }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function generateToken() {
      try {
        setIsGenerating(true);
        const sorted = [...score.contributions].sort((a, b) => a.amount - b.amount);
        const topStrength = sorted[0]?.label || 'General Lifestyle';
        const improvementArea = sorted[sorted.length - 1]?.label || 'Energy Usage';

        const reportData = {
          displayName: assessmentData?.lifestyle?.displayName || '',
          score: score.score,
          ecoLevel: ecoLevelName,
          ecoBadge: ecoLevelBadge,
          totalEmissions: score.totalEmissions,
          contributions: score.contributions,
          topStrength,
          improvementArea
        };

        const res = await fetch('/api/share/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        });
        
        if (!res.ok) throw new Error('Failed to sign report');
        
        const { token } = await res.json();
        if (isMounted) {
          setShareUrl(`${window.location.origin}/shared-report?data=${token}`);
        }
      } catch (err) {
        console.error('Error generating share link:', err);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    }
    
    generateToken();
    return () => { isMounted = false; };
  }, [score, ecoLevelName, ecoLevelBadge, assessmentData]);

  const handleShare = async () => {
    if (!shareUrl) return;

    const displayName = assessmentData?.lifestyle?.displayName;
    const text = displayName
      ? `Check out ${displayName}'s carbon footprint on Sylen! Their Sustainability Score is ${score.score}/100 and they are a ${ecoLevelName}.`
      : `I just checked my carbon footprint on Sylen! My Sustainability Score is ${score.score}/100 and I'm a ${ecoLevelName}.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Sylen Score',
          text,
          url: shareUrl,
        });
        if (onShared) onShared();
      } else {
        await navigator.clipboard.writeText(`${text} ${shareUrl}`);
        setCopied(true);
        if (onShared) onShared();
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
        // Fallback to clipboard if share throws
        try {
          await navigator.clipboard.writeText(`${text} ${shareUrl}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackErr) {
          console.error('Clipboard fallback failed:', fallbackErr);
        }
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isGenerating}
      className={`inline-flex items-center gap-2 px-5 py-3 min-h-[56px] rounded-xl shadow-sm transition-all text-sm font-medium whitespace-nowrap active:scale-[0.98] ${
        isGenerating ? 'bg-stone-200 text-stone-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : isGenerating ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share My Sustainability Report
        </>
      )}
    </button>
  );
}
