'use client';

import { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardSkeleton } from './Skeleton';

const LandingPage = lazy(() => import('@/views/LandingPage'));
const OnboardingFlow = lazy(() => import('@/views/OnboardingFlow'));
const Dashboard = lazy(() => import('@/views/Dashboard'));
const Explore = lazy(() => import('@/views/Explore'));
const WorkspaceSolver = lazy(() => import('@/views/WorkspaceSolver'));
const ProfileView = lazy(() => import('@/views/ProfileView'));
const ReferralClaim = lazy(() => import('@/views/ReferralClaim'));

type RouteInfo = { route: string; params: Record<string, string> };

function parseHash(): RouteInfo {
  if (typeof window === 'undefined') return { route: '/', params: {} };
  const hash = window.location.hash.replace(/^#\/?/, '') || '';
  const parts = hash.split('/').filter(Boolean);
  if (parts.length === 0) return { route: '/', params: {} };
  if (parts[0] === 'onboarding') return { route: '/onboarding', params: {} };
  if (parts[0] === 'dashboard') return { route: '/dashboard', params: {} };
  if (parts[0] === 'explore') return { route: '/explore', params: {} };
  if (parts[0] === 'question' && parts[1]) return { route: '/question', params: { slug: parts[1] } };
  if (parts[0] === 'profile') return { route: '/profile', params: {} };
  if (parts[0] === 'join' && parts[1]) return { route: '/join', params: { code: parts[1] } };
  return { route: '/', params: {} };
}

export function useHashRoute(): RouteInfo {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>({ route: '/', params: {} });
  useEffect(() => {
    const onHashChange = () => setRouteInfo(parseHash());
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return routeInfo;
}

export default function HashRouter() {
  const routeInfo = useHashRoute();

  const page = useMemo(() => {
    const slug = routeInfo.params.slug || '';
    const code = routeInfo.params.code || '';
    switch (routeInfo.route) {
      case '/': return { component: <LandingPage />, key: 'landing' };
      case '/onboarding': return { component: <OnboardingFlow />, key: 'onboarding' };
      case '/dashboard': return { component: <Dashboard />, key: 'dashboard' };
      case '/explore': return { component: <Explore />, key: 'explore' };
      case '/question': return { component: <WorkspaceSolver slug={slug} />, key: 'question' };
      case '/profile': return { component: <ProfileView />, key: 'profile' };
      case '/join': return { component: <ReferralClaim code={code} />, key: 'join' };
      default: return { component: <LandingPage />, key: 'landing' };
    }
  }, [routeInfo]);

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]"><DashboardSkeleton /></div>}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {page.component}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}
