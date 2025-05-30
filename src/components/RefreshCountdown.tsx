'use client';

import { useEffect, useState, useRef } from 'react';

interface RefreshCountdownProps {
  interval: number;
  onRefresh: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CONFIG = {
  sm: {
    svg: 32,
    radius: 12,
    strokeWidth: 2,
  },
  md: {
    svg: 48,
    radius: 18,
    strokeWidth: 3,
  },
  lg: {
    svg: 64,
    radius: 24,
    strokeWidth: 4,
  },
} as const;

export default function RefreshCountdown({
  interval,
  onRefresh,
  size = 'md'
}: RefreshCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(interval);
  const animationFrameId = useRef<number | undefined>(undefined);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const elapsed = now - startTime.current;
      const remaining = Math.max(0, interval - elapsed);

      setTimeLeft(remaining);

      if (remaining <= 0) {
        startTime.current = now;
        onRefresh();
      }

      animationFrameId.current = requestAnimationFrame(updateTime);
    };

    startTime.current = Date.now();
    animationFrameId.current = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [interval, onRefresh]);

  const { svg, radius, strokeWidth } = SIZE_CONFIG[size];
  const progress = (timeLeft / interval) * 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = svg / 2;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <svg width={svg} height={svg} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-100 ease-linear"
        />
      </svg>
    </div>
  );
}
