'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from '@/lib/navigate';
import { useUpdateProfile, useOnboarding } from '@/hooks/useStore';
import { ConfettiCannon } from '@/components/Confetti';
import type { SkillOption, GoalOption } from '@/types';

const WAIT_MS = 400;
const takenNames = ['admin', 'user', 'test', 'root', 'demo'];

const skillOptions: SkillOption[] = [
  { id: 'beginner', label: 'Beginner', level: 'beginner' },
  { id: 'intermediate', label: 'Intermediate', level: 'intermediate' },
  { id: 'advanced', label: 'Advanced', level: 'advanced' },
];

const goalOptions: GoalOption[] = [
  { id: 'career', title: 'Career Growth', description: 'Land a better dev job', icon: '💼' },
  { id: 'skill', title: 'Skill Mastery', description: 'Deep-dive into a topic', icon: '🧠' },
  { id: 'interview', title: 'Interview Prep', description: 'Ace coding interviews', icon: '🎯' },
  { id: 'fun', title: 'Just for Fun', description: 'Learn something new daily', icon: '🚀' },
];

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export default function OnboardingFlow() {
  const [, setOnboardingComplete] = useOnboarding();
  const updateProfile = useUpdateProfile();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const checkUsername = useCallback(
    debounce((val: string) => {
      if (val.length < 3) { setUsernameAvailable(null); setChecking(false); return; }
      setChecking(true);
      setTimeout(() => {
        setUsernameAvailable(!takenNames.includes(val.toLowerCase()));
        setChecking(false);
      }, WAIT_MS);
    }, 300),
    [],
  );

  useEffect(() => {
    if (username.length >= 3) checkUsername(username);
    else setUsernameAvailable(null);
  }, [username, checkUsername]);

  const canNext = step === 0
    ? username.length >= 3 && usernameAvailable === true
    : step === 1
      ? !!skillLevel
      : step === 2
        ? !!goal
        : true;

  const handleFinish = () => {
    updateProfile({ username, display_name: username });
    setOnboardingComplete();
    setShowConfetti(true);
    setTimeout(() => navigate('dashboard'), 1200);
  };

  const borderColor = (level: string) => {
    if (level === 'beginner') return 'border-[#3fb950]';
    if (level === 'intermediate') return 'border-[#d29922]';
    return 'border-[#f85149]';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <AnimatePresence mode="wait">
        {showConfetti && <ConfettiCannon />}
      </AnimatePresence>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg"
      >
        {/* Progress dots */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-[#58a6ff]'
                  : s < step
                    ? 'w-2 bg-[#3fb950]'
                    : 'w-2 bg-[var(--border-color)]'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome! Choose your username</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">This will be your public profile handle.</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#58a6ff]"
                autoFocus
              />
              {username.length >= 3 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                  {checking ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-[#58a6ff]" />
                  ) : usernameAvailable ? (
                    <span className="text-[#3fb950]">✓</span>
                  ) : (
                    <span className="text-[#f85149]">✕</span>
                  )}
                </span>
              )}
            </div>
            {usernameAvailable === false && (
              <p className="text-xs text-[#f85149]">Username taken. Try another.</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">What&apos;s your skill level?</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">We&apos;ll tailor challenges to you.</p>
            </div>
            <div className="grid gap-4">
              {skillOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSkillLevel(opt.id)}
                  className={`rounded-xl border-2 px-5 py-4 text-left transition-all ${
                    skillLevel === opt.id
                      ? `${borderColor(opt.level)} bg-[var(--card-bg)] shadow-md`
                      : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <div className="font-semibold text-[var(--text-primary)]">{opt.label}</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {opt.id === 'beginner' ? 'New to coding or switching stacks' : opt.id === 'intermediate' ? 'Comfortable building projects' : 'Experienced and looking for depth'}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">What&apos;s your goal?</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Choose what drives you.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {goalOptions.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setGoal(opt.id)}
                  className={`rounded-xl border-2 p-5 text-left transition-all ${
                    goal === opt.id
                      ? 'border-[#58a6ff] bg-[var(--card-bg)] shadow-md'
                      : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <div className="mb-1 text-2xl">{opt.icon}</div>
                  <div className="font-semibold text-[var(--text-primary)]">{opt.title}</div>
                  <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{opt.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => step === 0 ? navigate('') : setStep((s) => s - 1)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            {step === 0 ? 'Back to Home' : 'Back'}
          </button>
          {step < 2 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl bg-[#238636] px-6 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-[#2ea043] disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              disabled={!canNext}
              onClick={handleFinish}
              className="rounded-xl bg-[#238636] px-6 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-[#2ea043] disabled:opacity-40"
            >
              Start Learning
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
