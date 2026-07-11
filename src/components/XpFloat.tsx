'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface XpFloatProps {
  amount: number;
}

export function XpFloat({ amount }: XpFloatProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -80, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute text-2xl font-bold text-[#3fb950] drop-shadow-lg"
          >
            +{amount} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
