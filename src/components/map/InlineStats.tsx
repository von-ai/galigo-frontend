// src/components/map/InlineStats.tsx
'use client';

import Link from 'next/link';
import type {
  Station,
  StationSummary,
} from '@/lib/types';

const POPULATION_LABEL = '538rb';
const POPULATION_SUBLABEL =
  'Jiwa Pangkep + Barru';

function stationStatus(s: Station): {
  label: string;
  tone: 'ok' | 'warn';
} {
  return s.surveyed_estimate_count > 0
    ? {
        label: 'Aksesibilitas sedang',
        tone: 'ok',
      }
    : {
        label: 'Gap tinggi',
        tone: 'warn',
      };
}

export function InlineStats({
  stations,
  summary,
}: {
  stations: Station[];
  summary: StationSummary | null;
}) {
  return (
    <div className="px-5 pb-8 pt-5">
      {/* ── Section: Statistik Wilayah ── */}
      <div className="flex items-center gap-2 mb-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ink-700">
          <path d="M3 17V8L7 4L11 8V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 17V11L15 7L19 11V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 17H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <h2 className="text-sm font-semibold text-ink-900">
          Statistik Wilayah
        </h2>
      </div>

      {/* KPI cards row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-card bg-brand-600 p-3 text-white">
          <div className="text-2xl font-bold">
            {summary?.stationCount ?? '–'}
          </div>
          <div className="mt-1 text-[11px] leading-tight text-white/80">
            Stasiun & Halte
          </div>
        </div>
        <div className="rounded-card bg-brand-600 p-3 text-white">
          <div className="text-2xl font-bold">
            {summary?.peteRouteCount ?? '–'}
          </div>
          <div className="mt-1 text-[11px] leading-tight text-white/80">
            Trayek Pete-Pete
          </div>
        </div>
        <div className="rounded-card bg-brand-600 p-3 text-white">
          <div className="text-2xl font-bold">
            {POPULATION_LABEL}
          </div>
          <div className="mt-1 text-[11px] leading-tight text-white/80">
            {POPULATION_SUBLABEL}
          </div>
        </div>
      </div>

      {/* Link to full statistics */}
      <Link
        href="/statistik"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-warn hover:underline"
      >
        Lihat statistik & grafik lengkap →
      </Link>

      {/* ── Section: Titik Terpantau ── */}
      <div className="mt-5 mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">
          Titik Terpantau
        </h3>
        <div className="h-px flex-1 ml-3 bg-line" />
      </div>

      <ul className="divide-y divide-line">
        {stations.map((s) => {
          const status = stationStatus(s);
          const initials = s.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return (
            <li
              key={s.id}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm2 bg-brand-600 text-sm font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink-900">
                  {s.name}
                </div>
                <div className="truncate text-xs text-ink-500">
                  {s.poi_count > 0
                    ? `${s.poi_count} UMKM sekitar`
                    : 'Belum ada feeder tersedia'}
                </div>
                <span
                  className={`mt-1 inline-block rounded-pill px-2 py-0.5 text-[10px] font-medium ${
                    status.tone === 'ok'
                      ? 'bg-ok-bg text-ok'
                      : 'bg-warn-bg text-warn'
                  }`}
                >
                  {status.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Buka Eksplorasi Titik button */}
      <Link
        href="/cari"
        className="mt-4 block w-full rounded-pill border-2 border-brand-600 py-3 text-center text-sm font-semibold text-brand-600 hover:bg-brand-50 transition shadow-1"
      >
        Buka Eksplorasi Titik
      </Link>
    </div>
  );
}
