'use client';

import { useEffect, useState } from 'react';
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
}: {
  corridorSlug: string;
}) {
  const router = useRouter();
  const [stats, setStats] =
    useState<InsightsStats | null>(null);
  const [summary, setSummary] =
    useState<AiSummary>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.insightsStats(),
      api.insightsSummary(corridorSlug),
    ])
      .then(([s, sum]) => {
        if (cancelled) return;
        setStats(s);
        setSummary(sum);
      })
      .catch((err) =>
        console.error(
          'Gagal ambil data dashboard:',
          err,
        ),
      )
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [corridorSlug]);

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

      {loading ? (
        <p className="mt-6 text-sm text-dash-ink-2">
          Memuat data…
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <KpiCard
              label="Stasiun & Halte"
              value={stats?.stationCount ?? '–'}
            />
            <KpiCard
              label="Tempat terdata"
              value={stats?.poiCount ?? '–'}
            />
            <KpiCard
              label="Estimasi belum tersurvei"
              value={
                stats?.unsurveyedCount ?? '–'
              }
            />
          </div>
          <SummaryCard
            corridorSlug={corridorSlug}
            initialSummary={summary}
          />
        </>
      )}
    </div>
  );
}
