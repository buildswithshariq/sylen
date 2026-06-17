'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface ScoreRingProps {
  /** Score value 0–100 */
  score: number;
  /** Diameter of the ring in pixels */
  size?: number;
  /** Ring stroke width */
  strokeWidth?: number;
  /** Category label rendered below score */
  label?: string;
  /** Extra Tailwind classes */
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#16a34a'; // green-700
  if (score >= 60) return '#65a30d'; // lime-600
  if (score >= 40) return '#ca8a04'; // yellow-600
  return '#dc2626'; // red-600
}

function getScoreTrackColor(score: number): string {
  if (score >= 80) return 'rgba(22, 163, 74, 0.12)';
  if (score >= 60) return 'rgba(101, 163, 13, 0.12)';
  if (score >= 40) return 'rgba(202, 138, 4, 0.12)';
  return 'rgba(220, 38, 38, 0.12)';
}

export default function ScoreRing({
  score,
  size = 200,
  strokeWidth = 12,
  label,
  className = '',
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference * (1 - clampedScore / 100);
  const color = getScoreColor(clampedScore);
  const trackColor = getScoreTrackColor(clampedScore);

  return (
    <div
      className={`flex flex-col items-center gap-2 ${className}`}
      role="img"
      aria-label={`Sustainability score: ${clampedScore} out of 100${label ? `, ${label}` : ''}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1.8,
              ease: [0.33, 1, 0.68, 1], // easeOutCubic
              delay: 0.2,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedCounter
            value={clampedScore}
            duration={2000}
            className="text-4xl font-bold tracking-tight text-stone-800"
          />
          <span className="mt-0.5 text-xs font-medium tracking-wider text-stone-400 uppercase">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
