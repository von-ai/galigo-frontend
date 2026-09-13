'use client';

import { BottomNav } from './BottomNav';

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-page pb-16">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
