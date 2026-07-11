'use client';

import { useEffect } from 'react';

export default function OnboardingRedirect() {
  useEffect(() => {
    window.location.replace('/#/onboarding');
  }, []);
  return null;
}
