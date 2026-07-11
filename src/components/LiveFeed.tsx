'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LiveSolve } from '@/types';

interface Props {
  solves: LiveSolve[];
}

export default function LiveFeed({ solves }: Props) {
  const [items, setItems] = useState(solves);

  useEffect(() => {
    setItems(solves);
  }, [solves]);

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3fb950]" />
        </span>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Live Community Solves</h3>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div
              key={`${item.username}-${item.question_slug}-${i}`}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: item.avatar_url || '#58a6ff' }}
              >
                {item.display_name?.charAt(0).toUpperCase() || item.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-[var(--text-primary)]">
                <strong>{item.display_name || item.username}</strong>
              </span>
              <span className="text-[var(--text-secondary)]">
                solved &apos;{item.question_title}&apos;
              </span>
              <span className="ml-auto shrink-0 text-xs font-semibold text-[#3fb950]">
                +{item.xp_awarded} XP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
