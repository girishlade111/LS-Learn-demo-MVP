'use client';

import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  defaultMinutes?: number;
  onExpire?: () => void;
}

export default function Timer({ defaultMinutes = 15, onExpire }: TimerProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onExpire?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 30 && timeLeft > 0;
  const isExpired = timeLeft === 0;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
      >
        {isRunning ? '⏸' : '▶'}
      </button>
      <span
        className={`font-mono text-sm font-bold ${
          isExpired
            ? 'text-[#da3633]'
            : isWarning
            ? 'text-[#d29922]'
            : 'text-[#3fb950]'
        }`}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
