'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import Navbar from './Navbar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
    </ThemeProvider>
  );
}
