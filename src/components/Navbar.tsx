'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { navigate } from '@/lib/navigate';
import { useUser, useStreak, useXp } from '@/hooks/useStore';
import { useTheme } from '@/hooks/useTheme';
import { notifications } from '@/lib/mockData';
import type { Notification } from '@/types';

const navItems = [
  { hash: 'dashboard', label: 'Dashboard' },
  { hash: 'explore', label: 'Explore' },
];

export default function Navbar() {
  const user = useUser();
  const [streak] = useStreak();
  const [xp] = useXp();
  const { theme, toggle } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifList] = useState<Notification[]>(notifications);
  const [hash, setHash] = useState('');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash.replace(/^#\/?/, ''));
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('mousedown', (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    });
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (hash === '' || hash === 'onboarding') return null;

  const unread = notifList.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]"
          >
            <span className="text-[#3fb950]">LS</span> LEARN
          </button>
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <button
                key={item.hash}
                onClick={() => navigate(item.hash)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  hash.startsWith(item.hash)
                    ? 'bg-[var(--hover-bg)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-[#d29922]">🔥 {streak}-Day Streak</span>
            <span className="text-sm text-[#3fb950]">⚡ {xp} XP</span>
          </div>

          <button
            onClick={toggle}
            className="rounded-md p-2 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative rounded-md p-2 text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
              aria-label="Notifications"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#da3633] text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-2 shadow-xl"
                >
                  <div className="mb-1 px-2 py-1 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Notifications
                  </div>
                  {notifList.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--hover-bg)] ${
                        !n.read ? 'border-l-2 border-[#3fb950]' : ''
                      }`}
                    >
                      <p className="text-[var(--text-primary)]">{n.message}</p>
                      <span className="mt-0.5 text-xs text-[var(--text-secondary)]">{n.created_at}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => navigate('profile')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3fb950] text-xs font-bold text-white transition-transform hover:scale-105"
          >
            {user.username.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
}
