'use client';

import dynamic from 'next/dynamic';
const GaligoMap = dynamic(
  () => import('./GaligoMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-page text-sm text-ink-500">
        Memuat peta…
      </div>
    ),
  },
);

export default function GaligoMapLoader() {
  return <GaligoMap />;
}
