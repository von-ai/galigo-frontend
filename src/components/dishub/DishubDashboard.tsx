// src/components/dishub/DishubDashboard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { KpiCard } from './KpiCard';
import { SummaryCard } from './SummaryCard';
import type {
  InsightsStats,
  AiSummary,
} from '@/lib/types';

export function DishubDashboard({
  corridorSlug,
  initialStats,
  initialSummary,
}: {
  corridorSlug: string;
  initialStats: InsightsStats | null;
  initialSummary: AiSummary;
}) {
  const router = useRouter();

  async function handleLogout() {
    await api.logout();
    router.push('/dishub/login');
    router.refresh();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-dash-ink">
            Ruang Dishub
          </h1>
          <p className="text-xs text-dash-ink-2">
            Maros – Pangkep – Barru
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-pill border border-dash-line px-4 py-2 text-sm text-dash-ink-2 hover:text-dash-ink"
        >
          Keluar
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <KpiCard
          label="Stasiun & Halte"
          value={
            initialStats?.stationCount ?? '–'
          }
        />
        <KpiCard
          label="Tempat terdata"
          value={initialStats?.poiCount ?? '–'}
        />
        <KpiCard
          label="Estimasi belum tersurvei"
          value={
            initialStats?.unsurveyedCount ?? '–'
          }
        />
      </div>

      <SummaryCard
        corridorSlug={corridorSlug}
        initialSummary={initialSummary}
      />
    </div>
  );
}
