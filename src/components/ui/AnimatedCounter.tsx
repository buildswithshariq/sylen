'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimatedCounterProps {
  /** Target value to animate to */
  value: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Suffix appended after the number (e.g. 'kg', '%') */
  suffix?: string;
  /** Prefix prepended before the number (e.g. '$') */
  prefix?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Extra Tailwind classes */
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const animate = useCallback(
    function animateFrame(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = easedProgress * value;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateFrame);
      }
    },
    [value, duration],
  );

  useEffect(() => {
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate]);

  const formatted = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}
