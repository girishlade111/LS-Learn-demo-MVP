'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function ConfettiCannon() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#238636', '#3fb950', '#d29922', '#58a6ff', '#bc8cff'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5, x: 0.3 },
        colors: ['#238636', '#3fb950'],
      });
    }, 150);
  }, []);

  return null;
}
