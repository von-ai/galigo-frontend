'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DishubProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<
    'checking' | 'ok'
  >('checking');

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then(() => {
        if (!cancelled) setStatus('ok');
      })
      .catch(() => {
        if (!cancelled)
          router.replace('/dishub/login');
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dash-page text-sm text-dash-ink-2">
        Memeriksa sesi…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dash-page text-dash-ink">
      {children}
    </div>
  );
}
