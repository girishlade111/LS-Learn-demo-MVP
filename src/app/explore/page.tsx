'use client';

import { useEffect } from 'react';

export default function ExploreRedirect() {
  useEffect(() => {
    window.location.replace('/#/explore');
  }, []);
  return null;
}
