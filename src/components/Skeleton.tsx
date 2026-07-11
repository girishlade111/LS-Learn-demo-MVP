'use client';

export function CardSkeleton() {
  return (
    <div className="animate-skeleton rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
      <div className="mb-3 h-3 w-16 rounded bg-[var(--hover-bg)]" />
      <div className="mb-2 h-4 w-3/4 rounded bg-[var(--hover-bg)]" />
      <div className="mb-4 h-3 w-full rounded bg-[var(--hover-bg)]" />
      <div className="flex gap-2">
        <div className="h-6 w-14 rounded-full bg-[var(--hover-bg)]" />
        <div className="h-6 w-14 rounded-full bg-[var(--hover-bg)]" />
      </div>
    </div>
  );
}

export function QuestionCardSkeleton() {
  return (
    <div className="animate-skeleton rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-[var(--hover-bg)]" />
        <div className="h-5 w-20 rounded-full bg-[var(--hover-bg)]" />
      </div>
      <div className="mb-2 h-5 w-3/4 rounded bg-[var(--hover-bg)]" />
      <div className="mb-4 space-y-1.5">
        <div className="h-3 w-full rounded bg-[var(--hover-bg)]" />
        <div className="h-3 w-5/6 rounded bg-[var(--hover-bg)]" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-[var(--hover-bg)]" />
        <div className="h-4 w-4 rounded bg-[var(--hover-bg)]" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-skeleton space-y-4">
      <div className="h-8 w-64 rounded bg-[var(--hover-bg)]" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
            <div className="mb-2 h-3 w-20 rounded bg-[var(--hover-bg)]" />
            <div className="h-5 w-12 rounded bg-[var(--hover-bg)]" />
          </div>
        ))}
      </div>
      <div className="h-48 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]" />
    </div>
  );
}
