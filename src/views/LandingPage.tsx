'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { navigate } from '@/lib/navigate';
import AuroraSectionHero from '@/components/ui/aurora-section-hero';

/* ------------------------------------------------------------------------- */
/* Animated counter — fires once when scrolled into view                     */
/* ------------------------------------------------------------------------- */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1200;
    const step = 16;
    const inc = end / (dur / step);
    const t = setInterval(() => {
      start += inc;
      if (start >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.round(start));
    }, step);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ------------------------------------------------------------------------- */
/* Section header helper                                                     */
/* ------------------------------------------------------------------------- */
function SectionHeader({ label, title, desc }: { label: string; title: string; desc: string }) {
  return (
    <div className="mb-14 text-center">
      <span className="mb-3 inline-block rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
        {label}
      </span>
      <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-balance text-base leading-relaxed text-[var(--text-secondary)]">
        {desc}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Staggered fade-up wrapper                                                 */
/* ------------------------------------------------------------------------- */
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------------- */
/* Features data                                                             */
/* ------------------------------------------------------------------------- */
const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Daily Challenges',
    desc: 'Fresh problems every day across JS, TS, React, Python, System Design, and more. Build consistency with bite-sized practice.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Smart Timer',
    desc: 'Built-in countdown keeps you focused. Track solve velocity and watch your speed improve over time.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'XP & Streaks',
    desc: 'Earn XP for every solve and build streaks to unlock achievements. Leaderboards keep the competition healthy.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'AI Coach',
    desc: 'Get contextual hints when you are stuck. Our AI coach adapts to your level and never gives away the full answer.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Community',
    desc: 'Discuss solutions, share approaches, and learn from peers. Real-time solve feed shows what others are working on.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'Multi-Format',
    desc: 'MCQs, coding problems, theory deep-dives, and full project prompts — four formats to cover every skill dimension.',
  },
];

/* ------------------------------------------------------------------------- */
/* Steps data                                                                */
/* ------------------------------------------------------------------------- */
const steps = [
  { num: '01', title: 'Set Your Goal', desc: 'Tell us your skill level and what you want to achieve. We build a personalized track for you.' },
  { num: '02', title: 'Solve Daily', desc: 'Tackle curated challenges with a built-in timer. Earn XP, maintain your streak, and level up.' },
  { num: '03', title: 'Grow & Compete', desc: 'Climb leaderboards, unlock achievements, refer friends, and prove your mastery in real-world skills.' },
];

/* ------------------------------------------------------------------------- */
/* Trust logos — simple placeholder pill set                                 */
/* ------------------------------------------------------------------------- */
const trustLogos = ['Vercel', 'Stripe', 'Auth0', 'Supabase', 'PlanetScale', 'Railway'];

/* ------------------------------------------------------------------------- */
/* Landing Page                                                              */
/* ------------------------------------------------------------------------- */
export default function LandingPage() {
  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden border-b border-[var(--border-color)] bg-[var(--bg-color)]">
        <AuroraSectionHero beamCount={60} />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">

          {/* Enterprise badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3fb950]" />
            </span>
            Free developer skill challenges &mdash; 100+ problems live
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="max-w-4xl text-balance text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--text-primary)]"
          >
            Level Up Your{' '}
            <span className="bg-gradient-to-r from-[#58a6ff] via-[#3fb950] to-[#58a6ff] bg-clip-text text-transparent">
              Engineering Skills
            </span>
            <br />
            One Challenge at a Time
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-[17px]"
          >
            Master JavaScript, TypeScript, React, Python, System Design, and more.
            Daily challenges, curated roadmaps, smart timer, and a community of
            engineers who push each other forward.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => navigate('onboarding')}
              className="group relative rounded-xl bg-[#238636] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] active:scale-[0.97]"
            >
              <span className="relative z-10">Get Started — It&apos;s Free</span>
              <span className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity group-hover:opacity-10" />
            </button>
            <button
              onClick={() => navigate('explore')}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-all hover:bg-[var(--hover-bg)] active:scale-[0.97]"
            >
              Browse Challenges
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-4"
          >
            {[
              { end: 103, label: 'Challenges', suffix: '+' },
              { end: 10, label: 'Topics', suffix: '+' },
              { end: 2400, label: 'XP Available', suffix: '+' },
              { end: 7, label: 'Day Streaks', suffix: 'd' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[28px] font-bold leading-none tracking-tight text-[var(--text-primary)] sm:text-[34px]">
                  <Counter end={s.end} suffix={s.suffix} />
                </div>
                <div className="mt-1.5 text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Preview widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-14 w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 text-left shadow-lg shadow-black/5"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#f0883e]" />
              Today&apos;s Challenge Preview
            </div>
            <div className="space-y-2.5">
              {[
                { title: 'Event Loop Deep Dive', xp: 30, diff: 'Intermediate' },
                { title: 'React useEffect Cleanup', xp: 25, diff: 'Beginner' },
                { title: 'Design a Rate Limiter', xp: 50, diff: 'Advanced' },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 transition-colors hover:bg-[var(--hover-bg)]"
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">{c.title}</div>
                    <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{c.diff}</div>
                  </div>
                  <div className="whitespace-nowrap rounded-md bg-[#238636]/10 px-2.5 py-1 text-[11px] font-semibold text-[#3fb950]">
                    +{c.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.svg
            className="h-5 w-5 text-[var(--text-secondary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────────────────────────────── */}
      <FadeUp>
        <section className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-10">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-secondary)]">
              Trusted by engineers from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustLogos.map((name) => (
                <span
                  key={name}
                  className="text-sm font-semibold tracking-tight text-[var(--text-secondary)] opacity-60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ─── FEATURES ──────────────────────────────────────────────────── */}
      <section className="bg-[var(--bg-primary)] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp>
            <SectionHeader
              label="Features"
              title="Everything You Need to Level Up"
              desc="Built for engineers who want structured practice, real feedback, and the motivation to keep going."
            />
          </FadeUp>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.06}>
                <div className="group rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--text-secondary)]/30 hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[#58a6ff] transition-colors group-hover:border-[#58a6ff]/30 group-hover:bg-[#58a6ff]/5">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <SectionHeader
              label="How It Works"
              title="Three Steps to Mastery"
              desc="No fluff. Just a repeatable system that turns daily practice into real skill growth."
            />
          </FadeUp>
          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting line (desktop) */}
            <div className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-[#58a6ff]/40 via-[#3fb950]/40 to-[#58a6ff]/40 md:block" />

            {steps.map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-sm font-bold text-[#58a6ff] shadow-sm">
                    {s.num}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
                    {s.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM HIGHLIGHTS ────────────────────────────────────────── */}
      <FadeUp>
        <section className="bg-[var(--bg-primary)] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeader
              label="Why LS Learn"
              title="Built for Engineers, Designed for Growth"
              desc="Every detail — from daily challenges to smart reviews — is crafted to keep you in flow and moving forward."
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  gradient: 'from-sky-500/20 via-transparent to-transparent',
                  icon: (
                    <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ),
                  title: 'Smart Spaced Repetition',
                  desc: 'Our review engine schedules the right problem at the right time — so concepts stick long after your first solve.',
                },
                {
                  gradient: 'from-emerald-500/20 via-transparent to-transparent',
                  icon: (
                    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                  title: 'Active Recall Engine',
                  desc: 'No passive videos. Every challenge forces you to retrieve, apply, and strengthen your mental models in real time.',
                },
                {
                  gradient: 'from-violet-500/20 via-transparent to-transparent',
                  icon: (
                    <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                  ),
                  title: 'Progress Analytics',
                  desc: 'Track streaks, XP growth, topic mastery, and problem-solving velocity — all in a clean, actionable dashboard.',
                },
                {
                  gradient: 'from-amber-500/20 via-transparent to-transparent',
                  icon: (
                    <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  ),
                  title: 'Multi-Format Challenges',
                  desc: 'Code, multiple choice, fill-in-the-blank, and system design — each format exercises a different cognitive muscle.',
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -3 }}
                  className="group relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 transition-shadow duration-300 hover:shadow-lg sm:p-8"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ─── STATS BANNER ──────────────────────────────────────────────── */}
      <FadeUp>
        <section className="bg-[var(--bg-primary)] py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] px-8 py-14 shadow-sm">
              <span className="mb-4 inline-block rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Platform Stats
          </span>
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-8">
            {[
              { end: 103, label: 'Challenges', suffix: '+' },
              { end: 10, label: 'Topics', suffix: '+' },
              { end: 2400, label: 'Total XP', suffix: '+' },
              { end: 4, label: 'Formats', suffix: '' },
            ].map((s) => (
              <div key={s.label}>
                    <div className="text-[32px] font-bold leading-none tracking-tight text-[var(--text-primary)] sm:text-[40px]">
                  <Counter end={s.end} suffix={s.suffix} />
                </div>
                    <div className="mt-1.5 text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
          </div>
        </section>
      </FadeUp>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--bg-primary)] py-28">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, #3fb950 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <FadeUp>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Ready to Level Up?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-balance text-base leading-relaxed text-[var(--text-secondary)]">
              Join thousands of engineers who sharpen their skills daily. No
              credit card required — just bring your curiosity.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('onboarding')}
                className="group relative rounded-xl bg-[#238636] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#238636]/20 transition-all hover:bg-[#2ea043] hover:shadow-[#238636]/30 active:scale-[0.97]"
              >
                Start Building — Free
                <span className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity group-hover:opacity-10" />
              </button>
              <button
                onClick={() => navigate('explore')}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-8 py-3.5 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-all hover:bg-[var(--hover-bg)] active:scale-[0.97]"
              >
                See All Challenges
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        {/* Newsletter */}
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-8 sm:flex-row sm:items-center">
            <div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Stay in the loop
              </span>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Get weekly challenges, tips, and community highlights.
              </p>
            </div>
            <div className="flex w-full max-w-sm gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none transition-colors focus:border-[#3fb950]/50"
              />
              <button className="rounded-xl bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] active:scale-[0.97]">
                Subscribe
              </button>
            </div>
          </div>

          {/* Link grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
            {/* Brand */}
            <div className="lg:col-span-2">
              <span className="bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-lg font-bold tracking-tight text-transparent">
                LS Learn
              </span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
                Daily developer challenges to sharpen your engineering skills.
                Built for engineers who never stop learning.
              </p>
              {/* Social */}
              <div className="mt-5 flex gap-3">
                {[
                  { label: 'X', path: 'M7.5 2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM0 7.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H.75A.75.75 0 010 7.5z' },
                  { label: 'GH', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' },
                  { label: 'LI', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                ].map((s) => (
                  <span
                    key={s.label}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] transition-colors hover:bg-[var(--hover-bg)]"
                  >
                    <svg className="h-4 w-4 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d={s.path} />
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            {/* Link groups */}
            {[
              { title: 'Product', links: ['Challenges', 'Leaderboard', 'Pricing', 'FAQ'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Resources', links: ['Docs', 'API', 'Community', 'Status'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Licenses'] },
            ].map((col) => (
              <div key={col.title}>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                  {col.title}
                </span>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="cursor-pointer text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] py-5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-[var(--text-secondary)] sm:flex-row">
            <span>&copy; {new Date().getFullYear()} LS Learn. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="cursor-pointer transition-colors hover:text-[var(--text-primary)]">Privacy Policy</span>
              <span className="cursor-pointer transition-colors hover:text-[var(--text-primary)]">Terms of Service</span>
              <span className="cursor-pointer transition-colors hover:text-[var(--text-primary)]">Cookie Settings</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
