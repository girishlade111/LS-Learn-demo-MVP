'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { navigate } from '@/lib/navigate';
import { useUser, useXp, useStreak, useSolved, useHeatmap, useLiveSolves, useReferral } from '@/hooks/useStore';
import { questions } from '@/lib/mockData';
import HeatmapGrid from '@/components/HeatmapGrid';
import LiveFeed from '@/components/LiveFeed';

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

export default function Dashboard() {
  const user = useUser();
  const [xp] = useXp();
  const [streak] = useStreak();
  const [solved] = useSolved();
  const heatmap = useHeatmap();
  const liveSolves = useLiveSolves();
  const [referral] = useReferral();

  const lastUnsolved = questions.find((q) => !solved.find((s) => s.slug === q.slug));

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      {/* Header */}
      <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={0}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back, {user.display_name}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {user.avatar_url || `@${user.username}`}
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={1} className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total XP', value: xp, color: 'text-[#3fb950]' },
          { label: 'Day Streak', value: streak, color: 'text-[#d29922]' },
          { label: 'Solved', value: solved.length, color: 'text-[#58a6ff]' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
            <div className="text-xs text-[var(--text-secondary)]">{s.label}</div>
            <div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Resume progress + Daily challenge */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={2}>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Resume Progress</h2>
            {lastUnsolved ? (
              <button
                onClick={() => navigate(`question/${lastUnsolved.slug}`)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-left transition hover:border-[#58a6ff]"
              >
                <div className="text-sm font-medium text-[var(--text-primary)]">{lastUnsolved.title}</div>
                <div className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {lastUnsolved.difficulty} · +{lastUnsolved.xp_reward} XP
                </div>
              </button>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">All done! New challenges coming.</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={3}>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
            <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Daily Challenge</h2>
            {questions.length > 0 && (
              <button
                onClick={() => navigate(`question/${questions[0].slug}`)}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-left transition hover:border-[#3fb950]"
              >
                <div className="text-sm font-medium text-[var(--text-primary)]">{questions[0].title}</div>
                <div className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {questions[0].topics.slice(0, 2).join(', ')} · +{questions[0].xp_reward} XP
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Coach Sandbox */}
      <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={4}>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <h2 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">AI Coach Sandbox</h2>
          <div className="rounded-lg bg-[var(--bg-primary)] p-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#3fb950]" />
              AI Coach is coming soon. Ask questions, get hints, and practice interactively.
            </div>
            <div className="mt-3 h-20 rounded-lg border border-dashed border-[var(--border-color)] p-3 text-xs text-[var(--text-secondary)]">
              Your conversation will appear here...
            </div>
          </div>
        </div>
      </motion.div>

      {/* Referrals panel */}
      <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={5}>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Referrals</h2>
          <div className="flex items-center justify-between rounded-lg bg-[var(--bg-primary)] px-4 py-3">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Your code</div>
              <div className="text-sm font-mono font-bold text-[#58a6ff]">{referral.code}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--text-secondary)]">Invites</div>
              <div className="text-sm font-bold text-[var(--text-primary)]">{referral.successful_invites.length}</div>
            </div>
          </div>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Share your code: friends get 50 XP each, and so do you!
          </p>
        </div>
      </motion.div>

      {/* Heatmap */}
      <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={6}>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Activity</h2>
          <HeatmapGrid data={heatmap} />
        </div>
      </motion.div>

      {/* Live feed */}
      <motion.div variants={sectionVariant} initial="hidden" animate="visible" custom={7}>
        <LiveFeed solves={liveSolves} />
      </motion.div>
    </div>
  );
}
