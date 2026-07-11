'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { navigate } from '@/lib/navigate';
import { useReferral, useXp } from '@/hooks/useStore';

interface Props {
  code: string;
}

export default function ReferralClaim({ code }: Props) {
  const [referral, claim] = useReferral();
  const [, addXp] = useXp();
  const [status, setStatus] = useState<'loading' | 'claimed' | 'error'>('loading');

  useEffect(() => {
    if (!code) { setStatus('error'); return; }

    // Simulate code validation
    const t = setTimeout(() => {
      if (code.length < 3) {
        setStatus('error');
        return;
      }

      if (referral.claimed_by_me) {
        setStatus('error');
        return;
      }

      claim();
      setStatus('claimed');
    }, 800);

    return () => clearTimeout(t);
  }, [code, referral.claimed_by_me, claim]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {status === 'loading' && (
          <div>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-color)] border-t-[#58a6ff]" />
            <p className="text-sm text-[var(--text-secondary)]">Validating referral code...</p>
          </div>
        )}

        {status === 'claimed' && (
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3fb950]/20 text-3xl">
              🎉
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">You got 50 XP!</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Referral code <strong className="text-[#58a6ff]">{code}</strong> applied!
            </p>
            <button
              onClick={() => navigate('dashboard')}
              className="mt-6 rounded-xl bg-[#238636] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2ea043]"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f85149]/20 text-3xl">
              ✕
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Invalid or already claimed</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              This referral code could not be applied.
            </p>
            <button
              onClick={() => navigate('dashboard')}
              className="mt-6 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--hover-bg)]"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
