'use client';

import { HeatmapDay } from '@/types';

export default function HeatmapGrid({ data }: { data: HeatmapDay[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-[var(--bg-tertiary)]/40';
    const intensity = count / maxCount;
    if (intensity < 0.25) return 'bg-[var(--color-accent-green)]/20';
    if (intensity < 0.5) return 'bg-[var(--color-accent-green)]/40';
    if (intensity < 0.75) return 'bg-[var(--color-accent-green)]/60';
    return 'bg-[var(--color-accent-green)]';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[2px]">
        {data.slice(-84).map((day, i) => (
          <div
            key={day.date}
            className={`h-3 w-3 rounded-sm ${getColor(day.count)}`}
            title={`${day.date}: ${day.count} solves`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-[var(--text-secondary)]">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((v) => (
          <div
            key={v}
            className={`h-2.5 w-2.5 rounded-sm ${
              v === 0
                ? 'bg-[var(--bg-tertiary)]/40'
                : v < 3
                ? 'bg-[var(--color-accent-green)]/30'
                : 'bg-[var(--color-accent-green)]/60'
            }`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
