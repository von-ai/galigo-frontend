// src/components/map/StatsSheet.tsx
'use client';

import type {
  Station,
  StationSummary,
} from '@/lib/types';

// Data demografi ini dikutip dari BPS 2023 (sama seperti di proposal awal) —
// bukan hasil hitung live, karena kita belum punya tabel kependudukan.
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
        label: 'Belum ada feeder tersedia',
        tone: 'warn',
      };
}

export function StatsSheet({
  stations,
  summary,
  onClose,
}: {
  stations: Station[];
  summary: StationSummary | null;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-1000 max-h-[65vh] overflow-y-auto rounded-t-card bg-card p-5 shadow-3">
      <div className="mx-auto mb-3 h-1 w-10 rounded-pill bg-line-strong" />

      <h2 className="text-sm font-semibold text-ink-900">
        Statistik Wilayah
      </h2>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-card bg-grad-brand p-3 text-white">
          <div className="text-lg font-bold">
            {summary?.stationCount ?? '–'}
          </div>
          <div className="text-xs text-white/80">
            Stasiun
          </div>
        </div>
        <div className="rounded-card bg-grad-brand p-3 text-white">
          <div className="text-lg font-bold">
            {summary?.peteRouteCount ?? '–'}
          </div>
          <div className="text-xs text-white/80">
            Trayek Pete-Pete
          </div>
        </div>
        <div className="rounded-card bg-grad-brand p-3 text-white">
          <div className="text-lg font-bold">
            {POPULATION_LABEL}
          </div>
          <div className="text-xs text-white/80">
            {POPULATION_SUBLABEL}
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-sm font-semibold text-ink-900">
        Titik Terpantau
      </h3>
      <ul className="mt-2 divide-y divide-line">
        {stations.map((s) => {
          const status = stationStatus(s);
          return (
            <li
              key={s.id}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm2 bg-brand-600 text-xs font-bold text-white">
                {s.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink-900">
                  {s.name}
                </div>
                <div className="truncate text-xs text-ink-500">
                  {s.poi_count > 0
                    ? `${s.poi_count} tempat sekitar`
                    : 'Belum ada data sekitar'}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-pill px-2 py-1 text-xs font-medium ${
                  status.tone === 'ok'
                    ? 'bg-ok-bg text-ok'
                    : 'bg-warn-bg text-warn'
                }`}
              >
                {status.label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* "Buka Eksplorasi Titik" sengaja dinonaktifkan — layar itu ditunda dulu */}
      <button
        disabled
        title="Segera hadir"
        className="mt-4 w-full rounded-pill border border-brand-600 py-3 text-sm font-semibold text-brand-600 opacity-50"
      >
        Buka Eksplorasi Titik
      </button>

      <button
        onClick={onClose}
        className="mt-2 w-full text-center text-xs text-ink-300"
      >
        Tutup
      </button>
    </div>
  );
}
