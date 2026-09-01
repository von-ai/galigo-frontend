'use client';
import dynamic from 'next/dynamic';

// Import the map component dynamically with SSR disabled
const GaligoMap = dynamic(
  () => import('@/components/map/GaligoMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-page text-ink-500">
        Memuat peta...
      </div>
    ),
  },
);

export default function Page() {
  return (
    <main>
      <GaligoMap />
    </main>
  );
}
